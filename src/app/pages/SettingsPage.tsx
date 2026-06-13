import { useState } from "react";
import {
  Building2, Users, Bell, Database, Smartphone,
  Edit2, UserPlus, CheckCircle2, RefreshCw,
} from "lucide-react";

const SETTINGS_MENU = [
  { key: "facility", label: "시설 정보", Icon: Building2 },
  { key: "users", label: "사용자 관리", Icon: Users },
  { key: "notifications", label: "알림 설정", Icon: Bell },
  { key: "data", label: "데이터 관리", Icon: Database },
  { key: "app", label: "앱 연동 상태", Icon: Smartphone },
];

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: "44px", height: "24px", borderRadius: "12px", border: "none",
        backgroundColor: value ? "#2A66F7" : "#CBCED4", cursor: "pointer",
        position: "relative", transition: "background 0.2s", flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute", top: "3px",
          left: value ? "23px" : "3px",
          width: "18px", height: "18px", borderRadius: "50%",
          backgroundColor: "#FFFFFF", transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );
}

const USERS = [
  { name: "김관리", role: "원장", class: "전체", lastAccess: "05.16 10:32", status: "활성" },
  { name: "이담임", role: "담임 교사", class: "햇님반", lastAccess: "05.16 09:21", status: "활성" },
  { name: "박영양", role: "영양사", class: "전체", lastAccess: "05.15 14:00", status: "활성" },
  { name: "최재고", role: "재고관리", class: "전체", lastAccess: "05.14 11:45", status: "활성" },
];

const ROLE_PERMISSIONS = [
  { role: "원장", desc: "모든 기능 접근 가능", color: "#2A66F7", bg: "#EBF1FF" },
  { role: "영양사", desc: "식단 관리 + 안전 결과 읽기", color: "#C9A800", bg: "#FFF8CC" },
  { role: "재고관리", desc: "제품 분석 + 유효기간 관리", color: "#6B7280", bg: "#ECECEC" },
  { role: "담임교사", desc: "앱 전용 (웹은 읽기만)", color: "#8A8A8A", bg: "#F5F5F5" },
];

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState("facility");
  const [notifications, setNotifications] = useState({
    fail: true,
    warn: true,
    expiry: true,
    unshared: true,
    scan: false,
  });
  const [channels, setChannels] = useState({ web: true, email: true, sms: false });
  const [facilityForm, setFacilityForm] = useState({
    name: "햇살어린이집",
    code: "FACIL-001",
    director: "김관리",
    phone: "02-1234-5678",
    address: "서울시 강남구 테헤란로 123",
    classes: "햇님반, 별님반",
  });

  return (
    <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#FAFAFA", fontFamily: "Pretendard, sans-serif" }}>
      <div style={{ padding: "28px" }}>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1A1D23", margin: 0 }}>설정</h1>
          <p style={{ fontSize: "13px", color: "#6B7280", margin: "4px 0 0" }}>시설 및 계정 정보를 관리하세요.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "20px" }}>
          {/* Left nav */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", height: "fit-content" }}>
            {SETTINGS_MENU.map((item) => {
              const Icon = item.Icon;
              const isActive = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px", width: "100%",
                    padding: "10px 12px", borderRadius: "10px", border: "none", cursor: "pointer",
                    backgroundColor: isActive ? "#EBF1FF" : "transparent",
                    color: isActive ? "#2A66F7" : "#3D4350",
                    fontSize: "13px", fontWeight: isActive ? 700 : 500,
                    fontFamily: "Pretendard, sans-serif", marginBottom: "2px",
                    textAlign: "left",
                  }}
                >
                  <Icon size={16} color={isActive ? "#2A66F7" : "#6B7280"} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div>
            {/* Facility Info */}
            {activeSection === "facility" && (
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1A1D23", margin: "0 0 20px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Building2 size={18} color="#2A66F7" /> 시설 정보
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
                  {[
                    { key: "name", label: "시설명" },
                    { key: "code", label: "시설 코드" },
                    { key: "director", label: "대표 원장" },
                    { key: "phone", label: "연락처" },
                    { key: "address", label: "주소" },
                    { key: "classes", label: "등록 반" },
                  ].map((field) => (
                    <div key={field.key} style={{ gridColumn: field.key === "address" ? "1 / -1" : "auto" }}>
                      <label style={{ display: "block", fontSize: "12px", color: "#6B7280", marginBottom: "6px" }}>{field.label}</label>
                      <input
                        value={(facilityForm as any)[field.key]}
                        onChange={(e) => setFacilityForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        style={{
                          width: "100%", padding: "10px 12px", borderRadius: "9px",
                          border: "1.5px solid #E4E6EA", fontSize: "13px", color: "#1A1D23",
                          fontFamily: "Pretendard, sans-serif", outline: "none", boxSizing: "border-box",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#2A66F7")}
                        onBlur={(e) => (e.target.style.borderColor = "#E4E6EA")}
                      />
                    </div>
                  ))}
                </div>
                <button style={{ padding: "11px 28px", borderRadius: "10px", border: "none", backgroundColor: "#2A66F7", color: "#FFFFFF", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>
                  저장
                </button>
              </div>
            )}

            {/* User Management */}
            {activeSection === "users" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1A1D23", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                      <Users size={18} color="#2A66F7" /> 사용자 목록
                    </h2>
                    <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "9px", border: "none", backgroundColor: "#2A66F7", color: "#FFFFFF", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>
                      <UserPlus size={14} /> 사용자 초대
                    </button>
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#FAFAFA", borderBottom: "2px solid #E4E6EA" }}>
                        {["이름", "역할", "담당반", "최근 접속", "상태", ""].map((h) => (
                          <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#6B7280" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {USERS.map((user, i) => (
                        <tr key={i} style={{ borderBottom: i < USERS.length - 1 ? "1px solid #F0F0F4" : "none" }}>
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(135deg, #2A66F7, #1A50D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#FFFFFF" }}>
                                {user.name[0]}
                              </div>
                              <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1D23" }}>{user.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <span style={{ backgroundColor: "#EBF1FF", color: "#2A66F7", fontSize: "11px", fontWeight: 700, padding: "3px 9px", borderRadius: "20px" }}>{user.role}</span>
                          </td>
                          <td style={{ padding: "12px 14px", fontSize: "12px", color: "#6B7280" }}>{user.class}</td>
                          <td style={{ padding: "12px 14px", fontSize: "12px", color: "#6B7280" }}>{user.lastAccess}</td>
                          <td style={{ padding: "12px 14px" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#2A66F7", fontWeight: 600 }}>
                              <CheckCircle2 size={12} strokeWidth={2.5} /> {user.status}
                            </span>
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <button style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#6B7280", fontWeight: 500, border: "1.5px solid #E4E6EA", backgroundColor: "#FFFFFF", borderRadius: "7px", padding: "5px 10px", cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>
                              <Edit2 size={11} /> 편집
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D23", margin: "0 0 14px" }}>역할별 권한</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {ROLE_PERMISSIONS.map((rp) => (
                      <div key={rp.role} style={{ padding: "12px 14px", borderRadius: "10px", backgroundColor: rp.bg, border: `1.5px solid ${rp.bg}` }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: rp.color, marginBottom: "4px" }}>{rp.role}</div>
                        <div style={{ fontSize: "11px", color: "#6B7280" }}>{rp.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeSection === "notifications" && (
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1A1D23", margin: "0 0 20px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Bell size={18} color="#2A66F7" /> 알림 설정
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                  {[
                    { key: "fail" as const, label: "FAIL 판정 즉시 알림", desc: "사용 보류 제품 판정 시 즉시 알림" },
                    { key: "warn" as const, label: "WARN 판정 일간 요약", desc: "주의 제품 판정을 하루 한 번 요약" },
                    { key: "expiry" as const, label: "유효기간 D-14 전 알림", desc: "유효기간 14일 전 미리 알림" },
                    { key: "unshared" as const, label: "보호자 미공유 48시간 경고", desc: "공유 안 된 건이 48시간 초과 시" },
                    { key: "scan" as const, label: "앱 신규 스캔 알림", desc: "담임이 새 제품을 스캔할 때 알림" },
                  ].map((item, i, arr) => (
                    <div key={item.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: i < arr.length - 1 ? "1px solid #F0F0F4" : "none" }}>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#1A1D23", marginBottom: "3px" }}>{item.label}</div>
                        <div style={{ fontSize: "12px", color: "#6B7280" }}>{item.desc}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "12px", color: notifications[item.key] ? "#2A66F7" : "#6B7280", fontWeight: 600 }}>
                          {notifications[item.key] ? "ON" : "OFF"}
                        </span>
                        <Toggle value={notifications[item.key]} onChange={(v) => setNotifications((prev) => ({ ...prev, [item.key]: v }))} />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "2px solid #E4E6EA" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D23", margin: "0 0 14px" }}>알림 채널</h3>
                  <div style={{ display: "flex", gap: "16px" }}>
                    {[
                      { key: "web" as const, label: "웹 푸시" },
                      { key: "email" as const, label: "이메일" },
                      { key: "sms" as const, label: "SMS" },
                    ].map((ch) => (
                      <label key={ch.key} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", padding: "10px 16px", borderRadius: "10px", border: `1.5px solid ${channels[ch.key] ? "#2A66F7" : "#E4E6EA"}`, backgroundColor: channels[ch.key] ? "#EBF1FF" : "#FFFFFF" }}>
                        <input
                          type="checkbox"
                          checked={channels[ch.key]}
                          onChange={(e) => setChannels((prev) => ({ ...prev, [ch.key]: e.target.checked }))}
                          style={{ width: "15px", height: "15px", accentColor: "#2A66F7" }}
                        />
                        <span style={{ fontSize: "13px", fontWeight: 600, color: channels[ch.key] ? "#2A66F7" : "#6B7280" }}>{ch.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <button style={{ padding: "11px 28px", borderRadius: "10px", border: "none", backgroundColor: "#2A66F7", color: "#FFFFFF", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>
                    저장
                  </button>
                </div>
              </div>
            )}

            {/* Data Management */}
            {activeSection === "data" && (
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1A1D23", margin: "0 0 20px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Database size={18} color="#2A66F7" /> 데이터 관리
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[
                    { label: "전체 데이터 내보내기", desc: "모든 검사 기록 및 아동 정보를 Excel로 내보냅니다.", buttonLabel: "내보내기", color: "#2A66F7" },
                    { label: "데이터 백업", desc: "현재 데이터를 안전하게 백업합니다.", buttonLabel: "백업 시작", color: "#2A66F7" },
                    { label: "데이터 초기화", desc: "모든 데이터를 삭제합니다. 이 작업은 되돌릴 수 없습니다.", buttonLabel: "초기화", color: "#FF6B6B" },
                  ].map((item) => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderRadius: "12px", border: "1.5px solid #E4E6EA", backgroundColor: "#FAFAFA" }}>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#1A1D23", marginBottom: "3px" }}>{item.label}</div>
                        <div style={{ fontSize: "12px", color: "#6B7280" }}>{item.desc}</div>
                      </div>
                      <button style={{ padding: "8px 16px", borderRadius: "9px", border: `1.5px solid ${item.color}`, backgroundColor: item.color === "#FF6B6B" ? "#FFF0F0" : "#EBF1FF", color: item.color, fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif", whiteSpace: "nowrap", marginLeft: "16px" }}>
                        {item.buttonLabel}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* App Integration */}
            {activeSection === "app" && (
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1A1D23", margin: "0 0 20px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Smartphone size={18} color="#2A66F7" /> 앱 연동 상태
                </h2>
                <div
                  style={{
                    backgroundColor: "#F0FAF0", borderRadius: "16px", border: "1.5px solid #A8E6A8",
                    padding: "24px", marginBottom: "20px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#22C55E", boxShadow: "0 0 0 3px rgba(34,197,94,0.3)" }} />
                    <span style={{ fontSize: "16px", fontWeight: 700, color: "#15803D" }}>연동 정상</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    {[
                      { label: "마지막 동기화", value: "2025.05.16 10:45" },
                      { label: "앱 접속 교사", value: "2명 접속 중" },
                      { label: "오늘 수신 스캔", value: "18건 수신됨" },
                      { label: "담임 앱 버전", value: "v1.2.3" },
                    ].map((item) => (
                      <div key={item.label} style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "12px 14px" }}>
                        <div style={{ fontSize: "11px", color: "#6B7280", marginBottom: "3px" }}>{item.label}</div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D23" }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "11px 24px", borderRadius: "10px", border: "1.5px solid #2A66F7",
                    backgroundColor: "#EBF1FF", color: "#2A66F7",
                    fontSize: "13px", fontWeight: 600, cursor: "pointer",
                    fontFamily: "Pretendard, sans-serif",
                  }}
                >
                  <RefreshCw size={15} /> 강제 동기화
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
