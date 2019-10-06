/**
 * STRUCTURE FOR UNIT TESTS
 * 1) Unit under test - What service? What functionality?
 * 2) Scenario - What circumstances and scenarios? e.g. valid/invalid user data
 * 3) Expected Result - Given the scenario, should the result be accepted or rejected/error thrown?
 */

const assert = require('chai').assert;
const expect = require('chai').expect;
const User = require('./user.model');

describe('CRUD Functionality', () => {
    describe('Create/add new user', () => {
    test_user = new User({
        'username':'test-user',
        'password':'p@ssw0rd123!',
        'prefix':'Mr'
    });

    it('When user with all valid fields is sent to db, the response should be saved', (done) => {
        test_user.save()
            .then(() => {
                assert(!test_user.isNew)
            });
        done();
    });

    it('When user with invalid username ONLY is sent to db, the response should be 00', (done) => {
        test_user.save()
            .then(() => {
                assert(!test_user.isNew)
            });
        done();
    });
})
    

    describe('Read/fetch user from database', () => {
        it('Test 1', (done) => {
            assert(1 == 1);
            done();
        });
    });

    describe('Update existing user in database', () => {
        it('Test 1', (done) => {
            assert(1 == 1);
            done();
        });
    });

    describe('Delete existing user in database', () => {
        it('Test 1', (done) => {
            assert(1 == 1);
            done();
        });
    });
});