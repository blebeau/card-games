const jt = require('../backend/config/generateToken');
const User = require('../Schema/User');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jt.verify(token, process.env.JT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');
        } catch (err) {
            console.error(err);
            res.status(401);

            throw new Error('Not Authorized, token failed')
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not Authorized');
    }
});