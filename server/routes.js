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
  controller.mongoGetTenLofts(req, res, true);
  // controller.mongoAddOneReservation(req, res);
});

routes.get('/api/reservations/mongo/tenrandomlofts-test', (req, res) => {
  controller.mongoAddOneReservation(req, res, true);
});

routes.get('/api/reservations/mongo/oneloft/:id', (req, res) => {
  controller.mongoGetOneLoft(req, res);
});

// ================== psql ==================
// ================== CREATE ==================
routes.post('/api/reservations/psql/addoneres', (req, res) => {
  controller.psqlAddOneReservation(req, res);
});

// ================== READ ==================
routes.get('/api/reservations/psql/tenrandomhomes', (req, res) => {
  controller.psqlGetTenHomes(req, res);
  // controller.psqlAddOneReservation(req, res);
});

routes.get('/api/reservations/psql/onehome/:id', (req, res) => {
  controller.psqlGetOneHome(req, res);
});

// ================== UPDATE ==================

// ================== DELETE ==================
module.exports = routes;