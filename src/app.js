/** Import MongoDB */
require('./config/init_db');
require('dotenv').config();
const httpStatus= require('http-status');
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const routes = require('./routes/v1');
const helmet = require('helmet');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./middlewares/ApiError');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const passport= require('passport');
require('./config/passport')(passport);
const session= require('express-session')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// http security
app.use(cors());
app.options('*', cors());

// set security HTTP headers
app.use(helmet());

// listen everything in server 
app.use(morgan('dev'));

// passport config
app.use(session({
    secret: 'keyd cat',
    resave: false,
    saveUninitialized: true,
  }))
app.use(passport.initialize());

app.use(passport.session());

app.get('/', (req, res)=>{
    res.send('<h1><a href="/v1/auth/google">Login with google</a> </h1>');  
});
app.get('/dashboard', (req, res, next)=>{
   return res.send(`<h2>Login Successfully with google account</h2>`)
})
// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);
  
// handle error
app.use(errorHandler);

/** __Server set-up__ */
app.listen(process.env.PORT || 8998, () => {
    console.log(`Server running on port: ${process.env.PORT} 🏃🏃🏃`);
});





