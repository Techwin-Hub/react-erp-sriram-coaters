# CNC & Plating Job Shop ERP System

A comprehensive single-admin ERP frontend application for managing CNC machining and plating operations. Built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

## Features

### Master Data Management
- **Customers** - Manage customer information with GSTIN, contact details, billing/shipping addresses
- **Employees** - Track employees with roles, shifts, and skill levels
- **Parts** - Maintain part master with revisions, materials, and drawing references
- **Machines** - Machine inventory with maintenance tracking

### Operations Management
- **Enquiries & Quotations** - Track customer enquiries and generate quotes
- **Job Orders** - Multi-step job creation wizard with routing and scheduling
- **Routing & Operations** - Define operation templates for parts
- **Shop Floor** - Real-time production tracking with start/pause/complete actions

### Inventory & Supply Chain
- **Inventory** - Track raw materials and finished goods
- **Tooling** - Manage tools with cost and life tracking
- **Purchase Orders** - Procurement management

### Plating Operations
- **Challans** - Create and track plating challans with send/receive workflow
- **Quality Inspections** - First piece and final inspections with measurements

### Financial Management
- **Billing & Invoices** - Generate invoices with GST calculation and print functionality
- **Expenses** - Track all business expenses
- **Dispatch** - Manage logistics with LR and e-way bill tracking

### HR & Administration
- **Attendance** - CSV upload for attendance data with preview
- **Maintenance** - Schedule and track machine maintenance
- **Reports** - Export data to CSV for monthly turnover, jobs, and challans

### Dashboard
- Interactive metrics cards showing:
  - Open jobs
  - Completed jobs
  - Monthly turnover
  - Pending challans
  - Machine utilization
  - Receivables
- Visual charts for monthly turnover and job status distribution
- Quick action buttons for common tasks

## Technology Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **CSV Handling**: PapaParse

## Prerequisites

- Node.js 16+ and npm
- Supabase account with database configured

## Installation

1. Clone the repository:
```bash
cd project
```

2. Install dependencies:
```bash
npm install
```

3. The Supabase environment variables should already be configured in `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. The database schema and seed data have been automatically created via migrations.

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`

3. Login with the default credentials:
   - **Username**: `admin`
   - **Password**: `admin`

## Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Database Schema

The application uses the following main tables:
- `users` - Admin authentication
- `customers` - Customer master data
- `employees` - Employee records
- `parts` - Part/item master
- `machines` - Machine inventory
- `enquiries` - Sales enquiries
- `jobs` - Job orders/work orders
- `operations` - Routing templates
- `job_operations` - Actual job tracking
- `inventory` - Stock management
- `tooling` - Tool management
- `challans` - Plating challans
- `inspections` - Quality records
- `maintenance` - Maintenance logs
- `purchase_orders` - Procurement
- `invoices` - Billing
- `dispatch` - Logistics
- `attendance` - Employee attendance
- `expenses` - Expense tracking
- `monthly_turnover` - Revenue tracking

## Seed Data

The database is pre-populated with realistic mock data including:
- 5 customers (ZF India, Rane Brake, TVS Motors, Bosch, Mahindra)
- 8 employees across different roles and shifts
- 8 parts with revisions and materials
- 3 CNC machines
- 10 jobs in various states
- 4 challans (3 sent, 1 received)
- 6 months of turnover data
- Invoices, expenses, and other operational data

## Key Workflows

### Creating a Job Order
1. Navigate to Jobs → Create Job
2. Step 1: Enter job details (customer, part, quantity, due date)
3. Step 2: Define routing operations
4. Step 3: Review and submit
5. Job appears in pending state

### Shop Floor Operations
1. Navigate to Shop Floor
2. Click "Start" on a pending job to begin production
3. Use "Pause" to temporarily halt work
4. Click "Complete" and enter quantity completed
5. Job status updates automatically

### Challan Management
1. Navigate to Challans → Create Challan
2. Select job, customer, and plating process details
3. Submit to mark challan as "sent"
4. Click "View" on sent challan to mark as "received"
5. Job status updates to completed

### Attendance Upload
1. Navigate to Attendance → Upload CSV
2. Download template for reference format
3. Select CSV file with attendance data
4. Preview records before saving
5. Click "Save to Database" to import

### Generating Invoices
1. Navigate to Billing → Create Invoice
2. Select completed job and customer
3. Enter taxable amount (GST calculated automatically)
4. Submit to create invoice
5. Click "View" to print invoice

## Module Status

### Fully Implemented
- Login/Authentication
- Dashboard with metrics and charts
- Customers (full CRUD)
- Employees (full CRUD)
- Parts (full CRUD)
- Machines (full CRUD)
- Jobs (with wizard)
- Shop Floor (production tracking)
- Challans (send/receive workflow)
- Billing (with print)
- Attendance (CSV upload)
- Reports (CSV export)

### List Views Implemented
- Enquiries
- Routing/Operations
- Inventory
- Tooling
- Quality
- Maintenance
- Purchase
- Dispatch
- Expenses

All modules are connected to the database and display real data. The core workflows are fully functional.

## CSV Templates

### Attendance Template Format
```csv
emp_id,date,in_time,out_time,worked_hours
1,2025-10-07,08:00,17:00,9.0
2,2025-10-07,08:00,17:00,9.0
```

## API Endpoints (Supabase)

All data is accessed through Supabase's auto-generated REST API:
- GET/POST/PUT/DELETE for all tables
- Real-time subscriptions available
- Row-level security enabled
- Full CRUD operations

## Security

- Admin-only access with hardcoded credentials (for prototype)
- Row-level security enabled on all tables
- Authenticated access required for all operations
- No public access to data

## Future Enhancements

- Multi-user support with role-based access
- Real-time notifications
- Advanced reporting and analytics
- Mobile responsive improvements
- Barcode/QR code scanning
- Document attachment support
- Email notifications
- Advanced scheduling algorithms

## License

This project is for demonstration purposes.

## Support

For issues or questions, please refer to the codebase documentation or contact the development team.
