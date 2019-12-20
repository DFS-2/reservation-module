const faker = require('faker');

const loftSynonyms = ['apartment', 'hostel', 'hotel', 'inn', 'lodge', 'motel', 'resort', 'shelter', 'abode', 'castle', 'palace', 'room', 'lodging', 'penthouse', 'studio', 'house', 'mansion'];

const generateOneHome = (home_id, user_id) => {
  return [
    home_id,
    `${faker.commerce.productAdjective()} ${loftSynonyms[Math.floor(Math.random() * loftSynonyms.length)]} ${faker.address.city()}`,
    `$${Math.floor(Math.random() * 400)}`,
    `$${Math.floor(Math.random() * 200)}`,
    `$${Math.floor(Math.random() * 200)}`,
    `${Number.parseFloat(Math.random() * 5).toPrecision(2)}`,
    `${Math.floor(Math.random() * 400)}`,
    user_id,
  ];
};

module.exports = function * (batchSize, totalSize, user_id) {
  const batchBin = [];
  for (let i = 1; i <= totalSize; i++) {
    batchBin.push(generateOneHome(i, user_id));
    if (i % batchSize === 0) {
      yield batchBin;
      batchBin = [];
    }
  }
};