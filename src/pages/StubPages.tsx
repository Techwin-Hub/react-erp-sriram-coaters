import { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';

interface Enquiry {
  enquiry_id: string;
  customers: { name: string };
  part_no: string;
  qty: number;
  estimated_cost: number;
  status: string;
}

export function Enquiries() {
  const [data, setData] = useState<Enquiry[]>([]);

  useEffect(() => {
    const mockData: Enquiry[] = [
      { enquiry_id: 'ENQ-001', customers: { name: 'New Client' }, part_no: 'P-123', qty: 1000, estimated_cost: 15000, status: 'quoted' }
    ];
    setData(mockData);
  }, []);

  const columns = [
    { key: 'enquiry_id', label: 'Enquiry ID' },
    { key: 'customers', label: 'Customer', render: (v: { name: string }) => v?.name },
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

interface Route {
  part_no: string;
  op_seq: number;
  op_name: string;
  machine_type: string;
  setup_time_min: number;
  run_time_per_piece_min: number;
}

export function Routing() {
  const [data, setData] = useState<Route[]>([]);

  useEffect(() => {
    const mockData: Route[] = [
      { part_no: 'P-123', op_seq: 10, op_name: 'CNC Milling', machine_type: 'CNC Mill', setup_time_min: 60, run_time_per_piece_min: 5 },
      { part_no: 'P-123', op_seq: 20, op_name: 'Deburring', machine_type: 'Manual', setup_time_min: 0, run_time_per_piece_min: 2 },
    ];
    setData(mockData);
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

interface InventoryItem {
  item_id: string;
  name: string;
  batch_no: string;
  qty_on_hand: number;
  location: string;
  reorder_point: number;
}

export function Inventory() {
  const [data, setData] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const mockData: InventoryItem[] = [
      { item_id: 'RM-001', name: 'EN24 Round Bar', batch_no: 'B-101', qty_on_hand: 500, location: 'Stores', reorder_point: 100 },
      { item_id: 'C-001', name: 'Cutting Oil', batch_no: 'N/A', qty_on_hand: 50, location: 'Stores', reorder_point: 20 },
    ];
    setData(mockData);
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

interface Tool {
  tool_id: string;
  name: string;
  last_purchase_cost: number;
  useful_life_hours: number;
  current_usage_hours: number;
}

export function Tooling() {
  const [data, setData] = useState<Tool[]>([]);

  useEffect(() => {
    const mockData: Tool[] = [
      { tool_id: 'T-001', name: '10mm End Mill', last_purchase_cost: 500, useful_life_hours: 100, current_usage_hours: 25 },
      { tool_id: 'T-002', name: 'Drill Bit 5mm', last_purchase_cost: 150, useful_life_hours: 50, current_usage_hours: 40 },
    ];
    setData(mockData);
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

interface Inspection {
  insp_id: string;
  job_id: string;
  insp_type: string;
  result: string;
  remarks: string;
}

export function Quality() {
  const [data, setData] = useState<Inspection[]>([]);

  useEffect(() => {
    const mockData: Inspection[] = [
      { insp_id: 'INSP-001', job_id: 'CNC-2025-001', insp_type: 'In-process', result: 'Pass', remarks: 'Dimensions OK' },
      { insp_id: 'INSP-002', job_id: 'CNC-2025-001', insp_type: 'Final', result: 'Pass', remarks: 'All clear' },
    ];
    setData(mockData);
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

interface MaintenanceRecord {
  maintenance_id: string;
  machines: { name: string };
  type: string;
  scheduled_date: string;
  completed_date: string;
  downtime_hours: number;
}

export function Maintenance() {
  const [data, setData] = useState<MaintenanceRecord[]>([]);

  useEffect(() => {
    const mockData: MaintenanceRecord[] = [
      { maintenance_id: 'M-001', machines: { name: 'CNC-01' }, type: 'Preventive', scheduled_date: '2025-10-15', completed_date: '2025-10-15', downtime_hours: 4 },
    ];
    setData(mockData);
  }, []);

  const columns = [
    { key: 'maintenance_id', label: 'Maintenance ID' },
    { key: 'machines', label: 'Machine', render: (v: { name: string }) => v?.name },
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

interface PurchaseOrder {
  po_no: string;
  supplier_name: string;
  item_description: string;
  qty: number;
  total_amount: number;
  status: string;
}

export function Purchase() {
  const [data, setData] = useState<PurchaseOrder[]>([]);

  useEffect(() => {
    const mockData: PurchaseOrder[] = [
      { po_no: 'PO-001', supplier_name: 'Steel Dynamics', item_description: 'EN24 Round Bar', qty: 500, total_amount: 150000, status: 'received' },
    ];
    setData(mockData);
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

interface DispatchRecord {
  dispatch_id: string;
  job_id: string;
  lr_no: string;
  eway_bill_no: string;
  dispatch_date: string;
  transporter_name: string;
}

export function Dispatch() {
  const [data, setData] = useState<DispatchRecord[]>([]);

  useEffect(() => {
    const mockData: DispatchRecord[] = [
      { dispatch_id: 'D-001', job_id: 'CNC-2025-001', lr_no: 'LR123', eway_bill_no: 'EW123', dispatch_date: '2025-10-28', transporter_name: 'VRL' },
    ];
    setData(mockData);
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

interface Expense {
  expense_id: string;
  date: string;
  category: string;
  amount: number;
  vendor: string;
  description: string;
}

export function Expenses() {
  const [data, setData] = useState<Expense[]>([]);

  useEffect(() => {
    const mockData: Expense[] = [
      { expense_id: 'E-001', date: '2025-10-25', category: 'Consumables', amount: 5000, vendor: 'Local Supplier', description: 'Cutting oil purchase' },
    ];
    setData(mockData);
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
