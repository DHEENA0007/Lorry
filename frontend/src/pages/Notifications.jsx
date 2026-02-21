import { useState } from 'react';
import { Mail, MessageSquare, Bell, ChevronRight, SlidersHorizontal } from 'lucide-react';

export default function Notifications() {
    const [settings, setSettings] = useState({
        budget_alerts: true,
        route_deviations: true,
        maintenance_reminders: false,
        driver_inactive: true,
        booking_confirmations: true,
        push_channel: true,
        sms_channel: false,
        email_channel: true,
    });

    const toggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans">
            <header className="flex justify-between items-end mb-10 max-w-4xl mx-auto">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] bg-orange-50 px-2 py-1 rounded-md border border-orange-100">System Preferences</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Notification Channels</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-semibold text-slate-400">Settings</span>
                        <ChevronRight size={12} className="text-slate-300" />
                        <span className="text-xs font-bold text-slate-800">Alerts & Digests</span>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-bl-full pointer-events-none" />
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-600 shadow-sm border border-slate-100">
                                <SlidersHorizontal size={24} className="text-orange-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 tracking-tight">Alert Types</h3>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Configure which events trigger an alert.</p>
                            </div>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {[
                            { id: 'budget_alerts', label: 'Budget Exceeded', desc: 'Notify when trip expenses go over budget', icon: '💰' },
                            { id: 'route_deviations', label: 'Route Deviations', desc: 'Alert if driver goes off-route > 5km', icon: '🗺️' },
                            { id: 'maintenance_reminders', label: 'Maintenance Due', desc: 'Weekly digest of expiring documents', icon: '🔧' },
                            { id: 'driver_inactive', label: 'Driver Inactivity', desc: 'Alert if driver is idle for > 2 hours on duty', icon: '😴' },
                        ].map(item => (
                            <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl">{item.icon}</div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-800 group-hover:text-orange-600 transition-colors">{item.label}</h4>
                                        <p className="text-xs font-medium text-slate-500 mt-1">{item.desc}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggle(item.id)}
                                    className={`w-14 h-7 rounded-full p-1 transition-colors relative flex items-center shadow-inner ${settings[item.id] ? 'bg-orange-500' : 'bg-slate-200'}`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${settings[item.id] ? 'translate-x-7' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 rounded-bl-full pointer-events-none" />
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-600 shadow-sm border border-slate-100">
                                <Bell size={24} className="text-slate-800" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 tracking-tight">Delivery Channels</h3>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">How you want to be notified.</p>
                            </div>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-50">
                        <div className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="text-2xl">🔔</div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-800 group-hover:text-orange-600 transition-colors">Push Notifications</h4>
                                    <p className="text-xs font-medium text-slate-500 mt-1">Instant alerts on web & mobile</p>
                                </div>
                            </div>
                            <button onClick={() => toggle('push_channel')} className={`w-14 h-7 rounded-full p-1 transition-colors relative flex items-center shadow-inner ${settings.push_channel ? 'bg-orange-500' : 'bg-slate-200'}`}>
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${settings.push_channel ? 'translate-x-7' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <div className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="text-2xl">📱</div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-800 group-hover:text-orange-600 transition-colors">SMS Alerts</h4>
                                    <p className="text-xs font-medium text-slate-500 mt-1">Critical alerts only (Charges apply)</p>
                                </div>
                            </div>
                            <button onClick={() => toggle('sms_channel')} className={`w-14 h-7 rounded-full p-1 transition-colors relative flex items-center shadow-inner ${settings.sms_channel ? 'bg-orange-500' : 'bg-slate-200'}`}>
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${settings.sms_channel ? 'translate-x-7' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <div className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="text-2xl">📧</div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-800 group-hover:text-orange-600 transition-colors">Email Digest</h4>
                                    <p className="text-xs font-medium text-slate-500 mt-1">Daily summary at 8:00 AM</p>
                                </div>
                            </div>
                            <button onClick={() => toggle('email_channel')} className={`w-14 h-7 rounded-full p-1 transition-colors relative flex items-center shadow-inner ${settings.email_channel ? 'bg-orange-500' : 'bg-slate-200'}`}>
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${settings.email_channel ? 'translate-x-7' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
