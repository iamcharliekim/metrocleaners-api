'use strict';

const express = require('express');
const moment = require('moment');
const AppointmentsService = require('./appointments-service');
const CustomersService = require('../customers/customers-service');
const router = new express.Router();


// GET: /appointments
router.get('/', function(req, res, next) {
  AppointmentsService.getAppointments(req.app.get('db'))
    .then(appointments => {
        res.json(appointments)
    })
    .catch(next)
});

// POST: /appointments
router.post('/', function(req, res, next) {
  let user_name = req.body.user_name

  CustomersService.getCustomerByUsername(req.app.get('db'), user_name)
    .then(user => {
      const due_date = moment(req.body.due_date, 'MM-DD-YYYY hh:mma');
      const customer = user.id

      const appointment = {
        customer,
        due_date
      }

      AppointmentsService.insertAppointment(req.app.get('db'), appointment)
        .then(appointments => {
          res.json(appointments)
        })
    })
    .catch(next)
});

// GET: /appointments/:id/edit
router.get('/:id', function(req, res, next) {
  const id = req.params.id;

});

// POST: /appointments/:id/edit
router.post('/edit/:id', function(req, res, next) {

});

// POST: /appointments/:id/delete
router.post('/delete/:id', function(req, res, next) {

});

module.exports = router;