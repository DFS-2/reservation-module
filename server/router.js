const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const controller = require('./controller.js');
const cors = require('cors');
const compression = require('compression');
const routes = require('./routes');

const app = express();
const port = 3001;

app.use(compression());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../public')));
// app.use('/bundle.js',express.static(path.join(__dirname, '../public/bundle.js')));
// app.use('/:hostId', express.static(path.join(__dirname, '../public')));

app.use('/', routes);

// app.get('/api/reservations/allLofts', (req, res) => {
//   // controller.getAllLofts(req, res);
// });

// app.get('/api/reservations/:hostId', (req, res) => {
//   // controller.getOneLoft(req, res);
// });

// app.post('/api/reservations/:hostId', (req, res) => {
//   // controller.addOneReservation(req, res);
// });

app.listen(port, () => console.log(`Lemon Loft reservation server listening on port ${port}!`));
