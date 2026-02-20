import { useState, useEffect } from 'react';
import { fetchData, postData, updateData } from '../services/api';
import {
    Shield, ShieldCheck, ShieldAlert, Lock, UserPlus,
    Save, RotateCcw, ChevronRight, Check, X, History,
    LayoutDashboard, Truck, Users, Calendar, Wallet, FileText, Settings, Bell,
    Search, UserCheck, Activity, Fingerprint, Crown, Info, HardDrive
} from 'lucide-react';

const MODULES = [
    'Dashboard Access', 'Lorry Management', 'Driver Management',
    'Booking Management', 'Trip Scheduling', 'Expense & Budget Review',
    'Financial Reports', 'Analytics & Reports', 'System Settings',
    'Notification Management'
];

const PERMISSIONS = ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Assign', 'Export'];

const moduleIcons = {
    'Dashboard Access': <LayoutDashboard size={18} />,
    'Lorry Management': <Truck size={18} />,
    'Driver Management': <Users size={18} />,
    'Booking Management': <FileText size={18} />,
    'Trip Scheduling': <Calendar size={18} />,
    'Expense & Budget Review': <Wallet size={18} />,
    'Financial Reports': <FileText size={18} />,
    'Analytics & Reports': <Activity size={18} />,
    'System Settings': <Settings size={18} />,
    'Notification Management': <Bell size={18} />,
};

const moduleColors = {
    'Dashboard Access': 'text-blue-600 bg-blue-50',
    'Lorry Management': 'text-indigo-600 bg-indigo-50',
    'Driver Management': 'text-emerald-600 bg-emerald-50',
    'Booking Management': 'text-violet-600 bg-violet-50',
    'Trip Scheduling': 'text-amber-600 bg-amber-50',
    'Expense & Budget Review': 'text-rose-600 bg-rose-50',
    'Financial Reports': 'text-sky-600 bg-sky-50',
    'Analytics & Reports': 'text-fuchsia-600 bg-fuchsia-50',
    'System Settings': 'text-slate-600 bg-slate-50',
    'Notification Management': 'text-orange-600 bg-orange-50',
};

export default function RolesPermissions() {
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [matrix, setMatrix] = useState({});
    const [loading, setLoading] = useState(true);
    const [auditLogs, setAuditLogs] = useState([]);
    const [showLogs, setShowLogs] = useState(false);
    const [activeTab, setActiveTab] = useState('permissions'); // permissions or members
    const [roleMembers, setRoleMembers] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [rolesData, logsData, allUsers] = await Promise.all([
                fetchData('roles'),
                fetchData('roles/audit/logs'),
                fetchData('users')
            ]);
            setRoles(rolesData);
            setAuditLogs(logsData);
            setAvailableUsers(allUsers);
            if (rolesData.length > 0 && !selectedRole) {
                handleSelectRole(rolesData[0].id);
            }
        } catch (err) {
            console.error('Error loading roles:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectRole = async (id) => {
        try {
            const [roleData, members] = await Promise.all([
                fetchData(`roles/${id}`),
                fetchData(`roles/${id}/members`)
            ]);
            setSelectedRole(roleData);
            setMatrix(roleData.matrix || {});
            setRoleMembers(members);
        } catch (err) {
            console.error('Error fetching role details:', err);
        }
    };

    const togglePermission = (module, permission) => {
        setMatrix(prev => ({
            ...prev,
            [module]: {
                ...prev[module],
                [permission]: !prev[module]?.[permission]
            }
        }));
    };

    const handleSave = async () => {
        try {
            await updateData(`roles/${selectedRole.id}`, {
                name: selectedRole.name,
                description: selectedRole.description,
                status: selectedRole.status,
                matrix
            });
            loadData();
            const toast = document.createElement('div');
            toast.className = 'fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl z-[100] animate-in slide-in-from-bottom-4 duration-500 font-semibold border border-slate-800';
            toast.innerHTML = '<div class="flex items-center gap-3"><div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div> Permissions Updated Successfully</div>';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        } catch (err) {
            console.error('Error saving permissions:', err);
        }
    };

    const handleAssignUser = async (userId) => {
        try {
            await postData(`roles/${selectedRole.id}/assign`, { userIds: [userId] });
            handleSelectRole(selectedRole.id);
        } catch (err) {
            console.error('Error assigning user:', err);
        }
    };

    const handleCreateRole = async () => {
        const name = prompt("Enter Role Name:");
        if (!name) return;
        try {
            await postData('roles', { name, description: "New access level for organizational staff", permissions: {} });
            loadData();
        } catch (err) {
            console.error('Error creating role:', err);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p className="text-xs font-semibold text-slate-500">Loading Access Controls...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50 font-sans pb-20">
            {/* Header Area */}
            <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-[1600px] mx-auto px-8 py-5 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                            <Shield className="text-indigo-600" size={24} />
                            Roles & Permissions
                        </h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-medium text-slate-400">Security Configuration</span>
                            <ChevronRight size={12} className="text-slate-300" />
                            <span className="text-[11px] font-semibold text-indigo-500">User Access Control</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            <button
                                onClick={() => setShowLogs(false)}
                                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold transition-all ${!showLogs ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Lock size={14} /> Management
                            </button>
                            <button
                                onClick={() => setShowLogs(true)}
                                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold transition-all ${showLogs ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <History size={14} /> Audit Trail
                            </button>
                        </div>
                        <button
                            onClick={handleCreateRole}
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all font-semibold text-xs"
                        >
                            <Plus size={16} /> New Role
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-8 mt-8">
                {!showLogs ? (
                    <div className="grid grid-cols-12 gap-8">
                        {/* ROLES SIDEBAR */}
                        <div className="col-span-12 xl:col-span-3 space-y-6">
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-slate-100">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Select Role</h3>
                                    <div className="relative">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1-2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search roles..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm font-medium text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="p-2 space-y-1">
                                    {roles.map(role => (
                                        <button
                                            key={role.id}
                                            onClick={() => handleSelectRole(role.id)}
                                            className={`w-full group p-3.5 rounded-xl transition-all flex flex-col items-start ${selectedRole?.id === role.id
                                                    ? 'bg-indigo-50 text-indigo-700'
                                                    : 'text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between w-full mb-1">
                                                <div className="flex items-center gap-2.5">
                                                    {role.name === 'Super Admin' ? <Crown size={15} className="text-amber-500 fill-amber-50" /> : <ShieldCheck size={15} className="text-indigo-400" />}
                                                    <span className="text-[13px] font-bold">{role.name}</span>
                                                </div>
                                                <div className={`w-1.5 h-1.5 rounded-full ${role.status === 'active' ? 'bg-emerald-500' : 'bg-rose-400'}`} />
                                            </div>
                                            <p className={`text-[11px] font-medium text-left line-clamp-1 ${selectedRole?.id === role.id ? 'text-indigo-500/80' : 'text-slate-400'}`}>
                                                {role.description || 'Standard access level'}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* STATS INFO */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                        <Info size={20} />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-800">RBAC Policy</h4>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                    Permissions are applied instantly to all users assigned to this role. Audit logs will record who modified these settings.
                                </p>
                                <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Last Update</p>
                                        <p className="text-xs font-bold text-slate-700">Today</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Protected</p>
                                        <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                            <Check size={12} /> Active
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CONTENT AREA */}
                        <div className="col-span-12 xl:col-span-9">
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                                {/* TAB HEADER */}
                                <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            {selectedRole?.name === 'Super Admin' ? <Crown size={28} /> : <ShieldCheck size={28} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-xl font-bold text-slate-800">{selectedRole?.name}</h3>
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded-md tracking-wider">Default Role</span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2">
                                                <button
                                                    onClick={() => setActiveTab('permissions')}
                                                    className={`text-xs font-bold pb-2 transition-all border-b-2 ${activeTab === 'permissions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                                                >
                                                    Rights Matrix
                                                </button>
                                                <button
                                                    onClick={() => setActiveTab('members')}
                                                    className={`text-xs font-bold pb-2 transition-all border-b-2 ${activeTab === 'members' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                                                >
                                                    Assigned Members ({roleMembers.length})
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2.5">
                                        <button onClick={loadData} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors">
                                            <RotateCcw size={18} />
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={activeTab !== 'permissions'}
                                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <Save size={16} /> Save Changes
                                        </button>
                                    </div>
                                </div>

                                {/* TAB CONTENT */}
                                <div className="flex-1 overflow-auto">
                                    {activeTab === 'permissions' ? (
                                        <div className="p-6">
                                            <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="bg-slate-50/50">
                                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Module</th>
                                                            {PERMISSIONS.map(p => (
                                                                <th key={p} className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 font-mono">{p}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50">
                                                        {MODULES.map(mod => (
                                                            <tr key={mod} className="hover:bg-slate-50/30 group transition-all">
                                                                <td className="px-6 py-5">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${moduleColors[mod]}`}>
                                                                            {moduleIcons[mod]}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm font-bold text-slate-700">{mod}</p>
                                                                            <p className="text-[10px] font-medium text-slate-400">Access Control</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                {PERMISSIONS.map(perm => {
                                                                    const isChecked = matrix[mod]?.[perm];
                                                                    return (
                                                                        <td key={perm} className="px-4 py-5 text-center">
                                                                            <button
                                                                                onClick={() => togglePermission(mod, perm)}
                                                                                className={`w-10 h-5 rounded-full transition-all duration-300 mx-auto relative ${isChecked ? 'bg-indigo-600' : 'bg-slate-200'
                                                                                    }`}
                                                                            >
                                                                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${isChecked ? 'left-5.5' : 'left-0.5'}`} />
                                                                                <div className={`absolute left-5.5 hidden`}></div> {/* spacer fix */}
                                                                                {/* Using a simplified left position for the toggle */}
                                                                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${isChecked ? 'translate-x-5' : 'translate-x-0'}`} />
                                                                            </button>
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-8">
                                            <div className="mb-8 flex gap-4 max-w-xl">
                                                <div className="flex-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">Enroll New Member</label>
                                                    <div className="relative">
                                                        <select
                                                            onChange={(e) => e.target.value && handleAssignUser(e.target.value)}
                                                            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 shadow-sm appearance-none"
                                                        >
                                                            <option value="">Choose available user...</option>
                                                            {availableUsers.filter(u => u.RoleId !== selectedRole.id).map(user => (
                                                                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                                                            ))}
                                                        </select>
                                                        <ChevronRight size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
                                                {roleMembers.map(member => (
                                                    <div key={member.id} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-indigo-200 transition-all shadow-sm">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 font-bold border border-slate-100">
                                                                {member.name.substring(0, 1).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-800">{member.name}</p>
                                                                <p className="text-[11px] font-medium text-slate-400">{member.email}</p>
                                                            </div>
                                                        </div>
                                                        <button className="text-slate-300 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50">
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                                {roleMembers.length === 0 && (
                                                    <div className="col-span-full py-16 flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                                                        <Users size={32} className="text-slate-200 mb-3" />
                                                        <p className="text-sm font-bold text-slate-400">No members assigned to this role</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center mr-0.5">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded bg-indigo-600" />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Authorized</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded border-2 border-slate-200 bg-white" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Restricted</span>
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-semibold text-slate-400 tracking-wider">
                                        Active Security Protocol 2.4.0
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
                        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                                <Activity size={20} className="text-indigo-600" />
                                System Audit Log
                            </h3>
                            <p className="text-xs font-medium text-slate-500 mt-1">Reviewing policy changes and member assignments across the security suite.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-4">Timestamp</th>
                                        <th className="px-8 py-4">Action</th>
                                        <th className="px-8 py-4">Administrator</th>
                                        <th className="px-8 py-4">Module</th>
                                        <th className="px-8 py-4">Log Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-xs">
                                    {auditLogs.map((log, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-4 text-slate-500 font-medium">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </td>
                                            <td className="px-8 py-4">
                                                <span className={`px-2 py-0.5 rounded-md font-bold text-[9px] uppercase ${log.action.includes('CREATE') ? 'bg-emerald-50 text-emerald-600' :
                                                        log.action.includes('UPDATE') ? 'bg-amber-50 text-amber-600' :
                                                            'bg-rose-50 text-rose-600'
                                                    }`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4">
                                                <span className="font-bold text-slate-700">{log.performedBy}</span>
                                            </td>
                                            <td className="px-8 py-4 font-bold text-slate-500 uppercase tracking-tight opacity-70">{log.module}</td>
                                            <td className="px-8 py-4 text-slate-600 font-medium italic">{log.details}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <footer className="mt-16 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest px-12">
                <div className="flex items-center gap-3">
                    <Shield size={14} className="text-indigo-400 opacity-50" />
                    <span>LORIO ACCESS GATEWAY</span>
                </div>
                <div>© 2026 Fleet Enterprise Solutions</div>
            </footer>
        </div>
    );
}

const Plus = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)
