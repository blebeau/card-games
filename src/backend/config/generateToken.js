const jt = require('jsonwebtoken');

const generateToken = id => {
    return jt.sign({ id }, process.env.JT_SECRET, {
        expiresIn: '1d',
    });
}

module.exports = generateToken;