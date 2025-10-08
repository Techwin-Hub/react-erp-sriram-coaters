import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import DataTable from '../components/DataTable';
import { Plus } from 'lucide-react';

export function Enquiries() {
  const [data, setData] = useState([]);

  useEffect(() => {
    supabase.from('enquiries').select('*, customers(name)').then(({ data }) => data && setData(data));
  }, []);

  const columns = [
    { key: 'enquiry_id', label: 'Enquiry ID' },
    { key: 'customers', label: 'Customer', render: (v: any) => v?.name },
    { key: 'part_no', label: 'Part' },
    { key: 'qty', label: 'Qty' },
    { key: 'estimated_cost', label: 'Est. Cost' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Enquiries & Quotations</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

export function Routing() {
  const [data, setData] = useState([]);

  useEffect(() => {
    supabase.from('operations').select('*').then(({ data }) => data && setData(data));
  }, []);

  const columns = [
    { key: 'part_no', label: 'Part No' },
    { key: 'op_seq', label: 'Op Seq' },
    { key: 'op_name', label: 'Operation' },
    { key: 'machine_type', label: 'Machine Type' },
    { key: 'setup_time_min', label: 'Setup Time' },
    { key: 'run_time_per_piece_min', label: 'Run Time' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Routing & Operations</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

export function Inventory() {
  const [data, setData] = useState([]);

  useEffect(() => {
    supabase.from('inventory').select('*').then(({ data }) => data && setData(data));
  }, []);

  const columns = [
    { key: 'item_id', label: 'Item ID' },
    { key: 'name', label: 'Name' },
    { key: 'batch_no', label: 'Batch' },
    { key: 'qty_on_hand', label: 'Qty on Hand' },
    { key: 'location', label: 'Location' },
    { key: 'reorder_point', label: 'Reorder Point' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inventory</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

export function Tooling() {
  const [data, setData] = useState([]);

  useEffect(() => {
    supabase.from('tooling').select('*').then(({ data }) => data && setData(data));
  }, []);

  const columns = [
    { key: 'tool_id', label: 'Tool ID' },
    { key: 'name', label: 'Name' },
    { key: 'last_purchase_cost', label: 'Cost' },
    { key: 'useful_life_hours', label: 'Life (hrs)' },
    { key: 'current_usage_hours', label: 'Usage (hrs)' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tooling</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

export function Quality() {
  const [data, setData] = useState([]);

  useEffect(() => {
    supabase.from('inspections').select('*').then(({ data }) => data && setData(data));
  }, []);

  const columns = [
    { key: 'insp_id', label: 'Inspection ID' },
    { key: 'job_id', label: 'Job ID' },
    { key: 'insp_type', label: 'Type' },
    { key: 'result', label: 'Result' },
    { key: 'remarks', label: 'Remarks' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quality Management</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

export function Maintenance() {
  const [data, setData] = useState([]);

  useEffect(() => {
    supabase.from('maintenance').select('*, machines(name)').then(({ data }) => data && setData(data));
  }, []);

  const columns = [
    { key: 'maintenance_id', label: 'Maintenance ID' },
    { key: 'machines', label: 'Machine', render: (v: any) => v?.name },
    { key: 'type', label: 'Type' },
    { key: 'scheduled_date', label: 'Scheduled' },
    { key: 'completed_date', label: 'Completed' },
    { key: 'downtime_hours', label: 'Downtime' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Maintenance</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

export function Purchase() {
  const [data, setData] = useState([]);

  useEffect(() => {
    supabase.from('purchase_orders').select('*').then(({ data }) => data && setData(data));
  }, []);

  const columns = [
    { key: 'po_no', label: 'PO No' },
    { key: 'supplier_name', label: 'Supplier' },
    { key: 'item_description', label: 'Item' },
    { key: 'qty', label: 'Qty' },
    { key: 'total_amount', label: 'Amount' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Purchase Orders</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

export function Dispatch() {
  const [data, setData] = useState([]);

  useEffect(() => {
    supabase.from('dispatch').select('*').then(({ data }) => data && setData(data));
  }, []);

  const columns = [
    { key: 'dispatch_id', label: 'Dispatch ID' },
    { key: 'job_id', label: 'Job ID' },
    { key: 'lr_no', label: 'LR No' },
    { key: 'eway_bill_no', label: 'E-Way Bill' },
    { key: 'dispatch_date', label: 'Dispatch Date' },
    { key: 'transporter_name', label: 'Transporter' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dispatch & Logistics</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

export function Expenses() {
  const [data, setData] = useState([]);

  useEffect(() => {
    supabase.from('expenses').select('*').then(({ data }) => data && setData(data));
  }, []);

  const columns = [
    { key: 'expense_id', label: 'Expense ID' },
    { key: 'date', label: 'Date' },
    { key: 'category', label: 'Category' },
    { key: 'amount', label: 'Amount' },
    { key: 'vendor', label: 'Vendor' },
    { key: 'description', label: 'Description' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Expenses</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
