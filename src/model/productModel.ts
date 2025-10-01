import mongoose, { Schema, Document, model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  category?: string;
}

const productSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    category: { type: String },
  },
  { timestamps: true }
);

// Register model safely to avoid MissingSchemaError
const Product = mongoose.models.Product || model<IProduct>("Product", productSchema);

export default Product;
