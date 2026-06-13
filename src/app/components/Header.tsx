import { Search, Bell, ChevronDown } from "lucide-react";

export function Header() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: "28px",
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      {/* Left: Greeting */}
      <div>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#1A1D23",
            margin: 0,
            lineHeight: "1.4",
          }}
        >
          안녕하세요, 햇살어린이집 관리자님! 👋
        </h1>
        <p style={{ fontSize: "13px", color: "#6B7280", margin: "4px 0 0", lineHeight: "1.5" }}>
          오늘도 아이들이 안전한 환경을 만들어주세요.
        </p>
      </div>

      {/* Right: Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "2px" }}>
        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#FFFFFF",
            border: "1.5px solid #E4E6EA",
            borderRadius: "10px",
            padding: "8px 14px",
            width: "240px",
          }}
        >
          <Search size={15} color="#6B7280" strokeWidth={2} />
          <input
            placeholder="아동, 제품, 바코드, 보고서 검색"
            style={{
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              fontSize: "13px",
              color: "#3D4350",
              fontFamily: "Pretendard, sans-serif",
              width: "100%",
            }}
          />
        </div>

        {/* Bell */}
        <div style={{ position: "relative" }}>
          <button
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              border: "1.5px solid #E4E6EA",
              backgroundColor: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Bell size={17} color="#3D4350" />
          </button>
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              backgroundColor: "#FF6B6B",
              color: "#FFFFFF",
              borderRadius: "10px",
              padding: "1px 5px",
              fontSize: "10px",
              fontWeight: 700,
              lineHeight: "1.4",
              fontFamily: "Pretendard, sans-serif",
            }}
          >
            3
          </span>
        </div>

        {/* Date */}
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "10px",
            border: "1.5px solid #E4E6EA",
            backgroundColor: "#FFFFFF",
            fontSize: "13px",
            color: "#6B7280",
            fontFamily: "Pretendard, sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          2025-05-16 금
        </div>

        {/* Profile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 10px 6px 6px",
            borderRadius: "10px",
            border: "1.5px solid #E4E6EA",
            backgroundColor: "#FFFFFF",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2A66F7 0%, #1A50D4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "Pretendard, sans-serif",
              flexShrink: 0,
            }}
          >
            김
          </div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#1A1D23", lineHeight: "1.3" }}>
              김관리 관리자
            </div>
            <div style={{ fontSize: "11px", color: "#6B7280", lineHeight: "1.3" }}>
              햇살어린이집
            </div>
          </div>
          <ChevronDown size={14} color="#6B7280" />
        </div>
      </div>
    </div>
  );
}
