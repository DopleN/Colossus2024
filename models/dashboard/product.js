import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the Product schema
const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Trim whitespace from the product name
      minlength: 2, // Ensure that the name has a reasonable length
      maxlength: 100, // Limit the length of product names
    },
    sizes: {
      type: [String], // Array of strings to hold sizes
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0; // Ensure the product has at least one size
        },
        message: 'A product must have at least one size.',
      },
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'], // Ensure price is non-negative
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative'], // Ensure quantity is non-negative
    },
    description: {
      type: String,
      required: true,
      minlength: [10, 'Description should be at least 10 characters long'], // Basic validation for description length
    },
    supplier: {
      name: {
        type: String,
        required: true,
      },
      id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Supplier', // Assuming you have a Supplier model
      },
    },
    image: {
      type: String, // URL to the product image
      required: true,
      match: [/^https?:\/\/.*\.(?:jpg|jpeg|png|gif)$/, 'Please provide a valid image URL'], // Validate image URL
    },
    brand: {
      name: {
        type: String,
        required: true,
      },
      id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Brand', // Assuming you have a Brand model
      },
    },
    category: {
      name: {
        type: String,
        required: true,
      },
      id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Category', // Assuming you have a Category model
      },
      subcategories: [
        {
          name: {
            type: String,
            required: true,
          },
          id: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Subcategory', // Assuming you have a Subc
