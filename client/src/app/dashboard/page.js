'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { api } from '@/utils/api';
import { Calendar, MessageCircle, Star, Clock, DollarSign, Plus, Search, Bell } from 'lucide-react';
import Button from '@/components/Button';
import ServiceCard from '@/components/ServiceCard';
import ChatBox from '@/components/ChatBox';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [recentServices, setRecentServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChat, setSelectedChat] = useState(null);
  
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadDashboardData(user.uid);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const loadDashboardData = async (userId) => {
    try {
      setLoading(true);
      
      // Load user's bookings
      const bookingsData = await api.bookings.getAll(userId);
      setBookings(bookingsData);
      
      // Load recent services (for recommendations)
      const servicesData = await api.services.getAll({ limit: 6 });
      setRecentServices(servicesData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBookingStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.displayName || user.email}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your services and bookings.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">{bookings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {bookings.filter(b => b.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${bookings.reduce((sum, b) => sum + (b.price || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', name: 'Overview', icon: Calendar },
                    { id: 'bookings', name: 'My Bookings', icon: Calendar },
                    { id: 'messages', name: 'Messages', icon: MessageCircle },
                    { id: 'reviews', name: 'Reviews', icon: Star }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Recent Bookings */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
                      {bookings.length > 0 ? (
                        <div className="space-y-3">
                          {bookings.slice(0, 3).map((booking) => (
                            <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <h4 className="font-medium text-gray-900">{booking.serviceTitle}</h4>
                                <p className="text-sm text-gray-600">
                                  {formatDate(booking.scheduledDate)} at {booking.scheduledTime}
                                </p>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBookingStatusColor(booking.status)}`}>
                                  {booking.status}
                                </span>
                                <span className="text-sm font-medium text-gray-900">${booking.price}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No bookings yet</p>
                          <Link href="/search" className="text-blue-600 hover:text-blue-500">
                            Browse services
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href="/search" className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                          <Search className="h-6 w-6 text-blue-600 mr-3" />
                          <div>
                            <h4 className="font-medium text-gray-900">Find Services</h4>
                            <p className="text-sm text-gray-600">Browse available services</p>
                          </div>
                        </Link>
                        <Link href="/dashboard/messages" className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                          <MessageCircle className="h-6 w-6 text-green-600 mr-3" />
                          <div>
                            <h4 className="font-medium text-gray-900">Messages</h4>
                            <p className="text-sm text-gray-600">Chat with providers</p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'bookings' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">All Bookings</h3>
                    {bookings.length > 0 ? (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{booking.serviceTitle}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBookingStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Provider:</span> {booking.providerName}
                              </div>
                              <div>
                                <span className="font-medium">Date:</span> {formatDate(booking.scheduledDate)}
                              </div>
                              <div>
                                <span className="font-medium">Time:</span> {booking.scheduledTime}
                              </div>
                              <div>
                                <span className="font-medium">Price:</span> ${booking.price}
                              </div>
                            </div>
                            {booking.notes && (
                              <div className="mt-2 text-sm text-gray-600">
                                <span className="font-medium">Notes:</span> {booking.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No bookings yet</p>
                        <Link href="/search">
                          <Button>Browse Services</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'messages' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Chat List */}
                      <div>
                        <div className="space-y-2">
                          <button
                            onClick={() => setSelectedChat('ai-assistant')}
                            className={`w-full text-left p-3 rounded-lg ${
                              selectedChat === 'ai-assistant' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-sm">AI</span>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">AI Assistant</h4>
                                <p className="text-sm text-gray-600">Get help finding services</p>
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Chat Box */}
                      <div>
                        <ChatBox 
                          chatId={selectedChat} 
                          currentUser={user}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h3>
                    <div className="text-center py-8">
                      <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No reviews yet</p>
                      <p className="text-sm text-gray-400">Reviews will appear here after service completion</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Recommended Services */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended for You</h3>
              <div className="space-y-4">
                {recentServices.slice(0, 3).map((service) => (
                  <div key={service.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-600 text-sm font-medium">
                        {service.category.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{service.title}</h4>
                      <p className="text-xs text-gray-600">{service.category}</p>
                      <p className="text-sm font-medium text-green-600">${service.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/search" className="block mt-4 text-center text-blue-600 hover:text-blue-500 text-sm">
                View all services
              </Link>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900">Welcome to Worksy!</p>
                    <p className="text-xs text-gray-600">Complete your profile to get started</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
