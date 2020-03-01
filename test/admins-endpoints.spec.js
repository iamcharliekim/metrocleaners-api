const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Admins Endpoints', function() {
  let db, token;
  const testAdmins = helpers.makeAdminArray();

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

  describe('GET /api/admins', () => {
    beforeEach('insert admins', () => helpers.seedData(db, 'metrocleaners_admins', testAdmins));

    it('returns a list of admins', () => {
      return supertest(app)
        .get('/api/admins')
        .set({
          Authorization: `Bearer ${token}`
        })
        .expect(200, testAdmins);
    });
  });

  describe('POST /api/admins', () => {
    const testAdmin = {
      full_name: 'David Kim',
      user_name: 'dkim',
      password: 'password1'
    };

    it('responds with 201 when request is successful', () => {
      return supertest(app)
        .post('/api/admins')
        .send(testAdmin)
        .then(res => {
          const admin = res.body[0];
          expect(admin.id).to.eql(1);
          expect(admin.full_name).to.eql(testAdmin.full_name);
          expect(admin.password).to.be.a('string');
        });
    });
  });
});
