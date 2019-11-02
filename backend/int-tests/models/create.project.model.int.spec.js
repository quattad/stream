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
        // Test Project 1
        // 2 x Users, 1 x Admin
        var test_project_1 = new Project({
           "name": "test-project-1",
           "description": "This is my test Project 1",
           "users": ["user1", "user2"],
           "admins": ["user1"],
           "features": ["Test Feature 1"],
           "creator": "user1"
       });

       test_project_1.save();

       var test_project_2 = new Project({
          "name": "test-project-2",
          "description": "This is my Test Project 2",
          "users": ["user1", "user2"],
          "admins": ["user2"],
          "features": ["Test Feature 1", "Test Feature 2"],
          "creator": "user2"
      });

      test_project_2.save();

       // Test Project 3
       // 3 x Users, 2 x Admins
       var test_project_3 = new Project({
          "name": "test-project-3",
          "description": "This is my Test Project 3",
          "users": ["user1", "user2", "user3"],
          "admins": ["user1","user2"],
          "features": ["Test Feature 1", "Test Feature 2"],
          "creator": "user2"
      });
      
      test_project_3.save();

       done();
    });
 
     describe('Create functionality', () => {
 
         it('Check if project with valid fields can be created in db, should return 200 with success msg', (done) => {
             test_app
                 .post(`/projects/user2/add`)
                 .send({
                    'name': 'test-project-2',
                    'description': 'This is my test project 2',
                    'users': ["user2"],
                    'admins': ["user2"],
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
                    .post(`/projects/user2/add`)
                    .send({
                        'name': '',
                        'description': 'This is my test project 2',
                        'users': ["user2"],
                        'admins': ["user2"],
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
                    .post(`/projects/user2/add`)
                    .send({
                        'name': 'Test Project 2',
                        'description': 'This is my test project 2',
                        'users': [],
                        'admins': ["user2"],
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
                    .post(`/projects/user2/add`)
                    .send({
                        'name': '',
                        'description': 'Test Project',
                        'users': [],
                        'admins': ["user2"],
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
                        .post(`/projects/user1/add`)
                        .send({
                            'name': "test-project-1",
                            'description': 'This is my test Project 1',
                            'users': [],
                            'admins': ["user1"],
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