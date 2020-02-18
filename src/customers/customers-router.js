const express = require('express');
const moment = require('moment');
const AppointmentsService = require('../appointments/appointments-service');
const CustomersService = require('../customers/customers-service');
const customersRouter = express.Router()
const jsonBodyParser = express.json();


// GET: /customers
customersRouter.get('/', function(req, res, next) {
  CustomersService.getCustomers(req.app.get('db'))
    .then(customers => {
        res.json(customers)
    })
    .catch(next)
});

// POST: /customers
customersRouter.post('/api/customers', jsonBodyParser, function(req, res, next) {
  console.log(req)
  const full_name = req.body.full_name;
  const email = req.body.email;
  const user_name = req.body.user_name;
  const password = req.body.password;
  const phone_number = req.body.phone_number;

  // CHECK IF USERNAME IS UNIQUE
  CustomersService.userNameIsUnique(req.app.get('db'), user_name)
    .then(userNameIsUnique => {
      if (!userNameIsUnique) {
        res.status(400).json({ error: 'Username already taken' });
      }

      //validate password
      if (userNameIsUnique){
        return CustomersService.hashPassword(password)
          .then(hashedPW => {
            const updatedCustomer = {
              full_name,
              email,
              user_name,
              password: hashedPW,
              phone_number
            }

            return CustomersService.insertCustomer(req.app.get('db'), updatedCustomer)
              .then(customer => {
                res.status(201).json(customer)
              })
              .catch(next)
          })
      }
    })
});

// GET: /customers/:id/edit
customersRouter.get('/:id', function(req, res, next) {
  const id = req.params.id;

});

// POST: /customers/:id/edit
customersRouter.post('/edit/:id', function(req, res, next) {

});

// POST: /customers/:id/delete
customersRouter.post('/delete/:id', function(req, res, next) {

});

module.exports = customersRouter;