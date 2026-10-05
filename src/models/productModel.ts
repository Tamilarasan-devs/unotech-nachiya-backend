import mongoose, { Document, Schema } from 'mongoose';

export interface IProductVariant {
  weight: string;
  price: number;
  quantity: number;
}

export interface IProduct extends Document {
  user: mongoose.Schema.Types.ObjectId;
  name: string;
  category: string;
  quantity: number;
  price: number;
  description: string;
  images: string[];
  variants: IProductVariant[];
}

const variantSchema = new Schema({
  weight: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
});

const productSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
      default: [],
    },
    variants: [variantSchema],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
