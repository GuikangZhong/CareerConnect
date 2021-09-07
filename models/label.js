const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const labelSchema = new Schema({
    tags: [{
        type: String,
        required: true
    }]
});

module.exports = mongoose.model('Label', labelSchema);