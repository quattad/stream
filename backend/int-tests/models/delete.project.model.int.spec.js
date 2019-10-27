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
 
     describe('Delete functionality', () => {

        it('Check if single project in db can be deleted, should return 200 and remaining projects still in db', (done) => {
            test_app
                .post('/projects/user1/test-project-3/delete')
                .send({
                    "name": "test-project-3"
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);

                    // Check if test-project-3 has been successfully deleted
                    Project.find({
                        "name":"test-project-3"
                    })
                        .then(res => {
                            expect(res).to.be.empty
                        })
                        .catch((err) => {if (err) return done(err)})
                    
                    // Check if test-project-1 and test-project-2 are still present in db
                    Project.find({
                        "name":"test-project-1"
                    })
                        .then(res => {
                            expect(res).to.not.be.empty
                        })
                        .catch((err) => {if (err) return done(err)})

                    Project.find({
                        "name":"test-project-2"
                    })
                        .then(res => {
                            expect(res).to.not.be.empty
                            done();
                        })
                        .catch((err) => {if (err) return done(err)})
                });
            });
        });
    });