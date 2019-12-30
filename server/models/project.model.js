const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const tasks = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 20
    },
    description: {
        type: String,
        maxlength: 100
    },
    members: {
        type: Array
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
});

const features = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 30
    },
    description: {
        type: String,
        maxlength: 100
    },
    creator: {
        type: String,
    },
    members: {
        type: Array,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    tasks: [tasks]
});

const projectSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 30
        },
        description: {
            type: String,
            maxlength: 100,
        },
        creator: {
            type: String,
        },
        members: {
            type: Array,
            required: true,
            minlength: 1
        },
        admins: {
            type: Array,
            minlength: 1,
            maxlength: 10
        },
        features: [features]
    });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;