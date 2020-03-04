'use strict';

const express = require('express');
const moment = require('moment');
const OrdersService = require('./orders-service');
const ordersRouter = express.Router();
const { requireAuth } = require('../middleware/basic-auth');

const jsonBodyParser = express.json();

// GET: /orders
ordersRouter.get('/', function(req, res, next) {
  OrdersService.getOrders(req.app.get('db'))
    .then(orders => {
      res.json(orders);
    })
    .catch(next);
});

// POST: /orders
ordersRouter.post('/', requireAuth, jsonBodyParser, function(req, res, next) {
  const order_number = req.body.order_number;
  const clerk = req.body.clerk;
  const phone_number = req.body.phone_number;
  const order_date = new Date(req.body.order_date);
  const ready_by_date = new Date(req.body.ready_by_date);
  const price = req.body.price;
  const quantity = +req.body.quantity;
  const customer = req.body.customer;

  const order = {
    order_number,
    clerk,
    customer,
    phone_number,
    order_date,
    ready_by_date,
    price,
    quantity
  };

  OrdersService.insertOrder(req.app.get('db'), order)
    .then(orders => {
      res.json(orders[0]);
    })
    .catch(next);
});
// PUT: /orders
ordersRouter.put('/:id', requireAuth, jsonBodyParser, function(req, res, next) {
  const order_number = req.body.order_number;
  const clerk = req.body.clerk;
  const customer = req.body.customer;
  const phone_number = req.body.phone_number;
  const order_date = new Date(req.body.order_date);
  const ready_by_date = new Date(req.body.ready_by_date);
  const price = req.body.price;
  const quantity = +req.body.quantity;
  const picked_up = req.body.picked_up;

  const picked_up_date = new Date(req.body.picked_up_date);
  const date_modified = moment();
  const id = req.params.id;

  const updatedOrder = {
    order_number,
    clerk,
    customer,
    phone_number,
    order_date,
    ready_by_date,
    price,
    quantity,
    picked_up,
    date_modified,
    picked_up_date
  };

  OrdersService.updateOrder(req.app.get('db'), updatedOrder, id)
    .then(orders => {
      res.json(orders[0]);
    })
    .catch(next);
});

module.exports = ordersRouter;
