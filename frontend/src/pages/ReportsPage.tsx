import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileDown, Loader2, Filter } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { expenseService, projectService } from "@/services/apiServices";
import { toast } from "sonner";

const COLORS = ["hsl(162, 63%, 41%)", "hsl(38, 92%, 50%)", "hsl(199, 89%, 48%)", "hsl(280, 60%, 55%)", "hsl(340, 75%, 55%)", "hsl(210, 80%, 50%)"];

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [projectData, setProjectData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactions, projects] = await Promise.all([
        expenseService.getAllTransactions(),
        projectService.getAll()
      ]);

      // 1. Process Category Data (Expenses only)
      const catMap: Record<string, number> = {};
      transactions.filter((t: any) => t.type === 'expense').forEach((t: any) => {
        catMap[t.categoryName] = (catMap[t.categoryName] || 0) + (t.amount || 0);
      });
      setCategoryData(Object.entries(catMap).map(([name, value]) => ({ name, value })));

      // 2. Process Project Data
      setProjectData(projects.map((p: any) => ({
        name: p.ProjectName,
        budget: parseFloat(p.Budget) || 0,
        spent: p.spent || 0
      })));

      // 3. Process Monthly Data (Simplified for current month)
      const currentMonth = new Date().toLocaleString('default', { month: 'short' });
      const monthlyTotal = transactions
        .filter((t: any) => t.type === 'expense')
        .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
      
      setMonthlyData([{ month: currentMonth, total: monthlyTotal }]);

    } catch (error) {
      toast.error("Failed to fetch report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-40">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        description="Deep-dive into your financial data"
        actions={
          <Button variant="outline" onClick={() => toast.success("PDF report generated!")}>
            <FileDown className="h-4 w-4 mr-2" /> Export PDF
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Category-wise breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card rounded-xl border p-5 shadow-sm"
        >
          <h3 className="text-sm font-medium mb-4">Category-wise Expenses</h3>
          <div className="h-64 flex items-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full text-center text-xs text-muted-foreground">No expense data available</div>
            )}
          </div>
          <div className="flex flex-wrap gap-4 mt-2 justify-center">
            {categoryData.slice(0, 6).map((c, i) => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-muted-foreground">{c.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Monthly trend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card rounded-xl border p-5 shadow-sm"
        >
          <h3 className="text-sm font-medium mb-4">Monthly Expense Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, "Total"]} />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Project-wise */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-card rounded-xl border p-5 shadow-sm"
      >
        <h3 className="text-sm font-medium mb-4">Project-wise Budget vs Utilization</h3>
        <div className="h-72">
          {projectData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectData} layout="vertical" barGap={2}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `₹${v / 1000}k`} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={130} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="budget" name="Budget" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} opacity={0.3} />
                <Bar dataKey="spent" name="Spent" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground">No project data available</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
