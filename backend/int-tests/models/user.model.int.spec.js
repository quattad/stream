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
describe('CRUD functionality', () => {

    // Seed database; assumes model and routes already created
    beforeEach((done) => {
        test_user = new User({
            'username':'test-user1',
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
                    'username':'test-user2',
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
                    {'username':'test-user1',
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

    // Read tests
    describe('Read functionality', () => {

        // Currently only one user stored
        it('Check if all users are fetched from database, should return status 200 with all users', (done) => {
            test_app
                .get('/users')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an.instanceOf(Array)
                    .and.to.have.property(0)
                    .that.includes.all.keys('username', 'password', 'prefix')
                    done();
                })
            });

        it('Check if single existing user can be fetched from database, should return status 200 with all necessary fields with correct key', (done) => {
            test_app
                .get(`/users/${test_user._id}`)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.username).to.equals(`${test_user.username}`)
                    done();
                })
            });

        // TODO - change to redirect to 'users' home page, valid error message
        it('Check if user id that does not exist requested, should return status 400 with error message', (done) => {
            test_app
                .get(`/users/12345`)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.message).to.equals('User not found.')
                    done();
                });
            });

        it('Check if user id invalid parameters requested, should return status 400 with error message', (done) => {
            test_app
                .get(`/users/!@#$%^&`)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.message).to.equals('Invalid parameter.')
                    done();
                });
            });
    });

// Update tests
// describe('user-model-tests-update', () => {
//     it('Test 1', (done) => {
//         assert(1 == 1);
//         done();
//     });
// });

// Delete tests
// describe('user-model-tests-delete', () => {
//     it('Test 1', (done) => {
//         assert(1 == 1);
//         done();
//     });
// })

});