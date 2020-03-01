const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Auth Endpoints', function() {
  let db;
  const testAdmins = helpers.makeAdminArray();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('POST /api/auth/login', () => {
    beforeEach('insert admins', () => helpers.seedAdmins(db, testAdmins));

    const userLogin = {
      user_name: 'dkim',
      password: 'password1'
    };

    it('returns an authToken string if all fields are correct', () => {
      return supertest(app)
        .post('/api/auth/login')
        .send(userLogin)
        .then(res => {
          expect(res.body.authToken).to.be.a('string');
        });
    });
  });
});
