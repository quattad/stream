/**
 * SETUP FILE FOR MOCHA FOR BACKEND (API) TESTING
 * Runs before any *.spec.js file as long as it is one level higher due to Mocha recursive file search
 */

const mongoose = require('mongoose');

beforeEach((done) => {
    // Define clearDB function - loop through all collections in Mongoose connection & drop
    function clearDB() {
        console.log('Run clearDB()...')
        for(var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].deleteMany(function() {})
        }
        console.log('Test DB cleared...')
        return done();
    }

    // If Mongoose connection is closed, startup using test url and database name
    if (mongoose.connection.readyState == 0) {
        console.log('Connection to test DB closed, attempting to connect...')
        // database name changes based on test suite currently running
        mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.TEST_SUITE}`, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

        // Handle promise
        mongoose.connection
            .once('open', () => {
                console.log('Connected to test database...')
                return clearDB()
            })
            .on('error', (err) => {console.log('Error: ' + err)});
    }
    else {
        console.log('Test DB exists, clearing DB...')
        clearDB()
    }
});