// hash user passwords before storing into the database
const bcrypt = require('bcrypt');

// object modeling tool designed to work in an asynchronous environment
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// used for authentication and authorization; set up protected routes that only logged in users can access.
const jwt = require('jsonwebtoken')

// validate and sanitize user input
const validator = require('validator')

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 5,
            lowercase: true
        },
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate: value => {
                if(!validator.isEmail(value)) {
                    throw new Error ({error: 'Invalid email address'})
                }
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        },
        position: {
            type: String
        },
        projects: {
            type: Array
        },
        tokens: [{
            token: {
                type: String,
                // required: true
            }
        }]
    },
    {
        timestamps: true,
    }
);

// Create Mongoose middleware to hash password before saving to database
// Note: Passwords are only hashed if document is saved to database! If retrieved from database, still in cleartext
// Do not define anon functions. Will affect scope of const user = this to refer to anon function instead of User instance
userSchema.pre('save', function (next) {
    // Salt prevents rainbow table attacks & brute force attacks
    // Determines how many routes/iterations of key setup phase
    // For more information see https://en.wikipedia.org/wiki/Rainbow_table
    SALT_WORK_FACTOR = 10;
    const user = this;

    // Generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // Hash password with new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // Replace cleartext password with hashed password
            user.password = hash;
            next();
        })
    })
});

// Password Verification
// TODO - check if still req.
userSchema.methods.comparePassword = (candidatePassword, cb) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

// Search for user by email and password
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if (!user) {
        throw new Error({error: 'Invalid email'})
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({error: 'Invalid password'})
    }
}

// Generate JWT token
userSchema.methods.generateAuthToken = async function generateAuthToken() {
    // Generate auth token for user
    const user = this;
    const token = jwt.sign({id: user._id}, process.env.JWT_KEY)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
    }

    
const User = mongoose.model('User', userSchema);
module.exports = User;