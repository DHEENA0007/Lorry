import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Truck, LogOut, Settings, BarChart3, Map, Package,
  DollarSign, CheckSquare, ClipboardList, Bell, ShieldAlert, FileText, ChevronRight, Calendar, XCircle,
  Search, Menu
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
const NavItem = ({ item }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = item.id === 'dashboard' ? '/' : `/${item.id}`;
  const isActive = location.pathname === path;

  return (
    <button
      onClick={() => navigate(path)}
      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 group relative ${isActive
        ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30 border border-orange-500/50 translate-x-1'
        : 'bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
        }`}
    >
      {/* Active Indicator Line */}
      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1.5 bg-white rounded-r-full shadow-[0_0_12px_rgba(255,255,255,0.4)]" />}

      <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
      <span className={`text-sm tracking-tight flex-1 text-left ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
      {isActive && <ChevronRight size={14} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
    </button>
  )
}

const Sidebar = () => (
  <aside className="w-72 bg-slate-950 flex flex-col h-screen fixed left-0 top-0 shadow-2xl shadow-black/50 z-50 border-r border-slate-800 font-sans">

    {/* Logo Section */}
    <div className="p-8 pb-10 flex items-center gap-4">
      <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-600/20 text-white shrink-0 transform hover:rotate-3 transition-transform">
        <Truck size={28} strokeWidth={2.2} />
      </div>
      <div className="leading-none">
        <h1 className="text-xl font-bold text-white tracking-tight">Yoyo Trans</h1>
        <span className="text-[10px] font-semibold text-orange-500 uppercase tracking-[0.2em] mt-1.5 block">Logistics Pro</span>
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
          ].map(item => <NavItem key={item.id} item={item} />)}
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
          ].map(item => <NavItem key={item.id} item={item} />)}
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
          ].map(item => <NavItem key={item.id} item={item} />)}
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
          ].map(item => <NavItem key={item.id} item={item} />)}
        </div>
      </div>

    </nav>

    {/* User Profile / Logout */}
    <div className="p-6 border-t border-slate-800">
      <div className="bg-slate-900/50 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:bg-slate-800 transition-all border border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-orange-700 flex items-center justify-center text-white font-semibold text-sm border-2 border-slate-800 shadow-lg">
            SA
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-white text-sm">Super Admin</div>
            <div className="text-[10px] text-slate-400 font-medium tracking-tight">admin@yoyo.com</div>
          </div>
        </div>
        <button className="text-slate-500 hover:text-red-500 transition-colors p-2 hover:bg-slate-800 rounded-xl shadow-sm border border-transparent hover:border-slate-700">
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

  const SectionHeader = ({ title, color, icon: Icon = LayoutDashboard }) => {
    const textColor = color.includes('orange') ? 'text-orange-500' : color.includes('red') ? 'text-red-500' : 'text-slate-500';
    return (
      <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-[0.2em] flex items-center gap-3">
          <Icon size={16} className={textColor} /> {title}
        </h3>
      </div>
    );
  };

  const MetricCard = ({ icon: Icon, title, value, colorClass, bgClass, isCurrency = true }) => {
    const sideColorClass = colorClass.includes('orange') ? 'bg-orange-500' : colorClass.includes('red') ? 'bg-red-500' : colorClass.includes('slate-800') ? 'bg-slate-800' : 'bg-slate-500';
    return (
      <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col justify-between">
        <div className={`absolute top-0 left-0 w-2 h-full ${sideColorClass}`} />
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-2xl ${bgClass} transition-colors group-hover:bg-slate-100`}>
            <Icon size={20} className={colorClass} strokeWidth={2.5} />
          </div>
          <div className={`px-3 py-1 ${bgClass} rounded-full text-[9px] font-black ${colorClass} uppercase tracking-widest border border-slate-100`}>Metric</div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">{title}</p>
          <h3 className={`text-3xl font-black ${colorClass} tracking-tighter mb-2 pl-2`}>
            {isCurrency && typeof value === 'number' ? `₹${value.toLocaleString()}` : value}
          </h3>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen space-y-8 animate-fade-in relative z-10">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">System Overview</h2>
          <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            Real-time transport operations telemetry
          </p>
        </div>
        <div className="flex gap-4">
          <div className="px-5 py-3 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 group hover:shadow-md transition-all">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Live Status</span>
          </div>
        </div>
      </header>

      {/* Primary Grid: Operations & Vehicle Status */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Operations Summary */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 overflow-hidden group hover:border-orange-500/30 transition-all duration-500">
          <SectionHeader title="Operations Summary" color="text-orange-600" icon={ClipboardList} />
          <div className="p-8 grid grid-cols-2 gap-6 bg-slate-50/30 h-full">
            <MetricCard icon={ClipboardList} title="Total Trips FYTD" value={stats.tripsFYTD} colorClass="text-orange-600" bgClass="bg-orange-50" isCurrency={false} />
            <MetricCard icon={Calendar} title="Total Trips MTD" value={stats.tripsMTD} colorClass="text-slate-800" bgClass="bg-slate-100" isCurrency={false} />
            <div className="col-span-2 grid grid-cols-2 gap-6 mt-2">
              <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-center items-start group/item hover:border-orange-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Unload</span>
                <span className="text-3xl font-black text-slate-900 tracking-tighter">{stats.pendingUnload}</span>
              </div>
              <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-center items-start group/item hover:border-orange-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending POD</span>
                <span className="text-3xl font-black text-slate-900 tracking-tighter">{stats.pendingPOD}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Status */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 overflow-hidden group hover:border-orange-500/30 transition-all duration-500">
          <SectionHeader title="Vehicle Status" color="text-slate-600" icon={Truck} />
          <div className="p-8 grid grid-cols-2 gap-6 bg-slate-50/30 h-full">
            <MetricCard icon={Truck} title="Available" value={stats.availableVehicles} colorClass="text-slate-600" bgClass="bg-slate-50" isCurrency={false} />
            <MetricCard icon={Package} title="Busy" value={stats.busyVehicles} colorClass="text-slate-600" bgClass="bg-slate-50" isCurrency={false} />
            <MetricCard icon={Map} title="Idle" value={stats.idleVehicles} colorClass="text-red-500" bgClass="bg-red-50" isCurrency={false} />
            <MetricCard icon={Settings} title="Maintenance" value={stats.maintenanceVehicles} colorClass="text-red-500" bgClass="bg-red-50" isCurrency={false} />
          </div>
        </div>
      </div>

      {/* Secondary Grid: Maintenance & Financials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Maintenance Alerts */}
        <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden flex flex-col group hover:shadow-red-500/20 transition-all duration-500 relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-bl-full pointer-events-none" />
          <div className="px-8 py-6 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-between border-b border-white/10 relative z-10">
            <span className="flex items-center gap-3"><ShieldAlert size={18} /> Maintenance Alerts</span>
          </div>
          <div className="p-8 flex-1 grid grid-cols-3 gap-6 relative z-10">
            <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-6 text-white border border-white/20 hover:bg-white/20 transition-colors shadow-sm">
              <div className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-2">Overdue</div>
              <div className="text-3xl font-black tracking-tighter">{stats.overdueMaintenance}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-6 text-white border border-white/20 hover:bg-white/20 transition-colors shadow-sm">
              <div className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-2">Due Soon</div>
              <div className="text-3xl font-black tracking-tighter">{stats.dueMaintenance}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-6 text-white border border-white/20 hover:bg-white/20 transition-colors shadow-sm">
              <div className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-2">Delayed</div>
              <div className="text-3xl font-black tracking-tighter">{stats.delayedMaintenance}</div>
            </div>
          </div>
        </div>

        {/* Revenue & Expenses Summary */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden flex flex-col group hover:shadow-slate-800/20 transition-all duration-500 relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-full pointer-events-none" />
          <div className="px-8 py-6 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-between border-b border-white/10 relative z-10">
            <span className="flex items-center gap-3"><DollarSign size={18} className="text-emerald-400" /> Revenue & Expenses</span>
          </div>
          <div className="p-8 grid grid-cols-2 gap-6 relative z-10">
            <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-6 text-white border border-white/10 hover:bg-white/20 transition-colors shadow-sm">
              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">MTD Revenue</div>
              <div className="text-3xl font-black tracking-tighter text-emerald-400">₹{stats.revenueMTD.toLocaleString()}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-6 text-white border border-white/10 hover:bg-white/20 transition-colors shadow-sm">
              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">MTD Expenses</div>
              <div className="text-3xl font-black tracking-tighter text-red-400">₹{stats.expensesMTD.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Blocks: EMI, Driver, Documents */}
      {/* Status Blocks: EMI, Driver, Documents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* EMI Status */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 overflow-hidden relative group hover:border-orange-500/30 transition-all duration-500">
          <div className="absolute top-0 left-0 w-2 h-full bg-red-500" />
          <SectionHeader title="EMI Status" color="text-red-500" />
          <div className="p-8 space-y-4">
            <div className="flex justify-between items-center p-4 bg-red-50/50 rounded-2xl border border-red-100 transition-colors group-hover:bg-red-50">
              <span className="text-[10px] font-bold text-red-800 uppercase tracking-widest">Due This Month</span>
              <span className="text-xl font-black text-red-600">₹{stats.emiDue}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100 transition-colors group-hover:bg-slate-50">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Prev. Overdue</span>
              <span className="text-xl font-black text-slate-800">₹{stats.emiPrevOverdue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Driver Status */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 overflow-hidden relative group hover:border-orange-500/30 transition-all duration-500">
          <div className="absolute top-0 left-0 w-2 h-full bg-slate-600" />
          <SectionHeader title="Driver Status" color="text-slate-600" />
          <div className="p-8 grid grid-cols-3 gap-4">
            <div className="bg-slate-50/50 p-4 rounded-[1.5rem] text-center border border-slate-100 transition-all group-hover:bg-slate-50">
              <div className="text-2xl font-black text-slate-800 tracking-tighter">{stats.driversTotal}</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total</div>
            </div>
            <div className="bg-slate-50/50 p-4 rounded-[1.5rem] text-center border border-slate-100 transition-all group-hover:bg-slate-50">
              <div className="text-2xl font-black text-slate-700 tracking-tighter">{stats.driversWorking}</div>
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Duty</div>
            </div>
            <div className="bg-red-50/50 p-4 rounded-[1.5rem] text-center border border-red-100 transition-all group-hover:bg-red-50">
              <div className="text-2xl font-black text-red-600 tracking-tighter">{stats.driversVacation}</div>
              <div className="text-[9px] font-bold text-red-500 uppercase tracking-widest mt-1">Leave</div>
            </div>
          </div>
        </div>

        {/* Document Status */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 overflow-hidden relative group hover:border-orange-500/30 transition-all duration-500">
          <div className="absolute top-0 left-0 w-2 h-full bg-orange-500" />
          <SectionHeader title="Document Status" color="text-orange-500" />
          <div className="p-8 space-y-5">
            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500 tracking-widest">
              <span>Expiry Pipeline</span>
              <span className="text-red-500 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> {stats.docsExpired} Expired</span>
            </div>
            <div className="h-6 bg-slate-50 rounded-full overflow-hidden flex border border-slate-100">
              <div className="h-full bg-red-500 w-1/3 border-r border-white/20"></div>
              <div className="h-full bg-orange-400 w-1/3 border-r border-white/20"></div>
              <div className="h-full bg-emerald-400 w-1/3"></div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pending Review: <span className="text-slate-900">{stats.docsDueMonth}</span></span>
              <button className="text-[9px] font-black text-orange-600 hover:text-orange-700 hover:underline uppercase tracking-widest transition-colors">View All</button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Monthly Profit Trend */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 p-8 flex flex-col h-[450px]">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-[0.2em] mb-8 flex items-center gap-3"><BarChart3 size={16} className="text-orange-500" /> Monthly Profit Trend</h3>
          <div className="flex-1">
            <div className="flex items-end justify-around h-full pt-10 pb-2 px-4 gap-4">
              {chartData.monthlyProfit && chartData.monthlyProfit.length > 0 ? chartData.monthlyProfit.map((bar, i) => {
                const maxVal = Math.max(...chartData.monthlyProfit.map(p => Math.abs(p.profit)), 1);
                const height = (Math.abs(bar.profit) / maxVal) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-5 group cursor-pointer h-full justify-end">
                    <div className="relative w-full flex flex-col items-center h-full justify-end max-w-[48px]">
                      <div className={`absolute -top-12 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 font-bold shadow-xl pointer-events-none`}>₹{bar.profit.toLocaleString()}</div>
                      <div
                        className={`w-full rounded-t-xl transition-all duration-700 ease-out flex flex-col justify-end ${bar.profit >= 0 ? 'bg-orange-100 shadow-[0_-4px_20px_rgba(249,115,22,0.1)]' : 'bg-red-100 shadow-[0_-4px_20px_rgba(239,68,68,0.1)]'}`}
                        style={{ height: `${height}%`, minHeight: bar.profit !== 0 ? '4px' : '0' }}
                      >
                        <div className={`w-full rounded-t-xl ${bar.profit >= 0 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ height: '70%' }}></div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{bar.name}</span>
                  </div>
                )
              }) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em] border-2 border-dashed border-slate-50 rounded-3xl">No Profit Data Yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Active Trip Distribution */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 p-8 flex flex-col h-[450px]">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-[0.2em] mb-8 flex items-center gap-3"><BarChart3 size={16} className="text-orange-500" /> Trip Distribution</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className={`relative w-48 h-48 rounded-full border-[24px] shadow-inner transition-all duration-500 ${stats.tripsMTD > 0 ? 'border-slate-50 border-t-orange-500 border-r-slate-800 border-b-red-500' : 'border-slate-50'}`}>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="text-4xl font-black text-slate-900 tracking-tighter">{stats.tripsMTD}</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total MTD</div>
              </div>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-y-4 w-full px-6">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-sm bg-orange-500"></div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">In Progress</span>
                </div>
                <span className="text-xs font-black text-slate-900">-</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-sm bg-slate-800"></div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Scheduled</span>
                </div>
                <span className="text-xs font-black text-slate-900">-</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-sm bg-red-500"></div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Completed</span>
                </div>
                <span className="text-xs font-black text-slate-900">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Trips List */}
      <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 overflow-hidden group/table hover:border-orange-500/30 transition-colors duration-500 flex flex-col mb-4">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center gap-3">
            <FileText size={16} className="text-orange-500" /> Active Trips List
          </h3>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200/80 rounded-xl hover:bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-600 transition-all shadow-sm">
            <FileText size={14} />
            Export Data
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">
                <th className="px-10 py-6">Trip ID</th>
                <th className="px-10 py-6">Route</th>
                <th className="px-10 py-6">Driver / Vehicle</th>
                <th className="px-10 py-6 text-right">Value</th>
                <th className="px-10 py-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeTrips.length === 0 ? (
                <tr><td colSpan="5" className="px-10 py-24 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200">
                      <ClipboardList size={32} />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Registry is currently empty</p>
                  </div>
                </td></tr>
              ) : (
                activeTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-orange-50/30 transition-all group">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 transition-all group-hover:bg-white group-hover:shadow-sm">
                          <Navigation size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-[15px] tracking-tight mb-0.5">TRIP-{trip.id.toString().padStart(4, '0')}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{new Date(trip.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-700 text-sm">{trip.source}</span>
                          <span className="text-[10px] text-slate-400 font-medium">Origin</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5 px-2">
                          <ChevronRight size={14} className="text-orange-300" />
                          <div className="w-1 h-1 bg-orange-200 rounded-full"></div>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-700 text-sm">{trip.destination}</span>
                          <span className="text-[10px] text-slate-400 font-medium">Target</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-white shadow-sm">
                          {trip.Driver?.name?.substring(0, 2).toUpperCase() || 'NA'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 text-xs">{trip.Driver?.name || 'Unassigned'}</div>
                          <div className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">{trip.Lorry?.vehicleNumber || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right font-bold text-slate-900 text-sm">
                      ₹{(trip.budget || 0).toLocaleString()}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${trip.status === 'Completed' ? 'bg-slate-50 text-slate-600 border border-slate-100' :
                        trip.status === 'In Progress' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-red-50 text-red-600 border border-red-100'
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

const TopBar = () => (
  <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm flex items-center justify-between px-8 py-4 shrink-0">
    <div className="flex items-center gap-4 flex-1">
      <div className="relative w-80 lg:w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border border-slate-200/60 rounded-xl text-sm outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-slate-700 placeholder:text-slate-400"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
          <kbd className="px-2 py-1 bg-white border border-slate-200 rounded shadow-sm text-[9px] font-bold text-slate-400 uppercase">Ctrl</kbd>
          <kbd className="px-2 py-1 bg-white border border-slate-200 rounded shadow-sm text-[9px] font-bold text-slate-400 uppercase">K</kbd>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-3">
        <button className="relative p-2.5 text-slate-400 hover:text-slate-700 transition-colors bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-50 group-hover:border-slate-100 transition-colors"></span>
        </button>
      </div>
      <div className="h-8 w-px bg-slate-200"></div>
      <button className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-slate-900/20 group-hover:scale-105 transition-transform border-2 border-white">
          SA
        </div>
      </button>
    </div>
  </header>
);

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans flex text-base">
        <Sidebar />
        <main className="ml-72 flex-1 min-h-screen flex flex-col relative overflow-x-hidden">
          <TopBar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/lorries" element={<LorryManagement />} />
              <Route path="/v-docs" element={<VehicleDocuments />} />
              <Route path="/v-finance" element={<VehicleFinance />} />
              <Route path="/v-performance" element={<PerformanceReport />} />
              <Route path="/v-expiry" element={<DocumentExpiryReport />} />
              <Route path="/drivers" element={<DriverManagement />} />
              <Route path="/trips" element={<TripManagement />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/expenses" element={<ExpenseManagement />} />
              <Route path="/pod" element={<PODVerification />} />
              <Route path="/financials" element={<Financials />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/roles" element={<RolesPermissions />} />
              <Route path="/audit" element={<AuditLogs />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
