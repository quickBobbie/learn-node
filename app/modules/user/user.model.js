const mongoose = require('mongoose');

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

module.exports = mongoose.model('user', userSchema);