import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaCalendar, FaHeart, FaCreditCard, FaCog } from 'react-icons/fa';

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getMyBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await reviewAPI.create({
        bookingId: selectedBooking._id,
        propertyId: selectedBooking.property._id,
        rating: review.rating,
        comment: review.comment,
      });
      alert('Review submitted successfully!');
      setShowReviewModal(false);
      setReview({ rating: 5, comment: '' });
      fetchBookings();
    } catch (error) {
      alert('Failed to submit review');
    }
  };

  const upcomingTrips = bookings.filter(
    (b) => b.status === 'confirmed' && new Date(b.checkIn) >= new Date()
  );
  const pastTrips = bookings.filter(
    (b) => b.status === 'completed' || new Date(b.checkOut) < new Date()
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Dashboard</h1>
        <p className="text-gray-600 mb-8">Manage your bookings and account settings</p>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
                  {user?.name?.[0] || 'U'}
                </div>
                <h3 className="text-xl font-bold">{user?.name || 'User'}</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'bookings' ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-gray-100'
                  }`}
                >
                  <FaCalendar /> My Bookings
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'favorites' ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-gray-100'
                  }`}
                >
                  <FaHeart /> Favorites
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'payments' ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-gray-100'
                  }`}
                >
                  <FaCreditCard /> Payments
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'settings' ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-gray-100'
                  }`}
                >
                  <FaCog /> Settings
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {activeTab === 'bookings' && (
              <div>
                {/* Upcoming Trips */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Upcoming Trips</h2>
                  {upcomingTrips.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center">
                      <p className="text-gray-600 mb-4">No upcoming trips</p>
                      <Link to="/properties" className="text-primary underline">
                        Start planning your next adventure
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingTrips.map((booking) => (
                        <div key={booking._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <img
                              src={booking.property.images?.[0] || '/placeholder.jpg'}
                              alt={booking.property.title}
                              className="w-full md:w-48 h-48 object-cover"
                            />
                            <div className="flex-1 p-6">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="text-xl font-bold mb-1">{booking.property.title}</h3>
                                  <p className="text-gray-600">{booking.property.location}</p>
                                </div>
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                                  {booking.status}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                <div>
                                  <span className="text-gray-600">Check-in:</span>
                                  <p className="font-semibold">{new Date(booking.checkIn).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Check-out:</span>
                                  <p className="font-semibold">{new Date(booking.checkOut).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Guests:</span>
                                  <p className="font-semibold">{booking.guests} guests</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Total Price:</span>
                                  <p className="font-semibold">${booking.totalPrice.toFixed(2)}</p>
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <Link
                                  to={`/properties/${booking.property._id}`}
                                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                                >
                                  View Details
                                </Link>
                                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                                  Contact Host
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Past Trips */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">Past Trips</h2>
                  {pastTrips.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center">
                      <p className="text-gray-600">No past trips yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pastTrips.map((booking) => (
                        <div key={booking._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <img
                              src={booking.property.images?.[0] || '/placeholder.jpg'}
                              alt={booking.property.title}
                              className="w-full md:w-48 h-48 object-cover"
                            />
                            <div className="flex-1 p-6">
                              <h3 className="text-xl font-bold mb-2">{booking.property.title}</h3>
                              <p className="text-gray-600 mb-4">
                                {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                              </p>
                              {!booking.reviewed && (
                                <button
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setShowReviewModal(true);
                                  }}
                                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                                >
                                  Write a Review
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="bg-white rounded-xl p-8 text-center">
                <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
                <p className="text-gray-600 mb-4">Start adding properties to your favorites</p>
                <Link to="/properties" className="text-primary underline">
                  Explore properties
                </Link>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="bg-white rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6">Payment Methods</h2>
                <div className="border border-gray-300 rounded-lg p-4 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <FaCreditCard className="text-3xl text-gray-400" />
                    <div>
                      <p className="font-semibold">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-600">Expires 12/25</p>
                    </div>
                  </div>
                  <button className="text-primary hover:underline">Edit</button>
                </div>
                <button className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 text-gray-600 hover:bg-gray-50">
                  + Add Payment Method
                </button>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 font-semibold">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Write a Review</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-2xl">×</button>
            </div>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReview({ ...review, rating: star })}
                      className="text-3xl"
                    >
                      {star <= review.rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Your Review</label>
                <textarea
                  value={review.comment}
                  onChange={(e) => setReview({ ...review, comment: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="Share your experience..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 font-semibold"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
