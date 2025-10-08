import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

export default function Machines() {
  const [machines, setMachines] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    model: '',
    location: '',
    last_pm_date: '',
  });

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    const { data } = await supabase.from('machines').select('*').order('created_at', { ascending: false });
    if (data) setMachines(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('machines').insert(formData);
    loadMachines();
    setIsModalOpen(false);
    setFormData({ name: '', type: '', model: '', location: '', last_pm_date: '' });
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'model', label: 'Model' },
    { key: 'location', label: 'Location' },
    { key: 'last_pm_date', label: 'Last PM' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Machines</h1>
          <p className="text-slate-600 mt-1">Manage machine master data</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Machine
        </button>
      </div>

      <DataTable columns={columns} data={machines} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Machine">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Model"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <input
            type="date"
            value={formData.last_pm_date}
            onChange={(e) => setFormData({ ...formData, last_pm_date: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">
            Create
          </button>
        </form>
      </Modal>
    </div>
  );
}
