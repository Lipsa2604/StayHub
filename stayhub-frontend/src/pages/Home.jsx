import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaAward, FaHeadset } from 'react-icons/fa';

const Home = () => {
  const categories = [
    { name: 'Beachfront', count: '450+' },
    { name: 'City Center', count: '320+' },
    { name: 'Mountain', count: '180+' },
    { name: 'Countryside', count: '240+' },
    { name: 'Lakefront', count: '160+' },
    { name: 'Desert', count: '95+' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center text-white">
        <div className="text-center z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Find Your Perfect Stay
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Discover amazing places to stay around the world
          </p>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Start Exploring
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/properties?category=${category.name.toLowerCase()}`}
              className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <h3 className="text-2xl font-bold mb-2">{category.count}</h3>
              <p className="text-gray-600">{category.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose StayHub */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose StayHub</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 text-center shadow-md">
              <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-primary text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Booking</h3>
              <p className="text-gray-600">
                Your payments are safe with our encrypted booking system
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-md">
              <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaAward className="text-secondary text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Best Price Guarantee</h3>
              <p className="text-gray-600">
                Find the same property cheaper? We'll match the price
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-md">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeadset className="text-accent text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Our customer service team is always here to help
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
