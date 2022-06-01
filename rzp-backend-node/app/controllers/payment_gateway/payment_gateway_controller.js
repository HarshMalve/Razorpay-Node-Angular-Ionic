const express = require('express');
const razorPay = require('razorpay');
const crypto = require('crypto');
const moment = require('moment');

const razorPayConfig = {
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_SECRET
}

var instance = new razorPay(razorPayConfig);

exports.createOrder = function (req, res) {
    let options = {
        amount: req.body.amount * 100, // amount in the smallest currency unit for INR(paise) // Converting Rupees to paise
        currency: 'INR',
        receipt: 'razor-' + Math.random().toString(36).substr(2, 8).toUpperCase(), //Generating receiptID
        payment_capture: 1
    }
    instance.orders.create(options, function (err, order) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(order);
            console.log(order);
            console.log('id ' + order.id);
            console.log('status ' + order.status);
            /* SAMPLE RESPONSE 
                {
                    "id": "order_ExHdrPtOVbc8WM",
                    "entity": "order",
                    "amount": 100,
                    "amount_paid": 0,
                    "amount_due": 100,
                    "currency": "INR",
                    "receipt": "order_rcptid_11",
                    "offer_id": null,
                    "status": "created",
                    "attempts": 0,
                    "notes": [],
                    "created_at": 1590997809
                }
            */
        }
    });
};

exports.verifySignature = function (req, res) {
    let razorpay_order_id = req.body.razorpay_order_id;
    let razorpay_payment_id = req.body.razorpay_payment_id;
    let hmac = crypto.createHmac('sha256', razorPayConfig.key_secret);
    let data = hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    let generated_signature = data.digest('hex');
    if (generated_signature == req.body.razorpay_signature) {
        res.status(200).json({ data: 'Signature Verified' });
        console.log('Signature Verified');
    } else {
        res.status(403).json({ data: 'Signature Invalid' });
    }
};


/*
Plan#
A plan is the foundation on which a subscription is built. It acts as a reusable template and contains details of the goods or service offered along with the amount to be charged and the frequency at which the customer should be charged (billing cycle). Depending upon your business, you can create multiple plans with different billing cycles and pricing.

You must create a plan before you create a subscriptions via your checkout or via the Subscription Link feature.

Subscription#
A subscription contains details like the plan, the start date, total number of billing cycles, free trial period (if any) and upfront amount to be collected.
*/

exports.createPlan = function (req, res) {

    // Data type string. Used together with interval to define how often the customer should be charged. 
    // For example, if you want to create a monthly subscription, pass period monthly and interval 1.
    // Possible values: daily, weekly, monthly, yearly
    let period = req.body.period;

    // Data type integer. 
    // Used together with period to define how often the customer should be charged. 
    // For example, if you want to create a monthly subscription, pass period monthly and interval 1.
    // For daily plans, the minimum interval is 7.
    let interval = req.body.interval;

    // Details of the plan.
    //"item": {
    //"name": "Test plan - Weekly",
    //"amount": 69900,
    //"currency": "INR",
    //"description": "Description for the test plan - Weekly"
    //},
    let item = {
        name: req.body.item.name,
        amount: req.body.item.amount * 100,
        currency: 'INR',
        description: req.body.item.description
    }

    // Data type object. 
    // Notes you can enter for the contact for future reference. 
    // This is a key-value pair. You can enter a maximum of 15 key-value pairs. 
    // For example, "note_key": "Beam me up Scotty”.
    let notes = req.body.notes;

    let params = {
        period: period,
        interval: interval,
        item: item,
        notes: notes
    }
    
    instance.plans.create(params, function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
            /*SAMPLE RESPONSE
                {
                    "id": "plan_F2urcGq26GcI9n",
                    "entity": "plan",
                    "interval": 1,
                    "period": "weekly",
                    "item": {
                        "id": "item_F2urc31MFVuZx2",
                        "active": true,
                        "name": "Test plan - Weekly",
                        "description": "Description for the test plan - Weekly",
                        "amount": 69900,
                        "unit_amount": 69900,
                        "currency": "INR",
                        "type": "plan",
                        "unit": null,
                        "tax_inclusive": false,
                        "hsn_code": null,
                        "sac_code": null,
                        "tax_rate": null,
                        "tax_id": null,
                        "tax_group_id": null,
                        "created_at": 1592227634,
                        "updated_at": 1592227634
                    },
                    "notes": {
                        "notes_key_1": "Tea, Earl Grey, Hot",
                        "notes_key_2": "Tea, Earl Grey… decaf."
                    },
                    "created_at": 1592227634
                }
            */
        }
    });
};

exports.fetchAllPlans = function (req, res) {
    let from = new Date(req.body.from);
    let to = new Date(req.body.to);
    let params = {
        from: moment(from).unix(), //Data type integer. The Unix timestamp from when plans are to be fetched.
        to: moment(to).unix(), //Data type integer.The Unix timestamp till when plans are to be fetched.
        count: req.body.count, //Data type integer. The number of plan to be fetched. Default value is 10. Maximum value is 100. This can be used for pagination, in combination with skip.
    };

    instance.plans.all(params, function (err, result){
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
            /*SAMPLE RESPONSE
                {
                    "entity": "collection",
                    "count": 1,
                    "items": [
                        {
                            "id": "plan_F3CwjXEYGuyARM",
                            "entity": "plan",
                            "interval": 1,
                            "period": "weekly",
                            "item": {
                                "id": "item_F3CwjGm1Cib4xV",
                                "active": true,
                                "name": "Test plan - Weekly",
                                "description": "Description for the test plan - Weekly",
                                "amount": 6990000,
                                "unit_amount": 6990000,
                                "currency": "INR",
                                "type": "plan",
                                "unit": null,
                                "tax_inclusive": false,
                                "hsn_code": null,
                                "sac_code": null,
                                "tax_rate": null,
                                "tax_id": null,
                                "tax_group_id": null,
                                "created_at": 1592291313,
                                "updated_at": 1592291313
                            },
                            "notes": {
                                "notes_key_1": "Tea, Earl Grey, Hot",
                                "notes_key_2": "Tea, Earl Grey… decaf."
                            },
                            "created_at": 1592291314
                        }
                    ]
                }
            */ 
        }
    });
};

exports.fetchPlanOnId = function (req, res) {
    let plan_id = req.body.plan_id;
    instance.plans.fetch(plan_id, function (err, result) {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
};

exports.createSubscription = function(req, res) {
    let start_at = new Date(req.body.start_at);
    let expire_by = new Date(req.body.expire_by);
    let addons = [{
        item : {
            name: req.body.addons[0].item.name,
            amount: req.body.addons[0].item.amount * 100,
            currency: req.body.addons[0].item.currency
        }
    }];

    let params = {
        plan_id: req.body.plan_id, //Data type string. The unique identifier for a plan that should be linked to the subscription. For example, plan_00000000000001.
        total_count: req.body.total_count, //Data type integer. The number of billing cycles for which the customer should be charged. For example, if a customer is buying a 1-year subscription that should be billed on a bi-monthly basis, this value should be 6.
        quantity: req.body.quantity, //Data type integer. The number of times the customer should be charged the plan amount per invoice. For example, a customer subscribes to use a software. The charges are ₹100/month/license. The customer wants 5 licenses. You should pass 5 as the quantity in this case. The customer is charged ₹500 (5 x ₹100) monthly. By default, this value is set to 1.
        start_at: moment(start_at).unix(), //Data type integer. The timestamp, in Unix format, for when the subscription should start. If not passed, the subscription starts immediately after the authorization payment. For example, 1581013800.
        expire_by: moment(expire_by).unix(), //Data type integer. The timestamp, in Unix format, till when the customer can make the authorization payment. For example, 1581013800. Do not pass any value if you do not want to set an expiry date.
        customer_notify: req.body.customer_notify, //Data type boolean. Indicates whether the communication to the customer would be handled by you or us. 0: communication handled by you.1 (default): communication handled by Razorpay.
        addons: addons, //Array that contains details of any upfront amount you want to collect as part of the authorization transaction.
        notes: req.body.notes, //Data type object. Notes you can enter for the contact for future reference. This is a key-value pair. You can enter a maximum of 15 key-value pairs. For example, "note_key": "Beam me up Scotty”.
        notify_info: req.body.notify_info
    };
    /* SAMPLE REQUEST
        {
        "plan_id":"plan_F3CwjXEYGuyARM",
        "total_count":12,
        "quantity": 1,
        "customer_notify":1,
        "start_at": "2020-06-16",
        "expire_by": "2021-06-15",
        "addons":[
            {
            "item":{
                "name":"Delivery charges",
                "amount":30,
                "currency":"INR"
            }
            }
        ],
        "notes":{
            "notes_key_1":"Tea, Earl Grey, Hot",
            "notes_key_2":"Tea, Earl Grey… decaf."
        }
        }    
    */ 
    instance.subscriptions.create(params , function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
            /* SAMPLE RESPONSE 
                {
                    "id": "sub_F3HJZa4L3vzpTT",
                    "entity": "subscription",
                    "plan_id": "plan_F3CwjXEYGuyARM",
                    "status": "created",
                    "current_start": null,
                    "current_end": null,
                    "ended_at": null,
                    "quantity": 1,
                    "notes": {
                        "notes_key_1": "Tea, Earl Grey, Hot",
                        "notes_key_2": "Tea, Earl Grey… decaf."
                    },
                    "charge_at": 1592352000,
                    "start_at": 1592352000,
                    "end_at": 1598985000,
                    "auth_attempts": 0,
                    "total_count": 12,
                    "paid_count": 0,
                    "customer_notify": true,
                    "created_at": 1592306697,
                    "expire_by": 1623801600,
                    "short_url": "https://rzp.io/i/59iSEhq",
                    "has_scheduled_changes": false,
                    "change_scheduled_at": null,
                    "source": "api",
                    "remaining_count": 12
                }            
            */ 
        }
    });
};

exports.fetchAllSubscriptions = function(req, res) {

    let params = {
     plan_id: req.query.plan_id, //The plan ID of which you want to retrieve all the subscriptions.
     from: moment(new Date(req.query.from)).unix(), //Data type integer. The Unix timestamp from when subscriptions are to be fetched.
     to: moment(new Date(req.query.to)).unix(), //Data type integer.The Unix timestamp till when subscriptions are to be fetched.
     count: req.query.count, //Data type integer. The number of subscriptions to be fetched. Default value is 10. Maximum value is 100. This can be used for pagination, in combination with skip.
     skip: req.query.skip //Data type integer.The number of subscriptions to be skipped. Default value is 0. This can be used for pagination, in combination with count.      
    }

    instance.subscriptions.all(params, function (err, result){
        if(err){
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
};

exports.fetchSubscriptionOnId = function(req, res) {
    let subscriptionId = req.query.subscriptionId;
    instance.subscriptions.fetch(subscriptionId, function(err, result) {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
};

exports.cancelSubscriptionOnId = function(req, res) {
    let params = {
        id: req.body.subscriptionId,
        cancel_at_cycle_end: req.body.cancelAtCycleEnd
    };
    instance.subscriptions.cancel(params.id, params.cancel_at_cycle_end, function (err, result){
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    })    
};

