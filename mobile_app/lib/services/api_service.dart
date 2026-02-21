import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  // Use 10.0.2.2 for Android Emulator, localhost for iOS/Web
  // For physical device, use your machine's local IP (e.g., 192.168.1.5)
  static const String baseUrl = 'http://10.0.2.2:5000/api'; 
  
  // -- Auth --
  static Future<Map<String, dynamic>> login(String email, String password, String role) async {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password, 'role': role}),
      );
      
      if (response.statusCode == 200) {
          final data = jsonDecode(response.body);
          // Save token or user info if needed
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('user', jsonEncode(data['user']));
          return data;
      } else {
        throw Exception('Login Failed');
      }
  }

  static Future<Map<String, dynamic>> signup(String name, String email, String password, String role) async {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/signup'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'name': name, 'email': email, 'password': password, 'role': role, 'phone': '9999999999'}),
      );
      
      if (response.statusCode == 201) {
          final data = jsonDecode(response.body);
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('user', jsonEncode(data['user']));
          return data;
      } else {
          throw Exception('Signup Failed: ${response.body}');
      }
  }

  // -- Lorries --
  static Future<List<dynamic>> getLorries() async {
    final response = await http.get(Uri.parse('$baseUrl/lorries'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load lorries');
    }
  }

  // -- Trips --
  static Future<List<dynamic>> getTrips() async {
    final response = await http.get(Uri.parse('$baseUrl/trips'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load trips');
    }
  }

  // -- Create Booking --
   static Future<void> createBooking(Map<String, dynamic> bookingData) async {
       final response = await http.post(
          Uri.parse('$baseUrl/bookings'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode(bookingData),
       );
       if (response.statusCode != 201) {
           throw Exception('Failed to create booking');
       }
   }

   static Future<List<dynamic>> getBookings(int userId) async {
       final response = await http.get(Uri.parse('$baseUrl/bookings?userId=$userId'));
       if (response.statusCode == 200) {
           return jsonDecode(response.body);
       } else {
           throw Exception('Failed to fetch bookings');
   }

   // -- Update Location (Live Driver Tracking) --
   static Future<void> updateLorryLocation(int lorryId, String location) async {
       final response = await http.post(
           Uri.parse('$baseUrl/lorries/$lorryId/location'),
           headers: {'Content-Type': 'application/json'},
           body: jsonEncode({'location': location}),
       );
       if (response.statusCode != 200) {
           throw Exception('Failed to update lorry location');
       }
   }
}
