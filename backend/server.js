const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')

// Allow connection to db server
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000

// Middleware - must be used in ALL files that create an Express app, otherwise will not be able to parse POST requests
app.use(cors({credentials:true, origin: process.env.BASE_CLIENT_URL}))
app.use(express.json())

// Serve client-side code after building
// app.use(express.static(path.join(__dirname, '/client/build')))

app.listen(port, () => console.log(`Server started on port: ${port}`))

// Configure MongoDB
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully!")
});

// Configure secret key for signing cookies 
app.use(cookieParser(process.env.COOKIE_SECRET))

// Import and use routers
const usersRouter = require('./routes/users')
const projectsRouter = require('./routes/projects')
const featuresRouter = require('./routes/features')
const tasksRouter = require('./routes/tasks')

app.use('/users', usersRouter);
app.use('/projects', projectsRouter);
app.use('/features', featuresRouter);
app.use('/tasks', tasksRouter);