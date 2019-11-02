const router = require('express').Router();

// Express validator to validate form inputs
const {check, validationResult} = require('express-validator');

const Feature = require('../models/feature.model');

// Create functionality

// Update Functionality - Update feature name, details, etc

// Read functionality - find one feature based on user and project

// Delete functionality - delete single feature based on project

// Exporting router
module.exports = router;