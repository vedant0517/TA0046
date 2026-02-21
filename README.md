# Care Connect - Frontend & Backend Integration

## Project Structure

```
care-connect/
├── frontend/               # React Frontend Application
│   ├── src/
│   │   ├── components/    # React Components
│   │   ├── pages/         # Application Pages
│   │   └── utils/         # Utility Functions & API Config
│   ├── public/
│   ├── package.json
│   └── node_modules/
│
└── backend/               # Node.js Express Backend API
    ├── data/              # Mock Data
    ├── models/            # Data Models
    ├── routes/            # API Routes
    ├── server.js          # Main Server File
    ├── package.json
    ├── .env              # Environment Variables
    └── node_modules/
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies (already done):
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

The backend server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Donations API
- `GET /api/donations` - Get all donations
- `GET /api/donations/pending` - Get pending donations
- `GET /api/donations/:id` - Get donation by ID
- `POST /api/donations` - Create new donation
- `PATCH /api/donations/:id/status` - Update donation status
- `POST /api/donations/:id/accept` - Accept donation (volunteer)
- `POST /api/donations/:id/decline` - Decline donation (volunteer)
- `PATCH /api/donations/:id/location` - Update donation location
- `POST /api/donations/:id/pickup` - Mark donation as picked up
- `POST /api/donations/:id/transit` - Mark donation in transit
- `POST /api/donations/:id/deliver` - Mark donation as delivered
- `DELETE /api/donations/all` - Clear all donations (testing)

### Volunteers API
- `GET /api/volunteers` - Get all needy people
- `GET /api/volunteers/:id` - Get needy person by ID
- `POST /api/volunteers/send-otp` - Send OTP to phone
- `POST /api/volunteers/verify-otp` - Verify OTP
- `GET /api/volunteers/verified/all` - Get all verified donations

### Organizations API
- `GET /api/organizations/profile` - Get organization profile
- `GET /api/organizations/needs` - Get organization needs/requests
- `POST /api/organizations/needs` - Create new need/request
- `PATCH /api/organizations/needs/:id` - Update need
- `DELETE /api/organizations/needs/:id` - Delete need

### AI Assistant API
- `GET /api/ai/ngos?location=<city>&area=<category>` - Get NGOs
- `GET /api/ai/hospitals?location=<city>&specialty=<type>` - Get hospitals
- `GET /api/ai/disasters?location=<city>&severity=<level>` - Get disaster zones
- `GET /api/ai/schools?location=<city>&type=<type>` - Get schools
- `POST /api/ai/query` - AI chatbot query

## Features Integration

### 1. Donor Dashboard
- Create donations with pickup details
- View donation history
- Track donation status in real-time
- Receive notifications on delivery

### 2. Volunteer Dashboard
- View available donations
- Accept/decline donation requests
- Update donation location during transit
- Complete delivery with OTP verification

### 3. Organization Dashboard
- View incoming donations
- Manage organization needs/requests
- Track verified donations
- View organization profile

### 4. AI Assistant
- Find NGOs by location and category
- Locate hospitals for organ donation
- Get disaster relief information
- Find schools needing support
- AI-powered chatbot responses

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Data Persistence

Currently, the backend uses **in-memory storage** for demonstration purposes. In production, integrate with:
- MongoDB for document storage
- PostgreSQL for relational data
- Redis for OTP storage and caching

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Testing the Integration

1. Start both backend and frontend servers
2. Open browser to `http://localhost:3000`
3. Test the following workflows:
   - **Donor**: Create a new donation
   - **Volunteer**: Accept and deliver donation with OTP
   - **Organization**: View donations and manage needs
   - **AI Assistant**: Query for NGOs, hospitals, etc.

## API Testing with curl

### Create Donation
```bash
curl -X POST http://localhost:5000/api/donations \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Food",
    "itemType": "Rice",
    "quantity": "10 kg",
    "pickupLocation": "Mumbai",
    "pickupTime": "2026-02-22T10:00:00"
  }'
```

### Get All Donations
```bash
curl http://localhost:5000/api/donations
```

### Send OTP
```bash
curl -X POST http://localhost:5000/api/volunteers/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "9876543210",
    "needyPersonId": "N001"
  }'
```

### AI Query
```bash
curl -X POST http://localhost:5000/api/ai/query \
  -H "Content-Type: application/json" \
  -d '{
    "question": "NGOs in Mumbai for child welfare"
  }'
```

## Production Deployment

### Backend
- Deploy to services like Heroku, AWS, or DigitalOcean
- Set up production database (MongoDB Atlas, AWS RDS)
- Configure environment variables
- Enable HTTPS
- Set up rate limiting and security headers

### Frontend
- Build production bundle: `npm run build`
- Deploy to Netlify, Vercel, or AWS S3
- Update API URL to production backend
- Enable CDN for static assets

## Security Considerations

1. **API Security**
   - Implement JWT authentication
   - Add rate limiting
   - Validate all inputs
   - Use HTTPS in production

2. **OTP Security**
   - Integrate real SMS service (Twilio, AWS SNS)
   - Implement OTP expiration (5 minutes)
   - Limit OTP attempts

3. **Data Protection**
   - Encrypt sensitive data
   - Implement CORS properly
   - Sanitize user inputs
   - Use environment variables for secrets

## Troubleshooting

### Backend not starting
- Check if port 5000 is available
- Verify all dependencies are installed
- Check for syntax errors in routes

### Frontend not connecting to backend
- Verify backend is running on port 5000
- Check CORS configuration
- Verify API_URL in frontend config

### API calls failing
- Check network tab in browser DevTools
- Verify request payload format
- Check backend console for errors

## Future Enhancements

1. **Authentication & Authorization**
   - User login/registration
   - Role-based access control
   - Session management

2. **Real-time Updates**
   - WebSocket integration
   - Live donation tracking
   - Push notifications

3. **Database Integration**
   - MongoDB for flexible schema
   - Redis for caching
   - File storage for images

4. **Advanced Features**
   - Payment gateway integration
   - Email notifications
   - SMS integration
   - Advanced analytics dashboard

## Support

For issues or questions:
- Check API documentation above
- Review error messages in console
- Test API endpoints with curl or Postman

---

**Happy Coding! 🚀**
