# Firebase Setup Guide for BILAHUJAN 24/7 Data Collection

## Quick Setup Steps

### 1. Enable Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **bilahujan-app**
3. Click on **Firestore Database** in the left menu
4. Click **Create database**
5. Choose **Start in test mode** (for development)
6. Select your region (choose closest to Malaysia, e.g., `asia-southeast1`)
7. Click **Enable**

### 2. Enable Realtime Database

1. In Firebase Console, click on **Realtime Database** in the left menu
2. Click **Create Database**
3. Choose your database location: `asia-southeast1` or closest to Malaysia
4. Start in **Test mode** (for development)
5. Click **Enable**

### 3. Update Database Rules (Important for Production!)

#### Firestore Rules (Test Mode - DO NOT USE IN PRODUCTION)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 3, 26);
    }
  }
}
```

#### Realtime Database Rules (Test Mode - DO NOT USE IN PRODUCTION)
```json
{
  "rules": {
    ".read": "now < 1743206400000",
    ".write": "now < 1743206400000"
  }
}
```

**⚠️ WARNING**: These test mode rules allow anyone to read/write your data for 30 days. Update them before going to production!

### 4. Install Required Dependencies

Make sure Firebase is installed:
```bash
npm install firebase
```

### 5. Verify Installation

1. Start your app:
```bash
npm run dev
```

2. Open browser console (F12)
3. Look for these messages:
   - `🔄 Initializing 24/7 data collection system...`
   - `✅ Data collection system active`
   - `🚀 BILAHUJAN 24/7 Data Collection Active`
   - `🔄 Continuous monitoring started (5-minute intervals)`

### 6. Check Data is Being Collected

#### Check Heartbeat (within 1 minute):
1. Open Firebase Console → Realtime Database
2. Navigate to `systemHeartbeat/status`
3. You should see:
```json
{
  "lastUpdate": "2026-02-26T...",
  "status": "active",
  "timestamp": 1708963200000
}
```

#### Check Sensor Data (within 5 minutes):
1. Open Firebase Console → Realtime Database
2. Navigate to `liveSensors`
3. You should see sensor readings for zones with severity >= 3

#### Submit a Test Report:
1. In your app, go to Report tab
2. Take/upload a flood photo
3. Fill in location and departments
4. Click Submit
5. Check Firebase Console:
   - Firestore → `reports` collection (new document added)
   - Realtime Database → `liveReports` (new entry)

### 7. Monitor Your Data

#### Firebase Console Views:

**Firestore Database** (Historical Data):
- `/floodZones` - All flood zones
- `/reports` - User reports
- `/analysisResults` - AI analysis results
- `/audioAnalysis` - Voice reports
- `/sensorData` - Sensor readings (sampled)
- `/systemLogs` - Activity logs

**Realtime Database** (Live Data):
- `/liveZones` - Real-time zone updates
- `/liveReports` - Live report status
- `/liveSensors` - Current sensor readings
- `/systemHeartbeat` - System health

### 8. View Your Data

You can view the data from the Firebase Console screenshot you shared:
- Current storage: **8B** (very minimal)
- Downloads: **0B** so far
- Costs: Still on free tier!

### 9. Troubleshooting

#### No data appearing?
```bash
# Check browser console for errors
# Common issues:
# - Firebase not initialized (check firebase.ts)
# - Database not enabled (follow steps 1-2)
# - Network errors (check internet connection)
```

#### Heartbeat not updating?
```bash
# App must be running
# Check console for: "🔄 Initializing 24/7 data collection system..."
# If not showing, restart the app
```

#### Permission denied errors?
```bash
# Update Firebase rules (see step 3)
# Make sure test mode is enabled
# Rules must allow public read/write for testing
```

### 10. Production Checklist

Before deploying to production:

- [ ] Enable Firebase Authentication
- [ ] Update Firestore security rules
- [ ] Update Realtime Database rules
- [ ] Set up Firebase App Check
- [ ] Configure CORS for Firebase Storage
- [ ] Set up backup/export policies
- [ ] Monitor usage and costs
- [ ] Set up billing alerts
- [ ] Enable Firebase Analytics
- [ ] Set up Cloud Functions for automation

### 11. Cost Management

Free tier limits (Spark Plan):
- **Firestore**: 50K reads, 20K writes, 1GB storage per day
- **Realtime Database**: 100 concurrent connections, 1GB download per month
- **Storage**: 5GB total

Current implementation is optimized:
- Sensor data sampled to Firestore (10% only)
- High-frequency data uses Realtime DB
- Heartbeat updates minimized (1/minute)

Estimated monthly cost on free tier: **$0**

When scaling, consider upgrading to Blaze (pay-as-you-go) plan.

### 12. Next Steps

1. ✅ Enable Firestore & Realtime Database
2. ✅ Start the app and verify data collection
3. ✅ Submit test reports
4. ✅ Monitor Firebase Console
5. 📊 Build analytics dashboard
6. 🔔 Set up automated alerts
7. 👥 Add user authentication
8. 📱 Deploy to production

---

## Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Realtime Database Rules](https://firebase.google.com/docs/database/security)
- [Firebase Pricing](https://firebase.google.com/pricing)

## Need Help?

Check the logs in your browser console for detailed information:
- `✅` - Success messages
- `❌` or errors - Something went wrong
- `🔄` - Process starting/running
- `📊` - Data collection events

Your 24/7 data collection system is ready! 🚀
