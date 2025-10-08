import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus, Printer } from 'lucide-react';

export default function Billing() {
  const [invoices, setInvoices] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [printInvoice, setPrintInvoice] = useState<any>(null);
  const [formData, setFormData] = useState({
    invoice_no: '',
    job_id: '',
    customer_id: '',
    invoice_date: '',
    taxable_amount: '',
    gst_amount: '',
    total_amount: '',
  });

  useEffect(() => {
    loadInvoices();
    loadJobs();
    loadCustomers();
  }, []);

  const loadInvoices = async () => {
    const { data } = await supabase
      .from('invoices')
      .select('*, customers(name)')
      .order('created_at', { ascending: false });
    if (data) setInvoices(data);
  };

  const loadJobs = async () => {
    const { data } = await supabase.from('jobs').select('*').eq('status', 'completed');
    if (data) setJobs(data);
  };

  const loadCustomers = async () => {
    const { data } = await supabase.from('customers').select('*');
    if (data) setCustomers(data);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const invoiceData = {
      ...formData,
      customer_id: parseInt(formData.customer_id),
      taxable_amount: parseFloat(formData.taxable_amount),
      gst_amount: parseFloat(formData.gst_amount),
      total_amount: parseFloat(formData.total_amount),
      payment_status: 'pending',
    };

    await supabase.from('invoices').insert(invoiceData);
    loadInvoices();
    setIsModalOpen(false);
    setFormData({
      invoice_no: '',
      job_id: '',
      customer_id: '',
      invoice_date: '',
      taxable_amount: '',
      gst_amount: '',
      total_amount: '',
    });
  };

  const handlePrint = (invoice: any) => {
    setPrintInvoice(invoice);
    setTimeout(() => window.print(), 100);
  };

  const columns = [
    { key: 'invoice_no', label: 'Invoice No' },
    { key: 'job_id', label: 'Job ID' },
    { key: 'customers', label: 'Customer', render: (v: any) => v?.name },
    { key: 'invoice_date', label: 'Date' },
    { key: 'total_amount', label: 'Total', render: (v: number) => `₹${v.toLocaleString()}` },
    {
      key: 'payment_status',
      label: 'Status',
      render: (v: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${v === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
          {v.toUpperCase()}
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
                {jobs.map((j: any) => (
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
                {customers.map((c: any) => (
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
