/**
 * Module dependencies.
 */

import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtSecret } from '../env';
const User = require('../../app/models/user.model');

/**
 * Expose
 */

const jwtOptions = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
};

const jwt = async (payload, done) => {
  try {
    const user = await User.findById(payload.sub);
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

exports.jwt = new Strategy(jwtOptions, jwt);
