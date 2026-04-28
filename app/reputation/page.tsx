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
    <main className="page-shell">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <p className="eyebrow">ERC-8004-style agent registry</p>
          <h1 className="page-title">Reputasi Jastiper</h1>
        </div>
        <div className="grid gap-3">
          {reputations.length === 0 ? (
            <div className="panel p-8 text-center text-sm text-muted">No registered jastiper agents yet.</div>
          ) : (
            reputations.map((reputation) => <ReputationCard key={reputation.walletAddress} reputation={reputation} />)
          )}
        </div>
      </div>
    </main>
  );
}
