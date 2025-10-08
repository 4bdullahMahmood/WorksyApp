'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Star, MapPin, Clock, DollarSign, MessageCircle, Calendar, Phone, Mail, Shield, CheckCircle } from 'lucide-react';
import Button from '@/components/Button';
import { api } from '@/utils/api';

export default function ServiceDetailPage() {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    scheduledDate: '',
    scheduledTime: '',
    address: '',
    phone: '',
    notes: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  
  const params = useParams();
  const serviceId = params.id;

  useEffect(() => {
    if (serviceId) {
      loadService();
    }
  }, [serviceId]);

  const loadService = async () => {
    try {
      setLoading(true);
      const serviceData = await api.services.get(serviceId);
      setService(serviceData);
    } catch (error) {
      console.error('Error loading service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!service) return;

    try {
      setBookingLoading(true);
      await api.bookings.create({
        serviceId: service.id,
        customerId: 'current-user-id', // This would come from auth context
        providerId: service.providerId,
        customerName: 'Current User', // This would come from auth context
        providerName: service.providerName,
        serviceTitle: service.title,
        price: service.price,
        scheduledDate: bookingData.scheduledDate,
        scheduledTime: bookingData.scheduledTime,
        address: bookingData.address,
        phone: bookingData.phone,
        notes: bookingData.notes
      });
      
      alert('Booking request sent successfully!');
      setShowBookingForm(false);
      setBookingData({
        scheduledDate: '',
        scheduledTime: '',
        address: '',
        phone: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-5 w-5 text-yellow-400 fill-current opacity-50" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8">The service you're looking for doesn't exist.</p>
          <Button href="/search">Browse Services</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Service Images */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.images && service.images.length > 0 ? (
                  service.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${service.title} ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))
                ) : (
                  <div className="col-span-2 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-lg">No images available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {service.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{service.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">
                    ${service.price}
                  </div>
                  <div className="text-sm text-gray-500">starting price</div>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{service.description}</p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {renderStars(service.rating)}
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {service.rating.toFixed(1)}
                </span>
                <span className="text-gray-600">
                  ({service.reviewCount} reviews)
                </span>
              </div>
              
              {/* Sample Reviews */}
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div>
                      <div className="font-medium text-gray-900">John D.</div>
                      <div className="flex items-center space-x-1">
                        {renderStars(5)}
                        <span className="text-sm text-gray-500">2 days ago</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    Excellent work! Professional and on time. Highly recommend.
                  </p>
                </div>
                
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div>
                      <div className="font-medium text-gray-900">Sarah M.</div>
                      <div className="flex items-center space-x-1">
                        {renderStars(4)}
                        <span className="text-sm text-gray-500">1 week ago</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    Great service, fair pricing. Will definitely use again.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Provider Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-lg">
                    {service.providerName.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{service.providerName}</div>
                  <div className="text-sm text-gray-600">Verified Professional</div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Background Checked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Licensed & Insured</span>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book This Service</h3>
              
              {!showBookingForm ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      ${service.price}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">starting price</div>
                  </div>
                  
                  <Button
                    onClick={() => setShowBookingForm(true)}
                    className="w-full"
                  >
                    Book Now
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message Provider
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingData.scheduledDate}
                      onChange={(e) => setBookingData({...bookingData, scheduledDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Time
                    </label>
                    <select
                      required
                      value={bookingData.scheduledTime}
                      onChange={(e) => setBookingData({...bookingData, scheduledTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select time</option>
                      <option value="morning">Morning (8AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 5PM)</option>
                      <option value="evening">Evening (5PM - 8PM)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Address
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={bookingData.address}
                      onChange={(e) => setBookingData({...bookingData, address: e.target.value})}
                      placeholder="Enter the address where service is needed"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                      placeholder="Your phone number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      rows={3}
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                      placeholder="Any specific requirements or details"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      type="submit"
                      loading={bookingLoading}
                      className="flex-1"
                    >
                      Send Booking Request
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowBookingForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
