require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authRoutes =       require('./routes/auth');
const companiesRoutes =  require('./routes/companies');
const hitRoutes =        require('./routes/hit');
const ccControlsRoutes = require('./routes/cc-controls');
const cattlesRoutes =    require('./routes/cattles');

// const cowsRoutes =      require('./routes/cows');
// const rinderRoutes =    require('./routes/rind');

const app = express();

mongoose.connect('mongodb+srv://' +
  process.env.DB_USER + ':' +
  process.env.DB_PASS + '@' +
  process.env.DB_HOST + '/' +
  process.env.DB_NAME + '?retryWrites=true&w=majority'
  , { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.error('Database connection failed!');
  });

app.use(bodyParser.json({limit: '1mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '1mb', extended: true}));
app.use("/upload", express.static(path.join('backend/upload')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/hit', hitRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/cc-controls', ccControlsRoutes);
app.use('/api/cattles', cattlesRoutes);

// app.use('/api/cows', cowsRoutes);
// app.use('/api/rinder', rinderRoutes);

module.exports = app;

