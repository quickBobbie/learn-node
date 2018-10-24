const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStraqtegy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const controller = require('./auth.controller');

const config = require('./auth.config');

const jwtOptions = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : config.secret
};

passport.use(new LocalStrategy(config.fields, controller.getUserByFields));

passport.use("jwt-user", new JwtStraqtegy(jwtOptions, controller.getUserByToken));

passport.use('jwt-uid', new JwtStraqtegy(jwtOptions, controller.getUidByToken));

passport.secret = (req, res, next) => {
    req.secret = config.secret;
    next();
};

module.exports = { passport, authparams : config.params };