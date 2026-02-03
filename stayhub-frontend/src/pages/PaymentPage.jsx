import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { bookingAPI } from '../services/api';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await bookingAPI.getById(bookingId);
        setBooking(response.data);
      } catch (error) {
        console.error('Error fetching booking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Booking not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Payment</h1>
        <p className="text-gray-700 mb-4">
          Stripe is not configured yet. Once you add your Stripe publishable key, we will enable
          card payments here.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm">
          <p className="font-semibold mb-1">Booking Summary</p>
          <p>Property: {booking.property?.title}</p>
          <p>
            Dates:{' '}
            {new Date(booking.checkIn).toLocaleDateString()} -{' '}
            {new Date(booking.checkOut).toLocaleDateString()}
          </p>
          <p>Total: ${booking.totalPrice.toFixed(2)}</p>
        </div>
        <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold">
          Continue
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
