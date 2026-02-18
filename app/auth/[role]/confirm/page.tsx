"use client";
import AgentSignUpForm from "@/components/auth/agent-signup-form";
import ClubRepSignUpForm from "@/components/auth/club-rep-signup-form";
import PlayerSignUpForm from "@/components/auth/player-signup-form";
import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@/lib/supabase/client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Page({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = use(params);
  const decodedRole = decodeURIComponent(role);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    // Backwards compatibility: old emails may redirect here directly.
    // Forward through /auth/confirm so Supabase can set the auth cookies.
    if (code || (token_hash && type)) {
      const next = encodeURIComponent(window.location.pathname);

      const params = new URLSearchParams();
      if (code) params.set("code", code);
      if (token_hash) params.set("token_hash", token_hash);
      if (type) params.set("type", type);
      params.set("next", next);

      window.location.href = `/auth/confirm?${params.toString()}`;
      return;
    }

    async function getUser() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (data.user) {
        setUserId(data.user.id);
      } else if (error) {
        console.error("Error fetching user:", error);
      }
      setLoading(false);
    }

    getUser();
  }, [searchParams]);

  if (loading) {
    return <Spinner className="size-large" />;
  }

  if (!userId) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md text-center space-y-3">
          <h1 className="text-xl font-semibold">Almost there</h1>
          <p className="text-sm text-muted-foreground">
            Your confirmation link was opened, but there is no active session in
            this browser. Please log in to continue.
          </p>
          <Link
            href="/auth/login"
            className="inline-block underline underline-offset-4"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
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
