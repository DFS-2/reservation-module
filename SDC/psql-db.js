const { Pool, Client } = require('pg');
const Promise = require('bluebird');
const entrydbName = 'postgres';
const dbName = 'reservations';
const host = 'localhost';
const client = new Client({
  user: 'felixding',
  host: host,
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
  const pool = new Pool({
    user: 'felixding',
    host: host,
    database: dbName,
    port: 5432
  });
  return pool.connect();
}).then((pool) => {
  console.log(`switched to database ${dbName}`);
  console.log(`creating users table...`)
  const query = `CREATE TABLE IF NOT EXISTS users (
    user_id              SERIAL PRIMARY KEY,
    username             VARCHAR(20) NOT NULL,
    rating               VARCHAR(20) NOT NULL
  );`;
  pool.query(query);
  return pool;
}).then((pool) => {
  console.log(`creating homes table...`);
  const query = `CREATE TABLE IF NOT EXISTS homes (
    home_id              SERIAL PRIMARY KEY,
    title                VARCHAR(100) NOT NULL,
    priceperadult        VARCHAR(20) NOT NULL,
    priceperchild        VARCHAR(20) NOT NULL,
    cleaningfee          VARCHAR(20) NOT NULL,
    rating               VARCHAR(20) NOT NULL,
    ratingcount          VARCHAR(20) NOT NULL,
    host_id              INTEGER NOT NULL,
    FOREIGN KEY (host_id) REFERENCES users (user_id)
  );`;
  pool.query(query);
  return pool;
}).then((pool) => {
  console.log(`creating reservations table... `);
  const query = `CREATE TABLE IF NOT EXISTS reservations (
    res_id               SERIAL PRIMARY KEY,
    start_date           DATE,
    end_date             DATE,
    home_id              INTEGER,
    adultcount           INTEGER,
    childrencount        INTEGER,
    infantcount          INTEGER,
    user_id              INTEGER,
    amountpaid           VARCHAR(10) NOT NULL,
    amountowed           VARCHAR(10) NOT NULL,
    FOREIGN KEY (home_id) REFERENCES homes (home_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
  );`;
  pool.query(query);
  return pool;
}).then(() => {
  console.log('database initialized');
  process.exit(0);
}).catch((err) => {
  console.log(err);
  process.exit(0);
});

// =========== data creation ===========
Promise.promisifyAll(pool, {multiArgs: true});
module.exports.create = (entry) => {
  const {userInfo, homeInfo, resInfo} = entry;
  const userQuery = `INSERT INTO users (
    user_id, username, rating) VALUES (?, ?, ?);`;
  const homeQuery = `INSERT INTO homes (
    home_id, title, priceperadult, priceperchild, cleaningfee, rating, ratingcount, host_id) VALUES (?, ?, ?, ?, ?, ?, ?, (SELECT user_id FROM users where user_id = ?));`;
  const resQuery = `INSERT INTO reservations (
    res_id, start_date, end_date, home_id, adultcount, chilidrencount, infantcount, user_id, amountpaid, amountowed) VALUES (?, ?, ?, (SELECT home_id FROM homes where home_id = ?), ?, ?, ?, (SELECT user_id FROM users where user_id = ?), ?, ?);`;

  const userParams = [];
  const homeParams = [];
  const resParams = [];

  for (let item in userInfo) {
    userParams.push(userInfo[item]);
  }
  for (let item in homeInfo) {
    homeParams.push(homeInfo[item]);
  }
  for (let item in resInfo) {
    resParams.push(resInfo[item]);
  }

  return pool.queryAsync(userQuery, userParams)
    .then(() => {
      pool.queryAsync(homeQuery, homeParams);
    }).then(() => {
      pool.queryAsync(resQuery, resParams);
    }).then(() => {
      console.log('entry created');
    }).catch((err) => {
      console.log('error encountered while creating entry... ', err);
    });
};
