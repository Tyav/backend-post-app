import express from 'express';
import cors from 'cors';
import { Application } from 'express';
import path from 'path';
import http from 'http';
import os from 'os';
import cookieParser from 'cookie-parser';
import installRoutes from './routes';
import l from './logger';
import morgan from 'morgan';
import { IDatabase } from './database';
// import swagger from './swagger';
import { requestLimit, env, port } from './env';

const app = express();

export default class ExpressServer {
  constructor() {
    const root = path.normalize(__dirname + '/../..');
    app.use(cors());
    app.set('appPath', root + 'client');
    app.use(morgan('dev'));
    // Use JSON parser for all non-webhook routes
    app.use(express.json({ limit: requestLimit || '100kb' }));

    app.use(
      express.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || '100kb',
      })
    );

    app.use(cookieParser());
  }

  router(routes: (app: Application) => void): ExpressServer {
    // swagger(app);
    installRoutes(app, routes);
    return this;
  }

  database(db: IDatabase): ExpressServer {
    db.init();
    return this;
  }

  listen(p: string | number = port): Application {
    const welcome = (port: string | number) => () =>
      l.info(
        `up and running in ${
          process.env.NODE_ENV || 'development'
        } @: ${os.hostname()} on port: ${port}`
      );
    if (env !== 'test') http.createServer(app).listen(p, welcome(p));
    return app;
  }

}
