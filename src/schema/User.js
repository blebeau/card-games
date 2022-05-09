const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

User.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword);
};

module.exports = mongoose.model('user', User);