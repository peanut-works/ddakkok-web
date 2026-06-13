import {
  LayoutDashboard,
  Users,
  ScanLine,
  ShieldCheck,
  Share2,
  FileText,
  Settings,
  MessageCircle,
  Phone,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";

const menuItems = [
  { icon: LayoutDashboard, label: "대시보드", path: "/", badge: null },
  { icon: Users, label: "아동 관리", path: "/children", badge: null },
  { icon: ScanLine, label: "제품 분석", path: "/products", badge: null },
  { icon: ShieldCheck, label: "안전 결과", path: "/safety", badge: null },
  { icon: Share2, label: "보호자 공유", path: "/sharing", badge: 4 },
  { icon: FileText, label: "기록·리포트", path: "/records", badge: null },
  { icon: Settings, label: "설정", path: "/settings", badge: null },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      style={{
        width: "260px",
        minWidth: "260px",
        backgroundColor: "#FFFFFF",
        borderRight: "1px solid #E4E6EA",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #E4E6EA" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2A66F7 0%, #1A50D4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={20} color="#FFFFFF" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: "20px", fontWeight: 700, color: "#1A1D23", letterSpacing: "-0.3px" }}>
            딱콕
          </span>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  backgroundColor: isActive ? "#EBF1FF" : "transparent",
                  color: isActive ? "#2A66F7" : "#3D4350",
                  fontFamily: "Pretendard, sans-serif",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 400,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F5F6FA";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} color={isActive ? "#2A66F7" : "#6B7280"} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge !== null && (
                  <span
                    style={{
                      backgroundColor: "#2A66F7",
                      color: "#FFFFFF",
                      borderRadius: "10px",
                      padding: "1px 7px",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <div style={{ padding: "16px 16px 20px", borderTop: "1px solid #E4E6EA" }}>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "100%",
            padding: "10px 12px",
            borderRadius: "10px",
            border: "1.5px solid #E4E6EA",
            backgroundColor: "#FFFFFF",
            color: "#3D4350",
            fontFamily: "Pretendard, sans-serif",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            marginBottom: "10px",
          }}
        >
          <MessageCircle size={16} color="#6B7280" />
          문의하기
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "0 4px" }}>
          <Phone size={13} color="#6B7280" />
          <span style={{ fontSize: "12px", color: "#6B7280" }}>고객센터 1644-1234</span>
        </div>
      </div>
    </aside>
  );
}
