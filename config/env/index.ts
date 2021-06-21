/**
 * Expose
 */

import { Joi } from 'celebrate';

// import and configure dotenv, will load vars in .env in PROCESS.ENV
import * as dotenv from 'dotenv';
dotenv.config();
// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(5070),
  MONGOOSE_DEBUG: Joi.boolean().when('NODE_ENV', {
    is: Joi.string().equal('development'),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false),
  }),
  MONGODB_URL: Joi.string().required().description('Mongodb url for production'),
  MONGODB_URL_DEV: Joi.string()
    .required()
    .description('Mongodb url for development'),
  MONGODB_TEST_URL: Joi.string().description('Mongodb url for test'),
  JWT_SECRET: Joi.string().required().description('JWT Secret required to sign'),
  JWT_EXPIRATION_INTERVAL: Joi.string()
    .required()
    .description('JWT_EXPIRATION_INTERVAL required to sign'),
  JWT_EMAIL_SECRET: Joi.string()
    .required()
    .description('JWT secret to sign tokens for forgot password emails '),
  MAIL_KEY: Joi.string()
    .required()
    .description('API key for mail service to send emails'),
  MAIL_SENDER: Joi.string()
    .required()
    .description('The app official email. can be a personal email in development'),
  REQUEST_LIMIT: Joi.string()
    .regex(/^\d+kb$/)
    .required()
    .description('Max limit for a single request'),
  APP_ID: Joi.string().required().description('Id of application'),
  LOG_LEVEL: Joi.string().default('debug').description('Log level for pino logger'),
  BASE_URL: Joi.string()
    .required()
    .description('base url to server where the app is hosted'),
  // FRONTEND_URL: Joi.string()
  //   .required()
  //   .description('frontend base url to server where the frontend is hosted'),
  // STRIPE_SECRET_KEY: Joi.string()
  //   .required()
  //   .description('Stripe secret key to initiate stripe'),
  // STRIPE_PUBLISHABLE_KEY: Joi.string().required().description('Stripe public key'),
  // STRIPE_WEBHOOK_SECRET: Joi.string()
  //   .required()
  //   .description('Stripe webhook secret'),
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env = envVars.NODE_ENV;
export const port = envVars.PORT;
export const mongooseDebug = envVars.MONGOOSE_DEBUG;
export const jwtSecret = envVars.JWT_SECRET;
export const jwtExpirationInterval = envVars.JWT_EXPIRATION_INTERVAL;
export const mongo = {
  host:
    envVars.NODE_ENV === 'test'
      ? envVars.MONGODB_TEST_URL
      : envVars.NODE_ENV === 'production'
      ? envVars.MONGODB_URL
      : envVars.MONGODB_URL_DEV,
};
export const mailConfig = {
  apiKey: envVars.MAIL_KEY,
};
export const jwtEmailSecret = envVars.JWT_EMAIL_SECRET;
export const mailSender = envVars.MAIL_SENDER;
export const requestLimit = envVars.REQUEST_LIMIT;
export const appId = envVars.APP_ID;
export const logLevel = envVars.LOG_LEVEL;
export const baseUrl = envVars.BASE_URL;
