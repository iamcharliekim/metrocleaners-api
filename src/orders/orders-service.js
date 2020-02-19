'use strict';

const CustomersService = require('../customers/customers-service');
const moment = require('moment');
const config = require('../config');
const Twilio = require('twilio');

const OrdersService = {
  getOrders(db) {
    return db('metrocleaners_orders').returning('*');
  },

  insertOrder(db, order) {
    return db('metrocleaners_orders')
      .insert(order)
      .returning('*');
  },

  updateOrder(db, order, id) {
    return db('metrocleaners_orders')
      .where({ id })
      .update(order)
      .returning('*');
  },

  deleteOrder(db, id) {
    return db('metrocleaners_orders')
      .where({ id })
      .del();
  },

  requiresNotification(searchDate, ready_by_date) {
    // WHAT IS this.notification?
    return (
      Math.round(
        moment
          .duration(
            moment(ready_by_date)
              .utc()
              .diff(moment(searchDate).utc())
          )
          .asMinutes()
      ) === 0
    );
  },

  findAppointmentsAndSendNotifications(db) {
    // now
    const searchDate = new Date();

    // GET LIST OF APPOINTMENTS FROM DB AND FILTER USING requiresNotification(searchDate)
    this.getOrders(db).then(orders => {
      orders = orders.filter(order => {
        return this.requiresNotification(searchDate, order.ready_by_date);
      });

      if (orders.length > 0) {
        sendNotifications(orders);
      }
    });

    /**
     * Send messages to all orders owners via Twilio
     * @param {array} orders List of orders.
     */
    function sendNotifications(orders) {
      const client = new Twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
      orders.forEach(order => {
        // Get customer's object
        CustomersService.getCustomerById(db, order.customer).then(customer => {
          // Create options to send the message
          const options = {
            to: `+[+][1][${customer.phone_number}]`,
            from: config.TWILIO_PHONE_NUMBER,
            /* eslint-disable max-len */
            body: `Hi ${customer.first_name}. Just a reminder that you have an appointment coming up.`
            /* eslint-enable max-len */
          };

          // Send the message!
          client.messages.create(options, function(err, response) {
            if (err) {
              // Just log it for now
              console.error(err);
            } else {
              // Log the last few digits of a phone number
              let masked = customer.phone_number.substr(0, customer.phone_number.length - 5);
              masked += '*****';
              console.log(`Message sent to ${masked}`);
            }
          });
        });
      });

      // Don't wait on success/failure, just indicate all messages have been
      // queued for delivery
      if (callback) {
        callback.call();
      }
    }
  }
};

module.exports = OrdersService;
