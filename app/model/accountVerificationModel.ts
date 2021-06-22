import { Schema, model, Document } from 'mongoose';
import { IUser } from './userModel';

export interface IAccountVerification extends Document {
  user: (string & IUser) | string;
}

const AccountVerificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: 'User',
      required: true,
    },
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
