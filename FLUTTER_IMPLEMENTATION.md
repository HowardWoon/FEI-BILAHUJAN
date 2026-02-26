# BILAHUJAN - Flutter Hackathon Implementation Guide

As requested, here is the complete Flutter architecture and code structure for your hackathon project. 
While the live preview on the right is a React-based web prototype (due to environment constraints), the code below is exactly what you need for your actual Flutter codebase.

## 1. Project Structure

```text
lib/
â”œâ”€â”€ main.dart
â”œâ”€â”€ models/
â”‚   â””â”€â”€ risk_assessment.dart
â”œâ”€â”€ screens/
â”‚   â”œâ”€â”€ splash_screen.dart
â”‚   â”œâ”€â”€ map_home_screen.dart
â”‚   â”œâ”€â”€ camera_scan_screen.dart
â”‚   â”œâ”€â”€ analysis_result_screen.dart
â”‚   â””â”€â”€ alerts_screen.dart
â”œâ”€â”€ services/
â”‚   â”œâ”€â”€ gemini_service.dart
â”‚   â”œâ”€â”€ firebase_service.dart
â”‚   â””â”€â”€ flood_api_service.dart
â””â”€â”€ utils/
    â””â”€â”€ risk_calculator.dart
```

## 2. Dependencies (`pubspec.yaml`)

Add these to your `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  google_generative_ai: ^0.4.3
  firebase_core: ^3.1.0
  cloud_firestore: ^5.0.1
  firebase_messaging: ^15.0.1
  firebase_storage: ^12.0.0
  google_maps_flutter: ^2.6.0
  camera: ^0.11.0
  geolocator: ^12.0.0
  http: ^1.2.1
```

## 3. The Gemini Brain (`lib/services/gemini_service.dart`)

This is the core multimodal logic for analyzing the flood photos.

```dart
import 'dart:io';
import 'dart:convert';
import 'package:google_generative_ai/google_generative_ai.dart';

class GeminiService {
  static const String _apiKey = 'YOUR_GEMINI_API_KEY'; // Use flutter_dotenv in production
  late final GenerativeModel _model;

  GeminiService() {
    _model = GenerativeModel(
      model: 'gemini-2.5-flash', // Fast multimodal model
      apiKey: _apiKey,
      generationConfig: GenerationConfig(
        responseMimeType: 'application/json',
      ),
    );
  }

  Future<Map<String, dynamic>> analyzeFloodImage(File imageFile) async {
    try {
      final bytes = await imageFile.readAsBytes();
      final prompt = TextPart('''
        Analyze this image of a drainage system, street, or river for flood risk.
        Return ONLY a valid JSON object with this exact structure:
        {
          "drainageBlockage": <number 0-100 representing blockage percentage>,
          "waterLevel": "<Low, Medium, or High>",
          "riskScore": <number 0-100 representing immediate flood risk>,
          "severity": "<NORMAL, MODERATE, or SEVERE>",
          "explanation": "<Brief 1-sentence explanation of what you see>"
        }
      ''');
      
      final imagePart = DataPart('image/jpeg', bytes);
      
      final response = await _model.generateContent([
        Content.multi([prompt, imagePart])
      ]);

      if (response.text != null) {
        return jsonDecode(response.text!);
      }
      throw Exception('Empty response from Gemini');
    } catch (e) {
      print('Gemini Analysis Error: \$e');
      rethrow;
    }
  }
}
```

## 4. The Predictive Brain (`lib/utils/risk_calculator.dart`)

This combines the Gemini visual data with external APIs.

```dart
class RiskCalculator {
  /// Calculates final risk score based on 3 inputs
  static int calculateFinalRisk({
    required int geminiVisualScore, // 0-100 from photo
    required double forecastRainfallMm, // from Google Weather/Flood API
    required double sensorWaterLevel, // Mock JPS Selangor data
  }) {
    // Weighting algorithm for hackathon demo
    double visualWeight = 0.5;
    double weatherWeight = 0.3;
    double sensorWeight = 0.2;

    // Normalize rainfall (assume > 50mm is 100% risk factor)
    double weatherScore = (forecastRainfallMm / 50.0) * 100;
    weatherScore = weatherScore > 100 ? 100 : weatherScore;

    // Normalize sensor (assume > 2.0m is 100% risk factor)
    double sensorScore = (sensorWaterLevel / 2.0) * 100;
    sensorScore = sensorScore > 100 ? 100 : sensorScore;

    double finalScore = (geminiVisualScore * visualWeight) +
                        (weatherScore * weatherWeight) +
                        (sensorScore * sensorWeight);

    return finalScore.round();
  }
}
```

## 5. Firebase Integration (`lib/services/firebase_service.dart`)

```dart
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

class FirebaseService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final FirebaseMessaging _fcm = FirebaseMessaging.instance;

  Future<void> initPushNotifications() async {
    await _fcm.requestPermission();
    String? token = await _fcm.getToken();
    print("FCM Token: \$token");
    
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      // Handle foreground alert
      print('Got a message whilst in the foreground!');
      print('Message data: \${message.data}');
    });
  }

  Future<void> saveReport(Map<String, dynamic> reportData) async {
    await _db.collection('flood_reports').add({
      ...reportData,
      'timestamp': FieldValue.serverTimestamp(),
    });
    
    // Trigger mock alert if critical
    if (reportData['finalRiskScore'] > 80) {
      triggerMockAlert(reportData['locationName']);
    }
  }

  void triggerMockAlert(String location) {
    // In a real app, a Cloud Function would listen to the 'flood_reports' 
    // collection and send this FCM via the Admin SDK.
    print("CRITICAL ALERT: Evacuate \$location immediately!");
  }
}
```

## 6. Main Entry Point (`lib/main.dart`)

```dart
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'screens/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(const BILAHUJANApp());
}

class BILAHUJANApp extends StatelessWidget {
  const BILAHUJANApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BILAHUJAN',
      theme: ThemeData(
        primaryColor: const Color(0xFF6B59D3), // From your UI
        fontFamily: 'Inter',
        brightness: Brightness.light,
      ),
      home: const SplashScreen(),
    );
  }
}
```

## Hackathon Demo Tip
For the live pitch, hardcode a specific latitude/longitude for the Google Maps view to center exactly on the "Masjid Jamek" area shown in your UI designs. When you click "Scan", use a pre-selected image of a clogged drain to guarantee a high risk score from Gemini, which will perfectly trigger your mock Firebase Cloud Messaging alert!
