/*
  # Complete CNC Manufacturing ERP Schema

  ## Overview
  Complete schema for CNC manufacturing ERP including employees, attendance, work orders, and billing

  ## Tables Created
  
  ### Core Tables
  1. `employees` - Employee master data
  2. `attendance_records` - Daily attendance tracking
  3. `attendance_summary` - Monthly attendance aggregates
  4. `leave_applications` - Leave request management
  5. `work_orders` - Job/challan tracking
  6. `salary_details` - Employee salary configuration

  ## Security
  - RLS enabled on all tables
  - Authenticated users can perform CRUD operations
*/

-- Create enums
DO $$ BEGIN
  CREATE TYPE employment_status AS ENUM ('active', 'inactive', 'terminated');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE attendance_status AS ENUM (
    'present',
    'absent',
    'leave',
    'sick_leave',
    'paid_leave',
    'holiday',
    'sunday',
    'half_day'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE leave_type AS ENUM ('casual', 'sick', 'paid', 'emergency');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE work_type AS ENUM ('copper_plating', 'copper_stripping', 'powder_coating', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_code text UNIQUE NOT NULL,
  name text NOT NULL,
  contact_number text,
  email text,
  address text,
  date_of_joining date,
  department text,
  designation text,
  status employment_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Salary Details Table
CREATE TABLE IF NOT EXISTS salary_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid UNIQUE NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  per_day_salary decimal(10,2) NOT NULL DEFAULT 0,
  ot_rate_per_hour decimal(10,2) NOT NULL DEFAULT 0,
  tiffen_cost_per_hour decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Attendance Records Table
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date date NOT NULL,
  status attendance_status NOT NULL DEFAULT 'present',
  ot_hours decimal(5,2) DEFAULT 0 CHECK (ot_hours >= 0),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_employee_date UNIQUE (employee_id, date)
);

-- Attendance Summary Table
CREATE TABLE IF NOT EXISTS attendance_summary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  year integer NOT NULL CHECK (year >= 2000),
  total_working_days integer DEFAULT 0,
  total_present_days integer DEFAULT 0,
  total_absent_days integer DEFAULT 0,
  total_leaves integer DEFAULT 0,
  total_half_days integer DEFAULT 0,
  total_ot_hours decimal(8,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_employee_month_year UNIQUE (employee_id, month, year)
);

-- Leave Applications Table
CREATE TABLE IF NOT EXISTS leave_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  from_date date NOT NULL,
  to_date date NOT NULL,
  leave_type leave_type NOT NULL,
  reason text NOT NULL,
  status leave_status DEFAULT 'pending',
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_date_range CHECK (to_date >= from_date)
);

-- Work Orders / Challans Table
CREATE TABLE IF NOT EXISTS work_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challan_number text UNIQUE NOT NULL,
  part_number text NOT NULL,
  part_description text NOT NULL,
  work_type work_type NOT NULL,
  quantity_received integer NOT NULL DEFAULT 0,
  quantity_delivered integer DEFAULT 0,
  dc_number text,
  delivery_date date,
  zf_sdn text,
  scope text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_code ON employees(employee_code);
CREATE INDEX IF NOT EXISTS idx_attendance_employee_id ON attendance_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_attendance_employee_date ON attendance_records(employee_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_attendance_summary_employee ON attendance_summary(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_summary_period ON attendance_summary(year, month);
CREATE INDEX IF NOT EXISTS idx_leave_applications_employee ON leave_applications(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_applications_status ON leave_applications(status);
CREATE INDEX IF NOT EXISTS idx_work_orders_challan ON work_orders(challan_number);
CREATE INDEX IF NOT EXISTS idx_work_orders_delivery_date ON work_orders(delivery_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_salary_details_updated_at ON salary_details;
CREATE TRIGGER update_salary_details_updated_at
  BEFORE UPDATE ON salary_details
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_attendance_records_updated_at ON attendance_records;
CREATE TRIGGER update_attendance_records_updated_at
  BEFORE UPDATE ON attendance_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_attendance_summary_updated_at ON attendance_summary;
CREATE TRIGGER update_attendance_summary_updated_at
  BEFORE UPDATE ON attendance_summary
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leave_applications_updated_at ON leave_applications;
CREATE TRIGGER update_leave_applications_updated_at
  BEFORE UPDATE ON leave_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_work_orders_updated_at ON work_orders;
CREATE TRIGGER update_work_orders_updated_at
  BEFORE UPDATE ON work_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate monthly summary
CREATE OR REPLACE FUNCTION calculate_attendance_summary(
  p_employee_id uuid,
  p_month integer,
  p_year integer
)
RETURNS void AS $$
DECLARE
  v_working_days integer;
  v_present_days integer;
  v_absent_days integer;
  v_leaves integer;
  v_half_days integer;
  v_ot_hours decimal;
BEGIN
  SELECT
    COUNT(*) FILTER (WHERE status NOT IN ('holiday', 'sunday')),
    COUNT(*) FILTER (WHERE status = 'present'),
    COUNT(*) FILTER (WHERE status = 'absent'),
    COUNT(*) FILTER (WHERE status IN ('leave', 'sick_leave', 'paid_leave')),
    COUNT(*) FILTER (WHERE status = 'half_day'),
    COALESCE(SUM(ot_hours), 0)
  INTO
    v_working_days,
    v_present_days,
    v_absent_days,
    v_leaves,
    v_half_days,
    v_ot_hours
  FROM attendance_records
  WHERE employee_id = p_employee_id
    AND EXTRACT(MONTH FROM date) = p_month
    AND EXTRACT(YEAR FROM date) = p_year;

  INSERT INTO attendance_summary (
    employee_id,
    month,
    year,
    total_working_days,
    total_present_days,
    total_absent_days,
    total_leaves,
    total_half_days,
    total_ot_hours
  ) VALUES (
    p_employee_id,
    p_month,
    p_year,
    v_working_days,
    v_present_days,
    v_absent_days,
    v_leaves,
    v_half_days,
    v_ot_hours
  )
  ON CONFLICT (employee_id, month, year)
  DO UPDATE SET
    total_working_days = EXCLUDED.total_working_days,
    total_present_days = EXCLUDED.total_present_days,
    total_absent_days = EXCLUDED.total_absent_days,
    total_leaves = EXCLUDED.total_leaves,
    total_half_days = EXCLUDED.total_half_days,
    total_ot_hours = EXCLUDED.total_ot_hours,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- Trigger to update summary when attendance changes
CREATE OR REPLACE FUNCTION update_attendance_summary_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM calculate_attendance_summary(
      OLD.employee_id,
      EXTRACT(MONTH FROM OLD.date)::integer,
      EXTRACT(YEAR FROM OLD.date)::integer
    );
  ELSE
    PERFORM calculate_attendance_summary(
      NEW.employee_id,
      EXTRACT(MONTH FROM NEW.date)::integer,
      EXTRACT(YEAR FROM NEW.date)::integer
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS attendance_summary_update ON attendance_records;
CREATE TRIGGER attendance_summary_update
  AFTER INSERT OR UPDATE OR DELETE ON attendance_records
  FOR EACH ROW
  EXECUTE FUNCTION update_attendance_summary_trigger();

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Full access for authenticated users
CREATE POLICY "Users can view all employees" ON employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert employees" ON employees FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update employees" ON employees FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can delete employees" ON employees FOR DELETE TO authenticated USING (true);

CREATE POLICY "Users can view salary details" ON salary_details FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert salary details" ON salary_details FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update salary details" ON salary_details FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can delete salary details" ON salary_details FOR DELETE TO authenticated USING (true);

CREATE POLICY "Users can view attendance records" ON attendance_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert attendance records" ON attendance_records FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update attendance records" ON attendance_records FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can delete attendance records" ON attendance_records FOR DELETE TO authenticated USING (true);

CREATE POLICY "Users can view attendance summaries" ON attendance_summary FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert attendance summaries" ON attendance_summary FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update attendance summaries" ON attendance_summary FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Users can view leave applications" ON leave_applications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert leave applications" ON leave_applications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update leave applications" ON leave_applications FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can delete leave applications" ON leave_applications FOR DELETE TO authenticated USING (true);

CREATE POLICY "Users can view work orders" ON work_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert work orders" ON work_orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update work orders" ON work_orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can delete work orders" ON work_orders FOR DELETE TO authenticated USING (true);
