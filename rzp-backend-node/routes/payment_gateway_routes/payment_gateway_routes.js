const express = require('express');
const app = express();

let pgController = require('../../app/controllers/payment_gateway/payment_gateway_controller');

app.route('/payment/create_order').post(pgController.createOrder);
app.route('/payment/verifyPaymentSignature').post(pgController.verifySignature);
app.route('/payment/create_plan').post(pgController.createPlan);
app.route('/payment/fetch_all_plans').post(pgController.fetchAllPlans);
app.route('/payment/fetch_plan_on_id').post(pgController.fetchPlanOnId);
app.route('/payment/create_subscription').post(pgController.createSubscription);
app.route('/payment/fetch_all_subscriptions').get(pgController.fetchAllSubscriptions);
app.route('/payment/fetch_subscription_on_id').get(pgController.fetchSubscriptionOnId);
app.route('/payment/cancel_subscription_on_id').post(pgController.cancelSubscriptionOnId);
module.exports = app;