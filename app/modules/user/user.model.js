const mongoose = require('mongoose');

const Home = require('../home/home.model');

const userSchema = new mongoose.Schema({
    login : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    sex : String,
    username : String,
    birthday : Date
});

userSchema.post('remove', (doc, next) => {
    Home.find({ uid : doc._id })
        .then(homes => {
            homes.forEach(home => {
                home.remove();
            });

            next();
        })
        .catch(err => next(err));
});

userSchema.pre("save", next => {
    Home.find({ uid : this._id })
        .then(homes => {
            next(homes);
        })
})

module.exports = mongoose.model('user', userSchema);