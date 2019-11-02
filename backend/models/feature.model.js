const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const featureSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 30
        },
        creator: {
            type: String,
        },
        users: {
            type: Array,
        },
        // TODO - make this a subset of projects
        project: {
            type: String
        },
        // Reference by id
        tasks: {
            type: Array
        },
        // TODO - think about how to find earliest start date from tasks
        startdate: {
            type: Date,
            required: true
        },
        // TODO - think about how to find latest end date from tasks
        enddate: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const Feature = mongoose.model('Feature', featureSchema)

module.exports = Feature;