"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  HeartHandshake,
  ShieldCheck,
  Smile,
  Wrench,
  Bot,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Cpu,
  BookOpen,
  CheckCircle2,
  X,
  Gauge,
  PlusCircle,
  Info
} from "lucide-react";
import { useUserMode } from "@/components/providers/UserModeProvider";
import ModeToggle from "@/components/navigation/ModeToggle";
import SubmitCaseModal from "@/components/wellness/SubmitCaseModal";
import {
  HRIScenarioCategory,
  RobotHRIProfile,
  getRobotHRIProfile
} from "@/lib/hri-evaluation";

interface RobotRecord {
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
}

interface SourceRecordLike {
  title: string;
  url: string;
  platform: string | null;
}

interface PerspectiveAnnotationLike {
  id: string;
  perspectiveTheme: string;
  stance: string;
  sentiment: string;
  evidenceExcerpt: string;
  confidence: number;
}

interface WellnessCaseItem {
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
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface WellnessExplorerClientProps {
  robots: RobotRecord[];
  sources: SourceRecordLike[];
  annotations: PerspectiveAnnotationLike[];
  cases?: WellnessCaseItem[];
  currentLang: "en" | "th";
}

const CATEGORIES: Array<{
  id: HRIScenarioCategory;
  labelEn: string;
  labelTh: string;
  descEn: string;
  descTh: string;
}> = [
  {
    id: "all",
    labelEn: "All Scenarios",
    labelTh: "ทุกหมวดหมู่",
    descEn: "All evaluated robotics platforms",
    descTh: "ทุกแพลตฟอร์มหุ่นยนต์ที่ได้รับการประเมิน"
  },
  {
    id: "elderly_care",
    labelEn: "Elderly Care",
    labelTh: "การดูแลผู้สูงอายุ",
    descEn: "Dementia care, routine assistance & companionship",
    descTh: "การบริบาลผู้สูงอายุ เตือนความจำ และเพื่อนคลายเหงา"
  },
  {
    id: "rehab",
    labelEn: "Physical Rehabilitation",
    labelTh: "เวชศาสตร์ฟื้นฟู",
    descEn: "Neuro-recovery, post-stroke & gait training",
    descTh: "การฟื้นฟูผู้ป่วยหลอดเลือดสมองและฝึกการเคลื่อนไหว"
  },
  {
    id: "concierge",
    labelEn: "Hospital Concierge",
    labelTh: "ห้องรอตรวจ/บริการ",
    descEn: "OPD navigation, triage & isolation telepresence",
    descTh: "การนำทางผู้ป่วยนอก คัดกรอง และส่งของในหอผู้ป่วย"
  },
  {
    id: "social",
    labelEn: "Social/Education",
    labelTh: "การศึกษาและการมีส่วนร่วม",
    descEn: "Autism therapy, classroom & civic guidance",
    descTh: "การบำบัดเสริมพัฒนาการ การศึกษา และแนะนำข้อมูล"
  }
];

export default function WellnessExplorerClient({
  robots,
  sources,
  annotations,
  cases = [],
  currentLang
}: WellnessExplorerClientProps) {
  const { isExpert, isGeneral } = useUserMode();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<HRIScenarioCategory>("all");
  const [minStress, setMinStress] = useState<number>(0);
  const [minComfort, setMinComfort] = useState<number>(0);
  const [minTrust, setMinTrust] = useState<number>(0);
  const [minUsefulness, setMinUsefulness] = useState<number>(0);
  const [selectedRobotForDetail, setSelectedRobotForDetail] = useState<
    (RobotHRIProfile & { rawRobot: RobotRecord }) | null
  >(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Generate enriched HRI profiles
  const profiles = useMemo(() => {
    return robots.map((robot) => {
      const profile = getRobotHRIProfile(robot);
      return {
        ...profile,
        rawRobot: robot
      };
    });
  }, [robots]);

  // Client-side filtering across keywords, category chips, and 4 HRI score sliders
  const filteredProfiles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return profiles.filter((item) => {
      // 1. Category Filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }

      // 2. 4 HRI Dimensions Range Sliders
      if (item.hriScores.stress < minStress) return false;
      if (item.hriScores.comfort < minComfort) return false;
      if (item.hriScores.trust < minTrust) return false;
      if (item.hriScores.usefulness < minUsefulness) return false;

      // 3. Keyword Search Input
      if (query) {
        const matchesName = item.canonicalName.toLowerCase().includes(query);
        const matchesCategory =
          item.categoryLabelEn.toLowerCase().includes(query) ||
          item.categoryLabelTh.toLowerCase().includes(query);
        const matchesContext =
          item.clinicalContextEn.toLowerCase().includes(query) ||
          item.clinicalContextTh.toLowerCase().includes(query);
        const matchesSummary =
          item.caregiverSummaryEn.toLowerCase().includes(query) ||
          item.caregiverSummaryTh.toLowerCase().includes(query);
        const matchesOrg =
          (item.rawRobot.developerOrg || "").toLowerCase().includes(query) ||
          (item.rawRobot.manufacturer || "").toLowerCase().includes(query);
        const matchesTelemetry = item.telemetry.sensorArray.some((s) =>
          s.toLowerCase().includes(query)
        );

        if (
          !matchesName &&
          !matchesCategory &&
          !matchesContext &&
          !matchesSummary &&
          !matchesOrg &&
          !matchesTelemetry
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    profiles,
    searchQuery,
    selectedCategory,
    minStress,
    minComfort,
    minTrust,
    minUsefulness
  ]);

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "all" ||
    minStress > 0 ||
    minComfort > 0 ||
    minTrust > 0 ||
    minUsefulness > 0;

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setMinStress(0);
    setMinComfort(0);
    setMinTrust(0);
    setMinUsefulness(0);
  };

  const isThai = currentLang === "th";

  return (
    <div className="wellness-explorer-container flex flex-col gap-6 pb-24">
      {/* Top Banner: Mode Indicator & Switch */}
      <div
        className="panel motion-panel"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          background: "var(--surface)",
          border: "1px solid var(--border)"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span
              className={`badge ${isExpert ? "warn" : "ok"}`}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 600 }}
            >
              {isExpert ? (
                <>
                  <Cpu size={12} />
                  <span>{isThai ? "มุมมองนักวิจัย & มาตรวัดเชิงลึก" : "Researcher & Telemetry View"}</span>
                </>
              ) : (
                <>
                  <HeartHandshake size={12} />
                  <span>{isThai ? "มุมมองผู้ดูแล & ภาษาง่าย" : "Caregiver & General View"}</span>
                </>
              )}
            </span>
            <span className="muted" style={{ fontSize: "12px" }}>
              {isExpert
                ? isThai
                  ? "แสดงดัชนี Godspeed, RoSAS และค่าเทเลเมตรีเชิงลึก"
                  : "Godspeed series, RoSAS metrics, and sensor telemetry enabled"
                : isThai
                  ? "สรุปการใช้งานสำหรับผู้ดูแล ลดความซับซ้อนของข้อมูล"
                  : "Plain summaries, intuitive comfort ratings, reduced cognitive load"}
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>
            {isThai
              ? "ศูนย์สำรวจวิจัยสุขภาวะและปฏิสัมพันธ์หุ่นยนต์ (HRI Explorer)"
              : "Wellness & Human-Robot Interaction (HRI) Explorer"}
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="button primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              background: "var(--accent)"
            }}
          >
            <PlusCircle size={14} />
            <span>{isThai ? "เสนอผลกรณีศึกษา (Submit Case)" : "Submit Case Study"}</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="muted" style={{ fontSize: "12px" }}>
              {isThai ? "เปลี่ยนโหมด:" : "Switch View:"}
            </span>
            <ModeToggle />
          </div>
        </div>
      </div>

      {/* Research & Filter Toolbar Panel */}
      <div className="panel">
        {/* Search Input Row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", marginBottom: "14px" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-secondary)"
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isThai
                  ? "ค้นหาหัวข้องานวิจัย, ชื่อรุ่นหุ่นยนต์, บริบททางคลินิก (เช่น stroke, bedside, นำทาง)..."
                  : "Search research topics, robot models, or clinical contexts (e.g., stroke, bedside, triage)..."
              }
              style={{
                width: "100%",
                paddingLeft: "36px",
                paddingRight: searchQuery ? "32px" : "12px"
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                  padding: 2
                }}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={showAdvancedFilters || minStress > 0 || minComfort > 0 || minTrust > 0 || minUsefulness > 0 ? "button primary" : "button"}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px" }}
          >
            <SlidersHorizontal size={14} />
            <span>{isThai ? "ตัวกรองคะแนน HRI" : "HRI Score Filters"}</span>
            {(minStress > 0 || minComfort > 0 || minTrust > 0 || minUsefulness > 0) && (
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--warning)" }} />
            )}
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="button"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--danger)" }}
              title="Reset all search filters"
            >
              <RotateCcw size={13} />
              <span>{isThai ? "รีเซ็ต" : "Reset"}</span>
            </button>
          )}
        </div>

        {/* Operational Category Filter Chips */}
        <div>
          <div className="muted" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
            {isThai ? "สถานการณ์การใช้งานจริง (Operational Scenarios):" : "Operational Scenarios:"}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count =
                cat.id === "all"
                  ? profiles.length
                  : profiles.filter((p) => p.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: isSelected ? 600 : 500,
                    cursor: "pointer",
                    transition: "all 160ms ease",
                    border: isSelected ? "1px solid var(--accent)" : "1px solid var(--border)",
                    background: isSelected ? "var(--accent)" : "var(--surface)",
                    color: isSelected ? "#ffffff" : "var(--text-secondary)",
                    boxShadow: isSelected ? "0 2px 8px rgba(74, 124, 89, 0.25)" : "none"
                  }}
                >
                  <span>{isThai ? cat.labelTh : cat.labelEn}</span>
                  <span
                    style={{
                      padding: "1px 6px",
                      borderRadius: "10px",
                      fontSize: "11px",
                      background: isSelected ? "rgba(255, 255, 255, 0.25)" : "var(--surface-muted)",
                      color: isSelected ? "#ffffff" : "var(--text-primary)"
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 HRI Dimensions Score Sliders (Expandable) */}
        {showAdvancedFilters && (
          <div
            style={{
              marginTop: "16px",
              paddingTop: "16px",
              borderTop: "1px solid var(--border)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px"
            }}
          >
            {/* Stress Slider */}
            <div style={{ background: "var(--surface-muted)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", marginBottom: "6px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                  <Smile size={14} style={{ color: "#0284c7" }} />
                  <span>{isThai ? "ลดความตึงเครียด" : "Stress Reduction"}</span>
                </span>
                <span style={{ fontFamily: "monospace", color: "var(--accent)", fontWeight: 700 }}>{minStress}%+</span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={minStress}
                onChange={(e) => setMinStress(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-secondary)", marginTop: "4px" }}>
                <span>0%</span>
                <span>50%</span>
                <span>95%</span>
              </div>
            </div>

            {/* Comfort Slider */}
            <div style={{ background: "var(--surface-muted)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", marginBottom: "6px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                  <HeartHandshake size={14} style={{ color: "#e11d48" }} />
                  <span>{isThai ? "ความสบายใจ" : "Comfort Index"}</span>
                </span>
                <span style={{ fontFamily: "monospace", color: "var(--accent)", fontWeight: 700 }}>{minComfort}%+</span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={minComfort}
                onChange={(e) => setMinComfort(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-secondary)", marginTop: "4px" }}>
                <span>0%</span>
                <span>50%</span>
                <span>95%</span>
              </div>
            </div>

            {/* Trust Slider */}
            <div style={{ background: "var(--surface-muted)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", marginBottom: "6px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                  <ShieldCheck size={14} style={{ color: "#d97706" }} />
                  <span>{isThai ? "ความไว้วางใจ" : "Trust & Reliability"}</span>
                </span>
                <span style={{ fontFamily: "monospace", color: "var(--accent)", fontWeight: 700 }}>{minTrust}%+</span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={minTrust}
                onChange={(e) => setMinTrust(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-secondary)", marginTop: "4px" }}>
                <span>0%</span>
                <span>50%</span>
                <span>95%</span>
              </div>
            </div>

            {/* Usefulness Slider */}
            <div style={{ background: "var(--surface-muted)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", marginBottom: "6px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                  <Wrench size={14} style={{ color: "var(--accent)" }} />
                  <span>{isThai ? "การใช้งานจริง" : "Practical Utility"}</span>
                </span>
                <span style={{ fontFamily: "monospace", color: "var(--accent)", fontWeight: 700 }}>{minUsefulness}%+</span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={minUsefulness}
                onChange={(e) => setMinUsefulness(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-secondary)", marginTop: "4px" }}>
                <span>0%</span>
                <span>50%</span>
                <span>95%</span>
              </div>
            </div>
          </div>
        )}

        {/* Result Status Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px", paddingTop: "12px", borderTop: "1px solid var(--border)", fontSize: "12px" }}>
          <div>
            <span className="muted">{isThai ? "แสดง " : "Showing "}</span>
            <strong style={{ color: "var(--accent)" }}>{filteredProfiles.length}</strong>
            <span className="muted">{isThai ? ` จากทั้งหมด ${profiles.length} หุ่นยนต์ที่ประเมิน` : ` of ${profiles.length} evaluated robots`}</span>
            {selectedCategory !== "all" && (
              <span className="muted" style={{ marginLeft: 8 }}>
                • {isThai ? "หมวด: " : "Category: "}
                <strong style={{ color: "var(--text-primary)" }}>
                  {isThai
                    ? CATEGORIES.find((c) => c.id === selectedCategory)?.labelTh
                    : CATEGORIES.find((c) => c.id === selectedCategory)?.labelEn}
                </strong>
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "12px" }}
            >
              {isThai ? "ล้างเงื่อนไขทั้งหมด" : "Clear all filters"}
            </button>
          )}
        </div>

        {/* Academic Methodology Disclaimer Banner (under 4 HRI dimension filter bar) */}
        <div
          style={{
            marginTop: "14px",
            padding: "10px 14px",
            background: "rgba(16, 185, 129, 0.05)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            fontSize: "12px",
            lineHeight: 1.5,
            color: "var(--text-secondary)"
          }}
        >
          <Info size={16} style={{ color: "var(--accent)", flexShrink: 0, marginTop: "2px" }} />
          <div>
            <strong style={{ color: "var(--text-primary)" }}>หมายเหตุระเบียบวิธีวิจัย: </strong>
            <span>
              ดัชนีชี้วัด HRI (Stress, Comfort, Trust, Utility) เป็นคะแนนที่ประเมินเชิงประจักษ์ (Empirical &amp; Inferred Evaluation) ตามกรอบมาตรฐานสากล Godspeed Questionnaire Series และ Technology Acceptance Model (TAM) จากเอกสารวิจัยที่ตีพิมพ์ ไม่ใช่การวินิจฉัยทางการแพทย์ (Non-diagnostic Context)
            </span>
          </div>
        </div>
      </div>

      {/* Empirical HRI Casebook Section */}
      {cases && cases.length > 0 && (
        <section style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                <BookOpen size={18} style={{ color: "var(--accent)" }} />
                <span>{isThai ? "สมุดกรณีศึกษาเชิงประจักษ์ (Empirical HRI Casebook)" : "Empirical HRI Casebook"}</span>
              </h3>
              <p className="muted" style={{ margin: "2px 0 0 0", fontSize: "12px" }}>
                {isThai
                  ? "กรณีศึกษาการใช้งานจริงทางคลินิกและบริบทสุขภาวะที่ได้รับการรับรองในไทย"
                  : "Verified clinical deployments and field case studies in Thailand"}
              </p>
            </div>
            <span className="badge ok" style={{ fontWeight: 600 }}>
              {cases.length} {isThai ? "กรณีศึกษาที่ผ่านการอนุมัติ" : "approved cases"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cases.map((c) => (
              <article
                key={c.id}
                className="card flex flex-col h-full justify-between"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  background: "var(--surface)"
                }}
              >
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "8px", minWidth: 0 }}>
                    <span className="badge ok whitespace-nowrap shrink-0" style={{ fontSize: "11px", fontWeight: 600 }}>{c.scenarioContext}</span>
                    <span className="muted truncate" style={{ fontSize: "11px", maxWidth: "150px", textAlign: "right" }} title={c.robot?.canonicalName}>
                      Robot: <strong>{c.robot?.canonicalName}</strong>
                    </span>
                  </div>

                  <h4 style={{ margin: "0 0 8px 0", fontSize: "15px", lineHeight: 1.35 }}>
                    <Link href={`/wellness/${encodeURIComponent(c.id)}`} style={{ color: "var(--text-primary)" }}>
                      {c.title}
                    </Link>
                  </h4>

                  <p className="muted" style={{ fontSize: "12px", margin: "0 0 12px 0", lineHeight: 1.45 }}>
                    {c.activityDesc.length > 135 ? c.activityDesc.slice(0, 135) + "..." : c.activityDesc}
                  </p>

                  {/* 4 Dimension Score Badges */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "12px", marginTop: "auto" }}>
                    <div style={{ background: "var(--surface-muted)", padding: "6px 8px", borderRadius: "6px", fontSize: "11px", display: "flex", justifyContent: "space-between" }}>
                      <span className="muted">{isThai ? "ลดตึงเครียด:" : "Stress:"}</span>
                      <strong style={{ color: "#0284c7" }}>{c.stressScore}/5</strong>
                    </div>
                    <div style={{ background: "var(--surface-muted)", padding: "6px 8px", borderRadius: "6px", fontSize: "11px", display: "flex", justifyContent: "space-between" }}>
                      <span className="muted">{isThai ? "ความสบายใจ:" : "Comfort:"}</span>
                      <strong style={{ color: "#e11d48" }}>{c.comfortScore}/5</strong>
                    </div>
                    <div style={{ background: "var(--surface-muted)", padding: "6px 8px", borderRadius: "6px", fontSize: "11px", display: "flex", justifyContent: "space-between" }}>
                      <span className="muted">{isThai ? "ความปลอดภัย:" : "Trust:"}</span>
                      <strong style={{ color: "#d97706" }}>{c.trustScore}/5</strong>
                    </div>
                    <div style={{ background: "var(--surface-muted)", padding: "6px 8px", borderRadius: "6px", fontSize: "11px", display: "flex", justifyContent: "space-between" }}>
                      <span className="muted">{isThai ? "ประโยชน์:" : "Utility:"}</span>
                      <strong style={{ color: "var(--accent)" }}>{c.usefulnessScore}/5</strong>
                    </div>
                  </div>
                </div>

                <div
                  className="mt-auto pt-3 border-t border-[var(--border)]"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "10px",
                    borderTop: "1px solid var(--border)",
                    marginTop: "auto"
                  }}
                >
                  <Link
                    href={`/wellness/${encodeURIComponent(c.id)}`}
                    style={{ fontSize: "12px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    <span>{isThai ? "อ่านกรณีศึกษาฉบับเต็ม" : "Read Full Case Study"}</span>
                    <ChevronRight size={13} />
                  </Link>
                  {c.evidenceUrl && (
                    <a
                      href={c.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="muted"
                      style={{ fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "2px" }}
                    >
                      <span>Evidence</span>
                      <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Robot Models Registry Heading */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", marginBottom: "4px" }}>
        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700 }}>
          {isThai ? "โมเดลหุ่นยนต์ที่ได้รับการประเมิน HRI (Robot Models)" : "Evaluated Robot Models"}
        </h3>
      </div>
      {filteredProfiles.length === 0 ? (
        <div className="empty" style={{ padding: "40px 16px", textAlign: "center" }}>
          <Bot size={36} style={{ color: "var(--text-secondary)", margin: "0 auto 8px auto" }} />
          <h3 style={{ margin: "0 0 4px 0", fontSize: "15px" }}>
            {isThai ? "ไม่พบหุ่นยนต์ที่ตรงกับเกณฑ์การค้นหา" : "No robots match the filter criteria"}
          </h3>
          <p className="muted" style={{ fontSize: "12px", maxWidth: "420px", margin: "0 auto 12px auto" }}>
            {isThai
              ? "ลองลดระดับคะแนน HRI ในแถบสไลเดอร์ หรือลบคำค้นหาเพื่อดูโมเดลหุ่นยนต์ทั้งหมด"
              : "Try lowering the minimum score thresholds or clearing the keyword search to see evaluated models."}
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="button primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
          >
            <RotateCcw size={13} />
            <span>{isThai ? "รีเซ็ตตัวกรอง" : "Reset Filters"}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProfiles.map((item) => {
            return isGeneral ? (
              /* =========================================================================
                 GENERAL / CAREGIVER MODE CARD:
                 - Simplified language
                 - Clean summary cards
                 - Reduced cognitive load
                 - Intuitive comfort & safety indicators
                 ========================================================================= */
              <article
                key={item.id}
                className="card flex flex-col h-full justify-between"
                style={{ display: "flex", flexDirection: "column", height: "100%" }}
              >
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  {/* Category Pill & Thailand Status */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "10px", minWidth: 0 }}>
                    <span className="badge ok whitespace-nowrap shrink-0" style={{ fontSize: "11px", fontWeight: 600 }}>
                      {isThai ? item.categoryLabelTh : item.categoryLabelEn}
                    </span>
                    <span
                      className="muted truncate"
                      style={{ fontSize: "11px", maxWidth: "140px", textAlign: "right" }}
                      title={item.rawRobot.developerOrg || item.rawRobot.manufacturer || "Thailand"}
                    >
                      {item.rawRobot.developerOrg || item.rawRobot.manufacturer || "Thailand"}
                    </span>
                  </div>

                  {/* Robot Title */}
                  <h2 style={{ fontSize: "16px", margin: "0 0 8px 0" }}>
                    <Link href={`/robots/${encodeURIComponent(item.id)}`} style={{ color: "var(--text-primary)" }}>
                      {item.canonicalName}
                    </Link>
                  </h2>

                  {/* Simplified Clinical Context & Caregiver Benefit */}
                  <div
                    style={{
                      background: "var(--surface-muted)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      marginBottom: "12px"
                    }}
                  >
                    <div style={{ fontSize: "12px", color: "var(--accent-strong)", fontWeight: 600, marginBottom: "4px" }}>
                      {isThai ? "บทบาทการดูแล: " : "Clinical Role: "}
                      <span style={{ fontWeight: 400, color: "var(--text-secondary)" }}>
                        {isThai ? item.clinicalContextTh : item.clinicalContextEn}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                      {isThai ? item.caregiverSummaryTh : item.caregiverSummaryEn}
                    </p>
                  </div>

                  {/* Intuitive 4 Dimension Summary Badges */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px", marginTop: "auto" }}>
                    <div style={{ background: "var(--surface-muted)", borderRadius: "6px", padding: "8px", border: "1px solid var(--border)" }}>
                      <div className="muted" style={{ fontSize: "10px" }}>{isThai ? "ความผ่อนคลาย" : "Stress Relief"}</div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#0284c7", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                        <Smile size={13} />
                        <span>{item.hriScores.stress}%</span>
                      </div>
                    </div>
                    <div style={{ background: "var(--surface-muted)", borderRadius: "6px", padding: "8px", border: "1px solid var(--border)" }}>
                      <div className="muted" style={{ fontSize: "10px" }}>{isThai ? "ความสบายใจ" : "Comfort"}</div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#e11d48", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                        <HeartHandshake size={13} />
                        <span>{item.hriScores.comfort}%</span>
                      </div>
                    </div>
                    <div style={{ background: "var(--surface-muted)", borderRadius: "6px", padding: "8px", border: "1px solid var(--border)" }}>
                      <div className="muted" style={{ fontSize: "10px" }}>{isThai ? "ความปลอดภัย" : "Safety Trust"}</div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#d97706", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                        <ShieldCheck size={13} />
                        <span>{item.hriScores.trust}%</span>
                      </div>
                    </div>
                    <div style={{ background: "var(--surface-muted)", borderRadius: "6px", padding: "8px", border: "1px solid var(--border)" }}>
                      <div className="muted" style={{ fontSize: "10px" }}>{isThai ? "ประโยชน์ใช้งาน" : "Utility"}</div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent)", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                        <CheckCircle2 size={13} />
                        <span>{item.hriScores.usefulness}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div
                  className="mt-auto pt-3 border-t border-[var(--border)]"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "10px",
                    borderTop: "1px solid var(--border)",
                    marginTop: "auto"
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedRobotForDetail(item)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--accent)",
                      fontWeight: 600,
                      fontSize: "12px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: 0
                    }}
                  >
                    <span>{isThai ? "ดูสรุปการดูแล" : "Caregiver Summary"}</span>
                    <ChevronRight size={13} />
                  </button>

                  <Link
                    href={`/robots/${encodeURIComponent(item.id)}`}
                    className="muted"
                    style={{ fontSize: "12px" }}
                  >
                    {isThai ? "โปรไฟล์รุ่น →" : "Model Profile →"}
                  </Link>
                </div>
              </article>
            ) : (
              /* =========================================================================
                 EXPERT / RESEARCHER MODE CARD:
                 - Full telemetry stats & sensor array
                 - Detailed Godspeed 5-dimension distributions
                 - RoSAS metric distributions (Warmth, Competence, Discomfort)
                 - Citation links & raw data badges
                 ========================================================================= */
              <article
                key={item.id}
                className="card flex flex-col h-full justify-between"
                style={{ display: "flex", flexDirection: "column", height: "100%" }}
              >
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  {/* Category Pill & Robot Type */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "8px", minWidth: 0 }}>
                    <span className="badge warn whitespace-nowrap shrink-0" style={{ fontSize: "10px", fontWeight: 600 }}>
                      {item.rawRobot.robotType}
                    </span>
                    <span className="muted font-mono truncate" style={{ fontSize: "11px", maxWidth: "150px", textAlign: "right" }}>
                      DOF: {item.telemetry.degreesOfFreedom ?? "N/A"} • {item.telemetry.runtimeHours}h
                    </span>
                  </div>

                  {/* Robot Canonical Name & Developer */}
                  <div style={{ marginBottom: "10px" }}>
                    <h2 style={{ fontSize: "16px", margin: "0 0 2px 0" }}>
                      <Link href={`/robots/${encodeURIComponent(item.id)}`} style={{ color: "var(--text-primary)" }}>
                        {item.canonicalName}
                      </Link>
                    </h2>
                    <span
                      className="muted truncate"
                      style={{ fontSize: "11px", display: "block", maxWidth: "100%" }}
                      title={item.rawRobot.developerOrg || item.rawRobot.manufacturer || "Institution unlisted"}
                    >
                      {item.rawRobot.developerOrg || item.rawRobot.manufacturer || "Institution unlisted"}
                    </span>
                  </div>

                  {/* Telemetry Sensor Badges */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "10px" }}>
                    {item.telemetry.sensorArray.slice(0, 3).map((sensor, idx) => (
                      <span key={idx} className="badge whitespace-nowrap shrink-0" style={{ fontSize: "10px", padding: "2px 6px" }}>
                        {sensor}
                      </span>
                    ))}
                    {item.telemetry.sensorArray.length > 3 && (
                      <span className="badge whitespace-nowrap shrink-0" style={{ fontSize: "10px", padding: "2px 6px" }}>
                        +{item.telemetry.sensorArray.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Godspeed Metric Distribution Bars */}
                  <div
                    style={{
                      background: "var(--surface-muted)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "10px",
                      marginBottom: "10px",
                      marginTop: "auto"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", fontWeight: 600, marginBottom: "6px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Gauge size={13} style={{ color: "var(--warning)" }} />
                        <span>Godspeed (1.0 - 5.0)</span>
                      </span>
                      <span style={{ fontFamily: "monospace", color: "var(--accent)" }}>
                        Avg: {(
                          (item.godspeed.anthropomorphism +
                            item.godspeed.animacy +
                            item.godspeed.likeability +
                            item.godspeed.perceivedIntelligence +
                            item.godspeed.perceivedSafety) /
                          5
                        ).toFixed(1)}
                      </span>
                    </div>

                    {/* Likeability */}
                    <div style={{ marginBottom: "4px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-secondary)", marginBottom: "2px" }}>
                        <span>Likeability</span>
                        <span style={{ fontFamily: "monospace" }}>{item.godspeed.likeability} / 5.0</span>
                      </div>
                      <div style={{ width: "100%", height: "4px", background: "rgba(0,0,0,0.08)", borderRadius: "2px", overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${(item.godspeed.likeability / 5) * 100}%`,
                            background: "var(--accent)",
                            borderRadius: "2px"
                          }}
                        />
                      </div>
                    </div>

                    {/* Perceived Intelligence */}
                    <div style={{ marginBottom: "4px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-secondary)", marginBottom: "2px" }}>
                        <span>Perceived Intel</span>
                        <span style={{ fontFamily: "monospace" }}>{item.godspeed.perceivedIntelligence} / 5.0</span>
                      </div>
                      <div style={{ width: "100%", height: "4px", background: "rgba(0,0,0,0.08)", borderRadius: "2px", overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${(item.godspeed.perceivedIntelligence / 5) * 100}%`,
                            background: "#0284c7",
                            borderRadius: "2px"
                          }}
                        />
                      </div>
                    </div>

                    {/* Perceived Safety */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-secondary)", marginBottom: "2px" }}>
                        <span>Perceived Safety</span>
                        <span style={{ fontFamily: "monospace" }}>{item.godspeed.perceivedSafety} / 5.0</span>
                      </div>
                      <div style={{ width: "100%", height: "4px", background: "rgba(0,0,0,0.08)", borderRadius: "2px", overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${(item.godspeed.perceivedSafety / 5) * 100}%`,
                            background: "#d97706",
                            borderRadius: "2px"
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* RoSAS Metrics & Safety Standard */}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", fontFamily: "monospace", color: "var(--text-secondary)", marginBottom: "6px" }}>
                    <span>
                      RoSAS Warmth: <strong style={{ color: "var(--text-primary)" }}>{item.rosas.warmth}</strong>
                    </span>
                    <span>
                      Comp: <strong style={{ color: "var(--text-primary)" }}>{item.rosas.competence}</strong>
                    </span>
                    <span>
                      Discomfort: <strong style={{ color: "var(--danger)" }}>{item.rosas.discomfort}</strong>
                    </span>
                  </div>

                  {/* Compliance badge */}
                  <div className="muted" style={{ fontSize: "10px", display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px" }}>
                    <ShieldCheck size={12} style={{ color: "var(--accent)" }} />
                    <span className="truncate" style={{ maxWidth: "220px" }}>{item.telemetry.safetyCompliance}</span>
                  </div>
                </div>

                {/* Technical Actions & Citation Link */}
                <div
                  className="mt-auto pt-3 border-t border-[var(--border)]"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "10px",
                    borderTop: "1px solid var(--border)",
                    marginTop: "auto"
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedRobotForDetail(item)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--warning)",
                      fontWeight: 600,
                      fontSize: "12px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: 0
                    }}
                  >
                    <span>Inspect Telemetry & Godspeed</span>
                    <ChevronRight size={13} />
                  </button>

                  <Link
                    href={`/robots/${encodeURIComponent(item.id)}`}
                    className="muted"
                    style={{ fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "2px" }}
                  >
                    <span>Raw Node</span>
                    <ExternalLink size={10} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Academic Methodology Disclaimer Banner (at bottom of robot cards) */}
      <div
        style={{
          marginTop: "24px",
          padding: "12px 16px",
          background: "rgba(16, 185, 129, 0.05)",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          fontSize: "12px",
          lineHeight: 1.5,
          color: "var(--text-secondary)"
        }}
      >
        <Info size={16} style={{ color: "var(--accent)", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <strong style={{ color: "var(--text-primary)" }}>หมายเหตุระเบียบวิธีวิจัย: </strong>
          <span>
            ดัชนีชี้วัด HRI (Stress, Comfort, Trust, Utility) เป็นคะแนนที่ประเมินเชิงประจักษ์ (Empirical &amp; Inferred Evaluation) ตามกรอบมาตรฐานสากล Godspeed Questionnaire Series และ Technology Acceptance Model (TAM) จากเอกสารวิจัยที่ตีพิมพ์ ไม่ใช่การวินิจฉัยทางการแพทย์ (Non-diagnostic Context)
          </span>
        </div>
      </div>

      {/* Detail Modal for Inspection */}
      {selectedRobotForDetail && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px"
          }}
          onClick={() => setSelectedRobotForDetail(null)}
        >
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              maxWidth: "680px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              maxHeight: "85vh",
              overflowY: "auto",
              padding: "24px",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "16px", borderBottom: "1px solid var(--border)", marginBottom: "16px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span className="badge ok" style={{ fontSize: "11px", fontWeight: 600 }}>
                    {isThai
                      ? selectedRobotForDetail.categoryLabelTh
                      : selectedRobotForDetail.categoryLabelEn}
                  </span>
                  <span className="muted" style={{ fontSize: "11px" }}>
                    {selectedRobotForDetail.rawRobot.developerOrg || "Developer Org"}
                  </span>
                </div>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
                  {selectedRobotForDetail.canonicalName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRobotForDetail(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                  padding: 4
                }}
                aria-label="Close detail modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Clinical Context & Summary */}
              <div style={{ background: "var(--surface-muted)", padding: "14px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <h4 style={{ margin: "0 0 6px 0", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--accent-strong)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Sparkles size={14} />
                  <span>{isThai ? "บทบาททางคลินิกและการดูแล" : "Clinical Context & Caregiver Benefit"}</span>
                </h4>
                <p style={{ margin: "0 0 8px 0", fontSize: "13px", lineHeight: 1.5, color: "var(--text-primary)" }}>
                  {isThai
                    ? selectedRobotForDetail.caregiverSummaryTh
                    : selectedRobotForDetail.caregiverSummaryEn}
                </p>
                <div className="muted" style={{ fontSize: "12px" }}>
                  <strong>{isThai ? "บริบทการใช้งาน: " : "Operational Scope: "}</strong>
                  {isThai
                    ? selectedRobotForDetail.clinicalContextTh
                    : selectedRobotForDetail.clinicalContextEn}
                </div>
              </div>

              {/* 4 HRI Dimensions Progress */}
              <div>
                <h4 className="muted" style={{ margin: "0 0 8px 0", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {isThai ? "ดัชนีชี้วัด HRI ทั้ง 4 มิติ" : "4-Dimension HRI Evaluation"}
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div style={{ background: "var(--surface-muted)", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Smile size={13} style={{ color: "#0284c7" }} />
                        <span>{isThai ? "ลดความตึงเครียด" : "Stress Relief"}</span>
                      </span>
                      <strong style={{ color: "#0284c7" }}>{selectedRobotForDetail.hriScores.stress}%</strong>
                    </div>
                    <div style={{ width: "100%", height: "4px", background: "rgba(0,0,0,0.08)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${selectedRobotForDetail.hriScores.stress}%`, background: "#0284c7", borderRadius: "2px" }} />
                    </div>
                  </div>

                  <div style={{ background: "var(--surface-muted)", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <HeartHandshake size={13} style={{ color: "#e11d48" }} />
                        <span>{isThai ? "ความสบายใจ" : "Comfort Level"}</span>
                      </span>
                      <strong style={{ color: "#e11d48" }}>{selectedRobotForDetail.hriScores.comfort}%</strong>
                    </div>
                    <div style={{ width: "100%", height: "4px", background: "rgba(0,0,0,0.08)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${selectedRobotForDetail.hriScores.comfort}%`, background: "#e11d48", borderRadius: "2px" }} />
                    </div>
                  </div>

                  <div style={{ background: "var(--surface-muted)", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <ShieldCheck size={13} style={{ color: "#d97706" }} />
                        <span>{isThai ? "ความไว้วางใจ" : "Trust & Reliability"}</span>
                      </span>
                      <strong style={{ color: "#d97706" }}>{selectedRobotForDetail.hriScores.trust}%</strong>
                    </div>
                    <div style={{ width: "100%", height: "4px", background: "rgba(0,0,0,0.08)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${selectedRobotForDetail.hriScores.trust}%`, background: "#d97706", borderRadius: "2px" }} />
                    </div>
                  </div>

                  <div style={{ background: "var(--surface-muted)", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Wrench size={13} style={{ color: "var(--accent)" }} />
                        <span>{isThai ? "ประโยชน์ใช้งาน" : "Practical Utility"}</span>
                      </span>
                      <strong style={{ color: "var(--accent)" }}>{selectedRobotForDetail.hriScores.usefulness}%</strong>
                    </div>
                    <div style={{ width: "100%", height: "4px", background: "rgba(0,0,0,0.08)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${selectedRobotForDetail.hriScores.usefulness}%`, background: "var(--accent)", borderRadius: "2px" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Expert Telemetry & Godspeed Section */}
              <div style={{ background: "var(--surface-muted)", padding: "14px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <h4 style={{ margin: 0, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--warning)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Cpu size={14} />
                    <span>{isThai ? "เทเลเมตรีเชิงเทคนิค & Godspeed Indices" : "Technical Telemetry & Godspeed Indices"}</span>
                  </h4>
                  <span className="muted" style={{ fontSize: "10px", fontFamily: "monospace" }}>
                    {selectedRobotForDetail.telemetry.safetyCompliance}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "8px", fontSize: "12px", fontFamily: "monospace", marginBottom: "12px" }}>
                  <div style={{ background: "var(--surface)", padding: "8px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                    <div className="muted" style={{ fontSize: "10px" }}>Degrees of Freedom</div>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                      {selectedRobotForDetail.telemetry.degreesOfFreedom ?? "N/A"} DOF
                    </div>
                  </div>
                  <div style={{ background: "var(--surface)", padding: "8px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                    <div className="muted" style={{ fontSize: "10px" }}>Runtime</div>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                      {selectedRobotForDetail.telemetry.runtimeHours} Hours
                    </div>
                  </div>
                  <div style={{ background: "var(--surface)", padding: "8px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                    <div className="muted" style={{ fontSize: "10px" }}>Control Frequency</div>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                      {selectedRobotForDetail.telemetry.operatingFrequencyHz ?? 50} Hz
                    </div>
                  </div>
                  <div style={{ background: "var(--surface)", padding: "8px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                    <div className="muted" style={{ fontSize: "10px" }}>Loop Latency</div>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                      {selectedRobotForDetail.telemetry.latencyMs ?? 100} ms
                    </div>
                  </div>
                </div>

                {/* Sensor Array List */}
                <div style={{ marginBottom: "10px" }}>
                  <div className="muted" style={{ fontSize: "11px", fontWeight: 600, marginBottom: "4px" }}>Sensor Payload:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {selectedRobotForDetail.telemetry.sensorArray.map((sensor, idx) => (
                      <span key={idx} className="badge" style={{ fontSize: "11px" }}>
                        {sensor}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Godspeed Breakdown */}
                <div style={{ paddingTop: "8px", borderTop: "1px solid var(--border)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "6px", fontSize: "11px" }}>
                  <div>
                    <span className="muted">Anthropomorphism: </span>
                    <strong>{selectedRobotForDetail.godspeed.anthropomorphism}</strong>
                  </div>
                  <div>
                    <span className="muted">Animacy: </span>
                    <strong>{selectedRobotForDetail.godspeed.animacy}</strong>
                  </div>
                  <div>
                    <span className="muted">Likeability: </span>
                    <strong>{selectedRobotForDetail.godspeed.likeability}</strong>
                  </div>
                  <div>
                    <span className="muted">Perceived Intel: </span>
                    <strong>{selectedRobotForDetail.godspeed.perceivedIntelligence}</strong>
                  </div>
                  <div>
                    <span className="muted">Perceived Safety: </span>
                    <strong>{selectedRobotForDetail.godspeed.perceivedSafety}</strong>
                  </div>
                  <div>
                    <span className="muted">RoSAS Discomfort: </span>
                    <strong style={{ color: "var(--danger)" }}>{selectedRobotForDetail.rosas.discomfort}</strong>
                  </div>
                </div>
              </div>

              {/* Research Citations */}
              {selectedRobotForDetail.citations.length > 0 && (
                <div style={{ background: "var(--surface-muted)", padding: "14px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <h4 className="muted" style={{ margin: "0 0 8px 0", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <BookOpen size={14} />
                    <span>{isThai ? "เอกสารอ้างอิงและงานวิจัยที่เกี่ยวข้อง" : "Research Citations & Publications"}</span>
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {selectedRobotForDetail.citations.map((cite, idx) => (
                      <li key={idx} style={{ fontSize: "12px", lineHeight: 1.4 }}>
                        <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{cite.title}</span> —{" "}
                        <span className="muted">{cite.source} ({cite.year})</span>
                        {cite.url && (
                          <a
                            href={cite.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ marginLeft: "8px", display: "inline-flex", alignItems: "center", gap: "2px", fontSize: "11px" }}
                          >
                            <span>Link</span>
                            <ExternalLink size={10} />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", marginTop: "16px", borderTop: "1px solid var(--border)" }}>
              <Link
                href={`/robots/${encodeURIComponent(selectedRobotForDetail.id)}`}
                className="button primary"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
              >
                <span>{isThai ? "ดูหน้ารุ่นหุ่นยนต์ฉบับเต็ม" : "Open Full Model Registry Page"}</span>
                <ChevronRight size={13} />
              </Link>
              <button
                type="button"
                onClick={() => setSelectedRobotForDetail(null)}
                className="button"
                style={{ fontSize: "12px" }}
              >
                {isThai ? "ปิดหน้าต่าง" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Case Modal */}
      <SubmitCaseModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        robots={robots.map((r) => ({ id: r.id, canonicalName: r.canonicalName }))}
        currentLang={currentLang}
      />
    </div>
  );
}
