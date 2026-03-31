import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  Users,
  FolderKanban,
  Tags,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { isAdmin, user, logout } = useAuth();

  const mainItems = isAdmin ? [
    { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Expenses & Incomes", url: "/admin/expenses", icon: ArrowLeftRight },
    { title: "Reports", url: "/admin/reports", icon: BarChart3 },
  ] : [
    { title: "Dashboard", url: "/user/dashboard", icon: LayoutDashboard },
    { title: "Expenses & Incomes", url: "/user/expenses", icon: ArrowLeftRight },
    { title: "Reports", url: "/user/reports", icon: BarChart3 },
  ];

  const adminItems = [
    { title: "User Management", url: "/users", icon: Users },
    { title: "Projects", url: "/projects", icon: FolderKanban },
    { title: "Categories", url: "/categories", icon: Tags },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="pt-6">
        <div className="px-4 mb-6">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <ArrowLeftRight className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-sidebar-accent-foreground">ExpenseFlow</h2>
                <p className="text-xs text-sidebar-foreground/60">Finance Manager</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center">
              <div className="h-9 w-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <ArrowLeftRight className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-widest">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-widest">
              Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <NavLink to={item.url} end>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && user && (
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-medium text-sidebar-accent-foreground">
              {user.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-accent-foreground truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/50 truncate">{user.role}</p>
            </div>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} className="text-sidebar-foreground/60 hover:text-sidebar-accent-foreground">
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
