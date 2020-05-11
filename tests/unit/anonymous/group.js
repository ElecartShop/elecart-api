const chai = require('chai');
const supertest = require('supertest');

const expect = chai.expect;
const url = 'http://localhost:4000';
const request = supertest(url);
chai.should();

describe('Group Model', () => {
  it('should be a placeholder', (done) => {
    done();
  });
});
