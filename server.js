require('dotenv').config();
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
// The account used to SEND the emails
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
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

        // 1) Send email to admin (existing behavior)
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: ADMIN_EMAIL, // Forwards directly to Aniket
                subject: `New ${orderData.category} Received! ⚡`,
                text: `You have received a new ${orderData.category}. Here is the complete data saved to your database:\n\nCategory: ${orderData.category}\nName: ${orderData.name}\nPhone: ${orderData.phone}\nAddress: ${orderData.address}\nItems/Service Details: ${orderData.items}\nAmount Paid: ₹${orderData.amount}\nRazorpay Payment ID: ${orderData.paymentId}\nDatabase Reference: ${docRef.id}`
            });
        } catch (emailErr) {
            console.error('⚠️ [ADMIN EMAIL FAILED]:', emailErr.message);
        }

        // 2) Send confirmation email to customer (required)
        // Priority:
        // 1) email/customerEmail from request body
        // 2) customer profile email sent as `profileEmail` by frontend (if any)
        const customerEmail = (orderData.email || orderData.customerEmail || orderData.profileEmail || '').toString().trim();
        try {
            const email = buildConfirmationEmail({
                customerName: orderData.name,
                category: orderData.category,
                items: orderData.items,
                amount: orderData.amount,
                paymentId: orderData.paymentId,
                address: orderData.address,
                customerRef: docRef.id
            });

            // If customerEmail is missing, fail loudly (so you notice configuration/data issues)
            // because sending confirmation is mandatory for this feature.
            if (!customerEmail) {
                throw new Error('Customer email not provided (missing orderData.email / customerEmail / profileEmail).');
            }

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: customerEmail,
                subject: email.subject,
                text: email.text
            });
        } catch (custEmailErr) {
            console.error('❌ [CUSTOMER EMAIL FAILED]:', custEmailErr);
            // Fail the request because confirmation email is compulsory.
            return res.status(500).json({ success: false, error: 'Customer confirmation email failed: ' + custEmailErr.message });
        }



        res.status(200).json({ success: true, dbId: docRef.id });
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

        const emailText = `A new JBVNL connection application has been submitted. Here is the complete database record:\n\nName: ${connData.name}\nPhone: ${connData.phone}\nAddress: ${connData.address}\nLoad Info: ${connData.items}\nAmount Paid: ₹${connData.amount}\nRazorpay Payment ID: ${connData.paymentId}\nDatabase Reference: ${docRef.id}`;

        // 3. Smart Email Logic (Admin)
        try {
            if (totalSizeMB > 24) {
                console.log('⚠️ Files too large for Gmail. Sending text-only fallback email.');
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: ADMIN_EMAIL,
                    subject: '🚨 New Connection (FILES TOO LARGE FOR EMAIL)',
                    text: emailText + `\n\n⚠️ WARNING: The customer uploaded ${totalSizeMB.toFixed(2)} MB of files. Gmail limits attachments to 25MB. The text details were successfully saved to your database, but the files were too large to be emailed.`
                });
            } else {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: ADMIN_EMAIL,
                    subject: '🚨 New Connection Application + Documents!',
                    text: emailText + `\n\nThe customer\'s uploaded documents are attached to this email.`,
                    attachments
                });
                console.log('✅ [EMAIL SUCCESS] Sent connection documents to your inbox.');
            }
        } catch (emailErr) {
            console.error('⚠️ [ADMIN EMAIL FAILED]:', emailErr.message);
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: ADMIN_EMAIL,
                subject: '🚨 New Connection (Attachment Error)',
                text: emailText + `\n\n⚠️ Could not attach files due to a network error: ${emailErr.message}`
            }).catch(e => console.error('Fallback email also failed', e));
        }

        // 4) Send confirmation email to customer (new behavior)
        if (connData.email) {
            try {
                const email = buildConfirmationEmail({
                    customerName: connData.name,
                    category: 'New Connection',
                    items: connData.items,
                    amount: connData.amount,
                    paymentId: connData.paymentId,
                    address: connData.address,
                    customerRef: docRef.id
                });

                // If attachments are too big, send text-only confirmation.
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
            } catch (custEmailErr) {
                console.error('⚠️ [CUSTOMER EMAIL FAILED]:', custEmailErr.message);
            }
        } else {
            console.log('ℹ️ Customer email not provided. Skipping customer confirmation email.');
        }

        res.status(200).json({ success: true, dbId: docRef.id });
    } catch (error) {
        console.error('❌ [ERROR]:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 SERVER LIVE ON PORT ${PORT} 🚀`));
