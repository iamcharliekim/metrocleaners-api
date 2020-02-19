'use strict';

const ClerksService = {
  getClerks(db) {
    return db('metrocleaners_clerks').returning('*');
  },

  getClerkByFullName(db, full_name) {
    return db('metrocleaners_clerks')
      .returning('*')
      .where({ full_name })
      .first();
  },

  insertClerks(db, clerk) {
    return db('metrocleaners_clerks')
      .insert(clerk)
      .returning('*');
  },

  udpateClerk(db, clerk, id) {
    return db('metrocleaners_clerks')
      .where({ id })
      .update(clerk)
      .returning('*');
  },

  deleteClerk(db, id) {
    return db('metrocleaners_clerks')
      .where({ id })
      .del();
  }
};

module.exports = ClerksService;
