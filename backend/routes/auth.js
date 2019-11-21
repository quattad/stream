// Middleware to authenticate user by checking authorization header
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

const auth = async (req, res, next) => {
    
    // Store current login token in 
    const token = req.signedCookies.token
    
    try {
        // Verify token signature, returns payload if verified, returns nothing if not
        const data = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findOne({'_id': data.id, 'tokens.token':token})
        
        if (!user) {
            throw new Error ({error: 'User not found with specified token.'})
        }
        req.user = user
        req.token = token
        next();
    } catch (error) { res.status(401).send({error:'Not authorized to access this resource'})}
}

module.exports = auth;