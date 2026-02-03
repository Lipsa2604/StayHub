import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PropertyListing from './pages/PropertyListing';
import PropertyDetails from './pages/PropertyDetails';
import UserDashboard from './pages/UserDashboard';
import HostDashboard from './pages/HostDashboard';
import PaymentPage from './pages/PaymentPage';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<PropertyListing />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/host-dashboard" element={<HostDashboard />} />

          <Route path="/payment/:bookingId" element={<PaymentPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
