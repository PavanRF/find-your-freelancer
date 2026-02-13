
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Lock, Mail, Truck, UserCircle } from "lucide-react";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<"client" | "freelancer">("client");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              role: role,
            },
          },
        });
        if (error) throw error;
        toast({
          title: "Registration successful!",
          description: "Please check your email to verify your account.",
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 login-bg soft-glow">
      <div className="glass-card w-full max-w-md p-8 rounded-2xl animate-in fade-in zoom-in-95 duration-500 border border-white/10 shadow-2xl backdrop-blur-xl bg-black/40">
        <div className="flex flex-col items-center gap-2 mb-8 text-center animate-in slide-in-from-top-4 duration-700 delay-100">
          <div className="bg-primary/20 p-4 rounded-full mb-2 ring-4 ring-primary/10">
            <span className="text-4xl">🚚</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {isLogin ? "Welcome Back" : "Join Fast Truck"}
          </h1>
          <p className="text-gray-400">
            {isLogin 
              ? "Enter your credentials to access your account" 
              : "Create an account to get started"}
          </p>
        </div>

        <div className="flex gap-2 p-1.5 bg-black/40 border border-white/5 rounded-xl mb-8">
          <button
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${
              isLogin 
                ? "bg-primary text-white shadow-lg scale-[1.02]" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
            onClick={() => setIsLogin(true)}
            type="button"
          >
            Login
          </button>
          <button
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${
              !isLogin 
                ? "bg-primary text-white shadow-lg scale-[1.02]" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
            onClick={() => setIsLogin(false)}
            type="button"
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          {!isLogin && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-300 font-medium ml-1">First Name</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="firstName"
                      type="text"
                      required
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:bg-black/40 focus:ring-1 focus:ring-primary/50 h-11 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-300 font-medium ml-1">Last Name</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="lastName"
                      type="text"
                      required
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:bg-black/40 focus:ring-1 focus:ring-primary/50 h-11 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Label className="text-gray-300 font-medium ml-1">Register as</Label>
                <RadioGroup
                  defaultValue="client"
                  value={role}
                  onValueChange={(val) => setRole(val as "client" | "freelancer")}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-white/5 ${role === "client" ? "border-primary bg-primary/10" : "border-white/10"}`}>
                    <RadioGroupItem value="client" id="client" className="absolute top-3 right-3 border-white/20 text-primary data-[state=checked]:border-primary" />
                    <UserCircle className={`w-8 h-8 mb-2 ${role === "client" ? "text-primary" : "text-gray-400"}`} />
                    <Label htmlFor="client" className="text-white font-bold cursor-pointer">Client</Label>
                    <span className="text-xs text-gray-400 text-center mt-1">I want to ship</span>
                  </div>
                  
                  <div className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-white/5 ${role === "freelancer" ? "border-primary bg-primary/10" : "border-white/10"}`}>
                    <RadioGroupItem value="freelancer" id="freelancer" className="absolute top-3 right-3 border-white/20 text-primary data-[state=checked]:border-primary" />
                    <Truck className={`w-8 h-8 mb-2 ${role === "freelancer" ? "text-primary" : "text-gray-400"}`} />
                    <Label htmlFor="freelancer" className="text-white font-bold cursor-pointer">Freelancer</Label>
                    <span className="text-xs text-gray-400 text-center mt-1">I want to drive</span>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 font-medium ml-1">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:bg-black/40 focus:ring-1 focus:ring-primary/50 h-11 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-gray-300 font-medium ml-1">Password</Label>
                {isLogin && <a href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">Forgot password?</a>}
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:bg-black/40 focus:ring-1 focus:ring-primary/50 h-11 transition-all"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-white font-bold py-6 text-lg shadow-xl shadow-primary/20 transform hover:scale-[1.01] transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              isLogin ? "Sign In" : "Create Account"
            )}
          </Button>
          
          <div className="text-center text-sm text-gray-500 mt-4">
            By continuing, you agree to our <a href="#" className="underline hover:text-white transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-white transition-colors">Privacy Policy</a>.
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
