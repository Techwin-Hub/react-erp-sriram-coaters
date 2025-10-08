import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

interface Challan {
  id: number;
  challan_no: string;
  job_id: string;
  customer_id: number;
  qty_sent: number;
  process_type: string;
  thickness: string;
  params_json: Record<string, string>;
  date_sent: string;
  expected_return_date: string;
  date_received: string | null;
  status: 'sent' | 'received';
  customers?: { name: string };
}

interface Job {
    id: number;
    job_id: string;
    status: string;
}

interface Customer {
    id: number;
    name: string;
}

export default function Challans() {
  const [challans, setChallans] = useState<Challan[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    challan_no: '',
    job_id: '',
    customer_id: '',
    qty_sent: '',
    process_type: 'Zinc Plating',
    thickness: '10-15 microns',
    date_sent: '',
    expected_return_date: '',
  });

  useEffect(() => {
    loadChallans();
    loadJobs();
    loadCustomers();
  }, []);

  const loadChallans = () => {
    const mockChallans: Challan[] = [
      { id: 1, challan_no: 'CH-2025-001', job_id: 'CNC-2025-001', customer_id: 1, qty_sent: 100, process_type: 'Zinc Plating', thickness: '10-15 microns', params_json: {}, date_sent: '2025-10-20', expected_return_date: '2025-10-25', date_received: null, status: 'sent', customers: { name: 'ABC Corp' } },
      { id: 2, challan_no: 'CH-2025-002', job_id: 'CNC-2025-002', customer_id: 2, qty_sent: 150, process_type: 'Nickel Plating', thickness: '5-10 microns', params_json: {}, date_sent: '2025-10-18', expected_return_date: '2025-10-23', date_received: '2025-10-22', status: 'received', customers: { name: 'XYZ Inc' } },
    ];
    setChallans(mockChallans);
  };

  const loadJobs = () => {
    const mockJobs = [
        { id: 1, job_id: 'CNC-2025-001', status: 'pending-challan' },
        { id: 2, job_id: 'CNC-2025-002', status: 'completed' },
    ];
    setJobs(mockJobs);
  };

  const loadCustomers = () => {
    const mockCustomers = [
        { id: 1, name: 'ABC Corp' },
        { id: 2, name: 'XYZ Inc' },
    ];
    setCustomers(mockCustomers);
  };

  const generateChallanNo = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CH-${year}-${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newChallan: Challan = {
      id: Math.max(...challans.map(c => c.id || 0), 0) + 1,
      challan_no: formData.challan_no,
      job_id: formData.job_id,
      customer_id: parseInt(formData.customer_id),
      qty_sent: parseInt(formData.qty_sent),
      process_type: formData.process_type,
      thickness: formData.thickness,
      params_json: { temp: '65C', current: '2.5A' },
      date_sent: formData.date_sent,
      expected_return_date: formData.expected_return_date,
      date_received: null,
      status: 'sent',
      customers: { name: customers.find(c => c.id === parseInt(formData.customer_id))?.name || '' },
    };

    setChallans([newChallan, ...challans]);
    setJobs(jobs.map(j => j.job_id === formData.job_id ? { ...j, status: 'pending-challan' } : j));
    handleClose();
  };

  const handleReceive = (challan: Challan) => {
    setChallans(challans.map(c => c.id === challan.id ? { ...c, status: 'received', date_received: new Date().toISOString().split('T')[0] } : c));
    setJobs(jobs.map(j => j.job_id === challan.job_id ? { ...j, status: 'completed' } : j));
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setFormData({
      challan_no: '',
      job_id: '',
      customer_id: '',
      qty_sent: '',
      process_type: 'Zinc Plating',
      thickness: '10-15 microns',
      date_sent: '',
      expected_return_date: '',
    });
  };

  const columns: { key: string, label: string, render?: (value: unknown, row: Challan) => React.ReactNode }[] = [
    { key: 'challan_no', label: 'Challan No' },
    { key: 'job_id', label: 'Job ID' },
    {
      key: 'customers',
      label: 'Customer',
      render: (v) => (v as { name: string })?.name,
    },
    { key: 'qty_sent', label: 'Qty Sent' },
    { key: 'process_type', label: 'Process' },
    { key: 'date_sent', label: 'Date Sent' },
    { key: 'expected_return_date', label: 'Expected Return' },
    {
      key: 'status',
      label: 'Status',
      render: (v) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            v === 'received'
              ? 'bg-green-100 text-green-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {(v as string).toUpperCase()}
        </span>
      ),
    },
  ];

  const pendingCount = challans.filter((c) => c.status === 'sent').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Challans</h1>
          <p className="text-slate-600 mt-1">
            Manage plating challans - <span className="font-semibold text-amber-600">{pendingCount} pending</span>
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({ ...formData, challan_no: generateChallanNo() });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Challan
        </button>
      </div>

      <DataTable
        columns={columns}
        data={challans}
        onView={(challan) => {
          if (challan.status === 'sent') {
            if (confirm(`Mark challan ${challan.challan_no} as received?`)) {
              handleReceive(challan);
            }
          }
        }}
        actions={true}
      />

      <Modal isOpen={isModalOpen} onClose={handleClose} title="Create Challan">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Challan No</label>
              <input
                type="text"
                value={formData.challan_no}
                onChange={(e) => setFormData({ ...formData, challan_no: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job ID</label>
              <select
                value={formData.job_id}
                onChange={(e) => setFormData({ ...formData, job_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              >
                <option value="">Select Job</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.job_id}>
                    {j.job_id}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Customer</label>
              <select
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              >
                <option value="">Select Customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Quantity Sent</label>
              <input
                type="number"
                value={formData.qty_sent}
                onChange={(e) => setFormData({ ...formData, qty_sent: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Process Type</label>
              <select
                value={formData.process_type}
                onChange={(e) => setFormData({ ...formData, process_type: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="Zinc Plating">Zinc Plating</option>
                <option value="Nickel Plating">Nickel Plating</option>
                <option value="Chrome Plating">Chrome Plating</option>
                <option value="Anodizing">Anodizing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Thickness</label>
              <input
                type="text"
                value={formData.thickness}
                onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date Sent</label>
              <input
                type="date"
                value={formData.date_sent}
                onChange={(e) => setFormData({ ...formData, date_sent: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Expected Return</label>
              <input
                type="date"
                value={formData.expected_return_date}
                onChange={(e) => setFormData({ ...formData, expected_return_date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
