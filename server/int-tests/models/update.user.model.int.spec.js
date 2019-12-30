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
 
 // Create tests
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
         // console.log('Database seeded. Running test...')
         done();
     });

     // Update tests
    describe('Update functionality', () => {
        describe('Updating username', () => {
            it('Check if username can be successfully updated with valid username, should return status 200 with success msg', (done) => {
                test_app
                .post(`/users/${test_user._id}/update/username`)
                .send({
                    'username': 'updated-username'
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    // expect(res.body.message).to.equals('Username successfully updated!')
                    done();
                });
            });

            it('Check if firstname can be successfully updated with valid firstname, should return status 200 with success msg', (done) => {
                test_app
                .post(`/users/${test_user._id}/update/firstname`)
                .send({
                    'firstname': 'updatedfirstname'
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    // expect(res.body.message).to.equals('Username successfully updated!')
                    done();
                });
            });

            it('Check if lastname can be successfully updated with valid lastname, should return status 200 with success msg', (done) => {
                test_app
                .post(`/users/${test_user._id}/update/lastname`)
                .send({
                    'lastname': 'updatedlastname'
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    // expect(res.body.message).to.equals('Username successfully updated!')
                    done();
                });
            });

            it('Check if email can be successfully updated with valid email, should return status 200 with success msg', (done) => {
                test_app
                .post(`/users/${test_user._id}/update/email`)
                .send({
                    'email': 'updatedemail@gmail.com'
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    // expect(res.body.message).to.equals('Username successfully updated!')
                    done();
                });
            });

            it('Check if username is not successfully updated with blank username, should return status 400 with failure msg', (done) => {
                test_app
                .post(`/users/${test_user._id}/update/username`)
                .send({
                    'username': ' '
                })
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    // expect(res.body.message).to.equals('Please enter a username!')
                    done();
                });
            });

            it('Check if username is not succesfully updated with invalid username, should return status 400 with failure msg', (done) => {
                test_app
                .post(`/users/${test_user._id}/update/username`)
                .send({
                    'username': '12'
                })
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    // expect(res.body.message).to.equals('Invalid username. Please enter a valid username!')
                    done();
                });
            });

            it('Check if username is not succesfully updated with invalid/blank user id, should return status 404 with failure msg', (done) => {
                test_app
                .post(`/users/!@#$%/update/username`)
                .send({
                    'username': 'User1'
                })
                .expect(404)
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
            });
        });

            it('Check if password can be successfully updated with valid password, should return status 200 with success msg', (done) => {
                test_app
                .post(`/users/${test_user._id}/update/password`)
                .send({
                    'password': 'P@ssw0rd123!'
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    // expect(res.body.message).to.equals('Password successfully updated!')
                    done();
                });
            });

            it('Check if password update fails with password with all numbers, should return status 400 with failure msg', (done) => {
                test_app
                .post(`/users/${test_user._id}/update/password`)
                .send({
                    'password': '123456790'
                })
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    // expect(res.body.message).to.equals('Please provide a valid password!')
                    done();
                });
            });

            it('Check if password update fails with password with all small char, should return status 400 with failure msg', (done) => {
                test_app
                .post(`/users/${test_user._id}/update/password`)
                .send({
                    'password': 'abcdefghi'
                })
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    // expect(res.body.message).to.equals('Please provide a valid password!')
                    done();
                });
            });

            it('Check if password update fails with password less than 8 char, should return status 400 with failure msg', (done) => {
                test_app
                .post(`/users/${test_user._id}/update/password`)
                .send({
                    'password': 'w1!F'
                })
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    // expect(res.body.message).to.equals('Please provide a valid password!')
                    done();
                });
            });

            it('Check if password update fails with password same as username, should return status 400 with failure msg', (done) => {
                test_app
                .post(`/users/${test_user._id}/update/password`)
                .send({
                    'password': `${test_user.username}`})
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    // expect(res.body.message).to.equals('Your password cannot be the same as your username.')
                    done();
                });
            });
        });
    });