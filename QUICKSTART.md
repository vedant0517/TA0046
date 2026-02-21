# Care Connect - Quick Start Guide

## ✅ Integration Complete!

Your Care Connect application now has a fully functional backend API integrated with the React frontend.

## 🚀 How to Run

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Backend will run on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend will run on: http://localhost:3000

### Option 2: Quick Start Script

Create a file `start.ps1` in the root directory:
```powershell
# Start backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start"

# Wait for backend to start
Start-Sleep -Seconds 3

# Start frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start"
```

Then run: `.\start.ps1`

## 📡 API Status

✅ **Backend API Running**: http://localhost:5000
✅ **Donations API**: Working
✅ **Volunteers API**: Working  
✅ **Organizations API**: Working
✅ **AI Assistant API**: Working

## 🧪 Test the APIs

### Test Donations API
```bash
curl http://localhost:5000/api/donations
```

### Test Create Donation
```powershell
$body = @{
    category = "Food"
    itemType = "Rice"
    quantity = "10 kg"
    pickupLocation = "123 Main St, Mumbai"
    pickupTime = "2026-02-22T10:00:00"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/donations" -Body $body -ContentType "application/json"
```

### Test AI Query
```powershell
$query = @{
    question = "NGOs in Mumbai for child welfare"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/ai/query" -Body $query -ContentType "application/json"
```

## 📋 What Changed

### Backend Created:
- ✅ Express server with REST API
- ✅ Donation management endpoints
- ✅ Volunteer and OTP verification system
- ✅ Organization dashboard APIs
- ✅ AI assistant with NGO/Hospital/School data
- ✅ In-memory data storage (ready for database)

### Frontend Updated:
- ✅ API configuration file (`apiConfig.js`)
- ✅ Updated `donationManager.js` to use backend APIs
- ✅ All functions now async/await based
- ✅ Error handling for API calls

## 🎯 Features Working

1. **Donor Dashboard**
   - Create donations → Saves to backend
   - View donations → Fetches from backend
   - Real-time status updates

2. **Volunteer Dashboard**
   - View available donations from API
   - Accept/decline donations via API
   - OTP verification through backend

3. **Organization Dashboard**
   - View incoming donations from API
   - Manage needs and requests
   - Track verified donations

4. **AI Assistant**
   - Query NGOs, hospitals, disaster zones
   - Get AI-powered responses
   - All data served from backend

## 🔌 API Endpoints Overview

### Donations
- `GET /api/donations` - Get all
- `POST /api/donations` - Create new
- `POST /api/donations/:id/accept` - Accept
- `POST /api/donations/:id/pickup` - Pickup
- `POST /api/donations/:id/deliver` - Deliver

### Volunteers
- `GET /api/volunteers` - Get needy people
- `POST /api/volunteers/send-otp` - Send OTP
- `POST /api/volunteers/verify-otp` - Verify OTP
- `GET /api/volunteers/verified/all` - Get verified

### Organizations
- `GET /api/organizations/profile` - Get profile
- `GET /api/organizations/needs` - Get needs
- `POST /api/organizations/needs` - Create need

### AI Assistant
- `GET /api/ai/ngos` - Get NGOs
- `GET /api/ai/hospitals` - Get hospitals
- `GET /api/ai/disasters` - Get disasters
- `GET /api/ai/schools` - Get schools
- `POST /api/ai/query` - AI query

## 📦 Project Structure

```
care connect/
├── frontend/              # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   │       ├── apiConfig.js      ← NEW! API configuration
│   │       ├── donationManager.js ← UPDATED! Uses API
│   │       └── aiConfig.js
│   └── package.json
│
├── backend/              # ← NEW! Express API
│   ├── data/
│   │   └── careConnectData.js
│   ├── models/
│   │   ├── Donation.js
│   │   ├── VerifiedDonation.js
│   │   └── NeedyPerson.js
│   ├── routes/
│   │   ├── donations.js
│   │   ├── volunteers.js
│   │   ├── organizations.js
│   │   └── ai.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md            # Full documentation
```

## 🔄 Next Steps

### Immediate:
1. Start both servers (backend & frontend)
2. Test creating a donation in frontend
3. Verify data is saved in backend
4. Test OTP verification workflow

### Future Enhancements:
1. Add MongoDB database
2. Implement authentication (JWT)
3. Add real SMS service for OTP
4. Deploy to cloud (Heroku + Netlify)
5. Add real-time updates with WebSockets

## 🐛 Troubleshooting

**Backend not starting?**
- Check if port 5000 is free
- Run: `netstat -ano | findstr :5000`
- Kill process if needed

**Frontend can't connect?**
- Verify backend is running on port 5000
- Check browser console for CORS errors
- Ensure API_URL is correct in frontend

**API returning errors?**
- Check backend console for error messages
- Verify request format matches API
- Test endpoints with Postman or curl

## 📖 Full Documentation

See [README.md](README.md) for complete API documentation and deployment guides.

## 💡 Tips

- Use Chrome DevTools Network tab to debug API calls
- Check backend console for request logs
- Use Postman for testing APIs independently
- Keep both terminals visible while developing

---

**🎉 Your full-stack Care Connect app is ready! Happy coding!**
