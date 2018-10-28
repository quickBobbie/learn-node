const Room = require('./room.model');

const messages = require('./room.messages');

module.exports.create = (req, res, next) => {
    req.body.roomName = req.body.roomName.replace(/<[^>]+>/g,'').trim();

    if (!req.body.roomName || req.body.roomName === 'undefined') {
        return res.json({ message : messages.noname });
    }

    let room = new Room({
        hid : req.homeId,
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
    if (!req.params.roomId) return res.json({ message : messages.noid });

    req.body.roomName = req.body.roomName.replace(/<[^>]+>/g, '').trim();

    if (!req.body.roomName || req.body.roomName === 'undefined') return res.json({ message : messages.noname });

    Room.findById(req.params.roomId)
        .then(room => {
            if (!room || room.hid !== req.homeId) {
                return res.json({ message : messages.noroom });
            }

            room.set('roomName', req.body.roomName);

            room.save()
                .then(room => res.json({ message : messages.success, roomName : room.roomName }))
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
    if (!req.params.roomId) return res.json({ message : messages.noid });

    Room.findById(req.params.roomId)
        .then(room => {
            if (!room || room.hid !== req.homeId) {
                return res.json({ message : messages.noroom });
            }

            room.remove()
                .then(() => res.json({ message : messages.success }))
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