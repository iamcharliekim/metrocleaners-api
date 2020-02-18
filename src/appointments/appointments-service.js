'use strict';

const CustomersService = require('../customers/customers-service')
const moment = require('moment');
const config = require('../config');
const Twilio = require('twilio');

const AppointmentsService = {
    getAppointments(db){
      return db('metrocleaners_appointments')
      .returning('*')
    },

    insertAppointment(db, appointment){
      return db('metrocleaners_appointments')
        .insert(appointment)
        .returning('*')
    },
    
    updateAppointment(db, appointment, id){
      return db('metrocleaners_appointments')
        .where({id})
        .update(appointment)
        .returning('*')
    },

    deleteAppointment(db, id){
      return db('metrocleaners_appointments')
        .where({id})
        .del()
    },

    requiresNotification(searchDate, due_date){
      // WHAT IS this.notification? 
      return Math.round(moment.duration(moment(due_date).utc()
                          .diff(moment(searchDate).utc())
                        ).asMinutes()) === 0;
    },

    findAppointmentsAndSendNotifications(db){
        // now
        const searchDate = new Date();

        // GET LIST OF APPOINTMENTS FROM DB AND FILTER USING requiresNotification(searchDate)
        this.getAppointments(db)
          .then((appointments)=> {
            appointments = appointments.filter((appointment)=> {
              return this.requiresNotification(searchDate, appointment.due_date)              
            });

            if (appointments.length > 0){
              sendNotifications(appointments)
            }
          })


          /**
          * Send messages to all appoinment owners via Twilio
          * @param {array} appointments List of appointments.
          */
          function sendNotifications(appointments) {
              const client = new Twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
              appointments.forEach((appointment) => {
                // Get customer's object
                  CustomersService.getCustomerById(db, appointment.customer)
                    .then((customer)=> {
                      // Create options to send the message
                      const options = {
                        to: `+[+][1][${customer.phone_number}]`,
                        from: config.TWILIO_PHONE_NUMBER,
                        /* eslint-disable max-len */
                        body: `Hi ${customer.first_name}. Just a reminder that you have an appointment coming up.`,
                        /* eslint-enable max-len */
                      };

                      // Send the message!
                      client.messages.create(options, function(err, response) {
                          if (err) {
                              // Just log it for now
                              console.error(err);
                          } else {
                              // Log the last few digits of a phone number
                              let masked = customer.phone_number.substr(0,
                                customer.phone_number.length - 5);
                              masked += '*****';
                              console.log(`Message sent to ${masked}`);
                          }
                      });
                    });
                })

              // Don't wait on success/failure, just indicate all messages have been
              // queued for delivery
              if (callback) {
                callback.call();
              }
          }
      }
}


module.exports = AppointmentsService;