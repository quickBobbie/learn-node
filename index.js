const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const app = express();

const server = require('./modules/server');
const database = require('./modules/database');
const router = require('./modules/router');

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(passport.initialize());
app.use(router);

server.start(app);

let db = database.connect();

db.on('open', () => {
    console.log(`Connect [${ db.name }] database`);
})

db.on('error', () => {
    console.log(`[${ db.name }] connection error`);
})