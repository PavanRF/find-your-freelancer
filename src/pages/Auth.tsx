
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
      <div className="glass-card w-full max-w-md p-8 rounded-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <span className="text-4xl">🚚</span>
          <h1 className="text-2xl font-bold text-white">Fast Truck</h1>
        </div>

        <div className="flex gap-2 p-1 bg-white/5 rounded-xl mb-8">
          <button
            className={`flex-1 py-2.5 rounded-lg font-bold transition-all ${
              isLogin ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setIsLogin(true)}
            type="button"
          >
            Login
          </button>
          <button
            className={`flex-1 py-2.5 rounded-lg font-bold transition-all ${
              !isLogin ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setIsLogin(false)}
            type="button"
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-white/5 border-white/10 text-white focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-white/5 border-white/10 text-white focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Register as</Label>
                <RadioGroup
                  defaultValue="client"
                  value={role}
                  onValueChange={(val) => setRole(val as "client" | "freelancer")}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="client" id="client" className="border-white/20 text-primary" />
                    <Label htmlFor="client" className="text-white">Client</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="freelancer" id="freelancer" className="border-white/20 text-primary" />
                    <Label htmlFor="freelancer" className="text-white">Freelancer</Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/10 text-white focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/10 text-white focus:border-primary"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg shadow-lg shadow-primary/20"
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Create Account"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
