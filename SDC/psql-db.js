const { Pool, Client } = require('pg');
const entrydbName = 'postgres';
const dbName = 'reservations';
const client = new Client({
  user: 'felixding',
  host: 'localhost',
  database: entrydbName,
  port: 5432
});

// =========== database initialization ===========
client.connect().then(() => {
  const query = `CREATE DATABASE ${dbName}`;
  return client.query(query).catch((err) => {
    if (err.message === `database ${dbName} already exists`) {
      return;
    }
  });
}).then(() => {
  console.log('switching to newly created data base');
  client.end();
  return client.connect({
    user: 'felixding',
    host: 'localhost',
    database: dbName,
    port: 5432
  });
}).then(() => {
  console.log(`switched to database ${dbName}`);
  const query = `CREATE TABLE IF NOT EXISTS `
  process.exit(0);
}).catch((err) => {
  console.log(err);
})
