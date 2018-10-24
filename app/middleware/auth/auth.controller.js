const { authModule } = require('./auth.config');

const Model = require(`../../modules/${ authModule }/${ authModule }.model`);

module.exports.getUserByFields = (login, password, callback) => {
    Model.findOne({ login })
        .then(user => {
            if (!user || password !== user.password) {
                return callback(null, false);
            }

            return callback(null, user);
        })
        .catch(err => callback(err, null));
};

module.exports.getUserByToken = (payload, callback) => {
    Model.findById(payload.id)
        .then(user => {
            if (!user) {
                return callback(null, false)
            }

            return callback(null, user);
        })
        .catch(err => callback(err, null));
};

module.exports.getUidByToken = (payload, callback) => {
    callback(null, payload.id);
};