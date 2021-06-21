import { Request, Response, NextFunction } from 'express';

import { ForgotPasswordService } from '../services/forgot-password';
import sendResponse from '../../helpers/sendResponse';
import { AccountType } from '../model/accountVerificationModel';
import TokenService, { TokenType } from '../services/tokenService';
import APIError from '../../helpers/APIError';
import httpStatus from 'http-status';
import { IForgotPassword } from '../model/forgot-password';

export class ForgotPasswordController {
  static async handler(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      let { type } = req.query;

      const successMessage = await ForgotPasswordService.handler({
        email,
        type: type === 'user' ? AccountType.USER : AccountType.ADMIN,
      });

      res.status(200).json(sendResponse(200, successMessage));
    } catch (err) {
      next(err);
    }
  }
  static async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.body.token;

      const decodedToken = await ForgotPasswordService.verifyToken(token);

      const forgotPassword = await ForgotPasswordService.get(decodedToken.id);

      if (!forgotPassword) {
        throw new APIError({
          message: 'Invalid token',
          status: httpStatus.BAD_REQUEST,
        });
      }
      const newToken = TokenService.issue({
        id: forgotPassword._id,
        type: TokenType.PASSWORD_RESET,
      });

      res.status(200).json(sendResponse(200, 'Valid token', newToken));
    } catch (err) {
      next(
        new APIError({
          message: 'Invalid token',
          status: httpStatus.BAD_REQUEST,
        })
      );
    }
  }
  static async reset(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.body.id;
      const password = req.body.password;

      const forgotPassword = await ForgotPasswordService.get(id);

      if (!forgotPassword) {
        throw new APIError({
          message: 'Invalid token',
          status: httpStatus.BAD_REQUEST,
        });
      }

      forgotPassword.user.password = password;
      await forgotPassword.user.save();
      const { email, type } = forgotPassword;
      ForgotPasswordService.deleteForgotPasswordRequest({
        email,
        type,
      } as IForgotPassword);

      res.status(200).json(sendResponse(200, 'Password Changed successfully'));
    } catch (err) {
      next(
        new APIError({
          message: 'Invalid token',
          status: httpStatus.BAD_REQUEST,
        })
      );
    }
  }
}
