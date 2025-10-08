import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Package,
  Cog,
  FileText,
  Briefcase,
  GitBranch,
  Factory,
  Box,
  Droplet,
  Shield,
  Wrench,
  ShoppingCart,
  Receipt,
  Truck,
  Clock,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  {
    name: 'Masters',
    icon: Cog,
    children: [
      { name: 'Customers', href: '/customers', icon: Users },
      { name: 'Employees', href: '/employees', icon: UserCircle },
      { name: 'Parts', href: '/parts', icon: Package },
      { name: 'Machines', href: '/machines', icon: Factory },
    ],
  },
  { name: 'Enquiries', href: '/enquiries', icon: FileText },
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Routing', href: '/routing', icon: GitBranch },
  { name: 'Shop Floor', href: '/shop-floor', icon: Factory },
  { name: 'Inventory', href: '/inventory', icon: Box },
  { name: 'Tooling', href: '/tooling', icon: Wrench },
  { name: 'Challans', href: '/challans', icon: Droplet },
  { name: 'Quality', href: '/quality', icon: Shield },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench },
  { name: 'Purchase', href: '/purchase', icon: ShoppingCart },
  { name: 'Billing', href: '/billing', icon: Receipt },
  { name: 'Dispatch', href: '/dispatch', icon: Truck },
  { name: 'Attendance', href: '/attendance', icon: Clock },
  { name: 'Expenses', href: '/expenses', icon: DollarSign },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const toggleExpanded = (name: string) => {
    setExpandedItem(expandedItem === name ? null : name);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex h-screen overflow-hidden">
        <aside
          className={`bg-slate-900 text-white transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-20'
          } flex flex-col`}
        >
          <div className="p-4 flex items-center justify-between border-b border-slate-800">
            {sidebarOpen && <h1 className="text-xl font-bold">ERP System</h1>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-800 rounded-lg transition"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-800 transition ${
                        !sidebarOpen && 'justify-center'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5" />
                        {sidebarOpen && <span className="ml-3">{item.name}</span>}
                      </div>
                    </button>
                    {sidebarOpen && expandedItem === item.name && (
                      <div className="bg-slate-800">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className={`flex items-center px-8 py-2 text-sm hover:bg-slate-700 transition ${
                              isActive(child.href) ? 'bg-slate-700 text-blue-400' : ''
                            }`}
                          >
                            <child.icon className="w-4 h-4" />
                            <span className="ml-3">{child.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm hover:bg-slate-800 transition ${
                      isActive(item.href) ? 'bg-slate-800 text-blue-400 border-l-4 border-blue-500' : ''
                    } ${!sidebarOpen && 'justify-center'}`}
                  >
                    <item.icon className="w-5 h-5" />
                    {sidebarOpen && <span className="ml-3">{item.name}</span>}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="border-t border-slate-800 p-4">
            <div className={`flex items-center ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">{user?.name[0]}</span>
              </div>
              {sidebarOpen && (
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.role}</p>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <button
                onClick={handleLogout}
                className="w-full mt-3 flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            )}
          </div>
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4 ml-6">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                  <Settings className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
