'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { api } from '@/utils/api';
import { Calendar, MessageCircle, Star, Clock, DollarSign, Plus, Users, TrendingUp, Settings } from 'lucide-react';
import Button from '@/components/Button';
import ServiceCard from '@/components/ServiceCard';
import ChatBox from '@/components/ChatBox';

export default function ProviderDashboard() {
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChat, setSelectedChat] = useState(null);
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    location: '',
    images: []
  });
  
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadProviderData(user.uid);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const loadProviderData = async (userId) => {
    try {
      setLoading(true);
      
      // Load provider's services
      const servicesData = await api.services.getAll({ providerId: userId });
      setServices(servicesData);
      
      // Load provider's bookings
      const bookingsData = await api.bookings.getAll(userId);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error loading provider data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await api.services.create({
        ...newService,
        providerId: user.uid,
        providerName: user.displayName || user.email,
        price: parseFloat(newService.price),
        availability: 'available',
        rating: 0,
        reviewCount: 0
      });
      
      // Reload services
      await loadProviderData(user.uid);
      setShowAddService(false);
      setNewService({
        title: '',
        description: '',
        category: '',
        price: '',
        location: '',
        images: []
      });
    } catch (error) {
      console.error('Error creating service:', error);
      alert('Failed to create service. Please try again.');
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
            Provider Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your services, bookings, and grow your business.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
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
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Services</p>
                <p className="text-2xl font-semibold text-gray-900">{services.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
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
                    { id: 'services', name: 'My Services', icon: Settings },
                    { id: 'bookings', name: 'Bookings', icon: Calendar },
                    { id: 'messages', name: 'Messages', icon: MessageCircle }
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
                                  {booking.customerName} • {formatDate(booking.scheduledDate)}
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
                          <p className="text-sm text-gray-400">Bookings will appear here when customers book your services</p>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() => setShowAddService(true)}
                          className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Plus className="h-6 w-6 text-blue-600 mr-3" />
                          <div>
                            <h4 className="font-medium text-gray-900">Add Service</h4>
                            <p className="text-sm text-gray-600">Create a new service listing</p>
                          </div>
                        </button>
                        <Link href="/provider/services" className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                          <Settings className="h-6 w-6 text-green-600 mr-3" />
                          <div>
                            <h4 className="font-medium text-gray-900">Manage Services</h4>
                            <p className="text-sm text-gray-600">Edit your service listings</p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'services' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">My Services</h3>
                      <Button onClick={() => setShowAddService(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Service
                      </Button>
                    </div>
                    
                    {services.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {services.map((service) => (
                          <ServiceCard key={service.id} service={service} showProvider={false} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No services yet</p>
                        <Button onClick={() => setShowAddService(true)}>
                          Create Your First Service
                        </Button>
                      </div>
                    )}
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
                                <span className="font-medium">Customer:</span> {booking.customerName}
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
                            <div className="mt-3 flex space-x-2">
                              <Button size="sm">Accept</Button>
                              <Button variant="outline" size="sm">Message</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No bookings yet</p>
                        <p className="text-sm text-gray-400">Bookings will appear here when customers book your services</p>
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
                                <p className="text-sm text-gray-600">Get help growing your business</p>
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
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Add Service Form */}
            {showAddService && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Service</h3>
                <form onSubmit={handleAddService} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Title
                    </label>
                    <input
                      type="text"
                      required
                      value={newService.title}
                      onChange={(e) => setNewService({...newService, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Professional House Cleaning"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newService.description}
                      onChange={(e) => setNewService({...newService, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your service..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      required
                      value={newService.category}
                      onChange={(e) => setNewService({...newService, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="hvac">HVAC</option>
                      <option value="carpentry">Carpentry</option>
                      <option value="painting">Painting</option>
                      <option value="flooring">Flooring</option>
                      <option value="roofing">Roofing</option>
                      <option value="landscaping">Landscaping</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="general-handyman">General Handyman</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      required
                      value={newService.price}
                      onChange={(e) => setNewService({...newService, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Area
                    </label>
                    <input
                      type="text"
                      required
                      value={newService.location}
                      onChange={(e) => setNewService({...newService, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., New York, NY"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button type="submit" className="flex-1">
                      Create Service
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowAddService(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="text-sm font-medium text-green-600">2 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="text-sm font-medium text-green-600">98%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
