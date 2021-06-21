import { Schema, model, Document } from 'mongoose';
import { IUser } from './userModel';
import { enumToArray } from '../types/generic';

export enum AccountType {
  ADMIN = 'Admin',
  USER = 'User',
}

export interface IAccountVerification extends Document {
  user: IUser;
  token: string;
  type: AccountType;
}

const AccountVerificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      unique: true,
      refPath: 'type',
      required: true,
    },
    token: { type: String, unique: true, required: true },
    type: { type: String, enum: enumToArray(AccountType) },
  },
  { timestamps: true }
);

AccountVerificationSchema.index({ createdAt: 1 }, { expires: '1d' });

/* always attach populate to any save method (eg. findOne, find, findOneAndUpdate...) */
AccountVerificationSchema.post<IAccountVerification>('save', function (doc, next) {
  doc
    .populate('user')
    .execPopulate()
    .then(() => {
      next();
    });
});
/* always attach populate to any find method (eg. findOne, find, findOneAndUpdate...) */
AccountVerificationSchema.pre<IAccountVerification>(/^find/, function () {
  this.populate('user');
});

export const AccountVerification = model<IAccountVerification>(
  'AccountVerification',
  AccountVerificationSchema
);
