"use strict";
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./graphql/schema/index');
const resolvers = require('./graphql/resolvers/index');
const cookie = require('cookie');
const session = require('express-session');
const {graphqlUploadExpress} = require('graphql-upload');
const Job = require('./models/job');
const Company = require('./models/company');
const Application = require('./models/application');
const {setCookies} = require('./utils');
const archiver = require('archiver');
const fs = require('fs');
const fsPromises = fs.promises;
const {storage} = require('./bucket');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const dotenv = require("dotenv");
dotenv.config();
const dir = 'uploads';

(function preStage() {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    fs.writeFile(process.env.GCP_KEY_FILE, process.env.GCP_CRED, (err) => {});
})();

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'frontend/build')));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});
app.get("/signin", (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});
app.get("/job/:id", (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});
app.get("/createjob", (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});
app.get("/credits", (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});
app.get("/applications", (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});
app.get("/application/:applicationId", (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});
app.get("/profile/:companyId", (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});
app.get("/schedule", (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});
app.get("/confirm/:token", (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});
app.get("/interview/:roomId/:title/:peerName", (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});

let isAuthenticated = function(req, res, next) {
    if (!req.user) return res.status(401).send("Access denied");
    next();
};

app.use(function(req, res, next){
    req.user = ('user' in req.session)? req.session.user : null;
    let id = '';
    let role = 0;
    if (req.user) {
        id = req.user._id;
        role = req.user.role;
    }
    let cookies = setCookies({id, role});
    res.setHeader('Set-Cookie', cookies);
    next();
});

// Use socket.io library for realtime communication
// Referenced URL: https://socket.io/docs/v4
// The WebRTC with socket.io example: https://github.com/coding-with-chaim/group-video-final
const users = {};
io.on('connection', socket => {
    // join an interview room
    socket.on('join room', roomId => {
        if (!users[roomId])
            users[roomId] = [socket.id];
        else
            users[roomId].push(socket.id);

        socket.join(roomId);
        socket.emit("all users", users[roomId].filter(id => id !== socket.id));

        socket.on("call others", data => {
            socket.to(data.calleeId).emit('I am joined', {signal: data.signal, callerId: data.callerId});
        });
    
        socket.on("accept calls", data => {
            socket.to(data.callerId).emit('received calls', {signal: data.signal, calleeId: socket.id});
        });
        
        socket.on('disconnect', () => {
            let index = users[roomId].findIndex(idx => socket.id === idx);
            if (index > -1) users[roomId].splice(index, 1);
            socket.to(roomId).broadcast.emit('user disconnected', socket.id);
        });
    });
});

app.get('/signout/', function (req, res, next) {
    req.session.destroy();
    let cookies = [];
    cookies.push(cookie.serialize('id', '', {
        path : '/', 
        maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    cookies.push(cookie.serialize('role', '', {
        path : '/', 
        maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    res.setHeader('Set-Cookie', cookies);
    res.send('sign out!');
});

app.use((req, res, next) => {
    const allowedOrigins = ["https://bubblecareerconnect.me", "https://bubbletea-careerconnect.herokuapp.com", "http://localhost:3000"]
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS, PATCH");
    res.setHeader("Access-Control-Allow-Credentials","true");
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
});

app.use('/graphql',
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }), 
    graphqlHTTP((req, res) => ({
        schema: schema,
        rootValue: resolvers,
        graphiql: true,
        context: {req, res}
    }))
);

app.get('/api/uploads/profile/:id/logo/', function (req, res, next) {
    const id = req.params.id;
    Company.findById(id, (err, result) => {
        if (err) return res.status(500).end(err);
        if (!result) res.status(404).send('The company does not exist');
        else if (result.profile.logo.mimetype && result.profile.logo.location) {
            res.setHeader('Content-Type', result.profile.logo.mimetype);
            res.json({url: `https://storage.googleapis.com/bubblecareerconnect/${result.profile.logo.location}`});
        }
        else {
            res.json(null);
        }
    });
});

app.get('/api/uploads/resume/:id/', isAuthenticated, function (req, res, next) {
    const id = req.params.id;
    Application.findById(id, async (err, result) => {
        if (err) return res.status(500).end(err);
        const job = await Job.findById(result.job);
        const company = await Company.findById(job.creator);
        if (!result) res.status(404).send('The resume does not exist');
        else if (company.id !== req.user._id) res.status(401).send('Access denied');
        else if (result.files[0].mimetype && result.files[0].location) {
            res.setHeader('Content-Type', result.files[0].mimetype);
            res.json({url: `https://storage.googleapis.com/bubblecareerconnect/${result.files[0].location}`});
        }
        else {
            res.json(null);
        }
    });
});

app.get('/api/downloads/resumes/:id/', isAuthenticated, async function (req, res, next) {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).send('The job does not exist');
    const company = await Company.findById(job.creator);
    if (company.id !== req.user._id) return res.status(401).send('Access denied');
    const appIdList = job.applications;
    const bucket = storage.bucket('bubblecareerconnect');
    const promises = appIdList.map(id => {
        return bucket.getFiles({prefix: `resume/${id}/`});
    });
    const result = await Promise.all(promises);

    // create the corresponding temp folder
    const folder = `${__dirname}/uploads/all-resumes/${jobId}`
    await fsPromises.mkdir(folder, {recursive: true});
    // create a file to stream archive data to.
    const output = fs.createWriteStream(`${folder}/${job.title}.zip`);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });
    // compress the files
    result.forEach(elem1 => {
        elem1[0].forEach(elem2 => {
            let file = elem2;
            let read_file = file.createReadStream();
            archive.append(read_file, {name: file.metadata.name});
        });
    });
    // pipe archive data to the file
    archive.pipe(output);

    archive.on('error', function(err) {
        throw err;
    });
    output.on('close', function() {
        res.download(`${folder}/${job.title}.zip`);
    });
    archive.finalize();
});

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
    }@cluster0.iobcd.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
)
.then(() => {
    const PORT = process.env.PORT || 4000;
    server.listen(PORT);
})
.catch(err => {
    console.log(err);
});