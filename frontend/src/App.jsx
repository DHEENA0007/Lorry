import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Truck, LogOut, Settings, BarChart3, Map, Package,
  DollarSign, CheckSquare, ClipboardList, Bell, ShieldAlert, FileText, ChevronRight, Calendar, XCircle
} from 'lucide-react'
import { fetchData } from './services/api'

import LorryManagement from './pages/LorryManagement'
import TripManagement from './pages/TripManagement'
import Bookings from './pages/Bookings'
import DriverManagement from './pages/DriverManagement'
import Analytics from './pages/Analytics'
import SettingsPage from './pages/Settings'
import ExpenseManagement from './pages/ExpenseManagement'
import PODVerification from './pages/PODVerification'
import Financials from './pages/Financials'
import AuditLogs from './pages/AuditLogs'
import Notifications from './pages/Notifications'
import VehicleDocuments from './pages/VehicleDocuments'
import VehicleFinance from './pages/VehicleFinance'
import PerformanceReport from './pages/PerformanceReport'
import DocumentExpiryReport from './pages/DocumentExpiryReport'
import RolesPermissions from './pages/RolesPermissions'

// Reusable Components
const NavItem = ({ item, active, setActive }) => {
  const isActive = active === item.id;
  return (
    <button
      onClick={() => setActive(item.id)}
      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group relative border ${isActive
        ? 'bg-blue-50 border-blue-100 text-blue-700 shadow-sm translate-x-1'
        : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'
        }`}
    >
      {/* Active Indicator Line */}
      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-blue-600 rounded-r-lg" />}

      <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={`transition-colors duration-200 z-10 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
      <span className={`text-sm tracking-wide flex-1 text-left z-10 ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
      {isActive && <ChevronRight size={16} className="text-blue-400 z-10" />}
    </button>
  )
}

const Sidebar = ({ active, setActive }) => (
  <aside className="w-72 bg-white flex flex-col h-screen fixed left-0 top-0 shadow-2xl z-50 border-r border-slate-100 font-sans">

    {/* Logo Section */}
    <div className="p-8 pb-8 flex items-center gap-3.5">
      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 text-white shrink-0">
        <Truck size={24} strokeWidth={2.5} />
      </div>
      <div>
        <h1 className="text-xl font-extrabold text-slate-800 tracking-tight leading-none">Yoyo Trans</h1>
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Admin Portal</span>
      </div>
    </div>

    {/* Navigation */}
    <nav className="flex-1 px-4 space-y-8 overflow-y-auto py-2 custom-scrollbar no-scrollbar">

      {/* Operations Group */}
      <div>
        <div className="px-4 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Operations</div>
        <div className="space-y-1.5">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'bookings', icon: Package, label: 'Bookings & Orders' },
            { id: 'trips', icon: Map, label: 'Live Trips' },
            { id: 'drivers', icon: Users, label: 'Drivers & Staff' },
          ].map(item => <NavItem key={item.id} item={item} active={active} setActive={setActive} />)}
        </div>
      </div>

      {/* Fleet & Vehicles Group */}
      <div>
        <div className="px-4 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Fleet & Vehicles</div>
        <div className="space-y-1.5">
          {[
            { id: 'lorries', icon: Truck, label: 'Vehicles' },
            { id: 'v-docs', icon: FileText, label: 'Vehicle Documents' },
            { id: 'v-finance', icon: DollarSign, label: 'Vehicle Finance' },
            { id: 'v-performance', icon: BarChart3, label: 'Performance Report' },
            { id: 'v-expiry', icon: Calendar, label: 'Document Expiry Report' },
          ].map(item => <NavItem key={item.id} item={item} active={active} setActive={setActive} />)}
        </div>
      </div>

      {/* Finance Group */}
      <div>
        <div className="px-4 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Finance</div>
        <div className="space-y-1.5">
          {[
            { id: 'expenses', icon: DollarSign, label: 'Expenses' },
            { id: 'financials', icon: FileText, label: 'Reports & Ledger' },
            { id: 'pod', icon: CheckSquare, label: 'POD Verification' },
          ].map(item => <NavItem key={item.id} item={item} active={active} setActive={setActive} />)}
        </div>
      </div>

      {/* System Group */}
      <div>
        <div className="px-4 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">System</div>
        <div className="space-y-1.5">
          {[
            { id: 'analytics', icon: BarChart3, label: 'Analytics' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
            { id: 'roles', icon: ShieldAlert, label: 'Roles & Permissions' },
            { id: 'audit', icon: ShieldAlert, label: 'Audit Logs' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map(item => <NavItem key={item.id} item={item} active={active} setActive={setActive} />)}
        </div>
      </div>

    </nav>

    {/* User Profile / Logout */}
    <div className="p-4 border-t border-slate-100">
      <div className="bg-slate-50 rounded-2xl p-3.5 flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-colors border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
            SA
          </div>
          <div className="leading-tight">
            <div className="font-bold text-slate-700 text-sm">Super Admin</div>
            <div className="text-[11px] text-slate-500 font-medium">admin@yoyo.com</div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-white rounded-lg">
          <LogOut size={18} />
        </button>
      </div>
    </div>
  </aside>
)

const Dashboard = () => {
  const [stats, setStats] = useState({
    tripsFYTD: 0, tripsMTD: 0, pendingUnload: 0, pendingPOD: 0, pendingSettlement: 0, ewayExpired: 0,
    availableVehicles: 0, busyVehicles: 0, idleVehicles: 0, maintenanceVehicles: 0,
    overdueMaintenance: 0, dueMaintenance: 0, delayedMaintenance: 0,
    revenueMTD: 0, expensesMTD: 0, revenueFY: 0, expensesFY: 0, receivables: 0, payables: 0,
    emiDue: 0, emiOverdue: 0, emiPrevOverdue: 0,
    driversTotal: 0, driversWorking: 0, driversVacation: 0,
    docsDueMonth: 0, docsDueNext: 0, docsExpired: 0
  });
  const [activeTrips, setActiveTrips] = useState([]);
  const [chartData, setChartData] = useState({ monthlyProfit: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchData('dashboard');
        if (data) {
          setStats(prev => ({ ...prev, ...data.metrics }));
          setActiveTrips(data.recentActivity || []);
          setChartData(data.charts || { monthlyProfit: [] });
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const SectionHeader = ({ title, color }) => (
    <div className={`px-4 py-2 ${color} text-white text-[11px] font-bold rounded-t-xl flex justify-between items-center uppercase tracking-wider`}>
      <div className="flex items-center gap-2">
        <LayoutDashboard size={14} />
        {title}
      </div>
      <button className="opacity-60 hover:opacity-100 transition-opacity"><ChevronRight size={14} /></button>
    </div>
  );

  const MetricCard = ({ icon: Icon, title, value, colorClass, bgClass, isCurrency = true }) => (
    <div className={`p-4 rounded-xl border border-slate-100 bg-white flex items-center gap-4 group transition-all hover:shadow-md`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass}`}>
        <Icon size={22} className={colorClass} strokeWidth={2.5} />
      </div>
      <div className="flex-1">
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{title}</div>
        <div className={`text-xl font-extrabold ${colorClass}`}>
          {isCurrency && typeof value === 'number' ? `₹${value.toLocaleString()}` : value}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-slate-50/30 min-h-screen space-y-6">
      <header className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Main Dashboard</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time Performance Metrics</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Live Operations</span>
          </div>
        </div>
      </header>

      {/* Primary Grid: Operations & Vehicle Status */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Operations Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <SectionHeader title="Operations Overview" color="bg-blue-600" />
          <div className="p-4 grid grid-cols-2 gap-4">
            <MetricCard icon={ClipboardList} title="Total Trips FYTD" value={stats.tripsFYTD} colorClass="text-blue-700" bgClass="bg-blue-50" isCurrency={false} />
            <MetricCard icon={Calendar} title="Total Trips MTD" value={stats.tripsMTD} colorClass="text-emerald-600" bgClass="bg-emerald-50" isCurrency={false} />
            <div className="col-span-2 grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-dotted border-slate-200 flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Pending Unload</span>
                <span className="text-lg font-black text-slate-700">{stats.pendingUnload}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-dotted border-slate-200 flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Pending POD Upload</span>
                <span className="text-lg font-black text-slate-700">{stats.pendingPOD}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Status Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <SectionHeader title="Vehicle Status Overview" color="bg-indigo-600" />
          <div className="p-4 grid grid-cols-2 gap-4">
            <MetricCard icon={Truck} title="Available Vehicles" value={stats.availableVehicles} colorClass="text-indigo-600" bgClass="bg-indigo-50" isCurrency={false} />
            <MetricCard icon={Package} title="Busy Vehicles" value={stats.busyVehicles} colorClass="text-green-600" bgClass="bg-green-50" isCurrency={false} />
            <MetricCard icon={Map} title="Idle Vehicles" value={stats.idleVehicles} colorClass="text-amber-600" bgClass="bg-amber-50" isCurrency={false} />
            <MetricCard icon={Settings} title="Under Maintenance" value={stats.maintenanceVehicles} colorClass="text-rose-600" bgClass="bg-rose-50" isCurrency={false} />
          </div>
        </div>
      </div>

      {/* Secondary Grid: Maintenance & Financials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Maintenance Alerts */}
        <div className="bg-amber-500 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-2 text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-2 font-black "><ShieldAlert size={14} /> Maintenance Alerts</span>
          </div>
          <div className="p-4 flex-1 grid grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-xl p-3 text-white border border-white/20">
              <div className="text-[10px] font-bold opacity-80 uppercase">Overdue</div>
              <div className="text-2xl font-black">{stats.overdueMaintenance}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-white border border-white/20">
              <div className="text-[10px] font-bold opacity-80 uppercase">Due Soon</div>
              <div className="text-2xl font-black">{stats.dueMaintenance}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-white border border-white/20">
              <div className="text-[10px] font-bold opacity-80 uppercase">Delayed</div>
              <div className="text-2xl font-black">{stats.delayedMaintenance}</div>
            </div>
          </div>
        </div>

        {/* Revenue & Expenses Summary */}
        <div className="bg-emerald-600 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-2 text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-2 font-black "><DollarSign size={14} /> Revenue & Expenses</span>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-xl p-3 text-white border border-white/20">
              <div className="text-[10px] font-bold opacity-80 uppercase">MTD Revenue</div>
              <div className="text-xl font-black">₹{stats.revenueMTD.toLocaleString()}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-white border border-white/20">
              <div className="text-[10px] font-bold opacity-80 uppercase">MTD Expenses</div>
              <div className="text-xl font-black">₹{stats.expensesMTD.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Blocks: EMI, Driver, Documents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* EMI Status */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <SectionHeader title="EMI Status" color="bg-rose-500" />
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center p-3 bg-rose-50 rounded-xl">
              <span className="text-[11px] font-bold text-rose-800 uppercase">Due This Month</span>
              <span className="text-lg font-black text-rose-700">₹{stats.emiDue}</span>
            </div>
            <div className="flex justify-between items-center p-3 border border-rose-100 rounded-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Prev. Overdue</span>
              <span className="text-lg font-black text-slate-700">₹{stats.emiPrevOverdue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Driver Status */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <SectionHeader title="Driver Status" color="bg-purple-600" />
          <div className="p-4 grid grid-cols-3 gap-2">
            <div className="bg-slate-50 p-2 rounded-xl text-center border border-slate-100">
              <div className="text-xl font-black text-slate-800">{stats.driversTotal}</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase">Total</div>
            </div>
            <div className="bg-emerald-50 p-2 rounded-xl text-center border border-emerald-100">
              <div className="text-xl font-black text-emerald-700">{stats.driversWorking}</div>
              <div className="text-[9px] font-bold text-emerald-600 uppercase">Duty</div>
            </div>
            <div className="bg-rose-50 p-2 rounded-xl text-center border border-rose-100">
              <div className="text-xl font-black text-rose-700">{stats.driversVacation}</div>
              <div className="text-[9px] font-bold text-rose-600 uppercase">Leave</div>
            </div>
          </div>
        </div>

        {/* Document Status */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <SectionHeader title="Document Status" color="bg-pink-500" />
          <div className="p-4 space-y-3">
            <div className="flex justify-between text-[11px] font-bold uppercase text-slate-400">
              <span>Expiry Pipeline</span>
              <span className="text-slate-800">{stats.docsExpired} Expired</span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-rose-500 w-1/3 border-r border-white/20"></div>
              <div className="h-full bg-amber-500 w-1/3 border-r border-white/20"></div>
              <div className="h-full bg-emerald-500 w-1/3"></div>
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Pending Review: {stats.docsDueMonth}</span>
              <button className="text-[10px] font-bold text-pink-600 hover:underline uppercase">View All</button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Profit Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-[350px]">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Monthly Profit Trend</h3>
          <div className="flex-1">
            <div className="flex items-end justify-around h-full pt-10 pb-2 px-4 gap-4">
              {chartData.monthlyProfit && chartData.monthlyProfit.length > 0 ? chartData.monthlyProfit.map((bar, i) => {
                const maxVal = Math.max(...chartData.monthlyProfit.map(p => Math.abs(p.profit)), 1);
                const height = (Math.abs(bar.profit) / maxVal) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                    <div className="relative w-full flex flex-col items-center h-full justify-end">
                      <div className={`absolute -top-10 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold`}>₹{bar.profit.toLocaleString()}</div>
                      <div
                        className={`w-12 sm:w-16 rounded-t-xl transition-all duration-500 ${bar.profit >= 0 ? 'bg-indigo-600 shadow-lg shadow-indigo-200' : 'bg-rose-500 shadow-lg shadow-rose-200'}`}
                        style={{ height: `${height}%`, minHeight: bar.profit !== 0 ? '4px' : '0' }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{bar.name}</span>
                  </div>
                )
              }) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 text-[10px] font-bold uppercase tracking-widest border-2 border-dashed border-slate-50 rounded-xl">No Profit Data Yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Active Trip Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-[350px]">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Trip Distribution</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className={`relative w-48 h-48 rounded-full border-[20px] shadow-inner transition-all duration-500 ${stats.tripsMTD > 0 ? 'border-slate-50 border-t-indigo-500 border-r-blue-500 border-b-emerald-500' : 'border-slate-50'}`}>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="text-3xl font-black text-slate-800">{stats.tripsMTD}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Total MTD</div>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-blue-500"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Trip Ledger */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              <Calendar size={18} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Active Trip Ledger</h3>
          </div>
          <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">Export Excel</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white text-[11px] font-black uppercase text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Trip Info</th>
                <th className="px-6 py-4">Route Details</th>
                <th className="px-6 py-4">Fleet & Driver</th>
                <th className="px-6 py-4 text-right">Freight Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activeTrips.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No active records found</td></tr>
              ) : (
                activeTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-black text-slate-800 text-sm">#{trip.id}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">{new Date(trip.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700 text-sm">{trip.source}</span>
                        <ChevronRight size={12} className="text-slate-300" />
                        <span className="font-bold text-slate-700 text-sm">{trip.destination}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 text-xs">{trip.Driver?.name || 'Unassigned'}</div>
                      <div className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">{trip.Lorry?.vehicleNumber || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-slate-800">
                      ₹{(trip.budget || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${trip.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        trip.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <Router>
      <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans flex text-base">
        <Sidebar active={activeTab} setActive={setActiveTab} />
        <main className="ml-72 flex-1 min-h-screen">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'lorries' && <LorryManagement />}
          {activeTab === 'v-docs' && <VehicleDocuments />}
          {activeTab === 'v-finance' && <VehicleFinance />}
          {activeTab === 'v-performance' && <PerformanceReport />}
          {activeTab === 'v-expiry' && <DocumentExpiryReport />}
          {activeTab === 'drivers' && <DriverManagement />}
          {activeTab === 'trips' && <TripManagement />}
          {activeTab === 'bookings' && <Bookings />}

          {activeTab === 'expenses' && <ExpenseManagement />}
          {activeTab === 'pod' && <PODVerification />}
          {activeTab === 'financials' && <Financials />}

          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'notifications' && <Notifications />}
          {activeTab === 'roles' && <RolesPermissions />}
          {activeTab === 'audit' && <AuditLogs />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </Router>
  )
}

export default App
