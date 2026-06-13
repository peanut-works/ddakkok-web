import { CheckCircle2, AlertTriangle, XCircle, ChevronRight } from "lucide-react";

const safeChildren = [
  { name: "김서준", age: 5 },
  { name: "이지은", age: 4 },
  { name: "박민준", age: 5 },
  { name: "최서연", age: 3 },
  { name: "정도윤", age: 4 },
];

const warnChildren = [
  { name: "이유나", age: 4, reason: "피부 자극 성분 주의" },
  { name: "강하준", age: 5, reason: "향료 알레르기 주의" },
  { name: "한서연", age: 3, reason: "접촉성 주의 성분" },
  { name: "오지호", age: 4, reason: "피부 민감 주의" },
  { name: "송민재", age: 5, reason: "향료 알레르기 주의" },
];

const failChildren = [
  { name: "조하나", age: 4, reason: "MIT 성분 포함" },
  { name: "임도현", age: 5, reason: "CMIT/MIT 포함" },
];

function ColumnHeader({
  icon,
  label,
  count,
  accentColor,
  accentBg,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  accentColor: string;
  accentBg: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 16px",
        borderRadius: "10px",
        backgroundColor: accentBg,
        marginBottom: "12px",
      }}
    >
      {icon}
      <span style={{ fontSize: "14px", fontWeight: 700, color: accentColor, flex: 1 }}>{label}</span>
      <span
        style={{
          backgroundColor: accentColor,
          color: "#FFFFFF",
          borderRadius: "20px",
          padding: "1px 9px",
          fontSize: "12px",
          fontWeight: 700,
        }}
      >
        {count}명
      </span>
    </div>
  );
}

export function KanbanBoard() {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "24px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.04)",
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1A1D23", margin: 0 }}>
          아동별 안전 판정 현황
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 10px",
            borderRadius: "8px",
            backgroundColor: "#F5F6FA",
            border: "1.5px solid #E4E6EA",
          }}
        >
          <span style={{ fontSize: "12px", color: "#3D4350", fontWeight: 500 }}>
            분석 제품: 퓨어 물티슈 캡형 (100매)
          </span>
        </div>
        <button
          style={{
            padding: "5px 12px",
            borderRadius: "8px",
            border: "1.5px solid #2A66F7",
            backgroundColor: "#FFFFFF",
            color: "#2A66F7",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          다른 제품 선택
        </button>
      </div>

      {/* 3 Columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        {/* Safe */}
        <div>
          <ColumnHeader
            icon={<CheckCircle2 size={16} color="#2A66F7" strokeWidth={2.5} />}
            label="안전"
            count={18}
            accentColor="#2A66F7"
            accentBg="#EBF1FF"
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {safeChildren.map((child) => (
              <div
                key={child.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid #E4E6EA",
                  backgroundColor: "#FAFAFA",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: "#EBF1FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#2A66F7",
                    }}
                  >
                    {child.name[0]}
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1D23" }}>{child.name}</span>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#6B7280",
                    backgroundColor: "#ECECEC",
                    padding: "2px 7px",
                    borderRadius: "6px",
                    fontWeight: 500,
                  }}
                >
                  {child.age}세
                </span>
              </div>
            ))}
            <button
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                padding: "8px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "transparent",
                color: "#2A66F7",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Pretendard, sans-serif",
              }}
            >
              전체 18명 보기 <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Warn */}
        <div>
          <ColumnHeader
            icon={<AlertTriangle size={16} color="#C9A800" strokeWidth={2.5} />}
            label="주의 필요"
            count={7}
            accentColor="#C9A800"
            accentBg="#FFF8CC"
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {warnChildren.map((child) => (
              <div
                key={child.name}
                style={{
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid #F5E88A",
                  backgroundColor: "#FFFEF0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor: "#FFF8CC",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#C9A800",
                      }}
                    >
                      {child.name[0]}
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1D23" }}>{child.name}</span>
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#6B7280",
                      backgroundColor: "#ECECEC",
                      padding: "2px 7px",
                      borderRadius: "6px",
                      fontWeight: 500,
                    }}
                  >
                    {child.age}세
                  </span>
                </div>
                <span style={{ fontSize: "11px", color: "#C9A800", fontWeight: 500, paddingLeft: "36px" }}>
                  {child.reason}
                </span>
              </div>
            ))}
            <button
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                padding: "8px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "transparent",
                color: "#C9A800",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Pretendard, sans-serif",
              }}
            >
              전체 7명 보기 <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Fail */}
        <div>
          <ColumnHeader
            icon={<XCircle size={16} color="#FF6B6B" strokeWidth={2.5} />}
            label="사용 보류"
            count={2}
            accentColor="#FF6B6B"
            accentBg="#FFF0F0"
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {failChildren.map((child) => (
              <div
                key={child.name}
                style={{
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid #FFCACA",
                  backgroundColor: "#FFF8F8",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor: "#FFF0F0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#FF6B6B",
                      }}
                    >
                      {child.name[0]}
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1D23" }}>{child.name}</span>
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#6B7280",
                      backgroundColor: "#ECECEC",
                      padding: "2px 7px",
                      borderRadius: "6px",
                      fontWeight: 500,
                    }}
                  >
                    {child.age}세
                  </span>
                </div>
                <span style={{ fontSize: "11px", color: "#FF6B6B", fontWeight: 500, paddingLeft: "36px" }}>
                  {child.reason}
                </span>
              </div>
            ))}
            <button
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                padding: "8px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "transparent",
                color: "#FF6B6B",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Pretendard, sans-serif",
              }}
            >
              전체 2명 보기 <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
