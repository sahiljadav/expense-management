import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';
import { StatCard, Card } from '../ui/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart as RePieChart,
  Pie
} from 'recharts';

const data = [
  { name: 'Jan', income: 320000, expense: 192000 },
  { name: 'Feb', income: 240000, expense: 111840 },
  { name: 'Mar', income: 160000, expense: 784000 },
  { name: 'Apr', income: 222400, expense: 312640 },
  { name: 'May', income: 151200, expense: 384000 },
  { name: 'Jun', income: 191200, expense: 304000 },
];

const categoryData = [
  { name: 'Travel', value: 32000, color: '#3b82f6' },
  { name: 'Food', value: 24000, color: '#10b981' },
  { name: 'Stay', value: 24000, color: '#f59e0b' },
  { name: 'Office', value: 16000, color: '#8b5cf6' },
];

const recentExpenses = [
  { id: 1, user: 'John Doe', category: 'Travel', amount: 9600, status: 'Approved', date: '2024-02-08' },
  { id: 2, user: 'Jane Smith', category: 'Food', amount: 3600, status: 'Pending', date: '2024-02-09' },
  { id: 3, user: 'Mike Ross', category: 'Stay', amount: 68000, status: 'Reviewing', date: '2024-02-10' },
  { id: 4, user: 'Sarah Connor', category: 'Purchase', amount: 120000, status: 'Approved', date: '2024-02-07' },
];

interface DashboardProps {
  role: 'admin' | 'user';
}

export function Overview({ role }: DashboardProps) {
  const [summary, setSummary] = useState({ totalIncomes: 0, totalExpenses: 0, balance: 0 });

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const { data } = await api.get('/expenses/summary');
      setSummary({
        totalIncomes: data.totalIncomes || 0,
        totalExpenses: data.totalExpenses || 0,
        balance: data.balance || 0
      });
    } catch (error) {
      console.error('Error fetching summary', error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {role === 'admin' ? 'Organization Overview' : 'Personal Dashboard'}
          </h1>
          <p className="text-gray-500">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
            Download PDF
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
            Add Expense
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Income"
          value={`₹${summary.totalIncomes.toLocaleString()}`}
          trend={{ value: '+12.5%', isPositive: true }}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Total Expenses"
          value={`₹${summary.totalExpenses.toLocaleString()}`}
          trend={{ value: '-2.4%', isPositive: false }}
          icon={TrendingDown}
          color="red"
        />
        <StatCard
          title="Net Balance"
          value={`₹${summary.balance.toLocaleString()}`}
          icon={Wallet}
          color="blue"
        />
        <StatCard
          title="Pending Approvals"
          value="18"
          icon={Clock}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card title="Monthly Cashflow" className="lg:col-span-2">
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`₹${value}`, '']}
                />
                <Bar dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie Chart */}
        <Card title="Expense Distribution">
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value}`} />
              </RePieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-2xl font-bold text-gray-900">₹96,000</span>
              <span className="text-xs text-gray-500 uppercase">Total</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: cat.color }} />
                  <span className="text-gray-600">{cat.name}</span>
                </div>
                <span className="font-medium text-gray-900">₹{cat.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card title="Recent Transactions">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs">
                        {expense.user.charAt(0)}
                      </div>
                      <span className="ml-3 font-medium text-gray-900">{expense.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{expense.category}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{expense.date}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">₹{expense.amount}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${expense.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        expense.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <button className="text-blue-600 hover:text-blue-700 font-medium">View</button>
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
