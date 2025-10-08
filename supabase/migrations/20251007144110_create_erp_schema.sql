/*
  # ERP System Database Schema

  1. New Tables
    - `users` - Admin users for authentication
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `password` (text) - stores hashed password
      - `role` (text)
      - `name` (text)
      - `created_at` (timestamptz)
    
    - `customers` - Customer master data
      - `id` (serial, primary key)
      - `name` (text)
      - `gstin` (text)
      - `contact_person` (text)
      - `phone` (text)
      - `billing_address` (text)
      - `shipping_address` (text)
      - `credit_days` (integer)
      - `created_at` (timestamptz)
    
    - `employees` - Employee master data
      - `id` (serial, primary key)
      - `name` (text)
      - `role` (text)
      - `phone` (text)
      - `shift` (text)
      - `skill_level` (text)
      - `created_at` (timestamptz)
    
    - `parts` - Part/Item master data
      - `id` (serial, primary key)
      - `part_no` (text, unique)
      - `rev` (text)
      - `description` (text)
      - `material` (text)
      - `client_part_no` (text)
      - `drawing_url` (text)
      - `created_at` (timestamptz)
    
    - `machines` - Machine master data
      - `id` (serial, primary key)
      - `name` (text)
      - `type` (text)
      - `model` (text)
      - `location` (text)
      - `last_pm_date` (date)
      - `created_at` (timestamptz)
    
    - `enquiries` - Enquiries and quotations
      - `id` (serial, primary key)
      - `enquiry_id` (text, unique)
      - `customer_id` (integer, foreign key)
      - `part_no` (text)
      - `qty` (integer)
      - `expected_date` (date)
      - `estimated_cost` (numeric)
      - `status` (text)
      - `created_at` (timestamptz)
    
    - `jobs` - Job orders/work orders
      - `id` (serial, primary key)
      - `job_id` (text, unique)
      - `customer_id` (integer, foreign key)
      - `part_no` (text)
      - `rev` (text)
      - `qty_ordered` (integer)
      - `qty_completed` (integer)
      - `due_date` (date)
      - `route` (jsonb)
      - `job_type` (text)
      - `status` (text)
      - `current_operation` (text)
      - `created_at` (timestamptz)
    
    - `operations` - Operation templates and routing
      - `id` (serial, primary key)
      - `part_no` (text)
      - `op_seq` (integer)
      - `op_name` (text)
      - `machine_type` (text)
      - `setup_time_min` (integer)
      - `run_time_per_piece_min` (numeric)
      - `tooling_list` (jsonb)
      - `created_at` (timestamptz)
    
    - `job_operations` - Actual job operation tracking
      - `id` (serial, primary key)
      - `job_id` (text, foreign key)
      - `op_seq` (integer)
      - `op_name` (text)
      - `machine_id` (integer)
      - `operator_id` (integer)
      - `status` (text)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `qty_done` (integer)
      - `qty_rejected` (integer)
      - `downtime_reason` (text)
      - `created_at` (timestamptz)
    
    - `inventory` - Inventory management
      - `id` (serial, primary key)
      - `item_id` (text, unique)
      - `name` (text)
      - `batch_no` (text)
      - `qty_on_hand` (numeric)
      - `location` (text)
      - `reorder_point` (numeric)
      - `created_at` (timestamptz)
    
    - `tooling` - Tooling management
      - `id` (serial, primary key)
      - `tool_id` (text, unique)
      - `name` (text)
      - `last_purchase_cost` (numeric)
      - `useful_life_hours` (numeric)
      - `current_usage_hours` (numeric)
      - `created_at` (timestamptz)
    
    - `challans` - Plating challan management
      - `id` (serial, primary key)
      - `challan_no` (text, unique)
      - `job_id` (text)
      - `customer_id` (integer)
      - `qty_sent` (integer)
      - `process_type` (text)
      - `thickness` (text)
      - `params_json` (jsonb)
      - `date_sent` (date)
      - `expected_return_date` (date)
      - `date_received` (date)
      - `status` (text)
      - `created_at` (timestamptz)
    
    - `inspections` - Quality inspections
      - `id` (serial, primary key)
      - `insp_id` (text, unique)
      - `job_id` (text)
      - `insp_type` (text)
      - `inspector_id` (integer)
      - `measured_values` (jsonb)
      - `result` (text)
      - `remarks` (text)
      - `created_at` (timestamptz)
    
    - `maintenance` - Machine maintenance
      - `id` (serial, primary key)
      - `maintenance_id` (text, unique)
      - `machine_id` (integer, foreign key)
      - `type` (text)
      - `scheduled_date` (date)
      - `completed_date` (date)
      - `downtime_hours` (numeric)
      - `notes` (text)
      - `created_at` (timestamptz)
    
    - `purchase_orders` - Purchase orders
      - `id` (serial, primary key)
      - `po_no` (text, unique)
      - `supplier_name` (text)
      - `item_description` (text)
      - `qty` (integer)
      - `rate` (numeric)
      - `total_amount` (numeric)
      - `po_date` (date)
      - `expected_delivery_date` (date)
      - `status` (text)
      - `created_at` (timestamptz)
    
    - `invoices` - Billing and invoices
      - `id` (serial, primary key)
      - `invoice_no` (text, unique)
      - `job_id` (text)
      - `customer_id` (integer, foreign key)
      - `invoice_date` (date)
      - `taxable_amount` (numeric)
      - `gst_amount` (numeric)
      - `total_amount` (numeric)
      - `payment_status` (text)
      - `created_at` (timestamptz)
    
    - `dispatch` - Dispatch and logistics
      - `id` (serial, primary key)
      - `dispatch_id` (text, unique)
      - `job_id` (text)
      - `lr_no` (text)
      - `eway_bill_no` (text)
      - `dispatch_date` (date)
      - `delivered_date` (date)
      - `transporter_name` (text)
      - `created_at` (timestamptz)
    
    - `attendance` - Employee attendance
      - `id` (serial, primary key)
      - `emp_id` (integer, foreign key)
      - `date` (date)
      - `in_time` (time)
      - `out_time` (time)
      - `worked_hours` (numeric)
      - `created_at` (timestamptz)
    
    - `expenses` - Expense tracking
      - `id` (serial, primary key)
      - `expense_id` (text, unique)
      - `date` (date)
      - `category` (text)
      - `amount` (numeric)
      - `vendor` (text)
      - `related_job_id` (text)
      - `description` (text)
      - `created_at` (timestamptz)
    
    - `monthly_turnover` - Monthly turnover data for reporting
      - `id` (serial, primary key)
      - `month` (text)
      - `amount` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin access
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  role text DEFAULT 'admin',
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id serial PRIMARY KEY,
  name text NOT NULL,
  gstin text,
  contact_person text,
  phone text,
  billing_address text,
  shipping_address text,
  credit_days integer DEFAULT 30,
  created_at timestamptz DEFAULT now()
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id serial PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  phone text,
  shift text,
  skill_level text,
  created_at timestamptz DEFAULT now()
);

-- Create parts table
CREATE TABLE IF NOT EXISTS parts (
  id serial PRIMARY KEY,
  part_no text UNIQUE NOT NULL,
  rev text DEFAULT 'A',
  description text,
  material text,
  client_part_no text,
  drawing_url text,
  created_at timestamptz DEFAULT now()
);

-- Create machines table
CREATE TABLE IF NOT EXISTS machines (
  id serial PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL,
  model text,
  location text,
  last_pm_date date,
  created_at timestamptz DEFAULT now()
);

-- Create enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id serial PRIMARY KEY,
  enquiry_id text UNIQUE NOT NULL,
  customer_id integer REFERENCES customers(id),
  part_no text,
  qty integer,
  expected_date date,
  estimated_cost numeric,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id serial PRIMARY KEY,
  job_id text UNIQUE NOT NULL,
  customer_id integer REFERENCES customers(id),
  part_no text,
  rev text DEFAULT 'A',
  qty_ordered integer,
  qty_completed integer DEFAULT 0,
  due_date date,
  route jsonb,
  job_type text,
  status text DEFAULT 'pending',
  current_operation text,
  created_at timestamptz DEFAULT now()
);

-- Create operations table
CREATE TABLE IF NOT EXISTS operations (
  id serial PRIMARY KEY,
  part_no text NOT NULL,
  op_seq integer,
  op_name text,
  machine_type text,
  setup_time_min integer,
  run_time_per_piece_min numeric,
  tooling_list jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create job_operations table
CREATE TABLE IF NOT EXISTS job_operations (
  id serial PRIMARY KEY,
  job_id text NOT NULL,
  op_seq integer,
  op_name text,
  machine_id integer REFERENCES machines(id),
  operator_id integer REFERENCES employees(id),
  status text DEFAULT 'pending',
  start_time timestamptz,
  end_time timestamptz,
  qty_done integer DEFAULT 0,
  qty_rejected integer DEFAULT 0,
  downtime_reason text,
  created_at timestamptz DEFAULT now()
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id serial PRIMARY KEY,
  item_id text UNIQUE NOT NULL,
  name text NOT NULL,
  batch_no text,
  qty_on_hand numeric DEFAULT 0,
  location text,
  reorder_point numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create tooling table
CREATE TABLE IF NOT EXISTS tooling (
  id serial PRIMARY KEY,
  tool_id text UNIQUE NOT NULL,
  name text NOT NULL,
  last_purchase_cost numeric,
  useful_life_hours numeric,
  current_usage_hours numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create challans table
CREATE TABLE IF NOT EXISTS challans (
  id serial PRIMARY KEY,
  challan_no text UNIQUE NOT NULL,
  job_id text,
  customer_id integer REFERENCES customers(id),
  qty_sent integer,
  process_type text,
  thickness text,
  params_json jsonb,
  date_sent date,
  expected_return_date date,
  date_received date,
  status text DEFAULT 'sent',
  created_at timestamptz DEFAULT now()
);

-- Create inspections table
CREATE TABLE IF NOT EXISTS inspections (
  id serial PRIMARY KEY,
  insp_id text UNIQUE NOT NULL,
  job_id text,
  insp_type text,
  inspector_id integer REFERENCES employees(id),
  measured_values jsonb,
  result text,
  remarks text,
  created_at timestamptz DEFAULT now()
);

-- Create maintenance table
CREATE TABLE IF NOT EXISTS maintenance (
  id serial PRIMARY KEY,
  maintenance_id text UNIQUE NOT NULL,
  machine_id integer REFERENCES machines(id),
  type text,
  scheduled_date date,
  completed_date date,
  downtime_hours numeric,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create purchase_orders table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id serial PRIMARY KEY,
  po_no text UNIQUE NOT NULL,
  supplier_name text,
  item_description text,
  qty integer,
  rate numeric,
  total_amount numeric,
  po_date date,
  expected_delivery_date date,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id serial PRIMARY KEY,
  invoice_no text UNIQUE NOT NULL,
  job_id text,
  customer_id integer REFERENCES customers(id),
  invoice_date date,
  taxable_amount numeric,
  gst_amount numeric,
  total_amount numeric,
  payment_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create dispatch table
CREATE TABLE IF NOT EXISTS dispatch (
  id serial PRIMARY KEY,
  dispatch_id text UNIQUE NOT NULL,
  job_id text,
  lr_no text,
  eway_bill_no text,
  dispatch_date date,
  delivered_date date,
  transporter_name text,
  created_at timestamptz DEFAULT now()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id serial PRIMARY KEY,
  emp_id integer REFERENCES employees(id),
  date date,
  in_time time,
  out_time time,
  worked_hours numeric,
  created_at timestamptz DEFAULT now()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id serial PRIMARY KEY,
  expense_id text UNIQUE NOT NULL,
  date date,
  category text,
  amount numeric,
  vendor text,
  related_job_id text,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create monthly_turnover table
CREATE TABLE IF NOT EXISTS monthly_turnover (
  id serial PRIMARY KEY,
  month text UNIQUE NOT NULL,
  amount numeric,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE tooling ENABLE ROW LEVEL SECURITY;
ALTER TABLE challans ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatch ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_turnover ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated access
CREATE POLICY "Allow all access to authenticated users" ON users FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON customers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON employees FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON parts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON machines FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON enquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON jobs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON operations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON job_operations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON inventory FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON tooling FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON challans FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON inspections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON maintenance FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON purchase_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON dispatch FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON attendance FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON expenses FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated users" ON monthly_turnover FOR ALL TO authenticated USING (true) WITH CHECK (true);