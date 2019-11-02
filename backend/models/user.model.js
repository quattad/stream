const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');

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
            trim: true
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
        }
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

// Create Mongoose middleware to hash password before saving to database
// Note: Passwords are only hashed if document is saved to database! If retrieved from database, still in cleartext
userSchema.pre('save', () => {
    // Salt prevents rainbow table attacks & brute force attacks
    // Determines how many routes/iterations of key setup phase
    // For more information see https://en.wikipedia.org/wiki/Rainbow_table
    SALT_WORK_FACTOR = 10;
    const user = this;

    // Generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);

        // Hash password with new salt
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            // Replace cleartext password with hashed password
            user.password = hash;
            next();
        })
    })
});

// Password Verification
userSchema.methods.comparePassword = (candidatePassword, cb) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

module.exports = User;