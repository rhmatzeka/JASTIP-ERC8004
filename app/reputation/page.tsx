"use client";

import { useEffect, useState } from "react";
import ReputationCard from "@/components/ReputationCard";
import type { AgentReputation } from "@/lib/types";

export default function ReputationPage() {
  const [reputations, setReputations] = useState<AgentReputation[]>([]);

  useEffect(() => {
    fetch("/api/reputation/all")
      .then((response) => response.json())
      .then((data) => setReputations(data.reputations || []));
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <p className="text-sm font-bold text-ocean">ERC-8004-style agent registry</p>
        <h1 className="mt-1 text-3xl font-black text-ink">Reputasi Jastiper</h1>
      </div>
      <div className="grid gap-4">
        {reputations.length === 0 ? (
          <div className="panel p-8 text-center text-muted">No registered jastiper agents yet.</div>
        ) : (
          reputations.map((reputation) => <ReputationCard key={reputation.walletAddress} reputation={reputation} />)
        )}
      </div>
    </main>
  );
}
