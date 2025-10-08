import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus, Eye } from 'lucide-react';

interface Job {
  id?: number;
  job_id: string;
  customer_id: number;
  part_no: string;
  rev: string;
  qty_ordered: number;
  qty_completed: number;
  due_date: string;
  route: any;
  job_type: string;
  status: string;
  current_operation: string | null;
  customers?: { name: string };
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [operators, setOperators] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    job_id: '',
    customer_id: '',
    part_no: '',
    rev: 'A',
    qty_ordered: '',
    due_date: '',
    job_type: 'CNC',
    route: [{ op_seq: 10, op_name: '', machine_id: '', operator_id: '' }],
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadJobs();
    loadCustomers();
    loadParts();
    loadMachines();
    loadOperators();
  }, []);

  const loadJobs = async () => {
    const { data } = await supabase
      .from('jobs')
      .select('*, customers(name)')
      .order('created_at', { ascending: false });

    if (data) setJobs(data);
  };

  const loadCustomers = async () => {
    const { data } = await supabase.from('customers').select('*').order('name');
    if (data) setCustomers(data);
  };

  const loadParts = async () => {
    const { data } = await supabase.from('parts').select('*').order('part_no');
    if (data) setParts(data);
  };

  const loadMachines = async () => {
    const { data } = await supabase.from('machines').select('*').order('name');
    if (data) setMachines(data);
  };

  const loadOperators = async () => {
    const { data } = await supabase.from('employees').select('*').in('role', ['CNC Operator', 'Plating Operator']);
    if (data) setOperators(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    const jobData = {
      job_id: formData.job_id,
      customer_id: parseInt(formData.customer_id),
      part_no: formData.part_no,
      rev: formData.rev,
      qty_ordered: parseInt(formData.qty_ordered),
      qty_completed: 0,
      due_date: formData.due_date,
      route: formData.route,
      job_type: formData.job_type,
      status: 'pending',
      current_operation: null,
    };

    await supabase.from('jobs').insert(jobData);
    loadJobs();
    handleClose();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setStep(1);
    setFormData({
      job_id: '',
      customer_id: '',
      part_no: '',
      rev: 'A',
      qty_ordered: '',
      due_date: '',
      job_type: 'CNC',
      route: [{ op_seq: 10, op_name: '', machine_id: '', operator_id: '' }],
    });
  };

  const addOperation = () => {
    setFormData({
      ...formData,
      route: [...formData.route, { op_seq: (formData.route.length + 1) * 10, op_name: '', machine_id: '', operator_id: '' }],
    });
  };

  const updateOperation = (index: number, field: string, value: any) => {
    const newRoute = [...formData.route];
    newRoute[index] = { ...newRoute[index], [field]: value };
    setFormData({ ...formData, route: newRoute });
  };

  const columns = [
    { key: 'job_id', label: 'Job ID' },
    {
      key: 'customers',
      label: 'Customer',
      render: (value: any) => value?.name || '',
    },
    { key: 'part_no', label: 'Part No' },
    { key: 'qty_ordered', label: 'Qty Ordered' },
    { key: 'qty_completed', label: 'Qty Completed' },
    { key: 'due_date', label: 'Due Date' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'completed'
              ? 'bg-green-100 text-green-800'
              : value === 'in-progress'
              ? 'bg-blue-100 text-blue-800'
              : value === 'pending-challan'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-slate-100 text-slate-800'
          }`}
        >
          {value.replace('-', ' ').toUpperCase()}
        </span>
      ),
    },
  ];

  const generateJobId = () => {
    const prefix = formData.job_type === 'CNC' ? 'CNC' : 'PLT';
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${year}-${random}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job Orders</h1>
          <p className="text-slate-600 mt-1">Manage job orders and work orders</p>
        </div>
        <button
          onClick={() => {
            setFormData({ ...formData, job_id: generateJobId() });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Job
        </button>
      </div>

      <DataTable columns={columns} data={jobs} />

      <Modal isOpen={isModalOpen} onClose={handleClose} title="Create Job Order" size="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                    step >= s ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && <div className={`w-20 h-1 ${step > s ? 'bg-blue-600' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Step 1: Job Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Job ID</label>
                  <input
                    type="text"
                    value={formData.job_id}
                    onChange={(e) => setFormData({ ...formData, job_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                    readOnly
                  />
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Part Number</label>
                  <select
                    value={formData.part_no}
                    onChange={(e) => setFormData({ ...formData, part_no: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  >
                    <option value="">Select Part</option>
                    {parts.map((p) => (
                      <option key={p.id} value={p.part_no}>
                        {p.part_no} - {p.description}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Revision</label>
                  <input
                    type="text"
                    value={formData.rev}
                    onChange={(e) => setFormData({ ...formData, rev: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity Ordered</label>
                  <input
                    type="number"
                    value={formData.qty_ordered}
                    onChange={(e) => setFormData({ ...formData, qty_ordered: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Job Type</label>
                  <select
                    value={formData.job_type}
                    onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="CNC">CNC</option>
                    <option value="PLATING">PLATING</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Step 2: Routing</h3>
                <button
                  type="button"
                  onClick={addOperation}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add Operation
                </button>
              </div>
              {formData.route.map((op, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Op Seq</label>
                      <input
                        type="number"
                        value={op.op_seq}
                        onChange={(e) => updateOperation(index, 'op_seq', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Operation Name</label>
                      <input
                        type="text"
                        value={op.op_name}
                        onChange={(e) => updateOperation(index, 'op_name', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Step 3: Review</h3>
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Job ID:</span>
                  <span className="font-medium">{formData.job_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Customer:</span>
                  <span className="font-medium">
                    {customers.find((c) => c.id === parseInt(formData.customer_id))?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Part:</span>
                  <span className="font-medium">{formData.part_no}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Quantity:</span>
                  <span className="font-medium">{formData.qty_ordered}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Operations:</span>
                  <span className="font-medium">{formData.route.length}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => (step > 1 ? setStep(step - 1) : handleClose())}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
            >
              {step > 1 ? 'Back' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              {step < 3 ? 'Next' : 'Create Job'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
