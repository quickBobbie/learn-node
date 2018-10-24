const Home = require('./home.model');

module.exports.get = (req, res) => {
    Home.find({ uid : req.user })
        .then(homes => {
            if (homes.length === 0) {
                return res.json({ message : "You have no houses yet." });
            }

            return res.json({ homes });
        })
        .catch(err => {
            res.status(500);
            return res.json({ err });
        });
};

module.exports.create = (req, res, next) => {
    for (let key in req.body)
        req.body[key] = req.body[key].replace(/<[^>]+>/g,'').trim();

    if (req.body.homeId) return next();

    req.body.uid = req.user;

    let home = new Home(req.body);

    home.save()
        .then(home => {
            return res.json({ home });
        })
        .catch(err => {
            res.status(500);
            return res.json({ err });
        });
};

module.exports.update = (req, res) => {
    Home.findById(req.body.homeId)
        .then(home => {
            if (!home) return res.json({ message : "House does not exist." });

            if (home.uid !== req.user) return res.json({ message : "This is not your home." });

            if (req.body.homeName) home.set('homeName', req.body.homeName);

            if (req.body.rooms) {
                for (let reqRoom of req.body.rooms) {
                    for (let room of home.rooms) {
                        if (reqRoom.id === room._id) room.set('roomName', reqRoom.roomName);
                    }
                }
            }

            home.save()
                .then(home => {
                    return res.json({ home });
                })
                .catch(err => {
                    res.status(500);
                    return res.json({ err });
                })
        })
        .catch(err => {
            res.status(500);
            return res.json({ err });
        })
};