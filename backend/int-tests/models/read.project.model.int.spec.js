/**
 * STRUCTURE FOR TESTS
 * 1) Unit under test - What service? What functionality?
 * 2) Scenario - What circumstances and scenarios? e.g. valid/invalid user data
 * 3) Expected Result - Given the scenario, should the result be accepted or rejected/error thrown?
 */

 // Import Chai expect
 const expect = require('chai').expect;
 
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
 
     describe('Read functionality', () => {

                it('Check if all existing projects in db can be successfully fetched from server, should return 200', (done) => {
                    test_app
                        .get(`/projects/user1/`)
                        .expect(200)
                        .end((err, res) => {
                            if (err) return done(err);
                            expect(res.body[0])
                                .to.have.property('name', "test-project-1")
                            expect(res.body[1])
                                .to.have.property('name', "test-project-2")
                            expect(res.body[2])
                                .to.have.property('name', "test-project-3")
                            done();
                    });
                });
                    
                it('Check if single existing project in db can be successfully fetched from server and all fields read correctly, should return 200', (done) => {
                    test_app
                        .get(`/projects/user1/test-project-1/`)
                        .expect(200)
                        .end((err, res) => {
                            if (err) return done(err);
                            expect(res.body).to.have.property('name', "test-project-1")
                            expect(res.body).to.have.property('description', 'This is my test Project 1')
                            done();
                        });
                    });
                
                });
            });