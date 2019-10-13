// ORIGINAL FILE NAME user.model.int.spec

/**
 * STRUCTURE FOR TESTS
 * 1) Unit under test - What service? What functionality?
 * 2) Scenario - What circumstances and scenarios? e.g. valid/invalid user data
 * 3) Expected Result - Given the scenario, should the result be accepted or rejected/error thrown?
 */

 // Import Chai assert, expect and 
 const assert = require('chai').assert;
 const expect = require('chai').expect;
 const should = require('chai').should;
 
 const request = require('supertest')
 
 // Import models and app from test server file
 const User = require('../../models/user.model')
 const app = require('../setup.int.spec')
 
 // Define database name for test suite
 process.env.TEST_SUITE = 'user-model-test'
 const db = `https://127.0.0.1:27017/${process.env.TEST_SUITE}`
 
 // Configure single app to be used for all tests
 let test_app = request(app)
 
// Delete tests
describe('CRUD functionality for user.model', () => {
    describe('Delete functionality', () => {
        describe('Deleting a user', () => {
            it('Check if existing user can be successfully deleted, should return status 302 with success msg and redirect to user deleted page', (done) => {
                test_app
                    .post(`/users/${test_user._id}/delete`)
                    .send({
                        '_id':`${test_user._id}`
                    })
                    .expect(302)
                    .end((err, res) => {
                        if (err) return done(err)
                        expect(res.body.message).to.equals('Your user was successfully deleted!')
                        done();
                    });
            });

            it('Check if invalid user id should return status 400 with failure msg and redirect to user deleted page', (done) => {
                test_app
                    .post(`/users/12345/delete`)
                    .send({
                        '_id':'12345'
                    })
                    .expect(400)
                    .end((err, res) => {
                        if (err) return done(err)
                        expect(res.body.message).to.equals('Your user was successfully deleted!')
                        done();
                    });
            });
        });
    });
});