import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

interface Machine {
  id: number;
  name: string;
  type: string;
  model: string;
  location: string;
  last_pm_date: string;
}

const initialFormData = {
  name: '',
  type: '',
  model: '',
  location: '',
  last_pm_date: '',
};

export default function Machines() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = () => {
    const mockMachines = [
      { id: 1, name: 'CNC-01', type: 'CNC Mill', model: 'Haas VF-2', location: 'Shop Floor 1', last_pm_date: '2025-09-15' },
      { id: 2, name: 'CNC-02', type: 'CNC Lathe', model: 'Mazak QT-250', location: 'Shop Floor 1', last_pm_date: '2025-08-20' },
      { id: 3, name: 'PLT-01', type: 'Plating Line', model: 'Custom', location: 'Plating Section', last_pm_date: '2025-10-01' },
    ];
    setMachines(mockMachines);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMachine = { ...formData, id: Math.max(...machines.map(m => m.id), 0) + 1 };
    setMachines([newMachine, ...machines]);
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
