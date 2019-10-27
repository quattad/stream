const router = require('express').Router();

// Express validator to validate form inputs
const {check, validationResult} = require('express-validator');

const Project = require('../models/project.model');

// Homepage for projects
router.route('/:username').get(
    (req, res) => {
        Project.find({
            "users": req.params.username
        })
            .then(projects => res.json(projects))  // Return all projects that contain username as JSON object
            .catch(err => res.status(400).json('Error: ' + err));
    }
);

// Create functionality
router.route('/:username/add').post(
    // Validation checks defined before handling of post request as array
    [
        check('name')
            .isLength({min: 5, max: 30})
            // .custom(value => !/\s/.test(value))
            .withMessage('Spaces will be converted into hyphens'),
        check('description')
            .isLength({max: 100}),
        // TODO - check that current user is by default added
        check('users')
            .isArray()
            .isLength({min: 1, max: 10}),
        // TODO - check that at least current user needs to be in admins
        check('admins')
            .isArray()
            .isLength({min: 1}),
        check('features')
            .isArray()
            .isLength({min: 1})
    ],
    (req, res) => {
        // Find validation errors in request and return in error object
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }

        let name = req.body.name.replace(/\s+/g, '-').toLowerCase()
        let description = req.body.description
        let users = req.body.users
        let admins = req.body.admins
        let features = req.body.features
        let newProject = new Project({name, description, users, admins, features})

        newProject.save()
            .then(() => res.json('Project added'))
            .catch((err) => {res.status(400).json('Error' + err)})
    }
);

// Update Functionality - Update project name
router.route('/:username/:name/update/name').post(
    [
        check('name')
            .isLength({min: 5, max: 30}),
    ],
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }

        Project.findOne({"name": req.params.name}, (err, doc) => {
            doc.name = req.body.name

            doc.save()
                .then(() => {res.json('Project added')})
                .catch((err) => {res.status(400).json('Error' + err)})
        })
    });

// Update Functionality - Update project description
router.route('/:username/:name/update/description').post(
    [
        check('description')
            .isLength({max: 100}),
    ],
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }

        Project.findOne({"name": req.params.name}, (err, doc) => {
            doc.description = req.body.description

            doc.save()
                .then(() => {res.json('Updated project description')})
                .catch((err) => {res.status(400).json('Error' + err)})
        })
    });

// Update Functionality - Update users
router.route('/:username/:name/update/user').post(
    [
        check('users')
            .isArray()
            .isLength({min: 1, max: 10})
    ],
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }

        Project.findOne({"name": req.params.name}, (err, doc) => {
            for (let i = 0; i < req.body.users.length; i++) {
                doc.users.push(req.body.users[i])
        }

            doc.save()
                .then(() => {res.json('Updated project users')})
                .catch((err) => {res.status(400).json('Error' + err)})
        })
    });

// Update Functionality - Update admin
router.route('/:username/:name/update/admin').post(
    [
        check('admins')
            .isArray()
            .isLength({min: 1, max: 10})
    ],
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }

        Project.findOne({"name": req.params.name}, (err, doc) => {
            for (let i = 0; i < req.body.admins.length; i++) {
                doc.admins.push(req.body.admins[i])
        }

            doc.save()
                .then(() => {res.json('Updated project admins')})
                .catch((err) => {res.status(400).json('Error' + err)})
        })
    });

// Read functionality - find one project based on user and project name
router.route('/:username/:name').get(
    (req, res) => {
        Project.findOne({"name": req.params.name})
            .then(project => res.json(project))
            .catch(err => res.status(400).json("Error: " + err))
    }
)

// Delete functionality - delete single project based on user and project name
router.route('/:username/:name/delete').post(
    (req, res) => {
        Project.findOneAndDelete({"name": req.body.name})
            .then(project => res.status(200).json(`${req.body.name} has been successfully deleted`))
            .catch(err => res.status(400).json("Error: " + err))
    });

// Exporting router
module.exports = router;