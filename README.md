# HopTrip - Travel Planning App

A comprehensive travel planning application built with Expo and React Native, featuring trip management, itinerary planning, expense tracking, and collaborative travel planning.

## Features

### 🎯 Core Features
- **Trip Management** - Create, edit, and manage travel trips
- **Itinerary Planning** - Day-by-day activity scheduling
- **Expense Tracking** - Budget management and expense splitting
- **Places Discovery** - Search and save places to visit
- **Collaborative Planning** - Invite travelers and plan together

### 🔧 Technical Features
- **Modern Architecture** - Built with Expo Router and TypeScript
- **Real-time Data** - MongoDB backend with REST API
- **Google Integration** - Places API and Maps integration
- **Authentication** - Google OAuth with JWT tokens
- **Cross-platform** - Works on iOS, Android, and Web

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- Expo CLI
- MongoDB database
- Google Cloud Platform account (for APIs)

### 1. Clone and Install
```bash
git clone <repository-url>
cd hoptrip
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Fill in your API keys and configuration:

```env
# Google Services API Keys
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here

# Backend Configuration
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000
EXPO_PUBLIC_MONGODB_URI=your_mongodb_connection_string_here
EXPO_PUBLIC_JWT_SECRET=your_jwt_secret_here

# Email Service (for trip invitations)
EXPO_PUBLIC_EMAIL_USER=your_email_address_here
EXPO_PUBLIC_EMAIL_PASS=your_email_app_password_here
```

### 3. Google Cloud Setup

#### Enable APIs
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Places API
   - Maps JavaScript API
   - Geocoding API

#### Get API Keys
1. Go to "Credentials" in Google Cloud Console
2. Create API Key for Places/Maps APIs
3. Create OAuth 2.0 Client ID for authentication
4. Configure authorized domains/redirect URIs

#### Configure OAuth
For web: Add your domain to authorized origins
For mobile: Follow [Expo Auth Session setup](https://docs.expo.dev/guides/authentication/#google)

### 4. Backend Setup
The backend is in the `/api` directory:

```bash
cd api
npm install
```

Configure MongoDB connection in `api/index.js`:
```javascript
mongoose.connect('your_mongodb_connection_string');
```

Start the backend:
```bash
npm start
```

### 5. Start the App
```bash
npm start
```

## API Integration Guide

### Google Places API
The app uses Google Places API for:
- Place search and autocomplete
- Place details and photos
- Nearby places discovery

**Implementation**: See `services/googlePlaces.ts`

### Google Authentication
OAuth flow for user authentication:
- Web: Google Identity Services
- Mobile: expo-auth-session

**Implementation**: See `services/auth.ts`

### Backend API
RESTful API for:
- Trip CRUD operations
- User management
- Expense tracking
- Email invitations

**Implementation**: See `services/api.ts`

## Project Structure

```
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab navigation
│   ├── trip/              # Trip-related screens
│   └── activity/          # Activity management
├── components/            # Reusable components
├── services/             # API and external services
├── contexts/             # React contexts
├── types/                # TypeScript definitions
└── api/                  # Backend server
```

## Development Notes

### Mock Data
The app includes mock data fallbacks for development:
- Mock Google Places responses
- Mock authentication
- Sample trip data

### Platform Compatibility
- **Web**: Full functionality with mock data fallbacks
- **iOS/Android**: Requires additional native setup for full features

### Production Deployment
1. Set up production MongoDB instance
2. Configure production API keys
3. Set up proper OAuth redirect URIs
4. Deploy backend to cloud service
5. Build and deploy mobile apps

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with proper TypeScript types
4. Test on multiple platforms
5. Submit pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check existing GitHub issues
2. Create new issue with detailed description
3. Include platform and error logs