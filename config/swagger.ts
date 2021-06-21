import { Application } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { port, baseUrl } from './env';

const options = {
  swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
    openapi: '3.0.0',
    info: {
      title: 'Post App',
      version: '1.0.0',
      description: 'Post App API Documentation for TalentQL',
      contact: {
        email: 'tyav2greenz@gmail.com',
      },
      license: {
        name: 'Apache 2.0',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
      },
    },
    tags: [],

    schemes: ['http', 'https'],
    host: 'localhost:4000/',
    servers: [
      { url: 'http://localhost:4000/api/v1', description: 'development api' },
      {
        url: 'https://{baseUrl}/api/{version}',
        description: 'The production API server',
        variables: {
          baseUrl: {
            default: baseUrl,
            enum: [`localhost:${port}`, baseUrl],
            description: 'this value is assigned by the service provider',
          },
          version: {
            enum: ['v1'],
            default: 'v1',
          },
        },
      },
    ],
  },

  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['./swagger-files/*.yaml'],
};

const specs = swaggerJsdoc(options);

export default (app: Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
