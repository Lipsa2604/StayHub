// routes/reviewRoutes.js
const express = require('express');
const Review = require('../models/Review');

const router = express.Router();

// GET /api/properties/:propertyId/reviews
router.get('/properties/:propertyId/reviews', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const reviews = await Review.find({ propertyId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error('get reviews error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/properties/:propertyId/reviews
router.post('/properties/:propertyId/reviews', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const {
      rating,
      cleanliness,
      accuracy,
      communication,
      locationScore,
      value,
      comment,
    } = req.body;

    const review = await Review.create({
      propertyId,
      rating,
      cleanliness,
      accuracy,
      communication,
      locationScore,
      value,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    console.error('create review error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
