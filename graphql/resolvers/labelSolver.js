const Label = require('../../models/label');
module.exports = {
    getLabels: async () => {
        const labels = await Label.find();
        const result = labels[0].tags;
        return result;
    }
}