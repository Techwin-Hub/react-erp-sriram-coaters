import { useState, useEffect } from 'react';
import { Download, FileText } from 'lucide-react';
import Papa from 'papaparse';

interface Turnover {
  month: string;
  amount: number;
}

interface JobReport {
  id: number;
  job_id: string;
  customers: { name: string };
  status: string;
  total_cost: number;
}

interface ChallanReport {
  id: number;
  challan_no: string;
  job_id: string;
  customers: { name: string };
  status: string;
}

export default function Reports() {
  const [turnover, setTurnover] = useState<Turnover[]>([]);
  const [jobs, setJobs] = useState<JobReport[]>([]);
  const [challans, setChallans] = useState<ChallanReport[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const mockTurnover: Turnover[] = [
      { month: '2025-08', amount: 400000 },
      { month: '2025-09', amount: 420000 },
      { month: '2025-10', amount: 450000 },
    ];
    const mockJobs: JobReport[] = [
      { id: 1, job_id: 'CNC-2025-001', customers: { name: 'ABC Corp' }, status: 'completed', total_cost: 4500 },
      { id: 2, job_id: 'PLT-2025-001', customers: { name: 'XYZ Inc' }, status: 'completed', total_cost: 6800 },
    ];
    const mockChallans: ChallanReport[] = [
      { id: 1, challan_no: 'CH-2025-001', job_id: 'CNC-2025-003', customers: { name: 'ABC Corp' }, status: 'sent' },
    ];

    setTurnover(mockTurnover);
    setJobs(mockJobs);
    setChallans(mockChallans);
  };

  const exportToCSV = (data: (Turnover | JobReport | ChallanReport)[], filename: string) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-600 mt-1">Generate and export reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Monthly Turnover</h3>
                <p className="text-sm text-slate-600">{turnover.length} months</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => exportToCSV(turnover, 'monthly_turnover.csv')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-3">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Job Cost Summary</h3>
                <p className="text-sm text-slate-600">{jobs.length} jobs</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => exportToCSV(jobs, 'jobs_report.csv')}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 bg-amber-100 rounded-full mr-3">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Pending Challans</h3>
                <p className="text-sm text-slate-600">{challans.length} pending</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => exportToCSV(challans, 'pending_challans.csv')}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Monthly Turnover Summary</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Month</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {turnover.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{item.month}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right font-semibold">
                    ₹{item.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
