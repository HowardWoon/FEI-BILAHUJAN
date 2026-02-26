# BILAHUJAN - Map & AI Analysis Flutter Implementation

Here is the complete, production-ready Flutter code for your core Map & AI Analysis screen. It integrates `google_maps_flutter` with Malaysia bounds, a real-time `StreamBuilder` connected to Firebase Firestore, a pulsating animation for critical zones, and the Gemini API for image analysis.

### 1. Required Packages (`pubspec.yaml`)

Add these dependencies to your `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  google_maps_flutter: ^2.6.0
  cloud_firestore: ^5.0.1
  firebase_core: ^3.1.0
  google_generative_ai: ^0.4.3
  image_picker: ^1.1.2 # For the camera simulation
```

### 2. The Complete Map & AI Screen (`lib/screens/map_ai_screen.dart`)

This file contains the UI, the Firebase real-time listener, the pulsating map animation, and the Gemini AI integration.

```dart
import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:google_generative_ai/google_generative_ai.dart';
import 'package:image_picker/image_picker.dart';

class MapAiScreen extends StatefulWidget {
  const MapAiScreen({super.key});

  @override
  State<MapAiScreen> createState() => _MapAiScreenState();
}

class _MapAiScreenState extends State<MapAiScreen> with SingleTickerProviderStateMixin {
  final Completer<GoogleMapController> _mapController = Completer();
  
  // --- CONFIGURATION ---
  // TODO: Insert your Gemini API Key here
  static const String _geminiApiKey = 'YOUR_GEMINI_API_KEY'; 
  
  // Malaysia Bounds
  static final CameraTargetBounds _malaysiaBounds = CameraTargetBounds(
    LatLngBounds(
      southwest: const LatLng(1.0, 99.0),
      northeast: const LatLng(7.0, 120.0),
    ),
  );

  static const CameraPosition _initialCamera = CameraPosition(
    target: LatLng(3.140853, 101.693207), // Kuala Lumpur
    zoom: 11.0,
  );

  // Animation for Pulsating Critical Markers
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    // Setup the pulsating animation for critical zones (Radius expands from 500m to 1500m)
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
    
    _pulseAnimation = Tween<double>(begin: 500.0, end: 1500.0).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    // Rebuild the map when the animation ticks to update circle radiuses
    _pulseController.addListener(() {
      if (mounted) setState(() {});
    });
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  // --- 1. GEMINI AI FLOW ---
  Future<void> _handleScanNearMe() async {
    final picker = ImagePicker();
    // Simulate opening camera
    final XFile? photo = await picker.pickImage(source: ImageSource.camera);
    
    if (photo == null) return; // User canceled

    // Show loading dialog
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (c) => const Center(child: CircularProgressIndicator(color: Color(0xFF6B59D3))),
    );

    try {
      final file = File(photo.path);
      final bytes = await file.readAsBytes();

      // Initialize Gemini
      final model = GenerativeModel(
        model: 'gemini-2.5-flash',
        apiKey: _geminiApiKey,
        generationConfig: GenerationConfig(responseMimeType: 'application/json'),
      );

      final prompt = TextPart('''
        Analyze this image for flood indicators. Predict if this area will flood and estimate severity. 
        Return ONLY a valid JSON object with this exact structure:
        {
          "locationName": "Estimated Area Name",
          "severityLevel": <number 1-10>,
          "waterLevel": "<Low, Medium, High, Critical>",
          "prediction": "<Short 2 sentence forecast>",
          "lat": 3.14,
          "lng": 101.69
        }
      ''');

      final imagePart = DataPart('image/jpeg', bytes);
      final response = await model.generateContent([Content.multi([prompt, imagePart])]);

      Navigator.pop(context); // Close loading dialog

      if (response.text != null) {
        final Map<String, dynamic> report = jsonDecode(response.text!);
        
        // --- 2. FIREBASE SYNC ---
        // Save the AI report to Firestore for real-time sync across all devices
        await FirebaseFirestore.instance.collection('flood_reports').add({
          ...report,
          'timestamp': FieldValue.serverTimestamp(),
        });

        // Show the sleek UI Modal with the results
        _showAiReportModal(report);
      }
    } catch (e) {
      Navigator.pop(context); // Close loading dialog
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('AI Analysis Failed: \$e')));
    }
  }

  // --- 3. UI MODAL ---
  void _showAiReportModal(Map<String, dynamic> report) {
    final int severity = report['severityLevel'] ?? 1;
    final bool isCritical = severity >= 8;

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(width: 40, height: 5, decoration: BoxDecoration(color: Colors.grey[300], borderRadius: BorderRadius.circular(10))),
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('AI Analysis Complete', style: TextStyle(fontSize: 14, color: Colors.grey[600], fontWeight: FontWeight.bold)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: isCritical ? Colors.red[100] : Colors.green[100],
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    'Level \$severity',
                    style: TextStyle(color: isCritical ? Colors.red[700] : Colors.green[700], fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(report['locationName'] ?? 'Unknown Location', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900)),
            const SizedBox(height: 8),
            Text('Water Level: \${report['waterLevel']}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.grey[100], borderRadius: BorderRadius.circular(16)),
              child: Text(report['prediction'] ?? '', style: const TextStyle(fontSize: 15, height: 1.5)),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6B59D3),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: const Text('Acknowledge', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // --- 4. REAL-TIME MAP STREAM ---
          StreamBuilder<QuerySnapshot>(
            stream: FirebaseFirestore.instance.collection('flood_reports').snapshots(),
            builder: (context, snapshot) {
              Set<Circle> circles = {};
              Set<Marker> markers = {};

              if (snapshot.hasData) {
                for (var doc in snapshot.data!.docs) {
                  final data = doc.data() as Map<String, dynamic>;
                  final lat = data['lat'] as double?;
                  final lng = data['lng'] as double?;
                  final severity = data['severityLevel'] as int? ?? 1;

                  if (lat != null && lng != null) {
                    final position = LatLng(lat, lng);
                    final isCritical = severity >= 8;

                    // Add a pulsating circle for critical zones
                    circles.add(
                      Circle(
                        circleId: CircleId('circle_\${doc.id}'),
                        center: position,
                        // If critical, animate radius. Else, static radius.
                        radius: isCritical ? _pulseAnimation.value : 800.0,
                        fillColor: isCritical 
                            ? Colors.red.withOpacity(0.3) 
                            : (severity >= 4 ? Colors.orange.withOpacity(0.3) : Colors.green.withOpacity(0.3)),
                        strokeColor: isCritical ? Colors.red : Colors.transparent,
                        strokeWidth: isCritical ? 2 : 0,
                      ),
                    );

                    // Add an invisible marker just to handle taps
                    markers.add(
                      Marker(
                        markerId: MarkerId('marker_\${doc.id}'),
                        position: position,
                        alpha: 0.0, // Invisible, we just want the tap target over the circle
                        consumeTapEvents: true,
                        onTap: () => _showAiReportModal(data),
                      ),
                    );
                  }
                }
              }

              return GoogleMap(
                initialCameraPosition: _initialCamera,
                cameraTargetBounds: _malaysiaBounds,
                circles: circles,
                markers: markers,
                myLocationEnabled: true,
                myLocationButtonEnabled: false,
                zoomControlsEnabled: false,
                onMapCreated: (controller) => _mapController.complete(controller),
              );
            },
          ),

          // --- UI OVERLAYS ---
          // Scan Near Me Button
          Positioned(
            bottom: 100,
            left: 0,
            right: 0,
            child: Center(
              child: ElevatedButton.icon(
                onPressed: _handleScanNearMe,
                icon: const Icon(Icons.photo_camera),
                label: const Text('Scan Near Me', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6B59D3),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                  elevation: 8,
                ),
              ),
            ),
          ),

          // Bottom Navigation Bar
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              height: 80,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.95),
                border: Border(top: BorderSide(color: Colors.grey.shade200)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildNavItem(Icons.map, 'Map', true),
                  _buildNavItem(Icons.notifications, 'Alert', false),
                  _buildNavItem(Icons.settings, 'Settings', false),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String label, bool isActive) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(icon, color: isActive ? const Color(0xFF6B59D3) : Colors.grey),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.bold,
            color: isActive ? const Color(0xFF6B59D3) : Colors.grey,
          ),
        ),
      ],
    );
  }
}
```

### Setup Instructions for your Hackathon:
1. **Firebase Setup:** Ensure you have run `flutterfire configure` in your terminal to link your Flutter app to your Firebase project.
2. **Firestore Rules:** For the hackathon, make sure your Firestore rules allow read/write access (e.g., `allow read, write: if true;` for testing).
3. **Gemini API:** Replace `'YOUR_GEMINI_API_KEY'` with your actual Google AI Studio key.
4. **Permissions:** Ensure you have added the Camera and Location permissions to your `AndroidManifest.xml` and `Info.plist`.
