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
    
    if (email === "") {
        throw new Error ("EMAIL_FIELD_EMPTY")
    } else if (password === "") {
        throw new Error ("PASSWORD_FIELD_EMPTY")
    }

    try {
        const user = await User.findOne({"email": email})
        
        if (!user) {
            throw new Error("USER_NOT_FOUND")
        }

        try {
            const isPasswordMatch = await bcrypt.compare(password, user.password.toString())
            
            if (!isPasswordMatch) {
                throw new Error("PASSWORD_DOES_NOT_MATCH")
            } else {
                return user
            }

        } catch (err) {
            /** Error Handling for password comparison bcrypt.compare */
            throw err
        }

    } catch (err) {
        /** Error Handling for finding user User.findOne() */
        throw err
    }
}

// Generate and returns JWT token; does not save
userSchema.methods.generateAuthToken = async function generateAuthToken() {
    // Generate auth token for user
    const user = this;
    const token = jwt.sign({
        id: user._id
    },
    process.env.JWT_KEY, 
    {
        expiresIn: '24h'
    })
    
    return token
}

    
const User = mongoose.model('User', userSchema);
module.exports = User;