const express = require('express');
const cors = require('cors');

// Allow connection to db server
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000

// Middleware - must be used in ALL files that create an Express app, otherwise will not be able to parse POST requests
app.use(cors())
app.use(express.json())

app.listen(port, () => console.log(`Server started on port: ${port}`))

// Configure MongoDB
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully!")
});

// Import and use routers
const usersRouter = require('./routes/users')
const projectsRouter = require('./routes/projects')
app.use('/users', usersRouter)
app.use('/projects', projectsRouter)