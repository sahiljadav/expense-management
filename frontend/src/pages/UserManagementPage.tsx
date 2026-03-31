import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, UserPlus, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { peopleService } from "@/services/apiServices";

export default function UserManagementPage() {
  const [showInvite, setShowInvite] = useState(false);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    mobile: "",
    password: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await peopleService.getAll();
      setPeople(data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInvite = async () => {
    try {
      if (!newUser.name || !newUser.email || !newUser.password) {
        toast.error("Please fill required fields");
        return;
      }
      await peopleService.create({
        PeopleName: newUser.name,
        EmailAddress: newUser.email, // Backend User model uses EmailAddress
        Password: newUser.password,
        MobileNo: newUser.mobile,
      });
      toast.success("User invited successfully!");
      setShowInvite(false);
      fetchData();
      setNewUser({ name: "", email: "", mobile: "", password: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to invite user");
    }
  };

  const handleUpdate = async () => {
    try {
      if (!editUser.name || !editUser.email) {
        toast.error("Name and Email are required");
        return;
      }
      await peopleService.update(editUser.id, {
        PeopleName: editUser.name,
        Email: editUser.email,
        MobileNo: editUser.mobile,
        IsActive: editUser.isActive
      });
      toast.success("User updated!");
      setEditUser(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await peopleService.delete(id);
      toast.success("User removed");
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Manage your team members"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-card rounded-xl border shadow-sm overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {people.map((u) => (
                <TableRow key={u.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                        {u.name.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <span className="font-medium text-sm">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{u.email}</TableCell>
                  <TableCell className="text-sm tabular-nums">{u.mobile}</TableCell>
                  <TableCell>
                    <Badge variant={u.isActive ? "outline" : "destructive"} className="text-xs">
                      {u.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm tabular-nums">{new Date(u.created).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditUser(u)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(u.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {people.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </motion.div>

      {/* Invite User Modal */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="Enter full name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="user@company.com" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Mobile Number</Label>
              <Input type="tel" placeholder="+91 9876543210" value={newUser.mobile} onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Initial Password</Label>
              <Input type="password" placeholder="Set a temporary password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvite(false)}>Cancel</Button>
            <Button onClick={handleInvite}>Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Mobile</Label>
                <Input value={editUser.mobile} onChange={(e) => setEditUser({ ...editUser, mobile: e.target.value })} />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editUser.isActive}
                  onChange={(e) => setEditUser({ ...editUser, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="editIsActive" className="text-sm font-normal">Is Active</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

