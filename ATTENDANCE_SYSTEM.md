# Attendance Management System

## Overview

The attendance management system provides comprehensive tracking of employee attendance, overtime hours, and leave management for your CNC manufacturing ERP application.

## Features

### 1. Daily Attendance Tracking
- Mark individual employee attendance with multiple status types
- Bulk operations (mark all as present, Sunday, or holiday)
- Track overtime (OT) hours per employee
- Add notes for special circumstances

### 2. Attendance Status Types
- **Present**: Regular working day attendance
- **Absent**: Employee absent without leave
- **Leave**: Approved casual leave
- **Sick Leave**: Medical leave
- **Paid Leave**: Paid time off
- **Holiday**: Company-declared holiday
- **Sunday**: Weekly off
- **Half Day**: Partial day attendance

### 3. Monthly Summary
- Automatic calculation of monthly attendance metrics
- View working days, present days, absent days, and leaves
- Calculate attendance percentage
- Track total OT hours per month
- Color-coded performance indicators (green > 90%, yellow 75-90%, red < 75%)

### 4. Leave Management
- Leave application submission
- Approval workflow
- Multiple leave types (casual, sick, paid, emergency)
- Date range support

## Database Schema

### Tables

#### `employees`
Core employee information
- `id`: UUID primary key
- `employee_code`: Unique employee identifier
- `name`: Employee full name
- `contact_number`: Phone number
- `email`: Email address
- `address`: Physical address
- `date_of_joining`: Date employee joined
- `department`: Department name
- `designation`: Job title
- `status`: Employment status (active/inactive/terminated)

#### `salary_details`
Employee salary configuration
- `id`: UUID primary key
- `employee_id`: Foreign key to employees
- `per_day_salary`: Daily wage
- `ot_rate_per_hour`: Overtime hourly rate
- `tiffen_cost_per_hour`: Meal allowance per hour

#### `attendance_records`
Daily attendance tracking
- `id`: UUID primary key
- `employee_id`: Foreign key to employees
- `date`: Attendance date
- `status`: Attendance status (enum)
- `ot_hours`: Overtime hours worked
- `notes`: Additional notes
- Unique constraint on (employee_id, date)

#### `attendance_summary`
Monthly aggregated data (auto-calculated)
- `id`: UUID primary key
- `employee_id`: Foreign key to employees
- `month`: Month (1-12)
- `year`: Year
- `total_working_days`: Total workable days
- `total_present_days`: Days present
- `total_absent_days`: Days absent
- `total_leaves`: Days on leave
- `total_half_days`: Half days
- `total_ot_hours`: Total overtime hours
- Unique constraint on (employee_id, month, year)

#### `leave_applications`
Leave request management
- `id`: UUID primary key
- `employee_id`: Foreign key to employees
- `from_date`: Leave start date
- `to_date`: Leave end date
- `leave_type`: Type of leave (enum)
- `reason`: Leave reason
- `status`: Application status (pending/approved/rejected)
- `approved_by`: User who approved
- `approved_at`: Approval timestamp

### Automatic Triggers

The system includes automatic triggers that:
1. **Auto-calculate monthly summaries**: When attendance records are added, updated, or deleted
2. **Update timestamps**: Automatically track when records are modified
3. **Validate data**: Ensure date ranges are valid and OT hours are non-negative

## Usage Guide

### Marking Daily Attendance

1. Navigate to **Attendance Management**
2. Select the date using the date picker
3. Click **Mark Attendance** button
4. Select employee from dropdown
5. Choose attendance status
6. Enter OT hours if applicable
7. Add notes if needed
8. Click **Save Attendance**

### Bulk Operations

For quickly marking attendance for all employees:

1. Select the date
2. Click one of the bulk action buttons:
   - **Mark All Present**: Marks all employees as present
   - **Mark Sunday**: Marks all as Sunday (weekly off)
   - **Mark Holiday**: Marks all as company holiday

### Viewing Monthly Summary

1. Click the **Monthly Summary** tab
2. Select month and year from dropdowns
3. View aggregated attendance metrics for all employees
4. Metrics include:
   - Total working days
   - Present days
   - Absent days
   - Leaves taken
   - Total OT hours
   - Attendance percentage

### Filtering and Search

- Use the search box to filter employees by name
- Search works in both daily and monthly views
- Results update in real-time as you type

## Integration with Existing Modules

### Employee Management
- Attendance system automatically loads active employees
- Updates sync with employee status changes

### Payroll/Billing
- Attendance data can be used for salary calculation
- OT hours tracked for overtime pay computation
- Leave deductions can be calculated from summary data

### Reports
- Export attendance data for reporting
- Generate monthly attendance reports
- Track attendance trends over time

## API Functions

### `calculate_attendance_summary(employee_id, month, year)`
Database function to manually recalculate monthly summary for an employee.

```sql
SELECT calculate_attendance_summary(
  'employee-uuid',
  9,  -- September
  2024
);
```

## Best Practices

1. **Daily Marking**: Mark attendance daily for accurate tracking
2. **OT Hours**: Record overtime hours on the same day they occur
3. **Notes**: Add notes for any unusual circumstances
4. **Monthly Review**: Review monthly summaries before payroll processing
5. **Leave Applications**: Process leave applications before marking attendance

## Data Migration

To import your existing Excel attendance data:

1. Export each month's attendance to CSV
2. Use the bulk import feature (coming soon) or
3. Create SQL scripts to insert historical data

Example SQL for bulk insert:
```sql
INSERT INTO attendance_records (employee_id, date, status, ot_hours)
SELECT
  e.id,
  '2024-09-01'::date,
  'present'::attendance_status,
  0
FROM employees e
WHERE e.status = 'active';
```

## Security

- All tables have Row Level Security (RLS) enabled
- Only authenticated users can view/modify attendance data
- All operations are audited with timestamps
- User roles can be implemented for approval workflows

## Troubleshooting

### Attendance not saving
- Check employee exists and is active
- Verify date format is correct
- Ensure unique constraint (employee + date combination must be unique)

### Monthly summary not updating
- Summary updates automatically via triggers
- If manual recalculation needed, use the `calculate_attendance_summary` function

### Missing employees in list
- Check employee status (must be 'active')
- Verify employee record exists in database

## Future Enhancements

Planned features for future releases:
- [ ] Biometric integration
- [ ] Mobile app for attendance marking
- [ ] Bulk CSV import/export
- [ ] Attendance reports with charts
- [ ] Leave balance tracking
- [ ] Shift management
- [ ] Late arrival/early departure tracking
- [ ] Geo-location based attendance
- [ ] Email notifications for leave approvals
- [ ] Integration with payroll calculation
