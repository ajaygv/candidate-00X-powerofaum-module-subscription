const express = require('express');
const fs = require('fs');
const router = express.Router();

// GET endpoint to return vendor sales summary
router.get('/', (req, res) => {
  const storeFile = './mockStore.json';
 const { vendorId } = req.query;
 console.log('Vendor ID:', vendorId);
  if (!fs.existsSync(storeFile)) {
    return res.json({ sales: 0, message: 'No subscriptions found yet' });
  }

  const subs = JSON.parse(fs.readFileSync(storeFile)).filter(sub => {
    return sub.stripeAccountId === vendorId;
  });

  const total = subs.reduce((sum, entry) => {
    return sum + (entry.amount || 0);
  }, 0);

  res.json({
    sales: total,
    count: subs.length,
    currency: subs[0]?.currency?.toUpperCase() || 'INR'
  });
});

module.exports = router;
