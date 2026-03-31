import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar, IndianRupee, Loader2, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { projectService } from "@/services/apiServices";
import { useAuth } from "@/context/AuthContext";

export default function ProjectsPage() {
  const { isAdmin } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    detail: "",
    startDate: "",
    endDate: "",
    budget: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAll();
      setProjects(data);
    } catch (error) {
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      if (!formData.name.trim()) return toast.error("Project Name is required");
      
      // Pre-flight validation
      if (formData.startDate && formData.endDate) {
        if (new Date(formData.startDate) > new Date(formData.endDate)) {
          return toast.error("End date cannot be before start date");
        }
      }

      const payload = {
        ProjectName: formData.name.trim(),
        ProjectDetail: formData.detail.trim(),
        ProjectStartDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        ProjectEndDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        Budget: formData.budget ? parseFloat(formData.budget) : 0
      };

      console.log("Saving Project with payload:", payload);

      if (editMode && selectedProject) {
        // Use ProjectID (number) or id (string)
        const projectId = selectedProject.ProjectID || selectedProject.id;
        if (!projectId) throw new Error("Missing Project ID");
        
        await projectService.update(projectId, payload);
        toast.success("Project updated successfully");
      } else {
        await projectService.create(payload);
        toast.success("Project created successfully");
      }
      
      setShowModal(false);
      fetchData();
    } catch (error: any) {
      console.error("Project Save Error Details:", error);
      const msg = error.response?.data?.message || error.message || "Operation failed";
      toast.error(msg);
    }
  };

  const handleDelete = async (id: any) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      await projectService.delete(id);
      toast.success("Project deleted successfully");
      fetchData();
    } catch (error: any) {
      console.error("Project Delete Error:", error);
      toast.error(error.response?.data?.message || "Failed to delete project");
    }
  };

  const openEdit = (p: any) => {
    setSelectedProject(p);
    setFormData({
      name: p.ProjectName || p.name || "",
      detail: p.ProjectDetail || p.Description || "",
      startDate: p.ProjectStartDate ? new Date(p.ProjectStartDate).toISOString().split("T")[0] : "",
      endDate: p.ProjectEndDate ? new Date(p.ProjectEndDate).toISOString().split("T")[0] : "",
      budget: (p.Budget !== undefined && p.Budget !== null) ? p.Budget.toString() : ""
    });
    setEditMode(true);
    setShowModal(true);
  };

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage and track project budgets"
      />

      {loading ? (
        <div className="flex items-center justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => {
            const budget = parseFloat(p.Budget) || 0;
            const spent = p.spent || 0;
            const pct = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;
            
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-card rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow relative"
              >
                {isAdmin && (
                  <div className="absolute top-4 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(p)}><Edit2 className="h-3 w-3 mr-2" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-3 w-3 mr-2" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
                <div className="flex items-start justify-between mb-3 pr-8">
                  <h3 className="font-medium text-sm">{p.name}</h3>
                  <span className={`text-xs font-medium tabular-nums ${pct > 85 ? "text-destructive" : "text-success"}`}>{pct}%</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2 h-8">{p.ProjectDetail}</p>
                <Progress value={pct} className="h-1.5 mb-3" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium text-foreground"><IndianRupee className="h-3 w-3" /> ₹{spent.toLocaleString()}</span>
                  <span>of ₹{budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 mt-3 pt-3 border-t text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  <Calendar className="h-3 w-3" />
                  <span>{p.ProjectStartDate ? new Date(p.ProjectStartDate).toLocaleDateString() : 'N/A'} — {p.ProjectEndDate ? new Date(p.ProjectEndDate).toLocaleDateString() : 'N/A'}</span>
                </div>
              </motion.div>
            );
          })}

          {isAdmin && (
            <button
              onClick={() => {
                setFormData({ name: "", detail: "", startDate: "", endDate: "", budget: "" });
                setEditMode(false);
                setShowModal(true);
              }}
              className="rounded-xl border-2 border-dashed p-5 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors min-h-[160px]"
            >
              <Plus className="h-8 w-8" />
              <span className="text-sm font-medium">Create New Project</span>
            </button>
          )}
        </div>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editMode ? "Edit Project" : "Create New Project"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Project Name</Label>
              <Input placeholder="Enter project name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Project details..." rows={2} value={formData.detail} onChange={(e) => setFormData({...formData, detail: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Budget (₹)</Label>
              <Input type="number" placeholder="0" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editMode ? "Save Changes" : "Create Project"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
