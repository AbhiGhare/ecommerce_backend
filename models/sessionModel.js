// sessionModel.js

import mongoose from 'mongoose';

// Define the schema for session data
const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  customerEmail: { type: String },
  customerName: { type: String },
  customerAddress: {
    city: { type: String, default: null },
    country: { type: String, default: null },
    line1: { type: String, default: null },
    postal_code: { type: String, default: null },
    state: { type: String, default: null },
  },
  lineItems: [
    {
      id: { type: String, default: null },
      description: { type: String, default: null },
      quantity: { type: Number, default: 1 },
      amountTotal: { type: Number, default: 0 },
      priceId: { type: String, default: null },
      unitAmount: { type: Number, default: 0 },
      currency: { type: String, default: null },
      productId: { type: String, default: null },
      productName: { type: String, default: null },
      productImages: { type: [String], default: [] },
    }
  ],
  amountSubtotal: { type: Number, default: 0 },
  amountTotal: { type: Number, default: 0 },
  currency: { type: String, default: null },
  paymentStatus: { type: String, default: null },
  created: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending' }, // Default status
  deliveryStatus: { type: String, default: null },
  deliveryLocation: {
    address: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    postalCode: { type: String, default: null },
    country: { type: String, default: null },
  },
  estimatedDeliveryTime: { type: String, default: null },
}, { timestamps: true });

// Create a Mongoose model using the schema
const Session = mongoose.model('Session', sessionSchema);

export default Session;
