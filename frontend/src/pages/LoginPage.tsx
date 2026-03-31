import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeftRight, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"user" | "admin">("user");
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    const success = await login(email, password);
    if (success) {
      // Role validation: Selected role must match the actual user role
      const userStr = localStorage.getItem('user');
      const authUser = userStr ? JSON.parse(userStr) : null;

      if (role === "admin" && (!authUser || authUser.role !== 'admin')) {
        const audio = new Audio('/static/sound.mp3');
        audio.play().catch(e => console.error("Audio play failed", e));
        toast.error("Access denied. Admin credentials required.");
        logout();
        setLoading(false);
        return;
      }
      
      if (role === "user" && (!authUser || authUser.role !== 'user')) {
        const audio = new Audio('/static/sound.mp3');
        audio.play().catch(e => console.error("Audio play failed", e));
        toast.error("Access denied. User credentials required.");
        logout();
        setLoading(false);
        return;
      }

      const audio = new Audio('/static/sound1.mp3');
      audio.play().catch(e => console.error("Audio play failed", e));
      toast.success(role === "admin" ? "Welcome, Administrator!" : "Welcome back!");
      navigate("/dashboard");
    } else {
      const audio = new Audio('/static/sound.mp3');
      audio.play().catch(e => console.error("Audio play failed", e));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center px-12"
        >
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-8">
            <ArrowLeftRight className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground mb-4" style={{ lineHeight: "1.1" }}>
            ExpenseFlow
          </h1>
          <p className="text-primary-foreground/50 text-lg max-w-sm mx-auto">
            Streamline your business finances with clarity and control.
          </p>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-semibold">Sign in</h2>
            <p className="text-sm text-muted-foreground mt-1">Enter your credentials to continue</p>
          </div>

          <div className="mb-6">
            <Label className="block mb-3 text-sm font-medium">I am login as:</Label>
            <RadioGroup 
              value={role} 
              onValueChange={(v: "user" | "admin") => setRole(v)}
              className="flex gap-4 p-1 bg-muted/30 rounded-lg"
            >
              <div className={`flex flex-1 items-center justify-center gap-2 rounded-md transition-all cursor-pointer py-2 px-3 ${role === 'user' ? 'bg-background shadow-sm border border-border/50' : 'hover:bg-muted/50'}`} onClick={() => setRole('user')}>
                <RadioGroupItem value="user" id="user" className="sr-only" />
                <div className={`h-2 w-2 rounded-full ${role === 'user' ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                <Label htmlFor="user" className="cursor-pointer font-medium">User</Label>
              </div>
              <div className={`flex flex-1 items-center justify-center gap-2 rounded-md transition-all cursor-pointer py-2 px-3 ${role === 'admin' ? 'bg-background shadow-sm border border-border/50' : 'hover:bg-muted/50'}`} onClick={() => setRole('admin')}>
                <RadioGroupItem value="admin" id="admin" className="sr-only" />
                <div className={`h-2 w-2 rounded-full ${role === 'admin' ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                <Label htmlFor="admin" className="cursor-pointer font-medium">Admin</Label>
              </div>
            </RadioGroup>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <button 
              onClick={() => navigate("/register")}
              className="font-medium text-primary hover:underline transition-all"
            >
              Sign up
            </button>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-muted text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Demo credentials</p>
            <p>Admin: <span className="font-mono">admin@company.com</span></p>
            <p>User: <span className="font-mono">any other email</span></p>
            <p>Password: <span className="font-mono">any value</span></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
