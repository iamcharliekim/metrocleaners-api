require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const helmet = require ('helmet')

const { NODE_ENV } = require('./config')

const app = express();
const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common'
const scheduler = require('./schedulerFactory')
const authRouter = require('./auth/auth-router')
const appointmentsRouter = require('./appointments/appointments-router')
const customersRouter = require('./customers/customers-router')

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use(customersRouter);
app.use('/api/auth', authRouter);
app.use('/api/appointments', appointmentsRouter);

app.use(function errorHandler(error, req, res, next){
    let response
    if (NODE_ENV === 'production'){
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

// scheduler.start(app.get('db'))

module.exports = app 