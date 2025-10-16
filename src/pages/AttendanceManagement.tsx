import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Users, Clock, FileText, Plus, Search, Filter, Download } from 'lucide-react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';

interface Employee {
  id: string;
  employee_code: string;
  name: string;
  department: string;
  status: string;
}

interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  status: string;
  ot_hours: number;
  notes: string;
  employee?: Employee;
}

interface AttendanceSummary {
  id: string;
  employee_id: string;
  month: number;
  year: number;
  total_working_days: number;
  total_present_days: number;
  total_absent_days: number;
  total_leaves: number;
  total_ot_hours: number;
  employee?: Employee;
}

const statusOptions = [
  { value: 'present', label: 'Present', color: 'bg-green-100 text-green-800' },
  { value: 'absent', label: 'Absent', color: 'bg-red-100 text-red-800' },
  { value: 'leave', label: 'Leave', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'sick_leave', label: 'Sick Leave', color: 'bg-orange-100 text-orange-800' },
  { value: 'paid_leave', label: 'Paid Leave', color: 'bg-blue-100 text-blue-800' },
  { value: 'holiday', label: 'Holiday', color: 'bg-purple-100 text-purple-800' },
  { value: 'sunday', label: 'Sunday', color: 'bg-gray-100 text-gray-800' },
  { value: 'half_day', label: 'Half Day', color: 'bg-indigo-100 text-indigo-800' },
];

export default function AttendanceManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [monthlySummaries, setMonthlySummaries] = useState<AttendanceSummary[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Partial<AttendanceRecord>>({});
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmployees();
    loadAttendanceRecords();
  }, [selectedDate]);

  useEffect(() => {
    if (activeTab === 'monthly') {
      loadMonthlySummaries();
    }
  }, [activeTab, selectedMonth, selectedYear]);

  const loadEmployees = async () => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('status', 'active')
      .order('name');

    if (!error && data) {
      setEmployees(data);
    }
  };

  const loadAttendanceRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('attendance_records')
      .select(`
        *,
        employee:employees(id, employee_code, name, department, status)
      `)
      .eq('date', selectedDate)
      .order('employee.name');

    if (!error && data) {
      setAttendanceRecords(data);
    }
    setLoading(false);
  };

  const loadMonthlySummaries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('attendance_summary')
      .select(`
        *,
        employee:employees(id, employee_code, name, department, status)
      `)
      .eq('month', selectedMonth)
      .eq('year', selectedYear)
      .order('employee.name');

    if (!error && data) {
      setMonthlySummaries(data);
    }
    setLoading(false);
  };

  const handleSaveAttendance = async () => {
    if (!currentRecord.employee_id || !currentRecord.date) {
      alert('Please select employee and date');
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('attendance_records')
      .upsert({
        id: currentRecord.id,
        employee_id: currentRecord.employee_id,
        date: currentRecord.date,
        status: currentRecord.status || 'present',
        ot_hours: currentRecord.ot_hours || 0,
        notes: currentRecord.notes || '',
      });

    if (error) {
      alert('Error saving attendance: ' + error.message);
    } else {
      setShowModal(false);
      setCurrentRecord({});
      loadAttendanceRecords();
    }
    setLoading(false);
  };

  const handleBulkMarkAttendance = async (status: string) => {
    if (!confirm(`Mark all employees as ${status} for ${selectedDate}?`)) return;

    setLoading(true);
    const records = employees.map(emp => ({
      employee_id: emp.id,
      date: selectedDate,
      status: status,
      ot_hours: 0,
    }));

    const { error } = await supabase
      .from('attendance_records')
      .upsert(records);

    if (error) {
      alert('Error marking attendance: ' + error.message);
    } else {
      loadAttendanceRecords();
    }
    setLoading(false);
  };

  const openEditModal = (record?: AttendanceRecord) => {
    if (record) {
      setCurrentRecord(record);
    } else {
      setCurrentRecord({
        date: selectedDate,
        status: 'present',
        ot_hours: 0,
      });
    }
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800';
  };

  const filteredRecords = attendanceRecords.filter(record =>
    record.employee?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSummaries = monthlySummaries.filter(summary =>
    summary.employee?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
            <p className="text-gray-600 mt-1">Track and manage employee attendance</p>
          </div>
          <button
            onClick={() => openEditModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Mark Attendance
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex gap-4 p-4">
              <button
                onClick={() => setActiveTab('daily')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'daily'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Daily Attendance
                </div>
              </button>
              <button
                onClick={() => setActiveTab('monthly')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'monthly'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Monthly Summary
                </div>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex gap-4 items-center">
              {activeTab === 'daily' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkMarkAttendance('present')}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200"
                    >
                      Mark All Present
                    </button>
                    <button
                      onClick={() => handleBulkMarkAttendance('sunday')}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                    >
                      Mark Sunday
                    </button>
                    <button
                      onClick={() => handleBulkMarkAttendance('holiday')}
                      className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200"
                    >
                      Mark Holiday
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                      className="border border-gray-300 rounded-lg px-3 py-2"
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="border border-gray-300 rounded-lg px-3 py-2"
                    >
                      {[2024, 2025, 2026].map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : activeTab === 'daily' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 font-medium text-gray-700">Employee Code</th>
                      <th className="text-left p-3 font-medium text-gray-700">Name</th>
                      <th className="text-left p-3 font-medium text-gray-700">Department</th>
                      <th className="text-left p-3 font-medium text-gray-700">Status</th>
                      <th className="text-left p-3 font-medium text-gray-700">OT Hours</th>
                      <th className="text-left p-3 font-medium text-gray-700">Notes</th>
                      <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-500">
                          No attendance records for this date. Click "Mark Attendance" to add.
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="p-3">{record.employee?.employee_code}</td>
                          <td className="p-3 font-medium">{record.employee?.name}</td>
                          <td className="p-3">{record.employee?.department}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                              {statusOptions.find(s => s.value === record.status)?.label}
                            </span>
                          </td>
                          <td className="p-3">{record.ot_hours}</td>
                          <td className="p-3 text-sm text-gray-600">{record.notes || '-'}</td>
                          <td className="p-3">
                            <button
                              onClick={() => openEditModal(record)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 font-medium text-gray-700">Employee Code</th>
                      <th className="text-left p-3 font-medium text-gray-700">Name</th>
                      <th className="text-right p-3 font-medium text-gray-700">Working Days</th>
                      <th className="text-right p-3 font-medium text-gray-700">Present</th>
                      <th className="text-right p-3 font-medium text-gray-700">Absent</th>
                      <th className="text-right p-3 font-medium text-gray-700">Leaves</th>
                      <th className="text-right p-3 font-medium text-gray-700">OT Hours</th>
                      <th className="text-right p-3 font-medium text-gray-700">Attendance %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredSummaries.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-gray-500">
                          No summary data available for this period.
                        </td>
                      </tr>
                    ) : (
                      filteredSummaries.map((summary) => {
                        const attendancePercentage = summary.total_working_days > 0
                          ? ((summary.total_present_days / summary.total_working_days) * 100).toFixed(1)
                          : '0';

                        return (
                          <tr key={summary.id} className="hover:bg-gray-50">
                            <td className="p-3">{summary.employee?.employee_code}</td>
                            <td className="p-3 font-medium">{summary.employee?.name}</td>
                            <td className="p-3 text-right">{summary.total_working_days}</td>
                            <td className="p-3 text-right text-green-600">{summary.total_present_days}</td>
                            <td className="p-3 text-right text-red-600">{summary.total_absent_days}</td>
                            <td className="p-3 text-right text-yellow-600">{summary.total_leaves}</td>
                            <td className="p-3 text-right">{summary.total_ot_hours}</td>
                            <td className="p-3 text-right">
                              <span className={`font-medium ${
                                Number(attendancePercentage) >= 90 ? 'text-green-600' :
                                Number(attendancePercentage) >= 75 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {attendancePercentage}%
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={currentRecord.id ? 'Edit Attendance' : 'Mark Attendance'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            <select
              value={currentRecord.employee_id || ''}
              onChange={(e) => setCurrentRecord({ ...currentRecord, employee_id: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              disabled={!!currentRecord.id}
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.employee_code} - {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={currentRecord.date || selectedDate}
              onChange={(e) => setCurrentRecord({ ...currentRecord, date: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={currentRecord.status || 'present'}
              onChange={(e) => setCurrentRecord({ ...currentRecord, status: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OT Hours</label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={currentRecord.ot_hours || 0}
              onChange={(e) => setCurrentRecord({ ...currentRecord, ot_hours: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={currentRecord.notes || ''}
              onChange={(e) => setCurrentRecord({ ...currentRecord, notes: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSaveAttendance}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Attendance'}
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
