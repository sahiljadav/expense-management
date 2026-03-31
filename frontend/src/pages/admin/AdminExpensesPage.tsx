import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Loader2, MoreVertical, Edit2, Trash2 } from "lucide-react";
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
import { toast } from "sonner";
import { adminService, expenseService, incomeService, categoryService, projectService, peopleService } from "@/services/apiServices";
import { Transaction, User } from "@/types";

export default function AdminExpensesPage() {
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
      const [txData, catData, projData, empData] = await Promise.all([
        adminService.getTransactions(),
        categoryService.getAll(),
        projectService.getAll(),
        peopleService.getAll()
      ]);
      setTransactions(txData || []);
      setCategories(catData || []);
      setProjects(projData || []);
      setEmployees(empData || []);
    } catch (error) {
      toast.error("Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      if (!formData.amount || !formData.categoryId || !formData.peopleId) {
        toast.error("Please fill all required fields (including Employee)");
        return;
      }

      const payload = {
        [formData.type === 'expense' ? 'ExpenseDate' : 'IncomeDate']: formData.date,
        Amount: formData.amount,
        CategoryID: formData.categoryId,
        SubCategoryID: formData.subCategoryId || null,
        ProjectID: formData.projectId || null,
        PeopleID: formData.peopleId,
        [formData.type === 'expense' ? 'ExpenseDetail' : 'IncomeDetail']: formData.detail,
        Description: formData.remarks
      };

      if (showEdit && selectedTransaction) {
         const numericId = selectedTransaction.id.split('-')[1];
         formData.type === "expense" ? await expenseService.update(numericId, payload) : await incomeService.update(numericId, payload);
         toast.success("Transaction updated");
      } else {
         formData.type === "expense" ? await expenseService.create(payload) : await incomeService.create(payload);
         toast.success("Entry added");
      }

      setShowAdd(false); setShowEdit(false); fetchData();
    } catch (error) { toast.error("Operation failed"); }
  };

  const handleDelete = async (t: Transaction) => {
    if (!confirm("Delete transaction?")) return;
    try {
      const numericId = t.id.split('-')[1];
      t.type === "expense" ? await expenseService.delete(numericId) : await incomeService.delete(numericId);
      toast.success("Deleted"); fetchData();
    } catch (error) { toast.error("Failed"); }
  };

  const filtered = transactions.filter((t) => {
    const match = t.detail?.toLowerCase().includes(search.toLowerCase()) || 
                  t.categoryName?.toLowerCase().includes(search.toLowerCase()) ||
                  t.peopleName?.toLowerCase().includes(search.toLowerCase());
    return match && (typeFilter === "all" || t.type === typeFilter);
  });

  return (
    <div>
      <PageHeader title="All Transactions (Admin)" description="Manage financial records for the entire organization" 
        actions={<Button onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-2" /> Add Entry</Button>} />

      <div className="flex gap-3 mb-6">
        <Input placeholder="Search everything..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        <Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="expense">Expenses</SelectItem><SelectItem value="income">Incomes</SelectItem></SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        {loading ? <div className="p-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Category</TableHead><TableHead>User</TableHead><TableHead>Project</TableHead><TableHead className="text-right">Amount</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                  <TableCell><Badge variant={t.type === "income" ? "default" : "destructive"}>{t.type}</Badge></TableCell>
                  <TableCell>{t.categoryName}</TableCell>
                  <TableCell className="font-medium">{t.peopleName}</TableCell>
                  <TableCell>{t.projectName}</TableCell>
                  <TableCell className={`text-right font-medium ${t.type === "income" ? "text-success" : "text-destructive"}`}>₹{t.amount?.toLocaleString()}</TableCell>
                  <TableCell><Button variant="ghost" size="icon" onClick={() => { /* Edit logic */ }}><MoreVertical className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={showAdd || showEdit} onOpenChange={(v) => { setShowAdd(v); if(!v) setShowEdit(false); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Admin Transaction Management</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Type</Label><Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="expense">Expense</SelectItem><SelectItem value="income">Income</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Date</Label><Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
             </div>
             <div className="space-y-2"><Label>Assign to Employee</Label>
               <Select value={formData.peopleId} onValueChange={v => setFormData({...formData, peopleId: v})}><SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
                 <SelectContent>{employees.map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>)}</SelectContent>
               </Select>
             </div>
             <div className="space-y-2"><Label>Project</Label><Select value={formData.projectId} onValueChange={v => setFormData({...formData, projectId: v})}><SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger><SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}</SelectContent></Select></div>
             <div className="space-y-2"><Label>Amount (₹)</Label><Input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} /></div>
             <div className="space-y-2"><Label>Details</Label><Input value={formData.detail} onChange={e => setFormData({...formData, detail: e.target.value})} /></div>
          </div>
          <DialogFooter><Button onClick={handleSave}>Process Entry</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
