const db = require('../mongo-db.js');
const { PerformanceObserver, performance } = require('perf_hooks');
const mongoUserGenerator = require('./mongoUserGenerator');
const mongoHomeGenerator = require('./mongoHomeGenerator');
const userTotalSize = 15000000;
// const userTotalSize = 20;
const userBatchSize = userTotalSize / 25;
const homeTotalSize = 10000000;
// const homeTotalSize = 20;
const homeBatchSize = homeTotalSize / 25;
let userCounter = 0;
let homeCounter = 0;

const userList = mongoUserGenerator(userBatchSize, userTotalSize);
const homeList = mongoHomeGenerator(homeBatchSize, homeTotalSize, userTotalSize);

const helperArray1 = new Array(userTotalSize / userBatchSize).fill(0);
const helperArray2 = new Array(homeTotalSize / homeBatchSize).fill(0);
helperArray1.reduce((accumulator, item, index) => {
  return accumulator.then(() => {
    const nextInput = userList.next().value;
    return db.insertManyUsers(nextInput)
      }).then(() => {
        console.log(`user creation progress: ${++userCounter}/${userTotalSize / userBatchSize}`);
        // if (index === helperArray1.length - 1) {
        //   return db.
        // }
      }).catch((err) => {
        console.log('insertmanyusers err ', err);
      });
}, Promise.resolve());

helperArray2.reduce((accumulator, item, index) => {
  return accumulator.then(() => {
    const nextInput = homeList.next().value;
    return db.insertManyHomes(nextInput);
      }).then(() => {
        console.log(`home creation progress: ${++homeCounter}/${homeTotalSize / homeBatchSize}`);
      }).catch((err) => {
        console.log('insertmanyhomes err, ', err);
      })
}, Promise.resolve());
