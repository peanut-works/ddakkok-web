import { useState } from "react";
import { Plus, Search, X, ChevronRight, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

const CHILDREN = [
  { id: 1, name: "김서준", age: 5, class: "햇님반", teacher: "이담임", allergies: [], skin: "정상", note: "없음", lastCheck: "05.16", initial: "김" },
  { id: 2, name: "이지은", age: 4, class: "햇님반", teacher: "이담임", allergies: ["우유", "계란"], skin: "민감", note: "없음", lastCheck: "05.16", initial: "이" },
  { id: 3, name: "박민준", age: 5, class: "별님반", teacher: "김선생", allergies: ["땅콩"], skin: "정상", note: "없음", lastCheck: "05.15", initial: "박" },
  { id: 4, name: "최서연", age: 3, class: "별님반", teacher: "김선생", allergies: ["우유"], skin: "아토피", note: "보습제 도포 필요", lastCheck: "05.14", initial: "최" },
  { id: 5, name: "정도윤", age: 4, class: "햇님반", teacher: "이담임", allergies: [], skin: "정상", note: "없음", lastCheck: "05.16", initial: "정" },
  { id: 6, name: "이유나", age: 4, class: "별님반", teacher: "김선생", allergies: ["계란", "밀"], skin: "민감", note: "없음", lastCheck: "05.13", initial: "이" },
  { id: 7, name: "강하준", age: 5, class: "햇님반", teacher: "이담임", allergies: ["향료"], skin: "정상", note: "없음", lastCheck: "05.16", initial: "강" },
  { id: 8, name: "조하나", age: 4, class: "별님반", teacher: "김선생", allergies: ["우유", "땅콩"], skin: "아토피", note: "보습제 도포, MIT 제품 금지", lastCheck: "05.16", initial: "조" },
];

const SKIN_COLORS: Record<string, { text: string; bg: string }> = {
  정상: { text: "#6B7280", bg: "#ECECEC" },
  민감: { text: "#C9A800", bg: "#FFF8CC" },
  아토피: { text: "#FF6B6B", bg: "#FFF0F0" },
};

const PRODUCT_HISTORY = [
  { product: "퓨어 물티슈 캡형 (100매)", status: "safe", date: "2025.05.16" },
  { product: "베이비 로션 (300ml)", status: "warn", date: "2025.05.14" },
  { product: "키즈 샴푸 (500ml)", status: "safe", date: "2025.05.12" },
];

const statusBadge = (s: string) => {
  if (s === "safe") return { label: "안전", color: "#2A66F7", bg: "#EBF1FF", Icon: CheckCircle2 };
  if (s === "warn") return { label: "주의", color: "#C9A800", bg: "#FFF8CC", Icon: AlertTriangle };
  return { label: "보류", color: "#FF6B6B", bg: "#FFF0F0", Icon: XCircle };
};

export function ChildrenPage() {
  const [classFilter, setClassFilter] = useState("전체");
  const [allergyFilter, setAllergyFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof CHILDREN[0] | null>(null);
  const [activeTab, setActiveTab] = useState("건강 프로필");

  const filtered = CHILDREN.filter((c) => {
    if (classFilter !== "전체" && c.class !== classFilter) return false;
    if (allergyFilter !== "전체" && !c.allergies.includes(allergyFilter)) return false;
    if (search && !c.name.includes(search)) return false;
    return true;
  });

  const avatarBg = ["#EBF1FF", "#FFF8CC", "#FFF0F0", "#E8F5E9", "#F3E5F5", "#E0F2F1", "#FFF3E0", "#FCE4EC"];

  return (
    <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#FAFAFA", fontFamily: "Pretendard, sans-serif" }}>
      <div style={{ padding: "28px" }}>
        {/* Page Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1A1D23", margin: 0 }}>아동 관리</h1>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: "4px 0 0" }}>등록된 아동의 건강 프로필을 관리하세요.</p>
          </div>
          <button
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "10px 18px", borderRadius: "10px", border: "none",
              backgroundColor: "#2A66F7", color: "#FFFFFF",
              fontSize: "14px", fontWeight: 600, cursor: "pointer",
              fontFamily: "Pretendard, sans-serif",
            }}
          >
            <Plus size={16} />
            아동 등록
          </button>
        </div>

        {/* Filter Bar */}
        <div
          style={{
            backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "16px 20px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: "20px",
            display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: "6px" }}>
            {["전체", "햇님반", "별님반"].map((c) => (
              <button
                key={c}
                onClick={() => setClassFilter(c)}
                style={{
                  padding: "5px 12px", borderRadius: "20px", border: "1.5px solid",
                  borderColor: classFilter === c ? "#2A66F7" : "#E4E6EA",
                  backgroundColor: classFilter === c ? "#EBF1FF" : "#FFFFFF",
                  color: classFilter === c ? "#2A66F7" : "#6B7280",
                  fontSize: "12px", fontWeight: 600, cursor: "pointer",
                  fontFamily: "Pretendard, sans-serif",
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <div style={{ width: "1px", height: "24px", backgroundColor: "#E4E6EA" }} />
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {["전체", "우유", "계란", "땅콩", "밀", "기타"].map((a) => (
              <button
                key={a}
                onClick={() => setAllergyFilter(a)}
                style={{
                  padding: "4px 10px", borderRadius: "20px", border: "1.5px solid",
                  borderColor: allergyFilter === a ? "#FF6B6B" : "#E4E6EA",
                  backgroundColor: allergyFilter === a ? "#FFF0F0" : "#FFFFFF",
                  color: allergyFilter === a ? "#FF6B6B" : "#6B7280",
                  fontSize: "11px", fontWeight: 600, cursor: "pointer",
                  fontFamily: "Pretendard, sans-serif",
                }}
              >
                {a}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", border: "1.5px solid #E4E6EA", borderRadius: "9px", padding: "7px 12px" }}>
            <Search size={14} color="#6B7280" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="아동 이름 검색"
              style={{ border: "none", outline: "none", backgroundColor: "transparent", fontSize: "13px", color: "#3D4350", fontFamily: "Pretendard, sans-serif", width: "100%" }}
            />
          </div>
          <span style={{ fontSize: "13px", color: "#6B7280", whiteSpace: "nowrap" }}>총 <strong style={{ color: "#1A1D23" }}>{filtered.length}명</strong></span>
        </div>

        {/* Card Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          {filtered.map((child, idx) => (
            <div
              key={child.id}
              style={{
                backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "18px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)", cursor: "pointer",
                border: selected?.id === child.id ? "2px solid #2A66F7" : "1.5px solid transparent",
                transition: "box-shadow 0.15s",
              }}
              onClick={() => { setSelected(child); setActiveTab("건강 프로필"); }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div
                  style={{
                    width: "48px", height: "48px", borderRadius: "50%",
                    backgroundColor: avatarBg[idx % avatarBg.length],
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px", fontWeight: 700, color: "#1A1D23", flexShrink: 0,
                  }}
                >
                  {child.initial}
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#1A1D23" }}>{child.name}</div>
                  <div style={{ fontSize: "12px", color: "#6B7280" }}>{child.age}세</div>
                </div>
              </div>
              <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "10px" }}>
                {child.class} · 담임: {child.teacher}
              </div>
              <div style={{ borderTop: "1px solid #F0F0F4", paddingTop: "10px", marginBottom: "10px" }}>
                {child.allergies.length === 0 ? (
                  <span style={{ fontSize: "11px", color: "#6B7280" }}>알레르기 없음</span>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {child.allergies.map((a) => (
                      <span
                        key={a}
                        style={{
                          backgroundColor: "#FFF0F0", color: "#FF6B6B",
                          fontSize: "11px", fontWeight: 700, padding: "2px 8px",
                          borderRadius: "20px",
                        }}
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ borderTop: "1px solid #F0F0F4", paddingTop: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", color: "#6B7280" }}>피부 상태</span>
                  <span
                    style={{
                      fontSize: "11px", fontWeight: 700,
                      color: SKIN_COLORS[child.skin].text,
                      backgroundColor: SKIN_COLORS[child.skin].bg,
                      padding: "2px 8px", borderRadius: "20px",
                    }}
                  >
                    {child.skin}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", color: "#6B7280" }}>마지막 검사</span>
                  <button
                    style={{
                      display: "flex", alignItems: "center", gap: "2px",
                      fontSize: "12px", color: "#2A66F7", fontWeight: 600,
                      border: "none", backgroundColor: "transparent", cursor: "pointer",
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    {child.lastCheck} <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Panel Backdrop */}
      {selected && (
        <>
          <div
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.2)", zIndex: 40 }}
            onClick={() => setSelected(null)}
          />
          <div
            style={{
              position: "fixed", top: 0, right: 0, width: "440px", height: "100vh",
              backgroundColor: "#FFFFFF", zIndex: 50, display: "flex", flexDirection: "column",
              boxShadow: "-4px 0 24px rgba(0,0,0,0.12)", overflowY: "auto",
              fontFamily: "Pretendard, sans-serif",
            }}
          >
            {/* Panel Header */}
            <div style={{ padding: "24px 24px 0" }}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
                <button
                  onClick={() => setSelected(null)}
                  style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1.5px solid #E4E6EA", backgroundColor: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <X size={16} color="#6B7280" />
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "64px", height: "64px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #2A66F7, #1A50D4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "24px", fontWeight: 700, color: "#FFFFFF", flexShrink: 0,
                  }}
                >
                  {selected.initial}
                </div>
                <div>
                  <div style={{ fontSize: "22px", fontWeight: 700, color: "#1A1D23" }}>{selected.name}</div>
                  <div style={{ fontSize: "13px", color: "#6B7280", marginTop: "2px" }}>
                    {selected.age}세 · {selected.class}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6B7280" }}>담임: {selected.teacher} · 최근 수정 2025.05.16</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "4px", borderBottom: "2px solid #E4E6EA" }}>
                {["기본 정보", "건강 프로필", "검사 이력", "보호자 연락처"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "8px 14px", border: "none", cursor: "pointer",
                      backgroundColor: "transparent",
                      color: activeTab === tab ? "#2A66F7" : "#6B7280",
                      fontSize: "13px", fontWeight: activeTab === tab ? 700 : 500,
                      borderBottom: activeTab === tab ? "2px solid #2A66F7" : "2px solid transparent",
                      marginBottom: "-2px", fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div style={{ padding: "20px 24px", flex: 1 }}>
              {activeTab === "기본 정보" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[
                    { label: "이름", value: selected.name },
                    { label: "나이", value: `${selected.age}세` },
                    { label: "소속 반", value: selected.class },
                    { label: "담임 교사", value: selected.teacher },
                    { label: "특이사항", value: selected.note },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "flex", gap: "12px" }}>
                      <span style={{ fontSize: "13px", color: "#6B7280", minWidth: "80px" }}>{row.label}</span>
                      <span style={{ fontSize: "13px", color: "#1A1D23", fontWeight: 500 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "건강 프로필" && (
                <div>
                  <div style={{ marginBottom: "20px" }}>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D23", margin: "0 0 10px" }}>알레르기</h4>
                    {selected.allergies.length === 0 ? (
                      <span style={{ fontSize: "13px", color: "#6B7280" }}>등록된 알레르기가 없습니다.</span>
                    ) : (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {selected.allergies.map((a) => (
                          <span
                            key={a}
                            style={{
                              backgroundColor: "#FFF0F0", color: "#FF6B6B",
                              fontSize: "12px", fontWeight: 700, padding: "4px 12px",
                              borderRadius: "20px", border: "1px solid #FFCACA",
                            }}
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D23", margin: "0 0 10px" }}>피부 상태</h4>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {["정상", "민감", "아토피"].map((s) => (
                        <div
                          key={s}
                          style={{
                            padding: "6px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
                            backgroundColor: selected.skin === s ? SKIN_COLORS[s].bg : "#F5F6FA",
                            color: selected.skin === s ? SKIN_COLORS[s].text : "#6B7280",
                            border: `1.5px solid ${selected.skin === s ? SKIN_COLORS[s].bg : "#E4E6EA"}`,
                          }}
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D23", margin: "0 0 10px" }}>기타 특이사항</h4>
                    <div style={{ padding: "12px 14px", backgroundColor: "#FAFAFA", borderRadius: "10px", border: "1.5px solid #E4E6EA" }}>
                      <span style={{ fontSize: "13px", color: "#3D4350" }}>{selected.note}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "검사 이력" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D23", margin: "0 0 8px" }}>최근 제품 검사 이력</h4>
                  {PRODUCT_HISTORY.map((h, i) => {
                    const b = statusBadge(h.status);
                    const Icon = b.Icon;
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #E4E6EA", backgroundColor: "#FAFAFA",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: b.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon size={15} color={b.color} strokeWidth={2.5} />
                          </div>
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: 600, color: "#1A1D23" }}>{h.product}</div>
                            <div style={{ fontSize: "11px", color: "#6B7280" }}>{h.date}</div>
                          </div>
                        </div>
                        <span style={{ backgroundColor: b.bg, color: b.color, fontSize: "11px", fontWeight: 700, padding: "3px 9px", borderRadius: "20px" }}>
                          {b.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === "보호자 연락처" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[
                    { label: "보호자명", value: `${selected.name.charAt(0)}○○ 보호자` },
                    { label: "연락처", value: "010-XXXX-XXXX" },
                    { label: "관계", value: "부모" },
                    { label: "이메일", value: "parent@example.com" },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "flex", gap: "12px", padding: "12px 14px", backgroundColor: "#FAFAFA", borderRadius: "10px", border: "1.5px solid #E4E6EA" }}>
                      <span style={{ fontSize: "13px", color: "#6B7280", minWidth: "80px" }}>{row.label}</span>
                      <span style={{ fontSize: "13px", color: "#1A1D23", fontWeight: 500 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
