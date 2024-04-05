const express = require("express");
const http = require('http');
const socketIo = require('socket.io');
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const {LogInCollection, CodingSessionCollection} = require('C:/Users/OWNER/Desktop/collaborativecodingeditor/src/mongo.js');
const router = express.Router();
const fs = require('fs');
const session = require('express-session');
const app = express();

const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// View engine setup
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.static('node_modules'));


app.use(session({
    secret: 'your-secret-key', // Change this to a secret key for session encryption
    resave: false,
    saveUninitialized: false
}));

app.get("/home", (req, res) => {
    const username = req.session.username;
    res.render("home",{username}); 
})



function generateSessionCode() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let sessionCode = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        sessionCode += characters[randomIndex];
    }
    return sessionCode;
}


let sessions = [];


router.post('/createSession', (req, res) => {
  const { userId, sessionName } = req.body;
  const sessionCode = generateSessionCode(); // You need to implement this function
  const session = { sessionCode, sessionName, creatorId: userId };
  sessions.push({ sessionCode, sessionName, creatorId: userId });
  res.status(201).json({ sessionCode });
});



app.get('/createSession', async (req, res) => {
    try {

        const sessionCode = generateSessionCode();
        const sessionName = "New Coding Session";

        const newSession = new CodingSessionCollection({
            sessionCode: sessionCode,
            sessionName: sessionName
        });


        await newSession.save();

        res.redirect(`/work/${sessionCode}`);
    } catch (error) {

        console.error('Error creating session:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('session/join', (req, res) => {
    const { sessionCode } = req.body;
    const session = sessions.find(session => session.sessionCode === sessionCode);
    if (session) {
      res.json(session);
    } else {
      res.status(404).json({ error: 'Session not found' });
    }
  });
  



app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const data = {
        email: req.body.email,
        name: req.body.username,
        password: req.body.password
    };

    console.log("Received signup request with data:", data);

    try {
        if (!data.email || !data.name || !data.password) {
            return res.status(400).send("Missing required fields");
        }

        const existingUser = await LogInCollection.findOne({ name: data.name });

        if (existingUser) {
            return res.send("Username already used");
        } else {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            data.password = hashedPassword;

            const userData = await LogInCollection.create(data);
            console.log("User data inserted:", userData);

            return res.redirect("/");
        }
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).send("Error registering user");
    }
});



app.post("/login", async (req, res) => {
    const {email, password } = req.body;

    try {
        const userData = await LogInCollection.findOne({ email });
        console.log("User Data:", userData);
        if (!userData) {
            return res.send("Username cannot be found");
        }
        
        const isPasswordMatch = await bcrypt.compare(password, userData.password);
        if (isPasswordMatch) { 
            req.session.username = userData.name;
            return res.redirect("/home");
        } else {
            return res.send("Wrong password");
        }
    } catch (error) {
        console.error(error);
        return res.send("Error authenticating user");
    }
});

app.get("/work/:sessionId", async (req, res) => {
    const { sessionId } = req.params;

    try {
        // Query the database to find the coding session with the given session ID
        const codingSession = await CodingSessionCollection.findOne({
            sessionCode: sessionId,
        });

        // Check if the coding session exists
        if (!codingSession) {
            // If the session doesn't exist, return a 404 Not Found response
            return res.status(404).send("Session not found");
        }
        const username = req.session.username;
        // Assuming you have the username available in the request object
        console.log(username);


        // Render the "work" view (or workspace) with the session details
        res.render("work", { username, sessionCode: sessionId });
    } catch (error) {
        // If an error occurs, log the error and return a 500 Internal Server Error response
        console.error("Error retrieving coding session:", error);
        res.status(500).send("Internal Server Error");
    }
});
const { exec } = require('child_process');

// Route handler for compiling and running code

// Route handler for compiling and running code
app.all('/compileAndRun', (req, res) => {
    const { code, language } = req.body;

    console.log('Received code:', code);

    let fileName, compileCommand, runCommand;
    if (language === 'java') {
        fileName = 'Main.java';
        compileCommand = 'javac Main.java';
        runCommand = 'java Main';
    } else if (language === 'python') {
        fileName = 'script.py';
        compileCommand = null; // Python nu necesită compilare separată
        runCommand = 'python script.py';
    } else if (language === 'c') {
        fileName = 'main.c';
        compileCommand = 'gcc -o main main.c';
        runCommand = './main';
    } else {
        return res.status(400).send('Unsupported language');
    }

    // Write the code into the corresponding file
    fs.writeFile(fileName, code, (err) => {
        if (err) {
            console.error('Error writing code to file:', err);
            return res.status(500).send('Error writing code to file');
        }

        console.log('Code written to file:', fileName);

        if (compileCommand) {
            exec(compileCommand, (err, stdout, stderr) => {
                if (err) {
                    return res.send(stderr);
                }
                exec(runCommand, (err, stdout, stderr) => {
                    if (err) {
                        return res.send(stderr);
                    }
                    res.send(stdout);
                });
            });
        } else {
            exec(runCommand, (err, stdout, stderr) => {
                if (err) {
                    return res.send(stderr);
                }
                res.send(stdout);
            });
        }
    });
});




// Socket.IO connection handling
io.on('connection',(socket)=>{
    console.log('A user connected');
    socket.on('chatMessage',(message)=>{
        io.emit('chatMessage', message);
    });
    socket.on('codeUpdate', ({ code, username }) => {
        // Broadcast the updated code along with the username to all connected clients
        io.emit('codeUpdate', { code, username });
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
})
// Server setup
const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});