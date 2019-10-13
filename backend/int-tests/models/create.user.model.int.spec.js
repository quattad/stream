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
             'password':'p@ssw0rd123!',
             'prefix':'Mr'
         })
 
         test_user.save();
         // console.log('Database seeded. Running test...')
         done();
     });
 
     describe('Create functionality', () => {
 
         it('Check if user with valid fields can be created in db, should return 200 with correct message', (done) => {
             test_app
                 .post('/users/add')
                 .send({
                     'username':'User2',
                     'password':'p@ssw0rd123!',
                     'prefix':'Mr'
                 })
                 .set('Accept','application/json')
                 .expect('Content-Type', /json/)
                 .expect(200)
                 .expect('"User added!"')
                 .end((err) => {
                     if (err) return done(err);
                     done();
                 });
         });
 
         it('Check if user already exists should not save into database, should return status 400 with correct message', (done) => {
             test_app
                 .post('/users/add')
                 .send(
                     {'username':'User1',
                     'password':'p@ssw0rd123!',
                     'prefix':'Mr'}
                 )
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
                     'password':'p@ssw0rd123!', 
                     'prefix':'Mr'})
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
                         'username':'test-user',
                         'password':'', 
                         'prefix':'Mr'})
                     .expect(400)
                     .end((err) => {
                         if (err) return done(err);
                         done();
                     })
                 });
 
             it('User with empty prefix cannot be saved into database, should return status 400 with correct message', (done) => {
                 test_app
                     .post('/users/add')
                     .send({
                         'username':'test-user',
                         'password':'', 
                         'prefix':''})
                     .expect(400)
                     .end((err) => {
                         if (err) return done(err);
                         done();
                     })
                 });
     });
    })