import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the Order schema
const OrderSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    paymentDetails: {
      ccName: {
        type: String,
        required: true,
      },
      ccNumber: {
        type: String,
        required: false, // Consider removing this due to security concerns
      },
      ccExpiration: {
        type
