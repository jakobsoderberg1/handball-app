import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export default function AgentSignUpForm({ userId }: { userId: string | null }) {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const handleRegisterAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: agentData, error: agentError } = await supabase
        .from("agents")
        .insert({
          user_id: userId,
        })
        .select()
        .single();
      if (agentError) throw agentError;
      if (agentData) {
        // Agent registered successfully
        // You can redirect or show a success message here
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-screen">
      <Card className="w-full min-w-[32rem]">
        <CardTitle className="text-2xl text-center mt-6">
          Register as Agent
        </CardTitle>
        <CardDescription className="text-center mb-6">
          Input your information to register as an agent.
        </CardDescription>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleRegisterAgent}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="font-medium">
                Full Name
              </Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
