const db = require('../mongo-db.js');
const { PerformanceObserver, performance } = require('perf_hooks');
const mongoUserGenerator = require('./mongoUserGenerator');
const mongoHomeGenerator = require('./mongoHomeGenerator');
const cliProgress = require('cli-progress');
const multibar = new cliProgress.MultiBar({
  clearOnComplete: false,
  hideCursor: true
}, cliProgress.Presets.shades_grey);
const userTotalSize = 15000000;
const userBatchSize = userTotalSize / 20;
const homeTotalSize = 10000000;
const homeBatchSize = homeTotalSize / 20;
const b1 = multibar.create(userTotalSize / userBatchSize, 0);
const b2 = multibar.create(homeTotalSize / homeBatchSize, 0);

const userList = mongoUserGenerator(userBatchSize, userTotalSize);
const homeList = mongoHomeGenerator(homeBatchSize, homeTotalSize);
b1.start(userTotalSize / userBatchSize, 0);

const helperArray1 = new Array(userTotalSize / userBatchSize).fill(0);
const helperArray2 = new Array(homeTotalSize / homeBatchSize).fill(0);
helperArray1.reduce((accumulator, item, index) => {
  return accumulator.then(() => {
    return db.insertManyUsers(userList.next().value)
      }).then(() => {
        b1.increment();
        b1.update();
      }).catch((err) => {
        console.log('insertmanyusers err ', err);
      });
}, Promise.resolve());

helperArray2.reduce((accumulator, item, index) => {
  return accumulator.then(() => {
    return db.insertManyHomes(homeList.next().value)
      }).then(() => {
        b2.increment();
        b2.update();
      }).catch((err) => {
        console.log('insertmanyhomes err, ', err);
      })
}, Promise.resolve())


// for (let i = 0; i < userTotalSize / userBatchSize; i++) {
//   b1.increment();
//   b1.update();
//   db.insertManyUsers(userList.next().value);
// }
// for (let i = 0; i < homeTotalSize / homeBatchSize; i++) {
//   b2.increment();
//   b2.update();
//   db.insertManyHomes(homeList.next().value);
// }

