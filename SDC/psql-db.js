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
module.exports.init = () => (
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
    Promise.promisifyAll(pool, {multiArgs: true});
    console.log(`switched to database ${dbName}`);
    console.log(`creating users table...`)
    const query = `CREATE TABLE IF NOT EXISTS users (
      user_id              SERIAL PRIMARY KEY,
      username             VARCHAR(100) NOT NULL,
      rating               VARCHAR(20) NOT NULL
    );`;
    return pool.queryAsync(query).then(() => {
      return pool;
    });
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
    return pool.queryAsync(query).then(() => {
      return pool;
    });
  }).then((pool) => {
    console.log(`creating reservations table... `);
    const query = `CREATE TABLE IF NOT EXISTS reservations (
      start_date           DATE,
      end_date             DATE,
      home_id              INTEGER,
      adultcount           INTEGER,
      childrencount        INTEGER,
      infantcount          INTEGER,
      user_id              INTEGER,
      amountpaid           VARCHAR(10) NOT NULL,
      amountowed           VARCHAR(10) NOT NULL,
      FOREIGN KEY (home_id) REFERENCES homes (home_id)
    );`;
    return pool.queryAsync(query).then(() => {
      return pool;
    });
  }).then((pool) => {
    console.log('database initialized');
    return;
  }).catch((err) => {
    console.log(err);
    process.exit(0);
  })
);

// =========== data creation ===========
const userQuery = `INSERT INTO users (
  user_id, username, rating) VALUES ($1, $2, $3);`;
const homeQuery = `INSERT INTO homes (
  home_id, title, priceperadult, priceperchild, cleaningfee, rating, ratingcount, host_id) VALUES ($1, $2, $3, $4, $5, $6, $7, (SELECT user_id FROM users WHERE user_id = $8));`;
const resQuery = `INSERT INTO reservations (
  start_date, end_date, home_id, adultcount, childrencount, infantcount, user_id, amountpaid, amountowed) VALUES ($1, $2, (SELECT home_id FROM homes WHERE home_id = $3), $4, $5, $6, $7, $8, $9);`;
// const userQuery = `INSERT INTO users (
//   user_id, username, rating) VALUES ($1, $2, $3);`;
// const homeQuery = `INSERT INTO homes (
//   home_id, title, priceperadult, priceperchild, cleaningfee, rating, ratingcount, host_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
// const resQuery = `INSERT INTO reservations (
//   start_date, end_date, home_id, adultcount, childrencount, infantcount, user_id, amountpaid, amountowed) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`;

const pool = new Pool({
    user: 'felixding',
    host: host,
    database: dbName,
    port: 5432
  });
Promise.promisifyAll(pool, {multiArgs: true});

// expects an array of user array as input
module.exports.createUsers = (userLists) => {
  return userLists.reduce((accumulator, user, index) => {
    return accumulator.then(() => {
      // console.log('chicken');
      return pool.queryAsync(userQuery, user);
    });
  }, Promise.resolve());
};

// expects an array of home array as input
module.exports.createHomes = (homeLists) => {
  return homeLists.reduce((accumulator, home, index) => {
    return accumulator.then(() => {
      return pool.queryAsync(homeQuery, home);
    })
  }, Promise.resolve())
};

// expects an array of reservation array as input
module.exports.createReservations = (resLists) => {
  return resLists.reduce((accumulator, res, index) => {
    return accumulator.then(() => {
      const promiseBin = [];
      for (let item of res) {
        promiseBin.push(pool.queryAsync(resQuery, item));
      }
      return Promise.all(promiseBin);
    });
  }, Promise.resolve())

};