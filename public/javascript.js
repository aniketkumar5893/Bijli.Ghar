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

        // 2. Open Razorpay Checkout
        const options = {
            key: "YOUR_PUBLIC_RAZORPAY_KEY", // Add your public key here
            amount: order.amount,
            currency: "INR",
            name: "Bijli Ghar",
            description: "JBVNL New Connection Service",
            order_id: order.id,
            handler: function (response) {
                alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
                // Here you would typically redirect to a success page
            },
            prefill: {
                name: "Customer Name",
                contact: "9999999999"
            },
            theme: { color: "#1e3a8a" } // Matches your primary brand color
        };

        const rzp = new Razorpay(options);
        rzp.open();

    } catch (error) {
        console.error("Payment initiation failed:", error);
        alert("Could not initiate payment. Please try again.");
    }
}