import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getTranslation } from "@/lib/translations";
import WellnessExplorerClient from "./WellnessExplorerClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Wellness & HRI Research Explorer | Thailand Humanoid Atlas",
  description:
    "Interactive research explorer for robotics in elderly care, physical rehabilitation, hospital concierge, and social education in Thailand with dual General and Expert evaluation modes and empirical casebook.",
  alternates: { canonical: "/wellness" },
  openGraph: {
    title: "Wellness & HRI Research Explorer | Thailand Humanoid Atlas",
    description:
      "Operational scenarios, clinical evaluation, and Human-Robot Interaction (HRI) metrics across Thailand.",
    url: "/wellness",
    siteName: "Thailand Humanoid Atlas",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Thailand Humanoid Atlas"
      }
    ],
    locale: "en_US",
    type: "website"
  }
};

export default async function WellnessPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "en") as "en" | "th";
  const t = getTranslation(lang);

  let robots: Array<{
    id: string;
    canonicalName: string;
    description: string | null;
    robotType: string;
    thailandStatus: string;
    manufacturer: string | null;
    developerOrg: string | null;
    primaryUseCase: string | null;
    officialUrl: string | null;
    sourceMeta: unknown;
  }> = [];

  let sources: Array<{
    title: string;
    url: string;
    platform: string | null;
  }> = [];

  let annotations: Array<{
    id: string;
    perspectiveTheme: string;
    stance: string;
    sentiment: string;
    evidenceExcerpt: string;
    confidence: number;
  }> = [];

  let cases: Array<{
    id: string;
    title: string;
    robotId: string;
    robot: {
      id: string;
      canonicalName: string;
      robotType: string;
      manufacturer: string | null;
      developerOrg: string | null;
      thailandStatus: string;
    };
    scenarioContext: string;
    activityDesc: string;
    stressScore: number;
    comfortScore: number;
    trustScore: number;
    usefulnessScore: number;
    caveats: string | null;
    evidenceUrl: string;
    submittedBy: string | null;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: Date;
    updatedAt: Date;
  }> = [];

  let dbOffline = false;

  try {
    [robots, sources, annotations, cases] = await Promise.all([
      prisma.robotModel.findMany({
        orderBy: { canonicalName: "asc" },
        take: 200
      }),
      prisma.sourceRecord.findMany({
        orderBy: [{ relevanceConfidence: "desc" }, { updatedAt: "desc" }],
        select: { title: true, url: true, platform: true },
        take: 500
      }),
      prisma.perspectiveAnnotation.findMany({
        orderBy: { confidence: "desc" },
        select: {
          id: true,
          perspectiveTheme: true,
          stance: true,
          sentiment: true,
          evidenceExcerpt: true,
          confidence: true
        },
        take: 200
      }),
      prisma.wellnessCase.findMany({
        where: { status: "APPROVED" },
        include: {
          robot: {
            select: {
              id: true,
              canonicalName: true,
              robotType: true,
              manufacturer: true,
              developerOrg: true,
              thailandStatus: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      })
    ]);
  } catch (error) {
    console.error("Database query failed in wellness page:", error);
    dbOffline = true;
    robots = [];
    sources = [];
    annotations = [];
    cases = [];
  }

  return (
    <>
      <div className="topline">
        <div>
          <h1>{t.wellnessTitle}</h1>
          <p className="muted">{t.wellnessDesc}</p>
        </div>
      </div>

      {dbOffline && (
        <div className="notice" style={{ marginBottom: 16 }}>
          Live PostgreSQL database connection is unavailable. No substitute records are being shown.
        </div>
      )}

      <WellnessExplorerClient
        robots={robots}
        sources={sources}
        annotations={annotations}
        cases={cases}
        currentLang={lang}
      />

      <div style={{ marginTop: "20px", paddingBottom: "16px" }}>
        <p style={{ fontSize: "11px", lineHeight: 1.5, color: "var(--text-secondary)", opacity: 0.85, margin: 0 }}>
          <strong style={{ color: "var(--text-primary)" }}>หมายเหตุระเบียบวิธีวิจัย: </strong>
          ดัชนีชี้วัด HRI (Stress, Comfort, Trust, Utility) เป็นคะแนนที่ประเมินเชิงประจักษ์ (Empirical &amp; Inferred Evaluation) ตามกรอบมาตรฐานสากล Godspeed Questionnaire Series และ Technology Acceptance Model (TAM) จากเอกสารวิจัยที่ตีพิมพ์ ไม่ใช่การวินิจฉัยทางการแพทย์ (Non-diagnostic Context)
        </p>
      </div>
    </>
  );
}
