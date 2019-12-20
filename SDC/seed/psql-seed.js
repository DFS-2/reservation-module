const faker = require('faker');
const reservationsGenerator = require('./reservationsGenerator.js');
const { Loft } = require('../db');
const { Reservation } = require('../db');
const { sequelize } = require('../db');
const cliProgress = require('cli-progress');
const Promise = require('bluebird');
const batchSize = 20000;
const numberOfReduces = 1000000 / batchSize;
const b1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const loftSynonyms = ['apartment', 'hostel', 'hotel', 'inn', 'lodge', 'motel', 'resort', 'shelter', 'abode', 'castle', 'palace', 'room', 'lodging', 'penthouse', 'studio', 'house', 'mansion'];

sequelize.sync({force: true}).then(() => {
  b1.start(numberOfReduces * batchSize, 0);
  const helperArray = new Array(numberOfReduces).fill(0);
  helperArray.reduce((accumulator, currentValue, index) => {
    return accumulator.then(() => {
      const resolveBin = [];
      for (let i = 0; i < batchSize; i++) {
        const subIndex = index * batchSize + i;
        const lodging = {};
        const adjective = faker.commerce.productAdjective();
        const loftSynonym = loftSynonyms[Math.floor(Math.random() * loftSynonyms.length)];
        const city = faker.address.city();
        lodging.id = subIndex + 1;
        lodging.description = `${adjective} ${loftSynonym} in ${city}`;
        lodging.pricePerNight = Math.ceil(Math.random() * (200 - 20) + 20);
        lodging.cleaningFee = (Math.ceil(Math.random() * (3000 - 500) + 500)) / 100;
        lodging.serviceFee = (Math.ceil(Math.random() * (3000 - 500) + 500)) / 100;
        lodging.rating = (Math.ceil(Math.random() * (500 - 100) + 100)) / 100;
        lodging.url = `${adjective}${loftSynonym}${subIndex}`;
        lodging.reviewCount = Math.ceil(Math.random() * (500 - 5) + 5);
        lodging.paragraph = faker.lorem.paragraph();
        const reservations = reservationsGenerator(subIndex);
        resolveBin.push(Loft.create(lodging)
          .then(() => {
            Reservation.bulkCreate(reservations);
          }).then(() => {
            b1.increment();
            b1.update();
          }).catch((err) => {
            console.log('There was an error in seeding: ', err);
          }));
        }
        return Promise.all(resolveBin);
      });
    }, Promise.resolve([]));
  }).then(() => {
  
  }).catch((err) => {
    console.log('there was an error seeding...', err);
  });