const router = require('express').Router();
const {check, validationResult} = require('express-validator');
const moment = require('moment');

// Import date services
const {dateStrToMoment, getEarliestDate, getLatestDate} = require('../services/dateServices');

// Import models
const Project = require('../models/project.model');

// Import contexts
const auth = require('./auth');

// Create functionality
router.route('/add/:projectId').post(auth,
        [
            check('name')
                .exists()
                .isLength({
                    min: 5,
                    max: 30
                })
                .withMessage('Feature name must be between 5 to 30 characters long.'),
            check('description')
                .isLength({
                    max: 100
                })
                .withMessage('Feature description must be less than 100 characters.'),
            check('tasks.*.name')
                .exists()
                .not().isEmpty()
                .isLength({
                    min: 5,
                    max: 10
                })
                .withMessage('Task must not be empty and be between 5 to 10 characters long.'),
            check('tasks.*.startDate')
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
            check('tasks.*.endDate')
                .exists().withMessage("End date must exist.")
                .custom((endDate, {req}) => {
                    endDate = dateStrToMoment(endDate) 
                    startDate = dateStrToMoment(req.body.tasks.startDate)
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
                let featureStartDate = getEarliestDate(req.body.tasks);
                let featureEndDate = getLatestDate(req.body.tasks);

                let conditions = {
                    "_id": req.params.projectId,
                    "members": req.user.username,
                };

                let featuresToPush = {
                    $push: {
                        features: {
                            "name": req.body.name,
                            "description": req.body.description,
                            "creator": req.user._id,
                            "members": [req.user._id],
                            "startDate": featureStartDate,
                            "endDate": featureEndDate,
                            "tasks": req.body.tasks
                        }
                    }
                };

                let options = {
                    upsert: true
                };

                await Project.findOneAndUpdate(conditions, featuresToPush, options);
                res.status(200).send("FEATURE_CREATED");
                
            } catch (err) {
                res.status(400).send({
                    "err": "FeatureAddError",
                    "description": err
                });
            };
        });

// Read - use project fetch

// Update - update feature name
router.route('/update/name/:projectId/:featureId').post(auth,
    [
        check('featureName')
            .exists()
            .isLength({
                min: 5,
                max: 30
            })
            .withMessage('Feature name must be between 5 to 30 characters long.')
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
                    "_id": req.params.projectId,
                    "members": req.user.username,
                    "features._id": req.params.featureId
                };

                let featuresToUpdate = {
                    "$set": {
                        "features.$.name": req.body.featureName
                    }
                };

                let options = {
                    upsert: true
                };
            
                await Project.findOneAndUpdate(conditions, featuresToUpdate, options);
                res.status(200).send("FEATURE_NAME_UPDATED")
            } catch (err) {
                res.status(400).send({
                    "err":"FeatureNameUpdateError",
                    "description": err
                });
            }
        });

// Update - update feature description
router.route('/update/description/:projectId/:featureId').post(auth,
    [
        check('description')
        .isLength({
            max: 100
        }).withMessage('Feature description must be less than 100 characters.')
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
                "_id": req.params.projectId,
                "members": req.user.username,
                "features._id": req.params.featureId
            };

            let featuresToUpdate = {
                "$set": {
                    "features.$.description": req.body.featureDescription
                }
            };

            let options = {
                upsert: true
            };
            
            await Project.findOneAndUpdate(conditions, featuresToUpdate, options);
            res.status(200).send("FEATURE_DESCRIPTION_UPDATED");
        } catch (err) {
            res.status(400).send({
                "err":"FeatureDescriptionUpdateError",
                "description": err
            });
        }
    });

// Update - update feature members
router.route('/update/members/:projectId/:featureId').post(auth,
    async (req, res) => {
        try {
            let conditions = {
                "_id": req.params.projectId,
                "members": req.user.username,
                "features._id": req.params.featureId
            };

            let featureMembersIdsToAdd = Promise.all(
                req.body.featureMembers.map(async(member)=> {
                    
                })
            );

            let featuresToUpdate = {
                "$push": {
                    "features.$.members": req.body.featureMemberIds
                }
            };

            let options = {
                upsert: true
            };
            
            await Project.findOneAndUpdate(conditions, featuresToUpdate, options);
            res.status(200).send("FEATURE_MEMBER_UPDATED")
        } catch (err) {
            res.status(400).send({
                "err":"FeatureMemberUpdateError",
                "description": err
            });
        }
    });

// Update - update feature start date
router.route('/update/startdate/:projectId/:featureId').post(auth,
    async (req, res) => {
        try {
            let conditions = {
                "_id": req.params.projectId,
                "members": req.user.username,
                "features._id": req.params.featureId
            };

            let projectToUpdate = await Project.findOne(conditions);
            let featureStartDate = getEarliestDate(projectToUpdate.features.tasks);

            let featuresToUpdate = {
                "$set": {
                    "features.$.startDate": featureStartDate
                }
            };

            let options = {
                upsert: true
            };
            
            await Project.findOneAndUpdate(conditions, featuresToUpdate, options);
            res.status(200).send("FEATURE_START_DATE_UPDATED")
        } catch (err) {
            res.status(400).send({
                "err":"FeatureStartDateUpdateError",
                "description": err
            });
        }
    });
    
// Update - update feature end date
router.route('/update/enddate/:projectId/:featureId').post(auth,
    async (req, res) => {
        try {
            let conditions = {
                "_id": req.params.projectId,
                "members": req.user.username,
                "features._id": req.params.featureId
            };

            let projectToUpdate = await Project.findOne(conditions);
            let featureEndDate = getLatestDate(projectToUpdate.features.tasks);

            let featuresToUpdate = {
                "$set": {
                    "features.$.endDate": featureEndDate
                }
            };

            let options = {
                upsert: true
            };
            
            await Project.findOneAndUpdate(conditions, featuresToUpdate, options);
            res.status(200).send("FEATURE_END_DATE_UPDATED")
        } catch (err) {
            res.status(400).send({
                "err":"FeatureEndDateUpdateError",
                "description": err
            });
        }
    });

// Delete functionality
router.route('/delete/:projectId/:featureId').post(auth,
    async(req, res) => {
        try {
            let conditions = {
                "_id": req.params.projectId,
                "members": req.user.username,
                "features._id": req.params.featureId
            };

            const project = await Project.findOne(conditions);
            project.features.id(req.params.featureId).remove();
            
            await project.save();
            res.status(200).send("FEATURE_DELETED")
        } catch (err) {
            res.status(400).send({
                "err": "FeatureDeleteError",
                "description": err
            });
        };
    }
);

// Exporting router
module.exports = router;