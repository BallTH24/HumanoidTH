"use client";

import React, { useState } from "react";
import { X, Send, AlertCircle, CheckCircle2, Sliders, Shield, Heart, Smile, Wrench } from "lucide-react";

interface RobotOption {
  id: string;
  canonicalName: string;
}

interface SubmitCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  robots: RobotOption[];
  currentLang?: "en" | "th";
  onSuccess?: (id: string) => void;
}

const SCENARIOS = [
  { id: "Elderly Care", labelTh: "การดูแลผู้สูงอายุ (Elderly Care)", labelEn: "Elderly Care" },
  { id: "Physical Rehabilitation", labelTh: "เวชศาสตร์ฟื้นฟู (Physical Rehabilitation)", labelEn: "Physical Rehabilitation" },
  { id: "Hospital Concierge", labelTh: "ห้องรอตรวจ/บริการ (Hospital Concierge)", labelEn: "Hospital Concierge" },
  { id: "Social/Education", labelTh: "การศึกษาและการมีส่วนร่วม (Social/Education)", labelEn: "Social/Education" }
];

export default function SubmitCaseModal({
  isOpen,
  onClose,
  robots,
  currentLang = "th",
  onSuccess
}: SubmitCaseModalProps) {
  const isThai = currentLang === "th";

  const [title, setTitle] = useState("");
  const [robotId, setRobotId] = useState(robots[0]?.id || "");
  const [scenarioContext, setScenarioContext] = useState("Elderly Care");
  const [activityDesc, setActivityDesc] = useState("");
  const [stressScore, setStressScore] = useState(3);
  const [comfortScore, setComfortScore] = useState(4);
  const [trustScore, setTrustScore] = useState(4);
  const [usefulnessScore, setUsefulnessScore] = useState(4);
  const [caveats, setCaveats] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload = {
        title: title.trim(),
        robotId,
        scenarioContext,
        activityDesc: activityDesc.trim(),
        stressScore: Number(stressScore),
        comfortScore: Number(comfortScore),
        trustScore: Number(trustScore),
        usefulnessScore: Number(usefulnessScore),
        caveats: caveats.trim() || null,
        evidenceUrl: evidenceUrl.trim(),
        submittedBy: submittedBy.trim() || null
      };

      const res = await fetch("/api/wellness/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit case study.");
      }

      const msg = isThai
        ? "บันทึกสำเร็จ (Status: PENDING - รอผู้ตรวจอนุมัติในหน้า Admin)"
        : "Submission successful (Status: PENDING - Awaiting Admin approval in Admin Console)";
      setSuccessMessage(msg);

      if (onSuccess && data.id) {
        onSuccess(data.id);
      }

      // Reset form after a brief delay
      setTimeout(() => {
        setTitle("");
        setActivityDesc("");
        setCaveats("");
        setEvidenceUrl("");
        setSubmittedBy("");
        setSuccessMessage(null);
        onClose();
      }, 2400);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px"
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          maxWidth: "640px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "24px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            paddingBottom: "14px",
            borderBottom: "1px solid var(--border)",
            marginBottom: "16px"
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>
              {isThai ? "เสนอผลกรณีศึกษาปฏิสัมพันธ์หุ่นยนต์ (Submit HRI Case)" : "Submit HRI Case Study"}
            </h2>
            <p className="muted" style={{ margin: "4px 0 0 0", fontSize: "12px" }}>
              {isThai
                ? "บันทึกผลการศึกษาเชิงประจักษ์และการใช้งานจริงในบริบทสุขภาวะของไทย"
                : "Submit empirical interaction observations and clinical case studies in Thailand"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
              padding: "4px"
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div
            style={{
              background: "#fff1f0",
              border: "1px solid #ffa39e",
              borderRadius: "8px",
              padding: "10px 14px",
              marginBottom: "14px",
              color: "var(--danger)",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            style={{
              background: "#f6ffed",
              border: "1px solid #b7eb8f",
              borderRadius: "8px",
              padding: "12px 14px",
              marginBottom: "14px",
              color: "var(--accent-strong)",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <CheckCircle2 size={18} style={{ color: "var(--accent)" }} />
            <strong>{successMessage}</strong>
          </div>
        )}

        {/* Submission Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Title */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
              {isThai ? "ชื่อกรณีศึกษา (Title) *" : "Case Study Title *"}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                isThai
                  ? "เช่น การใช้งาน Dinsaw Mini เสริมการบริบาลผู้สูงอายุในศูนย์ดูแลกลางวัน"
                  : "e.g. Dinsaw Mini Deployment in Bangkok Elderly Day-Care Center"
              }
              style={{ width: "100%" }}
            />
          </div>

          {/* Robot Selector & Scenario Context */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                {isThai ? "โมเดลหุ่นยนต์ (Robot Model) *" : "Robot Model *"}
              </label>
              <select
                required
                value={robotId}
                onChange={(e) => setRobotId(e.target.value)}
                style={{ width: "100%" }}
              >
                {robots.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.canonicalName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                {isThai ? "บริบทสถานการณ์ (Scenario) *" : "Scenario Context *"}
              </label>
              <select
                required
                value={scenarioContext}
                onChange={(e) => setScenarioContext(e.target.value)}
                style={{ width: "100%" }}
              >
                {SCENARIOS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {isThai ? s.labelTh : s.labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Activity Description */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
              {isThai ? "รายละเอียดกิจกรรมและการปฏิสัมพันธ์ (Activity Description) *" : "Activity & Interaction Description *"}
            </label>
            <textarea
              required
              rows={3}
              value={activityDesc}
              onChange={(e) => setActivityDesc(e.target.value)}
              placeholder={
                isThai
                  ? "อธิบายกระบวนการใช้งาน บทบาทของหุ่นยนต์ วิธีการมีปฏิสัมพันธ์กับผู้ป่วยหรือผู้ดูแล..."
                  : "Describe the interaction protocol, patient/caregiver engagement, and deployment setup..."
              }
              style={{ width: "100%", resize: "vertical" }}
            />
          </div>

          {/* 4 Dimension HRI Sliders (1-5) */}
          <div
            style={{
              background: "var(--surface-muted)",
              padding: "12px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border)"
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Sliders size={14} style={{ color: "var(--accent)" }} />
              <span>{isThai ? "คะแนนการประเมิน 4 มิติ HRI (สเกล 1 - 5)" : "4-Dimension HRI Evaluation (Scale 1 - 5)"}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {/* Stress Score */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "3px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Smile size={12} style={{ color: "#0284c7" }} />
                    <span>{isThai ? "ความเครียด/ความตื่นกลัว" : "Stress Level"}</span>
                  </span>
                  <strong style={{ color: "#0284c7" }}>{stressScore} / 5</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={stressScore}
                  onChange={(e) => setStressScore(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#0284c7" }}
                />
              </div>

              {/* Comfort Score */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "3px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Heart size={12} style={{ color: "#e11d48" }} />
                    <span>{isThai ? "ความสบายใจ" : "Comfort"}</span>
                  </span>
                  <strong style={{ color: "#e11d48" }}>{comfortScore} / 5</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={comfortScore}
                  onChange={(e) => setComfortScore(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#e11d48" }}
                />
              </div>

              {/* Trust Score */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "3px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Shield size={12} style={{ color: "#d97706" }} />
                    <span>{isThai ? "ความไว้วางใจ & ปลอดภัย" : "Trust & Safety"}</span>
                  </span>
                  <strong style={{ color: "#d97706" }}>{trustScore} / 5</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={trustScore}
                  onChange={(e) => setTrustScore(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#d97706" }}
                />
              </div>

              {/* Usefulness Score */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "3px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Wrench size={12} style={{ color: "var(--accent)" }} />
                    <span>{isThai ? "ประโยชน์ใช้งานจริง" : "Usefulness"}</span>
                  </span>
                  <strong style={{ color: "var(--accent)" }}>{usefulnessScore} / 5</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={usefulnessScore}
                  onChange={(e) => setUsefulnessScore(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--accent)" }}
                />
              </div>
            </div>
          </div>

          {/* Caveats */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
              {isThai ? "ข้อจำกัดและข้อควรระวัง (Caveats / Limitations)" : "Caveats & Operational Limitations"}
            </label>
            <input
              type="text"
              value={caveats}
              onChange={(e) => setCaveats(e.target.value)}
              placeholder={
                isThai
                  ? "เช่น ต้องมี Wi-Fi ความเร็วสูง, ไม่เหมาะกับผู้ป่วยที่มีภาวะเกร็งรุนแรง"
                  : "e.g. Requires stable Wi-Fi; not suitable for patients with severe spasticity"
              }
              style={{ width: "100%" }}
            />
          </div>

          {/* Evidence URL & Submitter */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                {isThai ? "ลิงก์หลักฐานหรือรายงานวิจัย (Evidence URL) *" : "Evidence or Citation URL *"}
              </label>
              <input
                type="url"
                required
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://..."
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                {isThai ? "ชื่อผู้ส่งข้อมูล (Submitted By)" : "Submitted By"}
              </label>
              <input
                type="text"
                value={submittedBy}
                onChange={(e) => setSubmittedBy(e.target.value)}
                placeholder={isThai ? "หน่วยงาน / คณะผู้วิจัย" : "Research team / Institution"}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "10px",
              paddingTop: "14px",
              borderTop: "1px solid var(--border)",
              marginTop: "4px"
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="button"
              style={{ fontSize: "13px" }}
            >
              {isThai ? "ยกเลิก" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="button primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px"
              }}
            >
              <Send size={14} />
              <span>
                {isSubmitting
                  ? isThai
                    ? "กำลังส่งข้อมูล..."
                    : "Submitting..."
                  : isThai
                    ? "ส่งกรณีศึกษา (Submit Case)"
                    : "Submit Case Study"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
