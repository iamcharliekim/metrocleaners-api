const bcrypt = require('bcryptjs');

const AdminsService = {
  getAdmins(db) {
    return db('metrocleaners_admins').returning('*');
  },

  getAdminById(db, id) {
    return db('metrocleaners_admins')
      .returning('*')
      .where({ id });
  },

  getAdminByFullName(db, full_name) {
    return db('metrocleaners_admins')
      .returning('*')
      .where({ full_name });
  },

  insertAdmin(db, admin) {
    return db('metrocleaners_admins')
      .insert(admin)
      .returning('*');
  },

  updateAdmin(db, admin, id) {
    return db('metrocleaners_admins')
      .where({ id })
      .update(admin)
      .returning('*');
  },

  deleteAdmin(db, id) {
    return db('metrocleaners_admins')
      .where({ id })
      .del();
  },

  userNameIsUnique(db, user_name) {
    return db('metrocleaners_admins')
      .where({ user_name })
      .first()
      .then(user => {
        user;
        return !user;
      });
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12);
  }
};

module.exports = AdminsService;
