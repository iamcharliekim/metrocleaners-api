require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const { NODE_ENV } = require('./config');

const app = express();
const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

const authRouter = require('./auth/auth-router');
const ordersRouter = require('./orders/orders-router');
const customersRouter = require('./customers/customers-router');
const adminsRouter = require('./admins/admins-router');
const clerksRouter = require('./clerks/clerks-router');
const smsRouter = require('./sms/sms-router');

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/customers', customersRouter);
app.use('/api/clerks', clerksRouter);
app.use('/api/admins', adminsRouter);
app.use('/api/auth/login', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/sms', smsRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
