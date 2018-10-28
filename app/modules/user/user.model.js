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
    birthday : Date,
    homes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'home'
        }
    ]
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

module.exports = mongoose.model('user', userSchema);