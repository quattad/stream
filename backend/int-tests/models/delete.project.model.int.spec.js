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
        test_project_creator = test_user_username 
        test_project_new_name = "New Test Project 1"
        test_project_new_description = "This is a new test project description"
        test_project_new_user = "newuser"
        test_project_new_admin = "newuser"


         test_project = new Project({
             "name": test_project_name,
             "description": "This is my test Project 1",
             "users": [test_user_username, "user2"],
             "admins": [test_user_username],
             "features": ["Test Feature 1"],
             "creator": test_project_creator
         })

         test_project.save();
         done();
     });
 
     describe('Delete functionality', () => {
     });
    });