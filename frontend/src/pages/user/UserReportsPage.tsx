import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileDown, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { userService } from "@/services/apiServices";
import { toast } from "sonner";

const COLORS = ["hsl(162, 63%, 41%)", "hsl(38, 92%, 50%)", "hsl(199, 89%, 48%)", "hsl(280, 60%, 55%)", "hsl(340, 75%, 55%)"];

export default function UserReportsPage() {
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [personalSummary, setPersonalSummary] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactions, summary] = await Promise.all([
        userService.getTransactions(),
        userService.getSummary()
      ]);

      const catMap: Record<string, number> = {};
      transactions.filter((t: any) => t.type === 'expense').forEach((t: any) => {
        catMap[t.categoryName] = (catMap[t.categoryName] || 0) + (t.amount || 0);
      });
      setCategoryData(Object.entries(catMap).map(([name, value]) => ({ name, value })));

      setPersonalSummary([
        { name: "Income", value: summary.totalIncomes },
        { name: "Expenses", value: summary.totalExpenses }
      ]);
    } catch (error) { toast.error("Failed to fetch personal reports"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="p-40 flex justify-center"><Loader2 className="h-10 w-10 animate-spin" /></div>;

  return (
    <div>
      <PageHeader title="My Reports" description="Visual breakdown of your personal finances" 
        actions={<Button variant="outline"><FileDown className="h-4 w-4 mr-2" /> Download My Data</Button>} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-medium mb-4">Where my money goes</h3>
          <div className="h-64">
             <ResponsiveContainer><PieChart><Pie data={categoryData} innerRadius={60} outerRadius={80} dataKey="value">{categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-medium mb-4">Total Income vs Expenses</h3>
          <div className="h-64">
            <ResponsiveContainer><BarChart data={personalSummary}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
