import { Schema, model, Document } from 'mongoose';
import { IUser } from './userModel';
import { enumToArray } from '../types/generic';

export interface IUserMedia extends Document {
  user: string | IUser;
  media: string ;
  mediaType: string;
}

const UserMediaSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    media: { type: Schema.Types.ObjectId, refPath: 'mediaType', required: true },
    mediaType: { type: String, enum: enumToArray(['image', 'video']), required: true },
  },
  { timestamps: true }
);

/* always attach populate to any save method (eg. findOne, find, findOneAndUpdate...) */
UserMediaSchema.post<IUserMedia>('save', function (doc, next) {
  doc
    .populate({ path: 'user', select: '_id name verified approved' })
    .populate({
      path: 'media',
      populate: [
        { path: 'genre', select: '_id name' },
        { path: 'album', select: '_id name' },
        { path: 'artist', select: '_id name' },
      ],
    })
    .execPopulate()
    .then(() => {
      next();
    });
});
/* always attach populate to any find method (eg. findOne, find, findOneAndUpdate...) */
UserMediaSchema.pre<IUserMedia>(/^find/, function () {
  this.populate({ path: 'user', select: '_id name verified approved' });
  this.populate({
    path: 'media',
    populate: [
      { path: 'genre', select: '_id name' },
      { path: 'album', select: '_id name' },
      { path: 'artist', select: '_id name' },
    ],
  });
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

export const UserMedia = model<IUserMedia>('UserMedia', UserMediaSchema);
