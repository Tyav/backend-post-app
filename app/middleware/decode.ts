import jwt from 'jsonwebtoken';
import APIError from '../../helpers/APIError';
import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { jwtEmailSecret, jwtSecret } from '../../config/env';
import { IRequest } from '../types/express';
import UserService from '../services/userService';
import { TokenType, IAuth } from '../services/tokenService';

const decode = (type: TokenType) => async (
  req: IRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers['authorization'] || !req.headers['authorization'].startsWith('Bearer')) {
      throw new APIError({
        message: 'Unauthorized User',
        status: httpStatus.UNAUTHORIZED,
      });
    }
    const token = req.headers['authorization'].split(' ')[1];

    let decoded;
    let secret = type === TokenType.PASSWORD_RESET ? jwtEmailSecret : jwtSecret
    try {
      decoded = jwt.verify(token, secret) as IAuth;
    } catch (error) {
      throw new APIError({
        message: 'Unauthorized User',
        status: httpStatus.UNAUTHORIZED,
      });
    }
    if (type === TokenType.AUTH) {
      let user;
      if (decoded && decoded.user) {
        user = await UserService.getByEmail(decoded.email);
      }
      if (!user) {
        throw new APIError({
          message: 'Unauthenticated user',
          status: httpStatus.UNAUTHORIZED,
        });
      }
      req.user = user;
      req.sub = user._id;
    } else if (type === TokenType.VERIFY) {
      if (decoded && decoded.type === TokenType.VERIFY) {
        // check body for id and token;
        req.body.id ? '' : (req.body.id = decoded.user);

        req.verify = true;
      }
      if (!req.body.id) {
        throw new APIError({
          message: 'Expired/Invalid link. try logging or contact support',
          status: httpStatus.BAD_REQUEST,
        });
      }
    } else if (type === TokenType.PASSWORD_RESET) {
      if (decoded && decoded.type === TokenType.PASSWORD_RESET) {
        req.body.id = decoded.id;
      } else {
        throw new APIError({
          message: 'Invalid Token',
          status: httpStatus.BAD_REQUEST,
        });
      }
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const adminAuth = (req: IRequest, _res: Response, next: NextFunction) => {
  if (req.isAdmin) {
    return next();
  }
  next(
    new APIError({
      message: 'Unauthorized user',
      status: httpStatus.UNAUTHORIZED,
    })
  );
};

export default decode; //(req, res, next) // => (req, res, next)=> {}
