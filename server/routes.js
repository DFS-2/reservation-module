const express = require('express');
const routes = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
// const controller = require('./controller.js');


// ================== retrieval ==================
routes.get('/api/reservations/allLofts', (req, res) => {
  controller.getAllLofts(req, res);
});

routes.get('/api/reservations/:hostId', (req, res) => {
  controller.getOneLoft(req, res);
});

// ================== create ==================
routes.post('/api/reservations/:hostId', (req, res) => {
  controller.createOneLoft(req, res);
});

module.exports = routes;