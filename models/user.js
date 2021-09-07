const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    role: {
        type: Number,
        required: true
    },
    schedule: [{
        title: {type: String, required: true},
        start: {type: Date, required: true},
        end: {type: Date, required: true},
        color: {type: String, required: true},
        application: {
            type: Schema.Types.ObjectId,
            ref: 'Application',
            required: true
        },
        interviewURL: {type: String}
    }],
    authenticated: {type: Boolean, required: true}
});

module.exports = mongoose.model('User', userSchema);