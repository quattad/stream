const express = require('express');
const cors = require('cors');

// Allow connection to db server
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000

// Configure MongoDB
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully!")
});

// Create routers/views
const usersRouter = require('./routes/users')
app.use('/users', usersRouter)

// Middleware
app.use(cors())
app.use(express.json())

app.listen(port, () => console.log(`Server started on port: ${port}`))