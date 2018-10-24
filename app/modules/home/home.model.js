const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
   roomName : String
});

const homeSchema = mongoose.Schema({
    uid : String,
    homeName : String,
    rooms : [ roomSchema ]
});

module.exports = mongoose.model('home', homeSchema);