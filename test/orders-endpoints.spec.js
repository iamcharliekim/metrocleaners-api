const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Orders Endpoints', function() {
  let db;
  let token;
  const testOrders = helpers.makeOrdersArray();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  before(done => {
    // create user in database
    supertest(app)
      .post('/api/admins')
      .send({
        full_name: 'Charlie Kim',
        user_name: 'testuser',
        password: 'testuser'
      })
      .then(user => {
        // get JWT
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

  describe('GET /api/orders', () => {
    it(`responds with 200 when all fields are valid`, () => {
      return supertest(app)
        .get('/api/orders')
        .set({ Authorization: `Bearer ${token}` })
        .then(res => {
          const testOrder = testOrders[0];
          const order1 = res.body[0];
          expect(order1.id).to.eql(1);
          expect(order1.order_number).to.eql(testOrder.order_number);
          expect(order1.clerk).to.eql(testOrder.clerk);
          expect(order1.customer).to.eql(testOrder.customer);
          expect(order1.phone_number).to.eql(testOrder.phone_number);
          expect(order1.order_date).to.eql(testOrder.order_date);
          expect(order1.ready_by_date).to.eql(testOrder.ready_by_date);
          expect(order1.picked_up).to.eql(testOrder.picked_up);
          expect(order1.picked_up_date).to.eql(testOrder.picked_up_date);
          expect(order1.notification_sent).to.eql(testOrder.notification_sent);
          expect(order1.date_created).to.eql(testOrder.date_created);
          expect(order1.price).to.eql(testOrder.price);
          expect(order1.quantity).to.eql(testOrder.quantity);
          expect(order1.date_modified).to.eql(testOrder.date_modified);
        });
    });
  });

  describe('POST /api/orders', () => {
    const testOrder = {
      order_number: 'M2020',
      clerk: 'David Kim',
      customer: 'Steve Danz',
      phone_number: '3015155489',
      order_date: '2020-02-27T20:00:00.000Z',
      ready_by_date: '2020-02-29T21:00:00.000Z',
      picked_up: false,
      picked_up_date: null,
      paid: false,
      notification_sent: null,
      notification_sent: null,
      price: '20',
      quantity: 4
    };

    it(`responds with 201 when all fields are valid`, () => {
      return supertest(app)
        .post('/api/orders')
        .set({ Authorization: `Bearer ${token}` })
        .send(testOrder)
        .then(res => {
          const order1 = res.body;
          expect(order1.id).to.eql(4);
          expect(order1.order_number).to.eql(testOrder.order_number);
          expect(order1.clerk).to.eql(testOrder.clerk);
          expect(order1.customer).to.eql(testOrder.customer);
          expect(order1.phone_number).to.eql(testOrder.phone_number);
          expect(order1.order_date).to.eql(testOrder.order_date);
          expect(order1.ready_by_date).to.eql(testOrder.ready_by_date);
          expect(order1.picked_up).to.eql(testOrder.picked_up);
          expect(order1.picked_up_date).to.eql(testOrder.picked_up_date);
          expect(order1.notification_sent).to.eql(testOrder.notification_sent);
          expect(order1.price).to.eql(testOrder.price);
          expect(order1.quantity).to.eql(testOrder.quantity);
          expect(order1.date_created).to.be.a('string');
          expect(order1.date_modified).to.eql(null);
        });
    });
  });

  describe('PUT /api/orders', () => {
    beforeEach('insert orders', () => helpers.seedData(db, 'metrocleaners_orders', testOrders));

    const testOrder = {
      ...testOrders[0],
      picked_up: true,
      picked_up_date: '2020-02-27T20:00:00.000Z'
    };

    it(`responds with 201 when all fields are valid`, () => {
      return supertest(app)
        .put(`/api/orders/1`)
        .set({ Authorization: `Bearer ${token}` })
        .send(testOrder)
        .then(res => {
          const order1 = res.body;
          expect(order1.id).to.eql(1);
          expect(order1.order_number).to.eql(testOrder.order_number);
          expect(order1.clerk).to.eql(testOrder.clerk);
          expect(order1.customer).to.eql(testOrder.customer);
          expect(order1.phone_number).to.eql(testOrder.phone_number);
          expect(order1.order_date).to.eql(testOrder.order_date);
          expect(order1.ready_by_date).to.eql(testOrder.ready_by_date);
          expect(order1.picked_up).to.eql(testOrder.picked_up);
          expect(order1.picked_up_date).to.eql(testOrder.picked_up_date);
          expect(order1.notification_sent).to.eql(testOrder.notification_sent);
          expect(order1.price).to.eql(testOrder.price);
          expect(order1.quantity).to.eql(testOrder.quantity);
          expect(order1.date_created).to.eql(testOrder.date_created);
          expect(order1.date_modified).to.be.a('string');
        });
    });
  });
});
