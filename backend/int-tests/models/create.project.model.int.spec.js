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
 describe('CRUD functionality for project.model', () => {
 
     // Seed database; assumes model and routes already created
     beforeEach((done) => {
         test_project = new Project({
             "name": "Test Project 1",
             "description": "Test Project 1",
             "users": ["User1", "User2"],
             "admins": ["User1"],
             'features': ["Test Feature 1"]
         })

         test_project.save();
         test_user_username = "User1";

         done();
     });
 
     describe('Create functionality', () => {
 
         it('Check if project with valid fields can be created in db, should return 200 with correct msg', (done) => {
             test_app
                 .post(`/projects/${test_user_username}/add`)
                 .send({
                    'name': 'Test Project 2',
                    'description': 'Test Project',
                    'users': ['User1', 'User2'],
                    'admins': ['User1'],
                    'features': ['Test Feature 1']
                })
                 .expect(200)
                 .expect('"Project added!"')
                 .end((err) => {
                     if (err) return done(err);
                     done();
                 });
                });

            it('Check if project with missing name field cannot be created in db, should return 400 with failure msg', (done) => {
                test_app
                    .post(`/projects/${test_user_username}/add`)
                    .send({
                        'name': '',
                        'description': 'Test Project',
                        'users': ['User1', 'User2'],
                        'admins': ['User1'],
                        'features': ['Test Feature 1']
                    })
                    .expect(400)
                    .expect('Please add a name to your project!')
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
                });

            it('Check if project with missing users field cannot be created in db, should return 400 with failure msg', (done) => {
                test_app
                    .post(`/projects/${test_user_username}/add`)
                    .send({
                        'name': 'Test Project 2',
                        'description': 'Test Project',
                        'users': [],
                        'admins': ['User1'],
                        'features': ['Test Feature 1']
                    })
                    .expect(400)
                    .expect('Please add users to your project!')
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
                });

            it('Check if project with missing users field cannot be created in db, should return 400 with failure msg', (done) => {
                test_app
                    .post(`/projects/${test_user_username}/add`)
                    .send({
                        'name': 'Test Project 2',
                        'description': 'Test Project',
                        'users': ['User1', 'User2'],
                        'admins': [],
                        'features': ['Test Feature 1']
                    })
                    .expect(400)
                    .expect('Please add users to your project!')
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
                });

            it('Check if project with missing admins field cannot be created in db, should return 400 with failure msg', (done) => {
                test_app
                    .post(`/projects/${test_user_username}/add`)
                    .send({
                        'name': '',
                        'description': 'Test Project',
                        'users': [],
                        'admins': ['User1'],
                        'features': ['Test Feature 1']
                    })
                    .expect(400)
                    .expect('Please add users to your project!')
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
                });

            });
        });