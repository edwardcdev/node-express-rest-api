// eslint-disable-next-line import/no-extraneous-dependencies
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  info: {
    title: 'Node Express API', // Title (required)
    version: '1.0.0', // Version (required)
    description: 'RESTful API with Node.js and Express.js', // Description (optional)
  },
  host: 'localhost:3001', // Host (optional)
  basePath: '/', // Base path (optional)
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // <-- not in the definition, but in the options
};

const swaggerSpec = swaggerJSDoc(options);

// eslint-disable-next-line no-console
console.log(JSON.stringify(swaggerSpec));
