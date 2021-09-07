const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    scalar Upload
    scalar Date
    type RootQuery {
        getApplication(id: ID!): Application!
        getApplicationsByUser(page: Int!): [Application!]!
        getCompany(id: ID!): Company!
        getUser: User!
        getJob(id: ID!): Job!
        getLabels: [String!]!
        getAllJobs(page: Int!, searchKeyword: String!, labels: [String!]!): [Job!]!
        getTotalPages: Int!
        getTotalApplicationsPages: Int!
        signin(email: String!, password: String!): AuthData!
        signinCompany(email: String!, password: String!): AuthData!
    }

    type RootMutation {
        signup(userInput: UserInput): User
        createCompany(companyInput: CompanyInput): Company
        createJob(jobInput: JobInput): Job
        applyJob(jobId: ID!, files: [Upload!]!): Application
        updateProfile(logo: Upload, name: String!, description: String!, location: String!): Company
        changeStatus(id: ID!, code: Int!, title: String, start: Date, end: Date): Application
        confirmRegister(token: String!): Boolean!
    }

    type AuthData {
        username: String
        email: String
        role: Int
    }

    type User {
        _id: ID
        username: String
        email: String
        password: String
        role: Int
        schedule: [Schedule]
        authenticated: Boolean
    }

    type Schedule {
        _id: ID
        title: String
        start: Date
        end: Date
        color: String
        application: Application
        interviewURL: String
    }

    type Company {
        _id: ID
        companyName: String
        email: String
        password: String
        createdJobs: [Job]
        role: Int
        profile: Profile
        authenticated: Boolean
    }

    type Profile {
        logo: File
        description: String
        location: String
    }

    type File {
        location: String,
        mimetype: String
    }

    type Job {
        _id: ID
        title: String
        labels: [String]
        description: String
        requirement: String
        dueDate: Date
        creator: Company
        applications: [Application]
        createdAt: Date
        updatedAt: Date
        salary: String
    }

    type Application {
        _id: ID
        files: [File]
        applicant: User
        job: Job
        history: [Node]
        createdAt: Date
    }

    type Node {
        status: Int
        modifiedDate: Date
        interviewTime: Date
        interviewURL: String
    }

    input UserInput {
        username: String!
        email: String!
        password: String!
    }

    input CompanyInput {
        companyName: String!
        email: String!
        password: String!
    }

    input JobInput {
        title: String!
        labels: [String!]!
        description: String!
        requirement: String!
        dueDate: String!
        salary: String!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);