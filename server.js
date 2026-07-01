require('dotenv').config();

// TO FORCE IPv4
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first'); 
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const multer = require('multer');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// ==========================================
// FIREBASE INITIALIZATION 
// ==========================================
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // If running on Render, parse the credentials from the environment variable
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // If running locally, use the JSON file
  serviceAccount = require('./serviceAccountKey.json');
}

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();
const upload = multer({ storage: multer.memoryStorage() });
const Razorpay = require('razorpay');
const crypto = require('crypto');

// The account used to SEND the emails
// IMPORTANT: connection/greeting/socket timeouts are set so that a slow or
// hanging SMTP connection fails fast instead of hanging the request
// indefinitely. Without these, a transient network hiccup (common right
// after a cold start on Render's free tier) can hang for a very long time,
// which is what was leaving the customer's checkout stuck on
// "Processing Order...".
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 10000, // 10s to establish the connection
    greetingTimeout: 10000,   // 10s to receive the SMTP greeting
    socketTimeout: 15000      // 15s of inactivity on the socket
});

// The destination where you want to RECEIVE the emails
const ADMIN_EMAIL = 'aniketkumar5893@gmail.com';

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ [CONFIG WARNING] EMAIL_USER or EMAIL_PASS environment variable is missing. All emails (admin and customer) will fail to send until these are set in Render → Environment.');
}

// Wraps transporter.sendMail with a couple of retries. This exists specifically
// because Render's free-tier instance can have a slow/unready outbound network
// path for the first few seconds right after a cold start (spin-up after
// inactivity), which causes the *first* SMTP attempt to hit connectionTimeout.
// A short retry with backoff absorbs that without making the customer wait,
// since this always runs in the background after the HTTP response is sent.
async function sendMailWithRetry(mailOptions, { retries = 2, delayMs = 3000 } = {}) {
    let lastErr;
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
        try {
            return await transporter.sendMail(mailOptions);
        } catch (err) {
            lastErr = err;
            const isLastAttempt = attempt === retries + 1;
            console.warn(`⚠️ [SEND MAIL ATTEMPT ${attempt}/${retries + 1} FAILED] to ${mailOptions.to}: ${err.message}${isLastAttempt ? '' : ` — retrying in ${delayMs}ms`}`);
            if (!isLastAttempt) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
    }
    throw lastErr;
}

const app = express();
app.use(cors());

// Razorpay webhook endpoint must receive raw request bytes before JSON parsing.
app.post('/api/razorpay-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    const signature = req.headers['x-razorpay-signature'];
    const body = req.body;

    const expected = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex');
    if (expected !== signature) {
        console.warn('⚠️ Invalid webhook signature');
        return res.status(400).send('invalid signature');
    }

    try {
        const payload = JSON.parse(body.toString());
        console.log('Webhook received:', payload.event);
        if (payload.event === 'payment.captured') {
            const payment = payload.payload.payment.entity;
            console.log('Payment captured for order:', payment.order_id);
        }
        res.status(200).send('ok');
    } catch (e) {
        console.error('Webhook processing error:', e.message);
        res.status(500).send('error');
    }
});

// Keep JSON parser for normal routes
app.use(express.json());
// Serve the frontend files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Razorpay client
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

// Create Razorpay order endpoint
app.post('/api/create-payment-order', async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || !Number.isFinite(Number(amount))) return res.status(400).json({ error: 'Invalid amount' });

        const options = {
            amount: Math.round(Number(amount) * 100), // in paise
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`,
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);
        return res.json({ id: order.id, amount: order.amount, currency: order.currency, key: process.env.RAZORPAY_KEY_ID || '' });
    } catch (err) {
        console.error('Error creating Razorpay order:', err.message);
        return res.status(500).json({ error: 'Could not create order' });
    }
});

// Verify payment from client (handler) and save order to Firestore
function isValidEmail(email) {
    return typeof email === 'string' && /\S+@\S+\.\S+/.test(email.trim());
}

function validateOrderData(orderData, { requirePaymentId = true } = {}) {
    if (!orderData || typeof orderData !== 'object') return 'Order data is required';
    if (!orderData.category) return 'Category is required';
    if (!orderData.name) return 'Name is required';
    if (!orderData.phone) return 'Phone is required';
    if (!orderData.email || !isValidEmail(orderData.email)) return 'Valid email is required';
    if (!Number.isFinite(Number(orderData.amount)) || Number(orderData.amount) < 0) return 'Valid amount is required';
    if (requirePaymentId && !orderData.paymentId) {
        return 'Payment ID is required';
    }
    return null;
}

function validateConnectionData(connData) {
    if (!connData || typeof connData !== 'object') return 'Connection data is required';
    if (!connData.name) return 'Name is required';
    if (!connData.phone) return 'Phone is required';
    if (!connData.email || !isValidEmail(connData.email)) return 'Valid email is required';
    if (!connData.address) return 'Address is required';
    if (!connData.items) return 'Load details are required';
    if (!Number.isFinite(Number(connData.amount)) || Number(connData.amount) < 0) return 'Valid amount is required';
    if (Number(connData.amount) > 0 && !connData.paymentId) return 'Payment ID is required for paid connections';
    return null;
}

app.post('/api/verify-payment', async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderData } = req.body;
        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) return res.status(400).json({ error: 'Missing payment verification fields' });

        const secret = process.env.RAZORPAY_KEY_SECRET || '';
        const generated_signature = crypto.createHmac('sha256', secret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');

        if (generated_signature !== razorpay_signature) {
            console.warn('⚠️ Razorpay signature mismatch');
            return res.status(400).json({ error: 'Invalid signature' });
        }

        const orderValidationError = validateOrderData(orderData, { requirePaymentId: false });
        if (orderValidationError) {
            return res.status(400).json({ error: orderValidationError });
        }

        // Save order to Firestore
        const docRef = await db.collection('orders').add({
            category: orderData.category || 'Unknown',
            name: orderData.name || '',
            phone: orderData.phone || '',
            address: orderData.address || '',
            items: orderData.items || '',
            amount: orderData.amount || 0,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            status: 'Paid',
            createdAt: new Date()
        });

        // Fire-and-forget emails
        try { sendOrderEmailsInBackground(orderData, docRef.id); } catch (e) { console.error(e); }

        return res.json({ success: true, dbId: docRef.id });
    } catch (err) {
        console.error('Error verifying payment:', err.message);
        return res.status(500).json({ error: 'Verification failed' });
    }
});

function buildConfirmationEmail({ customerName, category, items, amount, paymentId, address, customerRef }) {
    const safeName = customerName || 'Customer';
    return {
        subject: `Bijli Ghar: ${category} Confirmation ⚡`,
        text: `Hi ${safeName},\n\nThanks for booking with Bijli Ghar. We have received your request.\n\nService/Category: ${category}\nItems/Service Details: ${items}\nAmount Paid: ₹${amount}\nRazorpay Payment ID: ${paymentId}\nAddress: ${address}\n\nDatabase Reference: ${customerRef}\n\nWe will contact you shortly.\n\nRegards,\nBijli Ghar Team`
    };
}

// ==========================================
// EMAIL HELPERS (fire-and-forget, never block the HTTP response)
// ==========================================

// Sends the admin notification email for a /save-order request.
// Any failure here is logged only — it must never affect the customer-facing response.
async function sendOrderAdminEmail(orderData, dbId) {
    await sendMailWithRetry({
        from: process.env.EMAIL_USER,
        to: ADMIN_EMAIL,
        subject: `New ${orderData.category} Received! ⚡`,
        text: `You have received a new ${orderData.category}. Here is the complete data saved to your database:\n\nCategory: ${orderData.category}\nName: ${orderData.name}\nPhone: ${orderData.phone}\nAddress: ${orderData.address}\nItems/Service Details: ${orderData.items}\nAmount Paid: ₹${orderData.amount}\nRazorpay Payment ID: ${orderData.paymentId}\nDatabase Reference: ${dbId}`
    });
}

// Sends the customer confirmation email for a /save-order request.
// Any failure here is logged only — it must never affect the customer-facing response.
async function sendOrderCustomerEmail(orderData, dbId) {
    const customerEmail = (orderData.email || orderData.customerEmail || orderData.profileEmail || '').toString().trim();

    if (!customerEmail) {
        // cart.html already blocks checkout with an alert when no email is
        // found on the logged-in user/profile, so this should be rare. If it
        // happens, it means orderData.email, orderData.customerEmail, and
        // orderData.profileEmail were all empty/missing in the request body.
        console.warn('⚠️ [CUSTOMER EMAIL SKIPPED] No email field found on orderData. Order data keys received:', Object.keys(orderData));
        return;
    }

    const email = buildConfirmationEmail({
        customerName: orderData.name,
        category: orderData.category,
        items: orderData.items,
        amount: orderData.amount,
        paymentId: orderData.paymentId,
        address: orderData.address,
        customerRef: dbId
    });

    await sendMailWithRetry({
        from: process.env.EMAIL_USER,
        to: customerEmail,
        subject: email.subject,
        text: email.text
    });
}

// Fires both order emails in the background. Never throws — every failure is caught
// and logged individually so one failing email doesn't stop the other from being tried.
function sendOrderEmailsInBackground(orderData, dbId) {
    sendOrderAdminEmail(orderData, dbId)
        .then(() => console.log(`✅ [ADMIN EMAIL SUCCESS] Order ${dbId}`))
        .catch(err => console.error(`⚠️ [ADMIN EMAIL FAILED] Order ${dbId}:`, err.message));

    sendOrderCustomerEmail(orderData, dbId)
        .then(() => console.log(`✅ [CUSTOMER EMAIL SUCCESS] Order ${dbId}`))
        .catch(err => console.error(`⚠️ [CUSTOMER EMAIL FAILED] Order ${dbId}:`, err.message));
}

// Sends the admin notification email for a /save-connection request (with attachments).
async function sendConnectionAdminEmail(connData, dbId, attachments, totalSizeMB) {
    const emailText = `A new JBVNL connection application has been submitted. Here is the complete database record:\n\nName: ${connData.name}\nPhone: ${connData.phone}\nAddress: ${connData.address}\nLoad Info: ${connData.items}\nAmount Paid: ₹${connData.amount}\nRazorpay Payment ID: ${connData.paymentId}\nDatabase Reference: ${dbId}`;

    if (totalSizeMB > 24) {
        console.log('⚠️ Files too large for Gmail. Sending text-only fallback email.');
        await sendMailWithRetry({
            from: process.env.EMAIL_USER,
            to: ADMIN_EMAIL,
            subject: '🚨 New Connection (FILES TOO LARGE FOR EMAIL)',
            text: emailText + `\n\n⚠️ WARNING: The customer uploaded ${totalSizeMB.toFixed(2)} MB of files. Gmail limits attachments to 25MB. The text details were successfully saved to your database, but the files were too large to be emailed.`
        });
        return;
    }

    try {
        await sendMailWithRetry({
            from: process.env.EMAIL_USER,
            to: ADMIN_EMAIL,
            subject: '🚨 New Connection Application + Documents!',
            text: emailText + `\n\nThe customer's uploaded documents are attached to this email.`,
            attachments
        });
    } catch (emailErr) {
        // Fallback: try to at least notify the admin without attachments
        console.error('⚠️ [ADMIN EMAIL WITH ATTACHMENTS FAILED]:', emailErr.message);
        await sendMailWithRetry({
            from: process.env.EMAIL_USER,
            to: ADMIN_EMAIL,
            subject: '🚨 New Connection (Attachment Error)',
            text: emailText + `\n\n⚠️ Could not attach files due to a network error: ${emailErr.message}`
        });
    }
}

// Sends the customer confirmation email for a /save-connection request (with attachments).
async function sendConnectionCustomerEmail(connData, dbId, attachments, totalSizeMB) {
    const customerEmail = (connData.email || '').toString().trim();

    if (!customerEmail) {
        console.warn('⚠️ [CUSTOMER EMAIL SKIPPED] No email field found on connData. Connection data keys received:', Object.keys(connData));
        return;
    }

    const email = buildConfirmationEmail({
        customerName: connData.name,
        category: 'New Connection',
        items: connData.items,
        amount: connData.amount,
        paymentId: connData.paymentId,
        address: connData.address,
        customerRef: dbId
    });

    if (totalSizeMB > 24) {
        await sendMailWithRetry({
            from: process.env.EMAIL_USER,
            to: customerEmail,
            subject: email.subject,
            text: email.text + `\n\nNote: Documents were uploaded successfully. (Attachments not included in this email due to size limits.)`
        });
    } else {
        await sendMailWithRetry({
            from: process.env.EMAIL_USER,
            to: customerEmail,
            subject: email.subject,
            text: email.text,
            attachments
        });
    }
}

// Fires both connection emails in the background. Never throws.
function sendConnectionEmailsInBackground(connData, dbId, attachments, totalSizeMB) {
    sendConnectionAdminEmail(connData, dbId, attachments, totalSizeMB)
        .then(() => console.log(`✅ [ADMIN EMAIL SUCCESS] Connection ${dbId}`))
        .catch(err => console.error(`⚠️ [ADMIN EMAIL FAILED] Connection ${dbId}:`, err.message));

    sendConnectionCustomerEmail(connData, dbId, attachments, totalSizeMB)
        .then(() => console.log(`✅ [CUSTOMER EMAIL SUCCESS] Connection ${dbId}`))
        .catch(err => console.error(`⚠️ [CUSTOMER EMAIL FAILED] Connection ${dbId}:`, err.message));
}

// ==========================================
// ENDPOINT 1: CART & SERVICES (JSON)
// ==========================================
app.post('/save-order', async (req, res) => {
    try {
        const orderData = req.body;
        const orderValidationError = validateOrderData(orderData, { requirePaymentId: false });
        if (orderValidationError) {
            return res.status(400).json({ success: false, error: orderValidationError });
        }

        const docRef = await db.collection('orders').add({
            category: orderData.category,
            name: orderData.name,
            phone: orderData.phone,
            address: orderData.address,
            items: orderData.items,
            amount: Number(orderData.amount),
            paymentId: orderData.paymentId || 'PAY_AFTER_INSPECTION',
            status: orderData.paymentId ? 'Received' : 'Pending',
            createdAt: new Date()
        });
        console.log(`✅ [DB SUCCESS] Saved ${orderData.category}. DB ID: ${docRef.id}`);

        res.status(200).json({ success: true, dbId: docRef.id });
        sendOrderEmailsInBackground(orderData, docRef.id);
    } catch (error) {
        console.error('❌ [DB ERROR]:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// ENDPOINT 2: NEW CONNECTIONS WITH DOCUMENTS
// ==========================================
app.post('/save-connection', upload.any(), async (req, res) => {
    try {
        const connData = req.body;
        const connectionValidationError = validateConnectionData(connData);
        if (connectionValidationError) {
            return res.status(400).json({ success: false, error: connectionValidationError });
        }

        // 1. Save Text Details to Firebase Database
        const docRef = await db.collection('connections').add({
            category: 'New Connection',
            name: connData.name,
            phone: connData.phone,
            email: (connData.email || '').toString().trim(),
            address: connData.address,
            items: connData.items,
            amount: Number(connData.amount),
            paymentId: connData.paymentId || 'UNPAID',
            status: connData.paymentId ? 'Documents Submitted' : 'Pending',
            createdAt: new Date()
        });
        console.log(`✅ [DB SUCCESS] Saved Connection details. DB ID: ${docRef.id}`);

        // 2. Prepare Attachments
        const attachments = req.files.map(file => ({
            filename: file.originalname,
            content: file.buffer
        }));

        const totalSizeMB = attachments.reduce((acc, file) => acc + file.content.length, 0) / (1024 * 1024);
        console.log(`📁 Total attachment size: ${totalSizeMB.toFixed(2)} MB`);

        // Respond to the customer immediately once the order is safely in the
        // database, same as /save-order. Emails (which include the heavier
        // attachment uploads to Gmail) happen in the background afterward.
        res.status(200).json({ success: true, dbId: docRef.id });

        // Fire-and-forget: admin + customer emails, fully decoupled from the response above.
        sendConnectionEmailsInBackground(connData, docRef.id, attachments, totalSizeMB);
    } catch (error) {
        console.error('❌ [ERROR]:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 SERVER LIVE ON PORT ${PORT} 🚀`));