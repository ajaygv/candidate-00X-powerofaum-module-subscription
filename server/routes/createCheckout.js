const express = require('express');
const router = express.Router();
const stripe = require('../stripe/stripeClient');

router.post('/create-checkout-session', async (req, res) => {
  const { userId } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'PowerOfAum Subscription',
        },
        unit_amount: 5000, // $50
      },
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: 'http://localhost:5173/success',
    cancel_url: 'http://localhost:5173/cancel',
    client_reference_id: userId,
  });

  res.json({ url: session.url });
});

module.exports = router;
