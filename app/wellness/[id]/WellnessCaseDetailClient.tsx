"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  HeartHandshake,
  Smile,
  Wrench,
  Cpu,
  BookOpen,
  Sparkles,
  Clock,
  Bot,
  Calendar,
  CheckCircle2,
  FileCode,
  Gauge
} from "lucide-react";
import { useUserMode } from "@/components/providers/UserModeProvider";
import ModeToggle from "@/components/navigation/ModeToggle";

interface RobotInfo {
  id: string;
  canonicalName: string;
  robotType: string;
  manufacturer: string | null;
  developerOrg: string | null;
  thailandStatus: string;
}

interface WellnessCaseData {
  id: string;
  title: string;
  robotId: string;
  robot: RobotInfo;
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
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface WellnessCaseDetailClientProps {
  caseData: WellnessCaseData;
  currentLang?: "en" | "th";
}

export default function WellnessCaseDetailClient({
  caseData,
  currentLang = "th"
}: WellnessCaseDetailClientProps) {
  const { isExpert, isGeneral } = useUserMode();
  const [showRawJson, setShowRawJson] = useState(false);
  const isThai = currentLang === "th";

  const dateFormatted = new Date(caseData.createdAt).toLocaleDateString(
    isThai ? "th-TH" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Top Navigation & Mode Switch */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px"
        }}
      >
        <Link
          href="/wellness"
          className="button"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px" }}
        >
          <ArrowLeft size={14} />
          <span>{isThai ? "กลับสู่ศูนย์สำรวจวิจัยสุขภาวะ" : "Back to Wellness Explorer"}</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="muted" style={{ fontSize: "12px" }}>
            {isThai ? "โหมดแสดงผล:" : "View Mode:"}
          </span>
          <ModeToggle />
        </div>
      </div>

      {/* Main Case Study Overview Panel */}
      <article className="panel motion-panel">
        {/* Header Badges */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span className="badge ok" style={{ fontSize: "12px", fontWeight: 600 }}>
              {caseData.scenarioContext}
            </span>
            <span
              className={`badge ${
                caseData.status === "APPROVED"
                  ? "ok"
                  : caseData.status === "PENDING"
                    ? "warn"
                    : "danger"
              }`}
              style={{ fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <CheckCircle2 size={12} />
              <span>Status: {caseData.status}</span>
            </span>
          </div>

          <div className="muted" style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Calendar size={13} />
            <span>{dateFormatted}</span>
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: "22px", margin: "0 0 12px 0", lineHeight: 1.3 }}>
          {caseData.title}
        </h1>

        {/* Linked Robot Card Ribbon */}
        <div
          style={{
            background: "var(--surface-muted)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "12px 14px",
            marginBottom: "18px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                display: "grid",
                placeItems: "center",
                color: "var(--accent)"
              }}
            >
              <Bot size={20} />
            </div>
            <div>
              <div className="muted" style={{ fontSize: "11px", textTransform: "uppercase" }}>
                {isThai ? "หุ่นยนต์ที่ใช้ในการศึกษา" : "Evaluated Robot Platform"}
              </div>
              <strong style={{ fontSize: "14px", color: "var(--text-primary)" }}>
                {caseData.robot.canonicalName}
              </strong>
              <span className="muted" style={{ fontSize: "12px", marginLeft: "8px" }}>
                ({caseData.robot.robotType})
              </span>
            </div>
          </div>

          <Link
            href={`/robots/${encodeURIComponent(caseData.robot.id)}`}
            className="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px"
            }}
          >
            <span>{isThai ? "เปิดหน้าโปรไฟล์หุ่นยนต์" : "Open Model Profile"}</span>
            <ExternalLink size={12} />
          </Link>
        </div>

        {/* 4 Dimension HRI Visual Cards */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 10px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {isThai ? "ผลการประเมินมิติปฏิสัมพันธ์ 4 ด้าน (HRI Evaluation Dimensions)" : "4-Dimension HRI Evaluation Profile"}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            {/* Stress */}
            <div style={{ background: "var(--surface-muted)", borderRadius: "8px", padding: "12px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600 }}>
                  <Smile size={14} style={{ color: "#0284c7" }} />
                  <span>{isThai ? "ลดความตึงเครียด" : "Stress Reduction"}</span>
                </span>
                <strong style={{ color: "#0284c7", fontSize: "14px" }}>{caseData.stressScore} / 5</strong>
              </div>
              <div style={{ width: "100%", height: "6px", background: "rgba(0,0,0,0.08)", borderRadius: "3px", overflow: "hidden", margin: "6px 0" }}>
                <div style={{ height: "100%", width: `${(caseData.stressScore / 5) * 100}%`, background: "#0284c7", borderRadius: "3px" }} />
              </div>
              <div className="muted" style={{ fontSize: "11px" }}>
                {isExpert
                  ? "Godspeed Anxious-Relaxed scale (1=Anxious, 5=Calm)"
                  : isThai ? "ระดับความผ่อนคลายและลดความตื่นกลัว" : "Relaxation and anxiety reduction level"}
              </div>
            </div>

            {/* Comfort */}
            <div style={{ background: "var(--surface-muted)", borderRadius: "8px", padding: "12px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600 }}>
                  <HeartHandshake size={14} style={{ color: "#e11d48" }} />
                  <span>{isThai ? "ความสบายใจ" : "Comfort Index"}</span>
                </span>
                <strong style={{ color: "#e11d48", fontSize: "14px" }}>{caseData.comfortScore} / 5</strong>
              </div>
              <div style={{ width: "100%", height: "6px", background: "rgba(0,0,0,0.08)", borderRadius: "3px", overflow: "hidden", margin: "6px 0" }}>
                <div style={{ height: "100%", width: `${(caseData.comfortScore / 5) * 100}%`, background: "#e11d48", borderRadius: "3px" }} />
              </div>
              <div className="muted" style={{ fontSize: "11px" }}>
                {isExpert
                  ? "Embodied Comfort & Proximity Acceptance (1-5)"
                  : isThai ? "ความรู้สึกเป็นมิตรและไม่คุกคาม" : "Approachable and friendly feeling"}
              </div>
            </div>

            {/* Trust */}
            <div style={{ background: "var(--surface-muted)", borderRadius: "8px", padding: "12px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600 }}>
                  <ShieldCheck size={14} style={{ color: "#d97706" }} />
                  <span>{isThai ? "ความไว้วางใจ & ปลอดภัย" : "Trust & Safety"}</span>
                </span>
                <strong style={{ color: "#d97706", fontSize: "14px" }}>{caseData.trustScore} / 5</strong>
              </div>
              <div style={{ width: "100%", height: "6px", background: "rgba(0,0,0,0.08)", borderRadius: "3px", overflow: "hidden", margin: "6px 0" }}>
                <div style={{ height: "100%", width: `${(caseData.trustScore / 5) * 100}%`, background: "#d97706", borderRadius: "3px" }} />
              </div>
              <div className="muted" style={{ fontSize: "11px" }}>
                {isExpert
                  ? "RoSAS Safety / TAM Perceived Reliability (1-5)"
                  : isThai ? "ความเชื่อมั่นในความปลอดภัยและความแม่นยำ" : "Confidence in safety and reliability"}
              </div>
            </div>

            {/* Usefulness */}
            <div style={{ background: "var(--surface-muted)", borderRadius: "8px", padding: "12px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600 }}>
                  <Wrench size={14} style={{ color: "var(--accent)" }} />
                  <span>{isThai ? "ประโยชน์ใช้งานจริง" : "Practical Utility"}</span>
                </span>
                <strong style={{ color: "var(--accent)", fontSize: "14px" }}>{caseData.usefulnessScore} / 5</strong>
              </div>
              <div style={{ width: "100%", height: "6px", background: "rgba(0,0,0,0.08)", borderRadius: "3px", overflow: "hidden", margin: "6px 0" }}>
                <div style={{ height: "100%", width: `${(caseData.usefulnessScore / 5) * 100}%`, background: "var(--accent)", borderRadius: "3px" }} />
              </div>
              <div className="muted" style={{ fontSize: "11px" }}>
                {isExpert
                  ? "TAM Perceived Usefulness & Clinical Efficacy (1-5)"
                  : isThai ? "ความคุ้มค่าและความสามารถในการแบ่งเบาภาระ" : "Practical workflow burden relief"}
              </div>
            </div>
          </div>
        </div>

        {/* Activity & Deployment Protocol */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "6px" }}>
            <Sparkles size={16} style={{ color: "var(--accent)" }} />
            <span>{isThai ? "กระบวนการและกิจกรรมที่สังเกตการณ์" : "Activity & Interaction Narrative"}</span>
          </h2>
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "16px",
              lineHeight: 1.7,
              fontSize: "13.5px",
              color: "var(--text-primary)"
            }}
          >
            {caseData.activityDesc}
          </div>
        </div>

        {/* Caveats Banner */}
        {caseData.caveats && (
          <div
            style={{
              background: "#fffbe6",
              borderLeft: "4px solid var(--warning)",
              borderRadius: "4px 8px 8px 4px",
              padding: "12px 16px",
              marginBottom: "20px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--warning)", fontWeight: 700, fontSize: "13px", marginBottom: "4px" }}>
              <AlertTriangle size={16} />
              <span>{isThai ? "ข้อจำกัดและข้อควรระวังในการปฏิบัติการ" : "Operational Limitations & Caveats"}</span>
            </div>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-primary)", lineHeight: 1.5 }}>
              {caseData.caveats}
            </p>
          </div>
        )}

        {/* Citations & Evidence Section */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "16px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <div>
            <div className="muted" style={{ fontSize: "11px" }}>
              {isThai ? "หน่วยงาน / คณะผู้วิจัยผู้ส่งข้อมูล:" : "Submitted by:"}
            </div>
            <strong style={{ fontSize: "13px" }}>
              {caseData.submittedBy || (isThai ? "สถาบันวิจัยที่ได้รับการรับรอง" : "Verified Institution")}
            </strong>
          </div>

          <a
            href={caseData.evidenceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="button primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px" }}
          >
            <BookOpen size={14} />
            <span>{isThai ? "เปิดเอกสารหลักฐาน / รายงานวิจัย" : "Open Evidence Document"}</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </article>

      {/* Expert Mode Inspector Section */}
      {isExpert && (
        <section className="panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px", color: "var(--warning)" }}>
              <Cpu size={16} />
              <span>Expert Telemetry & Raw Data Inspector</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowRawJson(!showRawJson)}
              className="button"
              style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px" }}
            >
              <FileCode size={13} />
              <span>{showRawJson ? "Hide JSON" : "Inspect Raw JSON"}</span>
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", fontSize: "12px", fontFamily: "monospace", marginBottom: "12px" }}>
            <div style={{ background: "var(--surface-muted)", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)" }}>
              <div className="muted" style={{ fontSize: "10px" }}>RECORD ID</div>
              <div style={{ wordBreak: "break-all", fontWeight: 700 }}>{caseData.id}</div>
            </div>
            <div style={{ background: "var(--surface-muted)", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)" }}>
              <div className="muted" style={{ fontSize: "10px" }}>ROBOT ID</div>
              <div style={{ wordBreak: "break-all", fontWeight: 700 }}>{caseData.robotId}</div>
            </div>
            <div style={{ background: "var(--surface-muted)", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)" }}>
              <div className="muted" style={{ fontSize: "10px" }}>STATUS</div>
              <div style={{ color: "var(--accent)", fontWeight: 700 }}>{caseData.status}</div>
            </div>
            <div style={{ background: "var(--surface-muted)", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)" }}>
              <div className="muted" style={{ fontSize: "10px" }}>AGGREGATE HRI SCORE</div>
              <div style={{ color: "var(--warning)", fontWeight: 700 }}>
                {((caseData.stressScore + caseData.comfortScore + caseData.trustScore + caseData.usefulnessScore) / 4).toFixed(2)} / 5.0
              </div>
            </div>
          </div>

          {showRawJson && (
            <pre
              style={{
                background: "#0b1a15",
                color: "#86efac",
                padding: "14px",
                borderRadius: "8px",
                fontSize: "11px",
                overflowX: "auto",
                border: "1px solid #1c4535",
                margin: 0
              }}
            >
              {JSON.stringify(caseData, null, 2)}
            </pre>
          )}
        </section>
      )}
    </div>
  );
}
