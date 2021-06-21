import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

import APIError from '../../helpers/APIError';
import sendResponse from '../../helpers/sendResponse';
import TokenService, { TokenType } from '../services/tokenService';
import accountVerificationService from '../services/accountVerificationService';

export class AuthController {
  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, id } = req.body;
      const verificationFound = await accountVerificationService.get(token, id);
      if (!verificationFound) {
        throw new APIError({
          message: 'Invalid token',
          status: httpStatus.BAD_REQUEST,
        });
      }
      // get user and set verified to true
      let { user: userToVerify } = verificationFound;
      userToVerify.verified = true;
      userToVerify.save();

      // create token for user
      /** Sign Token */
      const signToken = TokenService.issue({
        [`${verificationFound.type}`.toLowerCase()]: userToVerify._id,
        email: userToVerify.email,
        type: TokenType.AUTH,
      });

      // delete accountVerification
      await accountVerificationService.delete(verificationFound._id);

      // transform user and send user with token
      res
        .status(httpStatus.OK)
        .json(
          sendResponse(
            httpStatus.OK,
            'Account verified',
            userToVerify,
            '',
            signToken
          )
        );
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
