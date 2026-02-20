import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../../services/api_service.dart';
import 'trip_detail_screen.dart';

import '../../theme/app_colors.dart';

class DriverPortal extends StatefulWidget {
  const DriverPortal({super.key});

  @override
  State<DriverPortal> createState() => _DriverPortalState();
}

class _DriverPortalState extends State<DriverPortal> {
  List<dynamic> _trips = [];
  bool _loading = true;
  String _driverName = '';

  @override
  void initState() {
    super.initState();
    _loadTrips();
  }

  Future<void> _loadTrips() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userString = prefs.getString('user');
      final user = userString != null ? jsonDecode(userString) : null;
      final driverId = user != null ? user['id'] : 0;
      _driverName = user != null ? user['name'] : 'Driver';

      final allTrips = await ApiService.getTrips();
      // Filter trips assigned to this driver
      setState(() {
        _trips = allTrips.where((t) => t['driverId'] == driverId).toList();
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to load trips: ${e.toString()}')),
      );
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Trips', style: TextStyle(color: Colors.white)),
        backgroundColor: AppColors.driverPrimary,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: _loading 
        ? const Center(child: CircularProgressIndicator()) 
        : Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text(
                'Welcome, $_driverName', 
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)
              ),
            ),
            Expanded(
              child: _trips.isEmpty 
              ? const Center(child: Text('No trips assigned yet.'))
              : ListView.builder(
                  itemCount: _trips.length,
                  itemBuilder: (ctx, i) {
                    final trip = _trips[i];
                    return Card(
                      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      child: ListTile(
                        leading: const Icon(Icons.local_shipping, color: AppColors.driverPrimary),
                        title: Text('${trip['source']} -> ${trip['destination']}'),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Status: ${trip['status']}'),
                            Text('Date: ${trip['startDate'].toString().substring(0, 10)}'),
                          ],
                        ),
                        trailing: ElevatedButton(
                          onPressed: () {
                              Navigator.push(
                                  context, 
                                  MaterialPageRoute(builder: (context) => TripDetailScreen(trip: trip))
                              );
                          },
                          child: const Text('View'),
                        ),
                      ),
                    );
                  },
                ),
            ),
          ],
        ),
    );
  }
}
