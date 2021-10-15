const { Profile } = require('../model');
const ServiceError = require('./ServiceError');

const { isNullOrUndefined } = require('../utils');

exports.findAndValidateAsClient = async (clientId) => {
  if (isNullOrUndefined(clientId)) {
    throw new ServiceError('Client id is required', 400);
  }

  const client = await Profile.findOne({ where: { id: clientId } });

  if (!client) {
    throw new ServiceError('Client not found', 404);
  }

  if (client.type !== 'client') {
    throw new ServiceError('Profile is not a client', 412, { message: 'You must be a client to make a deposit' });
  }

  return client;
};
