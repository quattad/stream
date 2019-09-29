const assert = require('chai').assert;
const expect = require('chai').expect;
const User = require('../models/user.model.js');

// Define database name for test suite
process.env.TEST_SUITE = 'user-model-test'

// Create tests
describe('user-model-tests-create', () => {
    it('User with valid fields successfully created in DB', (done) => {
        test_user = new User({
            'username':'test-user',
            'password':'p@ssw0rd123!',
            'prefix':'Mr'
        })

        test_user.save()
            .then(() => {
                assert(!test_user.isNew)
            })
        done();
    });

    it('User with empty username cannot be saved into database', (done) => {return done()})
    //     test_user = new User({
    //         'username':'',
    //         'password':'p@ssw0rd123!',
    //         'prefix':'Mr'
    //     });
    // });
});

// Read tests
// describe('user-model-tests-read', () => {
//     it('Test 1', (done) => {
//         assert(1 == 1);
//         done();
//     });
// });

// Update tests
// describe('user-model-tests-update', () => {
//     it('Test 1', (done) => {
//         assert(1 == 1);
//         done();
//     });
// });

// Delete tests
// describe('user-model-tests-delete', () => {
//     it('Test 1', (done) => {
//         assert(1 == 1);
//         done();
//     });
// })