import mongoose, { Schema, Document, model } from 'mongoose';

export interface IOrder extends Document {
  userId: mongoose.Schema.Types.ObjectId; // Add this
  items: {
    productId: mongoose.Schema.Types.ObjectId;
    quantity: number;
  }[];
  total: number;
  createdAt: Date;
}

const orderSchema: Schema<IOrder> = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add this
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    total: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Order = model<IOrder>('Order', orderSchema);

export default Order;