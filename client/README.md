# Worksy - Find Trusted Contractors Near You

A complete, production-ready web application that connects customers with tradesmen, contractors, and handymen. Built with Next.js 14, Firebase, and OpenAI integration.

## 🚀 Features

### For Customers
- **Smart Search**: Find services by category, location, and price range
- **AI Assistant**: Get personalized service recommendations using OpenAI
- **Real-time Chat**: Communicate with service providers
- **Booking System**: Schedule appointments with verified professionals
- **Reviews & Ratings**: Read feedback from other customers

### For Service Providers
- **Service Management**: Create and manage service listings
- **Booking Dashboard**: Track and manage customer bookings
- **Performance Analytics**: Monitor ratings, earnings, and response times
- **AI-Powered Support**: Get business growth tips from AI assistant

### Core Features
- **Firebase Authentication**: Email/password and Google Sign-In
- **Real-time Database**: Firestore for data storage
- **File Storage**: Firebase Storage for images
- **AI Integration**: OpenAI GPT-4 for smart recommendations
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Modern UI**: Clean, professional interface

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **AI**: OpenAI GPT-4o-mini
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Firebase project set up
- An OpenAI API key
- Git installed

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd WorksyApp/client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable the following services:
   - **Authentication** (Email/Password + Google)
   - **Firestore Database**
   - **Storage**

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here
```

### 5. Set Up Firestore Collections

Create the following collections in Firestore:

```javascript
// Collections to create:
- users
- services  
- bookings
- messages
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
client/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── users/         # User management
│   │   │   ├── services/      # Service listings
│   │   │   ├── bookings/      # Booking system
│   │   │   ├── messages/      # Chat system
│   │   │   └── ai/           # AI integration
│   │   ├── dashboard/         # Customer dashboard
│   │   ├── provider/          # Provider dashboard
│   │   ├── search/           # Service search
│   │   ├── service/[id]/     # Service details
│   │   ├── login/            # Authentication
│   │   ├── signup/           # User registration
│   │   └── layout.js         # Root layout
│   ├── components/           # Reusable components
│   │   ├── Navbar.jsx        # Navigation
│   │   ├── Footer.jsx        # Footer
│   │   ├── SearchBar.jsx    # Search functionality
│   │   ├── ServiceCard.jsx   # Service display
│   │   ├── ChatBox.jsx       # Chat interface
│   │   ├── MessageBubble.jsx # Message display
│   │   └── Button.jsx        # Button component
│   ├── lib/
│   │   └── firebase.js       # Firebase configuration
│   └── utils/
│       └── api.js            # API utilities
├── public/                   # Static assets
├── .env.local               # Environment variables
└── package.json
```

## 🔧 API Endpoints

### Users API (`/api/users`)
- `GET /api/users` - Get all users
- `GET /api/users?id=userId` - Get specific user
- `POST /api/users` - Create new user
- `PUT /api/users?id=userId` - Update user
- `DELETE /api/users?id=userId` - Delete user

### Services API (`/api/services`)
- `GET /api/services` - Get all services (with filters)
- `POST /api/services` - Create new service
- `PUT /api/services?id=serviceId` - Update service
- `DELETE /api/services?id=serviceId` - Delete service

### Bookings API (`/api/bookings`)
- `GET /api/bookings?userId=userId` - Get user bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings?id=bookingId` - Update booking
- `DELETE /api/bookings?id=bookingId` - Delete booking

### Messages API (`/api/messages`)
- `GET /api/messages?chatId=chatId` - Get chat messages
- `POST /api/messages` - Send message

### AI API (`/api/ai`)
- `POST /api/ai` - Chat with AI assistant
- `POST /api/ai/suggest` - Get service suggestions

## 🎨 UI Components

### Core Components
- **Navbar**: Responsive navigation with authentication
- **Footer**: Links and contact information
- **SearchBar**: Advanced search with filters
- **ServiceCard**: Service display with ratings and pricing
- **ChatBox**: Real-time messaging interface
- **Button**: Reusable button component with variants

### Pages
- **Homepage**: Hero section, featured services, categories
- **Search**: Filterable service listings
- **Service Detail**: Individual service pages with booking
- **Dashboard**: Customer dashboard with bookings and messages
- **Provider Dashboard**: Service provider management
- **Authentication**: Login and signup pages

## 🔐 Authentication Flow

1. **Sign Up**: Users choose between Customer or Provider
2. **Email/Password**: Standard authentication
3. **Google Sign-In**: OAuth integration
4. **Profile Creation**: Additional user information
5. **Dashboard Redirect**: Based on user type

## 🤖 AI Integration

### OpenAI Features
- **Smart Search**: Natural language service discovery
- **Service Recommendations**: AI-powered suggestions
- **Chat Assistant**: Help with service selection
- **Provider Support**: Business growth tips

### Usage
```javascript
// Example AI chat
const response = await api.ai.chat("I need help with my plumbing");
const suggestions = await api.ai.suggestServices("leaky faucet");
```

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- TailwindCSS utility classes
- Responsive grid layouts
- Touch-friendly interfaces
- Optimized for all screen sizes

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Connect to Vercel**:
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Environment Variables**: Add all environment variables in Vercel dashboard

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Alternative: Deploy to Netlify

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `.next`
   - Add environment variables

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Structure

- **Components**: Reusable UI components
- **Pages**: Next.js App Router pages
- **API Routes**: Backend API endpoints
- **Utils**: Helper functions and API calls
- **Lib**: Third-party service configurations

## 🧪 Testing

### Manual Testing Checklist

1. **Authentication**:
   - [ ] Sign up as customer
   - [ ] Sign up as provider
   - [ ] Google sign-in
   - [ ] Login/logout

2. **Service Management**:
   - [ ] Create service listing
   - [ ] Edit service details
   - [ ] Delete service
   - [ ] Search and filter services

3. **Booking System**:
   - [ ] Book a service
   - [ ] View bookings
   - [ ] Update booking status
   - [ ] Cancel booking

4. **Chat System**:
   - [ ] Send messages
   - [ ] AI assistant chat
   - [ ] Real-time updates

5. **AI Features**:
   - [ ] Service recommendations
   - [ ] Natural language search
   - [ ] Chat assistance

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Issues**:
   - Check environment variables
   - Verify Firebase project settings
   - Ensure services are enabled

2. **OpenAI API Errors**:
   - Verify API key is correct
   - Check API usage limits
   - Ensure proper error handling

3. **Build Errors**:
   - Clear `.next` folder
   - Reinstall dependencies
   - Check for TypeScript errors

### Debug Mode

Enable debug logging:
```javascript
// In your environment variables
DEBUG=true
```

## 📈 Performance Optimization

- **Image Optimization**: Next.js automatic optimization
- **Code Splitting**: Automatic with Next.js
- **Caching**: API response caching
- **Lazy Loading**: Component lazy loading
- **Bundle Analysis**: Use `npm run build` to analyze bundle size

## 🔒 Security Considerations

- **Environment Variables**: Never commit `.env.local`
- **API Keys**: Use server-side only for sensitive keys
- **Firebase Rules**: Set up proper Firestore security rules
- **Input Validation**: Validate all user inputs
- **Authentication**: Implement proper auth checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting section

## 🎯 Future Enhancements

- **Payment Integration**: Stripe/PayPal integration
- **Push Notifications**: Real-time notifications
- **Mobile App**: React Native version
- **Advanced Analytics**: Detailed performance metrics
- **Multi-language Support**: Internationalization
- **Video Calls**: Integrated video chat
- **Calendar Integration**: Google/Outlook calendar sync

---

**Built with ❤️ using Next.js, Firebase, and OpenAI**