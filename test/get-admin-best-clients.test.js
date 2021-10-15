/* eslint-disable no-undef */
const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app.js');

describe('GET /admin/best-clients?start=<date>&end=<date>&limit=<integer>', () => {
  it('401 - profile_id header must be present', () => request(app)
    .get('/admin/best-clients')
    .expect(401));

  it('400 - start and end date are required', () => request(app)
    .get('/admin/best-clients')
    .set('profile_id', '1')
    .expect(400)
    .expect((res) => {
      expect(res.body).to.be.an.instanceof(Object);
      expect(res.body.message).to.be.equals('Start and end date are required');
    }));

  it('400 - start date is required', () => request(app)
    .get('/admin/best-clients?end=2020-01-01')
    .set('profile_id', '1')
    .expect(400)
    .expect((res) => {
      expect(res.body).to.be.an.instanceof(Object);
      expect(res.body.message).to.be.equals('Start and end date are required');
    }));

  it('400 - end date is required', () => request(app)
    .get('/admin/best-clients?start=2020-01-01')
    .set('profile_id', '1')
    .expect(400)
    .expect((res) => {
      expect(res.body).to.be.an.instanceof(Object);
      expect(res.body.message).to.be.equals('Start and end date are required');
    }));

  it('400 - invalid end date format', () => request(app)
    .get('/admin/best-clients?start=2020-01-01&end=mauricio')
    .set('profile_id', '1')
    .expect(400)
    .expect((res) => {
      expect(res.body).to.be.an.instanceof(Object);
      expect(res.body.message).to.be.equals('Invalid date format');
    }));

  it('400 - invalid start date format', () => request(app)
    .get('/admin/best-clients?end=2020-01-01&start=mauricio')
    .set('profile_id', '1')
    .expect(400)
    .expect((res) => {
      expect(res.body).to.be.an.instanceof(Object);
      expect(res.body.message).to.be.equals('Invalid date format');
    }));

  it('400 - invalid start date format', () => request(app)
    .get('/admin/best-clients?start=2020-01-01&end=2020-40-50')
    .set('profile_id', '1')
    .expect(400)
    .expect((res) => {
      expect(res.body).to.be.an.instanceof(Object);
      expect(res.body.message).to.be.equals('Invalid date format');
    }));

  it('400 - start date must be before or equal end date', () => request(app)
    .get('/admin/best-clients?start=2020-01-01&end=1900-01-01')
    .set('profile_id', '1')
    .expect(400)
    .expect((res) => {
      expect(res.body).to.be.an.instanceof(Object);
      expect(res.body.message).to.be.equals("Start date can't be after end date");
    }));

  it('400 - invalid limit (string)', () => request(app)
    .get('/admin/best-clients?start=2020-01-01&end=2020-01-01&limit=mauricio')
    .set('profile_id', '1')
    .expect(400)
    .expect((res) => {
      expect(res.body).to.be.an.instanceof(Object);
      expect(res.body.message).to.be.equals('Invalid limit');
    }));

  it('400 - invalid limit (zero)', () => request(app)
    .get('/admin/best-clients?start=2020-01-01&end=2020-01-01&limit=0')
    .set('profile_id', '1')
    .expect(400)
    .expect((res) => {
      expect(res.body).to.be.an.instanceof(Object);
      expect(res.body.message).to.be.equals('Invalid limit');
    }));

  it('404 - no results found', () => request(app)
    .get('/admin/best-clients?start=3000-01-01&end=3000-01-01')
    .set('profile_id', '1')
    .expect(404)
    .expect((res) => {
      expect(res.body).to.be.an.instanceof(Object);
      expect(res.body.message).to.be.equals('No paid jobs in the period');
    }));

  it('200 - with default limit', () => request(app)
    .get('/admin/best-clients?start=2020-01-01&end=2020-12-31')
    .set('profile_id', '1')
    .expect(200)
    .expect((res) => {
      expect(res.body).to.be.an.instanceof(Array);
      expect(res.body.length).to.be.equal(2);

      expect(res.body[0].id).to.be.equals(4);
      expect(res.body[0].fullName).to.be.equals('Ash Kethcum');
      expect(res.body[0].paid).to.be.equals(2020);

      expect(res.body[1].id).to.be.equals(2);
      expect(res.body[1].fullName).to.be.equals('Mr Robot');
      expect(res.body[1].paid).to.be.equals(442);
    }));

  it('200 - with limit is 10', () => request(app)
    .get('/admin/best-clients?start=2020-01-01&end=2020-12-31&limit=10')
    .set('profile_id', '1')
    .expect(200)
    .expect((res) => {
      expect(res.body).to.be.an.instanceof(Array);
      expect(res.body.length).to.be.equal(4);

      expect(res.body[0].id).to.be.equals(4);
      expect(res.body[0].fullName).to.be.equals('Ash Kethcum');
      expect(res.body[0].paid).to.be.equals(2020);

      expect(res.body[1].id).to.be.equals(2);
      expect(res.body[1].fullName).to.be.equals('Mr Robot');
      expect(res.body[1].paid).to.be.equals(442);

      expect(res.body[2].id).to.be.equals(1);
      expect(res.body[2].fullName).to.be.equals('Harry Potter');
      expect(res.body[2].paid).to.be.equals(442);

      expect(res.body[3].id).to.be.equals(3);
      expect(res.body[3].fullName).to.be.equals('John Snow');
      expect(res.body[3].paid).to.be.equals(200);
    }));
});
