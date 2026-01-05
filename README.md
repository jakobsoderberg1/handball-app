# handballIn

A handball recruiting web app where players can create profiles and clubs/agents can discover talent. Built as a full-stack Next.js project with Supabase (Auth + Postgres) and a clean UI using Tailwind + shadcn.

## What you can do

- Browse player profiles and see key stats + club history
- Browse clubs (name + country)
- Sign up / log in with email/password
- Choose a role on sign-up: Player, Agent, or Club Rep
- Players can edit their own profile under the protected area

## Tech stack

- Next.js (App Router)
- Supabase: authentication + database
- Tailwind CSS + shadcn/ui components

## Key pages

- `/` – landing + latest player profiles
- `/players` – players table
- `/players/[userId]` – public player profile
- `/clubs` – clubs table
- `/auth/*` – login, signup, password reset, email confirmation
- `/protected/player/[userId]` – player profile editing (authenticated)

> Note: `/clubs/[clubId]` and some role dashboards are scaffolded but not yet implemented.

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` with your Supabase project values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_or_anon_key
```

3. Start the dev server:

```bash
npm run dev
```

Open http://localhost:3000.
