"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function NavBar() {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string>("guest");
  const supabase = createClient();
  const handleLogout = () => async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };
  useEffect(() => {
    const run = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const id = user?.id ?? null;
      setUserId(id);

      if (!id) {
        setRole("guest");
        return;
      }

      const { data } = await supabase
        .from("user_info")
        .select("role")
        .eq("user_id", id)
        .single();

      setRole(data?.role ?? "guest");
    };

    run();
  }, [supabase]);

  return (
    <div className="w-full flex h-20 items-center justify-between border-b px-8 mt-2">
      <Link href="/" className="ml-20 flex items-center">
        <h1 className="text-2xl font-bold dark:text-gray-300">handballIn</h1>
      </Link>

      <div className="mr-4 px-2">
        <NavigationMenu>
          <NavigationMenuList>
            {/* Profile/Login */}
            <NavigationMenuItem>
              {userId ? (
                <>
                  <NavigationMenuTrigger className="hidden md:block">
                    Profile
                  </NavigationMenuTrigger>

                  <NavigationMenuContent>
                    <ul className="flex flex-col w-[240px] gap-3 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/protected/${role}/${userId}`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            <p className="text-md">Dashboard</p>
                            <p className="text-muted-foreground text-sm">
                              View and manage your profile
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>

                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            onClick={handleLogout()}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <p className="text-md">Logout</p>
                            <p className="text-muted-foreground text-sm">
                              Sign out of your account
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink asChild>
                  <Link href="/auth/login">Login</Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Explore */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="hidden md:block">
                Explore
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex flex-col w-[240px] gap-3 p-4">
                  {[
                    {
                      href: "/players",
                      title: "Players",
                      desc: "Find players and compare profiles",
                    },
                    {
                      href: "/clubs",
                      title: "Clubs",
                      desc: "Explore rosters and club profiles",
                    },
                    {
                      href: "/agents",
                      title: "Agents",
                      desc: "Connect with agents and grow your network",
                    },
                  ].map((item) => (
                    <li key={item.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <p className="text-md">{item.title}</p>
                          <p className="text-muted-foreground text-sm">
                            {item.desc}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/about">About</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/contact">Contact</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>

          <NavigationMenuIndicator />
        </NavigationMenu>
      </div>
    </div>
  );
}
