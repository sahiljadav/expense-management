import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, FileText, Calendar, Tag, MapPin, IndianRupee, Paperclip, MoreVertical } from 'lucide-react';
import { Card } from '../ui/Card';
import { toast } from 'sonner';
import { api } from '../../api';

interface Expense {
  id: string;
  date: string;
  category: string;
  subcategory: string;
  project: string;
  amount: number;
  remarks: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const mockExpenses: Expense[] = [
  { id: '1', date: '2024-02-10', category: 'Travel', subcategory: 'Taxi', project: 'Project Alpha', amount: 2040.00, remarks: 'Client meeting in downtown', status: 'Pending' },
  { id: '2', date: '2024-02-09', category: 'Food', subcategory: 'Dinner', project: 'Project Beta', amount: 3600.00, remarks: 'Dinner with stakeholders', status: 'Approved' },
  { id: '3', date: '2024-02-08', category: 'Stay', subcategory: 'Hotel', project: 'Project Gamma', amount: 36000.00, remarks: 'Business trip to Mumbai', status: 'Rejected' },
];

export function ExpenseManager() {
  const [showForm, setShowForm] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data } = await api.get('/expenses');
      setExpenses(data.map((e: any) => ({
        id: e.ExpenseID.toString(),
        date: new Date(e.ExpenseDate).toISOString().split('T')[0],
        category: e.Category ? e.Category.CategoryName : 'General',
        subcategory: e.SubCategory ? e.SubCategory.SubCategoryName : '',
        project: e.Project ? e.Project.ProjectName : 'General',
        amount: parseFloat(e.Amount),
        remarks: e.ExpenseDetail || '',
        status: 'Approved' // Just hardcoding display status for now
      })));
    } catch (error) {
      console.error('Error fetching expenses', error);
      toast.error('Failed to load expenses');
    }
  };

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    subcategory: '',
    project: '',
    amount: '',
    remarks: '',
  });

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/expenses', {
        ExpenseDate: formData.date,
        Amount: formData.amount,
        ExpenseDetail: formData.remarks,
        // Using static IDs for category/project since no selections are wired yet
        CategoryID: 1, 
        ProjectID: 1
      });
      setShowForm(false);
      toast.success('Expense recorded successfully!');
      fetchExpenses(); // Refresh the list
    } catch (error) {
      toast.error('Failed to record expense');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses & Incomes</h1>
          <p className="text-gray-500">Manage and track all financial activities</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
            <Download size={18} className="mr-2" />
            Export
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
          >
            <Plus size={18} className="mr-2" />
            Add New Entry
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" title="Record New Expense/Income">
            <form onSubmit={handleAddExpense} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input 
                      type="date" 
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project/Department</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <select 
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                      value={formData.project}
                      onChange={e => setFormData({...formData, project: e.target.value})}
                    >
                      <option value="">Select Project</option>
                      <option value="Project Alpha">Project Alpha</option>
                      <option value="Project Beta">Project Beta</option>
                      <option value="Internal Operations">Internal Operations</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <select 
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="">Select Category</option>
                      <option value="Travel">Travel</option>
                      <option value="Food">Food</option>
                      <option value="Stay">Stay</option>
                      <option value="Purchase">Purchase</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={e => setFormData({...formData, amount: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Additional details..."
                  value={formData.remarks}
                  onChange={e => setFormData({...formData, remarks: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attachment (Receipt)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <Paperclip className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="!p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search expenses..." 
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <Filter size={16} className="mr-2" />
            Filters
          </button>
          <div className="h-6 w-px bg-gray-200 hidden md:block" />
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">View:</span>
            <button className="p-2 bg-blue-50 text-blue-600 rounded-md">
              <FileText size={18} />
            </button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{exp.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{exp.project}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-900">{exp.category}</span>
                      <span className="text-xs text-gray-500">{exp.subcategory}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">₹{exp.amount.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      exp.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                      exp.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {exp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
