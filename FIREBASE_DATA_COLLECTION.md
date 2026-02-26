# BILAHUJAN 24/7 Data Collection System

## Overview
Your BILAHUJAN flood monitoring app now has a comprehensive 24/7 data collection system that automatically collects and stores data in Firebase Database and Firestore.

## What Was Implemented

### 1. Firebase Configuration (`src/firebase.ts`)
- ✅ Added Firestore database
- ✅ Added Realtime Database
- ✅ Added Cloud Storage
- All Firebase services are now initialized and ready to use

### 2. Data Collection Service (`src/services/dataCollection.ts`)
This is the core service that handles all 24/7 data collection. Features include:

#### **System Heartbeat**
- Updates every 60 seconds to show the system is active
- Stored in Realtime Database at `systemHeartbeat/status`

#### **Continuous Monitoring**
- Collects sensor data every 5 minutes
- Simulates readings for:
  - Water levels (meters)
  - Rainfall (mm/hr)
  - Flow rate (m³/s)
- Only monitors zones with severity >= 3

#### **Automatic Data Collection**
The system automatically saves:

1. **Flood Zones** (`saveFloodZone`)
   - Saved to both Firestore (historical) and Realtime Database (live)
   - Collection: `floodZones`
   - RTDB Path: `liveZones/{zoneId}`

2. **User Reports** (`saveUserReport`)
   - Includes location, details, image URL, analysis results
   - Collection: `reports`
   - RTDB Path: `liveReports/{reportId}`

3. **Analysis Results** (`saveAnalysisResult`)
   - Image analysis results from AI
   - Collection: `analysisResults`
   - Includes risk level, drainage info, location

4. **Audio Analysis** (`saveAudioAnalysis`)
   - Voice-based flood reports and analysis
   - Collection: `audioAnalysis`
   - Includes location and analysis results

5. **Sensor Data** (`saveSensorData`)
   - High-frequency sensor readings
   - Uses Realtime Database for speed
   - Sampled to Firestore (10% of readings) for historical analysis
   - RTDB Path: `liveSensors/{zoneId}/{sensorType}`

6. **System Logs** (`logSystemActivity`)
   - Activity logging for monitoring
   - Collection: `systemLogs`
   - Tracks all major system events

### 3. Integration Points

#### **App.tsx**
- Initializes data collection system on app start
- Starts continuous monitoring with current flood zones
- Automatic cleanup on app unmount

#### **floodZones.ts**
- `updateFloodZone()` - Automatically saves updates to Firebase
- `addFloodZone()` - Automatically saves new zones to Firebase

#### **ReportScreen.tsx**
- `handleSubmit()` - Saves user reports to Firebase
- Saves analysis results with location data
- Updates linked to zones

#### **MapScreen.tsx**
- Audio analysis automatically saved to Firebase
- Includes location data when available

### 4. Real-time Listeners
The system listens for updates from Firebase and dispatches events:
- `firebaseZonesUpdate` - When flood zones are updated
- `firebaseReportsUpdate` - When new reports are submitted

## Firebase Database Structure

### Firestore Collections
```
/floodZones/{zoneId}
  - All flood zone data
  - Updated with serverTimestamp

/reports/{reportId}
  - User submitted reports
  - Status: pending | processing | completed

/analysisResults/{analysisId}
  - AI analysis results
  - Linked to images and locations

/audioAnalysis/{analysisId}
  - Voice-based reports
  - Includes audio blobs

/sensorData/{sensorId}
  - Historical sensor readings (sampled)
  - Various sensor types

/systemLogs/{logId}
  - Activity logs
  - Timestamps and metadata
```

### Realtime Database Paths
```
/liveZones/{zoneId}
  - Real-time flood zone data
  - Low latency updates

/liveReports/{reportId}
  - Real-time report status
  - Live monitoring

/liveSensors/{zoneId}/{sensorType}
  - High-frequency sensor data
  - Latest readings

/systemHeartbeat/status
  - System health check
  - Updated every 60 seconds
```

## How to Use

### Starting the System
The system starts automatically when the app loads. No manual intervention needed.

### Monitoring Data
1. **Firebase Console**: Go to your Firebase project console
   - Firestore Database: View historical data
   - Realtime Database: View live streaming data
   - Storage: View uploaded images

2. **Check Console Logs**: The app logs all Firebase operations
   - Look for `✅` emojis for successful saves
   - System status updates every 5 minutes

### Key Functions You Can Use

```typescript
// Save a flood zone
import { saveFloodZone } from './services/dataCollection';
await saveFloodZone(zone);

// Save a user report
import { saveUserReport } from './services/dataCollection';
await saveUserReport({
  location: { lat, lng, address },
  details: "Flooding observed",
  status: "pending"
});

// Get recent reports
import { getRecentReports } from './services/dataCollection';
const reports = await getRecentReports(10);

// Update report status
import { updateReportStatus } from './services/dataCollection';
await updateReportStatus(reportId, 'completed');
```

## Data Collection Intervals

- **Heartbeat**: Every 60 seconds
- **Sensor Data**: Every 5 minutes
- **User Reports**: Immediate on submission
- **Zone Updates**: Immediate on change
- **Analysis Results**: Immediate on completion

## Important Notes

1. **Firebase Setup Required**:
   - Ensure Firestore is enabled in Firebase Console
   - Enable Realtime Database in Firebase Console
   - Set up security rules for production

2. **Network Dependency**:
   - System requires internet connection
   - Failed saves are logged to console
   - Consider adding offline persistence if needed

3. **Cost Considerations**:
   - Firestore: Pay per read/write
   - Realtime Database: Pay per GB downloaded
   - Storage: Pay per GB stored
   - Current implementation optimized to minimize costs

4. **Security Rules**:
   - Currently using default rules
   - **IMPORTANT**: Set up proper security rules before production!

## Sample Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read to all, write for authenticated users
    match /floodZones/{zoneId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /reports/{reportId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /analysisResults/{analysisId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /audioAnalysis/{analysisId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /systemLogs/{logId} {
      allow read: if request.auth != null;
      allow write: if true;
    }
  }
}
```

### Realtime Database Rules
```json
{
  "rules": {
    "liveZones": {
      ".read": true,
      ".write": true
    },
    "liveReports": {
      ".read": true,
      ".write": true
    },
    "liveSensors": {
      ".read": true,
      ".write": true
    },
    "systemHeartbeat": {
      ".read": true,
      ".write": true
    }
  }
}
```

## Testing the System

1. **Check Heartbeat**:
   - Open Firebase Realtime Database
   - Navigate to `systemHeartbeat/status`
   - Should update every minute

2. **Submit a Report**:
   - Use the report screen
   - Check Firestore `reports` collection
   - Check Realtime Database `liveReports`

3. **Monitor Sensor Data**:
   - Open Realtime Database
   - Navigate to `liveSensors`
   - Should update every 5 minutes for active zones

## Troubleshooting

### Data Not Appearing in Firebase
1. Check console for errors
2. Verify Firebase config in `firebase.ts`
3. Check Firebase Console for database activation
4. Verify internet connection

### Heartbeat Not Updating
1. Check if app is running
2. Look for JavaScript errors in console
3. Verify Realtime Database is enabled

### Reports Not Saving
1. Check console logs for save errors
2. Verify form has all required fields
3. Check Firebase security rules

## Next Steps

1. **Enable Authentication**: Add Firebase Auth for user tracking
2. **Add Offline Support**: Implement offline persistence
3. **Create Dashboard**: Build admin dashboard to view all data
4. **Set Up Alerts**: Configure Firebase Cloud Functions for automated alerts
5. **Add Analytics**: Track usage patterns and system performance
6. **Optimize Costs**: Review and optimize database queries

## Support

For issues or questions about the 24/7 data collection system:
1. Check console logs for detailed error messages
2. Review Firebase Console for database state
3. Verify all imports are correct
4. Ensure Firebase packages are installed

## Required npm Packages

Make sure these are installed:
```bash
npm install firebase
```

All Firebase packages are included in the main `firebase` package (v9+).

---

**Status**: ✅ System is now collecting data 24/7!
**Last Updated**: February 26, 2026
