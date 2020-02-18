'use strict';

const AppointmentsService = require('./appointments/appointments-service');

const notificationWorkerFactory = function(db) {
  return {
    run: function(db) {
        AppointmentsService.findAppointmentsAndSendNotifications(db);
    },
  };
};

module.exports = notificationWorkerFactory();