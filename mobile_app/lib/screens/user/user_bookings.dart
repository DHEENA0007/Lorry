import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../../services/api_service.dart';
import '../../theme/app_colors.dart';

class UserBookings extends StatefulWidget {
  const UserBookings({super.key});

  @override
  State<UserBookings> createState() => _UserBookingsState();
}

class _UserBookingsState extends State<UserBookings> {
  List<dynamic> _bookings = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadBookings();
  }

  Future<void> _loadBookings() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userString = prefs.getString('user');
      final userId = userString != null ? jsonDecode(userString)['id'] : 1;
      
      // Need to add this method in ApiService if not exists, or call custom HTTP here 
      // For now, assume a GET with query param works or create getBookings(userId)
      // I'll update ApiService to include getBookings
      final allBookings = await ApiService.getBookings(userId);
      
      if (!mounted) return;
      setState(() {
        _bookings = allBookings;
        _isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading bookings: ${e.toString()}')),
      );
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Bookings', style: TextStyle(color: Colors.white)), backgroundColor: AppColors.userPrimary, iconTheme: const IconThemeData(color: Colors.white)),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _bookings.isEmpty
              ? const Center(child: Text('No bookings found.'))
              : ListView.builder(
                  itemCount: _bookings.length,
                  itemBuilder: (ctx, i) {
                    final booking = _bookings[i];
                    return Card(
                      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      child: ListTile(
                        leading: const Icon(Icons.inventory_2, color: AppColors.userPrimary),
                        title: Text('${booking['pickupLocation']} -> ${booking['dropLocation']}'),
                        subtitle: Text('Status: ${booking['status']} • Cost: \$${booking['estimatedCost']}'),
                        trailing: Icon(
                          booking['status'] == 'Approved' ? Icons.check_circle : 
                          booking['status'] == 'Rejected' ? Icons.cancel : Icons.hourglass_empty,
                          color: booking['status'] == 'Approved' ? AppColors.userSuccess : 
                                 booking['status'] == 'Rejected' ? AppColors.userError : AppColors.userAlert,
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
