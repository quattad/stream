/**
 * JEST SETUP TEST FILE
 * Runs before all tests are run
 */

const mongoose = require('mongoose')

// Load models that will be used separately from Express server
require('../backend/models/user.model')

beforeEach(function(done) {
    // Define clearDB function - loop through all collections in Mongoose connection & drop
    function clearDB() {
        for(let i in mongoose.connection.collections) {
            mongoose.connections.collections[i].remove(() => {})
        }
        return done();
    }

    // If Mongoose connection is closed, startup using test url and database name
    if (mongoose.connection.readyState == 0) {
        mongoose.connect(`mongodb://localhost:27017/${process.env.TEST_SUITE}`),  // database name changes based on test suite currently running
        (err) => {if (err) {throw err} else {return clearDB()}}
    }
    else { clearDB() }
});

// Disconnect from test database after execution of every test
afterEach((done) => {
    mongoose.disconnect();
    return done();
})

// After all tests are executed
afterAll((done) => {
    return done();
})

/* Create/connect to test database */
// export default async() => {
//     console.log('\n Preparing test database... \n')
//     const collections = []; // figure out what to put here
//     const dbManager = await getDemoDB();

//     for (const collection of collections) {
//         await dbManager.db.createCollection(collection);
//         await prepareDatabase();
//         console.log('Collection' + collection + 'prepared!')
//     }
// }