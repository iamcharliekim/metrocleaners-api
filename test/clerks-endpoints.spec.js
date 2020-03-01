const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Clerks Endpoints', function() {
  let db, token;
  const testClerks = helpers.makeClerksArray();

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

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('GET /api/clerks', () => {
    beforeEach('insert clerks', () => helpers.seedData(db, 'metrocleaners_clerks', testClerks));

    it('responds with 200 when request is successful', () => {
      return supertest(app)
        .get('/api/clerks')
        .set({
          Authorization: `Bearer ${token}`
        })
        .then(res => {
          expect(200, testClerks);
        });
    });
  });
});
