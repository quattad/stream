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
 const Project = require('../../models/project.model')
 const app = require('../setup.int.spec')
 
 // Define database name for test suite
 process.env.TEST_SUITE = 'test-project-model'
 const db = `https://127.0.0.1:27017/${process.env.TEST_SUITE}`
 
 // Configure single app to be used for all tests
 let test_app = request(app)
 
 // Create tests
 describe('CRUD functionality', () => {
 
     // Seed database; assumes model and routes already created
     beforeEach((done) => {
         test_project = new Project({
             'name': 'Test Project 1',
             'description': 'Test Project 1',
             'users': ['User 1', 'User 2'],
             'admin': ['User 1'],
             'features': ['Test Feature 1']
         })
 
         test_project.save();
         done();
     });
 
     describe('Create functionality', () => {
 
         it('Check if project with valid fields can be created in db, should return 200 with correct message', (done) => {
             test_app
                 .post('/project/add')
                 .send({
                    'name': 'Test Project 2',
                    'description': 'Test Project',
                    'users': ['User 1', 'User 2'],
                    'admin': ['User 1'],
                    'features': ['Test Feature 1']
                })
                 .expect(200)
                 .expect('Project added!')
                 .end((err) => {
                     if (err) return done(err);
                     done();
                 });
                });
            });
        });