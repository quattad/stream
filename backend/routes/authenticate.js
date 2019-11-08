const router = require('express').Router();
const Auth = require('express-basic-auth');

// Add cookie-parser for signing cookies; secret key is set in server.js
const cookieParser = require('cookie-parser');

// Create sample auth object
testAuth = Auth({
    users:
    // Stores username and passwords in key-value pairs
    {
        admin: '123',
        user: '456'
    }
})

// Generate cookie for user if username, password match && user in database
router.route('/').get(
    testAuth,
    (req, res) => {
        
        const options = {
            httpOnly: true,
            signed: true
        }
        
        if (req.auth.user === 'admin') {
            res.cookie('name', 'admin', options).send({screen:'admin'});
        }
        else if (req.auth.user === 'user') {
            res.cookie('name', 'user', options).send({screen:'user'});
        }
    }
)
module.exports = router;