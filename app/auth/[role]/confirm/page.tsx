"use client";
import AgentSignUpForm from "@/components/auth/agent-signup-form";
import ClubRepSignUpForm from "@/components/auth/club-rep-signup-form";
import PlayerSignUpForm from "@/components/auth/player-signup-form";
import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@/lib/supabase/client";
import { use, useEffect, useState } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = use(params);
  const decodedRole = decodeURIComponent(role);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
      } else if (error) {
        console.error("Error fetching user:", error);
      }
      setLoading(false);
    }

    getUser();
  }, []);

  if (loading) {
    return <Spinner className="size-large" />;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {decodedRole === "Club Rep" && <ClubRepSignUpForm userId={userId} />}
        {decodedRole === "Player" && <PlayerSignUpForm userId={userId} />}
        {decodedRole === "Agent" && <AgentSignUpForm userId={userId} />}
      </div>
    </div>
  );
}
