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
import { IUser } from '../model/userModel';

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
      /** Sign Token */
      UserController.sendVerification(user);

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
      if (!user ) {
        throw new APIError({
          message: 'Invalid email or password!',
          status: httpStatus.NOT_FOUND,
        });
      }
      /** Ensure that user exists on DB*/
      if (!user.verified) {
        // send a verification to user to verify Account
        UserController.sendVerification(user);
        throw new APIError({
          message: 'Your account has not been verified, a link has been emailed to you to verify your account',
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

  static async sendVerification (user: IUser) {
    const accountVerification = await accountVerificationService.create(
      user._id,
    );
    const userId = (accountVerification.user as IUser)._id;
    const userToken = TokenService.issue({
      user: userId,
      type: TokenType.VERIFY,
    });
    /* Send  */

    emailService
      .sendEmail({
        to: [user.email],
        subject: 'Account Verification',
        text: `${baseUrl}/verify/${userToken}`,
        from: mailSender,
      })
      .catch(err => {
        console.log('Logging to sentry ===>', err);
      });


  }
}

export default new UserController();
