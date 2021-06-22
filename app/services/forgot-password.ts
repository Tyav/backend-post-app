import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';

import { ForgotPassword, IForgotPassword } from '../model/forgot-password';
import emailService from './emailService';
import APIError from '../../helpers/APIError';
import { baseUrl, jwtEmailSecret, mailSender } from '../../config/env';
import userService from './userService';
import { IForgotPasswordToken } from '../types/generic';
import { TokenType } from './tokenService';

export class ForgotPasswordService {
  static async handler(email: string) {
    const user = await this.getUser(email)

    if (!user) {
      throw new APIError({
        status: httpStatus.NOT_FOUND,
        message: `reset instructions have been sent to your registered email`,
      });
    }

    const forgotInfo = await this.storeForgotPasswordInfo({
      user: user._id,
    } as IForgotPassword);

    const token = this.signToken(forgotInfo);
    this.sendResetEmail(user.email, token);
    return 'reset instructions have been sent to your registered email';
  }

  static async storeForgotPasswordInfo(info: IForgotPassword) {
    await ForgotPassword.deleteMany({ user: info.user });
    const forgotPassword = new ForgotPassword(info);
    return forgotPassword.save();
  }

  static signToken(payload: any) {
    return jwt.sign({ id: payload.id, type: TokenType.PASSWORD_RESET }, jwtEmailSecret, {
      expiresIn: '1h',
    });
  }

  static verifyToken(token: string): IForgotPasswordToken {
    return jwt.verify(token, jwtEmailSecret) as IForgotPasswordToken;
  }

  static async sendResetEmail(email: string, token: string) {
    try {
      await emailService.sendEmail({
        from: mailSender,
        subject: 'Reset Password',
        text: `Use link ${baseUrl}/password/reset?token=${token} to reset your password`,
        to: [email],
      });
    } catch (error) {
      // deletes entry so the user can try again
      //await this.deleteForgotPasswordRequest(email);
    }
  }

  static async getUser(email: string) {
    return userService.getByEmail(email);
  }
  // static async getAdmin(email: string) {
  //   return adminService.getByEmail(email);
  // }

  static async deleteForgotPasswordRequest(_data: IForgotPassword) {
    // return ForgotPassword.deleteMany(data);
  }

  static get(_id: string) {
    return ForgotPassword.findOne({ _id });
  }
}
