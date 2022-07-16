const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  info: {
    title: 'Aula Node Pos Graduação', // Title of the documentation
    version: '1.0.0', // Version of the app
    description: 'Uma simples api para a aula de pós graduação em Node.js', // short description of the app
  },
  host: 'localhost:3000', // the host or url of the app
  basePath: '/', // the basepath of your endpoint
  schemes: [
    "http"
  ]
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ['./api/docs/**/*.yaml'],
};
// initialize swagger-jsdoc

module.exports = swaggerJSDoc(options);