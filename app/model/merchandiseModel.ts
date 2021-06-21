import { Schema, model, Document } from 'mongoose';

export interface IMerchandise extends Document {
  name: string;
  urls: string[];
  price: number;
  qty: number;
  size: string;
  tags: string[];
  deleted: boolean;
}

const MerchandiseSchema = new Schema(
  {
    name: { type: String, required: true },
    urls: { type: Array, of: String },
    price: { type: Number, required: true },
    size: { type: String },
    tags: { type: [], of: String },
    qty: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* always attach populate to any save method (eg. findOne, find, findOneAndUpdate...) */
MerchandiseSchema.post<IMerchandise>('save', function (doc, next) {
  doc
    .populate({ path: 'category', select: '_id name' })
    .execPopulate()
    .then(() => {
      next();
    });
});
/* always attach populate to any find method (eg. findOne, find, findOneAndUpdate...) */
MerchandiseSchema.pre<IMerchandise>(/^find/, function () {
  this.populate({ path: 'category', select: '_id name' });
});

/**
 * Methods
 */
MerchandiseSchema.methods = {
  toJSON() {
    const { _id, __v, ...rest } = this.toObject();
    return { ...rest, id: _id };
  },
};

/**
 * Statics
 */
MerchandiseSchema.statics = {};

export const Merchandise = model<IMerchandise>('Merchandise', MerchandiseSchema);
