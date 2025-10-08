import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

interface Part {
  id?: number;
  part_no: string;
  rev: string;
  description: string;
  material: string;
  client_part_no: string;
  drawing_url: string;
}

export default function Parts() {
  const [parts, setParts] = useState<Part[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [formData, setFormData] = useState<Part>({
    part_no: '',
    rev: 'A',
    description: '',
    material: '',
    client_part_no: '',
    drawing_url: '',
  });

  useEffect(() => {
    loadParts();
  }, []);

  const loadParts = () => {
    const mockParts = [
      { id: 1, part_no: 'P1001', rev: 'A', description: 'Main Gear', material: 'EN24', client_part_no: 'CPN-001', drawing_url: '' },
      { id: 2, part_no: 'P1002', rev: 'B', description: 'Pinion Shaft', material: 'MS', client_part_no: 'CPN-002', drawing_url: '' },
      { id: 3, part_no: 'P2001', rev: 'A', description: 'Flange', material: 'SS304', client_part_no: 'CPN-003', drawing_url: '' },
    ];
    setParts(mockParts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPart?.id) {
      setParts(parts.map(p => p.id === editingPart.id ? { ...formData, id: editingPart.id } : p));
    } else {
      const newPart = { ...formData, id: Math.max(...parts.map(p => p.id || 0), 0) + 1 };
      setParts([newPart, ...parts]);
    }
    handleClose();
  };

  const handleEdit = (part: Part) => {
    setEditingPart(part);
    setFormData(part);
    setIsModalOpen(true);
  };

  const handleDelete = (part: Part) => {
    if (confirm(`Are you sure you want to delete ${part.part_no}?`)) {
      setParts(parts.filter(p => p.id !== part.id));
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingPart(null);
    setFormData({
      part_no: '',
      rev: 'A',
      description: '',
      material: '',
      client_part_no: '',
      drawing_url: '',
    });
  };

  const columns = [
    { key: 'part_no', label: 'Part No' },
    { key: 'rev', label: 'Rev' },
    { key: 'description', label: 'Description' },
    { key: 'material', label: 'Material' },
    { key: 'client_part_no', label: 'Client Part No' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Parts</h1>
          <p className="text-slate-600 mt-1">Manage part master data</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Part
        </button>
      </div>

      <DataTable columns={columns} data={parts} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={editingPart ? 'Edit Part' : 'Add Part'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Part Number</label>
              <input
                type="text"
                value={formData.part_no}
                onChange={(e) => setFormData({ ...formData, part_no: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
                disabled={!!editingPart}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Revision</label>
              <input
                type="text"
                value={formData.rev}
                onChange={(e) => setFormData({ ...formData, rev: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Material</label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Client Part No</label>
              <input
                type="text"
                value={formData.client_part_no}
                onChange={(e) => setFormData({ ...formData, client_part_no: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Drawing URL</label>
              <input
                type="text"
                value={formData.drawing_url}
                onChange={(e) => setFormData({ ...formData, drawing_url: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="/drawings/part-xxx.pdf"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              {editingPart ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
