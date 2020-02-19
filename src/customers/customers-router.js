const express = require('express');
const moment = require('moment');
const CustomersService = require('../customers/customers-service');
const customersRouter = express.Router();
const jsonBodyParser = express.json();
const { requireAuth } = require('../middleware/basic-auth');

// GET: /customers
customersRouter.get('/', requireAuth, function(req, res, next) {
  CustomersService.getCustomers(req.app.get('db'))
    .then(customers => {
      res.json(customers);
    })
    .catch(next);
});

// POST: /customers
customersRouter.post('/', jsonBodyParser, function(req, res, next) {
  const full_name = req.body.full_name;
  const phone_number = req.body.phone_number;
  const newCustomer = { full_name, phone_number };

  // CHECK IF CUSTOMER PHONE# IS UNIQUE
  CustomersService.phoneNumberIsUnique(req.app.get('db'), phone_number).then(
    phoneNumberIsUnique => {
      if (!phoneNumberIsUnique) {
        res.status(400).json({ error: 'Customer already exists' });
      }

      //IF # IS UNIQUE, INSERT CUSTOMER
      if (phoneNumberIsUnique) {
        return CustomersService.insertCustomer(req.app.get('db'), newCustomer)
          .then(customer => {
            res.status(201).json(customer);
          })
          .catch(next);
      }
    }
  );
});

// GET: /customers/:id/edit
customersRouter.get('/:id', function(req, res, next) {
  const id = req.params.id;
});

// POST: /customers/:id/edit
customersRouter.post('/edit/:id', function(req, res, next) {});

// POST: /customers/:id/delete
customersRouter.post('/delete/:id', function(req, res, next) {});

module.exports = customersRouter;
