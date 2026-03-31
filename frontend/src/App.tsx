import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Overview } from './components/dashboard/Overview';
import { ExpenseManager } from './components/expenses/ExpenseManager';
import { Settings } from './components/management/Settings';
import { Login } from './components/auth/Login';
import { Toaster } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';



export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Authentication logic
  const handleLogin = (userRole: 'admin' | 'user') => {
    setRole(userRole);
    setIsLoggedIn(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Toaster position="top-right" />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full border-r border-border">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          role={role}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto relative bg-background">
        {/* Header for mobile or profile info */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-8 py-4 flex items-center justify-between transition-colors duration-300">
          <div className="lg:hidden flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
              <span className="font-bold">E</span>
            </div>
            <span className="font-bold text-foreground">ExpenseFlow</span>
          </div>

          <div className="flex-1" />

          <div className="flex items-center space-x-4">

            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-foreground">{role === 'admin' ? 'Admin User' : 'Standard User'}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-tighter">{role}</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-primary/10 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1595436222774-4b1cd819aada?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzA2OTc5OTB8MA"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <Overview role={role} />}
              {activeTab === 'expenses' && <ExpenseManager />}
              {activeTab === 'reports' && (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Detailed Analytics</h2>
                    <p className="text-gray-500 mb-6">Deep dive into project-wise and category-wise spending with advanced filters.</p>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Generate PDF Report
                    </button>
                  </div>
                </div>
              )}
              {activeTab === 'users' && <Settings />}
              {activeTab === 'projects' && <Settings />}
              {activeTab === 'settings' && <Settings />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
