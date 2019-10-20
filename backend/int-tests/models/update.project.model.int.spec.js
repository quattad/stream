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
 
     describe('Update functionality', () => {

                it('Check if existing project in db can be successfully updated with new name, should return 200 with success msg', (done) => {
                    test_app
                        .post(`/projects/${test_user_username}/${test_project_name}/update/name`)
                        .send({
                            "name": test_project_new_name
                        })
                        .expect(200)
                        .end((err, res) => {
                            if (err) return done(err);

                            Project.findOne({"name": `${test_project_new_name}`})
                                .then(project => {
                                    expect(project.name).to.equals(test_project_new_name)
                                    done();
                                })
                                .catch((err) => {if (err) return done(err)});
                        });
                    });
                    
                it('Check if existing project in db can be successfully updated with new description, should return 200 with success msg', (done) => {
                    test_app
                        .post(`/projects/${test_user_username}/${test_project_name}/update/description`)
                        .send({
                            "description": test_project_new_description
                        })
                        .expect(200)
                        .end((err, res) => {
                            if (err) return done(err);

                            Project.findOne({"name": `${test_project_name}`})
                            .then(project => {
                                expect(project.description).to.equals(test_project_new_description)
                                done();
                            })
                            .catch((err) => {if (err) return done(err)});
                        });
                    });
                
                it('Check if existing project in db can be successfully updated with new user, should return 200 with success msg', (done) => {
                    test_app
                        .post(`/projects/${test_user_username}/${test_project_name}/update/user`)
                        .send({
                            "users": [test_project_new_user]
                        })
                        .expect(200)
                        .end((err, res) => {
                            if (err) return done(err);

                            Project.findOne({"name": `${test_project_name}`})
                            .then(project => {
                                expect(project.users)
                                    .to.be.an('array')
                                    .to.include([test_project_new_user])
                            })
                            .catch((err) => {if (err) return done(err)});

                            done();
                        });
                    });
                
                it('Check if existing project in db can be successfully updated with new admin, should return 200 with success msg and should be part of existing project users', (done) => {
                    test_app
                        .post(`/projects/${test_user_username}/${test_project_name}/update/admin`)
                        .send({
                            "admins": [test_project_new_admin]
                        })
                        .expect(200)
                        .end((err, res) => {
                            if (err) return done(err);

                            Project.findOne({"name": `${test_project_name}`})
                                .then(project => {
                                    expect(project.admins)
                                        .to.be.an('array')
                                        .to.include(test_project_new_admin)
                                        .to.include(test_project_creator)
                                })
                                .catch((err) => { if (err) return done(err) })
                            done();
                        });
                    }); 

            });
        });