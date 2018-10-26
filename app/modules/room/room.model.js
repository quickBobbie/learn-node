const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    hid : String,
    roomName : String
});

roomSchema.post('save', (room, next) => {
    mongoose.model('home').update({ _id : room.hid }, { $push : { rooms : room._id } })
        .then(() => {
            console.log("ok")
            next();
        })
        .catch(err => next(err));
});

module.exports = mongoose.model('room', roomSchema);