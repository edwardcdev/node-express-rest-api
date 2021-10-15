/* eslint-disable no-undef */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app.js');

describe('POST /balances/deposit/:userId', () => {
  it('401 - profile_id header must be present', () => request(app)
    .post('/balances/deposit/10')
    .expect(401));

  it('412 - deposit for non client Profile', () => {
    const profileId = 2;
    return request(app)
      .post('/balances/deposit/8')
      .set('profile_id', profileId)
      .expect(412)
      .expect((res) => {
        expect(res.body).to.be.an.instanceof(Object);
        expect(res.body.message).to.be.equals('You must be a client to make a deposit');
      });
  });

  it('400 - deposit value is required', () => {
    const profileId = 1;
    return request(app)
      .post('/balances/deposit/1')
      .set('profile_id', profileId)
      .expect(400)
      .expect((res) => {
        expect(res.body).to.be.an.instanceof(Object);
        expect(res.body.message).to.be.equals('Deposit value is required');
      });
  });

  it('400 - limit reached', () => {
    const profileId = 1;
    return request(app)
      .post('/balances/deposit/1')
      .set('profile_id', profileId)
      .send({ depositValue: 101 })
      .expect(400)
      .expect((res) => {
        expect(res.body).to.be.an.instanceof(Object);
        expect(res.body.message).to.be.equals("You can't deposit more than 100.25");
      });
  });

  it('400 - not valid deposit value', () => {
    const profileId = 1;
    return request(app)
      .post('/balances/deposit/1')
      .set('profile_id', profileId)
      .send({ depositValue: 'mauricio' })
      .expect(400)
      .expect((res) => {
        expect(res.body).to.be.an.instanceof(Object);
        expect(res.body.message).to.be.equals('Deposit value is not valid');
      });
  });

  it('200 - success', () => {
    const profileId = 1;
    return request(app)
      .post('/balances/deposit/1')
      .set('profile_id', profileId)
      .send({ depositValue: 30 })
      .expect(200);
  });
});
