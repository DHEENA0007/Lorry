import { useState } from 'react';
import { User, Lock, Bell, Moon } from 'lucide-react';

export default function Settings() {
    const [notifications, setNotifications] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-slate-800">Settings</h2>

            <div className="max-w-4xl mx-auto space-y-8">

                {/* Profile Settings */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                        <User className="text-blue-600" size={24} />
                        <h3 className="text-lg font-semibold text-slate-800">Profile Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input type="text" className="w-full px-4 py-2 border rounded-lg bg-slate-50" value="Super Admin" readOnly />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input type="email" className="w-full px-4 py-2 border rounded-lg bg-slate-50" value="admin@yoyo.com" readOnly />
                        </div>
                    </div>
                </div>

                {/* Password Update */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                        <Lock className="text-blue-600" size={24} />
                        <h3 className="text-lg font-semibold text-slate-800">Security</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                            <input type="password" className="w-full px-4 py-2 border rounded-lg" placeholder="••••••••" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                            <input type="password" className="w-full px-4 py-2 border rounded-lg" placeholder="••••••••" />
                        </div>
                        <button className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium">Update Password</button>
                    </div>
                </div>

                {/* Preferences */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                        <Bell className="text-blue-600" size={24} />
                        <h3 className="text-lg font-semibold text-slate-800">Preferences</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-slate-800">Push Notifications</h4>
                                <p className="text-sm text-slate-500">Receive alerts for new bookings and trip updates.</p>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications ? 'bg-blue-600' : 'bg-slate-300'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-slate-800">Email Alerts</h4>
                                <p className="text-sm text-slate-500">Get daily summary reports via email.</p>
                            </div>
                            <button
                                onClick={() => setEmailAlerts(!emailAlerts)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${emailAlerts ? 'bg-blue-600' : 'bg-slate-300'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${emailAlerts ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <div>
                                <h4 className="font-medium text-slate-800">Dark Mode</h4>
                                <p className="text-sm text-slate-500">Switch between light and dark themes.</p>
                            </div>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${darkMode ? 'bg-blue-600' : 'bg-slate-300'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
