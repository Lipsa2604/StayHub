// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const reviewRoutes = require('./routes/reviewRoutes');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', reviewRoutes);


// connect to local MongoDB (Compass)
mongoose
  
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Mongo connection error:', err));

// 10 beachfront properties (still in-memory for now)
const properties = [
  {
    _id: '1',
    title: 'Oceanview Beachfront Villa',
    location: 'Goa, India',
    pricePerNight: 180,
    type: 'villa',
    category: 'beachfront',
    bedrooms: 3,
    amenities: ['wifi', 'pool', 'kitchen', 'gym'],
    images: [
      'http://localhost:3000/images/beach1.jpg',
      'http://localhost:3000/images/beach1.1.jpg',
      'http://localhost:3000/images/gym1.jpg',
    ],
  },
  {
    _id: '2',
    title: 'Luxury Beachfront Resort Suite',
    location: 'Goa, India',
    pricePerNight: 220,
    type: 'resort',
    category: 'beachfront',
    bedrooms: 2,
    amenities: ['wifi', 'pool', 'spa', 'gym'],
    images: [
      'http://localhost:3000/images/beach2.jpg',
      'http://localhost:3000/images/beach2.2.jpg',
      'http://localhost:3000/images/gym2.jpg',
    ],
  },
  {
    _id: '3',
    title: 'Cozy Beachfront Apartment',
    location: 'Puri, India',
    pricePerNight: 95,
    type: 'apartment',
    category: 'beachfront',
    bedrooms: 1,
    amenities: ['wifi', 'kitchen', 'ac'],
    images: [
      'http://localhost:3000/images/beach3.jpg',
      'http://localhost:3000/images/beach3.3.jpg',
      'http://localhost:3000/images/gym3.jpg',
    ],
  },
  {
    _id: '4',
    title: 'Family Beachfront Cottage',
    location: 'Goa, India',
    pricePerNight: 130,
    type: 'cottage',
    category: 'beachfront',
    bedrooms: 2,
    amenities: ['wifi', 'pool', 'kitchen'],
    images: [
      'http://localhost:3000/images/beach4.jpg',
      'http://localhost:3000/images/beach4.4.jpg',
      'http://localhost:3000/images/gym4.jpg',
    ],
  },
  {
    _id: '5',
    title: 'Premium Beachfront Lodge',
    location: 'Gokarna, India',
    pricePerNight: 210,
    type: 'lodge',
    category: 'beachfront',
    bedrooms: 4,
    amenities: ['wifi', 'fireplace', 'spa', 'gym'],
    images: [
      'http://localhost:3000/images/beach5.jpg',
      'http://localhost:3000/images/beach5.5.jpg',
      'http://localhost:3000/images/gym5.jpg',
    ],
  },
  {
    _id: '6',
    title: 'Budget Beachfront Studio',
    location: 'Puri, India',
    pricePerNight: 75,
    type: 'apartment',
    category: 'beachfront',
    bedrooms: 1,
    amenities: ['wifi', 'kitchen', 'ac'],
    images: [
      'http://localhost:3000/images/beach6.jpg',
      'http://localhost:3000/images/beach6.6.jpg',
      'http://localhost:3000/images/gym1.jpg',
    ],
  },
  {
    _id: '7',
    title: 'Luxury Beachfront Penthouse',
    location: 'Mumbai, India',
    pricePerNight: 260,
    type: 'penthouse',
    category: 'beachfront',
    bedrooms: 3,
    amenities: ['wifi', 'pool', 'gym', 'parking'],
    images: [
      'http://localhost:3000/images/beach7.jpg',
      'http://localhost:3000/images/beach7.7.jpg',
      'http://localhost:3000/images/gym2.jpg',
    ],
  },
  {
    _id: '8',
    title: 'Beachfront Farmhouse with Pool',
    location: 'Alibaug, India',
    pricePerNight: 150,
    type: 'farmhouse',
    category: 'beachfront',
    bedrooms: 3,
    amenities: ['wifi', 'pool', 'kitchen', 'garden'],
    images: [
      'http://localhost:3000/images/beach8.jpg',
      'http://localhost:3000/images/beach8.8.jpg',
      'http://localhost:3000/images/gym3.jpg',
    ],
  },
  {
    _id: '9',
    title: 'Lake-style Beachfront Cottage',
    location: 'Udupi, India',
    pricePerNight: 140,
    type: 'cottage',
    category: 'beachfront',
    bedrooms: 2,
    amenities: ['wifi', 'kitchen', 'boat'],
    images: [
      'http://localhost:3000/images/beach9.jpg',
      'http://localhost:3000/images/beach9.9.jpg',
      'http://localhost:3000/images/gym1.jpg',
    ],
  },
  {
    _id: '10',
    title: 'Desert-theme Beachfront Tent',
    location: 'Goa, India',
    pricePerNight: 120,
    type: 'camp',
    category: 'beachfront',
    bedrooms: 1,
    amenities: ['wifi', 'breakfast', 'campfire'],
    images: [
      'http://localhost:3000/images/beach10.jpg',
      'http://localhost:3000/images/beach10.10.jpg',
      'http://localhost:3000/images/gym2.jpg',
    ],
  },
];

// routes
app.get('/', (req, res) => {
  res.send('StayHub backend is running');
});

app.get('/api/properties', (req, res) => {
  res.json(properties);
});

app.get('/api/properties/:id', (req, res) => {
  const property = properties.find((p) => p._id === req.params.id);
  if (!property) {
    return res.status(404).json({ message: 'Property not found' });
  }
  res.json(property);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
