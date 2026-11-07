"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function NetworkError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Network graph error boundary caught:", error);
  }, [error]);

  return (
    <div className="panel" style={{ margin: "24px 0", padding: "32px", textAlign: "center" }}>
      <div
        style={{
          display: "inline-flex",
          padding: "12px",
          background: "rgba(239, 68, 68, 0.1)",
          borderRadius: "50%",
          marginBottom: "16px",
          color: "var(--danger)"
        }}
      >
        <AlertCircle size={32} aria-hidden="true" />
      </div>
      <h2 style={{ marginBottom: "8px" }}>Network Graph Unavailable</h2>
      <p className="muted" style={{ maxWidth: "500px", margin: "0 auto 20px" }}>
        Failed to construct or render the relationship graph. The network calculation or Cytoscape layout encountered an issue.
      </p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <button
          type="button"
          className="button primary"
          onClick={reset}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <RotateCcw size={16} />
          Retry Graph Render
        </button>
        <Link
          href="/"
          className="button"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <Home size={16} />
          Back to Overview
        </Link>
      </div>
    </div>
  );
}
