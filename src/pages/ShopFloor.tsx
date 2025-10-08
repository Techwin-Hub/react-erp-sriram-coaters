import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Play, Pause, CheckCircle, AlertCircle } from 'lucide-react';

interface Job {
  id: number;
  job_id: string;
  part_no: string;
  qty_ordered: number;
  qty_completed: number;
  status: string;
  current_operation: string | null;
  customers?: { name: string };
}

export default function ShopFloor() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const { data } = await supabase
      .from('jobs')
      .select('*, customers(name)')
      .in('status', ['pending', 'in-progress'])
      .order('due_date');

    if (data) setJobs(data);
  };

  const handleStartOperation = async (job: Job) => {
    await supabase
      .from('jobs')
      .update({
        status: 'in-progress',
        current_operation: 'Operation 1',
      })
      .eq('id', job.id);

    loadJobs();
  };

  const handlePauseOperation = async (job: Job) => {
    await supabase
      .from('jobs')
      .update({
        status: 'pending',
        current_operation: null,
      })
      .eq('id', job.id);

    loadJobs();
  };

  const handleCompleteOperation = async (job: Job) => {
    const completed = prompt('Enter quantity completed:', job.qty_ordered.toString());
    if (!completed) return;

    const qtyCompleted = parseInt(completed);
    const isFullyCompleted = qtyCompleted >= job.qty_ordered;

    await supabase
      .from('jobs')
      .update({
        qty_completed: qtyCompleted,
        status: isFullyCompleted ? 'completed' : 'in-progress',
        current_operation: isFullyCompleted ? null : job.current_operation,
      })
      .eq('id', job.id);

    loadJobs();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Shop Floor</h1>
        <p className="text-slate-600 mt-1">Production tracking and job management</p>
      </div>

      <div className="grid gap-4">
        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-slate-500">
            No active jobs
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-slate-900">{job.job_id}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {job.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-slate-600">
                    <p>Customer: <span className="font-medium text-slate-900">{job.customers?.name}</span></p>
                    <p>Part: <span className="font-medium text-slate-900">{job.part_no}</span></p>
                    <p>Progress: <span className="font-medium text-slate-900">{job.qty_completed} / {job.qty_ordered}</span></p>
                    {job.current_operation && (
                      <p>Current Operation: <span className="font-medium text-slate-900">{job.current_operation}</span></p>
                    )}
                  </div>

                  <div className="mt-4 w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min((job.qty_completed / job.qty_ordered) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-6">
                  {job.status === 'pending' ? (
                    <button
                      onClick={() => handleStartOperation(job)}
                      className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handlePauseOperation(job)}
                        className="flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm transition"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </button>
                      <button
                        onClick={() => handleCompleteOperation(job)}
                        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Active Jobs</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {jobs.filter((j) => j.status === 'in-progress').length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Play className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Pending Jobs</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {jobs.filter((j) => j.status === 'pending').length}
              </p>
            </div>
            <div className="p-3 bg-slate-100 rounded-full">
              <Pause className="w-6 h-6 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Machine Utilization</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">78%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
