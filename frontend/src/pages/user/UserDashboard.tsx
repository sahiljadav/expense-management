import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IndianRupee, Clock, TrendingUp, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { userService } from "@/services/apiServices";
import { Transaction } from "@/types";
import { toast } from "sonner";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalExpenses: 0, totalIncomes: 0, balance: 0 });
  const [recent, setRecent] = useState<Transaction[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryData, transactions] = await Promise.all([
        userService.getSummary(),
        userService.getTransactions()
      ]);
      setSummary(summaryData);
      setRecent(transactions.slice(0, 5));
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        title={`Hello, ${user?.name.split(" ")[0]}`}
        description="Here is your personal financial summary"
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
      >
        <StatCard
          title="My Expenses"
          value={`₹${summary.totalExpenses.toLocaleString()}`}
          icon={IndianRupee}
          trend={{ value: "Personal", positive: false }}
        />
        <StatCard
          title="Current Balance"
          value={`₹${summary.balance.toLocaleString()}`}
          icon={TrendingUp}
          color={summary.balance >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}
        />
        <StatCard
          title="My Income"
          value={`₹${summary.totalIncomes.toLocaleString()}`}
          icon={ArrowUpRight}
          color="bg-success/10 text-success"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-3 bg-card rounded-xl border p-5 shadow-sm"
        >
          <h3 className="text-sm font-medium mb-4">My Spending vs Income</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))" }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, undefined]}
                />
                <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expenses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} opacity={0.7} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 16 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.4 }}
           className="lg:col-span-2 bg-card rounded-xl border p-5 shadow-sm"
        >
          <h3 className="text-sm font-medium mb-4">My Recent Activity</h3>
          <div className="space-y-3">
            {recent.map((t) => (
              <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${t.type === "income" ? "bg-success/10" : "bg-destructive/10"}`}>
                  {t.type === "income" ? <ArrowUpRight className="h-4 w-4 text-success" /> : <ArrowDownRight className="h-4 w-4 text-destructive" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.detail}</p>
                  <p className="text-xs text-muted-foreground">{t.categoryName}</p>
                </div>
                <p className={`text-sm font-medium tabular-nums ${t.type === "income" ? "text-success" : "text-destructive"}`}>
                  ₹{t.amount?.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
