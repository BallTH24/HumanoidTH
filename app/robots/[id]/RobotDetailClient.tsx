"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  Cpu,
  HeartHandshake,
  ShieldCheck,
  Smile,
  Wrench,
  BookOpen,
  Layers,
  ChevronRight,
  ExternalLink,
  Code2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useUserMode } from "@/components/providers/UserModeProvider";
import ModeToggle from "@/components/navigation/ModeToggle";
import { RobotHRIProfile } from "@/lib/hri-evaluation";

interface RobotModelWithRelations {
  id: string;
  canonicalName: string;
  manufacturer: string | null;
  developerOrg: string | null;
  countryOfOrigin: string | null;
  robotType: string;
  embodimentLevel: string | null;
  primaryUseCase: string | null;
  thailandStatus: string;
  statusConfidence: number;
  officialUrl: string | null;
  description: string | null;
  sourceMeta: unknown;
  firstSeenYear: number | null;
  lastVerifiedAt: Date | null;
  contributions: Array<{
    id: string;
    title: string;
    contributionType: string;
    sourceUrl: string | null;
  }>;
  inventory: Array<{
    id: string;
    displayName: string;
    ownershipStatus: string;
  }>;
}

interface RobotDetailClientProps {
  robot: RobotModelWithRelations;
  profile: RobotHRIProfile;
  currentLang: "en" | "th";
}

export default function RobotDetailClient({
  robot,
  profile,
  currentLang
}: RobotDetailClientProps) {
  const { mode, isExpert, isGeneral } = useUserMode();
  const [showRawJson, setShowRawJson] = useState(false);
  const isThai = currentLang === "th";

  return (
    <div className="robot-detail-page space-y-6">
      {/* Back button and header navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/robots"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e241c] border border-[#1a4433] text-xs font-medium text-[#8da69a] hover:text-white hover:bg-[#15382b] transition-all"
          >
            <ArrowLeft size={14} />
            <span>{isThai ? "กลับสู่คลังหุ่นยนต์" : "Back to Registry"}</span>
          </Link>
          <Link
            href="/wellness"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e241c] border border-[#1a4433] text-xs font-medium text-[#8da69a] hover:text-white hover:bg-[#15382b] transition-all"
          >
            <HeartHandshake size={14} className="text-emerald-400" />
            <span>{isThai ? "ศูนย์สำรวจ HRI" : "Wellness & HRI"}</span>
          </Link>
        </div>

        {/* Mode Toggle Switch */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#7d998d]">
            {isThai ? "โหมดแสดงผล:" : "View Mode:"}
          </span>
          <ModeToggle />
        </div>
      </div>

      {/* Main Banner Header */}
      <div
        className={`p-6 rounded-xl border transition-all ${
          isExpert
            ? "bg-gradient-to-r from-[#17140c] via-[#1f1b11] to-[#14120a] border-[#42371e]"
            : "bg-gradient-to-r from-[#0b1d16] via-[#102a20] to-[#0c1e17] border-[#1f4e3c]"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                  isExpert
                    ? "bg-amber-950/80 text-amber-300 border border-amber-800"
                    : "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                }`}
              >
                {isThai ? profile.categoryLabelTh : profile.categoryLabelEn}
              </span>
              <span className="px-2 py-0.5 rounded text-xs bg-[#142e22] text-[#86efac] border border-[#23533e]">
                {robot.thailandStatus}
              </span>
              {isExpert && (
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-[#241f12] text-[#d4b97a] border border-[#42371e]">
                  Confidence: {(robot.statusConfidence * 100).toFixed(0)}%
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#eef7f2] tracking-tight">
              {robot.canonicalName}
            </h1>
            <p className="text-sm text-[#8ca89c] mt-1">
              <strong>{robot.developerOrg || robot.manufacturer || "Developer organization"}</strong>
              {robot.countryOfOrigin && ` • Origin: ${robot.countryOfOrigin}`}
            </p>
          </div>

          {robot.officialUrl && (
            <a
              href={robot.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#184433] border border-[#2d7355] text-xs font-semibold text-emerald-300 hover:bg-[#205741] transition-all self-start md:self-auto"
            >
              <span>{isThai ? "เยี่ยมชมแหล่งข้อมูลทางการ" : "Official Source"}</span>
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      {/* Conditionally Rendered Views: General (Caregiver) vs Expert (Researcher) */}
      {isGeneral ? (
        /* =========================================================================
           GENERAL / CAREGIVER VIEW:
           - Simplified descriptions
           - High-level care tips
           - Intuitive ratings
           - Reduced technical noise
           ========================================================================= */
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-[#0b1a15] border border-[#16382b] rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#eef7f2] mb-3 flex items-center gap-2">
              <Smile size={18} className="text-emerald-400" />
              {isThai ? "บทบาทและความช่วยเหลือในการดูแล" : "Caregiver & Patient Role Overview"}
            </h2>
            <p className="text-sm text-[#c9ded4] leading-relaxed mb-4">
              {isThai ? profile.caregiverSummaryTh : profile.caregiverSummaryEn}
            </p>
            <div className="p-4 rounded-lg bg-[#07130f] border border-[#132c22] text-xs text-[#9bb8ab]">
              <strong className="text-emerald-400">
                {isThai ? "บริบทการใช้งานทางคลินิก: " : "Clinical Deployment Context: "}
              </strong>
              {isThai ? profile.clinicalContextTh : profile.clinicalContextEn}
            </div>
          </div>

          {/* 4 HRI Dimensions Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0b1a15] border border-[#16382b] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-sky-400 font-semibold text-sm">
                <Smile size={18} />
                <span>{isThai ? "ลดความตึงเครียด" : "Stress Relief"}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {profile.hriScores.stress}%
              </div>
              <p className="text-xs text-[#7b988c]">
                {isThai
                  ? "ระดับความผ่อนคลายและลดความกังวลของผู้ป่วย"
                  : "Patient relaxation and anxiety reduction rating"}
              </p>
            </div>

            <div className="bg-[#0b1a15] border border-[#16382b] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-rose-400 font-semibold text-sm">
                <HeartHandshake size={18} />
                <span>{isThai ? "ความสบายใจ" : "Comfort Level"}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {profile.hriScores.comfort}%
              </div>
              <p className="text-xs text-[#7b988c]">
                {isThai
                  ? "ความสบายใจเมื่ออยู่ใกล้และมีปฏิสัมพันธ์"
                  : "Psychological comfort and ease of proximity"}
              </p>
            </div>

            <div className="bg-[#0b1a15] border border-[#16382b] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-amber-400 font-semibold text-sm">
                <ShieldCheck size={18} />
                <span>{isThai ? "ความไว้วางใจ" : "Trust & Safety"}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {profile.hriScores.trust}%
              </div>
              <p className="text-xs text-[#7b988c]">
                {isThai
                  ? "ความมั่นใจในการทำงานที่ปลอดภัยและเชื่อถือได้"
                  : "Confidence in collision prevention and safety"}
              </p>
            </div>

            <div className="bg-[#0b1a15] border border-[#16382b] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-emerald-400 font-semibold text-sm">
                <CheckCircle2 size={18} />
                <span>{isThai ? "ประโยชน์ใช้งาน" : "Practical Utility"}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {profile.hriScores.usefulness}%
              </div>
              <p className="text-xs text-[#7b988c]">
                {isThai
                  ? "ความมีประโยชน์ต่อกิจวัตรประจำวันและการดูแล"
                  : "Daily operational efficacy and workflow support"}
              </p>
            </div>
          </div>

          {/* Operational Highlights */}
          <div className="bg-[#0b1a15] border border-[#16382b] rounded-xl p-6">
            <h3 className="text-base font-bold text-[#eef7f2] mb-3">
              {isThai ? "คำแนะนำการปฏิบัติงานสำหรับผู้ดูแล" : "Caregiver Operational Highlights"}
            </h3>
            <ul className="space-y-2.5 text-xs text-[#c3d9cf]">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  {isThai
                    ? "ผ่านการตรวจสอบมาตรฐานความปลอดภัยสำหรับหุ่นยนต์ดูแลส่วนบุคคล (ISO 13482)"
                    : `Safety compliant under ${profile.telemetry.safetyCompliance}`}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  {isThai
                    ? `ระยะเวลาปฏิบัติการต่อเนื่อง ${profile.telemetry.runtimeHours} ชั่วโมงต่อรอบชาร์จ`
                    : `Estimated battery operational shift: ${profile.telemetry.runtimeHours} hours continuous`}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  {isThai
                    ? "รองรับการสั่งงานด้วยเสียงและระบบสัมผัสที่เข้าใจง่าย ไม่ต้องการทักษะไอทีระดับสูง"
                    : "Designed for minimal caregiver training with intuitive touch and voice guidance"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        /* =========================================================================
           EXPERT / RESEARCHER VIEW:
           - Full telemetry stats
           - Godspeed 5-dimension radar distributions
           - RoSAS metrics breakdown
           - Scientific citations
           - Raw data badges & JSON Inspector
           ========================================================================= */
        <div className="space-y-6">
          {/* Telemetry Instrumentation Grid */}
          <div className="bg-[#0b1a15] border border-[#3b3523] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#f2e9dc] flex items-center gap-2">
                <Cpu size={18} className="text-amber-400" />
                <span>Hardware & Sensor Telemetry Specifications</span>
              </h2>
              <span className="px-2.5 py-1 rounded text-xs font-mono bg-[#211c12] text-[#d4b97a] border border-[#42371e]">
                {profile.telemetry.safetyCompliance}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs mb-4">
              <div className="p-3 rounded-lg bg-[#07130e] border border-[#2b271a]">
                <div className="text-[10px] text-[#8e8574]">Degrees of Freedom</div>
                <div className="text-base font-bold text-white">
                  {profile.telemetry.degreesOfFreedom ?? "Unspecified"} DOF
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#07130e] border border-[#2b271a]">
                <div className="text-[10px] text-[#8e8574]">Battery Shift</div>
                <div className="text-base font-bold text-white">
                  {profile.telemetry.runtimeHours} Hours
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#07130e] border border-[#2b271a]">
                <div className="text-[10px] text-[#8e8574]">Sampling Rate</div>
                <div className="text-base font-bold text-white">
                  {profile.telemetry.operatingFrequencyHz ?? 50} Hz
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#07130e] border border-[#2b271a]">
                <div className="text-[10px] text-[#8e8574]">Control Latency</div>
                <div className="text-base font-bold text-white">
                  {profile.telemetry.latencyMs ?? 100} ms
                </div>
              </div>
            </div>

            {/* Sensor Array Badges */}
            <div>
              <div className="text-xs font-semibold text-[#a59163] uppercase tracking-wider mb-2">
                Integrated Sensor Array:
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.telemetry.sensorArray.map((sensor, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-md text-xs bg-[#191610] text-[#e8dac0] border border-[#3d321d]"
                  >
                    {sensor}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Godspeed & RoSAS Metric Distributions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Godspeed Indices */}
            <div className="bg-[#0b1a15] border border-[#3b3523] rounded-xl p-6">
              <h3 className="text-base font-bold text-[#f2e9dc] mb-4 flex items-center justify-between">
                <span>Godspeed Metric Distributions</span>
                <span className="text-xs font-mono text-amber-400">Scale: 1.0 - 5.0</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#a59163]">Anthropomorphism (Humanlikeness)</span>
                    <span className="font-mono text-white">{profile.godspeed.anthropomorphism} / 5.0</span>
                  </div>
                  <div className="w-full h-2 bg-[#17140e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(profile.godspeed.anthropomorphism / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#a59163]">Animacy (Lifelikeness)</span>
                    <span className="font-mono text-white">{profile.godspeed.animacy} / 5.0</span>
                  </div>
                  <div className="w-full h-2 bg-[#17140e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full"
                      style={{ width: `${(profile.godspeed.animacy / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#a59163]">Likeability (Impression)</span>
                    <span className="font-mono text-white">{profile.godspeed.likeability} / 5.0</span>
                  </div>
                  <div className="w-full h-2 bg-[#17140e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500 rounded-full"
                      style={{ width: `${(profile.godspeed.likeability / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#a59163]">Perceived Intelligence</span>
                    <span className="font-mono text-white">{profile.godspeed.perceivedIntelligence} / 5.0</span>
                  </div>
                  <div className="w-full h-2 bg-[#17140e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${(profile.godspeed.perceivedIntelligence / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#a59163]">Perceived Safety</span>
                    <span className="font-mono text-white">{profile.godspeed.perceivedSafety} / 5.0</span>
                  </div>
                  <div className="w-full h-2 bg-[#17140e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${(profile.godspeed.perceivedSafety / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RoSAS Metrics */}
            <div className="bg-[#0b1a15] border border-[#3b3523] rounded-xl p-6">
              <h3 className="text-base font-bold text-[#f2e9dc] mb-4 flex items-center justify-between">
                <span>RoSAS Social Attribute Scale</span>
                <span className="text-xs font-mono text-amber-400">Scale: 1.0 - 5.0</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-lg bg-[#07130e] border border-[#2b271a]">
                  <div className="flex justify-between mb-1">
                    <span className="text-[#a59163] font-semibold">Warmth (Emotional Resonance)</span>
                    <span className="font-mono text-emerald-400 font-bold">{profile.rosas.warmth} / 5.0</span>
                  </div>
                  <p className="text-[11px] text-[#8e8574]">
                    Perceived compassion, gentle voice pitch, and approachable physical contours.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#07130e] border border-[#2b271a]">
                  <div className="flex justify-between mb-1">
                    <span className="text-[#a59163] font-semibold">Competence (Task Efficacy)</span>
                    <span className="font-mono text-sky-400 font-bold">{profile.rosas.competence} / 5.0</span>
                  </div>
                  <p className="text-[11px] text-[#8e8574]">
                    Navigation precision, obstacle avoidance speed, and instruction following fidelity.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#07130e] border border-[#2b271a]">
                  <div className="flex justify-between mb-1">
                    <span className="text-[#a59163] font-semibold">Discomfort (Uncanny Valley)</span>
                    <span className="font-mono text-rose-400 font-bold">{profile.rosas.discomfort} / 5.0</span>
                  </div>
                  <p className="text-[11px] text-[#8e8574]">
                    Negative eerie perception. Values below 2.0 indicate high social comfort.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Citations & Scientific Source Links */}
          {profile.citations.length > 0 && (
            <div className="bg-[#0b1a15] border border-[#3b3523] rounded-xl p-6">
              <h3 className="text-base font-bold text-[#f2e9dc] mb-3 flex items-center gap-2">
                <BookOpen size={18} className="text-amber-400" />
                <span>Peer-Reviewed Publications & Field Trials</span>
              </h3>
              <div className="space-y-3">
                {profile.citations.map((cite, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#07130e] border border-[#2b271a] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">{cite.title}</div>
                      <div className="text-[11px] text-[#8e8574]">
                        {cite.source} • Year {cite.year}
                      </div>
                    </div>
                    {cite.url && (
                      <a
                        href={cite.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline shrink-0"
                      >
                        <span>View Publication</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Metadata Inspector */}
          <div className="bg-[#0b1a15] border border-[#3b3523] rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-[#f2e9dc] flex items-center gap-2">
                <Code2 size={18} className="text-amber-400" />
                <span>Raw Database Entity & Telemetry Payload</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowRawJson(!showRawJson)}
                className="text-xs font-mono text-amber-400 hover:text-amber-300"
              >
                {showRawJson ? "[Hide JSON Inspector]" : "[Inspect Raw JSON]"}
              </button>
            </div>

            {showRawJson && (
              <pre className="p-4 rounded-lg bg-[#06110c] border border-[#2b271a] text-xs font-mono text-[#a5d6a7] overflow-x-auto max-h-96">
                {JSON.stringify(
                  {
                    id: robot.id,
                    canonicalName: robot.canonicalName,
                    robotType: robot.robotType,
                    thailandStatus: robot.thailandStatus,
                    statusConfidence: robot.statusConfidence,
                    developerOrg: robot.developerOrg,
                    sourceMeta: robot.sourceMeta,
                    hriProfile: profile
                  },
                  null,
                  2
                )}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
