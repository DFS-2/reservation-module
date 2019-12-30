const db = require('./db.js');
const mongoDB = require('../SDC/mongo-db');
const psqlDB = require('../SDC/psql-db');

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
  const home_id = req.body.home_id;
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
    console.log('error encountered making reservation... ', err);
    res.status(404).end();
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
  // mongoDB.
};

// ===================Psql===================
module.exports.psqlGetTenLofts = (req, res, testMode = false) => {

};

module.exports.psqlGetOneLoft = (req, res, testMode = false) => {

};

module.exports.psqlAddOneReservation = (req, res, testMode = false) => {

};

module.exports.psqlDeleteOneReservation = (req, res, testMode = false) => {

};