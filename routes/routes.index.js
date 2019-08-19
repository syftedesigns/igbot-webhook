const express = require('express');
const app = express();

app.use('/webhook', require('./api/webhook/webhook'));

module.exports = app;