const jwt = require('jsonwebtoken');

const User = require('./user.model');

const messages = require('./user.messages');

module.exports.signup = (req, res) => {
    for (let key in req.body) {
        req.body[key] = req.body[key].replace(/<[^>]+>/g,'').trim();

        if (req.body[key] === 'undefined' || !req.body[key]) delete req.body[key];
    }

    let requiredFields = [req.body.login, req.body.password, req.body.email];

    for(let field of requiredFields){
        if (!field) {
            return res.json({ message : messages.required });
        }
    }

    if (req.body.email.indexOf('@') === -1 || req.body.email.indexOf('.') === -1) {
        return res.json({ message : messages.email });
    }

    User.findOne({ login : req.body.login })
        .exec()
        .then(user => {
            if (user) {
                return res.json({ message : messages.user });
            }

            if (new Date(req.body.birthday) > new Date()) {
                delete req.body.birthday;
            }

            let newUser = new User(req.body);

            newUser.save()
                .then(user => {
                    const token = jwt.sign({ id : user._id }, req.secret);

                    user = user.toJSON();

                    delete user.login;
                    delete user.password;
                    delete user.email;

                    res.json({ user, token });
                })
                .catch(err => {
                    res.status(500);
                    res.json({ err });
                });
        })
        .catch(err => {
            res.status(500);
            res.json({ err });
        })
};

module.exports.signin = (req, res) => {
    const token = jwt.sign({ id : req.user._id }, req.secret);

    req.user = req.user.toJSON();

    delete req.user.login;
    delete req.user.password;
    delete req.user.email;

    res.json({ user : req.user, token });
};

module.exports.updateData = (req, res) => {
    let data = {};

    for (let key in req.body) {
        req.body[key] = req.body[key].replace(/<[^>]+>/g,'').trim();

        if (
            req.body[key] === 'undefined' ||
            !req.body[key] ||
            req.body[key] === req.user[key]
        ) {
            delete req.body[key];
        } else {
            data[key] = req.body[key];
        }
    }

    if (Object.keys(data).length === 0) {
        return res.json({ message : messages.data });
    }

    if (Object.keys(data).length === 1 && data.birthday){
        let reqDate = new Date(data.birthday);
        let userDate = new Date(data.birthday);
        let now = new Date();

        if (reqDate === userDate || reqDate > now){
            return res.json({ message : messages.birthday });
        }
    }

    User.findById(req.user._id)
        .then(user => {
            if (!user) {
                return res.json({ message : messages.nouser });
            }

            if (data.birthday && new Date(data.birthday) > new Date()) {
                delete data.birthday;
            } else {
                data.birthday = new Date(data.birthday);
            }

            for (let key in data) {
                user.set(key, data[key]);
            }

            user.save()
                .then(() => res.json({ message : messages.success, data }))
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

module.exports.updatePassword = (req, res) => {
    for (let key in req.body) {
        req.body[key] = req.body[key].replace(/<[^>]+>/g,'').trim();

        if (req.body[key] === "" || req.body[key] === 'undefined' || !req.body[key]) delete req.body[key];
    }

    if (!req.body.oldPassword || !req.body.newPassword) {
        return res.json({ message : messages.required });
    }

    if (req.body.oldPassword !== req.user.password) {
        return res.json({ message : messages.oldpwd });
    }

    if (req.body.oldPassword === req.body.newPassword && req.user.password === req.body.newPassword) {
        return res.json({ message : messages.newpwd });
    }

    User.findById(req.user._id)
        .then(user => {
            user.set('password', req.body.newPassword);

            user.save()
                .then(() => {
                    return res.json({ message : messages.success });
                })
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
    User.findOne({ _id : req.user })
        .then(user => {
            user.remove();
            res.json({ message : messages.success })
        })
        .catch(err => {
            res.status(500);
            res.json({ err });
        })
};