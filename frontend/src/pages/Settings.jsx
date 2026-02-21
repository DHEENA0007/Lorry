import { useState } from 'react';
import { User, Lock, Bell, Moon, ShieldCheck, Mail, ChevronRight } from 'lucide-react';

export default function Settings() {
    const [notifications, setNotifications] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans">
            <header className="flex justify-between items-end mb-10 max-w-4xl mx-auto">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] bg-orange-50 px-2 py-1 rounded-md border border-orange-100">Settings</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-semibold text-slate-400">Application</span>
                        <ChevronRight size={12} className="text-slate-300" />
                        <span className="text-xs font-bold text-slate-800">Global Preferences</span>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto space-y-8">

                {/* Profile Settings */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden relative group hover:border-orange-200 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-bl-full pointer-events-none" />
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-600 shadow-sm border border-slate-100 group-hover:text-orange-600 transition-colors">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 tracking-tight">Profile Information</h3>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Manage your personal details</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                            <input type="text" className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl bg-slate-50 text-slate-800 font-semibold focus:outline-none focus:border-orange-500 focus:bg-white transition-all" value="Super Admin" readOnly />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                            <input type="email" className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl bg-slate-50 text-slate-800 font-semibold focus:outline-none focus:border-orange-500 focus:bg-white transition-all" value="admin@yoyo.com" readOnly />
                        </div>
                    </div>
                </div>

                {/* Password Update */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden relative group hover:border-orange-200 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50/50 rounded-bl-full pointer-events-none" />
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-600 shadow-sm border border-slate-100 group-hover:text-rose-600 transition-colors">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 tracking-tight">Security Credentials</h3>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Update your authentication keys</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            <div className="md:col-span-1">
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Current Password</label>
                                <input type="password" className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-slate-800 font-medium focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all placeholder-slate-300" placeholder="••••••••" />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">New Password</label>
                                <input type="password" className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-slate-800 font-medium focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all placeholder-slate-300" placeholder="••••••••" />
                            </div>
                            <div className="md:col-span-1">
                                <button className="w-full py-3.5 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold text-[13px] transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98]">
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preferences */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden relative group hover:border-orange-200 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 rounded-bl-full pointer-events-none" />
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-600 shadow-sm border border-slate-100 group-hover:text-amber-500 transition-colors">
                                <Bell size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 tracking-tight">Preferences</h3>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">System behavior settings</p>
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-50">
                        <div className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="text-2xl">🔔</div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-800">Push Notifications</h4>
                                    <p className="text-xs font-medium text-slate-500 mt-1">Receive alerts for new bookings and trip updates.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`w-14 h-7 rounded-full p-1 transition-colors relative flex items-center shadow-inner ${notifications ? 'bg-orange-500' : 'bg-slate-200'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${notifications ? 'translate-x-7' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <div className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="text-2xl">📧</div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-800">Email Alerts</h4>
                                    <p className="text-xs font-medium text-slate-500 mt-1">Get daily summary reports via email.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setEmailAlerts(!emailAlerts)}
                                className={`w-14 h-7 rounded-full p-1 transition-colors relative flex items-center shadow-inner ${emailAlerts ? 'bg-orange-500' : 'bg-slate-200'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${emailAlerts ? 'translate-x-7' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <div className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="text-2xl">🌙</div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-800">Dark Mode</h4>
                                    <p className="text-xs font-medium text-slate-500 mt-1">Switch between light and dark themes.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`w-14 h-7 rounded-full p-1 transition-colors relative flex items-center shadow-inner ${darkMode ? 'bg-orange-500' : 'bg-slate-200'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
