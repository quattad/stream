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
// userSchema.pre('save', function (next) {
//     // Salt prevents rainbow table attacks & brute force attacks; determines how many routes/iterations of key setup phase
//     SALT_WORK_FACTOR = 10;
//     const user = this;

//     // Generate a salt
//     bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
//         if (err) return next(err);

//         // Hash password with new salt
//         bcrypt.hash(user.password, salt, function (err, hash) {
//             if (err) return next(err);

//             // Replace cleartext password with hashed password
//             user.password = hash;
//             next();
//         })
//     })
// });

// Hashing function that runs before every user save
userSchema.pre('save', function (next) {
    const user = this;
        
        // Check if password is already hashed, if hashed, skip hashing
        // Regex to match bcrypt hash - matches if 1) starts with $2b 2) contains all characters within [] 3) at least 40 char 4) case insensitive
        const hash_exp = new RegExp(/^(\$2b)[A-Za-z\d@$!%*?&./]{40,}/, "i")
        const check_pw_hash = hash_exp.test(user.password)
        if (check_pw_hash) {
            next();
        } else {
            bcrypt.hash(user.password, 8, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            })
        }
    });


// Password Verification
userSchema.methods.comparePassword = function (candidatePassword, actualPassword, cb) {
    bcrypt.compare(candidatePassword, actualPassword, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

// Search for user by email and password
userSchema.statics.findByCredentials = async (email, password) => {
    try {
        const user = await User.findOne({"email": email})
        if (!user) {
            throw new Error({error: 'Invalid email'})
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password.toString())
        
        if (!isPasswordMatch) {
            throw new Error({error: 'Invalid password'})
        } else {return user}
    } catch (err) {
        throw new Error({error: "Invalid user or password"})
    }
}

// Generate and returns JWT token; does not save
userSchema.methods.generateAuthToken = async function generateAuthToken() {
    // Generate auth token for user
    const user = this;
    const token = jwt.sign(
        {id: user._id}, 
        process.env.JWT_KEY, 
        {
            expiresIn: '24h'
        })
    return token
    }

    
const User = mongoose.model('User', userSchema);
module.exports = User;