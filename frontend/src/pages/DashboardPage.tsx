import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IndianRupee, Clock, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { expenseService, peopleService } from "@/services/apiServices";
import { Transaction } from "@/types";
import { toast } from "sonner";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalExpenses: 0, totalIncomes: 0, balance: 0 });
  const [recent, setRecent] = useState<Transaction[]>([]);
  const [employeeCount, setEmployeeCount] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryData, transactions] = await Promise.all([
        expenseService.getSummary(),
        expenseService.getAllTransactions()
      ]);
      setSummary(summaryData);
      setRecent(transactions.slice(0, 5));

      if (isAdmin) {
        const people = await peopleService.getAll();
        setEmployeeCount(people.length);
      } else {
        setEmployeeCount(transactions.filter((t: any) => t.type === 'expense').length);
      }
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Simple chart data mapping - last 6 months or just placeholders for now based on actual data
  const chartData = [
    { month: "Current", expenses: summary.totalExpenses, income: summary.totalIncomes },
  ];

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
        title={`Welcome back, ${user?.name.split(" ")[0]}`}
        description="Here's your financial overview"
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <StatCard
          title="Monthly Expenses"
          value={`₹${summary.totalExpenses.toLocaleString()}`}
          icon={IndianRupee}
          trend={{ value: "Live data", positive: true }}
        />
        <StatCard
          title="Net Balance"
          value={`₹${summary.balance.toLocaleString()}`}
          icon={TrendingUp}
          color={summary.balance >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}
        />
        <StatCard
          title={isAdmin ? "Total Employees" : "My Entries"}
          value={employeeCount.toString()}
          icon={Users}
          color="bg-info/10 text-info"
        />
        <StatCard
          title="Monthly Income"
          value={`₹${summary.totalIncomes.toLocaleString()}`}
          icon={ArrowUpRight}
          color="bg-success/10 text-success"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-3 bg-card rounded-xl border p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Spending vs Income</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, undefined]}
                />
                <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expenses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} opacity={0.7} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-2 bg-card rounded-xl border p-5 shadow-sm"
        >
          <h3 className="text-sm font-medium mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recent.map((t) => (
              <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${t.type === "income" ? "bg-success/10" : "bg-destructive/10"}`}>
                  {t.type === "income" ? (
                    <ArrowUpRight className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.detail}</p>
                  <p className="text-xs text-muted-foreground">{t.categoryName} · {t.peopleName}</p>
                </div>
                <p className={`text-sm font-medium tabular-nums ${t.type === "income" ? "text-success" : "text-destructive"}`}>
                  {t.type === "income" ? "+" : "-"}₹{t.amount?.toLocaleString()}
                </p>
              </div>
            ))}
            {recent.length === 0 && (
              <p className="text-center py-10 text-xs text-muted-foreground">No recent activity</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

