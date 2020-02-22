'use strict';

const express = require('express');
const moment = require('moment');
const smsRouter = express.Router();
const smsService = require('./sms-service');
const OrdersService = require('../orders/orders-service');
const { requireAuth } = require('../middleware/basic-auth');

const config = require('../config');

const jsonBodyParser = express.json();

// GET: /orders
smsRouter.get('/', function(req, res, next) {});

// POST: /sms
smsRouter.post('/', requireAuth, jsonBodyParser, function(req, res, next) {
  const messageBody = req.body.messageBody;
  const customerPhoneNumber = req.body.customer.phone_number;
  const order = req.body.order;

  const client = require('twilio')(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

  client.messages
    .create({
      body: messageBody,
      from: config.TWILIO_PHONE_NUMBER,
      to: `[+][1][${customerPhoneNumber}]`
    })
    .then(message => {
      order.notification_sent = moment()
        .utc(true)
        .format();

      order.ready_by_date = moment(order.ready_by_date)
        .utc(true)
        .format();
      order.order_date = moment(order.order_date)
        .utc(true)
        .format();

      OrdersService.updateOrder(req.app.get('db'), order, order.id).then(orderUpdated => {
        res.json(orderUpdated[0]);
      });
    })
    .catch(next);
});

module.exports = smsRouter;
