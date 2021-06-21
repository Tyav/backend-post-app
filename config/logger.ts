import pino from 'pino';
import { appId, logLevel } from './env';

const logger = pino({
  name: appId || 'Post App',
  level: logLevel || 'debug',
  prettyPrint: { colorize: true },
});

export default logger;
