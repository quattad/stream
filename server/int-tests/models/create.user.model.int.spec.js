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
         done();
     });
 
     describe('Create functionality', () => {
 
         it('Check if user with valid fields can be created in db, should return 200 with correct message', (done) => {
             test_app
                 .post('/users/add')
                 .send({
                     'username':'iamausertoo',
                     'firstname': 'User',
                     'lastname': 'Two',
                     'email':'user2@gmail.com',
                     'password':'p@ssw0rd123!',
                     'position': 'Manager',
                     'projects': ['test-project-1']
                 })
                 .set('Accept','application/json')
                 .expect('Content-Type', /json/)
                 .expect(200)
                 .end((err) => {
                     if (err) return done(err);
                     done();
                 });
         });
 
         it('Check if user already exists should not save into database, should return status 400 with correct message', (done) => {
             test_app
                 .post('/users/add')
                 .send({
                    'username':'User1',
                    'firstname': 'User',
                    'lastname': 'One',
                    'email': 'user1@gmail.com',
                    'password':'p@ssw0rd123!',
                    'position': 'manager'
                    })
                 .expect(400)
                 .end((err) => {
                     if (err) return done(err);
                     done();
                 });
         });
 
         it('User with empty username cannot be saved into database, should return 400 with correct message', (done) => {
             test_app
                 .post('/users/add')
                 .send({
                    'username':'',
                    'firstname': 'User',
                    'lastname': 'One',
                    'email': 'user1@gmail.com',
                    'password':'p@ssw0rd123!',
                    'position': 'manager'
                })
                 .expect(400)
                 .end((err) => {
                     if (err) return done(err);
                     done();
                 })
             });
 
             it('User with empty password cannot be saved into database, should return status 400 with correct message', (done) => {
                 test_app
                     .post('/users/add')
                     .send({
                        'username':'User1',
                        'firstname': 'User',
                        'lastname': 'One',
                        'email': 'user1@gmail.com',
                        'password':'',
                        'position': 'manager'
                        })
                     .expect(400)
                     .end((err) => {
                         if (err) return done(err);
                         done();
                     })
                 });
 
             it('User with empty first name cannot be saved into database, should return status 400 with correct message', (done) => {
                 test_app
                     .post('/users/add')
                     .send({
                        'username':'User1',
                        'firstname': '',
                        'lastname': 'One',
                        'email': 'user1@gmail.com',
                        'password':'p@ssw0rd123!',
                        'position': 'manager'
                     })
                     .expect(400)
                     .end((err) => {
                         if (err) return done(err);
                         done();
                     })
                 });
     });
    })