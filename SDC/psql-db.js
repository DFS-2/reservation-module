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
// ====================== seeding methods ======================
module.exports.createUsers = (userLists) => {
  return userLists.reduce((accumulator, user, index) => {
    return accumulator.then(() => {
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
  }, Promise.resolve());
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
  }, Promise.resolve());
};

// ====================== CRUD methods for normal applications ======================
// ====================== Create ======================
module.exports.addOneHome = (homeObj) => {
  let paramVector = [];
  let argVector = [];
  for (let key in homeObj) {
    if (key === 'host_id') {
      paramVector.push(`(SELECT user_id FROM users WHERE user_id=${homeObj[key]})`);
    } else {
      paramVector.push(homeObj[key]);
    }
    argVector.push(key);
  }
  let query = `INSERT INTO homes (${argVector.join(',')}) VALUES (${paramVector.join(',')})`;
  return pool.connect()
    .then((client) => {
      return client.query(query).then((result) => {
        client.release();
        console.log('query for adding one home fulfilled');
      });
    }).catch((err) => {
      console.log('error encountered while adding one home... ', err);
    });
};

module.exports.addOneReservation = (reservationObj) => {
  let paramVector = [];
  let argVector = [];
  for (let key in reservationObj) {
    if (key === 'home_id') {
      paramVector.push(`(SELECT home_id FROM homes WHERE home_id=${reservationObj[key]})`);
    } else {
      paramVector.push(reservationObj[key]);
    }
    argVector.push(key);
  }
  let query = `INSERT INTO reservations (${argVector.join(',')}) VALUES (${paramVector.join(',')})`;
  debugger;
  return pool.connect()
    .then((client) => {
      return client.query(query).then((result) => {
        client.release();
        console.log('query for adding one reservation fulfilled');
      });
    }).catch((err) => {
      console.log('error encountered while adding one reservation... ', err);
    });
};

module.exports.addOneUser = (userObj) => {
  let paramVector = [];
  let argVector = [];
  for (let key in userObj) {
    argVector.push(key);
    paramVector.push(userObj[key]);
  }
  let query = `INSERT INTO users (${argVector.join(',')} VALUES (${paramVector.join(',')}))`;
  return pool.connect()
    .then((client) => {
      return client.query(query).then((result) => {
        client.release();
        console.log('query for adding one user fulfilled');
      });
    }).catch((err) => {
      console.log('error encountered while adding one user');
    });
};

// ====================== Read ======================
module.exports.getTenHomes = (totalHomeNumber, testMode) => {
  return pool.connect()
    .then((client) => {
      const startPoint = Math.floor(Math.random() * totalHomeNumber - 10);
      return client.query(`SELECT * from homes WHERE home_id >= ${startPoint} and home_id < ${startPoint + 10}`)
        .then((result) => {
          client.release();
          console.log('query for ten random homes fulfilled');
          return result.rows;
        });
    }).catch((err) => {
      console.log('psql error enountered while retrieving ten homes... ', err);
    });
};

module.exports.getOneHome = (home_id, testMode) => {
  return pool.connect()
    .then((client) => {
      return client.query(`SELECT * FROM homes WHERE home_id = ${home_id}`)
        .then((result) => {
          client.release();
          console.log('query for one home fulfilled');
          return result.rows;
        });
    }).catch((err) => {
      console.log('psql error encountered while retrieving one home... ', err);
    });
};

// ====================== Update ======================
module.exports.updateOneReservation = (home_id, reservationDetail, testMode) => {
  let query = 'UPDATE reservations SET ';
  for (let key in reservationDetail) {
    query += `${key}=${reservationDetail[key]} `;
  }
  query += `WHERE home_id=${home_id} and start_date=${reservationDetail.start_date}`;
  return pool.connect()
    .then((client) => {
      return client.query(query).then((result) => {
        // need to fill more in here...
        debugger;
        client.release();
      });
    }).catch((err) => {
      console.log('psql error encountered while updating one reservation... ', err)
    });
};

module.exports.updateOneUser = (user_id, userObj) => {
  let query = 'UPDATE users SET ';
  for (let key in userObj) {
    query += `${key}=${userObj[key]}`;
  }
  query += `WHERE user_id=${user_id}`;
  return pool.connect()
    .then((client) => {
      return client.query(query).then((result) => {
        // need to fill more in here...
        debugger;
        client.release();
      });
    }).catch((err) => {
      console.log('psql error encountered while updating one user... ', err);
    });
};

module.exports.updateOneHome = (home_id, homeObj) => {
  let query = 'UPDATE homes SET ';
  for (let key in homeObj) {
    query += `${key}=${homeObj[key]}`;
  }
  query += `WHERE home_id=${home_id}`;
  return pool.conenct()
    .then((client) => {
      return client.query(query).then((result) => {
        // need to fill more in here...
        debugger;
        client.release();
      });
    }).catch((err) => {
      console.log('psql error encountered while updating one home... ', err);
    });
};

// ====================== Delete ======================
module.exports.deleteOneHome = (home_id) => {
  let query = `DELETE FROM homes WHERE home_id=${home_id}`;
  return pool.connect()
    .then((client) => {
      return client.query(query).then((result) => {
        // need to fill more in here...
        debugger;
        client.release();
      });
    }).catch((err) => {
      console.log('psql error encountered while deleting one home...', err);
    });
};

module.exports.deleteOneReservation = (home_id, start_date) => {
  let query = `DELETE FROM reservations WHERE home_id=${home_id} and start_date=${start_date}`;
  return pool.connect()
    .then((client) => {
      return client.query(query).then((result) => {
        // need to fill more in here...
        debugger;
        client.release();
      });
    }).catch((err) => {
      console.log('psql error encountered while deleting one reservation...', err);
    });
};

// this would need some more logic to it. When a user is deleted, all the associated attributes (homes, reservations) should all be deleted.
module.exports.deleteOneUser = (user_id) => {
  let query = `DELETE FROM users WHERE user_id=${user_id}`;
  return pool.connect()
    .then((client) => {
      return client.query(query).then((result) => {
        // need to fill more in here...
        debugger;
        client.release();
      });
    }).catch((err) => {
      console.log('psql error encountered while deleting one user...', err);
    });
};