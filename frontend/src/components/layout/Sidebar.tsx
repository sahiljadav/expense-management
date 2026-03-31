import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Users, 
  Briefcase, 
  Settings as SettingsIcon, 
  PieChart, 
  LogOut,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: 'admin' | 'user';
  onLogout: () => void;
}

export function Sidebar({ activeTab, setActiveTab, role, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'reports', label: 'Reports', icon: PieChart },
  ];

  const adminItems = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'settings', label: 'Categories', icon: SettingsIcon },
  ];

  const NavItem = ({ item }: { item: any }) => {
    const isActive = activeTab === item.id;
    return (
      <button
        onClick={() => setActiveTab(item.id)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
          isActive 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
            : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
        }`}
      >
        <div className="flex items-center">
          <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:text-blue-600'} />
          <span className="ml-3 font-medium">{item.label}</span>
        </div>
        {isActive && <ChevronRight size={16} />}
      </button>
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Receipt className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">ExpenseFlow</span>
        </div>

        <nav className="space-y-2">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Main Menu</p>
          {menuItems.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}

          {role === 'admin' && (
            <>
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-8 mb-4">Administration</p>
              {adminItems.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </>
          )}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-50">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span className="ml-3 font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
}
