# SMS Setup Guide for Care Connect OTP

## Current Status
- ✅ OTP system working with database
- ✅ Twilio SDK installed
- ✅ SMS functionality implemented
- ⚠️ Currently in DEMO MODE (shows OTP in alert)

## How to Enable Real SMS

### Step 1: Get Twilio Credentials
1. Sign up at https://www.twilio.com/try-twilio
2. Get free trial credit ($15)
3. Go to Console: https://www.twilio.com/console
4. Copy your **Account SID** and **Auth Token**
5. Get a Twilio phone number (free with trial)

### Step 2: Configure Environment Variables
Update `backend/.env` file:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
ENABLE_SMS=true  # Set to true to enable SMS
```

### Step 3: Restart Backend
```bash
cd backend
node server.js
```

## Phone Number Format
- Indian numbers: Will auto-add +91 prefix
- International: Include country code with +

## Test the System
1. Go to Volunteer Dashboard
2. Select a needy person
3. Enter mobile number
4. Click "Send OTP"
5. Check phone for SMS
6. Enter OTP and verify

## Demo Mode (Current)
- `ENABLE_SMS=false` in .env
- OTP shown in browser alert
- No SMS charges
- Perfect for testing

## Production Mode
- `ENABLE_SMS=true` in .env
- Real SMS sent via Twilio
- OTP not shown in browser
- SMS charges apply

## Cost
- Twilio trial: $15 free credit
- SMS cost: ~$0.01 per message in India
- 1500 OTP messages with free credit

## Troubleshooting
- **SMS not received**: Check phone number format
- **Twilio error**: Verify credentials in .env
- **Phone not verified**: Add to Twilio verified numbers (trial mode)
- **Still demo mode**: Check ENABLE_SMS=true and restart server

## Security Notes
- Never commit .env file with credentials to Git
- OTP expires in 5 minutes
- OTP stored in memory (use Redis for production)
- Use environment variables for all secrets
