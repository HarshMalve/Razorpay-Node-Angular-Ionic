'use strict';
const express = require('express');
const app = express();

const pgRoutes = require('./payment_gateway_routes/payment_gateway_routes');
app.use('/razorpay', pgRoutes);

module.exports = app;