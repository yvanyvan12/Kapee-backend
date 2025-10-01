import mongoose, { Schema, Document } from 'mongoose';

// --- Interfaces ---
interface CartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

interface CartDocument extends Document {
  userId: mongoose.Types.ObjectId;
  items: CartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

// --- Mongoose Schema ---
const cartSchema = new Schema<CartDocument>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  items: [
    {
      productId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Product',  // Make sure this matches your Product model name
        required: true 
      },
      quantity: { 
        type: Number, 
        required: true, 
        min: 1, 
        default: 1 
      },
    },
  ],
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Add index for faster queries
cartSchema.index({ userId: 1 });

const Cart = mongoose.model<CartDocument>('Cart', cartSchema);
 
export default Cart;