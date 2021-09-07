const User = require('../../models/user');
const Company = require('../../models/company');
const bcrypt = require('bcrypt');
const validator = require('validator');
const {setCookies, sendEmail, createConfirmationUrl, generateSignupContent} = require('../../utils');
const {redis} = require('../../redis');
const Job = require('../../models/job');
const Application = require('../../models/application');

module.exports = {
    getUser: async ({}, {req, res}) => {
        if (!req.user) throw new Error('Access Denied');
        // populate application
        // For security, return only the fields that the user can see
        try {
            const user = await User.findById(req.user._id);
            const lop = user.schedule.map(event => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const app = await Application.findById(event.application);
                        const job = await Job.findById(app.job);
                        const company = await Company.findById(job.creator);
                        const temp = {
                            ...event._doc,
                            application: {
                                _id: app.id,
                                history: app.history,
                                job: {
                                    creator: {
                                        companyName: company.companyName
                                    }
                                }
                            }
                        }
                        return resolve(temp);
                    } catch (err) {
                        reject(err);
                    }
                });
            });
            const list = await Promise.all(lop);
            const result = {
                ...user._doc,
                schedule: list
            };
            return result;            
        }
        catch (err) {
            throw err;
        }
    },
    signin: async ({email, password}, {req, res}) => {
        if (!validator.isEmail(email))
            throw new Error("Invalid email format");
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('Your email or password is incorrect');
        }
        if (!user.authenticated) {
            throw new Error('You have not authenticate your account. Please check your email for verification');
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new Error('Your email or password is incorrect');
        }
        req.session.user = user;
        let cookies = setCookies({id: user.id, role: user.role});
        res.setHeader('Set-Cookie', cookies);
        return { email: user.email, username: user.username, role: user.role };
    },
    signup: async ({userInput}) => {
        const {email, password, username} = userInput;
        try {
            if (!validator.isEmail(email))
                throw new Error("Invalid email format");
            const user = User.findOne({email: email});
            const company = Company.findOne({email: email});
            let values = await Promise.all([user, company]);
            if (values[0] && values[0].authenticated)
                throw new Error('User existed');
            if (values[1])
                throw new Error('This account already registered as a company');
            const salt = await bcrypt.genSalt(10);
            const saltedHash = await bcrypt.hash(password, salt);
            let newUser = new User({
                username: validator.escape(username),
                email: email,
                password: saltedHash,
                role: 1,
                schedule: [],
                authenticated: false
            });
            const result = newUser.save();
            const url = createConfirmationUrl("u"+newUser.id);
            values = await Promise.all([result, url]);
            await sendEmail(email, generateSignupContent(values[1]));
            return {...values[0]._doc, password: null};
        } catch(err) {
            throw err;
        }
    },
    confirmRegister: async ({token}) => {
        const obj = await redis.get(token);
        if (!obj) return false;
        const type = obj.charAt(0);
        const id = obj.substring(1);
        let user;
        if (type === 'c') user = await Company.findById(id);
        else user = await User.findById(id);
        user.authenticated = true;
        await user.save();
        await redis.del(token);
        return true;
    }
};