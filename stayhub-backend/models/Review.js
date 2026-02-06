const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    propertyId: {
      type: String, // '1', '2', ...
      required: true,
    },

    // overall rating
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    // category scores
    cleanliness: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    accuracy: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    communication: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    locationScore: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    value: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    comment: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
