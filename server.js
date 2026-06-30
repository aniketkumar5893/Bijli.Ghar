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

const app = express();
app.use(cors());
app.use(express.json());
// Serve the frontend files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

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
    await transporter.sendMail({
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
        console.log('ℹ️ Customer email not provided. Skipping order confirmation email.');
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

    await transporter.sendMail({
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
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: ADMIN_EMAIL,
            subject: '🚨 New Connection (FILES TOO LARGE FOR EMAIL)',
            text: emailText + `\n\n⚠️ WARNING: The customer uploaded ${totalSizeMB.toFixed(2)} MB of files. Gmail limits attachments to 25MB. The text details were successfully saved to your database, but the files were too large to be emailed.`
        });
        return;
    }

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: ADMIN_EMAIL,
            subject: '🚨 New Connection Application + Documents!',
            text: emailText + `\n\nThe customer's uploaded documents are attached to this email.`,
            attachments
        });
    } catch (emailErr) {
        // Fallback: try to at least notify the admin without attachments
        console.error('⚠️ [ADMIN EMAIL WITH ATTACHMENTS FAILED]:', emailErr.message);
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: ADMIN_EMAIL,
            subject: '🚨 New Connection (Attachment Error)',
            text: emailText + `\n\n⚠️ Could not attach files due to a network error: ${emailErr.message}`
        });
    }
}

// Sends the customer confirmation email for a /save-connection request (with attachments).
async function sendConnectionCustomerEmail(connData, dbId, attachments, totalSizeMB) {
    if (!connData.email) {
        console.log('ℹ️ Customer email not provided. Skipping connection confirmation email.');
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
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: connData.email,
            subject: email.subject,
            text: email.text + `\n\nNote: Documents were uploaded successfully. (Attachments not included in this email due to size limits.)`
        });
    } else {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: connData.email,
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

        const docRef = await db.collection('orders').add({
            category: orderData.category,
            name: orderData.name,
            phone: orderData.phone,
            // Keep existing behavior; customer address is stored as provided
            address: orderData.address,
            items: orderData.items,
            amount: orderData.amount,
            paymentId: orderData.paymentId,
            status: 'Received',
            createdAt: new Date()
        });
        console.log(`✅ [DB SUCCESS] Saved ${orderData.category}. DB ID: ${docRef.id}`);

        // Respond to the customer immediately once the order is safely in the
        // database — this is the operation that actually matters for checkout
        // to complete. Email notifications are sent in the background below
        // and must never block or fail this response, since the customer's
        // order is already secured at this point regardless of email outcome.
        res.status(200).json({ success: true, dbId: docRef.id });

        // Fire-and-forget: admin + customer emails, fully decoupled from the response above.
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

        // 1. Save Text Details to Firebase Database
        const docRef = await db.collection('connections').add({
            category: 'New Connection',
            name: connData.name,
            phone: connData.phone,
            email: (connData.email || '').toString().trim(),
            address: connData.address,
            items: connData.items,
            amount: connData.amount,
            paymentId: connData.paymentId,
            status: 'Documents Submitted',
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