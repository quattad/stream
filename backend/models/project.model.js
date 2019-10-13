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
            maxlength: 30
        },
        users: {
            type: Array,
            required: true,
            minlength: 1
        },
        admins: {
            type: Array,
            minlength: 1
        }
    },
    {
        timestamps: true,
    }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;