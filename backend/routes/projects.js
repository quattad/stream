const router = require('express').Router();
const Project = require('../models/project.model');
const User = require('../models/user.model');

// Homepage for projects
router.route('/:username').get(
    (req, res) => {
        Project.find({
            "users": req.params.username
        })
            .then(projects => res.json(projects))
            .catch(err => res.status(400).json('Error: ' + err));
    }
);

// Create project
router.route('/:username/add').post(
    (req, res) => {
        let name = req.body.name
        let description = req.body.description
        let users = req.body.users
        let admins = req.body.admins
        let newProject = new Project({name, description, users, admins})

        newProject.save()
            .then(() => {res.json('Project added!')})
            .catch((err) => {res.status(400).json('Error' + err)})
    }
);

// Exporting router
module.exports = router;