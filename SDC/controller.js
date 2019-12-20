const db = require('./db.js');

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
