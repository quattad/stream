// Middleware to authenticate user by checking authorization header
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

const auth = async (req, res, next) => {
    try {
        const token = req.signedCookies.token;
        
        // Verify token signature, returns payload if verified, returns nothing if not
        const data = jwt.verify(token, process.env.JWT_KEY);;
        const user = await User.findOne({'_id': data.id, 'tokens.token':token});
        
        if (!user) {
            throw new Error ('USER_NOT_FOUND_WITH_SPECIFIED_TOKEN');
        };

        req.user = user;
        req.token = token;
        req.userId = user._id;

        next();
        
    } catch (err) { 
        return res.status(401).send({
            "error": "ValidationError",
            "description": err});
        };
};

module.exports = auth;