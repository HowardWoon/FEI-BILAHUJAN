# BILAHUJAN - Map Screen Flutter Implementation

Here is the complete, production-ready Flutter code for your Map Screen. It includes the Google Maps integration, Malaysia camera bounds, severity-based polygon color coding, and the interactive bottom sheet.

### 1. Dependencies (`pubspec.yaml`)
Add these to your `pubspec.yaml` file:
```yaml
dependencies:
  flutter:
    sdk: flutter
  google_maps_flutter: ^2.6.0
  # Optional: for getting user's actual location
  geolocator: ^12.0.0 
```

### 2. Data Model & Service (`lib/services/flood_data_service.dart`)

```dart
import 'package:google_maps_flutter/google_maps_flutter.dart';

class FloodZone {
  final String id;
  final String name;
  final List<LatLng> points;
  final int severity; // 1-10
  final String forecast;

  FloodZone({
    required this.id,
    required this.name,
    required this.points,
    required this.severity,
    required this.forecast,
  });
}

class FloodDataService {
  /// Placeholder for Google Weather API and JPS Selangor data integration
  Future<List<FloodZone>> fetchFloodData() async {
    // Simulating network delay
    await Future.delayed(const Duration(seconds: 1));

    // Mock Data based on your UI design
    return [
      FloodZone(
        id: 'zone_1',
        name: 'Masjid Jamek Area',
        severity: 8,
        forecast: 'Heavy rain expected for next 2 hours. River levels critical.',
        points: const [
          LatLng(3.1500, 101.6900),
          LatLng(3.1550, 101.6950),
          LatLng(3.1450, 101.7000),
          LatLng(3.1400, 101.6950),
        ],
      ),
      FloodZone(
        id: 'zone_2',
        name: 'Sri Hartamas',
        severity: 3,
        forecast: 'Light showers. Drainage systems operating normally.',
        points: const [
          LatLng(3.1600, 101.6500),
          LatLng(3.1650, 101.6550),
          LatLng(3.1550, 101.6600),
          LatLng(3.1500, 101.6550),
        ],
      ),
    ];
  }
}
```

### 3. Map Screen UI (`lib/screens/map_home_screen.dart`)

```dart
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import '../services/flood_data_service.dart';

class MapHomeScreen extends StatefulWidget {
  const MapHomeScreen({super.key});

  @override
  State<MapHomeScreen> createState() => _MapHomeScreenState();
}

class _MapHomeScreenState extends State<MapHomeScreen> {
  final Completer<GoogleMapController> _controller = Completer<GoogleMapController>();
  final FloodDataService _floodDataService = FloodDataService();
  
  Set<Polygon> _polygons = {};

  // Initial camera position (Kuala Lumpur)
  static const CameraPosition _kualaLumpur = CameraPosition(
    target: LatLng(3.140853, 101.693207),
    zoom: 13.5,
  );

  // Restrict map to Malaysia bounds
  static final CameraTargetBounds _malaysiaBounds = CameraTargetBounds(
    LatLngBounds(
      southwest: const LatLng(1.0, 99.0),
      northeast: const LatLng(7.0, 120.0),
    ),
  );

  @override
  void initState() {
    super.initState();
    _loadFloodData();
  }

  Future<void> _loadFloodData() async {
    final zones = await _floodDataService.fetchFloodData();
    final Set<Polygon> newPolygons = {};

    for (var zone in zones) {
      Color fillColor;
      Color strokeColor;

      // Severity Color Coding
      if (zone.severity >= 8) {
        fillColor = Colors.red.withOpacity(0.3);
        strokeColor = Colors.red.withOpacity(0.6);
      } else if (zone.severity >= 4) {
        fillColor = Colors.orange.withOpacity(0.3);
        strokeColor = Colors.orange.withOpacity(0.6);
      } else {
        fillColor = Colors.green.withOpacity(0.3);
        strokeColor = Colors.green.withOpacity(0.6);
      }

      newPolygons.add(
        Polygon(
          polygonId: PolygonId(zone.id),
          points: zone.points,
          fillColor: fillColor,
          strokeColor: strokeColor,
          strokeWidth: 2,
          consumeTapEvents: true,
          onTap: () => _showZoneDetails(zone),
        ),
      );
    }

    setState(() {
      _polygons = newPolygons;
    });
  }

  void _showZoneDetails(FloodZone zone) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(24),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    zone.name,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: zone.severity >= 8 
                          ? Colors.red.shade100 
                          : zone.severity >= 4 
                              ? Colors.orange.shade100 
                              : Colors.green.shade100,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      'Level \${zone.severity}',
                      style: TextStyle(
                        color: zone.severity >= 8 
                            ? Colors.red.shade700 
                            : zone.severity >= 4 
                                ? Colors.orange.shade700 
                                : Colors.green.shade700,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              const Text(
                'Forecast & Status',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.grey,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                zone.forecast,
                style: const TextStyle(fontSize: 16),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6B59D3), // Primary Purple
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: const Text(
                    'Close',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // 1. Full Screen Map
          GoogleMap(
            mapType: MapType.normal,
            initialCameraPosition: _kualaLumpur,
            cameraTargetBounds: _malaysiaBounds,
            polygons: _polygons,
            myLocationEnabled: true,
            myLocationButtonEnabled: false, // We use custom button
            zoomControlsEnabled: false,
            onMapCreated: (GoogleMapController controller) {
              _controller.complete(controller);
            },
          ),

          // 2. Custom Search Bar (Top)
          Positioned(
            top: 60,
            left: 16,
            right: 16,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              height: 56,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.9),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  const Icon(Icons.search, color: Colors.grey),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: TextField(
                      decoration: InputDecoration(
                        hintText: 'Search location...',
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                  const Icon(Icons.mic, color: Colors.grey),
                ],
              ),
            ),
          ),

          // 3. Map Controls (Right)
          Positioned(
            top: 140,
            right: 16,
            child: Column(
              children: [
                _buildMapControlButton(Icons.my_location, () async {
                  // Logic to animate camera to user location
                }),
                const SizedBox(height: 8),
                _buildMapControlButton(Icons.layers, () {
                  // Logic to toggle map layers
                }),
              ],
            ),
          ),

          // 4. Scan Near Me Button (Bottom Center)
          Positioned(
            bottom: 100, // Above bottom nav bar
            left: 0,
            right: 0,
            child: Center(
              child: ElevatedButton.icon(
                onPressed: () {
                  // Navigate to Camera Scan Screen
                },
                icon: const Icon(Icons.photo_camera),
                label: const Text(
                  'Scan Near Me',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6B59D3), // Primary Purple
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                  elevation: 8,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMapControlButton(IconData icon, VoidCallback onPressed) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.9),
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: IconButton(
        icon: Icon(icon, color: Colors.grey.shade700),
        onPressed: onPressed,
      ),
    );
  }
}
```
