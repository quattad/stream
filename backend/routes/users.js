// Allow server to conduct CRUD operations

// Require router
const router = require('express').Router();

// Require user model
let User = require('../models/user.model');

// Home page for user - fetch all users
router.route('/').get(
    (req, res) => {
        User.find()  // fetch users from mongodb database
            .then(users => res.json(users))
            .catch(err => res.status(400).json('Error: ' + err));
    }
);

// Create user
router.route('/add').post( 
    (req, res) => {
        console.log(req.body)
        const username = req.body.username;
        const newUser = new User({username});  // create new instance of user using the username

        newUser.save()
            .then(() => res.json('User added!'))
            .catch(err => res.status(400).json('Error: ' + err));
    }
);


// Fetch information about one user
router.route('/:id').get(
    (req, res) => {
        User.findById(req.params.id)
            .then(user => res.json(user))
            .catch(err => res.status(400).json('Error: ' + err));
});


// Update information about user
router.route('/update/:id').post(
    (req, res) => {
        User.findById(req.params.id)
            .then(user => {
                user.username = req.body.username

                user.save()
                    .then(() => res.json('Username updated!'))
                    .catch(err => res.status(400).json('Error: ' + err));
            })
            .catch(err => res.status(400).json('Error: ' + err));
    }
);

// Delete information about user
router.route('/delete/:id').delete(
    (req, res) => {
        User.findByIdAndDelete(req.params.id)
            .then(() => {res.json('Deleted user')})
            .catch(err => {res.status(400).json('Error: ' + err)});
    }
);

// Exporting router
module.exports = router;