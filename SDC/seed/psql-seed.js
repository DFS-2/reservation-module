const reservationGenerator = require('./reservationGenerator');
const homeGenerator = require('./homeGenerator');
const userGenerator = require('./userGenerator');
const db = require('../psql-db');
const cliProgress = require('cli-progress');
const b1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const batchSize = 10000;
const totalSize = 1000000;

// look into using generator functions here
// the rough flow would be
  // run the generator a couple of times to generate enough data
  // store them into a temp data structure
  // input them into the database
  // after requests are resolved, have the generator function called again. 

const resQueue = reservationGenerator(batchSize, totalSize);

db.init().then(() => {
  for (let i = 1; i <= totalSize / batchSize; i++) {
    
  }
})

const oneEntry = {
  userInfo: userGenerator(1),
  homeInfo: homeGenerator(1, 1),
  resInfo: resQueue.next().value,
};

console.log(oneEntry.userInfo);
console.log(oneEntry.homeInfo);
console.log(oneEntry.resInfo);

db.init().then(() => {
  return db.create(oneEntry);
}).catch((err) => {
  console.log(err);
})
