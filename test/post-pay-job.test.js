/* eslint-disable no-undef */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app.js');

describe('POST /jobs/:job_id/pay', () => {
  it('401 - profile_id header must be present', () => request(app)
    .post('/jobs/:job_id/pay')
    .expect(401));

  it('404 - pay for not existing job', () => {
    const profileId = 2;
    return request(app)
      .post('/jobs/3000/pay')
      .set('profile_id', profileId)
      .expect(404);
  });

  it('400 - pay for paid job', () => {
    const profileId = 2;
    return request(app)
      .post('/jobs/12/pay')
      .set('profile_id', profileId)
      .expect(400)
      .expect((res) => {
        expect(res.body).to.be.an.instanceof(Object);
        expect(res.body.message).to.be.equals('Job #12 is already paid');
      });
  });

  it('400 - not client profile trying to pay a job', () => {
    const profileId = 2;
    return request(app)
      .post('/jobs/2/pay')
      .set('profile_id', profileId)
      .expect(403)
      .expect((res) => {
        expect(res.body).to.be.an.instanceof(Object);
        expect(res.body.message).to.be.equals('Authenticated user is not the client of that Job');
      });
  });

  it('400 - not enough credit', () => {
    const profileId = 4;
    return request(app)
      .post('/jobs/5/pay')
      .set('profile_id', profileId)
      .expect(400)
      .expect((res) => {
        expect(res.body).to.be.an.instanceof(Object);
        expect(res.body.message).to.be.equals('Not enough credit to pay for that job');
      });
  });

  it('200 - pay for a job', () => {
    const profileId = 1;
    return request(app)
      .post('/jobs/1/pay')
      .set('profile_id', profileId)
      .expect(200);
  });
});
