'use strict';

const CronJob = require('cron').CronJob;
const notificationsWorker = require('./notificationWorkerFactory');
const moment = require('moment');

const schedulerFactory = function() {
  return {
    start: function(db) {
      new CronJob(
        '00 * * * * *',
        function() {
          console.log('Running Send Notifications Worker for ' + moment().format());
          notificationsWorker.run(db);
        },
        null,
        true,
        ''
      );
    }
  };
};

module.exports = schedulerFactory();
