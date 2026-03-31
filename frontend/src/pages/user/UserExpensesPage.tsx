import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Loader2, Pencil, Trash2, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { userService, categoryService, projectService } from "@/services/apiServices";
import { Transaction } from "@/types";

const NONE = "__none__";

const emptyForm = {
  type: "expense",
  date: new Date().toISOString().split("T")[0],
  amount: "",
  categoryId: "",
  projectId: NONE,
  detail: "",
  remarks: "",
};

export default function UserExpensesPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [txData, catData, projData] = await Promise.all([
        userService.getTransactions(),
        categoryService.getAll(),
        projectService.getAll(),
      ]);
      setTransactions(txData || []);
      setCategories(catData || []);
      setProjects(projData || []);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData({ ...emptyForm });
    setShowForm(true);
  };

  const openEdit = (t: Transaction) => {
    setEditingId(t.id);
    setFormData({
      type: t.type,
      date: new Date(t.date).toISOString().split("T")[0],
      amount: String(t.amount),
      categoryId: t.categoryId ? String(t.categoryId) : "",
      projectId: t.projectId ? String(t.projectId) : NONE,
      detail: t.detail || "",
      remarks: t.remarks || "",
    });
    setShowForm(true);
  };

  const openDelete = (t: Transaction) => {
    setDeletingTransaction(t);
    setShowDeleteConfirm(true);
  };

  const handleSave = async () => {
    if (!formData.amount || !formData.categoryId) {
      toast.error("Please fill in Amount and Category");
      return;
    }
    setSaving(true);
    try {
      const isExpense = formData.type === "expense";
      const payload = {
        [isExpense ? "ExpenseDate" : "IncomeDate"]: formData.date,
        Amount: formData.amount,
        CategoryID: formData.categoryId,
        ProjectID: formData.projectId && formData.projectId !== NONE ? formData.projectId : null,
        [isExpense ? "ExpenseDetail" : "IncomeDetail"]: formData.detail,
        Description: formData.remarks,
      };

      if (editingId) {
        // Extract numeric ID (format: "e-123" or "i-123")
        const numId = editingId.replace(/^[ei]-/, "");
        if (isExpense) {
          await userService.updateExpense(numId, payload);
        } else {
          await userService.updateIncome(numId, payload);
        }
        toast.success("Transaction updated!");
      } else {
        if (isExpense) {
          await userService.createExpense(payload);
        } else {
          await userService.createIncome(payload);
        }
        toast.success("Transaction added!");
      }

      setShowForm(false);
      fetchData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTransaction) return;
    setDeleting(true);
    try {
      const numId = deletingTransaction.id.replace(/^[ei]-/, "");
      if (deletingTransaction.type === "expense") {
        await userService.deleteExpense(numId);
      } else {
        await userService.deleteIncome(numId);
      }
      toast.success("Transaction deleted");
      setShowDeleteConfirm(false);
      setDeletingTransaction(null);
      fetchData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.detail?.toLowerCase().includes(search.toLowerCase()) ||
      t.categoryName?.toLowerCase().includes(search.toLowerCase()) ||
      t.projectName?.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (typeFilter === "all" || t.type === typeFilter);
  });

  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Transactions"
        description="Track your personal expenses and income"
        actions={
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" /> Add Entry
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card border rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Expense</p>
            <p className="text-xl font-bold text-red-500">₹{totalExpense.toLocaleString()}</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border rounded-xl p-4 flex items-center gap-4">
          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${totalIncome - totalExpense >= 0 ? "bg-blue-100 dark:bg-blue-900/30" : "bg-orange-100 dark:bg-orange-900/30"}`}>
            <span className={`text-lg font-bold ${totalIncome - totalExpense >= 0 ? "text-blue-600" : "text-orange-500"}`}>₹</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className={`text-xl font-bold ${totalIncome - totalExpense >= 0 ? "text-blue-600" : "text-orange-500"}`}>
              ₹{(totalIncome - totalExpense).toLocaleString()}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="expense">Expenses</SelectItem>
            <SelectItem value="income">Incomes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transactions Table */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">
            <p className="text-lg font-medium">No transactions found</p>
            <p className="text-sm mt-1">Click "Add Entry" to record your first transaction.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-20 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filtered.map((t) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b last:border-0 hover:bg-muted/40 transition-colors"
                  >
                    <TableCell className="text-sm">{new Date(t.date).toLocaleDateString("en-IN")}</TableCell>
                    <TableCell>
                      <Badge variant={t.type === "income" ? "default" : "destructive"} className="capitalize">
                        {t.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{t.categoryName || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{t.projectName || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{t.detail || "—"}</TableCell>
                    <TableCell className={`text-right font-semibold ${t.type === "income" ? "text-green-600" : "text-red-500"}`}>
                      {t.type === "income" ? "+" : "-"}₹{t.amount?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(t)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => openDelete(t)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Transaction" : "New Entry"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update the transaction details below." : "Fill in the details to record a new transaction."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData({ ...formData, type: v })}
                  disabled={!!editingId}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Category <span className="text-destructive">*</span></Label>
                <Select value={formData.categoryId} onValueChange={(v) => setFormData({ ...formData, categoryId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.CategoryID} value={String(c.CategoryID)}>{c.CategoryName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Project</Label>
                <Select value={formData.projectId} onValueChange={(v) => setFormData({ ...formData, projectId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>— None —</SelectItem>
                    {projects.map((p) => (
                      <SelectItem key={p.ProjectID || p.id} value={String(p.ProjectID || p.id)}>{p.ProjectName || p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Amount (₹) <span className="text-destructive">*</span></Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Details</Label>
              <Input
                placeholder="Brief description..."
                value={formData.detail}
                onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Remarks</Label>
              <Input
                placeholder="Optional notes..."
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setShowForm(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : editingId ? "Update Transaction" : "Add Transaction"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" /> Delete Transaction
            </DialogTitle>
            <DialogDescription>
              This will permanently delete this {deletingTransaction?.type} entry of{" "}
              <strong>₹{deletingTransaction?.amount?.toLocaleString()}</strong>. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Deleting...</> : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
