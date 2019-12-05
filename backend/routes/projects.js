const router = require('express').Router();

// Express validator to validate form inputs
const {check, validationResult} = require('express-validator');

// Import models
const Project = require('../models/project.model');

// Import authentication middleware with JWT
const auth = require('./auth')

// Create functionality
router.route('/add').post(auth,
    [
        check('name')
            .isLength({min: 5, max: 30})
            // .custom(value => !/\s/.test(value))
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
        }

        const name = req.body.name.replace(/\s+/g, '-').toLowerCase()
        const description = req.body.description
        const creator = req.user._id
        const members = req.body.members
        const admins = req.body.admins
        const features = [] // temp
        const newProject = new Project({name, description, creator, members, admins, features})

        try {
            await newProject.save();
            req.user.projects = req.user.projects.concat(newProject.name);
            await req.user.save();
            res.status(200).send("PROJECT_ADDED");
        } catch (err){
            res.status(400).send({
                "err": "ProjectAddError",
                "description": err.message
            })
        }
    }
);

// Read functionality - find one project based on user and project name
router.route('/find').get(auth,
    async (req, res) => {
        try {
            const project = await Project.findOne({
                "name": req.body.name,
                "members": req.user.username
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

// Delete functionality - delete single project based on user and project name
router.route('/delete').post(auth,
    async (req, res) => {
        try {
            await Project.findOneAndDelete({
                "name": req.body.name, 
                "members": req.user.username
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

// Update Functionality - Update project name
// router.route('/:username/:name/update/name').post(
//     [
//         check('name')
//             .isLength({min: 5, max: 30}),
//     ],
//     (req, res) => {
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.status(422).json({
//                 errors: errors.array()
//             });
//         }

//         Project.findOne({"name": req.params.name}, (err, doc) => {
//             doc.name = req.body.name

//             doc.save()
//                 .then(() => {res.json('Project added')})
//                 .catch((err) => {res.status(400).json('Error' + err)})
//         })
//     });

// Update Functionality - Update project description
// router.route('/:username/:name/update/description').post(
//     [
//         check('description')
//             .isLength({max: 100}),
//     ],
//     (req, res) => {
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.status(422).json({
//                 errors: errors.array()
//             });
//         }

//         Project.findOne({"name": req.params.name}, (err, doc) => {
//             doc.description = req.body.description

//             doc.save()
//                 .then(() => {res.json('Updated project description')})
//                 .catch((err) => {res.status(400).json('Error' + err)})
//         })
//     });

// Update Functionality - Update members
// router.route('/:username/:name/update/user').post(
//     [
//         check('members')
//             .isArray()
//             .isLength({min: 1, max: 10})
//     ],
//     (req, res) => {
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.status(422).json({
//                 errors: errors.array()
//             });
//         }

//         Project.findOne({"name": req.params.name}, (err, doc) => {
//             for (let i = 0; i < req.body.members.length; i++) {
//                 doc.members.push(req.body.members[i])
//         }

//             doc.save()
//                 .then(() => {res.json('Updated project members')})
//                 .catch((err) => {res.status(400).json('Error' + err)})
//         })
//     });

// Update Functionality - Update admin
// router.route('/:username/:name/update/admin').post(
//     [
//         check('admins')
//             .isArray()
//             .isLength({min: 1, max: 10})
//     ],
//     (req, res) => {
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.status(422).json({
//                 errors: errors.array()
//             });
//         }

//         Project.findOne({"name": req.params.name}, (err, doc) => {
//             for (let i = 0; i < req.body.admins.length; i++) {
//                 doc.admins.push(req.body.admins[i])
//         }

//             doc.save()
//                 .then(() => {res.json('Updated project admins')})
//                 .catch((err) => {res.status(400).json('Error' + err)})
//         })
//     });

// Exporting router
module.exports = router;