const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
    companyName: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: false
    },
    role: {
        type: Number,
        required: true
    },
    createdJobs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Job'
        }
    ],
    profile: {
        logo: {
            location: {type: String},
            mimetype: {type: String}
        },
        description: {type: String},
        location: {type: String}
    },
    authenticated: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Company', companySchema);