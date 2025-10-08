import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import DataTable from '../components/DataTable';
import { Upload, Download } from 'lucide-react';
import Papa from 'papaparse';

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [preview, setPreview] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    const { data } = await supabase
      .from('attendance')
      .select('*, employees(name)')
      .order('date', { ascending: false })
      .limit(50);
    if (data) setAttendance(data);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setPreview(results.data.filter((row: any) => row.emp_id && row.date));
        setShowPreview(true);
      },
    });
  };

  const handleSaveAttendance = async () => {
    const records = preview.map((row: any) => ({
      emp_id: parseInt(row.emp_id),
      date: row.date,
      in_time: row.in_time,
      out_time: row.out_time,
      worked_hours: parseFloat(row.worked_hours),
    }));

    await supabase.from('attendance').insert(records);
    loadAttendance();
    setShowPreview(false);
    setPreview([]);
  };

  const downloadTemplate = () => {
    const csv = 'emp_id,date,in_time,out_time,worked_hours\n1,2025-10-07,08:00,17:00,9.0\n2,2025-10-07,08:00,17:00,9.0';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_template.csv';
    a.click();
  };

  const exportAttendance = () => {
    const csv = Papa.unparse(attendance);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_export.csv';
    a.click();
  };

  const columns = [
    { key: 'employees', label: 'Employee', render: (v: any) => v?.name },
    { key: 'date', label: 'Date' },
    { key: 'in_time', label: 'In Time' },
    { key: 'out_time', label: 'Out Time' },
    { key: 'worked_hours', label: 'Hours Worked' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance & Payroll</h1>
          <p className="text-slate-600 mt-1">Upload and manage employee attendance</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={downloadTemplate}
            className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center transition"
          >
            <Download className="w-4 h-4 mr-2" />
            Template
          </button>
          <button
            onClick={exportAttendance}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Upload CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {showPreview && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-4">Preview ({preview.length} records)</h3>
          <div className="overflow-x-auto max-h-64 overflow-y-auto mb-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Emp ID</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">In Time</th>
                  <th className="text-left p-2">Out Time</th>
                  <th className="text-left p-2">Hours</th>
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 10).map((row, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2">{row.emp_id}</td>
                    <td className="p-2">{row.date}</td>
                    <td className="p-2">{row.in_time}</td>
                    <td className="p-2">{row.out_time}</td>
                    <td className="p-2">{row.worked_hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSaveAttendance}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              Save to Database
            </button>
            <button
              onClick={() => { setShowPreview(false); setPreview([]); }}
              className="bg-slate-300 hover:bg-slate-400 text-slate-800 px-4 py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <DataTable columns={columns} data={attendance} actions={false} />
    </div>
  );
}
