const bcrypt = require('bcryptjs');

const CustomersService = {
    getCustomers(db){
        return db('metrocleaners_customers')
        .returning('*')
    },

    getCustomerById(db, id){
        return db('metrocleaners_customers')
          .returning('*')
          .where({id})
      },

    getCustomerByFullName(db, full_name){
        return db('metrocleaners_customers')
            .returning('*')
            .where({full_name})
    },

    getCustomerByUsername(db, user_name){
        return db('metrocleaners_customers')
            .returning('*')
            .where({user_name})
    },

    insertCustomer(db, customer){
        return db('metrocleaners_customers')
            .insert(customer)
            .returning('*')
    },
    
    updateCustomer(db, customer, id){
        return db('metrocleaners_customers')
            .where({id})
            .update(customer)
            .returning('*')
    },

    deleteCustomer(db, id){
        return db('metrocleaners_customers')
            .where({id})
            .del()
    },

    userNameIsUnique(db, user_name) {
        return db('metrocleaners_customers')
          .where({ user_name })
          .first()
          .then(user => {
            user;
            return !user;
          });
      },

      hashPassword(password) {
        return bcrypt.hash(password, 12);
      },
    
}

module.exports = CustomersService