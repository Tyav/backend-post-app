import { mongo, port as portNumber } from './config/env';
import Database from './config/database';
import Server from './config/express';
import routes from './app/routes';

const port = parseInt(portNumber || '3000');
const connectionString = mongo.host;
const db = new Database(connectionString);

export default new Server().database(db).router(routes).listen(port);
