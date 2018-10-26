const mongoose = require('mongoose');

const Room = require('../room/room.model');

const homeSchema = mongoose.Schema({
    uid : String,
    homeName : String
});

// homeSchema.post('remove', (doc, next) => {
//     Room.find({ hid : doc._id })
//         .then(rooms => {
//             rooms.forEach(room => {
//                 room.remove();
//             });
//
//             next();
//         })
//         .catch(err => next(err));
// });

module.exports = mongoose.model('home', homeSchema);