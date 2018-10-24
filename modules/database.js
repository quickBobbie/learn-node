const mongoose = require('mongoose');

const { database } = require('../config');

module.exports.connect = () => {
    let connectionLink = `mongodb://${ database.host }:${ database.port }/${ database.name }`;

    mongoose.connect(connectionLink, database.params);

    return mongoose.connection;
};