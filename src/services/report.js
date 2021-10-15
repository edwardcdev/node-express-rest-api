const { sequelize } = require('../model');
const ServiceError = require('./ServiceError');
const { isValidDate } = require('../utils');

function validateStartEndDates(start, end) {
  if (!start || !end) {
    throw new ServiceError('Start and end date are required', 400, { message: 'Start and end date are required' });
  }

  if (!isValidDate(start) || !isValidDate(end)) {
    throw new ServiceError('Invalid date format', 400, { message: 'Invalid date format' });
  }

  const startd = new Date(start);
  const endd = new Date(end);

  if (startd.getTime() > endd.getTime()) {
    throw new ServiceError("Start date can't be after end date", 400, { message: 'Start date can\'t be after end date' });
  }

  return true;
}

exports.getBestProfession = async (start, end) => {
  validateStartEndDates(start, end);

  const [results] = await sequelize.query(`
        select P.profession as profession, sum(j.price) as total
        from Jobs j
        inner join Contracts C on j.ContractId = C.id
        inner join Profiles P on C.ContractorId = P.id
        where j.paid is true and j.paymentDate between :start and :end
        group by 1
        order by 2 desc
        limit 1`,
  { replacements: { start, end } });

  if (results.length === 0) {
    throw new ServiceError('No results found', 404, { message: 'No paid jobs in the period' });
  }

  return results[0];
};

exports.getBestClients = async (start, end, limit) => {
  validateStartEndDates(start, end);

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(limit) || limit === 0) {
    throw new ServiceError('Invalid limit', 400, { message: 'Invalid limit' });
  }

  const [results] = await sequelize.query(`
    select client.id, client.firstName as fn, client.lastName as ln, sum(j.price) as paid
    from Jobs j
    inner join Contracts C on j.ContractId = C.id
    inner join Profiles client on C.ClientId = client.id
    where j.paid is true and j.paymentDate between :start and :end
    group by 1
    order by 4 desc
    limit :limit`,
  { replacements: { start, end, limit: (limit || 2) } });

  if (results.length === 0) {
    throw new ServiceError('No results found', 404, { message: 'No paid jobs in the period' });
  }

  return results.map((r) => ({
    id: r.id,
    fullName: r.fn.concat(' ').concat(r.ln),
    paid: r.paid,
  }));
};
