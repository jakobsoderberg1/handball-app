"use client";

import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@/lib/supabase/client";
import type { EmailOtpType } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function safeNextPath(nextParam: string | null) {
  if (!nextParam) return "/";
  return nextParam.startsWith("/") ? nextParam : "/";
}

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  const [status, setStatus] = useState<"working" | "error" | "needs-login">(
    "working",
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const next = safeNextPath(searchParams.get("next"));
      const code = searchParams.get("code");
      const token_hash = searchParams.get("token_hash");
      const type = searchParams.get("type") as EmailOtpType | null;

      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            // Most common case when the user opened the email on a different device/browser.
            if (
              /PKCE code verifier not found/i.test(error.message) ||
              /code verifier/i.test(error.message)
            ) {
              setStatus("needs-login");
              setMessage(
                "Email confirmed, but we couldn’t sign you in on this device. Please log in to continue.",
              );
              return;
            }

            setStatus("error");
            setMessage(error.message);
            return;
          }

          router.replace(next);
          router.refresh();
          return;
        }

        if (token_hash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type,
          });

          if (error) {
            setStatus("error");
            setMessage(error.message);
            return;
          }

          router.replace(next);
          router.refresh();
          return;
        }

        setStatus("error");
        setMessage("Missing confirmation parameters.");
      } catch (e: unknown) {
        setStatus("error");
        setMessage(e instanceof Error ? e.message : "Unknown error");
      }
    };

    run();
  }, [router, searchParams, supabase]);

  if (status === "working") {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <Spinner className="size-large" />
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md text-center space-y-3">
        <h1 className="text-xl font-semibold">
          {status === "needs-login" ? "Almost there" : "Confirmation error"}
        </h1>
        <p className="text-sm text-muted-foreground">{message}</p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/auth/login"
            className="inline-block underline underline-offset-4"
          >
            Go to login
          </Link>
          <Link href="/" className="inline-block underline underline-offset-4">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
