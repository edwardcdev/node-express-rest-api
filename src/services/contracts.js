const { Op } = require('sequelize');
const { Contract } = require('../model');
const ServiceError = require('./ServiceError');

function validateContractVisibility(contract, profileId) {
  if (contract.ContractorId !== profileId && contract.ClientId !== profileId) {
    throw new ServiceError('Profile not allowed to see this contract', 403, null);
  }
}

exports.getByIdAndCheckProfileVisibility = async (contractId, profileId) => {
  const contract = await Contract.findOne({ where: { id: contractId } });

  if (!contract) {
    throw new ServiceError('Contract not found', 404, null);
  }

  validateContractVisibility(contract, profileId);

  return contract;
};

exports.listProfileContracts = async (profileId) => {
  const query = {
    where: {
      [Op.or]: {
        ContractorId: profileId,
        ClientId: profileId,
      },
      [Op.not]: {
        status: 'terminated',
      },
    },
  };

  const contracts = await Contract.findAll(query);

  return contracts;
};
