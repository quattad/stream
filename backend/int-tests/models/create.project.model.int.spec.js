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
        test_user_username = "user1";
        test_project_name = "Test Project 1"

         test_project = new Project({
             "name": test_project_name,
             "description": "This is my test Project 1",
             "users": [test_user_username, "user2"],
             "admins": [test_user_username],
             'features': ["Test Feature 1"]
         })

         test_project.save();
         done();
     });
 
     describe('Create functionality', () => {
 
         it('Check if project with valid fields can be created in db, should return 200 with success msg', (done) => {
             test_app
                 .post(`/projects/${test_user_username}/add`)
                 .send({
                    'name': 'Test Project 2',
                    'description': 'This is my test project 2',
                    'users': [test_user_username],
                    'admins': [test_user_username],
                    'features': ['Test Feature 1']
                })
                 .expect(200)
                 .end((err, res) => {
                     if (err) return done(err);
                    //  expect(res.body.message).to.equals('Project added')
                     done();
                 });
                });

            it('Check if project with missing name field cannot be created in db, should return status code 422 with failure msg', (done) => {
                test_app
                    .post(`/projects/${test_user_username}/add`)
                    .send({
                        'name': '',
                        'description': 'This is my test project 2',
                        'users': [test_user_username],
                        'admins': [test_user_username],
                        'features': ['Test Feature 1']
                    })
                    .expect(422)
                    .end((err, res) => {
                        if (err) return done(err);
                        // expect(res.body.message).to.equals('Please enter a project name')
                        done();
                    });
                });

            it('Check if project with missing users field cannot be created in db, should return status code 422', (done) => {
                test_app
                    .post(`/projects/${test_user_username}/add`)
                    .send({
                        'name': 'Test Project 2',
                        'description': 'This is my test project 2',
                        'users': [],
                        'admins': [test_user_username],
                        'features': ['Test Feature 1']
                    })
                    .expect(422)
                    .end((err, res) => {
                        if (err) return done(err);
                        // expect(res.body.message).to.equals('Please enter users for project')
                        done();
                    });
                });

            it('Check if project with missing admins field cannot be created in db, should return status code 422', (done) => {
                test_app
                    .post(`/projects/${test_user_username}/add`)
                    .send({
                        'name': '',
                        'description': 'Test Project',
                        'users': [],
                        'admins': [test_user_username],
                        'features': ['Test Feature 1']
                    })
                    .expect(422)
                    .end((err, res) => {
                        if (err) return done(err);
                        // expect(res.body.message).to.equals('Please enter admins for project')
                        done();
                    });
                });

                it('Check if project with same name as existing project under user cannot be created in db, should return status code 422', (done) => {
                    test_app
                        .post(`/projects/${test_user_username}/add`)
                        .send({
                            'name': test_project_name,
                            'description': 'Test Project',
                            'users': [],
                            'admins': [test_user_username],
                            'features': ['Test Feature 1']
                        })
                        .expect(422)
                        .end((err, res) => {
                            if (err) return done(err);
                            // expect(res.body.message).to.equals('Project name is already taken')
                            done();
                        });
                    });   

            });
        });