'use strict';

const OrdersService = require('./orders/orders-service');

const notificationWorkerFactory = function() {
  return {
    run: function(db) {
      OrdersService.findAppointmentsAndSendNotifications(db);
    }
  };
};

module.exports = notificationWorkerFactory();
