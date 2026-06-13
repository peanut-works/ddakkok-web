import { Users, ScanLine, AlertTriangle, XCircle } from "lucide-react";

const cards = [
  {
    icon: Users,
    iconColor: "#2A66F7",
    iconBg: "#EBF1FF",
    label: "등록 아동",
    value: "28명",
    diff: "+2명",
    diffPositive: true,
    diffLabel: "전일 대비",
  },
  {
    icon: ScanLine,
    iconColor: "#2A66F7",
    iconBg: "#EBF1FF",
    label: "오늘 분석 제품",
    value: "18개",
    diff: "+6개",
    diffPositive: true,
    diffLabel: "전일 대비",
  },
  {
    icon: AlertTriangle,
    iconColor: "#C9A800",
    iconBg: "#FFF8CC",
    label: "주의 필요",
    value: "7개",
    diff: "-1개",
    diffPositive: false,
    diffLabel: "전일 대비",
  },
  {
    icon: XCircle,
    iconColor: "#FF6B6B",
    iconBg: "#FFF0F0",
    label: "사용 보류",
    value: "2개",
    diff: "±0",
    diffPositive: null,
    diffLabel: "전일 대비",
  },
];

export function SummaryCards() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
        marginBottom: "24px",
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <span style={{ fontSize: "13px", color: "#6B7280", fontWeight: 500 }}>{card.label}</span>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "10px",
                  backgroundColor: card.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={17} color={card.iconColor} strokeWidth={2.5} />
              </div>
            </div>
            <div style={{ fontSize: "26px", fontWeight: 700, color: "#1A1D23", lineHeight: "1.1", marginBottom: "6px" }}>
              {card.value}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color:
                    card.diffPositive === true
                      ? "#2A66F7"
                      : card.diffPositive === false
                      ? "#FF6B6B"
                      : "#6B7280",
                }}
              >
                {card.diff}
              </span>
              <span style={{ fontSize: "12px", color: "#6B7280" }}>{card.diffLabel}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
