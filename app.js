const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const conf = require('./server/auth/config');
const User = require('./server/auth/userRepository').User;
const employeesRouter = require('./server/routes/employeeRoute')(passport);
const authRouter = require('./server/routes/userRoute');

const app = express();

app.use(cors());
app.set('views', path.join(__dirname, './resources/views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json()); //this is bodyparser
app.use(express.urlencoded({extended: false})); //this is bodyparser
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './resources/public')));

//authentication
const strategyForJwt = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: conf.secret
    },
    (payload, next) => {
        User.forge({id: payload.id}).fetch().then(result => {
            next(null, result);
        });
    });
passport.use('jwt', strategyForJwt);
app.use(passport.initialize({}));

// Use Token to Access A protected page
app.get('/tokenProtected', passport.authenticate(
    'jwt', {session: false}, null),
    (request, response) => {
        response.send('Authorised!!!!!!!');
    });

app.use('/employees', employeesRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// server error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
