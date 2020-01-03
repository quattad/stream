const router = require('express').Router();
const {check, validationResult} = require('express-validator')

// Import models
let User = require('../models/user.model');

// Import authentication middleware with JWT
const auth = require('./auth');

// Register user
router.route('/add').post(
    [
        check('username')
            .isLength({min:5, max:30})
            .withMessage('Username must be 5 to 10 characters long.'),
        check('firstname')
            .isLength({min:1})
            .withMessage('First name must exist.'),
        check('lastname')
            .isLength({min:1})
            .withMessage('Last name must exist.'),
        check('email')
            .isEmail()
            .withMessage('Invalid email.'),
        check('password')
            // min 8 char, max 20 char, at least 1 uppercase, at least 1 lowercase , one number, one special char, case insensitive
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, "i")
    ],
    async (req, res) => {
        var validationError = validationResult(req);

        if (!validationError.isEmpty()) {
            return res.status(422).send({
                "error": "422",
                "description": validationError
            });
        }
        else {
            try {
                const username = req.body.username;
                const firstname = req.body.firstname;
                const lastname = req.body.lastname;
                const email = req.body.email;
                const password = req.body.password;
                const position = req.body.position;
                const projects = req.body.projects;

                const newUser = new User({username, firstname, lastname, email, password, position, projects});  // create new instance of user using the username
                const token = await newUser.generateAuthToken();
                newUser.tokens = newUser.tokens.concat({token});
                await newUser.save();
                res.status(201).send({newUser, token})
            } catch (err) {
                res.status(err.status).send({
                    "error": err.code,
                    "description": err.message
                })
            }
        }
    }
);

// Login user
router.route('/login').post(
    async (req, res) => {
        try {
            const user = await User.findByCredentials(req.body.email, req.body.password)

            try {
                const token = await user.generateAuthToken(); // Generate new token, append to user token array and save
                user.tokens = user.tokens.concat({token})

                try {
                    await user.save()

                    const hours = 24
                    const expirytime = hours * 60 * 60 * 1000

                    // Define options for permanent cookie
                    const options = {
                        expires: new Date(Date.now() + expirytime),  // to expire on specific date
                        httpOnly: true,  // prevent XSS; browser JS cannot read cookie
                        secure: false,  // ensures cookie transmitted over secure channel i.e. HTTPS
                        SameSite: true,  // prevent CSRF
                        signed: true
                    }

                    res.header('Access-Control-Allow-Origin', `${process.env.BASE_CLIENT_URL}`); // Indicates whether response can be shared with requesting code from origin
                    res.header('Access-Control-Allow-Credentials', true); // Set response allowed to be exposed to frontend JS code

                    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

                    res.cookie("token", token, options);
                    
                    res.send();
                } catch (err) {
                    /**
                     * Error Handling for user.save() */ 
                    console.log(err)          
                    return res.status(500).send({
                        "error": "GENERIC",
                        "description": "Uncaught error in user.save()"
                    })
                }
            } catch (err) {
                /**
                 * Error Handling for generateAuthToken() */ 
                console.log(err)          
                return res.status(500).send({
                    "error":"GENERIC",
                    "description":"Uncaught error in generateAuthToken()"
                })
            }
        } catch (err) {
            /**
             * Error Handling for findbyCredentials() */
            console.log(err)           
            res.status(401).send({
                "error": "ValidationError",
                "description": err.message
            })
        }
    })

// Logout user from current session by deleting JWT token in server
router.route('/logout').post(auth,
    async (req, res) => {
        try {
            req.user.tokens = req.user.tokens.filter((token) => {
                return token.token != req.signedCookies.token
            })
            await req.user.save()
            res.clearCookie("token")
            res.status(200).send("SESSION_TOKEN_REMOVED")
        } catch (err) {
            res.status(500).send({
                "err":"TokenError",
                "description": err.message
            })
        }
    });

// Check if cookie exists
router.route('/checkauth').get(auth,
    async (req, res) => {
        try {
            if (req.user && req.token) {
                res.status(200).send("COOKIE_EXISTS")
            }
        } catch (err) {
            res.status(401).send({
                "error": "ValidationError",
                "description": err.message
            })
        }
    })

// Fetch information about single user; check if authenticated first
router.route('/profile').get(auth,
    async (req, res) => {
        console.log("profile endpoint hit")
        try {
            res.send(req.user)
        } catch (err) {
            res.status(400).send({
                "err":"ValidationError", 
                "description": err.message
            })
        }
    });

// Update all fields except for password
router.route('/update').post(auth, 
    async (req, res) => {
        try {
            req.user.username = req.body.username
            req.user.firstname = req.body.firstname
            req.user.lastname = req.body.lastname
            await req.user.save()
            res.status(204).send('Profile updated successfully')
        } catch (err) {
            res.status(400).send({
                "err": "UpdateError",
                "description": err.message
            })
        }
    })

// Update email of user
// TODO - RW using JWT verification
router.route('/update/email').post()

// Update password of user
// TODO - RW using JWT verification
router.route('/update/password').post()

// Delete information about user
// TODO - RW using JWT verification
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

// Search using ES
// Cannot be written asynchronously
// Rewrite once ES server is deployed separately
router.route('/search-es').post(auth,
    (req, res) => {
        let body = {
                    match: {
                        username: {
                            query: req.body.username,
                            fuzziness: "auto"
                        }
                    }
                };

        User.search(
            body,
            (err, results) => {
                if (!err) {
                    return res.status(200).send(results.body.hits.hits)
                }
                return res.status(400).send({
                    err: "UserSearchError",
                    description: err.message
                });
            });
        }
    );

// Search using MongoDB
router.route('/search-mongo').post(auth,
    async (req, res) => {
        try {
            // Return array of results that match username
            // Sort by textscore; higher textscore, more relevant match
            const result = await User.find(
                {
                    $text: {
                        $search: req.body.value
                    }
                },
                {
                    score: {
                        $meta: "textScore"
                    }
                }
            ).sort(
                {
                    score: {
                        $meta: "textScore"
                    }
                }
                );

            if (result.length < 1) {
                return res.status(400).send({
                    err: "NoUsersFound",
                    description: "NO_USERS_FOUND"
                });
            }
            // Get array of usernames
            const usernames = result.map(document => {
                return document.username;
            });
        
            return res.status(200).send({
                usernames: usernames
            });
        } catch (err) {
            return res.status(400).send({
                err: "FetchUsernamesError",
                description: err
            });
        }
    }
);

// Exporting router
module.exports = router;