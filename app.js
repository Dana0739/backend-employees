const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const conf = require('./resources/config/config');
const User = require('./server/auth/userRepository').User;
const employeesRouter = require('./server/routes/employeeRoute')(passport);
const authRouter = require('./server/routes/userRoute');
const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

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

app.use('/employees', employeesRouter);
app.use('/auth', authRouter);
// app.use(errorHandler);

//todo my own handler
//todo handle unhendeled exception

// function errorHandler(err, req, res, next) {
//     if (res.headersSent) {
//         return next(err);
//     }
//     res.status(500);
//     res.render('error', { error: err });
// }

module.exports = app;
