"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavBar } from "@/components/ui/nav-bar";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [latestPlayers, setLatestPlayers] = useState<Array<any>>([]);
  const router = useRouter();
  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.log("Error fetching user:", error.message);
      return;
    }
    if (data?.user) {
      const { data: userInfo } = await supabase
        .from("user_info")
        .select("role, name")
        .eq("user_id", data.user.id)
        .single();
      setRole(userInfo?.role || "guest");
      setName(userInfo?.name || "User");
    }
    setUserId(data?.user.id || null);
  };

  const fetchLatestPlayers = async () => {
    const { data, error } = await supabase
      .from("players")
      .select("user_info(name), player_club(clubs(name)), user_id")
      .order("created_at", { ascending: false })
      .limit(5);
    if (error) {
      console.log("Error fetching latest players:", error.message);
      return;
    }
    console.log("Latest players fetched:", data);
    setLatestPlayers(data || []);
  };

  useEffect(() => {
    fetchUser();
    fetchLatestPlayers();
  }, []);

  return (
    <section className="py-12">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="rounded-3xl min-h-fit border bg-gradient-to-b from-muted/40 to-background p-6 sm:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
              Welcome to handballIn
            </h1>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground">
              Your gateway to professional handball recruiting.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userId ? (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-semibold tracking-tight">
                    Hello, {name}!
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-8">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Great to see you back! Explore the latest players to see if
                    any of your teammates have joined, if not, make sure to tell
                    them!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-semibold tracking-tight">
                    Get Started with handballIn
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-8">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Please log in or sign up to access the full features of
                    handballIn.
                  </p>
                  <div className="flex items-center justify-center mx-auto mt-8">
                    <Button onClick={() => router.push("/auth/login")}>
                      Login
                    </Button>
                    <Button
                      onClick={() => router.push("/auth/sign-up")}
                      className="ml-4 bg-sky-700 hover:bg-sky-800 text-white"
                    >
                      Sign Up
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  New Player Profiles
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-8">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Discover the latest players who have joined handballIn. Check
                  out their profiles and see if any of your teammates are here!
                </p>
                {latestPlayers.map((player, index) => (
                  <div
                    key={index}
                    className="border rounded-md p-4 mt-2 border-gray-200 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => router.push(`/players/${player.user_id}`)}
                  >
                    <p className="text-md font-medium">
                      {player.user_info.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Club: {player.player_club?.[0]?.clubs?.name || "N/A"}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
