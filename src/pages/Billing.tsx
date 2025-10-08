import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

interface Invoice {
  id: number;
  invoice_no: string;
  job_id: string;
  customer_id: number;
  invoice_date: string;
  taxable_amount: number;
  gst_amount: number;
  total_amount: number;
  payment_status: 'pending' | 'paid';
  customers: { name: string };
}

interface Job {
  id: number;
  job_id: string;
}

interface Customer {
  id: number;
  name: string;
}

const initialFormData = {
  invoice_no: '',
  job_id: '',
  customer_id: '',
  invoice_date: '',
  taxable_amount: '',
  gst_amount: '',
  total_amount: '',
};

export default function Billing() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    loadInvoices();
    loadJobs();
    loadCustomers();
  }, []);

  const loadInvoices = () => {
    const mockInvoices: Invoice[] = [
      { id: 1, invoice_no: 'INV-2025-001', job_id: 'CNC-2025-001', customer_id: 1, invoice_date: '2025-10-26', taxable_amount: 5000, gst_amount: 900, total_amount: 5900, payment_status: 'pending', customers: { name: 'ABC Corp' } },
      { id: 2, invoice_no: 'INV-2025-002', job_id: 'PLT-2025-001', customer_id: 2, invoice_date: '2025-10-25', taxable_amount: 7500, gst_amount: 1350, total_amount: 8850, payment_status: 'paid', customers: { name: 'XYZ Inc' } },
    ];
    setInvoices(mockInvoices);
  };

  const loadJobs = () => {
    const mockJobs: Job[] = [
        { id: 1, job_id: 'CNC-2025-001' },
        { id: 2, job_id: 'PLT-2025-001' },
    ];
    setJobs(mockJobs);
  };

  const loadCustomers = () => {
    const mockCustomers: Customer[] = [
        { id: 1, name: 'ABC Corp' },
        { id: 2, name: 'XYZ Inc' },
    ];
    setCustomers(mockCustomers);
  };

  const generateInvoiceNo = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}-${random}`;
  };

  const calculateAmounts = (taxable: string) => {
    const taxableAmt = parseFloat(taxable);
    const gstAmt = taxableAmt * 0.18;
    const totalAmt = taxableAmt + gstAmt;
    return { gst_amount: gstAmt.toFixed(2), total_amount: totalAmt.toFixed(2) };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newInvoice: Invoice = {
      id: Math.max(...invoices.map(inv => inv.id), 0) + 1,
      invoice_no: formData.invoice_no,
      job_id: formData.job_id,
      customer_id: parseInt(formData.customer_id),
      invoice_date: formData.invoice_date,
      taxable_amount: parseFloat(formData.taxable_amount),
      gst_amount: parseFloat(formData.gst_amount),
      total_amount: parseFloat(formData.total_amount),
      payment_status: 'pending',
      customers: { name: customers.find(c => c.id === parseInt(formData.customer_id))?.name || '' },
    };

    setInvoices([newInvoice, ...invoices]);
    setIsModalOpen(false);
    setFormData(initialFormData);
  };

  const handlePrint = (invoice: Invoice) => {
    setPrintInvoice(invoice);
    setTimeout(() => window.print(), 100);
  };

  const columns: { key: string, label: string, render?: (value: unknown, row: Invoice) => React.ReactNode }[] = [
    { key: 'invoice_no', label: 'Invoice No' },
    { key: 'job_id', label: 'Job ID' },
    { key: 'customers', label: 'Customer', render: (v) => (v as { name: string })?.name },
    { key: 'invoice_date', label: 'Date' },
    { key: 'total_amount', label: 'Total', render: (v) => `₹${(v as number).toLocaleString()}` },
    {
      key: 'payment_status',
      label: 'Status',
      render: (v) => (
        <span className={`px-2 py-1 rounded-full text-xs ${v === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
          {(v as string).toUpperCase()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Billing & Invoices</h1>
          <p className="text-slate-600 mt-1">Manage customer invoices</p>
        </div>
        <button
          onClick={() => {
            setFormData({ ...formData, invoice_no: generateInvoiceNo(), invoice_date: new Date().toISOString().split('T')[0] });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </button>
      </div>

      <DataTable
        columns={columns}
        data={invoices}
        onView={(inv) => handlePrint(inv)}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Invoice">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Invoice No</label>
              <input
                type="text"
                value={formData.invoice_no}
                readOnly
                className="w-full px-3 py-2 border rounded-lg bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Date</label>
              <input
                type="date"
                value={formData.invoice_date}
                onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job ID</label>
              <select
                value={formData.job_id}
                onChange={(e) => setFormData({ ...formData, job_id: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
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
                className="w-full px-3 py-2 border rounded-lg"
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Taxable Amount</label>
              <input
                type="number"
                value={formData.taxable_amount}
                onChange={(e) => {
                  const amounts = calculateAmounts(e.target.value);
                  setFormData({ ...formData, taxable_amount: e.target.value, ...amounts });
                }}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">GST (18%)</label>
              <input
                type="number"
                value={formData.gst_amount}
                readOnly
                className="w-full px-3 py-2 border rounded-lg bg-slate-50"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Total Amount</label>
              <input
                type="number"
                value={formData.total_amount}
                readOnly
                className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-lg font-semibold"
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">
            Create Invoice
          </button>
        </form>
      </Modal>

      {printInvoice && (
        <div className="hidden print:block fixed inset-0 bg-white p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">INVOICE</h1>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p><strong>Invoice No:</strong> {printInvoice.invoice_no}</p>
                <p><strong>Date:</strong> {printInvoice.invoice_date}</p>
                <p><strong>Job ID:</strong> {printInvoice.job_id}</p>
              </div>
              <div>
                <p><strong>Customer:</strong> {printInvoice.customers?.name}</p>
              </div>
            </div>
            <table className="w-full border">
              <tr>
                <td className="border p-2">Taxable Amount</td>
                <td className="border p-2 text-right">₹{printInvoice.taxable_amount?.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="border p-2">GST (18%)</td>
                <td className="border p-2 text-right">₹{printInvoice.gst_amount?.toLocaleString()}</td>
              </tr>
              <tr className="font-bold">
                <td className="border p-2">Total Amount</td>
                <td className="border p-2 text-right">₹{printInvoice.total_amount?.toLocaleString()}</td>
              </tr>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
