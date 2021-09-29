const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/db');

//.env setup
dotenv.config({ path: '.env' });

//connect DB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('CPD Tracker Server running!');
});

app.listen(PORT, () => {
  console.log(
    `CPD Tracker app running on ${process.env.NODE_ENV} mode listening on http://localhost:${PORT}`
  );
});
