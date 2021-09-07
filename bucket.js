const {Storage} = require('@google-cloud/storage');
const path = require('path');

exports.storage = new Storage({
    keyFilename: path.join(__dirname, "gcpconfig.json"),
    projectId: 'aqueous-impact-256120'
});