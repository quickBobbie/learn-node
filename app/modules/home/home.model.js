const mongoose = require('mongoose');

const Room = require('../room/room.model');

const homeSchema = mongoose.Schema({
    uid : String,
    homeName : String
});

homeSchema.post('remove', (doc, next) => {
    console.log(doc);
    Room.find({ hid : this._id })
        .then(rooms => {
            rooms.forEach(room => {
                room.remove();
            });

            next();
        })
        .catch(err => next(err));
})

module.exports = mongoose.model('home', homeSchema);