import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { version } from '../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'yafm-api',
      version,
    },
    host: '/',
  },
  apis: ['./routes/*.ts', './schema/*.ts', './models/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss:
        '.swagger-ui .topbar { display: none } .opblock-description-wrapper { display: none }',
    }),
  );

  app.get('/docs.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // eslint-disable-next-line no-console
  console.info(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
