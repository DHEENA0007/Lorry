import 'dart:async';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import '../../services/api_service.dart';
import '../../theme/app_colors.dart';

class TripDetailScreen extends StatefulWidget {
  final Map<String, dynamic> trip;

  const TripDetailScreen({super.key, required this.trip});

  @override
  State<TripDetailScreen> createState() => _TripDetailScreenState();
}

class _TripDetailScreenState extends State<TripDetailScreen> {
  final _expenseController = TextEditingController();
  Timer? _locationTimer;
  bool _isTracking = false;

  @override
  void dispose() {
    _locationTimer?.cancel();
    super.dispose();
  }

  Future<void> _startLocationTracking() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Location services are disabled.')));
      return;
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Location permissions are denied')));
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Location permissions are permanently denied, we cannot request permissions.')));
      return;
    }

    setState(() {
      _isTracking = true;
    });

    // Start pushing location every 3 seconds to sync with dashboard pulse
    _locationTimer = Timer.periodic(const Duration(seconds: 3), (timer) async {
      try {
        Position position = await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.high);
        final lorryId = widget.trip['lorryId'] ?? widget.trip['LorryId'] ?? 1; // Fallback to 1 if empty
        await ApiService.updateLorryLocation(lorryId, "${position.latitude},${position.longitude}");
      } catch (e) {
        debugPrint("Error pushing location: $e");
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Live tracking started!')));
  }

  void _stopLocationTracking() {
    _locationTimer?.cancel();
    setState(() {
      _isTracking = false;
    });
  }

  void _updateStatus(String status) async {
    if (status == 'In Progress') {
       await _startLocationTracking();
    } else if (status == 'Completed') {
       _stopLocationTracking();
       Navigator.pop(context);
    }
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Status updated to $status')));
  }

  @override
  Widget build(BuildContext context) {
    final trip = widget.trip;
    return Scaffold(
      appBar: AppBar(title: const Text('Trip Details'), backgroundColor: AppColors.driverPrimary),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('From: ${trip['source']}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            Text('To: ${trip['destination']}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),
            Text('Budget: \$${trip['budget']}'),
            const SizedBox(height: 20),
            if (_isTracking) 
              const Center(
                child: Column(
                  children: [
                    CircularProgressIndicator(),
                    SizedBox(height: 10),
                    Text('📡 Live Tracking Active', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            const SizedBox(height: 20),
            const Text('Add Expense:', style: TextStyle(fontWeight: FontWeight.bold)),
            TextField(
              controller: _expenseController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Amount'),
            ),
            const SizedBox(height: 10),
            ElevatedButton(
              onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Expense Added Mock!')));
                  _expenseController.clear();
              }, 
              child: const Text('Save Expense')
            ),
            const Spacer(),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(backgroundColor: _isTracking ? Colors.grey : AppColors.driverPrimary),
                    onPressed: _isTracking ? null : () => _updateStatus('In Progress'), 
                    child: const Text('Start Trip', style: TextStyle(color: Colors.white))
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.driverSuccess),
                    onPressed: () => _updateStatus('Completed'), 
                    child: const Text('Complete Trip', style: TextStyle(color: Colors.white))
                  ),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}
