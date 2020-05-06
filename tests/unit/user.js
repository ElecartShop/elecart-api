const chai = require('chai');
const supertest = require('supertest');

const expect = chai.expect;
const url = 'http://localhost:4000/';
const request = supertest(url);

describe('User Tests', () => {
  it('Returns all users', (done) => {
    request.post('/graphql')
      .send({ query: '{ userMany { _id name } }' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        //res.body.userMany.should.have.lengthOf(100);
      });
  });
});
