import jwt from 'jsonwebtoken';
import APIError from '../../helpers/APIError';
import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { jwtSecret } from '../../config/env';
import { IRequest } from '../types/express';
import UserService from '../services/userService';
import { TokenType, IAuth } from '../services/tokenService';
import AdminService from '../services/adminService';

const decode = (type: TokenType) => async (
  req: IRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers['authorization']) {
      throw new APIError({
        message: 'Unauthorised User',
        status: httpStatus.UNAUTHORIZED,
      });
    }
    const token = req.headers['authorization'].split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret) as IAuth;
    } catch (error) {
      throw new APIError({
        message: 'Unauthorised User',
        status: httpStatus.UNAUTHORIZED,
      });
    }
    if (type === TokenType.AUTH) {
      let user;
      if (decoded && decoded.user) {
        user = await UserService.getByEmail(decoded.email);
      }
      if (decoded && decoded.admin) {
        user = await AdminService.getByEmail(decoded.email);
        req.isAdmin = true;
      }

      if (!user) {
        throw new APIError({
          message: 'Unauthorized user',
          status: httpStatus.UNAUTHORIZED,
        });
      }
      req.user = user;
      req.sub = user._id;
    } else if (type === TokenType.VERIFY) {
      if (decoded && decoded.type === TokenType.VERIFY) {
        // check body for id and token;
        req.body.id ? '' : (req.body.id = decoded.admin || decoded.user);
        req.body.token ? '' : (req.body.token = decoded.token);
        req.verify = true;
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
