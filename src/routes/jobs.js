const express = require('express');

const router = express.Router();
const service = require('../services/jobs');

const { getProfile } = require('../middleware/getProfile');

/**
   * @swagger
   * /jobs/unpaid:
   *   get:
   *     summary: Get all unpaid jobs for a user.
   *     description: Get all unpaid jobs for a user (either a client or contractor),
   *                  for active contracts only.
   *     parameters:
   *      - name: "profile_id"
   *        in: "header"
   *        description: "ID of profile (authenticated user)"
   *        required: true
   *        type: "integer"
   *        format: "int64"
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: success
*/
router.get('/unpaid', getProfile, async (req, res, next) => {
  const profileId = req.get('profile_id');

  try {
    const jobs = await service.getUnpaidJobsForProfile(profileId);
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

/**
   * @swagger
   * /jobs/{jobId}/pay:
   *   post:
   *     summary: Pay for a job.
   *     description: Pay for a job, a client can only pay if his balance >= the amount to pay. The
   *                  amount should be moved from the client's balance to the contractor balance.
   *     parameters:
   *      - name: "profile_id"
   *        in: "header"
   *        description: "ID of profile (authenticated user)"
   *        required: true
   *        type: "integer"
   *        format: "int64"
   *      - name: "jobId"
   *        in: "path"
   *        description: "ID of the job to be paid"
   *        required: true
   *        type: "integer"
   *        format: "int64"
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: success
   *       401:
   *         description: profile_id header (authenticated user) is required
   *       412:
   *         description: Job doesn't have client or contrator
   *       400:
   *         description: Job is already paid |
   *                      Authenticated user is not the client of that Job |
   *                      Not enough credit to pay for that job
*/
router.post('/:jobId/pay', getProfile, async (req, res, next) => {
  const { jobId } = req.params;
  const profileId = parseInt(req.get('profile_id'), 10);

  try {
    await service.payJob(profileId, jobId);
    res.end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
