import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Users, Briefcase, Settings as SettingsIcon, Plus, Mail, Shield, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function Settings() {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'projects' | 'categories'>('users');

  const users = [
    { id: 1, name: 'John Doe', email: 'john@company.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@company.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Mike Ross', email: 'mike@company.com', role: 'User', status: 'Inactive' },
  ];

  const projects = [
    { id: 1, name: 'Project Alpha', client: 'Acme Corp', budget: '₹40,00,000', spent: '₹9,60,000' },
    { id: 2, name: 'Project Beta', client: 'Global Tech', budget: '₹24,00,000', spent: '₹6,80,000' },
    { id: 3, name: 'Internal Operations', client: 'Company', budget: '₹8,00,000', spent: '₹1,84,000' },
  ];

  const categories = [
    { id: 1, name: 'Travel', sub: ['Taxi', 'Flight', 'Fuel', 'Parking'] },
    { id: 2, name: 'Food', sub: ['Client Lunch', 'Office Snacks', 'Travel Dinner'] },
    { id: 3, name: 'Stay', sub: ['Hotel', 'Airbnb', 'Guesthouse'] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Management</h1>
          <p className="text-gray-500">Manage users, projects, and finance categories</p>
        </div>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeSubTab === 'users' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users size={18} className="mr-2" />
          Users
        </button>
        <button
          onClick={() => setActiveSubTab('projects')}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeSubTab === 'projects' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Briefcase size={18} className="mr-2" />
          Projects
        </button>
        <button
          onClick={() => setActiveSubTab('categories')}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeSubTab === 'categories' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <SettingsIcon size={18} className="mr-2" />
          Categories
        </button>
      </div>

      {activeSubTab === 'users' && (
        <Card title="User Directory">
          <div className="space-y-4">
            <div className="flex justify-end">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                <Plus size={18} className="mr-2" />
                Invite User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">User</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Role</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          <Shield size={12} className="mr-1" />
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button className="text-gray-400 hover:text-blue-600 text-sm font-medium">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {activeSubTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Briefcase size={20} />
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Plus size={16} />
                </button>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
              <p className="text-sm text-gray-500 mb-6">{project.client}</p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Budget Spent</span>
                    <span className="font-semibold text-gray-900">{project.spent} / {project.budget}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(parseFloat(project.spent.replace('₹', '').replace(/,/g, '')) / parseFloat(project.budget.replace('₹', '').replace(/,/g, ''))) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
          <button className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all">
            <Plus size={32} className="mb-2" />
            <span className="font-medium">Create New Project</span>
          </button>
        </div>
      )}

      {activeSubTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <Card key={cat.id} title={cat.name}>
              <div className="space-y-2">
                {cat.sub.map((sub) => (
                  <div key={sub} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                    <span className="text-sm text-gray-700">{sub}</span>
                    <button className="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all">
                      <XCircle size={16} />
                    </button>
                  </div>
                ))}
                <button className="w-full mt-2 py-2 border-2 border-dashed border-gray-100 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-50 hover:text-blue-600 transition-all">
                  + Add Subcategory
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
