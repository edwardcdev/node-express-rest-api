/* eslint-disable consistent-return */
const express = require('express');

const router = express.Router();
const service = require('../services/report');

const { getProfile } = require('../middleware/getProfile');
const { isNullOrUndefined } = require('../utils');

/**
   * @swagger
   * /admin/best-profession:
   *   get:
   *     summary: Returns the profession that earned the most money.
   *     description: Returns the profession that earned the most money
   *                  (sum of jobs paid) for any contactor that worked in the query time range.
   *     parameters:
   *      - name: "profile_id"
   *        in: "header"
   *        description: "ID of profile (authenticated user)"
   *        required: true
   *        type: "integer"
   *        format: "int64"
   *      - name: "start"
   *        in: "query"
   *        description: "Start date"
   *        required: true
   *        type: "string"
   *        format: "yyyy-mm-dd"
   *      - name: "end"
   *        in: "query"
   *        description: "End date"
   *        required: true
   *        type: "string"
   *        format: "yyyy-mm-dd"
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: success
   *       401:
   *         description: profile_id header (authenticated user) is required
   *       400:
   *         description: Start and end date are required |
   *                      Start and end date format must be yyyy-mm-dd
*/
router.get('/best-profession', getProfile, async (req, res, next) => {
  const { start, end } = req.query;

  try {
    const data = await service.getBestProfession(start, end);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/**
   * @swagger
   * /admin/best-clients:
   *   get:
   *     summary: Returns the clients the paid the most for jobs in the query time period.
   *     description: Returns the clients the paid the most for jobs in the query time period.
   *                  Limit query parameter should be applied, default limit is 2.
   *     parameters:
   *      - name: "profile_id"
   *        in: "header"
   *        description: "ID of profile (authenticated user)"
   *        required: true
   *        type: "integer"
   *        format: "int64"
   *      - name: "start"
   *        in: "query"
   *        description: "Start date"
   *        required: true
   *        type: "string"
   *        format: "yyyy-mm-dd"
   *      - name: "end"
   *        in: "query"
   *        description: "End date"
   *        required: true
   *        type: "string"
   *        format: "yyyy-mm-dd"
   *      - name: "limit"
   *        in: "query"
   *        description: "Result limit"
   *        required: false
   *        type: "integer"
   *        format: "int64"
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: success
   *       401:
   *         description: profile_id header (authenticated user) is required
   *       400:
   *         description: Start and end date are required |
   *                      Start and end date format must be yyyy-mm-dd |
   *                      Limit must be an number
*/
router.get('/best-clients', getProfile, async (req, res, next) => {
  const { start, end } = req.query;
  const limit = isNullOrUndefined(req.query.limit) ? 2 : parseInt(req.query.limit, 10);

  try {
    const data = await service.getBestClients(start, end, limit);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
