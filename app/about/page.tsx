"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Search, Users } from "lucide-react";

const items = [
  {
    title: "The Problem",
    icon: MessageCircle,
    kicker: "Why it exists",
    text: `Handball recruiting still happens in DMs, spreadsheets, and word-of-mouth. 
    Players miss opportunities, agents struggle to present talent professionally, 
    and clubs waste time searching without reliable filters or verified info.`,
  },
  {
    title: "The Solution",
    icon: Search,
    kicker: "What we built",
    text: `handballIn is a professional platform where players, agents, and clubs create profiles, 
    showcase credibility, and connect with intent. Clubs can search by position, level, location, 
    contract status, and more — faster, clearer, and more trustworthy than social media.`,
  },
  {
    title: "The Vision",
    icon: Users,
    kicker: "Where it’s going",
    text: `We’re building the go-to network for handball careers — a place where talent is discoverable, 
    communication is professional, and transfers become simpler. 
    More transparency. Better matches. A stronger handball ecosystem.`,
  },
];

export default function Page() {
  return (
    <section className="py-12">
      {/* Background + container */}
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="rounded-3xl border bg-gradient-to-b from-muted/40 to-background p-6 sm:p-10">
          {/* Optional heading */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Built for players, agents, and clubs
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
              Make handball recruiting feel professional
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground">
              One platform to showcase talent, discover opportunities, and
              connect with the right people.
            </p>
          </div>

          {/* Cards */}
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="h-full rounded-2xl border bg-background/70 backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-foreground/15"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {item.kicker}
                      </p>

                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-muted/40">
                        <Icon className="h-5 w-5 text-foreground/80" />
                      </div>
                    </div>

                    <CardTitle className="mt-4 text-2xl font-semibold tracking-tight">
                      {item.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pb-8">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>

                    {/* Optional: small “benefit bullets” per card */}
                    {/* <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                      <li>• Cleaner discovery</li>
                      <li>• Faster matching</li>
                      <li>• Professional profiles</li>
                    </ul> */}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
