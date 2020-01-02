const db = require('./db.js');
const mongoDB = require('../SDC/mongo-db');
const psqlDB = require('../SDC/psql-db');
const moment = require('moment');

// ===================Sequelize===================
module.exports.getAllLofts = (req, res) => {
  db.getAllLofts((err, data) => {
    if (err) {
      console.log('Getting all lofts data err: ', err);
      res.status(400).send();
    } else {
      res.status(200).send(JSON.stringify(data));
    }
  });
};

module.exports.getOneLoft = (req, res) => {
  db.getOneLoft(req.params.hostId, (err, data) => {
    if (err) {
      console.log('Getting loft data err: ', err);
      res.status(400).send();
    } else {
      res.status(200).send(JSON.stringify(data[0]));
    }
  });
};

module.exports.addOneReservation = (req, res) => {
  const addObj = {
    loft_id: Number(req.params.hostId),
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  };
  db.addOneReservation(addObj, (err, data) => {
    if (err) {
      console.log('Error adding reservation to db: ', err);
      res.status(400).send();
    } else {
      res.status(201).send(data);
    }
  });
};

// ===================Mongo===================
module.exports.mongoGetTenLofts = (req, res, testMode = false) => {
  mongoDB.getTenHomes(10000000, testMode).then((result) => {
    res.status(200).send(result);
  }).catch((err) => {
    console.log('error retrieving info from get ten lofts... ', err);
    res.status(404).end();
  });
};

module.exports.mongoGetTenUsers = (req, res, testMode = false) => {
  mongoDB.getTenUsers(15000000, testMode).then((result) => {
    res.status(200).send(result);
  }).catch((err) => {
    console.log('error retrieving info from get ten lofts... ', err);
    res.status(404).end();
  });
};

module.exports.mongoGetOneLoft = (req, res, testMode = false) => {
  const home_id = req.params.id;
  mongoDB.getOneHome(home_id, testMode).then((result) => {
    res.status(200).send(result);
  }).catch((err) => {
    console.log('error retrieving info from get one loft... ', err);
    res.status(404).end();
  });
};

// this probably needs changing to allow for detection of invalid reservations
module.exports.mongoAddOneReservation = (req, res, testMode = false) => {
  const reservation = req.body.reservation;
  mongoDB.addOneReservation(reservation).then((result) => {
    res.status(200).send('reservation has been added');
  }).catch((err) => {
    console.log('error encountered while making reservation... ', err);
    res.status(500).end();
  });
};

module.exports.mongoReviseReservation = (req, res, testMode = false) => {
// this might be a good place to use compound index and sort the reservation id
// you would also have to add id to each individual reservations
// maybe we don't have to make unique id but just index the start date 
// since for the same house you cannot have 2 reservation on the same date
};

module.exports.mongoDeleteOneReservation = (req, res, testMode = false) => {
  const reservation = req.body.reservation;
  mongoDB.deleteOneReservation(reservation, testMode).then((result) => {
    res.status(200).send('reservation has been deleted');
  }).catch((err) => {
    console.log('error encountered while deleting reservation... ', err);
    res.status(500).end();
  });
};

// ===================Psql===================
module.exports.psqlGetTenHomes = (req, res, testMode = false) => {
  psqlDB.getTenHomes(10000000, testMode).then((result) => {
    // expected return type: array
    res.status(200).send(result);
  }).catch((err) => {
    console.log('psql error while retrieving 10 homes... ', err);
    res.status(500).end();
  });
};

module.exports.psqlGetOneHome = (req, res, testMode = false) => {
  const home_id = req.params.id;
  psqlDB.getOneHome(home_id, testMode).then((result) => {
    // expected return type: array
    res.status(200).send(result);
  }).catch((err) => {
    console.log('psql error while retrieving one home... ', err);
    res.status(500).end();
  });
};

module.exports.psqlAddOneReservation = (req, res, testMode = false) => {
  // to be called by a post request
  // const reservationObj = req.params.reservationObj;
  const reservationObj = {
    start_date: `'${moment().add(2, 'days').format('YYYY[-]MM[-]DD')}'`,
    end_date: `'${moment().add(4, 'days').format('YYYY[-]MM[-]DD')}'`,
    home_id: 1,
    adultcount: 1000,
    childrencount: 1000,
    infantcount: 10000,
    user_id: 15000004,
    amountpaid: '20',
    amountowed: '20'
  };
  psqlDB.addOneReservation(reservationObj).then((result) => {
    debugger;
    res.status(200).send(result);
  }).catch((err) => {
    console.log('psql error while adding one reservation...', err);
    res.status(500).end();
  });
};

module.exports.psqlDeleteOneReservation = (req, res, testMode = false) => {
  const { home_id, start_date } = req.body;
  psqlDB.deleteOneReservation(home_id, start_date).then((result) => {
    debugger;
    res.status(200).send(result);
  }).catch((err) => {
    console.log('psql error while deleting one reservation...', err);
    res.status(500).end();
  })
};