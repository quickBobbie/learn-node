const jwt = require('jsonwebtoken');

const User = require('./user.model');

module.exports.signup = (req, res, next) => {
    for (let key in req.body) {
        req.body[key] = req.body[key].replace(/<[^>]+>/g,'').trim();

        if (req.body[key] === 'undefined' || !req.body[key]) delete req.body[key];
    }

    let requiredFields = [req.body.login, req.body.password, req.body.email];

    for(let field of requiredFields){
        if (!field) {
            res.json({ message : "Required fields." });
            return next();
        }
    }

    if (req.body.email.indexOf('@') === -1 || req.body.email.indexOf('.') === -1) {
        res.json({ message : "Invalid email." });
        return next();
    }

    User.findOne({ login : req.body.login })
        .then(user => {
            if (user) {
                res.json({ message : "User exists." });
                return next();
            }

            let status = "";

            if (new Date(req.body.birthday) > new Date()) {
                status = "Date of birth can not be more than today's date.";

                delete req.body.birthday;
            }

            let newUser = new User(req.body);

            newUser.save()
                .then(user => {
                    const token = jwt.sign({ id : user._id }, req.secret);

                    user = user.toJSON();

                    delete user.login;
                    delete  user.password;

                    return res.json({ user, token, status });
                })
                .catch(err => {
                    res.status(500);
                    res.json({ err });
                    return next();
                });
        })
        .catch(err => {
            res.status(500);
            res.json({ err });
            return next();
        })
};

module.exports.signin = (req, res) => {
    const token = jwt.sign({ id : req.user._id }, req.secret);

    req.user = req.user.toJSON();

    delete req.user.login;
    delete req.user.password;

    res.json({ user : req.user, token })
};

module.exports.updateData = (req, res, next) => {
    let data = {};

    for (let key in req.body) {
        req.body[key] = req.body[key].replace(/<[^>]+>/g,'').trim();

        if (
            req.body[key] === 'undefined' ||
            !req.body[key] ||
            req.body[key] === req.user[key]
        ) {
            delete req.body[key];
        } else if (key !== "oldPassword" || key !== "newPassword") data[key] = req.body[key];
    }

    if (Object.keys(req.body).length === 2 && req.body.oldPassword && req.body.newPassword) return next();

    if (Object.keys(req.body).length === 0) {
        return res.json({ message : "It is not possible to change the data, as they are empty, or they coincide with the initial ones." });
    }

    if (Object.keys(req.body).length === 1 && req.body.birthday){
        let reqDate = new Date(req.body.birthday);
        let userDate = new Date(req.user.birthday);
        let now = new Date();

        if (reqDate.toString() === userDate.toString()){
            return res.json({ message : "Change only the date of birth is not possible, since it is equal to the original date of birth." });
        } else if (reqDate > now) {
            return res.json({ message : "It is not possible to change only the date of birth, since it is larger than today's date." });
        }
    }

    User.findById(req.user._id)
        .then(user => {
            if (!user) {
                return res.json({ message : "User does not exist." });
            }

            if (data.birthday && new Date(data.birthday) > new Date()) delete data.birthday;

            for (let key in data) {
                user.set(key, data[key]);
            }

            user.save()
                .then(user => {
                    user = user.toJSON();

                    delete user.login;
                    delete user.password;

                    res.json({ user });

                    if (req.body.oldPassword && req.body.newPassword) return next();
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

module.exports.updatePassword = (req, res) => {
    for (let key in req.body) {
        req.body[key] = req.body[key].replace(/<[^>]+>/g,'').trim();

        if (req.body[key] === "" || req.body[key] === 'undefined' || !req.body[key]) delete req.body[key];
    }

    if (!req.body.oldPassword || req.body.oldPassword !== req.user.password) {
        return res.json({ message : "It is not possible to change only the password, since you did not enter the old password, or it does not match the original one." });
    }

    if (req.body.oldPassword === req.body.newPassword && req.user.password === req.body.newPassword) {
        return res.json({ message : "It is not possible to change only the password, since it matches the original." });
    }

    User.findById(req.user._id)
        .then(user => {
            user.set('password', req.body.newPassword);

            user.save()
                .then(() => {
                    return res.json({ message : "Password updated." });
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
            res.json({ message : "Account deleted" })
        })
        .catch(err => {
            res.status(500);
            res.json({ err });
        })
};