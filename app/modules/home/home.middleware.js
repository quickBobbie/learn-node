const Home = require('./home.model');

const messages = require('./home.messages');

module.exports.validateHomeId = (req, res, next) => {
    if (!req.params.homeId) return res.json({ message : messages.noid });

    Home.findById(req.params.homeId)
        .then(home => {
            if (!home || home.uid !== req.user) return res.json({ message : messages.nohome });

            req.homeId = req.params.homeId

            return next();
        })
        .catch(err => {
            res.status(500);
            res.json({ err });
        });
}