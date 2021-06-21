import { Request } from 'express';
import { IUser } from '../../model/userModel';

// import { S3 } from '@aws-sdk/client-s3'
// import {} from ''

// interface UploadFiles {
//   audio: {[key: number]: any; }[];
//   art: {[key: number]: any; }[];
// }

export interface IRequest extends Request {
  s3?: any;
  isAdmin?: boolean;
  user?: IUser;
  sub?: string;
  verify?: boolean;
}
