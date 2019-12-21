const { PerformanceObserver, performance } = require('perf_hooks');
const reservationGenerator = require('./reservationGenerator');
const homeGenerator = require('./homeGenerator');
const userGenerator = require('./userGenerator');
const db = require('../psql-db');
const cliProgress = require('cli-progress');
const Promise = require('bluebird');
const t0 = performance.now();
const b1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const batchSize = {
  users: 10000,
  homes: 10000,
  reservations: 10000
};
const totalSize = {
  users: 15000000,
  homes: 10000000,
  reservations: 100000000
}
// look into using generator functions here
// the rough flow would be
  // run the generator a couple of times to generate enough data
  // store them into a temp data structure
  // input them into the database
  // after requests are resolved, have the generator function called again. 
  
const userList = userGenerator(batchSize.users, totalSize.users);
// console.log(userList.next().value.constructor);
db.init().then(() => {
  // seeding users table
  console.log('seeding users table... ');
  const promiseBin = [];
  for (let i = 1; i <= totalSize.users / batchSize.users; i++) {
    promiseBin.push(db.createUsers(userList.next().value));
  }
  return Promise.all(promiseBin);
}).then(() => {
  // seeding homes table
  console.log('seeding homes table... ');
  let homeBin = [];
  const promiseBin = [];
  for (let i = 1; i <= totalSize.homes; i++) {
    homeBin.push(homeGenerator(i, Math.ceil(Math.random() * totalSize.users)));
    if (i % batchSize.homes === 0) {
      promiseBin.push(db.createHomes(homeBin));
      homeBin = [];
    }
  }
  return Promise.all(promiseBin);
}).then(() => {
  // seeding reservations
  console.log('seeding reservations table... ');
  let resBin = [];
  const promiseBin = [];
  for (let i = 1; i <= totalSize.reservations; i++) {
    resBin.push(reservationGenerator(Math.ceil(Math.random() * totalSize.homes, Math.ceil(Math.random() * totalSize.users))));
    if (i % batchSize.reservations === 0) {
      promiseBin.push(db.createReservations(resBin));
      resBin = [];
    }
  }
  return Promise.all(promiseBin);
}).then(() => {
  console.log('done. check database now');
  console.log(`this took ${performance.now() - t0}`);
  process.exit(0);
})
.catch((err) => {
  console.log('error while seeding... ', err);
});