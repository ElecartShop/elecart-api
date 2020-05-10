const chai = require('chai');
const supertest = require('supertest');

const expect = chai.expect;
const url = 'http://localhost:4000';
const request = supertest(url);
const model = require('../src/models/user')
chai.should();

describe('User Model', () => {
  let user_id;
  let user_ids;

  it('should create an user', (done) => {
    request.post('/')
      .send({ query: '{ userCreateOne(record: {name: "test", email: "test@test.com", password: "test"}) { recordId record { _id name email } } }' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        res.body.data.userCreateOne.should.have.property('recordId');
        res.body.data.userCreateOne.should.have.property('record');
        res.body.data.userCreateOne.record.should.have.property('_id');
        res.body.data.userCreateOne.record._id.should.equal(res.body.data.userCreateOne.recordId);
        res.body.data.userCreateOne.record.should.have.property('name');
        res.body.data.userCreateOne.record.name.should.equal('test');
        res.body.data.userCreateOne.record.should.have.property('email');
        res.body.data.userCreateOne.record.email.should.equal('test@test.com');
        // TODO: Check password hash in user unit test

        user_id = res.body.data.userCreateOne.recordId;

        done();
      });
  });

  it('should not create an user with same name', (done) => {
    request.post('/')
      .send({ query: '{ userCreateOne(record: {name: "test", email: "test.another@test.com", password: "TestAnother"}) { recordId record { _id name } } }' })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        done();
      });
  });

  it('should not create an user with same email', (done) => {
    request.post('/')
      .send({ query: '{ userCreateOne(record: {name: "testanother", email: "test@test.com", password: "TestAnother"}) { recordId record { _id name } } }' })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        done();
      });
  });

  it('should create an user with lowercase name', (done) => {
    request.post('/')
      .send({ query: '{ userCreateOne(record: {name: "TestLowercaseName", email: "test.lowercase.name@test.com", password: "test"}) { recordId record { _id name email } } }' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        res.body.data.userCreateOne.should.have.property('recordId');
        res.body.data.userCreateOne.should.have.property('record');
        res.body.data.userCreateOne.record.should.have.property('_id');
        res.body.data.userCreateOne.record._id.should.equal(res.body.data.userCreateOne.recordId);
        res.body.data.userCreateOne.record.should.have.property('name');
        res.body.data.userCreateOne.record.name.should.equal('testlowercasename');
        res.body.data.userCreateOne.record.should.have.property('email');
        res.body.data.userCreateOne.record.email.should.equal('test.lowercase.name@test.com');
        // TODO: Check password hash in user unit test

        user_id = res.body.data.userCreateOne.recordId;

        done();
      });
  });

  it('should create an user with lowercase email', (done) => {
    request.post('/')
      .send({ query: '{ userCreateOne(record: {name: "testlowercaseemail", email: "Test.Lowercase.Email@Test.Com", password: "test"}) { recordId record { _id name email } } }' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        res.body.data.userCreateOne.should.have.property('recordId');
        res.body.data.userCreateOne.should.have.property('record');
        res.body.data.userCreateOne.record.should.have.property('_id');
        res.body.data.userCreateOne.record._id.should.equal(res.body.data.userCreateOne.recordId);
        res.body.data.userCreateOne.record.should.have.property('name');
        res.body.data.userCreateOne.record.name.should.equal('testlowercaseemail');
        res.body.data.userCreateOne.record.should.have.property('email');
        res.body.data.userCreateOne.record.email.should.equal('test.lowercase.email@test.com');
        // TODO: Check password hash in user unit test

        user_id = res.body.data.userCreateOne.recordId;

        done();
      });
  });

  // TODO: it should create many users

  it('should return an user', (done) => {
    request.post('/')
      .send({ query: '{ userOne { _id name } }' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        res.body.data.userOne.should.have.property('_id');
        res.body.data.userOne.should.have.property('name');

        done();
      });
  });

  it('should returns all users', (done) => {
    request.post('/')
      .send({ query: '{ userMany { _id name } }' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        done();
      });
  });

  it('should return an user by ID', (done) => {
    request.post('/')
      .send({ query: '{ userById(id: "'+user_id+'") { _id name } }' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        res.body.data.userById.should.have.property('_id');
        res.body.data.userById._id.should.equal(user_id);
        res.body.data.userById.should.have.property('name');
        res.body.data.userById.name.should.equal('test');

        done();
      });
  });

  // TODO: it should not update an user
  // TODO: it should not update many users
  // TODO: it should not update an user by ID
  // TODO: it should login an user
  // TODO: it should update an user
  // TODO: it should not update an user that is not theirs
  // TODO: it should not count users
  // TODO: it should pagination users
  // TODO: it should pagination users differently
  // TODO: children unit tests of user
  // TODO: it should not remove an user
  // TODO: it should not remove many users
  // TODO: it should not remove an user by ID
  // TODO: it should clean up users created
});
