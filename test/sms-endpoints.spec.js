const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('SMS Endpoints', function() {
  let db;
  let token;
  const testOrders = helpers.makeOrdersArray();
  const testCustomers = helpers.makeCustomersArray();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  before(done => {
    supertest(app)
      .post('/api/admins')
      .send({
        full_name: 'Charlie Kim',
        user_name: 'testuser',
        password: 'testuser'
      })
      .then(user => {
        supertest(app)
          .post('/api/auth/login')
          .send({
            user_name: 'testuser',
            password: 'testuser'
          })
          .end((err, response) => {
            token = response.body.authToken; // save the token!
            done();
          });
      });
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  beforeEach('insert orders', () => helpers.seedData(db, 'metrocleaners_orders', testOrders));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('POST /api/sms', () => {
    beforeEach('insert orders', () => helpers.seedData(db, 'metrocleaners_orders', testOrders));
    beforeEach('insert customers', () =>
      helpers.seedData(db, 'metrocleaners_customers', testCustomers)
    );

    const testSMS = {
      messageBody: 'test message!',
      customer: { ...testCustomers[0], id: 1 },
      order: { ...testOrders[0], id: 1 }
    };

    it(`responds with 201 when all fields are valid`, () => {
      return supertest(app)
        .post('/api/sms')
        .set({ Authorization: `Bearer ${token}` })
        .send(testSMS)
        .then(res => {
          const smsRes = res.body;
          expect(smsRes.id).to.eql(1);
          expect(smsRes.order_number).to.eql(testSMS.order.order_number);
          expect(smsRes.clerk).to.eql(testSMS.order.clerk);
          expect(smsRes.customer).to.eql(testSMS.order.customer);
          expect(smsRes.phone_number).to.eql(testSMS.order.phone_number);
          expect(smsRes.order_date).to.eql(testSMS.order.order_date);
          expect(smsRes.ready_by_date).to.eql(testSMS.order.ready_by_date);
          expect(smsRes.picked_up).to.eql(testSMS.order.picked_up);
          expect(smsRes.picked_up_date).to.eql(testSMS.order.picked_up_date);
          //   expect(smsRes.notification_sent).to.eql(new Date().toISOString());
          expect(smsRes.price).to.eql(testSMS.order.price);
          expect(smsRes.quantity).to.eql(testSMS.order.quantity);
          expect(smsRes.date_created).to.eql(testSMS.order.date_created);
          expect(smsRes.date_modified).to.eql(testSMS.order.date_modified);
        });
    });
  });
});
