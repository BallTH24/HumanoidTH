"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ExternalLink, ChevronRight, HeartHandshake } from "lucide-react";
import { useUserMode } from "@/components/providers/UserModeProvider";
import ModeToggle from "@/components/navigation/ModeToggle";
import { getRobotHRIProfile } from "@/lib/hri-evaluation";

interface RobotItem {
  id: string;
  canonicalName: string;
  description: string | null;
  robotType: string;
  thailandStatus: string;
  manufacturer: string | null;
  developerOrg: string | null;
  primaryUseCase: string | null;
  officialUrl: string | null;
  bannerUrl: string | null;
  statusConfidence?: number;
}

interface RobotsListClientProps {
  robots: RobotItem[];
  currentLang: "en" | "th";
}

export default function RobotsListClient({
  robots,
  currentLang
}: RobotsListClientProps) {
  const { isExpert, isGeneral } = useUserMode();
  const [filterQuery, setFilterQuery] = useState("");
  const isThai = currentLang === "th";

  const filteredRobots = robots.filter((r) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      r.canonicalName.toLowerCase().includes(q) ||
      r.robotType.toLowerCase().includes(q) ||
      (r.developerOrg || "").toLowerCase().includes(q) ||
      (r.primaryUseCase || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="robots-page-container flex flex-col gap-4 pb-24">
      {/* Toolbar Panel */}
      <div
        className="panel"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "260px" }}>
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder={isThai ? "ค้นหาชื่อรุ่นหรือผู้พัฒนา..." : "Filter models or developer..."}
            style={{ maxWidth: "340px", width: "100%" }}
          />
          <Link
            href="/wellness"
            className="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              whiteSpace: "nowrap"
            }}
          >
            <HeartHandshake size={14} style={{ color: "var(--accent)" }} />
            <span>{isThai ? "สำรวจมิติ HRI" : "HRI Explorer"}</span>
          </Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="muted" style={{ fontSize: "12px" }}>
            {isThai ? "โหมดแสดงผล:" : "View Mode:"}
          </span>
          <ModeToggle />
        </div>
      </div>

      {/* Responsive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRobots.map((robot) => {
          const profile = getRobotHRIProfile(robot);

          return (
            <article
              className="card flex flex-col h-full justify-between"
              key={robot.id}
              style={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div className="card-banner">
                  {robot.bannerUrl ? (
                    <img src={robot.bannerUrl} alt={robot.canonicalName} loading="lazy" />
                  ) : (
                    <div className="source-thumbnail-empty">No source thumbnail</div>
                  )}
                </div>

                <h2 style={{ margin: "0 0 6px 0", fontSize: "16px" }}>
                  <Link href={`/robots/${encodeURIComponent(robot.id)}`}>
                    {robot.canonicalName}
                  </Link>
                </h2>

                <p className="muted" style={{ margin: "0 0 10px 0", fontSize: "13px", lineHeight: 1.5 }}>
                  {isGeneral
                    ? profile.caregiverSummaryEn
                    : (robot.description ?? "No description yet.")}
                </p>

                {/* Badge Row with shrink-0 and nowrap */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px", margin: "6px 0 10px 0" }}>
                  <span className="badge whitespace-nowrap shrink-0">{robot.robotType}</span>
                  <span className="badge ok whitespace-nowrap shrink-0">{robot.thailandStatus}</span>
                </div>

                {/* Developer / Organization with Truncate */}
                <div style={{ marginTop: "auto", paddingTop: "8px" }}>
                  <strong
                    className="truncate"
                    style={{ display: "block", fontSize: "13px", maxWidth: "100%" }}
                    title={robot.manufacturer ?? robot.developerOrg ?? "Unknown developer"}
                  >
                    {robot.manufacturer ?? robot.developerOrg ?? "Unknown developer"}
                  </strong>
                  <span
                    className="muted truncate"
                    style={{ fontSize: "12px", display: "block", maxWidth: "100%" }}
                    title={robot.primaryUseCase ?? "Use case unclassified"}
                  >
                    {robot.primaryUseCase ?? "Use case unclassified"}
                  </span>
                </div>

                {/* Mode-specific metrics */}
                {isExpert && (
                  <div
                    style={{
                      margin: "10px 0 0 0",
                      padding: "8px 10px",
                      background: "var(--surface-muted)",
                      borderRadius: "6px",
                      fontSize: "11px",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "8px",
                      border: "1px solid var(--border)"
                    }}
                  >
                    <span>
                      Godspeed:{" "}
                      <strong>
                        {(
                          (profile.godspeed.anthropomorphism +
                            profile.godspeed.animacy +
                            profile.godspeed.likeability +
                            profile.godspeed.perceivedIntelligence +
                            profile.godspeed.perceivedSafety) /
                          5
                        ).toFixed(1)}{" "}
                        / 5.0
                      </strong>
                    </span>
                    <span>
                      DOF: <strong>{profile.telemetry.degreesOfFreedom ?? "N/A"}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Card Footer Aligned to Bottom */}
              <div
                className="mt-auto pt-3 border-t border-[var(--border)]"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "10px",
                  borderTop: "1px solid var(--border)",
                  marginTop: "12px"
                }}
              >
                <Link
                  href={`/robots/${encodeURIComponent(robot.id)}`}
                  style={{ fontSize: "12px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  <span>{isThai ? "ดูรายละเอียดโมเดล" : "Model Profile"}</span>
                  <ChevronRight size={13} />
                </Link>

                {robot.officialUrl && (
                  <a
                    href={robot.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="muted"
                    style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "3px" }}
                  >
                    <span>Source</span>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </article>
          );
        })}

        {!filteredRobots.length && (
          <div className="empty" style={{ gridColumn: "1 / -1" }}>
            {isThai ? "ไม่พบโมเดลหุ่นยนต์ที่ตรงกับคำค้นหา" : "No robot models match your query."}
          </div>
        )}
      </div>
    </div>
  );
}
