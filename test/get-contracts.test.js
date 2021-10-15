/* eslint-disable no-undef */
const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app.js');

function assertBody(profileId, res, bodySizeExpected) {
  expect(res.body.length).to.be.equal(bodySizeExpected);
  expect(res.body).to.be.a.instanceof(Array);
  res.body.forEach((it) => {
    expect([it.ContractorId, it.ClientId]).to.deep.include(profileId);
    expect(it.status).to.not.be.equal('terminated');
  });
}

describe('GET /contracts', () => {
  it('401 - profile_id header must be present', () => request(app)
    .get('/contracts')
    .expect(401));

  it('200 - return not terminated contracts for profile #2', () => {
    const profileId = 2;
    return request(app)
      .get('/contracts')
      .set('profile_id', profileId)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => assertBody(profileId, res, 2));
  });
});
