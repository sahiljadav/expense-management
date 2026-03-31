import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import AdminExpensesPage from "./pages/admin/AdminExpensesPage";
import UserExpensesPage from "./pages/user/UserExpensesPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import UserReportsPage from "./pages/user/UserReportsPage";
import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import ReportsPage from "./pages/ReportsPage";
import UserManagementPage from "./pages/UserManagementPage";
import ProjectsPage from "./pages/ProjectsPage";
import CategoriesPage from "./pages/CategoriesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, adminOnly = false, userOnly = false }: { children: React.ReactNode; adminOnly?: boolean; userOnly?: boolean }) {
  const { user, isAdmin } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (adminOnly && !isAdmin) {
    return <Navigate to="/user/dashboard" replace />;
  }
  
  if (userOnly && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return <AppLayout>{children}</AppLayout>;
}

function RoleRedirect({ path }: { path: string }) {
  const { user, isAdmin } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;

  if (path === "dashboard") {
    return <Navigate to={isAdmin ? "/admin/dashboard" : "/user/dashboard"} replace />;
  }
  if (path === "expenses") {
    return <Navigate to={isAdmin ? "/admin/expenses" : "/user/expenses"} replace />;
  }
  if (path === "reports") {
    return <Navigate to={isAdmin ? "/admin/reports" : "/user/reports"} replace />;
  }
  return <Navigate to="/" replace />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/admin-login" element={user ? <Navigate to="/dashboard" replace /> : <AdminLoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      
      {/* Redirectors */}
      <Route path="/dashboard" element={<ProtectedRoute><RoleRedirect path="dashboard" /></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute><RoleRedirect path="expenses" /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><RoleRedirect path="reports" /></ProtectedRoute>} />

      {/* Admin Pages */}
      <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/expenses" element={<ProtectedRoute adminOnly><AdminExpensesPage /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute adminOnly><AdminReportsPage /></ProtectedRoute>} />
      
      {/* User Pages */}
      <Route path="/user/dashboard" element={<ProtectedRoute userOnly><UserDashboard /></ProtectedRoute>} />
      <Route path="/user/expenses" element={<ProtectedRoute userOnly><UserExpensesPage /></ProtectedRoute>} />
      <Route path="/user/reports" element={<ProtectedRoute userOnly><UserReportsPage /></ProtectedRoute>} />

      {/* Shared Admin-only management */}
      <Route path="/users" element={<ProtectedRoute adminOnly><UserManagementPage /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute adminOnly><ProjectsPage /></ProtectedRoute>} />
      <Route path="/categories" element={<ProtectedRoute adminOnly><CategoriesPage /></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
