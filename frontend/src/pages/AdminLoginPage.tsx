import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldAlert, Eye, EyeOff, Lock, Mail, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    
    // Using the same login logic but could be restricted by checking role afterwards
    const success = await login(email, password);
    
    if (success) {
      // Check if user is actually an admin
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (user && user.role === 'admin') {
        const audio = new Audio('/static/sound1.mp3');
        audio.play().catch(e => console.error("Audio play failed", e));
        toast.success("Welcome, Administrator!");
        navigate("/dashboard");
      } else {
        // Not an admin, playing failure sound and logging out
        const audio = new Audio('/static/sound.mp3');
        audio.play().catch(e => console.error("Audio play failed", e));
        toast.error("Access denied. Admin credentials required.");
        // Logout if they are logged in as a regular user
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      const audio = new Audio('/static/sound.mp3');
      audio.play().catch(e => console.error("Audio play failed", e));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative z-10"
      >
        <button 
          onClick={() => navigate("/login")}
          className="absolute left-8 top-8 text-zinc-500 hover:text-zinc-200 transition-colors flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mt-12 mb-8 text-center">
          <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h2>
          <p className="text-zinc-400 text-sm mt-2">Secure access for system administrators</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">Admin Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="email"
                type="email"
                placeholder="admin@expenseflow.com"
                className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-600 pl-10 h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" title="password" className="text-zinc-300">Security Key</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="password"
                title="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-600 pl-10 h-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-4 shadow-lg shadow-primary/20" disabled={loading}>
            {loading ? "Verifying..." : "Authorize Access"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="text-xs text-zinc-500 max-w-[240px] mx-auto">
            Authorized personnel only. All access attempts are monitored and recorded.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
