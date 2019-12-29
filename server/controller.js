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
module.exports.mongoGetTenLofts = (req, res) => {
  mongoDB.getTenHomes(10000000).then((result) => {
    res.status(200).send(result);
  }).catch((err) => {
    console.log('error retrieving info from get ten lofts... ', err);
    res.status(404).end();
  });
};

module.exports.mongoGetTenUsers = (req, res) => {
  mongoDB.getTenUsers(15000000).then((result) => {
    res.status(200).send(result);
  }).catch((err) => {
    console.log('error retrieving info from get ten lofts... ', err);
    res.status(404).end();
  });
};

module.exports.mongoGetOneLoft = (req, res) => {

};

module.exports.mongoAddOneReservation = (req, res) => {
  let testObj = {
    home_id: 1,
    startDate: 'test-date',
  };
  debugger;
  mongoDB.addOneReservation(testObj)
};

module.exports.mongoReviseReservation = (req, res) => {
// this might be a good place to use compound index and sort the reservation id
// you would also have to add id to each individual reservations
// maybe we don't have to make unique id but just index the start date 
// since for the same house you cannot have 2 reservation on the same date
};

module.exports.mongoDeleteOneReservation = (req, res) => {

};

// ===================Psql===================
module.exports.psqlGetTenLofts = (req, res) => {

};

module.exports.psqlGetOneLoft = (req, res) => {

};

module.exports.psqlAddOneReservation = (req, res) => {

};

module.exports.psqlDeleteOneReservation = (req, res) => {

};