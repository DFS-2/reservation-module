/* This file randomly generates 1 - 10 reservations upto 90 days from when this script is ran.
It returns an array of objects to be 'bulk created' in the bookings file.
Input: loft_id (int)
Output: bulkReservations (array) */

const moment = require('moment');

module.exports = (loftId) => {
  const numReservations = Math.floor(Math.random() * 10) + 1;
  const numDays = numReservations * 2;
  const days = {};
  const reservations = [];
  for (let i = 0; i < numDays; i++) {
    let day = Math.ceil(Math.random() * 90);
    while (days[day] === true) {
      day = Math.ceil(Math.random() * 90);
    }
    days[day] = true;
  }
  const reservationDates = Object.keys(days).map((element) => Number(element));
  reservationDates.sort((a, b) => a - b);
  for (let j = 0; j < reservationDates.length; j += 2) {
    const reservation = {};
    reservation.loft_id = loftId;
    reservation.startDate = moment().add(reservationDates[j], 'days').format('YYYY[-]MM[-]DD');
    reservation.endDate = moment().add(reservationDates[j + 1], 'days').format('YYYY[-]MM[-]DD');
    reservations.push(reservation);
  }
  return reservations;
};
