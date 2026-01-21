"use client";

import { useAgents } from "@/lib/hooks/agents";
import { AgentsTable } from "@/components/agents/agents-table";
import { agentColumns } from "@/components/agents/agent-columns";

export default function Page() {
  const { agents, loading, error } = useAgents();

  return (
    <div className="container mx-auto max-w-screen-lg py-10">
      {loading && <div>Loading agents...</div>}
      {error && <div>Error loading agents: {error.message}</div>}
      <AgentsTable columns={agentColumns} data={agents} />
    </div>
  );
}
