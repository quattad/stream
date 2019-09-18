// Require router
const router = require('express').Router();

// Require user model
let User = require('../models/user.model');

// Create user home url
router.route('/').get(
    (req, res) => {
        User.find()  // fetch users from mongodb database
            .then(users => res.json(users))
            .catch(err => res.status(400).json('Error: ' + err));
    }
);

// Create user add url
router.route('/add').post( 
    (req, res) => {
        const username = req.body.username;
        const newUser = new User({username});  // create new instance of user using the username

        newUser.save()
            .then(() => res.json('User added!'))
            .catch(() => res.status(400).json('Error: ' + err))
    }
);

// Exporting router
module.exports = router;