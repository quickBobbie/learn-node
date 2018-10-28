const Home = require('./home.model');

const messages = require('./home.messages');

module.exports.create = (req, res) => {
    for (let key in req.body)
        req.body[key] = req.body[key].replace(/<[^>]+>/g,'').trim();

    let home = {
        uid : req.user,
        homeName : req.body.homeName
    };

    Home.create(home)
        .then(home => res.json({ home }))
        .catch(err => {
            res.status(500);
            res.json({ err });
        })
};

module.exports.update = (req, res) => {
    if (!req.params.id) return res.json({ message : messages.noid });
    if (!req.body.homeName) return res.json({ message : messages.noname });

    Home.findById(req.params.id)
        .then(home => {
            if (!home || home.uid !== req.user) return res.json({ message : messages.nohome });

            home.set("homeName", req.body.homeName);

            home.save()
                .then(() => res.json({ message : messages.success, homeName : home.homeName }))
                .catch(err => {
                    res.status(500);
                    res.json({ err });
                })
        })
        .catch(err => {
            res.status(500);
            return res.json({ err });
        })
};

module.exports.delete = (req, res) => {
    if (!req.params.id) return res.json({ message : messages.noid });

    Home.findById(req.params.id)
        .then(home => {
            if (!home || home.uid !== req.user) return res.json({ message : messages.nohome });

            home.remove()
                .then(() => res.json({ message : messages.success }))
                .catch(err => {
                    res.status(500);
                    res.json({ err });
                })
        })
};