// Import models
const Project = require('../models/project.model');

/** 
 * Convert projectId to projectName
 */

 const projectIdToName = async (projectId) => {
     const Project = await Project.findById(projectId);
     return Project.name;
 };

 /** 
 * Convert projectName to projectId
 */

const projectNameToId = async (name) => {
    const project = await Project.find({"name":name});
    return project._id;
};

module.exports = userIdToUsername, usernameToUserId;