const Room = require('./room.model');

module.exports.create = (req, res, next) => {
    req.body.roomName = req.body.roomName.replace(/<[^>]+>/g,'').trim();

    if (!req.body.roomName || req.body.roomName === 'undefined') return res.json({ message : 'Invalid room name.' });

    let room = new Room({
        hid : req.params.homeId,
        roomName : req.body.roomName
    });

    room.save()
        .then(room => res.json({ room }))
        .catch(err => {
            res.status(500);
            res.json({ err });
        });
};

module.exports.update = (req, res) => {
    if (!req.params.roomId) return res.json({ message : "Not room id." });

    req.body.roomName = req.body.roomName.replace(/<[^>]+>/g, '').trim();

    if (!req.body.roomName || req.body.roomName === 'undefined') return res.json({ message : "Invalid room name" });

    Room.findById(req.params.roomId)
        .then(room => {
            if (!room || room.hid !== req.params.homeId) {
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
    if (!req.params.roomId) return res.json({ message : "Not room id." });

    Room.findById(req.params.roomId)
        .then(room => {
            if (!room || room.hid !== req.params.homeId) return res.json({ message : 'Room not found.' });

            room.remove()
                .then(() => res.json({ message : "Room deleted." }))
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