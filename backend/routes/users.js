// Allow server to conduct CRUD operations

// REGEX EXPRESSION FOR PASSWORD
// ^ - start of password str
// (?=.*[a-z]) - str must contain at least one lowercase alphabetical char
// (?=.*[A-Z]) - str must contain at least one uppercase alphabetical char
// (?=.*[0-9]) - str must contain at least one number
// (?=.[!@#$\%\^&]) - str must contain at least one special char besides reserved regex char 
// (?=.{8,}) - str must be 8 char or longer

// Require request for CORS proxy workaround
const request = require('request')

// Require router
const router = require('express').Router();

// Import Express validator
const {check, validationResult} = require('express-validator')

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
    [
        check('username')
            .isLength({min:5})
            .withMessage('Username must be at least 5 characters long'),
        check('firstname')
            .isLength({min:1})
            .withMessage('First name must exist'),
        check('lastname')
            .isLength({min:1})
            .withMessage('Last name must exist'),
        // TODO - Create conditions & regex for email verification
        check('email')
            .isEmail(),
        check('password')
            // min 8 char, at least 1 uppercase, at least 1 lowercase , one number, one special char, case insensitive
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "i")
    ],
    (req, res) => {
        var validationError = validationResult(req)

        if (!validationError.isEmpty()) {
            res.status(400).json('Error: ' + validationError);
        }
        else {
                const username = req.body.username;
                const firstname = req.body.firstname;
                const lastname = req.body.lastname;
                const email = req.body.email;
                const password = req.body.password;
                const position = req.body.position;
                const projects = req.body.projects;

                const newUser = new User({username, firstname, lastname, email, password, position, projects});  // create new instance of user using the username

                newUser.save()
                    .then(() => {
                        console.log('Nodejs - User added successfully')
                        res.status(200).end()
                    })
                    .catch((err) => {
                        res.status(400).json('Err: ' + err).end()
                    });
                }
            }
);


// Fetch information about one user via id
router.route('/:id').get(
    (req, res) => {
        User.findById(req.params.id)
            .then(user => res.json(user))
            .catch(err => res.status(400).json('Error: ' + err));
});


// Update username of user
router.route('/:id/update/username').post(
    (req, res) => {
        User.findById(req.params.id)
            .then(user => {
                user.username = req.body.username

                user.save()
                    .then(() => res.json('Update username'))
                    .catch(err => res.status(400).json('Error: ' + err));
            })
            .catch(err => res.status(400).json('Error: ' + err));
    }
);

// Update firstname of user
router.route('/:id/update/firstname').post(
    (req, res) => {
        User.findById(req.params.id)
            .then(user => {
                user.firstname = req.body.firstname

                user.save()
                    .then(() => res.json('Update firstname'))
                    .catch(err => res.status(400).json('Error: ' + err));
            })
            .catch(err => res.status(400).json('Error: ' + err));
    }
);


// Update lastname of user
router.route('/:id/update/lastname').post(
    (req, res) => {
        User.findById(req.params.id)
            .then(user => {
                user.lastname= req.body.lastname

                user.save()
                    .then(() => res.json('Update lastname'))
                    .catch(err => res.status(400).json('Error: ' + err));
            })
            .catch(err => res.status(400).json('Error: ' + err));
    }
);

// Update email of user
router.route('/:id/update/email').post(
    (req, res) => {
        User.findById(req.params.id)
            .then(user => {
                user.email = req.body.email

                user.save()
                    .then(() => res.json('Update email'))
                    .catch(err => res.status(400).json('Error: ' + err));
            })
            .catch(err => res.status(400).json('Error: ' + err));
    }
);

// Update password of user
router.route('/:id/update/password').post(
    [
        check('password')
            // min 8 char, at least 1 uppercase, at least 1 lowercase , one number, one special char, case insensitive
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "i")
    ],
    (req, res) => {

        var validationError = validationResult(req)

        if (!validationError.isEmpty()) {
            res.status(400).json('Error: ' + validationError);
        }
        else {
        User.findById(req.params.id)
            .then(user => {
                user.password = req.body.password

                user.save()
                    .then(() => res.json('Update password'))
                    .catch(err => res.status(400).json('Error: ' + err));
            })
            .catch(err => res.status(400).json('Error: ' + err));
        }
    }
);

// Delete information about user
router.route('/delete/:id').post(
    (req, res) => {
        User.findByIdAndDelete(req.body.id, (err, data) => {
            if (data) {
                res.status(204).json('Delete user')
            } else {
                res.status(400).json('Error: ' + err);
            }
        })
    }
);

// Exporting router
module.exports = router;