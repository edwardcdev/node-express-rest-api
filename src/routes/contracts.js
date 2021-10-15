const express = require('express');

const router = express.Router();
const service = require('../services/contracts');

const { getProfile } = require('../middleware/getProfile');

/**
   * @swagger
   * /contracts/{id}:
   *   get:
   *     summary: Return the contract.
   *     description: Return the contract only if it belongs to the profile calling.
   *     parameters:
   *      - name: "id"
   *        in: "path"
   *        description: "ID of contract to return"
   *        required: true
   *        type: "integer"
   *        format: "int64"
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
   *       401:
   *         description: profile_id header (authenticated user) is required
   *       404:
   *         description: contract was not found on database
   *       403:
   *         description: profile_id header is not present on the contract as a client or contractor
*/
router.get('/:id', getProfile, async (req, res, next) => {
  const { id } = req.params;
  const profileId = parseInt(req.get('profile_id'), 10);

  try {
    const contract = await service.getByIdAndCheckProfileVisibility(id, profileId);
    res.json(contract);
  } catch (err) {
    next(err);
  }
});

/**
   * @swagger
   * /contracts:
   *   get:
   *     summary: Returns a list of contracts.
   *     description: Returns a list of contracts belonging to a user (client or contractor),
   *                  the list should only contain non terminated contracts.
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
router.get('', getProfile, async (req, res, next) => {
  const profileId = req.get('profile_id');

  try {
    const contracts = await service.listProfileContracts(profileId);
    res.json(contracts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
