const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    hid : String,
    roomName : String
});

roomSchema.post('save', (doc, next) => {
    const Home = mongoose.model('home')
    
    Home.findById(doc.hid)
        .then(home => {
            for (let room of home.rooms) {
                if (room.toString() === doc._id.toString()) {
                    return next();
                }
            }

            home.rooms.push(doc._id);

            home.save()
                .then(() => next())
                .catch(err => next(err));
        })
        .catch(err => next(err));
});

module.exports = mongoose.model('room', roomSchema);