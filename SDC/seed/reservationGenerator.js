/* This file randomly generates 1 - 10 reservations upto 90 days from when this script is ran.
It returns an array of objects to be 'bulk created' in the bookings file.
Input: loft_id (int)
Output: bulkReservations (array) */

const moment = require('moment');

module.exports = (home_id, user_id) => {
  const numReservations = Math.floor(Math.random() * 3) + 1;
  let numDays = numReservations * 2;
  const reservationDates = [];
  let lastDay = 0;
  while (numDays--) {
    const day = lastDay + Math.ceil(Math.random() * (90 - numDays - lastDay));
    lastDay = day;
    reservationDates.push(day);
  }

  const reservations = [];
  for (let j = 0; j < reservationDates.length; j += 2) {
    const reservation = [
      moment().add(reservationDates[j], 'days').format('YYYY[-]MM[-]DD'),
      moment().add(reservationDates[j + 1], 'days').format('YYYY[-]MM[-]DD'),
      home_id,
      Math.floor(Math.random() * 5),
      Math.floor(Math.random() * 5),
      Math.floor(Math.random() * 5),
      user_id,
      `${Number.parseFloat(Math.random() * 200).toPrecision(2)}`,
      `${Number.parseFloat(Math.random() * 400).toPrecision(2)}`,
    ];
    reservations.push(reservation);
  }
  return reservations;
};

// module.exports = function * (batchSize, totalSize, home_id, user_id) {
//   if (totalSize % batchSize !== 0) {
//     throw new Error('total size needs to be divisible by batch size');
//   }
//   const batchBin = [];
//   for (let i = 1; i <= totalSize; i++) {
//     // construct object to be pushed here
//     batchBin.push(reservationGenerator(home_id, user_id));
//     if (i % batchSize === 0) {
//       yield batchBin;
//       batchBin = [];
//     }
//   }
// };
