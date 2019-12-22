const path = require('path');
const fs = require('fs');
const faker = require('faker');
const moment = require('moment');
const db = require('../psql-db');
const { PerformanceObserver, performance } = require('perf_hooks');
const t0 = performance.now();
const cliProgress = require('cli-progress');
const Promise = require('bluebird');
const multibar = new cliProgress.MultiBar({
  clearOnComplete: false,
  hideCursor: true
}, cliProgress.Presets.shades_grey);
const scaler = 1;
const totalUserSize = 15000000 * scaler;
const totalHomeSize = 10000000 * scaler;
const userBatchSize = totalUserSize / 10; 
const homeBatchSize = totalHomeSize / 10; 
const reservationBatchSize = totalHomeSize / 10;
const maxResPerHome = 6;
const threshold = 0.7;

const loftSynonyms = ['apartment', 'hostel', 'hotel', 'inn', 'lodge', 'motel', 'resort', 'shelter', 'abode', 'castle', 'palace', 'room', 'lodging', 'penthouse', 'studio', 'house', 'mansion'];

const reservationGeneratorForOneHouse = (home_id, user_id, maxResNum) => {
  const numReservations = Math.floor(Math.random() * maxResNum) + 1;
  let numDays = numReservations * 2;
  const reservationDates = [];
  let lastDay = 0;
  while (numDays--) {
    const day = lastDay + Math.ceil(Math.random() * (90 - numDays - lastDay));
    lastDay = day;
    reservationDates.push(day);
  }
  let res = '';
  for (let j = 0; j < reservationDates.length; j += 2) {
    res += `${moment().add(reservationDates[j], 'days').format('YYYY[-]MM[-]DD')}|${moment().add(reservationDates[j + 1], 'days').format('YYYY[-]MM[-]DD')}|${home_id}|${Math.floor(Math.random() * 5)}|${Math.floor(Math.random() * 5)}|${Math.floor(Math.random() * 5)}|${user_id}|${Number.parseFloat(Math.random() * 200).toPrecision(2)}|${Number.parseFloat(Math.random() * 400).toPrecision(2)}\n`;
  }
  return res;
};

const usersStringGenerator = function * (userBatchSize, totalUserSize) {
  let res = '';
  for (let i = 1; i <= totalUserSize; i++) {
    res += `${i}|${faker.name.findName()}|${Number.parseFloat(Math.random() * 5).toPrecision(2)}\n`;
    if (i % userBatchSize === 0) {
      yield res;
      res = '';
    }
  }
};

const homeStringGenerator = function * (homeBatchSize, totalHomeSize) {
  let res = '';
  for (let i = 1; i <= totalHomeSize; i++) {
    res += `${i}|`;
    res += `${faker.commerce.productAdjective()} ${loftSynonyms[Math.floor(Math.random() * loftSynonyms.length)]} ${faker.address.city()}|`;
    res += `$${Math.floor(Math.random() * 400)}|$${Math.floor(Math.random() * 200)}|$${Math.floor(Math.random() * 200)}|${Number.parseFloat(Math.random() * 5).toPrecision(2)}|${Math.floor(Math.random() * 400)}|${Math.ceil(Math.random() * totalUserSize)}\n`;
    if (i % homeBatchSize === 0) {
      yield res;
      res = '';
    }
  }
};

const reservationStringGenerator = function * (reservationBatchSize, threshold) {
  let res = '';
  for (let i = 1; i <= totalHomeSize; i++) {
    res += reservationGeneratorForOneHouse(i, Math.floor(Math.random() * totalUserSize), maxResPerHome);
    if (i % reservationBatchSize === 0) {
      yield res;
      res = '';
    }
  }
};

// ============== Generate generator functions ==============
const userStringBatch = usersStringGenerator(userBatchSize, totalUserSize);
const homeStringBatch = homeStringGenerator(homeBatchSize, totalHomeSize);
const reservationStringBatch = reservationStringGenerator(reservationBatchSize, threshold);

// ============== write file into csv and then to database ==============

// const helperArray = new Array(10);
// const userMigrate = helperArray.reduce((accumulator, item, index) => {
//   return accumulator.then(() => {
//     return fs.appendFile(path.resolve(__dirname, './bin.csv', userStringBatch.next().value));
//   })
// }, Promise.resolve());
const b1 = multibar.create(10, 0);

b1.start();
for (let i = 0; i < 10; i++) {
  fs.appendFileSync(path.resolve(__dirname, './bin1.csv'), userStringBatch.next().value);
  fs.appendFileSync(path.resolve(__dirname, './bin2.csv'), homeStringBatch.next().value);
  b1.increment();
  b1.update();
}
console.log('csv generation completed. Time elapsed: ' + performance.now() - t0);
Promise.promisifyAll(fs, {multiArgs: true});
db.init().then(() => {
  console.log('csv generation completed... copying user table into database...')
  return db.pool.query(`COPY users(user_id, username, rating) FROM '${path.resolve(__dirname, './bin1.csv')}' DELIMITERS '|' CSV`)
}).then(() => {
  console.log('user data migrated... moving home table into database... ');
  return db.pool.query(`COPY homes(home_id, title, priceperadult, priceperchild, cleaningfee, rating, ratingcount, host_id) FROM '${path.resolve(__dirname, './bin2.csv')}' DELIMITERS '|' CSV`);
}).then(() => {
  console.log('home data migrated... moving resrevation table into database... ');
  const helperArray = new Array(10).fill(0);
  let count = 1;
  const res = helperArray.reduce((accumulator, item, index) => {
    return accumulator.then(() => {
      console.log(`${count++}/10`);
      return fs.writeFileAsync(path.resolve(__dirname, './bin3.csv'), reservationStringBatch.next().value).then(() => {
        return db.pool.query(`COPY reservations(start_date, end_date, home_id, adultcount, childrencount, infantcount, user_id, amountpaid, amountowed) FROM '${path.resolve(__dirname, './bin3.csv')}' DELIMITERS '|' CSV`);
      });
    });
  }, Promise.resolve());
  return res;
}).then(() => {
  console.log(`seeding complete. total time: ${performance.now() - t0}`);
  process.exit(0);;
});
