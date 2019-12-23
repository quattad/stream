const router = require('express').Router();
const {check, validationResult} = require('express-validator');
const moment = require('moment');

// Import date services
const {dateStrToMoment, getEarliestDate, getLatestDate} = require('../services/dateServices');

// Import models
const Project = require('../models/project.model');

// Import contexts
const auth = require('./auth');

// Create tasks
router.route('/add/:projectName').post(auth,
        [
            check('name')
                .exists()
                .isLength({
                    min: 1,
                    max: 10
                })
                .withMessage('Feature name must be between 1 to 10 characters long.'),
            check('description')
                .isLength({
                    max: 100
                })
                .withMessage('Feature description must be less than 100 characters.'),
            check('startDate')
                .exists().withMessage("Start date must exist.")
                .custom((startDate) => {
                    startDate = dateStrToMoment(startDate);
                    if (!startDate.isValid()) {
                        return false;
                    } else {
                        return true;
                    };
                }).withMessage("Task start date must be a valid date.")
                .custom((startDate) => {
                    todayDate = moment();
                    yesterdayDate = todayDate.subtract(1, 'day');
                    startDate = dateStrToMoment(startDate);

                    if (startDate.isBefore(yesterdayDate)) {
                        return false;
                    } else {
                        return true;
                    };
                }).withMessage("Task start date must be equal or after today\'s date"),
            check('endDate')
                .exists().withMessage("End date must exist.")
                .custom((endDate, {req}) => {
                    endDate = dateStrToMoment(endDate) 
                    startDate = dateStrToMoment(req.body.startDate)
                    if (startDate.isAfter(endDate)) {
                        return false;
                    } else {
                        return true
                    }
                }).withMessage("Task end date must be after task start date."),
        ],
        async (req, res) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(422).send({
                    errors: errors.array()
                })
            };

            try {
                let conditions = {
                    "name": req.params.projectName,
                    "members": req.user._id,
                    "features.name": req.body.featureName
                };

                let tasksToPush = {
                    $push: {
                        "features.$[feature].tasks":
                        {
                            "name": req.body.name,
                            "description": req.body.description,
                            "startDate": req.body.startDate,
                            "endDate": req.body.endDate
                        }
                    }
                };

                let options = {
                    arrayFilters: [
                        {"feature.name": req.body.featureName}
                    ],
                    upsert: true
                };

                await Project.findOneAndUpdate(conditions, tasksToPush, options);
                res.status(200).send("TASK_CREATED");
                
            } catch (err) {
                res.status(400).send({
                    "err": "TaskAddError",
                    "description": err
                });
            };
        });

// Read - use project fetch

// Update - update task name
router.route('/update/name/:projectName/:featureName/:taskName').post(auth,
    [
        check('taskName')
            .exists()
            .isLength({
                min: 5,
                max: 30
            })
            .withMessage('Task name must be between 5 to 30 characters long.')
        ],
        async (req, res) => {
            const errors = validationResult(req);
            
            if (!errors.isEmpty()) {
                return res.status(422).send({
                    errors: errors.array()
                })
            };

            try {
                let conditions = {
                    "name": req.params.projectName,
                    "members": req.user._id,
                    "features.name": req.params.featureName,
                };

                let tasksToUpdate = {
                    $set: {
                        "features.$[feature].tasks.$[task].name": req.body.taskName
                    }
                };

                let options = {
                    arrayFilters : [
                        {"feature.name": req.params.featureName},
                        {"task.name": req.params.taskName}
                    ],
                    upsert: true
                };
            
                await Project.findOneAndUpdate(conditions, tasksToUpdate, options);
                res.status(200).send("TASK_NAME_UPDATED");

            } catch (err) {
                res.status(400).send({
                    "err":"TaskNameUpdateError",
                    "description": err
                });
            }
        });

// Update - update task description
router.route('/update/description/:projectName/:featureName/:taskName').post(auth,
    [
        check('description')
        .isLength({
            max: 20
        }).withMessage('Task description must be less than 100 characters.')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(422).send({
                errors: errors.array()
            })
        };
        
        try {
            let conditions = {
                "name": req.params.projectName,
                "members": req.user._id,
                "features.name": req.params.featureName
            };

            let tasksToUpdate = {
                $set: {
                    "features.$[feature].tasks.$[task].description": req.body.taskDescription
                }
            };

            let options = {
                arrayFilters : [
                    {"feature.name": req.params.featureName},
                    {"task.name": req.params.taskName}
                ],
                upsert: true
            };
            
            await Project.findOneAndUpdate(conditions, tasksToUpdate, options);
            res.status(200).send("TASK_DESCRIPTION_UPDATED");
        } catch (err) {
            res.status(400).send({
                "err":"TaskDescriptionUpdateError",
                "description": err
            });
        }
    });

// Update - update task start date
router.route('/update/startdate/:projectName/:featureName/:taskName').post(auth,
    async (req, res) => {
        try {
            let conditions = {
                "name": req.params.projectName,
                "members": req.user._id,
                "features.name": req.params.featureName
            };

            let newStartDate = dateStrToMoment(req.body.taskStartDate);

            let tasksToUpdate = {
                $set: {
                    "features.$[feature].tasks.$[task].startDate": newStartDate
                }
            };

            let options = {
                arrayFilters : [
                    {"feature.name": req.params.featureName},
                    {"task.name": req.params.taskName}
                ],  
                upsert: true
            };
            
            await Project.findOneAndUpdate(conditions, tasksToUpdate, options);
            res.status(200).send("TASK_START_DATE_UPDATED")
        } catch (err) {
            res.status(400).send({
                "err":"TaskStartDateUpdateError",
                "description": err
            });
        }
    });
    
// Update - update task end date
router.route('/update/enddate/:projectName/:featureName/:taskName').post(auth,
    async (req, res) => {
        try {
            let conditions = {
                "name": req.params.projectName,
                "members": req.user._id,
                "features.name": req.params.featureName
            };

            let newEndDate = dateStrToMoment(req.body.taskEndDate);

            let tasksToUpdate = {
                $set: {
                    "features.$[feature].tasks.$[task].endDate": newEndDate
                }
            };

            let options = {
                arrayFilters : [
                    {
                        "feature.name": req.params.featureName
                    },
                    {
                        "task.name": req.params.taskName
                    }
                ],
                upsert: true
            };
            
            await Project.findOneAndUpdate(conditions, tasksToUpdate, options);
            res.status(200).send("TASK_END_DATE_UPDATED");

        } catch (err) {
            res.status(400).send({
                "err":"TaskEndDateUpdateError",
                "description": err
            });
        }
    });

// Delete task
router.route('/delete/:projectName/:featureName/:taskName').post(auth,
    async(req, res) => {
        try {
            let conditions = {
                "name": req.params.projectName,
                "members": req.user._id,
                "features.name": req.params.featureName
            };
            
            let tasksToDelete = {
                $pull: {
                    "features.$[feature].tasks":
                    {
                        "name": req.params.taskName
                    }
                }
            };

            let options = {
                arrayFilters: [
                    {
                        "feature.name": req.params.featureName
                    }
                ]
            };

            await Project.findOneAndUpdate(conditions, tasksToDelete, options);
            res.status(200).send("TASK_DELETED");

        } catch (err) {
            res.status(400).send({
                "err": "TaskDeleteError",
                "description": err
            });
        };
    }
);

// Exporting router
module.exports = router;