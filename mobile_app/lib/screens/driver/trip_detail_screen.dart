import 'package:flutter/material.dart';
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
  
  void _updateStatus(String status) async {
     // TODO: Add status update API in service
     ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Status updated mock!')));
     Navigator.pop(context);
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
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.driverPrimary),
                    onPressed: () => _updateStatus('In Progress'), 
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
