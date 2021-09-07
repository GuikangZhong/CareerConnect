const Company = require('../../models/company');
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const validator = require('validator');
const {storeFS, setCookies, sendEmail, createConfirmationUrl, generateSignupContent} = require('../../utils');
const fs = require('fs');
const fsPromises = fs.promises;
module.exports = {
    updateProfile: async (args, {req, res}) => {
        if (!req.user) throw new Error('Access Denied');
        try {
            let {logo, name, description, location} = args;
            let fileLocation = null;
            let fileType = null;
            if (logo) {
                const { filename, mimetype, createReadStream } = await logo.file;
                const stream = createReadStream();
                const dest = `profile/${req.user._id}`;
                const folder = `${__dirname}/../../uploads/${dest}`;
                // create the corresponding temp folder
                await fsPromises.mkdir(folder, {recursive: true});
                fileLocation = await storeFS({stream, filename, dest: dest});
                fileType = mimetype;
            }
            const company = await Company.findById(req.user._id);
            if (!company) {
                throw new Error('The company does not exist');
            }
            let logoObj = {location: fileLocation ? fileLocation: company.profile.logo.location, mimetype: fileType ? fileType: company.profile.logo.mimetype}
            company.profile = {logo: logoObj, description, location};
            company.companyName = name;
            const result = await company.save();
            return {...result._doc, password: null};
        } catch (err){
            throw err;
        }

    },
    getCompany: async ({id}, {req, res}) => {
        // For security, return only the fields that the user can see
        try {
            const company = await Company.findById(id);
            if (!company) throw new Error('The company does not exist');
            const result = {
                _id: company.id,
                companyName: company.companyName,
                profile: {
                    logo: {
                        location: company.profile.logo.location
                    },
                    description: company.profile.description,
                    location: company.profile.location
                }
            };
            return result;
        } catch (err) {
            throw err;
        }
    },
    signinCompany: async ({email, password}, {req, res}) => {
        if (!validator.isEmail(email))
            throw new Error("Invalid email format");
        const company = await Company.findOne({ email: email });
        if (!company) {
            throw new Error('Your email or password is incorrect');
        }
        if (!company.authenticated) {
            throw new Error('You have not authenticate your account. Please check your email for verification');
        }
        const valid = await bcrypt.compare(password, company.password);
        if (!valid) {
            throw new Error('Your email or password is incorrect');
        }
        req.session.user = company;
        let cookies = setCookies({id: company.id, role: company.role});
        res.setHeader('Set-Cookie', cookies);
        return { email: company.email, username: company.companyName, role: company.role };
    },
    createCompany: async ({companyInput}) => {
        const {email, password, companyName} = companyInput;
        try {
            if (!validator.isEmail(email))
                throw new Error("Invalid email format");
            const company = Company.findOne({email: email});
            const user = User.findOne({email: email});
            let values = await Promise.all([company, user]);
            if (values[0] && values[0].authenticated)
                throw new Error('Company existed');
            if (values[1])
                throw new Error('This account already registered as a user');
            const salt = await bcrypt.genSalt(10);
            const saltedHash = await bcrypt.hash(password, salt);
            const newCompany = new Company({
                companyName: validator.escape(companyName),
                email: email,
                password: saltedHash,
                role: 2,
                createJobs: [],
                profile: {
                    logo: {
                        location: null, 
                        mimetype: null
                    },
                    location: null,
                    description: null
                },
                authenticated: false
            });
            const result = newCompany.save();
            const url = createConfirmationUrl("c"+newCompany.id);
            values = await Promise.all([result, url]);
            await sendEmail(email, generateSignupContent(values[1]));
            return {...values[0]._doc, password: null};
        } catch(err) {
            throw err;
        }
    }
};