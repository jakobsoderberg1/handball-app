"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const name = "Jakob Söderberg";
  const email = "jakob.soderberg9@gmail.com";
  const linkedinHandle = "jakobsoderberg9";
  const linkedinUrl = `https://www.linkedin.com/in/${linkedinHandle}`;

  return (
    <section className="py-12">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* soft backdrop container */}
        <div className="rounded-3xl border bg-gradient-to-b from-muted/40 to-background p-6 sm:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-muted-foreground">Contact</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
              Let’s connect
            </h1>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground">
              Reach out anytime — I’m happy to talk about handballIn,
              partnerships, or feedback.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {/* Main card */}
            <Card className="lg:col-span-2 h-full rounded-2xl border bg-background/70 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  {name}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Founder of handballIn
                </p>
              </CardHeader>

              <CardContent className="pb-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Email */}
                  <div className="rounded-2xl border bg-muted/20 p-4">
                    <div className="flex items-start gap-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background">
                        <Mail className="h-5 w-5 text-foreground/80" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">Email</p>
                        <a
                          href={`mailto:${email}`}
                          className="mt-1 block truncate text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="rounded-2xl border bg-muted/20 p-4">
                    <div className="flex items-start gap-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background">
                        <Linkedin className="h-5 w-5 text-foreground/80" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">LinkedIn</p>
                        <a
                          href={linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 block truncate text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          /in/{linkedinHandle}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button asChild className="rounded-xl">
                    <a href={`mailto:${email}`}>
                      Send an email <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>

                  <Button asChild variant="outline" className="rounded-xl">
                    <a href={linkedinUrl} target="_blank" rel="noreferrer">
                      Connect on LinkedIn{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>

                <p className="mt-6 text-xs text-muted-foreground">
                  Prefer DMs? LinkedIn is usually the fastest.
                </p>
              </CardContent>
            </Card>

            {/* Side card (optional “why contact” / reassurance) */}
            <Card className="h-full rounded-2xl border bg-background/70 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold tracking-tight">
                  What to reach out about
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-8">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="rounded-xl border bg-muted/20 p-3">
                    Partnerships with clubs, agents, or federations
                  </li>
                  <li className="rounded-xl border bg-muted/20 p-3">
                    Feedback on the platform or feature requests
                  </li>
                  <li className="rounded-xl border bg-muted/20 p-3">
                    Press, collaborations, or community ideas
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
