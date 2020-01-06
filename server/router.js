// require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const controller = require('./controller.js');
const cors = require('cors');
const compression = require('compression');
const routes = require('./routes');

const app = express();
const port = 8080;

app.use(compression());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/loaderio-41a33d19db0620e000e51f4bb01c562d.txt', express.static(path.join(__dirname, '../loaderio/loaderio-41a33d19db0620e000e51f4bb01c562d.txt')));
app.use('/', express.static(path.join(__dirname, '../public')));

app.use('/', routes);

app.listen(port, () => console.log(`Lemon Loft reservation server listening on port ${port}!`));
