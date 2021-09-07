const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    files: [{location: {type: String}, mimetype: {type: String}}], 
    applicant: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    history: [{
        status: {type: Number, required: true},
        modifiedDate: {type: Date, required: true},
        interviewTime: {type: Date, required: false},
        interviewURL:  {type: String, required: false}
    }]
},{ timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);