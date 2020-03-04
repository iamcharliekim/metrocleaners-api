const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Customers Endpoints', function() {
  let db, token;
  const testCustomers = helpers.makeCustomersArray();

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

  beforeEach('insert customers', () =>
    helpers.seedData(db, 'metrocleaners_customers', testCustomers)
  );

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('GET /api/customers', () => {
    it('responds with 200 when request is successful', () => {
      return supertest(app)
        .get('/api/customers')
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          const customersArr = res.body;
          customersArr.forEach((customer, i) => {
            expect(customer.id).to.eql(i + 1);
            expect(customer.full_name).to.eql(testCustomers[i].full_name);
            expect(customer.phone_number).to.eql(testCustomers[i].phone_number);
            expect(customer.date_created).to.be.a('string');
            expect(customer.date_modified).to.eql(null);
          });
        });
    });
  });

  describe('POST /api/customers', () => {
    const customer = { full_name: 'Don Klimser', phone_number: '2215255589' };

    it('responds with 201 when request is successful', () => {
      return supertest(app)
        .post('/api/customers')
        .set({
          Authorization: `Bearer ${token}`
        })
        .send(customer)
        .then(res => {
          const customer = res.body;
          expect(customer.id).to.eql(4);
          expect(customer.full_name).to.eql(customer.full_name);
          expect(customer.phone_number).to.eql(customer.phone_number);
          expect(customer.date_created).to.be.a('string');
          expect(customer.date_modified).to.eql(null);
        });
    });
  });
});
