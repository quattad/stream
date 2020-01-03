if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
};

let path = require('path');

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Allow connection to db server
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

// Middleware - must be used in ALL files that create an Express app, otherwise will not be able to parse POST requests
app.use(cors({
    credentials:true, 
    origin: process.env.BASE_CLIENT_URL
        })
);

app.use(express.json());

// Import and use routers
const usersRouter = require('./routes/users');
const projectsRouter = require('./routes/projects');
const featuresRouter = require('./routes/features');
const tasksRouter = require('./routes/tasks');

// Configure secret key for signing cookies 
app.use(cookieParser(process.env.COOKIE_SECRET))

// Configure API routes
app.use(`/api/users`, usersRouter);
app.use(`/api/projects`, projectsRouter);
app.use(`/api/features`, featuresRouter);
app.use(`/api/tasks`, tasksRouter);

// Configure static files routes
if (process.env.NODE_ENV === "production") {
    // Setup node.js app to use static folder
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });
};

app.listen(port, () => console.log(`Server started on port: ${port}`))

// Configure and connect to MongoDB
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { 
    useNewUrlParser: true, 
    useCreateIndex: true 
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully!")
});