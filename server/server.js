const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/db');
const errorHandler = require('./middleware/error');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

//.env setup
dotenv.config({ path: '.env' });

//connect DB
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Routes
const cert = require('./routes/cert');
const nonVer = require('./routes/nonVer');
const pdf = require('./routes/pdf');
const auth = require('./routes/auth');
const user = require('./routes/user');
const upload = require('./routes/upload');
const admin = require('./routes/admin');

//sanitize data
app.use(mongoSanitize());

//set security headers
app.use(helmet());

//prevent XSS attacks
app.use(xss());

//rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

//Mount routes
app.use('/api/cert', cert);
app.use('/api/nonver', nonVer);
app.use('/api/pdf', pdf);
app.use('/api/auth', auth);
app.use('/api/user', user);
app.use('/api/upload', upload);
app.use('/api/admin', admin);

//Error Handling
app.use(errorHandler);

//Start Server
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('CPD Tracker Server running!');
});

const server = app.listen(PORT, () => {
  console.log(
    `CPD Tracker app running on ${process.env.NODE_ENV} mode listening on http://localhost:${PORT}`
  );
});

//Handle unhandled Promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  //Close server & exit process
  server.close(() => process.exit(1));
});
