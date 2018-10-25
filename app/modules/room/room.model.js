const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    hid : String,
    roomName : String
});

module.exports = mongoose.model('room', roomSchema);