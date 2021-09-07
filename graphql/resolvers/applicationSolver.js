const Application = require('../../models/application');
const User = require('../../models/user');
const Job = require('../../models/job');
let randomColor = require('randomcolor');
const Company = require('../../models/company');
const {generateInvitationContent, sendEmail} = require('../../utils');
const {v4} = require('uuid');
const appPerPage = 10;


module.exports = {
    changeStatus: async ({id, code, title, start, end}, {req, res}) => {
        if (!req.user) throw new Error('Access Denied');
        try {
            const application = await Application.findById(id);
            let user;
            const node = {};
            if (!application) throw new Error ("Application id does not exist.");
            // if code is 1, add the interview time to user's schedule
            if (code === 1) {
                // if code is 1, check if it is company
                const company = Company.findById(req.user._id);
                if (!company) throw new Error('Access Denied');
                user = await User.findById(application.applicant);
                let color = randomColor();
                if (title && start && end && id) {
                    const schedule = {title, start, end, color, application: id};
                    user.schedule.push(schedule);
                }
                // record the interview time for the node
                node.interviewTime = start;
            }
            // if status is 2 or 3 or 7, get the user object
            // if user rejects the interview, delete the interview in schedule
            else if (code === 2 || code === 3) {
                // check if it is a user
                user = await User.findById(req.user._id);
                if (!user) throw new Error('Access Denied');
                const list = user.schedule;
                // find the event index
                let index = list.findIndex(obj => obj.application.toString() === id);
                if (index > -1) {
                    // if user accept the interview, generate the interview url
                    if (code === 2 && index > -1) {
                        list[index].interviewURL = v4();
                        node.interviewURL = list[index].interviewURL;
                    }
                    else if (code === 3 && index > -1) {
                        list.splice(index, 1);
                        user.schedule = list;
                    }
                }
            }
            // change status
            node.status = code;
            node.modifiedDate = new Date();
            application.history.unshift(node);
            // save result
            let userResult, emailResult;
            if (user) userResult = user.save();
            if (code === 1 && user)                     
                // send email to notify the candidate
                emailResult = sendEmail(user.email, generateInvitationContent(title, user.username));
            const appResult = application.save();
            const values = await Promise.all([userResult, appResult, emailResult]);
            const job = await Job.findById(values[1].job);
            const creator = await Company.findById(job.creator);
            // For security, return only the fields that the user can see
            const result = {
                ...values[1]._doc,
                job: {
                    ...job._doc,
                    creator: {
                        ...creator._doc,
                        password: null,
                        createdJobs: null,
                        role: null
                    }
                },
            };
            return result;
        } catch (err){
            throw err;
        }
    }, 
    getApplication: async ({id}, {req, res}) => {
        if (!req.user) throw new Error('Access Denied');
        try {
            // can't use Promise.all because the variables depend on the previous one
            const app = await Application.findById(id);
            if (!app) throw new Error('The application does not exist');
            const result = await fetchData(app);
            return result;
        } catch (err) {
            throw err;
        }
    },
    getApplicationsByUser: async({page}, {req, res}) => {
        if (!req.user) throw new Error('Access Denied');
        try {
            const list = await Application.find({applicant: req.user._id}).skip(appPerPage*page).limit(appPerPage);
            const lop = list.map(app => {
                return fetchData(app);
            });
            const results = await Promise.all(lop);
            return results;
        } catch (err) {
            throw err;
        }
    },
    getTotalApplicationsPages: async ({}, {req, res}) => {
        if (!req.user) throw new Error('Access Denied');
        try {
            return Math.ceil(await Application.countDocuments({applicant: req.user._id})/appPerPage);
        } catch (err) {
            throw err;
        }
    }
};

const fetchData = (app) => {
    return new Promise(async (resolve, reject) => {
        try {
            const job = await Job.findById(app.job);
            const company = await Company.findById(job.creator);
            // For security, return only the fields that the user can see
            const temp = {
                ...app._doc,
                job: {
                    _id: job.id,
                    title: job.title,
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
            };
            return resolve(temp);
        } catch (err) {
            reject(err);
        }
    });
};