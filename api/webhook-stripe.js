const express = require('express');
const router = express.Router();
const fs = require('fs');
const stripe = require('../server/stripe/stripeClient');
const bodyParser = require('body-parser');


// Replace with your Stripe endpoint secret
// Listen to Stripe Webhook events
router.post('/', (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event; event = req.body;

 const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET || "whsec_rKuMswVTGyN2wQFWnJ4mm53q4GCOke49";

  // try {
  //  event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  // } catch (err) {
  //   console.error('❌ Webhook signature verification failed:', err.message);
  //   return res.status(400).send(`Webhook Error: ${err.message}`);
  // }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const newSub = {
      userId: session.client_reference_id || 'unknown_user',
      sessionId: session.id,
      amount: session.amount_total,
      currency: session.currency,
      status: 'active',
      createdAt: new Date().toISOString(),
      stripeAccountId: session.metadata.stripe_account_id || 'unknown_account',
    };

    const storeFile = './mockStore.json';
    let currentData = [];

    if (fs.existsSync(storeFile)) {
      currentData = JSON.parse(fs.readFileSync(storeFile));
    }

    currentData.push(newSub);
    fs.writeFileSync(storeFile, JSON.stringify(currentData, null, 2));

    console.log('✅ Subscription stored:', newSub);

    return res.json({ success: true, message: 'Subscription activated' });
  }

  if (event.type === 'payment_intent.payment_failed') {
    const failure = event.data.object;
    console.error('❌ Payment failed:', failure.last_payment_error?.message);

    return res.json({ success: false, error: 'Payment failed' });
  }

  res.json({ received: true });
});

module.exports = router;
