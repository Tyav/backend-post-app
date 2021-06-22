import jwt, { SignOptions } from 'jsonwebtoken';
import { customAlphabet } from 'nanoid';
import { jwtSecret, jwtExpirationInterval } from '../../config/env';

export enum TokenType {
  VERIFY = 'verify',
  AUTH = 'authorization',
  PASSWORD_RESET = "password reset"
}
export interface IAuth {
  [key: string]: any;
  type: TokenType
}


export default class TokenService {
  public static issue(payload: IAuth, options?: SignOptions) {
    return jwt.sign(payload, jwtSecret, {
      expiresIn: jwtExpirationInterval,
      ...options,
    });
  }

  public static verify(token: string) {
    return jwt.verify(token, jwtSecret);
  }

  public static generateCode() {
    const nanoid = customAlphabet(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz',
      6
    );
    return nanoid();
  }
}
