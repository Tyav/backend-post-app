import { Schema, model, Document } from 'mongoose';
import { IUserMedia } from './userMediaModel';
import { IUser } from './userModel';

export interface IPost extends Document {
  content: string;
  images: IUserMedia[];
  user: string | IUser;
  likes: string[];
  deleted: boolean;
}

const PostSchema = new Schema(
  {
    content: { type: String, required: true, min: 1,
      max: 5000 },
    images: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Image',
        unique: true,
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    likes: [{ 
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'User',
    }],
    deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

/* always attach populate to any save method (eg. findOne, find, findOneAndUpdate...) */
PostSchema.post<IPost>('save', function (doc, next) {
  doc
    .populate({ path: 'images', select: 'url' })
    .populate({ path: 'user', select: '_id name' })
    .populate({ path: 'like', select: '_id name' })
    .execPopulate()
    .then(() => {
      next();
    });
});
/* always attach populate to any find method (eg. findOne, find, findOneAndUpdate...) */
PostSchema.pre<IPost>(/^find/, function () {
  this.populate({ path: 'images', select: 'url' })
  this.populate({ path: 'user', select: '_id name' })
  this.populate({ path: 'like', select: '_id name' })
});

/**
 * Methods
 */
PostSchema.methods = {
  toJSON() {
    const { _id, __v, ...rest } = this.toObject();
    return { ...rest, id: _id };
  },
};

/**
 * Statics
 */
PostSchema.statics = {};

export const Post = model<IPost>('Post', PostSchema);
