// Import models
const User = require('../models/user.model');

/** 
 * Convert userId to username
 */

userIdToUsername = async (userId) => {
     let user = await User.findById(userId);
     return user.username;
 };

 /** 
 * Convert username to userId
 */

usernameToUserId = async (username) => {
    let user = await User.findOne({"username": username});
    return user._id;
};

module.exports = {userIdToUsername, usernameToUserId};