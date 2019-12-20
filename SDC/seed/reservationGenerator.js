/* This file randomly generates 1 - 10 reservations upto 90 days from when this script is ran.
It returns an array of objects to be 'bulk created' in the bookings file.
Input: loft_id (int)
Output: bulkReservations (array) */

const moment = require('moment');

const reservationGenerator = (loftId) => {
  const numReservations = Math.floor(Math.random() * 10) + 1;
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
    const reservation = {};
    reservation.home_id = loftId;
    reservation.startDate = moment().add(reservationDates[j], 'days').format('YYYY[-]MM[-]DD');
    reservation.endDate = moment().add(reservationDates[j + 1], 'days').format('YYYY[-]MM[-]DD');
    reservations.push(reservation);
  }
  return reservations;
};

module.exports = function * (batchSize, totalSize) {
  if (totalSize % batchSize !== 0) {
    throw new Error('total size needs to be divisible by batch size');
  }
  const batchBin = [];
  for (let i = 1; i <= totalSize; i++) {
    // construct object to be pushed here
    batchBin.push(reservationGenerator(i));
    if (i % batchSize === 0) {
      yield batchBin;
      batchBin = [];
    }
  }
};
