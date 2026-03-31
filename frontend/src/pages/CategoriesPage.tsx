import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, ChevronDown, ChevronRight, Loader2, Edit2, Trash2, MoreVertical } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { categoryService, subCategoryService } from "@/services/apiServices";
import { useAuth } from "@/context/AuthContext";

export default function CategoriesPage() {
  const { isAdmin } = useAuth();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSub, setSelectedSub] = useState<any>(null);

  const [catForm, setCatForm] = useState({
    name: "",
    isExpense: true,
    isIncome: false,
    description: ""
  });

  const [subForm, setSubForm] = useState({
    name: "",
    isExpense: true,
    isIncome: false,
    description: "",
    categoryId: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggle = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  // Category Actions
  const handleSaveCategory = async () => {
    try {
      if (!catForm.name) return toast.error("Name is required");
      const payload = {
        CategoryName: catForm.name,
        IsExpense: catForm.isExpense,
        IsIncome: catForm.isIncome,
        Description: catForm.description
      };

      if (editMode && selectedCategory) {
        await categoryService.update(selectedCategory.CategoryID, payload);
        toast.success("Category updated");
      } else {
        await categoryService.create(payload);
        toast.success("Category created");
      }
      setShowCategoryModal(false);
      fetchData();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Delete this category? Subcategories will also be affected.")) return;
    try {
      await categoryService.delete(id);
      toast.success("Category deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const openEditCategory = (cat: any) => {
    setSelectedCategory(cat);
    setCatForm({
      name: cat.name,
      isExpense: cat.IsExpense,
      isIncome: cat.IsIncome,
      description: cat.Description || ""
    });
    setEditMode(true);
    setShowCategoryModal(true);
  };

  // SubCategory Actions
  const handleSaveSub = async () => {
    try {
      if (!subForm.name) return toast.error("Name is required");
      const payload = {
        SubCategoryName: subForm.name,
        IsExpense: subForm.isExpense,
        IsIncome: subForm.isIncome,
        Description: subForm.description,
        CategoryID: subForm.categoryId
      };

      if (editMode && selectedSub) {
        await subCategoryService.update(selectedSub.SubCategoryID, payload);
        toast.success("Subcategory updated");
      } else {
        await subCategoryService.create(payload);
        toast.success("Subcategory created");
      }
      setShowSubModal(false);
      fetchData();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleDeleteSub = async (id: number) => {
    if (!confirm("Delete this subcategory?")) return;
    try {
      await subCategoryService.delete(id);
      toast.success("Subcategory deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const openAddSub = (cat: any) => {
    setSelectedCategory(cat);
    setSubForm({
      name: "",
      isExpense: cat.IsExpense,
      isIncome: cat.IsIncome,
      description: "",
      categoryId: cat.id.toString()
    });
    setEditMode(false);
    setShowSubModal(true);
  };

  const openEditSub = (sub: any, cat: any) => {
    setSelectedSub(sub);
    setSubForm({
      name: sub.name,
      isExpense: sub.IsExpense,
      isIncome: sub.IsIncome,
      description: sub.Description || "",
      categoryId: cat.id.toString()
    });
    setEditMode(true);
    setShowSubModal(true);
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Manage expense and income categories"
        actions={isAdmin && (
          <Button onClick={() => {
            setCatForm({ name: "", isExpense: true, isIncome: false, description: "" });
            setEditMode(false);
            setShowCategoryModal(true);
          }}>
            <Plus className="h-4 w-4 mr-2" /> Add Category
          </Button>
        )}
      />

      {loading ? (
        <div className="flex items-center justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-card rounded-xl border shadow-sm overflow-hidden"
            >
              <div className="flex items-center">
                <button
                  onClick={() => toggle(cat.id)}
                  className="flex-1 flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {expanded[cat.id] ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    <span className="font-medium text-sm">{cat.name}</span>
                    <div className="flex gap-1.5">
                      {cat.IsExpense && <Badge variant="destructive" className="text-[10px] h-5">Expense</Badge>}
                      {cat.IsIncome && <Badge className="text-[10px] h-5">Income</Badge>}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{cat.subcategories?.length || 0} subcategories</span>
                </button>
                {isAdmin && (
                  <div className="px-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditCategory(cat)}><Edit2 className="h-3 w-3 mr-2" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteCategory(cat.id)}><Trash2 className="h-3 w-3 mr-2" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>

              {expanded[cat.id] && (
                <div className="border-t px-4 pb-3 pt-2 bg-muted/5">
                  <div className="space-y-1">
                    {cat.subcategories?.filter((s:any) => s.IsActive !== false).map((sub: any) => (
                      <div key={sub.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/30 group">
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{sub.name}</span>
                          <div className="flex gap-1.5">
                            {sub.IsExpense && <Badge variant="outline" className="text-[10px]">Exp</Badge>}
                            {sub.IsIncome && <Badge variant="outline" className="text-[10px]">Inc</Badge>}
                          </div>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditSub(sub, cat)}><Edit2 className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteSub(sub.id)}><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        )}
                      </div>
                    ))}
                    {(!cat.subcategories || cat.subcategories.length === 0) && (
                      <p className="text-xs text-muted-foreground p-2">No subcategories</p>
                    )}
                  </div>
                  {isAdmin && (
                    <Button variant="ghost" size="sm" className="mt-2 text-xs text-primary" onClick={() => openAddSub(cat)}>
                      <Plus className="h-3 w-3 mr-1" /> Add Subcategory
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editMode ? "Edit Category" : "Add New Category"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Category Name</Label>
              <Input placeholder="e.g., Marketing" value={catForm.name} onChange={(e) => setCatForm({...catForm, name: e.target.value})} />
            </div>
            <div className="flex gap-6 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="catExp" checked={catForm.isExpense} onCheckedChange={(v) => setCatForm({...catForm, isExpense: !!v})} />
                <Label htmlFor="catExp">Expense</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="catInc" checked={catForm.isIncome} onCheckedChange={(v) => setCatForm({...catForm, isIncome: !!v})} />
                <Label htmlFor="catInc">Income</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input placeholder="..." value={catForm.description} onChange={(e) => setCatForm({...catForm, description: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCategoryModal(false)}>Cancel</Button>
            <Button onClick={handleSaveCategory}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SubCategory Modal */}
      <Dialog open={showSubModal} onOpenChange={setShowSubModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editMode ? "Edit Subcategory" : "Add Subcategory"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Subcategory Name</Label>
              <Input placeholder="e.g., Social Media" value={subForm.name} onChange={(e) => setSubForm({...subForm, name: e.target.value})} />
            </div>
            <div className="flex gap-6 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="subExp" checked={subForm.isExpense} onCheckedChange={(v) => setSubForm({...subForm, isExpense: !!v})} />
                <Label htmlFor="subExp">Expense</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="subInc" checked={subForm.isIncome} onCheckedChange={(v) => setSubForm({...subForm, isIncome: !!v})} />
                <Label htmlFor="subInc">Income</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input placeholder="..." value={subForm.description} onChange={(e) => setSubForm({...subForm, description: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubModal(false)}>Cancel</Button>
            <Button onClick={handleSaveSub}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
