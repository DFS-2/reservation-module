const db = require('../mongo-db.js');
const { PerformanceObserver, performance } = require('perf_hooks');
const mongoUserGenerator = require('./mongoUserGenerator');
const mongoHomeGenerator = require('./mongoHomeGenerator');
const cliProgress = require('cli-progress');
const b1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const b2 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const userBatchSize = 1500;
const userTotalSize = 15000000;
const homeBatchSize = 1000;
const homeTotalSize = 10000000;

const userList = mongoUserGenerator(userBatchSize, userTotalSize);
const homeList = mongoHomeGenerator(homeBatchSize, homeTotalSize);
b1.start(userTotalSize / userBatchSize, 0);
b2.start(homeTotalSize / homeBatchSize, 0);
for (let i = 0; i < userTotalSize / userBatchSize; i++) {
  b1.increment();
  b1.update();
  db.insertManyUsers(userList.next().value);
}
for (let i = 0; i < homeTotalSize / homeBatchSize; i++) {
  b2.increment();
  b2.update();
  db.insertManyHomes(homeList.next().value);
}

