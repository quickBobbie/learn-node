const Home = require('./home.model');

module.exports.validateHomeId = (req, res, next) => {
    if (!req.params.homeId) return res.json({ message : "Not home id." });

    Home.findById(req.params.homeId)
        .then(home => {
            if (!home || home.uid !== req.user) return res.json({ message : "Home not found." });

            req.homeId = req.params.homeId

            return next();
        })
        .catch(err => {
            res.status(500);
            res.json({ err });
        });
}