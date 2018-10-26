const Home = require('./home.model');

module.exports.get = (req, res) => {
    Home.find({ uid : req.user })
        .populate('room')
        .exec()
        .then(homes => {
            res.json({ homes })
        })
        .catch(err => {
            res.status(500);
            res.json({ err });
        });
}

module.exports.create = (req, res) => {
    for (let key in req.body)
        req.body[key] = req.body[key].replace(/<[^>]+>/g,'').trim();

    req.body.uid = req.user;

    let home = new Home(req.body);

    console.log(Home)

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
    if (!req.params.id) return res.json({ message : "Not home id." });

    Home.findById(req.params.id)
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

module.exports.delete = (req, res) => {
    if (!req.params.id) return res.json({ message : "Not home id." });

    Home.findById(req.params.id)
        .then(home => {
            if (!home || home.uid !== req.user) return res.json({ message : "Home not found." });

            home.remove()
                .then(() => res.json({ message : "Home deleted." }))
                .catch(err => {
                    res.status(500);
                    res.json({ err });
                })
        })
};

module.exports.validateHomeId = (req, res, next) => {
    if (!req.params.homeId) return res.json({ message : "Not home id." });

    Home.findById(req.params.homeId)
        .then(home => {
            if (!home || home.uid !== req.user) return res.json({ message : "Home not found.", user : req.user });

            req.homeId = req.params.homeId

            return next();
        })
        .catch(err => {
            res.status(500);
            res.json({ err });
        });
}