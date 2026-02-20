import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../../services/api_service.dart';
import 'user_bookings.dart';
import '../../theme/app_colors.dart';

class UserHome extends StatefulWidget {
  const UserHome({super.key});

  @override
  State<UserHome> createState() => _UserHomeState();
}

class _UserHomeState extends State<UserHome> {
  final _pickupController = TextEditingController();
  final _dropController = TextEditingController();
  final _goodsController = TextEditingController();
  final _weightController = TextEditingController();
  
  // Mock Data for nearby lorries (In real app, fetch from API based on location)
  final List<Map<String, dynamic>> _nearbyLorries = [
    {'vehicle': 'KA-01-HW-1234', 'type': 'Container', 'capacity': '10T', 'eta': '15 mins'},
    {'vehicle': 'KA-05-MN-5678', 'type': 'Open', 'capacity': '5T', 'eta': '10 mins'},
  ];

  bool _isLoading = false;

  Future<void> _bookLorry() async {
    if (_pickupController.text.isEmpty || _dropController.text.isEmpty || _goodsController.text.isEmpty || _weightController.text.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please fill all fields')));
        return;
    }

    final prefs = await SharedPreferences.getInstance();
    final userString = prefs.getString('user');
    final userId = userString != null ? jsonDecode(userString)['id'] : 1; // Default to ID 1 if not found for demo

    setState(() => _isLoading = true);

    try {
      await ApiService.createBooking({
        'pickupLocation': _pickupController.text,
        'dropLocation': _dropController.text,
        'goodsType': _goodsController.text,
        'weight': double.tryParse(_weightController.text) ?? 0.0,
        'userId': userId,
      });

      if (!mounted) return;
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Booking Requested Successfully!')),
      );
      
      _pickupController.clear();
      _dropController.clear();
      _goodsController.clear();
      _weightController.clear();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Booking Failed: ${e.toString()}')),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Book a Lorry', style: TextStyle(color: Colors.white)),
        backgroundColor: AppColors.userPrimary,
        iconTheme: const IconThemeData(color: Colors.white),
        actions: [
            IconButton(
                icon: const Icon(Icons.history),
                onPressed: () {
                    Navigator.push(context, MaterialPageRoute(builder: (context) => const UserBookings()));
                },
            ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1. Location Input
              const Text('Where to?', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 10),
              Card(
                elevation: 2,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      TextField(
                        controller: _pickupController,
                        decoration: const InputDecoration(
                          labelText: 'Pickup Location',
                          prefixIcon: Icon(Icons.my_location, color: Colors.blue),
                          border: InputBorder.none,
                        ),
                      ),
                      const Divider(),
                      TextField(
                        controller: _dropController,
                        decoration: const InputDecoration(
                          labelText: 'Drop Location',
                          prefixIcon: Icon(Icons.location_on, color: Colors.red),
                          border: InputBorder.none,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // 2. Load Details
              const Text('Load Details', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _goodsController,
                      decoration: const InputDecoration(
                        labelText: 'Goods Type',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.inventory_2),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: TextField(
                      controller: _weightController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        labelText: 'Weight (Tons)',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.scale),
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 20),

              // 3. Nearby Lorries
              const Text('Available Nearby', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 10),
              SizedBox(
                height: 120,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: _nearbyLorries.length,
                  itemBuilder: (ctx, i) {
                    final lorry = _nearbyLorries[i];
                    return Container(
                      width: 160,
                      margin: const EdgeInsets.only(right: 10),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.blue.shade50,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.blue.shade100),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.local_shipping, size: 40, color: AppColors.userPrimary),
                          const SizedBox(height: 8),
                          Text(lorry['type'], style: const TextStyle(fontWeight: FontWeight.bold)),
                          Text('${lorry['capacity']} • ${lorry['eta']}'),
                        ],
                      ),
                    );
                  },
                ),
              ),

              const SizedBox(height: 30),

              // 4. Action Button
              ElevatedButton(
                onPressed: _bookLorry,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.userPrimary,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                child: const Text(
                  'FIND LORRY',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
