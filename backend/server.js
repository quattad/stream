const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')

// Allow connection to db server
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000

// Middleware
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
app.use('/users', usersRouter)