const Job = require('../../models/job');
const Company = require('../../models/company');
const Application = require('../../models/application');
const {storeFS} = require('../../utils');
const Fuse = require('fuse.js');
const jobsPerPage = 10;
const fs = require('fs');
const User = require('../../models/user');
const fsPromises = fs.promises;
module.exports = {
    applyJob: async (args, {req, res}) => {
        if (!req.user) throw new Error('Access Denied');
        try {
            const {jobId, files} = args;
            let appId;
            const job = await Job.findById(jobId);
            if (!job) throw new Error("Job does not exists");
            // if pass due date, cannot apply job
            if (job.dueDate <= new Date()) throw new Error("The due date is passed");
            let app = await Application.findOne({job: job.id, applicant: req.user._id});
            if (app) {
                appId = app.id;
            } else {
                const node = {status: 0, modifiedDate: new Date()};
                app = new Application({files: [], job: job.id, applicant: req.user._id, history: [node]});
                app = await app.save();
                appId = app.id;
            }
            const temp = await files;
            let list = [];
            const dest = `resume/${appId}`;
            const folder = `${__dirname}/../../uploads/${dest}`;
            // create the corresponding temp folder
            await fsPromises.mkdir(folder, {recursive: true});
            let fileLocation;
            let lop = temp.map(elem => {
                return new Promise(async (resolve, reject) => {
                    const {filename, mimetype, createReadStream} = await elem.file;
                    const stream = createReadStream();
                    fileLocation = await storeFS({stream, filename, dest: dest});
                    return resolve({location: fileLocation, mimetype: mimetype});
                });
            });
            list = await Promise.all(lop);
            app.files = list;
            let index = job.applications.indexOf(appId);
            if (index !== -1) job.applications[index] = appId;
            else job.applications.push(appId);
            await job.save();
            const result = await app.save();
            return result;
        }
        catch (err) {
            throw err;
        }
    },
    getJob: async ({id}, {req, res}) => {
        try {
            const job = await Job.findById(id);
            if (!job) throw new Error("The job does not exist");
            const company = await Company.findById(job.creator);
            // if it is company user
            let companyUser;
            if (req.user)
                companyUser = await Company.findById(req.user._id);
            let result;
            // For security, return only the fields that the user can see
            if (companyUser) {
                const lop = job.applications.map(appId => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const app = await Application.findById(appId);
                            const applicant = await User.findById(app.applicant);
                            const temp = {
                                _id: app.id,
                                files: app.files,
                                applicant: {
                                    _id: applicant.id,
                                    username: applicant.username,
                                    email: applicant.email
                                },
                                history: app.history,
                            }
                            resolve(temp);
                        } catch (err) {
                            reject(err);
                        }
                    });
                });
                const apps = await Promise.all(lop);
                result = {
                    ...job._doc,
                    creator: {
                        _id: company.id,
                        companyName: company.companyName,
                        profile: {
                            logo: {
                                location: company.profile.logo.location
                            },
                            location: company.profile.location
                        }
                    },
                    applications: apps,
                    createdAt: job.createdAt,
                    salary: job.salary
                }
            } else {
                result = {
                    ...job._doc,
                    creator: {
                        _id: company.id,
                        companyName: company.companyName,
                        profile: {
                            logo: {
                                location: company.profile.logo.location
                            },
                            location: company.profile.location
                        }
                    },
                    createdAt: job.createdAt,
                    salary: job.salary
                }
            }
            return result;
        } catch (err) {
            throw err
        }
    },
    getAllJobs: async ({page, searchKeyword, labels}, {req, res}) => {
        try {
            // sanitize keyword
            // searchKeyword = validator.escape(searchKeyword);
            let jobs, company, hasKeyword = false;
            const filter = {};
            if (labels.length > 0) filter.labels = {$in: labels.map(label => new RegExp(label, "i"))};
            // filter.title = {$regex: new RegExp(searchKeyword, "i")}; 
            if (req.user) {
                company = await Company.findById(req.user._id);
            } 
            if (company) filter.creator = req.user._id;
            // if regular users, filter the expired job postings
            else {
                filter.dueDate = {$gt: new Date()};
            }
            // use fusejs library to do fuzzy-searching
            // Referenced URL: https://fusejs.io/
            const options = {keys: ["title"]};
            jobs = Job.find(filter);
            if (searchKeyword.length > 0) {
                const fuse = new Fuse(await jobs, options);
                jobs = fuse.search(searchKeyword);
                if (jobs.length > jobsPerPage) 
                    jobs = jobs.slice(page*jobsPerPage,(page+1)*jobsPerPage);
                hasKeyword = true;
            }
            else
                jobs = await jobs.skip(page*jobsPerPage).limit(jobsPerPage);

            const lop = jobs.map(job => {
                return fetchData(hasKeyword ? job.item : job, company);
            });
            const results = await Promise.all(lop);
            return results;
                
        } catch (err) {
            throw err;
        }
    },
    getTotalPages: async ({}, {req, res}) => {
        try {
            let company;
            const filter = {};
            // if a company logs in, find its job postings
            if (req.user) {
                company = await Company.findById(req.user._id);
            }
            if (company) filter.creator = company.id;
            return Math.ceil(await Job.countDocuments(filter)/jobsPerPage);
        } catch (err) {
            throw err;
        }
    },
    createJob: async ({jobInput}, {req, res}) => {
        if (!req.user) throw new Error('Access Denied');
        let {title, labels, description, requirement, dueDate, salary} = jobInput;
        const newJob = new Job({
            title: title,
            labels: labels,
            description: description,
            requirement: requirement,
            dueDate: dueDate,
            applicants: [],
            creator: req.user._id,
            salary: salary
        });
        try {
            const result = await newJob.save();
            const creator = await Company.findById(req.user._id);
      
            if (!creator) {
                throw new Error('404');
            }
            creator.createdJobs.push(result);
            await creator.save();
            return result;
          } catch (err) {
            throw err;
        }
    }
};

const fetchData = (job, isCompany) => {
    return new Promise(async (resolve, reject) => {
        try {
            let temp;
            const company = await Company.findById(job.creator);
            if (isCompany) {
                // For security, return only the fields that the user can see
                temp = {
                    ...job._doc,
                    creator: {
                        ...company._doc
                    }
                };
            } else {
                temp = {
                    ...job._doc,
                    creator: {
                        _id: company.id,
                        companyName: company.companyName,
                        profile: {
                            location: company.profile.location,
                            logo: {
                                location: company.profile.logo.location
                            }
                        }
                    }
                }
            }
            return resolve(temp);
        } catch (err) {
            reject(err);
        }
    });
};