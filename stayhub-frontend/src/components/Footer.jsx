import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">StayHub</h3>
            <p className="text-gray-400 text-sm">
              Your trusted platform for finding perfect accommodations worldwide.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="#" className="hover:text-white">About Us</Link></li>
              <li><Link to="#" className="hover:text-white">Careers</Link></li>
              <li><Link to="#" className="hover:text-white">Press</Link></li>
              <li><Link to="#" className="hover:text-white">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="#" className="hover:text-white">Help Center</Link></li>
              <li><Link to="#" className="hover:text-white">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-white">Safety</Link></li>
              <li><Link to="#" className="hover:text-white">Cancellation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-2xl hover:text-primary"><FaFacebook /></a>
              <a href="#" className="text-2xl hover:text-primary"><FaTwitter /></a>
              <a href="#" className="text-2xl hover:text-primary"><FaInstagram /></a>
              <a href="#" className="text-2xl hover:text-primary"><FaLinkedin /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 StayHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
