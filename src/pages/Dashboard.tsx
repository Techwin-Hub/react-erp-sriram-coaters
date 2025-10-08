import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle,
  DollarSign,
  Droplet,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change?: string;
  color: string;
  link?: string;
}

function MetricCard({ title, value, icon: Icon, change, color, link }: MetricCardProps) {
  const content = (
    <div
      className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer border-l-4 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-4 rounded-full ${color.replace('border-', 'bg-').replace('600', '100')}`}>
          <Icon className={`w-8 h-8 ${color.replace('border-', 'text-')}`} />
        </div>
      </div>
    </div>
  );

  return link ? <Link to={link}>{content}</Link> : content;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    openJobs: 0,
    completedJobs: 0,
    monthlyTurnover: 0,
    pendingChallans: 0,
    machineUtilization: 0,
    receivables: 0,
  });

  const [turnoverData, setTurnoverData] = useState<{ month: string; amount: number }[]>([]);
  const [jobsByStatus, setJobsByStatus] = useState<{ status: string; count: number }[]>([]);

  useEffect(() => {
    loadMetrics();
    loadTurnoverData();
    loadJobsByStatus();
  }, []);

  const loadMetrics = () => {
    // Mock data
    const mockMetrics = {
      openJobs: 12,
      completedJobs: 45,
      monthlyTurnover: 450000,
      pendingChallans: 8,
      machineUtilization: 78,
      receivables: 120000,
    };
    setMetrics(mockMetrics);
  };

  const loadTurnoverData = () => {
    // Mock data
    const mockTurnover = [
      { month: '2025-05', amount: 380000 },
      { month: '2025-06', amount: 410000 },
      { month: '2025-07', amount: 430000 },
      { month: '2025-08', amount: 400000 },
      { month: '2025-09', amount: 420000 },
      { month: '2025-10', amount: 450000 },
    ];
    setTurnoverData(mockTurnover);
  };

  const loadJobsByStatus = () => {
    // Mock data
    const mockStatusCounts = {
      pending: 5,
      'in-progress': 7,
      completed: 45,
      'pending-challan': 3,
    };
    setJobsByStatus(
      Object.entries(mockStatusCounts).map(([status, count]) => ({
        status,
        count,
      }))
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const maxTurnover = Math.max(...turnoverData.map((d) => d.amount), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Overview of your ERP system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Open Jobs"
          value={metrics.openJobs}
          icon={Briefcase}
          color="border-blue-600"
          link="/jobs"
        />
        <MetricCard
          title="Completed Jobs (Month)"
          value={metrics.completedJobs}
          icon={CheckCircle}
          color="border-green-600"
          link="/jobs"
        />
        <MetricCard
          title="Monthly Turnover"
          value={formatCurrency(metrics.monthlyTurnover)}
          icon={DollarSign}
          change="+12.5%"
          color="border-emerald-600"
        />
        <MetricCard
          title="Pending Challans"
          value={metrics.pendingChallans}
          icon={Droplet}
          color="border-amber-600"
          link="/challans"
        />
        <MetricCard
          title="Machine Utilization"
          value={`${metrics.machineUtilization}%`}
          icon={TrendingUp}
          color="border-cyan-600"
        />
        <MetricCard
          title="Receivables"
          value={formatCurrency(metrics.receivables)}
          icon={AlertCircle}
          color="border-red-600"
          link="/billing"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Monthly Turnover</h2>
          <div className="space-y-3">
            {turnoverData.map((item) => (
              <div key={item.month}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-600">{item.month}</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(item.amount)}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${(item.amount / maxTurnover) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Jobs by Status</h2>
          <div className="space-y-4">
            {jobsByStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      item.status === 'completed'
                        ? 'bg-green-500'
                        : item.status === 'in-progress'
                        ? 'bg-blue-500'
                        : item.status === 'pending-challan'
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span className="text-sm text-slate-700 capitalize">{item.status.replace('-', ' ')}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/jobs/new"
            className="p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
          >
            <Briefcase className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-slate-700">Create Job</span>
          </Link>
          <Link
            to="/challans/new"
            className="p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
          >
            <Droplet className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-slate-700">New Challan</span>
          </Link>
          <Link
            to="/billing/new"
            className="p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
          >
            <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-slate-700">Create Invoice</span>
          </Link>
          <Link
            to="/shop-floor"
            className="p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
          >
            <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-slate-700">Shop Floor</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
