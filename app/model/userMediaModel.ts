import { Schema, model, Document } from 'mongoose';
import { IUser } from './userModel';

export interface IUserMedia extends Document {
  user: string | IUser;
  url: string ;
}

const UserMediaSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
    deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

/* always attach populate to any save method (eg. findOne, find, findOneAndUpdate...) */
UserMediaSchema.post<IUserMedia>('save', function (doc, next) {
  doc
    .populate({ path: 'user', select: '_id name verified' })
    .execPopulate()
    .then(() => {
      next();
    });
});
/* always attach populate to any find method (eg. findOne, find, findOneAndUpdate...) */
UserMediaSchema.pre<IUserMedia>(/^find/, function () {
  this.populate({ path: 'user', select: '_id name verified' });
});

/**
 * Methods
 */
UserMediaSchema.methods = {
  toJSON() {
    const { _id, __v, ...rest } = this.toObject();
    return { ...rest, id: _id };
  },
};

/**
 * Statics
 */
UserMediaSchema.statics = {};

export const UserMedia = model<IUserMedia>('Image', UserMediaSchema);
