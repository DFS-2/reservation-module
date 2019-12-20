const faker = require('faker');

const generateOneUser = (user_id) => {
  return [
    user_id,
    faker.name.findName(),
    `${Number.parseFloat(Math.random() * 5).toPrecision(2)}`
  ];
};

module.exports = function * (batchSize, totalSize) {
  const batchBin = [];
  for (let i = 1; i <= totalSize; i++) {
    batchBin.push(generateOneUser(i));
    if (i % batchSize === 0) {
      yield batchBin;
      batchBin = [];
    }
  }
};