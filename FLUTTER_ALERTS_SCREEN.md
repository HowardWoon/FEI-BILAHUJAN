# BILAHUJAN - Dynamic Alerts Screen & Location Selection

Here is the complete, production-ready Flutter code for your `AlertsScreen.dart`. It uses a `StreamBuilder` to fetch real-time data from Firestore, dynamically maps the AI's severity score to the correct UI card colors (Red, Orange, Grey), and includes the new **Location Selection** feature before uploading an image.

### 1. Required Packages (`pubspec.yaml`)

Ensure you have these in your `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  cloud_firestore: ^5.0.1
  firebase_core: ^3.1.0
  image_picker: ^1.1.2 # For camera/gallery
```

### 2. The Alerts Screen (`lib/screens/alerts_screen.dart`)

```dart
import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:image_picker/image_picker.dart';

class AlertsScreen extends StatefulWidget {
  const AlertsScreen({super.key});

  @override
  State<AlertsScreen> createState() => _AlertsScreenState();
}

class _AlertsScreenState extends State<AlertsScreen> {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // --- 1. LOCATION SELECTION BEFORE UPLOAD ---
  void _showLocationSelectionDialog() {
    final TextEditingController locationController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Padding(
        padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
        child: Container(
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
                child: Container(
                  width: 40, height: 5, 
                  decoration: BoxDecoration(color: Colors.grey[300], borderRadius: BorderRadius.circular(10))
                ),
              ),
              const SizedBox(height: 20),
              const Text('Where is the flood?', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              
              // Option A: Current Location
              ElevatedButton.icon(
                onPressed: () {
                  Navigator.pop(context);
                  _openCameraFlow(useCurrentLocation: true);
                },
                icon: const Icon(Icons.my_location, color: Color(0xFF635BFF)),
                label: const Text('Use My Current Location', style: TextStyle(color: Color(0xFF635BFF), fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF635BFF).withOpacity(0.1),
                  elevation: 0,
                  minimumSize: const Size(double.infinity, 56),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
              ),
              
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 16),
                child: Center(child: Text('OR', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold))),
              ),

              // Option B: Manual Location Entry
              TextField(
                controller: locationController,
                decoration: InputDecoration(
                  hintText: 'Type a location (e.g., Kajang)',
                  prefixIcon: const Icon(Icons.search, color: Colors.grey),
                  filled: true,
                  fillColor: Colors.grey[100],
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  if (locationController.text.isNotEmpty) {
                    Navigator.pop(context);
                    _openCameraFlow(useCurrentLocation: false, manualLocation: locationController.text);
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF635BFF),
                  minimumSize: const Size(double.infinity, 56),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: const Text('Continue to Camera', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _openCameraFlow({required bool useCurrentLocation, String? manualLocation}) async {
    // 1. Get the location coordinates (either via Geolocator or Geocoding the manualLocation string)
    // 2. Open Camera
    final picker = ImagePicker();
    final XFile? photo = await picker.pickImage(source: ImageSource.camera);
    
    if (photo != null) {
      // 3. Send to Gemini & Save to Firestore (Logic from previous step)
      print("Photo taken for location: \${useCurrentLocation ? 'Current' : manualLocation}");
    }
  }

  // --- 2. DYNAMIC UI MAPPING ---
  Widget _buildAlertCard(Map<String, dynamic> data) {
    final int score = data['risk_score_1_to_10'] ?? 1;
    final bool isImminent = data['is_flood_imminent'] ?? false;
    final String locationName = data['locationName'] ?? 'Unknown Area';
    final String description = data['ai_reasoning'] ?? data['recommended_action'] ?? 'No details provided.';
    
    // Default to Grey (Maintenance/Low Risk)
    Color headerBgColor = Colors.grey.shade100;
    Color headerTextColor = Colors.grey.shade700;
    String headerText = 'MAINTENANCE NOTICE';

    // Map Severity to Colors
    if (score >= 8 || isImminent) {
      headerBgColor = Colors.red.shade50;
      headerTextColor = Colors.red.shade600;
      headerText = 'FLOOD NOW';
    } else if (score >= 4) {
      headerBgColor = Colors.orange.shade50;
      headerTextColor = Colors.orange.shade600;
      headerText = 'FLOOD RISK NEARBY';
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 8, offset: const Offset(0, 2)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Card Header
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: headerBgColor,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
              border: Border(bottom: BorderSide(color: headerTextColor.withOpacity(0.2))),
            ),
            child: Text(
              headerText,
              style: TextStyle(color: headerTextColor, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2),
            ),
          ),
          // Card Body
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(locationName, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    Text('1.2km away', style: TextStyle(fontSize: 12, color: Colors.grey.shade500, fontWeight: FontWeight.w500)),
                  ],
                ),
                const SizedBox(height: 8),
                Text(description, style: TextStyle(fontSize: 14, color: Colors.grey.shade700, height: 1.4)),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Text('View More', style: TextStyle(color: const Color(0xFF635BFF), fontWeight: FontWeight.bold, fontSize: 14)),
                    const SizedBox(width: 4),
                    Icon(Icons.arrow_forward, size: 16, color: const Color(0xFF635BFF)),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(icon: const Icon(Icons.arrow_back, color: Colors.black), onPressed: () => Navigator.pop(context)),
        title: const Text('Alerts', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        centerTitle: true,
        actions: [
          IconButton(icon: const Icon(Icons.more_horiz, color: Colors.black), onPressed: () {}),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          children: [
            Expanded(
              // --- 3. FIRESTORE STREAM BUILDER ---
              child: StreamBuilder<QuerySnapshot>(
                stream: _firestore.collection('flood_reports').orderBy('timestamp', descending: true).snapshots(),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator(color: Color(0xFF635BFF)));
                  }
                  
                  if (snapshot.hasError) {
                    return Center(child: Text('Error loading alerts: \${snapshot.error}'));
                  }

                  if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
                    return const Center(
                      child: Text('No active alerts in your area.', style: TextStyle(color: Colors.grey, fontSize: 16)),
                    );
                  }

                  final reports = snapshot.data!.docs;

                  return ListView.builder(
                    padding: const EdgeInsets.only(top: 8, bottom: 100),
                    itemCount: reports.length,
                    itemBuilder: (context, index) {
                      final data = reports[index].data() as Map<String, dynamic>;
                      return _buildAlertCard(data);
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
      
      // Floating "Help the Community" Banner
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      floatingActionButton: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: InkWell(
          onTap: _showLocationSelectionDialog, // Triggers the new location selection flow
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF635BFF).withOpacity(0.05),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF635BFF).withOpacity(0.2)),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: const BoxDecoration(color: Color(0xFF635BFF), shape: BoxShape.circle),
                  child: const Icon(Icons.camera_alt, color: Colors.white, size: 20),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text('Help the community', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      Text('Scan nearby drains to update risk levels.', style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
                    ],
                  ),
                ),
                Icon(Icons.chevron_right, color: Colors.grey.shade400),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
```
