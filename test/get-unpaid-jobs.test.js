/* eslint-disable no-undef */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app.js');

describe('GET /jobs/unpaid', () => {
  it('401 - profile_id header must be present', () => request(app)
    .get('/jobs/unpaid')
    .expect(401));

  it('200 - get unpaid jobs for profile #6', () => {
    const profileId = 6;
    return request(app)
      .get('/jobs/unpaid')
      .set('profile_id', profileId)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.be.a.instanceof(Array);
        expect(res.body.length).to.be.equal(2);
        res.body.forEach((it) => {
          expect([it.Contract.ContractorId, it.Contract.ClientId]).to.deep.include(profileId);
          expect(it.status).to.not.be.equal('terminated');
          // eslint-disable-next-line no-unused-expressions
          expect(it.paid).to.be.false;
        });
      });
  });
});
