import { Share2, CalendarX, Clock } from "lucide-react";

const shareNotifications = [
  {
    name: "조하나 부모님",
    reason: "MIT 성분 포함 제품 공유 필요",
    time: "10분 전",
  },
  {
    name: "강하준 부모님",
    reason: "향료 알레르기 주의 제품 공유",
    time: "1시간 전",
  },
  {
    name: "박민준 부모님",
    reason: "접촉성 주의 성분 제품 공유",
    time: "3시간 전",
  },
  {
    name: "윤서연 부모님",
    reason: "MIT 성분 포함 제품 공유",
    time: "9시간 전",
  },
];

const expiryProducts = [
  { name: "베이비 로션", expiry: "2025.05.31 만료", dDay: "D-6", urgent: true },
  { name: "키즈 선크림", expiry: "2025.06.05 만료", dDay: "D-11", urgent: true },
  { name: "올리브 샴푸", expiry: "2025.06.08 만료", dDay: "D-14", urgent: false },
];

export function NotificationPanel() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      {/* Share Notifications */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Share2 size={16} color="#2A66F7" strokeWidth={2.5} />
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D23", margin: 0, flex: 1 }}>
            보호자 공유 필요
          </h3>
          <span
            style={{
              backgroundColor: "#2A66F7",
              color: "#FFFFFF",
              borderRadius: "20px",
              padding: "1px 8px",
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            4
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {shareNotifications.map((notif, idx) => (
            <div
              key={idx}
              style={{
                padding: "10px 10px",
                borderRadius: "10px",
                backgroundColor: idx === 0 ? "#F0F5FF" : "#FAFAFA",
                border: idx === 0 ? "1px solid #C3D4FD" : "1px solid transparent",
                marginBottom: idx < shareNotifications.length - 1 ? "4px" : "0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#1A1D23" }}>{notif.name}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "10px", color: "#6B7280" }}>
                  <Clock size={10} />
                  {notif.time}
                </span>
              </div>
              <p style={{ fontSize: "11px", color: "#6B7280", margin: 0, lineHeight: "1.4" }}>{notif.reason}</p>
            </div>
          ))}
        </div>
        <button
          style={{
            width: "100%",
            marginTop: "12px",
            padding: "9px",
            borderRadius: "9px",
            border: "none",
            backgroundColor: "#2A66F7",
            color: "#FFFFFF",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "Pretendard, sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
          }}
        >
          <Share2 size={12} />
          전체 공유하기
        </button>
      </div>

      {/* Expiry Products */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <CalendarX size={16} color="#C9A800" strokeWidth={2.5} />
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D23", margin: 0, flex: 1 }}>
            유효기간 임박 제품
          </h3>
          <span
            style={{
              backgroundColor: "#FFF8CC",
              color: "#C9A800",
              borderRadius: "20px",
              padding: "1px 8px",
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            3
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {expiryProducts.map((product, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderRadius: "10px",
                backgroundColor: "#FAFAFA",
                border: "1px solid #E4E6EA",
              }}
            >
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#1A1D23", marginBottom: "2px" }}>
                  {product.name}
                </div>
                <div style={{ fontSize: "10px", color: "#6B7280" }}>{product.expiry}</div>
              </div>
              <span
                style={{
                  backgroundColor: product.urgent ? "#FFF8CC" : "#FFF8CC",
                  color: "#C9A800",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "20px",
                  whiteSpace: "nowrap",
                  border: "1px solid #F5E88A",
                }}
              >
                {product.dDay}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
