const { Op } = require('sequelize');
const {
  Job, Contract, Profile, sequelize,
} = require('../model');
const ServiceError = require('./ServiceError');

async function findJobEagerProfiles(jobId) {
  const job = await Job.findOne({
    include: [{
      model: Contract,
      include: [
        { model: Profile, as: 'Contractor' },
        { model: Profile, as: 'Client' },
      ],
    }],
    where: {
      id: jobId,
    },
  });

  if (!job) {
    throw new ServiceError('Job not found', 404);
  }

  return job;
}

function validateJobForPayment(job, sessionProfileId) {
  const client = job.Contract.Client;
  const contractor = job.Contract.Contractor;

  if (!client || !contractor) {
    throw new ServiceError("Job doesn't have client or contrator", 412);
  }

  if (job.paid) {
    throw new ServiceError('Job is already paid', 400, { message: `Job #${job.id} is already paid` });
  }

  if (client.id !== sessionProfileId) {
    throw new ServiceError('Authenticated user is not the job client', 403, { message: 'Authenticated user is not the client of that Job' });
  }

  if (client.balance < job.price) {
    throw new ServiceError('Not enough credit', 400, { message: 'Not enough credit to pay for that job' });
  }
}

exports.getUnpaidJobsForProfile = async (profileId) => {
  const query = {
    include: [{
      model: Contract,
      where: {
        status: 'in_progress',
        [Op.or]: {
          ContractorId: profileId,
          ClientId: profileId,
        },
      },
    }],
    where: {
      paid: 0,
    },
  };

  const jobs = await Job.findAll(query);

  return jobs;
};

exports.payJob = async (sessionProfileId, jobId) => {
  const job = await findJobEagerProfiles(jobId);
  const client = job.Contract.Client;
  const contractor = job.Contract.Contractor;

  validateJobForPayment(job, sessionProfileId);

  job.paid = true;
  job.paymentDate = new Date();
  client.balance -= job.price;
  contractor.balance += job.price;

  sequelize.transaction(async (transaction) => {
    await job.save({ transaction });
    await client.save({ transaction });
    await contractor.save({ transaction });
  });

  return true;
};

exports.getUnpaidJobsTotalPriceForClient = async (clientId) => {
  const [results] = await sequelize.query(`
  SELECT sum(job.price) as total
  FROM Jobs job
  INNER JOIN Contracts C ON job.ContractId = C.id AND C.ClientId = :clientId
  WHERE paid IS NOT TRUE;`,
  { replacements: { clientId } });

  return results[0].total || 0;
};
