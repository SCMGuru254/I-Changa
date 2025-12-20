
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address (e.g., user@example.com)",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (isSignUp) {
        // Validate full name for sign up
        if (!formData.fullName.trim()) {
          toast({
            title: "Invalid Name",
            description: "Please enter your full name",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName.trim(),
            },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) throw error;
        toast({
          title: "Success!",
          description: "Account created successfully! You can now sign in.",
        });
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
        });

        if (error) throw error;
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
  };

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex w-full relative overflow-hidden">
      {/* Background Image - Visible as split on Desktop, Full background on Mobile */}
      <div className="absolute inset-0 lg:static lg:w-1/2 bg-black">
        <div className="absolute inset-0">
          <img
            src="/login-bg.png"
            alt="Community Trust"
            className="w-full h-full object-cover opacity-60 lg:opacity-80 transition-opacity"
          />
          {/* Mobile Overlay: Heavy Blur & Darken */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm lg:backdrop-blur-none lg:bg-gradient-to-t lg:from-black/80 lg:via-black/40 lg:to-transparent" />
        </div>

        {/* Desktop Text Layout */}
        <div className="relative z-10 w-full h-full hidden lg:flex flex-col justify-end p-12 text-white">
          <h2 className="text-4xl font-bold mb-2">Tuko Pamoja | iChanga</h2>
          <p className="text-lg text-gray-200">
            Empowering communities to grow together. Build trust, track savings, and secure your future.
          </p>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-20"
      >
        <Card className="w-full max-w-md p-8 border-none shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md lg:bg-transparent lg:shadow-none">
          <div className="text-center mb-8">
            <div className="mx-auto mb-6 w-24 h-24 rounded-full overflow-hidden shadow-xl border-4 border-primary/20 bg-white">
              <img
                src="/app-icon.jpg"
                alt="iChanga Logo"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Mobile-visible Slogan */}
            <h2 className="lg:hidden text-xl font-bold text-primary mb-2">Tuko Pamoja | iChanga</h2>

            <h1 className="text-3xl font-bold tracking-tight">
              {isSignUp ? "Join the Circle" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isSignUp ? "Start your journey to financial freedom" : "Sign in to access your groups"}
            </p>
          </div>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full h-11 bg-white/90 hover:bg-white dark:bg-black/90 dark:hover:bg-black border-transparent"
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Continue with Google
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/90 dark:bg-black/90 px-3 py-1 text-gray-900 dark:text-gray-100 font-semibold rounded-full shadow-sm border">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Input
                    className="h-11 bg-white/90 dark:bg-black/90 border-transparent focus:border-primary"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    required
                  />
                </motion.div>
              )}
              <Input
                className="h-11 bg-white/90 dark:bg-black/90 border-transparent focus:border-primary"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                className="h-11 bg-white/90 dark:bg-black/90 border-transparent focus:border-primary"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
              <Button className="w-full h-11 text-base shadow-lg" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isSignUp ? "Creating Account..." : "Signing In..."}
                  </>
                ) : (
                  isSignUp ? "Create Admin Account" : "Sign In"
                )}
              </Button>
            </form>

            <p className="text-center mt-8 text-sm">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline transition-colors font-medium"
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "New here? Create an account"}
              </button>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
