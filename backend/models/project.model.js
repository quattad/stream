const mongoose = require('mongoose')
const Schema = mongoose.Schema;

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
            maxlength: 100
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
        features: {
            type: Array
        }
    },
    {
        timestamps: true,
    }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;