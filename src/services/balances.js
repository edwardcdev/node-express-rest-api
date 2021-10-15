const ServiceError = require('./ServiceError');

const { sequelize } = require('../model');
const { isNullOrUndefined } = require('../utils');

const jobsService = require('./jobs');
const profilesService = require('./profiles');

async function isValidDeposit(clientId, depositValue) {
  const totalJobsToPay = await jobsService.getUnpaidJobsTotalPriceForClient(clientId);
  const depositLimit = totalJobsToPay * 0.25;
  if (depositValue > depositLimit) {
    throw new ServiceError('Deposit limit reached', 400, { message: `You can't deposit more than ${depositLimit}` });
  }

  return true;
}

function validateDepositValue(depositValue) {
  if (isNullOrUndefined(depositValue)) {
    throw new ServiceError('Deposit value must be informed', 400, { message: 'Deposit value is required' });
  }

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(depositValue)) {
    throw new ServiceError('Deposit value is not valid', 400, { message: 'Deposit value is not valid' });
  }
}

exports.doDeposit = async (clientId, depositValue) => {
  const client = await profilesService.findAndValidateAsClient(clientId, depositValue);

  validateDepositValue(depositValue);

  await isValidDeposit(client.id, depositValue);

  client.balance += depositValue;

  sequelize.transaction(async (transaction) => {
    await client.save({ transaction });
  });

  return true;
};
