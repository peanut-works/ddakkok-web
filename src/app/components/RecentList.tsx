import { CheckCircle2, AlertTriangle, XCircle, ChevronRight } from "lucide-react";

const records = [
  {
    name: "퓨어 물티슈 캡형 (100매)",
    status: "safe" as const,
    time: "10:32",
    isToday: true,
  },
  {
    name: "키즈 샴푸 (500ml)",
    status: "warn" as const,
    time: "09:41",
    isToday: true,
  },
  {
    name: "베이비 로션 (300ml)",
    status: "safe" as const,
    time: "09:12",
    isToday: true,
  },
  {
    name: "유아용 세탁세제 (1L)",
    status: "fail" as const,
    time: "어제 16:21",
    isToday: false,
  },
];

const statusConfig = {
  safe: {
    icon: CheckCircle2,
    color: "#2A66F7",
    bg: "#EBF1FF",
    label: "안전",
  },
  warn: {
    icon: AlertTriangle,
    color: "#C9A800",
    bg: "#FFF8CC",
    label: "주의 필요",
  },
  fail: {
    icon: XCircle,
    color: "#FF6B6B",
    bg: "#FFF0F0",
    label: "사용 보류",
  },
};

export function RecentList() {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.04)",
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1A1D23", margin: 0 }}>
          최근 분석 기록
        </h3>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "3px",
            border: "none",
            backgroundColor: "transparent",
            color: "#2A66F7",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          전체 보기 <ChevronRight size={14} />
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {records.map((record, idx) => {
          const cfg = statusConfig[record.status];
          const Icon = cfg.icon;
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: idx < records.length - 1 ? "1px solid #F0F0F4" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    backgroundColor: cfg.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={17} color={cfg.color} strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#1A1D23", marginBottom: "2px" }}>
                    {record.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6B7280" }}>{record.time}</div>
                </div>
              </div>
              <span
                style={{
                  backgroundColor: cfg.bg,
                  color: cfg.color,
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "20px",
                  whiteSpace: "nowrap",
                }}
              >
                {cfg.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
