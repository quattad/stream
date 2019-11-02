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
         // Seed database; assumes model and routes already created
         beforeEach((done) => {
            test_user = new User({
               'username':'User1',
               'firstname': 'User',
               'lastname': 'One',
               'email': 'user1@gmail.com',
               'password':'p@ssw0rd123!',
               'position': 'manager'
            })
    
            test_user.save();
            done();
        });

    describe('Delete functionality', () => {
        describe('Deleting a user', () => {
            it('Check if existing user can be successfully deleted, should return status 200 with success msg', (done) => {
                test_app
                    .post(`/users/delete/${test_user._id}`)
                    .send({
                        'id':`${test_user._id}`
                    })
                    .expect(204)
                    .end((err, res) => {
                        if (err) return done(err)
                        done();
                    });
            });

            it('Check if invalid user id should return status 400 with failure msg and redirect to user deleted page', (done) => {
                test_app
                    .post(`/users/delete/12345`)
                    .send({
                        '_id':'12345'
                    })
                    .expect(400)
                    .end((err, res) => {
                        if (err) return done(err)
                        done();
                    });
            });
        });
    });
});