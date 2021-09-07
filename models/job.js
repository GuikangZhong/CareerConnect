const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    title: {
        type: String,
        required: true
    }, 
    labels: [{
        type: String,
        required: true
    }],
    description: {
        type: String,
        required: true
    },
    requirement:{
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    applications: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Application'
        }
    ],
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    salary: {
        type: String,
        require: false
    }},
    { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);