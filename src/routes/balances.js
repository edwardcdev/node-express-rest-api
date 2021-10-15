const express = require('express');

const router = express.Router();
const service = require('../services/balances');
const { getProfile } = require('../middleware/getProfile');

/**
   * @swagger
   * /balances/deposit/{userId}:
   *   post:
   *     summary: Deposits money into the balance of a client.
   *     description: Deposits money into the balance of a client, a client can't deposit
   *                  more than 25% his total of jobs to pay. (at the deposit moment)
   *     parameters:
   *      - name: "profile_id"
   *        in: "header"
   *        description: "ID of profile (authenticated user)"
   *        required: true
   *        type: "integer"
   *        format: "int64"
   *      - name: "userId"
   *        in: "path"
   *        description: "ID of profile/user that will get the deposit"
   *        required: true
   *        type: "integer"
   *        format: "int64"
   *      - in: body
   *        name: DepositDetails
   *        schema:
   *          type: object
   *          required:
   *            depositValue
   *          properties:
   *            depositValue:
   *              type: number
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: success
   *       401:
   *         description: profile_id header (authenticated user) is required
   *       400:
   *         description: Deposit value is required |
   *                      Deposit value is not valid |
   *                      Client deposit limit reached
   *       404:
   *         description: User not found
   *       412:
   *         description: You must be a client to make a deposit
*/
router.post('/deposit/:userId', getProfile, async (req, res, next) => {
  const { userId } = req.params;
  const { depositValue } = req.body;

  try {
    await service.doDeposit(userId, depositValue);
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
