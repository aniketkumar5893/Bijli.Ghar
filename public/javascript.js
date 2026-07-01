// Add Razorpay SDK to your HTML head: <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

async function initiatePayment(totalAmount) {
    try {
        // 1. Call your Node.js backend to create an order
        const response = await fetch('/api/create-payment-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: totalAmount })
        });
        
        const order = await response.json();

        // 2. Open Razorpay Checkout using server-provided key and order
        const options = {
            key: order.key || '',
            amount: order.amount,
            currency: order.currency || 'INR',
            name: 'Bijli Ghar',
            description: 'JBVNL New Connection Service',
            order_id: order.id,
            handler: function (response) {
                // Notify the server to verify signature and finalize order
                fetch('/api/verify-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        orderData: { amount: order.amount }
                    })
                }).then(r => r.json()).then(result => {
                    if (result.success) alert('Payment verified successfully');
                    else alert('Payment verification failed');
                }).catch(err => { console.error(err); alert('Verification error'); });
            },
            prefill: {
                name: 'Customer Name',
                contact: '9999999999'
            },
            theme: { color: '#1e3a8a' }
        };

        const rzp = new Razorpay(options);
        rzp.open();

    } catch (error) {
        console.error("Payment initiation failed:", error);
        alert("Could not initiate payment. Please try again.");
    }
}