
const userSolver = require('./userSolver');
const companySolver = require('./companySolver');
const jobSolver = require('./jobSolver');
const applicationSolver = require('./applicationSolver');
const labelSolver = require('./labelSolver');
const { GraphQLUpload } = require('graphql-upload');

const resolvers = {
  Upload: GraphQLUpload,
  ...userSolver,
  ...companySolver,
  ...jobSolver,
  ...applicationSolver,
  ...labelSolver
};

module.exports = resolvers;
