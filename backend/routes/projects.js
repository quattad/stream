const router = require('express').Router();

// Express validator to validate form inputs
const {check, validationResult} = require('express-validator');

// Import models
const Project = require('../models/project.model');
const User = require('../models/user.model');

// Import authentication middleware with JWT
const auth = require('./auth')

// Import user services
const {usernameToUserId} = require('../services/userServices');

// Import project services
const {projectNameToId} = require('../services/projectServices');

// Create functionality
router.route('/add').post(auth,
    [
        check('name')
            .isLength({min: 5, max: 30})
            .withMessage('Spaces will be converted into hyphens'),
        check('description')
            .isLength({max: 100}),
        check('members')
            .isArray()
            .isLength({min: 1, max: 10}),
        check('admins')
            .isArray()
            .isLength({min: 1}),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        };

        try {
            const membersIdArray = await Promise.all(
                req.body.members.map(async (member) => {
                    return await usernameToUserId(member);
                })
                );

            const adminsIdArray = await Promise.all(
                req.body.admins.map(async (admin) => {
                    return await usernameToUserId(admin);
                })
                );

            const name = req.body.name.replace(/\s+/g, '-').toLowerCase();
            const description = req.body.description;
            const creator = req.user._id;
            const members = membersIdArray;
            const admins = adminsIdArray;
            const newProject = new Project({name, description, creator, members, admins});

            await newProject.save(); 
            req.user.projects = req.user.projects.concat(newProject.name);
            await req.user.save();
            res.status(200).send("PROJECT_ADDED");

        } catch (err) {
            res.status(400).send({
                "err": "ProjectAddError",
                "description": err.message
            });
        }
    }
);

// Read functionality - find one project based on projectId
// router.route('/find/:projectId').get(auth,
//     async (req, res) => {
//         try {
//             const project = await Project.findOne({
//                 "_id": req.params.projectId,
//                 "members": req.user._id
//             });
//             res.status(200).send(project);
//         } catch (err) {
//             res.status(422).send({
//                 "err": "AuthenticationError",
//                 "description" : err.message
//         })
//         }
//     }
// );

// Read functionality - find one project based on project name
router.route('/find/:projectName').get(auth,
    async (req, res) => {
        try {
            const project = await Project.findOne({
                "name": req.params.projectName,
                "members": req.user._id
            });
            res.status(200).send(project);
        } catch (err) {
            res.status(422).send({
                "err": "AuthenticationError",
                "description" : err.message
        })
        }
    }
);

// Read functionality - find all projects based on userId
router.route('/findall').get(auth, 
    async (req, res) => {
        try {
            let conditions = {
                members: {
                    $all: [req.user._id]
                }
            };

            let projects = await Project.find(conditions);

            if (projects.length < 1) {
                res.status(200).send("NO_PROJECTS_FOUND")
            };

            res.status(200).send(projects);
        } catch (err) {
            res.status(400).send({
                "err":"ProjectFindAllError",
                "description": err
            });
        }
    });

// Update Functionality - Update project name
router.route('/update/name/:projectName').post(auth,
    [
        check('name')
            .isLength({min: 5, max: 30})
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }

        try {
            conditions = {
                "name": req.params.projectName,
                "members": req.user.username
            };

            options = {
                upsert: true
            };

            projectToUpdate = {
                "name": req.body.projectName
            };

            await Project.findOneAndUpdate(conditions, options, projectToUpdate);
            res.status(200).send(
                "PROJECT_NAME_UPDATED"
                );
        } catch (err) {
            res.status(400).send({
                "err": "ProjectNameUpdateError",
                "description": err
            });
        };
    });

// Update Functionality - Update project description
router.route('/update/description/:projectName').post(auth,
    [
        check('description')
            .isLength({max: 100})
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }

        try {
            conditions = {
                "name": req.params.projectName,
                "members": req.user._id
            };

            options = {
                upsert: true
            };

            projectToUpdate = {
                "description": req.body.projectDescription
            };

            await Project.findOneAndUpdate(conditions, options, projectToUpdate);
            res.status(200).send(
                "PROJECT_DESCRIPTION_UPDATED"
            );
        } catch (err) {
            res.status(400).send({
                "err": "ProjectDescriptionUpdateError",
                "description": err
            });
        };
    });

// Update Functionality - Update members
router.route('/update/members/:projectName').post(auth,
    [
        check('members')
            .isArray()
            .isLength({min: 1, max: 10})
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }

        try {
            conditions = {
                "name": req.params.projectName,
                "members": req.user._id
            };

            options = {
                upsert: true
            };

            let membersToAdd = await Promise.all(
                req.body.members.map(async(member) => {
                    return await usernameToUserId(member);
                })
                );

            projectToUpdate = {
                $push: {
                    "members": membersToAdd
                } 
            };

            await Project.findOneAndUpdate(conditions, options, projectToUpdate);
            res.status(200).send(
                "PROJECT_MEMBERS_UPDATED"
            );
        } catch (err) {
            res.status(400).send({
                "err": "ProjectMembersUpdateError",
                "description": err
            });
        };
    });

// Update Functionality - Update admin
router.route('/update/admins/:projectName').post(auth,
    [
        check('admins')
            .isArray()
            .isLength({min: 1})
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }

        try {
            conditions = {
                "name": req.params.projectName,
                "members": req.user._id
            };

            options = {
                upsert: true
            };

            let adminsToAdd = await Promise.all(
                req.body.admins.map(async(admin) => {
                    return await usernameToUserId(admin)
                })
            );

            projectToUpdate = {
                $push: {
                    "members": adminsToAdd
                } 
            };

            await Project.findOneAndUpdate(conditions, options, projectToUpdate);
            res.status(200).send(
                "PROJECT_ADMINS_UPDATED"
            );
        } catch (err) {
            res.status(400).send({
                "err": "ProjectAdminsUpdateError",
                "description": err
            });
        };
    });

// Delete functionality - delete single project based on user and project name
router.route('/delete').post(auth,
    async (req, res) => {
        try {
            await Project.findOneAndDelete({
                "name": req.body.name, 
                "members": req.user._id
            });
            
            req.user.projects = req.user.projects.filter((project) => {
                return project != req.body.name
            });

            await req.user.save()
            res.status(200).send("PROJECT_DELETED");
        } catch (err) {
            res.status(400).send({
                "err": "DeleteProjectError",
                "description" : err.message 
            });
        }
    });

// Exporting router
module.exports = router;