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
