const mongoose = require('mongoose');

const Room = require('../room/room.model');

const homeSchema = mongoose.Schema({
    uid : String,
    homeName : String,
    rooms : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'room'
        }
    ]
});

homeSchema.post('remove', (doc, next) => {
    Room.find({ hid : doc._id })
        .then(rooms => {
            rooms.forEach(room => {
                room.remove();
            });

            next();
        })
        .catch(err => next(err));
});

homeSchema.post('save', (doc, next) => {
    const User = mongoose.model('user');
    
    User.findById(doc.uid)
        .then(user => {
            for (let home of user.homes) {
                if (home.toString() === doc._id.toString()) {
                    return next();
                }
            }

            user.homes.push(doc._id);

            user.save()
                .then(() => next())
                .catch(err => next(err));
        })
        .catch(err => next(err));
});

module.exports = mongoose.model('home', homeSchema);