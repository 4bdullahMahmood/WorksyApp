const API_BASE_URL = '/api';

export const api = {
  // Users API
  users: {
    get: (id) => fetch(`${API_BASE_URL}/users/${id}`).then(res => res.json()),
    create: (userData) => fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }).then(res => res.json()),
    update: (id, userData) => fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }).then(res => res.json()),
    delete: (id) => fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE'
    }).then(res => res.json())
  },

  // Services API
  services: {
    getAll: async (filters = {}) => {
      try {
        const params = new URLSearchParams(filters);
        const response = await fetch(`${API_BASE_URL}/services?${params}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching services:', error);
        return [];
      }
    },
    get: (id) => fetch(`${API_BASE_URL}/services/${id}`).then(res => res.json()),
    create: (serviceData) => fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData)
    }).then(res => res.json()),
    update: (id, serviceData) => fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData)
    }).then(res => res.json()),
    delete: (id) => fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'DELETE'
    }).then(res => res.json())
  },

  // Bookings API
  bookings: {
    getAll: (userId) => fetch(`${API_BASE_URL}/bookings?userId=${userId}`).then(res => res.json()),
    get: (id) => fetch(`${API_BASE_URL}/bookings/${id}`).then(res => res.json()),
    create: (bookingData) => fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    }).then(res => res.json()),
    update: (id, bookingData) => fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    }).then(res => res.json()),
    delete: (id) => fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'DELETE'
    }).then(res => res.json())
  },

  // Messages API
  messages: {
    getChat: (chatId) => fetch(`${API_BASE_URL}/messages?chatId=${chatId}`).then(res => res.json()),
    send: (messageData) => fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData)
    }).then(res => res.json())
  },

  // AI API
  ai: {
    chat: (message) => fetch(`${API_BASE_URL}/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    }).then(res => res.json()),
    suggestServices: (description) => fetch(`${API_BASE_URL}/ai/suggest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description })
    }).then(res => res.json())
  }
};
