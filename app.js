const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const individualRoutes = require('./routes/individualRoutes');
const organizationRoutes = require('./routes/organizationRoutes');

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected')).catch(console.error);

app.use('/tmf-api/party/v5/individual', individualRoutes);
app.use('/tmf-api/party/v5/organization', organizationRoutes);

module.exports = app;