import { Document, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  approved: boolean;
  address: string | Document;
  isAdmin: boolean
  createdAt: string;
  updatedAt: string;
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    // address: {
    //   type: Types.ObjectId,
    //   ref: 'Address',
    // },
    isAdmin: { type: Boolean, default: false }
  },
  {
    collection: 'User',
    timestamps: true,
  }
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
UserSchema.pre<IUser>('save', function (next) {
  /**
   * Example on saving user password
   * Ensures the password is hashed before save
   */
  if (!this.isModified('password')) {
    return next();
  }
  this.email = this.email.toLowerCase();
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    next();
  });
});

/* always attach populate to any find method (eg. findOne, find, findOneAndUpdate...) */
UserSchema.pre<IUser>(/^find/, function () {
  this.populate('address');
});
UserSchema.post<IUser>('save', function (doc, next) {
  doc
    .populate('address')
    .execPopulate()
    .then(() => {
      next();
    });
});

/**
 * Methods
 */
UserSchema.methods = {
  toJSON() {
    const { password, _id, __v, isSuper, ...rest } = this.toObject();
    return { ...rest, id: _id };
  },
};

/**
 * Statics
 */
UserSchema.statics = {};

export const User = model<IUser>('User', UserSchema);
