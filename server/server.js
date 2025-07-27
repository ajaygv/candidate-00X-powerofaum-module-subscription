// server.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('PowerOfAum Subscription Backend is Running 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server started on http://localhost:${PORT}`);
});

const createSubscriptionRoute = require('../api/create-subscription-session');
app.use('/api/create-subscription-session', createSubscriptionRoute);

const webhookRoute = require('../api/webhook-stripe');
app.use('/api/webhook-stripe', webhookRoute);

const vendorSalesRoute = require('../api/vendor-sales-status');
app.use('/api/vendor-sales-status', vendorSalesRoute);

const webhookStripe = require('../api/webhook-stripe');
app.use('/api', webhookStripe);

const connectOnboard = require('../api/connect-onboard');
app.use('/api', connectOnboard);

const createTransfer = require('../api/create-transfer');
app.use('/api', createTransfer);

app.use('/create-checkout-session', require('./routes/createCheckout'));


const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173' }));



