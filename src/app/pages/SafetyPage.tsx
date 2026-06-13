import { useState } from "react";
import { FileDown, FileText, ChevronRight, AlertTriangle, XCircle } from "lucide-react";

const CHILDREN_NAMES = ["김서준(5)", "이지은(4)", "박민준(5)", "최서연(3)", "정도윤(4)", "이유나(4)", "강하준(5)", "조하나(4)"];
const PRODUCTS_SHORT = ["물티슈", "키즈샴푸", "베이비로션", "선크림", "세탁세제"];

type CellStatus = "safe" | "warn" | "fail" | "none";
const MATRIX: CellStatus[][] = [
  ["safe", "safe", "safe", "safe", "safe"],
  ["warn", "safe", "warn", "safe", "safe"],
  ["safe", "safe", "safe", "safe", "none"],
  ["warn", "none", "warn", "none", "safe"],
  ["safe", "safe", "safe", "safe", "safe"],
  ["warn", "none", "warn", "none", "safe"],
  ["warn", "warn", "safe", "none", "none"],
  ["fail", "warn", "fail", "warn", "fail"],
];

const PERIOD_TABS = ["오늘", "이번주", "이번달"];

const RECORDS = [
  { date: "2025.05.16 10:32", child: "김서준", product: "물티슈", teacher: "이담임", status: "safe" as const },
  { date: "2025.05.16 09:41", child: "이지은", product: "키즈샴푸", teacher: "이담임", status: "warn" as const },
  { date: "2025.05.16 09:12", child: "조하나", product: "세탁세제", teacher: "김선생", status: "fail" as const },
  { date: "2025.05.15 16:21", child: "강하준", product: "키즈샴푸", teacher: "이담임", status: "warn" as const },
  { date: "2025.05.15 14:33", child: "이유나", product: "베이비로션", teacher: "김선생", status: "warn" as const },
  { date: "2025.05.14 11:05", child: "최서연", product: "선크림", teacher: "김선생", status: "safe" as const },
];

const STATUS_MAP = {
  safe:  { color: "#2A66F7", bg: "#EBF1FF", label: "안전", dot: "●" },
  warn:  { color: "#C9A800", bg: "#FFF8CC", label: "주의", dot: "▲" },
  fail:  { color: "#FF6B6B", bg: "#FFF0F0", label: "보류", dot: "✕" },
  none:  { color: "#ECECEC", bg: "#F5F5F5", label: "미검사", dot: "○" },
};

function StatusDot({ status, tooltip }: { status: CellStatus; tooltip: string }) {
  const [show, setShow] = useState(false);
  const cfg = STATUS_MAP[status];
  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div
        style={{
          width: "28px", height: "28px", borderRadius: "8px",
          backgroundColor: cfg.bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: "12px", color: cfg.color, fontWeight: 700,
        }}
      >
        {cfg.dot}
      </div>
      {show && (
        <div
          style={{
            position: "absolute", bottom: "calc(100% + 6px)", left: "50%",
            transform: "translateX(-50%)", backgroundColor: "#1A1D23",
            color: "#FFFFFF", fontSize: "11px", fontWeight: 500,
            padding: "5px 10px", borderRadius: "6px", whiteSpace: "nowrap",
            zIndex: 10, pointerEvents: "none",
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}

export function SafetyPage() {
  const [period, setPeriod] = useState("이번주");
  const [classFilter, setClassFilter] = useState("전체");
  const [statusFilter, setStatusFilter] = useState("전체");

  return (
    <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#FAFAFA", fontFamily: "Pretendard, sans-serif" }}>
      <div style={{ padding: "28px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1A1D23", margin: 0 }}>안전 결과</h1>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: "4px 0 0" }}>아동별 제품 안전 판정 전체 현황을 확인하세요.</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "10px", border: "1.5px solid #E4E6EA", backgroundColor: "#FFFFFF", color: "#3D4350", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>
              <FileDown size={15} color="#6B7280" /> 엑셀 내보내기
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "10px", border: "1.5px solid #E4E6EA", backgroundColor: "#FFFFFF", color: "#3D4350", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>
              <FileText size={15} color="#6B7280" /> PDF 리포트
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "14px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            {PERIOD_TABS.map((p) => (
              <button key={p} onClick={() => setPeriod(p)} style={{ padding: "5px 14px", borderRadius: "20px", border: "1.5px solid", borderColor: period === p ? "#2A66F7" : "#E4E6EA", backgroundColor: period === p ? "#EBF1FF" : "#FFFFFF", color: period === p ? "#2A66F7" : "#6B7280", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>
                {p}
              </button>
            ))}
          </div>
          <div style={{ width: "1px", height: "20px", backgroundColor: "#E4E6EA" }} />
          <div style={{ display: "flex", gap: "6px" }}>
            {["전체", "햇님반", "별님반"].map((c) => (
              <button key={c} onClick={() => setClassFilter(c)} style={{ padding: "5px 12px", borderRadius: "20px", border: "1.5px solid", borderColor: classFilter === c ? "#2A66F7" : "#E4E6EA", backgroundColor: classFilter === c ? "#EBF1FF" : "#FFFFFF", color: classFilter === c ? "#2A66F7" : "#6B7280", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>
                {c}
              </button>
            ))}
          </div>
          <div style={{ width: "1px", height: "20px", backgroundColor: "#E4E6EA" }} />
          <div style={{ display: "flex", gap: "6px" }}>
            {["전체", "주의", "보류"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: "5px 12px", borderRadius: "20px", border: "1.5px solid", borderColor: statusFilter === s ? "#2A66F7" : "#E4E6EA", backgroundColor: statusFilter === s ? "#EBF1FF" : "#FFFFFF", color: statusFilter === s ? "#2A66F7" : "#6B7280", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "총 검사 건수", value: "126건", color: "#1A1D23", bg: "#ECECEC" },
            { label: "안전", value: "84건", sub: "66.7%", color: "#2A66F7", bg: "#EBF1FF" },
            { label: "주의 필요", value: "30건", sub: "23.8%", color: "#C9A800", bg: "#FFF8CC" },
            { label: "사용 보류", value: "12건", sub: "9.5%", color: "#FF6B6B", bg: "#FFF0F0" },
          ].map((c) => (
            <div key={c.label} style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "6px" }}>{c.label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ fontSize: "24px", fontWeight: 700, color: c.color }}>{c.value}</span>
                {"sub" in c && <span style={{ fontSize: "13px", color: c.color, backgroundColor: c.bg, padding: "2px 8px", borderRadius: "6px", fontWeight: 600 }}>{c.sub}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Main 2-column */}
        <div style={{ display: "grid", gridTemplateColumns: "60% 40%", gap: "16px", marginBottom: "24px" }}>
          {/* Heatmap */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflowX: "auto" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D23", margin: "0 0 6px" }}>아동 × 제품 안전 판정 매트릭스</h3>
            <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
              {[
                { dot: "●", color: "#2A66F7", label: "안전" },
                { dot: "▲", color: "#C9A800", label: "주의" },
                { dot: "✕", color: "#FF6B6B", label: "보류" },
                { dot: "○", color: "#ECECEC", label: "미검사" },
              ].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontSize: "12px", color: l.color, fontWeight: 700 }}>{l.dot}</span>
                  <span style={{ fontSize: "11px", color: "#6B7280" }}>{l.label}</span>
                </div>
              ))}
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ padding: "8px 12px 8px 0", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#6B7280", minWidth: "80px" }}>아동</th>
                  {PRODUCTS_SHORT.map((p) => (
                    <th key={p} style={{ padding: "8px 4px", textAlign: "center", fontSize: "11px", fontWeight: 600, color: "#6B7280", minWidth: "60px" }}>{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CHILDREN_NAMES.map((name, ri) => (
                  <tr key={name} style={{ borderTop: "1px solid #F0F0F4" }}>
                    <td style={{ padding: "8px 12px 8px 0", fontSize: "12px", color: "#3D4350", fontWeight: 500 }}>{name}세</td>
                    {MATRIX[ri].map((cell, ci) => (
                      <td key={ci} style={{ padding: "6px 4px", textAlign: "center" }}>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <StatusDot status={cell} tooltip={`${name} × ${PRODUCTS_SHORT[ci]}: ${STATUS_MAP[cell].label}`} />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Alert Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <XCircle size={16} color="#FF6B6B" strokeWidth={2.5} />
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D23", margin: 0 }}>즉시 조치 필요</h3>
              </div>
              {[
                { child: "조하나", product: "세탁세제", reason: "MIT 성분 포함", status: "fail" as const },
                { child: "조하나", product: "선크림", reason: "CMIT/MIT 포함", status: "fail" as const },
              ].map((item, i) => (
                <div key={i} style={{ padding: "12px", borderRadius: "10px", border: "1.5px solid #FFCACA", backgroundColor: "#FFF8F8", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#1A1D23" }}>{item.child} × {item.product}</span>
                    <span style={{ backgroundColor: "#FFF0F0", color: "#FF6B6B", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px" }}>FAIL</span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#FF6B6B" }}>{item.reason}</span>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <AlertTriangle size={16} color="#C9A800" strokeWidth={2.5} />
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D23", margin: 0 }}>최근 7일 주요 이슈</h3>
              </div>
              {[
                { date: "05.16", child: "이지은", product: "베이비로션", status: "warn" as const },
                { date: "05.15", child: "강하준", product: "키즈샴푸", status: "warn" as const },
                { date: "05.14", child: "이유나", product: "베이비로션", status: "warn" as const },
                { date: "05.13", child: "조하나", product: "세탁세제", status: "fail" as const },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 0", borderBottom: i < 3 ? "1px solid #F0F0F4" : "none" }}>
                  <div style={{ width: "36px", textAlign: "center" }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280" }}>{item.date}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: "12px", color: "#1A1D23", fontWeight: 500 }}>{item.product}</span>
                    <span style={{ fontSize: "12px", color: "#6B7280" }}> — {item.child}</span>
                    <span style={{ marginLeft: "8px", backgroundColor: STATUS_MAP[item.status].bg, color: STATUS_MAP[item.status].color, fontSize: "10px", fontWeight: 700, padding: "1px 6px", borderRadius: "4px" }}>
                      {STATUS_MAP[item.status].label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Table */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #E4E6EA", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D23", margin: 0 }}>전체 판정 기록</h3>
            <button style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "13px", color: "#2A66F7", fontWeight: 600, border: "none", backgroundColor: "transparent", cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>
              전체 보기 <ChevronRight size={14} />
            </button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#FAFAFA", borderBottom: "1px solid #E4E6EA" }}>
                {["날짜·시간", "아동", "제품", "담임", "상태", ""].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#6B7280" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECORDS.map((r, i) => {
                const cfg = STATUS_MAP[r.status];
                return (
                  <tr key={i} style={{ borderBottom: i < RECORDS.length - 1 ? "1px solid #F0F0F4" : "none" }}>
                    <td style={{ padding: "11px 16px", fontSize: "12px", color: "#6B7280" }}>{r.date}</td>
                    <td style={{ padding: "11px 16px", fontSize: "13px", fontWeight: 600, color: "#1A1D23" }}>{r.child}</td>
                    <td style={{ padding: "11px 16px", fontSize: "12px", color: "#3D4350" }}>{r.product}</td>
                    <td style={{ padding: "11px 16px", fontSize: "12px", color: "#6B7280" }}>{r.teacher}</td>
                    <td style={{ padding: "11px 16px" }}>
                      <span style={{ backgroundColor: cfg.bg, color: cfg.color, fontSize: "11px", fontWeight: 700, padding: "3px 9px", borderRadius: "20px" }}>{cfg.label}</span>
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <button style={{ fontSize: "12px", color: "#2A66F7", fontWeight: 600, border: "none", backgroundColor: "transparent", cursor: "pointer", fontFamily: "Pretendard, sans-serif", display: "flex", alignItems: "center", gap: "2px" }}>
                        상세보기 <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
