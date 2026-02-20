import { useState } from 'react';
import { Mail, MessageSquare, Bell } from 'lucide-react';

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
        <div className="p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-slate-800">Notification Channels</h2>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-lg text-slate-800">Alert Types</h3>
                        <p className="text-sm text-slate-500">Configure which events trigger an alert.</p>
                    </div>
                </div>
                <div className="divide-y divide-slate-100">
                    {[
                        { id: 'budget_alerts', label: 'Budget Exceeded', desc: 'Notify when trip expenses go over budget' },
                        { id: 'route_deviations', label: 'Route Deviations', desc: 'Alert if driver goes off-route > 5km' },
                        { id: 'maintenance_reminders', label: 'Maintenance Due', desc: 'Weekly digest of expiring documents' },
                        { id: 'driver_inactive', label: 'Driver Inactivity', desc: 'Alert if driver is idle for > 2 hours on duty' },
                    ].map(item => (
                        <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                            <div>
                                <h4 className="font-medium text-slate-700">{item.label}</h4>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                            </div>
                            <button
                                onClick={() => toggle(item.id)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${settings[item.id] ? 'bg-blue-600' : 'bg-slate-200'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${settings[item.id] ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-lg text-slate-800">Delivery Channels</h3>
                        <p className="text-sm text-slate-500">How you want to be notified.</p>
                    </div>
                </div>
                <div className="divide-y divide-slate-100">
                    <div className="p-4 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Bell size={20} /></div>
                            <div>
                                <h4 className="font-medium text-slate-700">Push Notifications</h4>
                                <p className="text-xs text-slate-500">Instant alerts on web & mobile</p>
                            </div>
                        </div>
                        <button onClick={() => toggle('push_channel')} className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.push_channel ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.push_channel ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>

                    <div className="p-4 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><MessageSquare size={20} /></div>
                            <div>
                                <h4 className="font-medium text-slate-700">SMS Alerts</h4>
                                <p className="text-xs text-slate-500">Critical alerts only (Charges apply)</p>
                            </div>
                        </div>
                        <button onClick={() => toggle('sms_channel')} className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.sms_channel ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.sms_channel ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>

                    <div className="p-4 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Mail size={20} /></div>
                            <div>
                                <h4 className="font-medium text-slate-700">Email Digest</h4>
                                <p className="text-xs text-slate-500">Daily summary at 8:00 AM</p>
                            </div>
                        </div>
                        <button onClick={() => toggle('email_channel')} className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.email_channel ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.email_channel ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
