import { Request } from 'express';
import { IUser } from '../../model/userModel';

export interface IRequest extends Request {
  s3?: any;
  isAdmin?: boolean;
  user?: IUser;
  sub?: string;
  verify?: boolean;
}
