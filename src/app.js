const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const { sequelize } = require('./model');
const errorHandlers = require('./middleware/error-handlers');

const swaggerDocument = require('../swagger-spec.json');

const contractsRouter = require('./routes/contracts');
const jobsRouter = require('./routes/jobs');
const balancesRouter = require('./routes/balances');
const adminRouter = require('./routes/admin');

const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// App routes
app.use('/contracts', contractsRouter);
app.use('/jobs', jobsRouter);
app.use('/balances', balancesRouter);
app.use('/admin', adminRouter);

app.use(errorHandlers.serviceError);

module.exports = app;
