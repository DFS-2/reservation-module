const faker = require('faker');
const mongoResGenerator = require('./mongoResGenerator');
const loftSynonyms = ['apartment', 'hostel', 'hotel', 'inn', 'lodge', 'motel', 'resort', 'shelter', 'abode', 'castle', 'palace', 'room', 'lodging', 'penthouse', 'studio', 'house', 'mansion'];



const generateOneHome = (home_id, totalUserNumber) => {
  return {
    _id: home_id,
    user_id: Math.floor(Math.random() * totalUserNumber),
    title: `${faker.commerce.productAdjective()} ${loftSynonyms[Math.floor(Math.random() * loftSynonyms.length)]} ${faker.address.city()}`,
    priceperadult: `$${Math.floor(Math.random() * 400)}`,
    priceperchild: `$${Math.floor(Math.random() * 400)}`,
    cleaningfee: `$${Math.floor(Math.random() * 400)}`,
    rating: `${Number.parseFloat(Math.random() * 5).toPrecision(2)}`,
    ratingcount: `${Math.floor(Math.random() * 400)}`,
    reservations: mongoResGenerator(Math.floor(home_id, Math.floor(Math.random() * 15000000))),
  };
};

module.exports = function * (batchSize, totalSize, totalUserNumber) {
  let batchBin = [];
  for (let i = 1; i <= totalSize; i++) {
    batchBin.push(generateOneHome(i, totalUserNumber));
    if (i % batchSize === 0) {
      yield batchBin;
      batchBin = [];
    }
  }
};