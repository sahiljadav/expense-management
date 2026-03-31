import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Download, ArrowUpRight, ArrowDownRight, Loader2, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { expenseService, incomeService, categoryService, projectService, peopleService } from "@/services/apiServices";
import { Transaction, User } from "@/types";

export default function ExpensesPage() {
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    type: "expense",
    date: new Date().toISOString().split("T")[0],
    amount: "",
    categoryId: "",
    subCategoryId: "",
    projectId: "",
    peopleId: "",
    detail: "",
    remarks: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [txData, catData, projData] = await Promise.all([
        expenseService.getAllTransactions(),
        categoryService.getAll(),
        projectService.getAll()
      ]);
      setTransactions(txData || []);
      setCategories(catData || []);
      setProjects(projData || []);

      if (isAdmin) {
        const empData = await peopleService.getAll();
        setEmployees(empData || []);
      }
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      if (!formData.amount || !formData.categoryId) {
        toast.error("Please fill all required fields");
        return;
      }

      const payload = {
        [formData.type === 'expense' ? 'ExpenseDate' : 'IncomeDate']: formData.date,
        Amount: formData.amount,
        CategoryID: formData.categoryId,
        SubCategoryID: formData.subCategoryId || null,
        ProjectID: formData.projectId || null,
        PeopleID: formData.peopleId || null,
        [formData.type === 'expense' ? 'ExpenseDetail' : 'IncomeDetail']: formData.detail,
        Description: formData.remarks
      };

      if (showEdit && selectedTransaction) {
        const numericId = selectedTransaction.id.split('-')[1];
        if (formData.type === "expense") {
          await expenseService.update(numericId, payload);
          toast.success("Expense updated");
        } else {
          await incomeService.update(numericId, payload);
          toast.success("Income updated");
        }
      } else {
        if (formData.type === "expense") {
          await expenseService.create(payload);
        } else {
          await incomeService.create(payload);
        }
        toast.success("Entry added successfully!");
      }

      setShowAdd(false);
      setShowEdit(false);
      fetchData();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (t: Transaction) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      const numericId = t.id.split('-')[1];
      if (t.type === "expense") {
        await expenseService.delete(numericId);
      } else {
        await incomeService.delete(numericId);
      }
      toast.success("Transaction deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const openEdit = (t: Transaction) => {
    setSelectedTransaction(t);
    setFormData({
      type: t.type,
      date: new Date(t.date).toISOString().split("T")[0],
      amount: t.amount.toString(),
      categoryId: t.categoryId?.toString() || "",
      subCategoryId: t.subCategoryId?.toString() || "",
      projectId: t.projectId?.toString() || "",
      peopleId: t.peopleId?.toString() || "",
      detail: t.detail || "",
      remarks: t.remarks || ""
    });
    setShowEdit(true);
  };

  const filtered = transactions.filter((t) => {
    const matchSearch = t.detail?.toLowerCase().includes(search.toLowerCase()) ||
      t.categoryName?.toLowerCase().includes(search.toLowerCase()) ||
      t.peopleName?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || t.type === typeFilter;
    return matchSearch && matchType;
  });

  const selectedCategory = categories.find(c => c.id.toString() === formData.categoryId);
  const availableSubCategories = selectedCategory?.SubCategories || [];

  return (
    <div>
      <PageHeader
        title="Expenses & Incomes"
        description="Track all financial transactions"
        actions={
          <Button onClick={() => {
            setFormData({
              type: "expense",
              date: new Date().toISOString().split("T")[0],
              amount: "",
              categoryId: "",
              subCategoryId: "",
              projectId: "",
              peopleId: "",
              detail: "",
              remarks: ""
            });
            setShowAdd(true);
          }}>
            <Plus className="h-4 w-4 mr-2" /> Add New Entry
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="expense">Expenses</SelectItem>
            <SelectItem value="income">Incomes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Project</TableHead>
                {isAdmin && <TableHead>Employee</TableHead>}
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="text-sm tabular-nums">{new Date(t.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={t.type === "income" ? "default" : "destructive"}>{t.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{t.categoryName}</span>
                      {t.subCategoryName && <span className="text-[10px] text-muted-foreground">{t.subCategoryName}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{t.projectName}</TableCell>
                  {isAdmin && <TableCell className="text-sm">{t.peopleName}</TableCell>}
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{t.detail}</TableCell>
                  <TableCell className={`text-right text-sm font-medium tabular-nums ${t.type === "income" ? "text-success" : "text-destructive"}`}>
                    ₹{t.amount?.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(t)}><Edit2 className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(t)}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={showAdd || showEdit} onOpenChange={(v) => { setShowAdd(v); if (!v) setShowEdit(false); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{showEdit ? "Edit Entry" : "Add New Entry"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              </div>
            </div>
            {isAdmin && (
              <div className="space-y-2">
                <Label>Employee</Label>
                <Select value={formData.peopleId} onValueChange={(v) => setFormData({...formData, peopleId: v})}>
                  <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                  <SelectContent>
                    {employees.map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Project</Label>
              <Select value={formData.projectId} onValueChange={(v) => setFormData({...formData, projectId: v})}>
                <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                <SelectContent>
                  {projects.map((p) => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.categoryId} onValueChange={(v) => setFormData({...formData, categoryId: v, subCategoryId: ""})}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => formData.type === 'expense' ? c.IsExpense : c.IsIncome).map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subcategory</Label>
                <Select value={formData.subCategoryId} onValueChange={(v) => setFormData({...formData, subCategoryId: v})}>
                  <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                  <SelectContent>
                    {availableSubCategories.map((s: any) => (
                      <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input type="number" placeholder="0.00" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Details</Label>
              <Input placeholder="What was this for?" value={formData.detail} onChange={(e) => setFormData({...formData, detail: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Remarks</Label>
              <Textarea placeholder="Add any notes..." rows={2} value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAdd(false); setShowEdit(false); }}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
