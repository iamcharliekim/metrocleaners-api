require('dotenv').config();

const scheduler = require('./schedulerFactory');
const knex = require('knex');
const app = require('./app');
const { PORT, DATABASE_URL } = require('./config');

const db = knex({
  client: 'pg',
  connection: DATABASE_URL
});

app.set('db', db);
scheduler.start(app.get('db'));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
