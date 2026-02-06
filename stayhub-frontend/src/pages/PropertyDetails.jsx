import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { propertyAPI, bookingAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import ReviewCard from '../components/ReviewCard';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [isAvailable, setIsAvailable] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // blind review state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');

  // category ratings
  const [cleanliness, setCleanliness] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [locationScore, setLocationScore] = useState(0);
  const [valueScore, setValueScore] = useState(0);

  // sort state
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'highest' | 'lowest'

  useEffect(() => {
    fetchPropertyDetails();
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (checkIn && checkOut) {
      checkAvailability();
      calculatePrice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn, checkOut]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await propertyAPI.getById(id);
      setProperty(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching property:', error);
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewAPI.getPropertyReviews(id);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const checkAvailability = async () => {
    try {
      const response = await bookingAPI.checkAvailability(id, checkIn, checkOut);
      setIsAvailable(response.data.available);
      setBlockedDates(response.data.blockedDates || []);
    } catch (error) {
      console.error('Availability check error:', error);
      setIsAvailable(false);
    }
  };

  const calculatePrice = () => {
    if (checkIn && checkOut && property) {
      const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const subtotal = days * property.pricePerNight;
      const serviceFee = subtotal * 0.1;
      const cleaningFee = 50;
      setTotalPrice(subtotal + serviceFee + cleaningFee);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/properties/${id}` } });
      return;
    }

    if (!isAvailable) {
      alert('Selected dates are not available. Please choose different dates.');
      return;
    }

    try {
      const bookingData = {
        propertyId: id,
        checkIn,
        checkOut,
        guests,
        totalPrice,
      };

      const response = await bookingAPI.create(bookingData);
      navigate(`/payment/${response.data._id}`);
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.response?.data?.message || 'Booking failed. Please try again.');
    }
  };

  const handleSubmitReview = async () => {
    if (
      !newRating ||
      !cleanliness ||
      !accuracy ||
      !communication ||
      !locationScore ||
      !valueScore ||
      !newComment.trim()
    ) {
      return;
    }

    try {
      const { data } = await reviewAPI.create(id, {
        rating: newRating,
        cleanliness,
        accuracy,
        communication,
        locationScore,
        value: valueScore,
        comment: newComment,
      });

      setReviews((prev) => [data, ...prev]);
      setNewRating(0);
      setNewComment('');
      setCleanliness(0);
      setAccuracy(0);
      setCommunication(0);
      setLocationScore(0);
      setValueScore(0);
      setShowReviewForm(false);
    } catch (err) {
      console.error('Review error:', err);
      alert('Could not submit review. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Property Not Found
        </h1>
        <button
          onClick={() => navigate('/properties')}
          className="text-primary underline"
        >
          Back to listings
        </button>
      </div>
    );
  }

  const days =
    checkIn && checkOut
      ? Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
      : 0;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, r) => sum + (Number(r.rating) || 0),
            0
          ) / reviews.length
        ).toFixed(1)
      : null;

  const avg = (arr) =>
    arr.length
      ? (
          arr.reduce((sum, n) => sum + (Number(n) || 0), 0) / arr.length
        ).toFixed(1)
      : null;

  const avgCleanliness = avg(reviews.map((r) => r.cleanliness));
  const avgAccuracy = avg(reviews.map((r) => r.accuracy));
  const avgCommunication = avg(reviews.map((r) => r.communication));
  const avgLocationScore = avg(reviews.map((r) => r.locationScore));
  const avgValue = avg(reviews.map((r) => r.value));

  // sorted reviews for display
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'highest') {
      return (b.rating || 0) - (a.rating || 0);
    }
    if (sortBy === 'lowest') {
      return (a.rating || 0) - (b.rating || 0);
    }
    // newest
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {property.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-gray-600">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            <span className="font-semibold">
              {averageRating || 'New'}
            </span>
            <span>({reviews.length} reviews)</span>
          </div>
          <div className="flex items-center gap-1">
            <FaMapMarkerAlt />
            <span>{property.location}</span>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8 rounded-xl overflow-hidden">
        <div className="md:col-span-2 md:row-span-2">
          <img
            src={property.images?.[0] || '/placeholder.jpg'}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>
        {property.images?.slice(1, 5).map((img, index) => (
          <div key={index}>
            <img
              src={img}
              alt={`${property.title} ${index + 2}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2">
          {/* Host Info */}
          <div className="border-b pb-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                {property.host?.name?.[0] || 'H'}
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Hosted by {property.host?.name || 'Host'}
                </h2>
                <p className="text-gray-600">
                  {property.guests} guests • {property.bedrooms} bedrooms •{' '}
                  {property.bathrooms} bathrooms
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">About this place</h2>
            <p className="text-gray-700 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">What this place offers</h2>
            <div className="grid grid-cols-2 gap-4">
              {property.amenities?.map((amenity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-2xl">{getAmenityIcon(amenity)}</span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews + Blind Review Form */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              <FaStar className="inline text-yellow-400 mr-2" />
              {averageRating || 'New'} • {reviews.length} reviews
            </h2>

            {/* Rating summary */}
            {reviews.length > 0 && (
              <div className="grid md:grid-cols-2 gap-3 mb-4 text-sm">
                <div className="flex justify-between">
                  <span>Cleanliness</span>
                  <span>{avgCleanliness} · 5</span>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy</span>
                  <span>{avgAccuracy} · 5</span>
                </div>
                <div className="flex justify-between">
                  <span>Communication</span>
                  <span>{avgCommunication} · 5</span>
                </div>
                <div className="flex justify-between">
                  <span>Location</span>
                  <span>{avgLocationScore} · 5</span>
                </div>
                <div className="flex justify-between">
                  <span>Value</span>
                  <span>{avgValue} · 5</span>
                </div>
              </div>
            )}

            {/* Sort buttons */}
            {reviews.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
                <span className="text-gray-600">Sort by:</span>
                <button
                  type="button"
                  onClick={() => setSortBy('newest')}
                  className={`px-3 py-1 rounded-full border ${
                    sortBy === 'newest'
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-800 border-gray-300'
                  }`}
                >
                  Newest
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('highest')}
                  className={`px-3 py-1 rounded-full border ${
                    sortBy === 'highest'
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-800 border-gray-300'
                  }`}
                >
                  Highest rating
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('lowest')}
                  className={`px-3 py-1 rounded-full border ${
                    sortBy === 'lowest'
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-800 border-gray-300'
                  }`}
                >
                  Lowest rating
                </button>
              </div>
            )}

            {/* Leave a review button */}
            <button
              onClick={() => setShowReviewForm(true)}
              className="mb-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold"
            >
              Leave a Review
            </button>

            {/* Blind review form */}
            {showReviewForm && (
              <div className="mb-6 border rounded-xl p-4 bg-white shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Your rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className={`text-2xl ${
                        star <= newRating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                {/* Category selects + hints */}
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <label className="block font-medium mb-1">
                      Cleanliness
                    </label>
                    <p className="text-xs text-gray-500 mb-1">
                      Was the place clean and tidy?
                    </p>
                    <select
                      value={cleanliness}
                      onChange={(e) => setCleanliness(Number(e.target.value))}
                      className="w-full border rounded px-2 py-1"
                    >
                      <option value={0}>Select</option>
                      {[1, 2, 3, 4, 5].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Accuracy
                    </label>
                    <p className="text-xs text-gray-500 mb-1">
                      Did the listing match the photos and description?
                    </p>
                    <select
                      value={accuracy}
                      onChange={(e) => setAccuracy(Number(e.target.value))}
                      className="w-full border rounded px-2 py-1"
                    >
                      <option value={0}>Select</option>
                      {[1, 2, 3, 4, 5].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Communication
                    </label>
                    <p className="text-xs text-gray-500 mb-1">
                      Was the host responsive and helpful?
                    </p>
                    <select
                      value={communication}
                      onChange={(e) =>
                        setCommunication(Number(e.target.value))
                      }
                      className="w-full border rounded px-2 py-1"
                    >
                      <option value={0}>Select</option>
                      {[1, 2, 3, 4, 5].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Location</label>
                    <p className="text-xs text-gray-500 mb-1">
                      Was the area convenient and as expected?
                    </p>
                    <select
                      value={locationScore}
                      onChange={(e) =>
                        setLocationScore(Number(e.target.value))
                      }
                      className="w-full border rounded px-2 py-1"
                    >
                      <option value={0}>Select</option>
                      {[1, 2, 3, 4, 5].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Value</label>
                    <p className="text-xs text-gray-500 mb-1">
                      Did the stay feel worth the price?
                    </p>
                    <select
                      value={valueScore}
                      onChange={(e) => setValueScore(Number(e.target.value))}
                      className="w-full border rounded px-2 py-1"
                    >
                      <option value={0}>Select</option>
                      {[1, 2, 3, 4, 5].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience (your name will not be shown)..."
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewForm(false);
                      setNewRating(0);
                      setNewComment('');
                      setCleanliness(0);
                      setAccuracy(0);
                      setCommunication(0);
                      setLocationScore(0);
                      setValueScore(0);
                    }}
                    className="px-4 py-2 text-sm border rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitReview}
                    className="px-4 py-2 text-sm bg-primary text-white rounded-lg disabled:opacity-60"
                    disabled={
                      !newRating ||
                      !newComment.trim() ||
                      !cleanliness ||
                      !accuracy ||
                      !communication ||
                      !locationScore ||
                      !valueScore
                    }
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}

            {/* Existing reviews list */}
            <div className="grid md:grid-cols-2 gap-6">
              {sortedReviews.slice(0, 6).map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
            {reviews.length > 6 && (
              <button className="mt-6 border border-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
                Show all {reviews.length} reviews
              </button>
            )}
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 border border-gray-300 rounded-xl p-6 shadow-xl">
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-bold">
                ${property.pricePerNight}
              </span>
              <span className="text-gray-600">/ night</span>
            </div>

            {/* Date Picker */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="border rounded-lg p-3">
                <label className="text-xs font-semibold uppercase">
                  Check-in
                </label>
                <DatePicker
                  selected={checkIn}
                  onChange={(date) => setCheckIn(date)}
                  selectsStart
                  startDate={checkIn}
                  endDate={checkOut}
                  minDate={new Date()}
                  excludeDates={blockedDates}
                  placeholderText="Add date"
                  className="w-full outline-none"
                />
              </div>
              <div className="border rounded-lg p-3">
                <label className="text-xs font-semibold uppercase">
                  Check-out
                </label>
                <DatePicker
                  selected={checkOut}
                  onChange={(date) => setCheckOut(date)}
                  selectsEnd
                  startDate={checkIn}
                  endDate={checkOut}
                  minDate={checkIn}
                  excludeDates={blockedDates}
                  placeholderText="Add date"
                  className="w-full outline-none"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="border rounded-lg p-3 mb-6">
              <label className="text-xs font-semibold uppercase block mb-1">
                Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full outline-none"
              >
                {[...Array(property.guests)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} guest{i + 1 > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Status */}
            {checkIn && checkOut && (
              <div
                className={`mb-4 p-3 rounded-lg ${
                  isAvailable
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {isAvailable
                  ? '✓ Available for selected dates'
                  : '✗ Not available - choose different dates'}
              </div>
            )}

            {/* Price Breakdown */}
            {checkIn && checkOut && days > 0 && (
              <div className="mb-6 space-y-3">
                <div className="flex justify-between">
                  <span className="underline">
                    ${property.pricePerNight} × {days} nights
                  </span>
                  <span>${property.pricePerNight * days}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Service fee</span>
                  <span>
                    ${(property.pricePerNight * days * 0.1).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Cleaning fee</span>
                  <span>$50</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleBooking}
              disabled={!checkIn || !checkOut || !isAvailable}
              className={`w-full py-4 rounded-lg font-semibold text-white text-lg transition ${
                checkIn && checkOut && isAvailable
                  ? 'bg-primary hover:bg-primary/90'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {!user
                ? 'Login to Book'
                : checkIn && checkOut
                ? 'Reserve'
                : 'Select Dates'}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              You won't be charged yet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const getAmenityIcon = (amenity) => {
  const icons = {
    WiFi: '📶',
    Pool: '🏊',
    Kitchen: '🍳',
    Parking: '🅿️',
    'Beach access': '🏖️',
    Gym: '💪',
  };
  return icons[amenity] || '✓';
};

export default PropertyDetails;
