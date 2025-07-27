// api/create-subscription-session.js

const stripe = require('../server/stripe/stripeClient');


// ✅ For local test (Vercel-style export not needed here)
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userId, amount_cents, currency, stripe_account_id } = req.body;
   // Get vendor's Stripe account ID from query params

    // 🧠 Validate input
    if (!userId || !amount_cents || !currency || !stripe_account_id) {
      return res.status(400).json({ success: false, error: 'Missing fields' });
    }

    // 🏗️ Create Stripe Checkout Session with split payment
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `Subscription for ${userId}`,
            },
            unit_amount: amount_cents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        stripe_account_id, // Store vendor's account ID
      },
      payment_intent_data: {
        application_fee_amount: Math.floor(amount_cents * 0.2), // 20% fee
        transfer_data: {
          destination: stripe_account_id, // 80% to vendor
        },
      },
      success_url: 'http://localhost:3000/success', // Dummy URLs for now
      cancel_url: 'http://localhost:3000/cancel',
    });

    // ✅ Return mock success response
    return res.status(200).json({
      success: true,
      sessionId: session.id || 'cs_test_subscription_ABC',
      sessionUrl: session.url || 'https://checkout.stripe.com/c/pay/cs_test_subscription_ABC',
    });

  } catch (err) {
    console.error('❌ Stripe Error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
