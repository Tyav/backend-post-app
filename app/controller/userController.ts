import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';

import APIError from '../../helpers/APIError';
import sendResponse from '../../helpers/sendResponse';
import userService from '../services/userService';
import TokenService, { TokenType } from '../services/tokenService';
import emailService from '../services/emailService';
import { baseUrl, mailSender } from '../../config/env';
import accountVerificationService from '../services/accountVerificationService';
import { AccountType } from '../model/accountVerificationModel';

export class UserController {
  // Create user
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.email = req.body.email.toLowerCase();
      // check if user exist
      let user = await userService.getByEmail(req.body.email);

      if (user) {
        // if user does exist throw an APIError
        throw new APIError({
          message: 'User exist',
          status: httpStatus.BAD_REQUEST,
        });
      }

      // create user after checks, password is removed on return. return value is lean
      user = await userService.create(req.body);
      const email = user.email;
      /** Sign Token */

      const accountVerification = await accountVerificationService.create({
        user: user._id,
        type: AccountType.USER,
      });
      const token = accountVerification.token;
      const userToken = TokenService.issue({
        user: user._id,
        token,
        type: TokenType.VERIFY,
      });
      /* Send  */

      emailService
        .sendEmail({
          to: [email],
          subject: 'Verification token',
          text: `${baseUrl}/verify/${userToken}`,
          from: mailSender,
        })
        .catch(err => {
          console.log('Logging to sentry ===>', err);
        });

      res
        .status(201)
        .json(
          sendResponse(httpStatus.CREATED, 'User Created Successfully', user, null)
        );
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const modifiedEmail = email.toLowerCase();

    try {
      /** Get specified user */
      const user = await userService.getByEmail(modifiedEmail);

      /** Ensure that user exists on DB*/
      if (!user || !user.verified) {
        throw new APIError({
          message: 'Invalid email or password!',
          status: httpStatus.NOT_FOUND,
        });
      }

      /** Compare and validate password */
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        throw new APIError({
          message: 'Invalid email or password!',
          status: httpStatus.UNAUTHORIZED,
        });
      }

      /** Sign Token */
      const token = TokenService.issue({
        user: user.id,
        email: user.email,
        type: TokenType.AUTH,
      });

      /** Send Response */
      return res
        .status(httpStatus.OK)
        .json(sendResponse(httpStatus.OK, 'Login Successful', user, null, token));
    } catch (error) {
      return next(error);
    }
  }
}

export default new UserController();
