import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Employees from './pages/Employees';
import Parts from './pages/Parts';
import Machines from './pages/Machines';
import Jobs from './pages/Jobs';
import ShopFloor from './pages/ShopFloor';
import Challans from './pages/Challans';
import Billing from './pages/Billing';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import {
  Enquiries,
  Routing,
  Inventory,
  Tooling,
  Quality,
  Maintenance,
  Purchase,
  Dispatch,
  Expenses,
} from './pages/StubPages';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/parts" element={<Parts />} />
        <Route path="/machines" element={<Machines />} />
        <Route path="/enquiries" element={<Enquiries />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/routing" element={<Routing />} />
        <Route path="/shop-floor" element={<ShopFloor />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/tooling" element={<Tooling />} />
        <Route path="/challans" element={<Challans />} />
        <Route path="/quality" element={<Quality />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/dispatch" element={<Dispatch />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
