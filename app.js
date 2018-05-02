const express = require('express');
const app = express();

let routes = require('./routes/index');
let countryRoutes = require('./routes/country');

app.use(express.static('public'));
app.use('/', routes);
app.use('/', countryRoutes);

module.exports = app;
