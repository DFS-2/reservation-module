const express = require('express');
const routes = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const controller = require('./controller.js');


// ================== sequelize ==================
routes.get('/api/reservations/allLofts', (req, res) => {
  controller.getAllLofts(req, res);
});

routes.get('/api/reservations/:hostId', (req, res) => {
  controller.getOneLoft(req, res);
});

routes.post('/api/reservations/:hostId', (req, res) => {
  controller.createOneLoft(req, res);
});

// ================== mongo ==================
routes.get('/api/reservations/mongo/tenrandomlofts', (req, res) => {
  // controller.mongoGetTenLofts(req, res);
  controller.mongoAddOneReservation(req, res);
});

module.exports = routes;