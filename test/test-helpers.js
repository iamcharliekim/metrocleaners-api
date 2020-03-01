const bcrypt = require('bcryptjs');

function cleanTables(db) {
  return db.transaction(trx =>
    trx
      .raw(
        `TRUNCATE 
            metrocleaners_customers,
            metrocleaners_clerks,
            metrocleaners_orders,
            metrocleaners_admins`
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE metrocleaners_customers_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE metrocleaners_clerks_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE metrocleaners_orders_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE metrocleaners_admins_id_seq minvalue 0 START WITH 1`),

          trx.raw(`SELECT setval('metrocleaners_customers_id_seq', 0)`),
          trx.raw(`SELECT setval('metrocleaners_clerks_id_seq', 0)`),
          trx.raw(`SELECT setval('metrocleaners_orders_id_seq', 0)`),
          trx.raw(`SELECT setval('metrocleaners_admins_id_seq', 0)`)
        ])
      )
  );
}

function makeCustomersArray() {
  return [
    {
      full_name: 'Charles Kim',
      phone_number: '3015255589'
    },
    {
      full_name: 'Steve Lee',
      phone_number: '3012938273'
    },
    {
      full_name: 'Jason Chase',
      phone_number: '3012138173'
    }
  ];
}

function makeClerksArray() {
  return [
    {
      full_name: 'David Kim',
      date_created: '2020-02-27T22:51:16.953Z',
      date_modified: null
    },
    {
      full_name: 'Kiki Graham',
      date_created: '2020-01-27T22:51:16.953Z',
      date_modified: null
    },
    {
      full_name: 'Steven Smith',
      date_created: '2020-06-27T22:51:16.953Z',
      date_modified: null
    }
  ];
}

function makeOrdersArray() {
  return [
    {
      order_number: 'M2020',
      clerk: 'David Kim',
      customer: 'Charles Kim',
      phone_number: '3015255589',
      order_date: '2020-02-27T20:00:00.000Z',
      ready_by_date: '2020-02-29T21:00:00.000Z',
      picked_up: false,
      picked_up_date: null,
      paid: false,
      notification_sent: null,
      date_created: '2020-02-27T22:51:16.953Z',
      price: '20',
      quantity: 4,
      date_modified: null
    },
    {
      order_number: 'M2020',
      clerk: 'David Kim',
      customer: 'Steve Lee',
      phone_number: '3012938273',
      order_date: '2020-02-29T20:00:00.000Z',
      ready_by_date: '2020-03-01T21:00:00.000Z',
      picked_up: false,
      picked_up_date: null,
      paid: false,
      notification_sent: null,
      price: '40',
      quantity: 7,
      date_created: '2020-02-27T22:51:16.953Z',
      date_modified: null
    },
    {
      order_number: 'M2020',
      clerk: 'David Kim',
      customer: 'Jason Chase',
      phone_number: '7032832837',
      order_date: '2020-05-27T20:00:00.000Z',
      ready_by_date: '2020-06-29T21:00:00.000Z',
      picked_up: false,
      picked_up_date: null,
      paid: false,
      notification_sent: null,
      price: '40.54',
      quantity: 7,
      date_created: '2020-02-27T22:51:16.953Z',
      date_modified: null
    }
  ];
}

function makeAdminArray() {
  return [
    {
      id: 1,
      full_name: 'David Kim',
      user_name: 'dkim',
      password: 'password1',
      date_created: '2020-02-23T22:51:16.953Z',
      date_modified: null
    },
    {
      id: 2,
      full_name: 'Lawrence Gusterford',
      user_name: 'lguster',
      password: 'password2',
      date_created: '2020-05-27T22:51:16.953Z',
      date_modified: null
    },
    {
      id: 3,
      full_name: 'Chao Lin',
      user_name: 'chaociao',
      password: 'password3',
      date_created: '2020-09-27T22:51:16.953Z',
      date_modified: null
    }
  ];
}

function seedAdmins(db, admins) {
  const preppedAdmin = admins.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));

  return db
    .into('metrocleaners_admins')
    .insert(preppedAdmin)
    .then(() =>
      db.raw(`SELECT setval('metrocleaners_admins_id_seq', ?)`, [admins[admins.length - 1].id])
    );
}

function seedData(db, dbName, data) {
  return db.into(dbName).insert(data);
}

module.exports = {
  cleanTables,
  makeOrdersArray,
  makeCustomersArray,
  makeClerksArray,
  makeAdminArray,
  seedData,
  seedAdmins
};
