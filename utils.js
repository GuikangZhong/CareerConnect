const fs = require('fs');
const fsPromises = fs.promises;
const {path: pathLib} = require('path');
const {storage} = require('./bucket');
const cookie = require('cookie');
const {v4} = require('uuid');
const nodemailer = require("nodemailer");
const {redis} = require('./redis');

module.exports = {
    // Use google buckets to store the files
    // Referenced URL: https://googleapis.dev/nodejs/storage/latest/Bucket.html#upload
    // File Read & Write Example: https://morioh.com/p/b7558204c9e3
    storeFS: ({ stream, filename, dest }) => {
        const pathForDB = `${dest}/${filename}`;
        const path = `${__dirname}/uploads/${dest}/${filename}`;
        // create temp file at local first
        return new Promise((resolve, reject) =>
        stream
            .on('error', error => {
                if (stream.truncated)
                    // delete the truncated file
                    fs.unlink(path, () => {});
                reject(error);
            })
            .pipe(fs.createWriteStream(path))
            .on('error', error => reject(error))
            .on('finish', () => {
                // delete the old folder on google bucket
                storage.bucket('bubblecareerconnect').deleteFiles({prefix: dest})
                .then(() => {
                    // upload the files to google storage
                    return storage.bucket('bubblecareerconnect').upload(path, {destination: pathForDB});
                })
                .then(() => {
                    // delete the files in corresponding local folder
                    return fsPromises.rmdir(`${__dirname}/uploads/${dest}/`, {recursive: true});
                })
                .then(() => resolve(pathForDB))
                .catch(err => reject(err));
            })
        );
    },  
    setCookies: (dict) => {
        let cookies = [];
        for (let key of Object.keys(dict)) {
            cookies.push(cookie.serialize(`${key}`, dict[key], {
                path : '/', 
                maxAge: 60 * 60 * 24 * 7, // 1 week in number of seconds
                secure:  process.env.NODE_ENV === "production",
                sameSite: true
            }));
        }
        return cookies;
    },
    createConfirmationUrl: async (userId) => {
        const token = v4();
        await redis.set(token, userId, "ex", 60 * 10); // 10 mins expiration
        return process.env.NODE_ENV === 'production' ? `https://bubblecareerconnect.me/confirm/${token}` : `http://localhost:3000/confirm/${token}`;
    },
    sendEmail: async (email, {subject, html}) => {

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
               ciphers:'SSLv3'
            },
            auth: {
                user: process.env.ACCOUNT_EMAIL,
                pass: process.env.ACCOUNT_PASS
            }
        });
        
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: `"Career Connect" <guikang.zhong@mail.utoronto.ca>`, // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: html // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    },
    generateSignupContent: (url) => {
        const result = {};
        result.subject = "Confirm Your Career Connect Registration";
        result.html = `
        <p>Hi! Please click this link to confirm your signup. The link will expire in 10 minutes.</p>
        <a href="${url}">${url}</a>`;
        return result;
    },
    generateInvitationContent: (title, username) => {
        const result = {};
        result.subject = `${title} Interview Invitation on Career Connect`;
        result.html = `
        <p>Congratulation <b>${username}!</b> You have an interview invitation regarding to <b>${title}</b>. Please to log in to Career Connect to confirm your decision.</p>`;
        return result;
    }
};
