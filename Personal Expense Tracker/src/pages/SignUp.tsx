import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First check if username is unique
      const { data: existingUser } = await supabase
        .from("profiles")
        .select()
        .eq("username", username)
        .single();

      if (existingUser) {
        throw new Error("Username already taken");
      }

      // Create auth user
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        data: { username }, // Changed from options.data to data directly
      });

      if (signUpError) throw signUpError;

      // Create profile record
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: data.user?.id,
            username,
            email,
          },
        ]);

      if (profileError) throw profileError;

      toast({
        title: "Success",
        description: "Account created successfully! Please sign in.",
      });
      navigate("/signin");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-premium p-4 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-md bg-secondary">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
            <p className="text-center text-sm">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 text-primary"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </Button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;