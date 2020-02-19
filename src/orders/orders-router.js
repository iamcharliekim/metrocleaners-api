'use strict';

const express = require('express');
const moment = require('moment');
const OrdersService = require('./orders-service');
const CustomersService = require('../customers/customers-service');
const ClerksService = require('../clerks/clerks-service');
const ordersRouter = new express.Router();
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
  const clerk_name = req.body.clerk;
  const phone_number = req.body.phone_number;
  const order_date = req.body.order_date;
  const ready_by_date = req.body.ready_by_date;
  const price = req.body.price;
  const quantity = +req.body.quantity;

  CustomersService.getCustomerByPhoneNumber(req.app.get('db'), phone_number)
    .then(user => {
      ClerksService.getClerkByFullName(req.app.get('db'), clerk_name).then(clerkObj => {
        const customer = user.id;
        const clerk = clerkObj.id;

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

        OrdersService.insertOrder(req.app.get('db'), order).then(orders => {
          res.json(orders);
        });
      });
    })
    .catch(next);
});

// GET: /orders/:id/edit
ordersRouter.get('/:id', function(req, res, next) {
  const id = req.params.id;
});

// POST: /orders/:id/edit
ordersRouter.post('/edit/:id', function(req, res, next) {});

// POST: /orders/:id/delete
ordersRouter.post('/delete/:id', function(req, res, next) {});

module.exports = ordersRouter;
