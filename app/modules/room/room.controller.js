const Home = require('../home/home.model');
const Room = require('./room.model');

module.exports.save = (req, res) => {
    req.body.roomName = req.body.roomName.replace(/<[^>]+>/g,'').trim();

    if (!req.body.homeId) return res.json({ message : "Not home id." });
    if (!req.body.roomName || req.body.roomName === 'undefined') return res.json({ message : 'Invalid room name.' });

    Home.findById(req.body.homeId)
        .then(home => {
            if (!home || home.uid !== req.user) {
                return res.json({ message : "Home not found." });
            }

            let room = new Room({
                homeId : home._id,
                roomName : req.body.roomName
            });

            room.save()
                .then(room => res.json({ room }))
                .catch(err => {
                    res.status(500);
                    res.json({ err });
                })
        })
        .catch(err => {
            res.status(500);
            res.json({ err });
        })
};

module.exports.update = (req, res) => {
    req.body.roomName = req.body.roomName.replace(/<[^>]+>/g,'').trim();

    if (!req.body.roomId) return res.json({ message : "Not room id." });
    if (!req.body.roomName || req.body.roomName === 'undefined') return res.json({ message : "Invalid room name" });

    Room.findById(roomId)
        .then(room => {
            if (!room) {
                return res.json({ message : "Room not found." });
            }

            room.set('roomName', req.body.roomName);

            room.save()
                .then(room => res.json({ room }))
                .catch(err => {
                    res.status(500);
                    res.json({ err });
                })
        })
        .catch(err => {
            res.status(500);
            res.json({ err });
        })
};

module.exports.delete = (req, res) => {

};