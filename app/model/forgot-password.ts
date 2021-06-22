import { Document, Schema, model } from 'mongoose';
import { IUser } from './userModel';

export interface IForgotPassword extends Document {
  user: (string & IUser);
}

const ForgotPasswordSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      unique: true,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Deletes an entry after 1hr if the reset process was not completed
ForgotPasswordSchema.index({ createdAt: 1 }, { expires: '1h' });

/* always attach populate to any save method (eg. findOne, find, findOneAndUpdate...) */
ForgotPasswordSchema.post<IForgotPassword>('save', function (doc, next) {
  doc
    .populate('user')
    .execPopulate()
    .then(() => {
      next();
    });
});
/* always attach populate to any find method (eg. findOne, find, findOneAndUpdate...) */
ForgotPasswordSchema.pre<IForgotPassword>(/^find/, function () {
  this.populate('user');
});

export const ForgotPassword = model<IForgotPassword>(
  'ForgotPassword',
  ForgotPasswordSchema
);
