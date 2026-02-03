import React, { useState, useEffect } from 'react';
import { propertyAPI, bookingAPI } from '../services/api';
import { FaDollarSign, FaCalendar, FaHome, FaStar } from 'react-icons/fa';

const HostDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    activeProperties: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHostData();
  }, []);

  const fetchHostData = async () => {
    try {
      const [propertiesRes, bookingsRes] = await Promise.all([
        propertyAPI.getAll({ host: 'me' }),
        bookingAPI.getHostBookings(),
      ]);

      setProperties(propertiesRes.data);
      setBookings(bookingsRes.data);

      // Calculate stats
      const totalRevenue = bookingsRes.data.reduce((sum, b) => sum + b.totalPrice, 0);
      const avgRating = propertiesRes.data.reduce((sum, p) => sum + (p.rating || 0), 0) / propertiesRes.data.length;

      setStats({
        totalRevenue,
        totalBookings: bookingsRes.data.length,
        activeProperties: propertiesRes.data.length,
        averageRating: avgRating || 0,
      });
    } catch (error) {
      console.error('Error fetching host data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Host Dashboard</h1>
        <p className="text-gray-600">Manage your properties and track performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FaDollarSign className="text-4xl" />
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold mb-1">${stats.totalRevenue.toLocaleString()}</h3>
          <p className="text-blue-100">Total Revenue</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FaCalendar className="text-4xl" />
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.totalBookings}</h3>
          <p className="text-purple-100">Total Bookings</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FaHome className="text-4xl" />
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.activeProperties}</h3>
          <p className="text-pink-100">Active Properties</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FaStar className="text-4xl" />
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.averageRating.toFixed(1)}</h3>
          <p className="text-green-100">Average Rating</p>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Revenue Overview</h2>
        <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Chart visualization would go here</p>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Upcoming Bookings</h2>
        {bookings.filter(b => new Date(b.checkIn) >= new Date()).length === 0 ? (
          <p className="text-gray-600 text-center py-8">No upcoming bookings</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Guest</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Property</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Check-in</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Check-out</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bookings
                  .filter(b => new Date(b.checkIn) >= new Date())
                  .slice(0, 5)
                  .map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{booking.user?.name}</td>
                      <td className="px-4 py-3">{booking.property?.title}</td>
                      <td className="px-4 py-3">{new Date(booking.checkIn).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{new Date(booking.checkOut).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-semibold">${booking.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostDashboard;
