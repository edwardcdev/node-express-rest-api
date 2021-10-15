/* eslint-disable no-undef */
const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app.js');

describe('GET /contracts/:id', () => {
  it('401 - profile_id header must be present', () => request(app)
    .get('/contracts/3')
    .expect(401));

  it('404 - contract #3000 does not exists', () => request(app)
    .get('/contracts/3000')
    .set('profile_id', '1')
    .expect(404));

  it('403 - profile #1 is not in contract #3', () => request(app)
    .get('/contracts/3')
    .set('profile_id', '1')
    .expect(403));

  it('200 - return contract #2 for profile #1', () => {
    const profileId = 1;
    return request(app)
      .get('/contracts/2')
      .set('profile_id', profileId)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect([res.body.ContractorId, res.body.ClientId]).to.deep.include(profileId);
      });
  });
});
