import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getTranslation } from "@/lib/translations";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "API Data Ingestion",
  robots: { index: false, follow: false }
};

export default async function DataPullsPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "en") as "en" | "th";
  const t = getTranslation(lang);

  const jobs = await prisma.sourcePullJob.findMany({ orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <div className="data-pulls-page">
      <h1>{t.dataPullsTitle}</h1>
      <p className="muted">{t.dataPullsDesc}</p>
      <div className="notice" style={{ marginBottom: 14 }}>
        Pull jobs save source records for later relevance and perspective review. They do not publish community submissions automatically.
      </div>

      <div className="table-wrap" style={{ marginTop: 14 }}>
        <table>
          <thead><tr><th>Adapter</th><th>Query</th><th>Status</th><th>Found</th><th>Saved</th><th>Error / missing key</th></tr></thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.adapter}</td>
                <td>{job.query}</td>
                <td>{job.status}</td>
                <td>{job.recordsFound}</td>
                <td>{job.recordsSaved}</td>
                <td>{job.errorMessage}</td>
              </tr>
            ))}
            {!jobs.length && (
              <tr>
                <td className="empty" colSpan={6} style={{ padding: "32px 16px", textAlign: "center" }}>
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>No data pull jobs recorded yet.</p>
                  <p className="muted" style={{ fontSize: 13, maxWidth: 480, margin: "0 auto" }}>
                    Trigger an ingestion job using the floating action button or API endpoints to fetch live records from external adapters.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
