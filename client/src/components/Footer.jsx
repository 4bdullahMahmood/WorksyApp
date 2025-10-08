import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-blue-400">Worksy</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Connecting customers with trusted tradesmen, contractors, and handymen. 
              Find the right professional for your home improvement needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search" className="text-gray-300 hover:text-white transition-colors">
                  Find Services
                </Link>
              </li>
              <li>
                <Link href="/provider" className="text-gray-300 hover:text-white transition-colors">
                  Become a Provider
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search?category=plumbing" className="text-gray-300 hover:text-white transition-colors">
                  Plumbing
                </Link>
              </li>
              <li>
                <Link href="/search?category=electrical" className="text-gray-300 hover:text-white transition-colors">
                  Electrical
                </Link>
              </li>
              <li>
                <Link href="/search?category=hvac" className="text-gray-300 hover:text-white transition-colors">
                  HVAC
                </Link>
              </li>
              <li>
                <Link href="/search?category=cleaning" className="text-gray-300 hover:text-white transition-colors">
                  Cleaning
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">support@worksy.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">1-800-WORKSY</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">Available Nationwide</span>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 Worksy. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
