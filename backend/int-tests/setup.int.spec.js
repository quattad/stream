/**
 * INTEGRATION TESTS - SETUP FILE FOR MOCHA
 * Runs before any *.int.spec.js file as long as one level above other *.int.spec.js files
 */

const mongoose = require('mongoose');
const cors = require('cors');

// Define app for supertest
const express = require('express');
const app = express();

// Middleware
app.use(cors())
app.use(express.json())

// Import routers
const usersRouter = require('../routes/users')
const projectsRouter = require('../routes/projects')
app.use('/users', usersRouter)
app.use('/projects', projectsRouter)

// // Setup Jest and Chai by aliasing Jest global expect
// const chai = require('chai')
// // Make sure chai and jasmine ".not" play nice together
// const originalNot = Object.getOwnPropertyDescriptor(chai.Assertion.prototype, 'not').get;
// Object.defineProperty(chai.Assertion.prototype, 'not', {
//   get() {
//     Object.assign(this, this.assignedNot);
//     return originalNot.apply(this);
//   },
//   set(newNot) {
//     this.assignedNot = newNot;
//     return newNot;
//   },
// });

// Combine both jest and chai matchers on expect
// console.log(global.expect)
// const originalExpect = global.expect;
// global.expect = (actual) => {
//   const originalMatchers = originalExpect(actual);
//   const chaiMatchers = chai.expect(actual);
//   const combinedMatchers = Object.assign(chaiMatchers, originalMatchers);
//   return combinedMatchers;
// };

// Setup test DB
beforeEach((done) => {
    // Define clearDB function - loop through all collections in Mongoose connection & drop
    function clearDB() {
        // console.log('Clearing test db...')
        for(var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].deleteMany(function() {})
        }
        // console.log('Test db cleared...')
        return done();
    }

    // If Mongoose connection is closed, startup using test url and database name
    if (mongoose.connection.readyState == 0) {
        // console.log('Connection to test db closed, attempting to connect...')
        // database name changes based on test suite currently running
        mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.TEST_SUITE}`, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

        // Handle promise
        mongoose.connection
            .once('open', () => {
                // console.log('Connected to test database...')
                return clearDB()
            })
            // .on('error', (err) => {console.log('Error: ' + err)});
    }
    else {
        // console.log('Test DB exists, clearing DB...')
        clearDB()
    }
});

// Disconnect from database after each test
// afterEach((done) => {
//     console.log('Disconnecting from test db...')
//     mongoose.disconnect();
//     console.log('Disconnected...')
//     return done();
// });

module.exports = app;