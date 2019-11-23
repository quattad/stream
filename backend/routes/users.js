const router = require('express').Router();
const {check, validationResult} = require('express-validator')

// Import models
let User = require('../models/user.model');

// Import authentication middleware with JWT
const auth = require('./auth')

// Register user
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
        check('email')
            .isEmail(),
        check('password')
            // min 8 char, max 20 char, at least 1 uppercase, at least 1 lowercase , one number, one special char, case insensitive
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, "i")
    ],
    async (req, res) => {
        var validationError = validationResult(req)

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
                console.log(err)

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

                    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
                    res.header('Access-Control-Allow-Credentials', true);
                    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
                    res.cookie("token", token, options)
                    res.send()
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
            res.status(200).send("Session token removed")
        } catch (err) {
            res.status(500).send({"err": err})
        }
    });

// Fetch information about single user; check if authenticated first
router.route('/profile').get(auth,
    async (req, res) => {
        try {
            // Fetch data from logged in user profile after running middleware
            res.send(req.user);
        } catch (err) {
            res.status(400).send({"err": err})
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
            res.status(204).json({"message": "Profile updated successfully"})
        } catch (err) {
            res.status(400).send({"err":err})
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

// Exporting router
module.exports = router;