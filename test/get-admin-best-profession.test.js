/* eslint-disable no-undef */
const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app.js');

describe('GET /admin/best-profession?start=<date>&end=<date>', () => {
  it('401 - profile_id header must be present', () => request(app)
    .get('/admin/best-profession')
    .expect(401));

  it('400 - start and end date are required', () => request(app)
    .get('/admin/best-profession')
    .set('profile_id', '1')
    .expect(400)
    .expect((res) => {
      expect(res.body).to.be.an.instanceof(Object);
      expect(res.body.message).to.be.equals('Start and end date are required');
    }));

  it('400 - start date is required', () => request(app)
    .get('/admin/best-profession?end=2020-01-01')
    .set('profile_id', '1')
    .expect(400)
    .expect((res) => {
      expect(res.body).to.be.an.instanceof(Object);
      expect(res.body.message).to.be.equals('Start and end date are required');
    }));

  it('400 - end date is required', () => request(app)
    .get('/admin/best-profession?start=2020-01-01')
    .set('profile_id', '1')
    .expect(400)
    .expect((res) => {
      expect(res.body).to.be.an.instanceof(Object);
      expect(res.body.message).to.be.equals('Start and end date are required');
    }));

  it('400 - invalid end date format', () => request(app)
    .get('/admin/best-profession?start=2020-01-01&end=mauricio')
    .set('profile_id', '1')
    .expect(400)
    .expect((res) => {
      expect(res.body).to.be.an.instanceof(Object);
      expect(res.body.message).to.be.equals('Invalid date format');
    }));

  it('400 - invalid start date format', () => request(app)
    .get('/admin/best-profession?end=2020-01-01&start=mauricio')
    .set('profile_id', '1')
    .expect(400)
    .expect((res) => {
      expect(res.body).to.be.an.instanceof(Object);
      expect(res.body.message).to.be.equals('Invalid date format');
    }));

  it('400 - invalid start date format', () => request(app)
    .get('/admin/best-profession?start=2020-01-01&end=2020-40-50')
    .set('profile_id', '1')
    .expect(400)
    .expect((res) => {
      expect(res.body).to.be.an.instanceof(Object);
      expect(res.body.message).to.be.equals('Invalid date format');
    }));

  it('400 - start date must be before or equal end date', () => request(app)
    .get('/admin/best-profession?start=2020-01-01&end=1900-01-01')
    .set('profile_id', '1')
    .expect(400)
    .expect((res) => {
      expect(res.body).to.be.an.instanceof(Object);
      expect(res.body.message).to.be.equals("Start date can't be after end date");
    }));

  it('404 - no results found', () => request(app)
    .get('/admin/best-profession?start=3000-01-01&end=3000-01-01')
    .set('profile_id', '1')
    .expect(404)
    .expect((res) => {
      expect(res.body).to.be.an.instanceof(Object);
      expect(res.body.message).to.be.equals('No paid jobs in the period');
    }));

  it('200 - Programmer', () => request(app)
    .get('/admin/best-profession?start=2020-01-01&end=2020-12-31')
    .set('profile_id', '1')
    .expect(200)
    .expect((res) => {
      expect(res.body).to.be.an.instanceof(Object);
      expect(res.body.profession).to.be.equals('Programmer');
      expect(res.body.total).to.be.equals(2683);
    }));
});
