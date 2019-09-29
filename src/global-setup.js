/**
 * JEST SETUP TEST FILE
 * Runs before all tests are run
 */

// console.log('\n Run global-setup...\n')
// const mongoose = require('mongoose')

// // Load models that will be used separately from Express server
// require('../backend/models/user.model')

// beforeEach((done) => {
//     // Define clearDB function - loop through all collections in Mongoose connection & drop
//     function clearDB() {
//         for(let i in mongoose.connection.collections) {
//             mongoose.connections.collections[i].remove(() => {})
//         }
//         return done();
//     }

//     // If Mongoose connection is closed, startup using test url and database name
//     if (mongoose.connection.readyState == 0) {
//         mongoose.connect(`mongodb://localhost:27017/${process.env.TEST_SUITE}`),  // database name changes based on test suite currently running
//         (err) => {if (err) {throw err} else {return clearDB()}}
//     }
//     else { clearDB() }
// });

// // Disconnect from test database after execution of every test
// afterEach((done) => {
//     mongoose.disconnect();
//     return done();
// })

// // After all tests are executed
// afterAll((done) => {
//     return done();
// })

export default async() => {}