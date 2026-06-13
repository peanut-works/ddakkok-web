import { useState } from "react";
import { ScanLine, Plus, CheckCircle2, AlertTriangle, XCircle, CalendarX, HelpCircle, X, Barcode, Share2, ChevronRight } from "lucide-react";

const PRODUCTS = [
  { id: 1, name: "퓨어 물티슈 캡형 (100매)", status: "safe", barcode: "880000001012", expiry: "2026.11.20", dday: null, lastAnalysis: "05.16", maker: "퓨어랩" },
  { id: 2, name: "키즈 샴푸 (500ml)", status: "warn", barcode: "880000001023", expiry: "2025.08.15", dday: null, lastAnalysis: "05.16", maker: "베이비케어" },
  { id: 3, name: "베이비 로션 (300ml)", status: "safe", barcode: "880000001034", expiry: "2025.05.31", dday: "D-15", lastAnalysis: "05.16", maker: "네이처베이비" },
  { id: 4, name: "올리브 샴푸 (300ml)", status: "warn", barcode: "880000001045", expiry: "2025.06.08", dday: "D-23", lastAnalysis: "05.15", maker: "그린케어" },
  { id: 5, name: "키즈 선크림 (60g)", status: "fail", barcode: "880000001056", expiry: "2025.06.05", dday: "D-20", lastAnalysis: "05.14", maker: "선케어랩" },
  { id: 6, name: "유아 세탁세제 (1L)", status: "fail", barcode: "880000001067", expiry: "2026.03.10", dday: null, lastAnalysis: "05.13", maker: "퓨어클린" },
  { id: 7, name: "유아 물비누 (250ml)", status: "expired", barcode: "880000001078", expiry: "2025.04.30", dday: "만료", lastAnalysis: "05.10", maker: "소프트베이비" },
  { id: 8, name: "베이비 파우더 (100g)", status: "unknown", barcode: "880000001089", expiry: "2026.09.15", dday: null, lastAnalysis: "05.09", maker: "스노우베이비" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  safe:    { label: "안전",       color: "#2A66F7", bg: "#EBF1FF", Icon: CheckCircle2 },
  warn:    { label: "주의 필요",  color: "#C9A800", bg: "#FFF8CC", Icon: AlertTriangle },
  fail:    { label: "사용 보류",  color: "#FF6B6B", bg: "#FFF0F0", Icon: XCircle },
  expired: { label: "유통기한 만료", color: "#8A8A8A", bg: "#ECECEC", Icon: CalendarX },
  unknown: { label: "확인 필요",  color: "#6B7280", bg: "#F5F6FA", Icon: HelpCircle },
};

const CHILD_RESULTS = [
  { name: "김서준", age: 5, status: "safe", reason: "" },
  { name: "이지은", age: 4, status: "warn", reason: "우유 알레르기 주의" },
  { name: "박민준", age: 5, status: "safe", reason: "" },
  { name: "조하나", age: 4, status: "fail", reason: "MIT 성분 포함" },
  { name: "강하준", age: 5, status: "warn", reason: "향료 알레르기 주의" },
];

const TABS = ["전체", "안전", "주의 필요", "사용 보류", "유효기간 만료", "확인 필요"];
const TAB_TO_STATUS: Record<string, string> = {
  "안전": "safe", "주의 필요": "warn", "사용 보류": "fail", "유효기간 만료": "expired", "확인 필요": "unknown",
};

const INGREDIENTS = [
  { name: "정제수", safe: true },
  { name: "글리세린", safe: true },
  { name: "판테놀", safe: true },
  { name: "메틸이소티아졸리논 (MIT)", safe: false },
  { name: "향료", safe: false },
  { name: "페녹시에탄올", safe: true },
];

export function ProductsPage() {
  const [tab, setTab] = useState("전체");
  const [checked, setChecked] = useState<number[]>([]);
  const [selected, setSelected] = useState<typeof PRODUCTS[0] | null>(null);
  const [panelTab, setPanelTab] = useState("아동별 판정");

  const filtered = tab === "전체" ? PRODUCTS : PRODUCTS.filter((p) => p.status === TAB_TO_STATUS[tab]);

  const toggleCheck = (id: number) => {
    setChecked((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#FAFAFA", fontFamily: "Pretendard, sans-serif" }}>
      <div style={{ padding: "28px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1A1D23", margin: 0 }}>제품 분석</h1>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: "4px 0 0" }}>스캔된 제품의 안전성 결과를 관리하세요.</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "9px 16px", borderRadius: "10px", border: "1.5px solid #2A66F7",
                backgroundColor: "#FFFFFF", color: "#2A66F7",
                fontSize: "13px", fontWeight: 600, cursor: "pointer",
                fontFamily: "Pretendard, sans-serif",
              }}
            >
              <ScanLine size={15} />
              바코드 스캔
            </button>
            <button
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "9px 16px", borderRadius: "10px", border: "none",
                backgroundColor: "#2A66F7", color: "#FFFFFF",
                fontSize: "13px", fontWeight: 600, cursor: "pointer",
                fontFamily: "Pretendard, sans-serif",
              }}
            >
              <Plus size={15} />
              제품 등록
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" }}>
          {[
            { label: "전체 분석 제품", value: "62개", icon: ScanLine, iconColor: "#2A66F7", iconBg: "#EBF1FF" },
            { label: "주의·보류 제품", value: "9개", icon: AlertTriangle, iconColor: "#C9A800", iconBg: "#FFF8CC" },
            { label: "유효기간 임박", value: "3개", icon: CalendarX, iconColor: "#FF6B6B", iconBg: "#FFF0F0" },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: c.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={20} color={c.iconColor} strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "2px" }}>{c.label}</div>
                  <div style={{ fontSize: "22px", fontWeight: 700, color: "#1A1D23" }}>{c.value}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "16px", borderBottom: "2px solid #E4E6EA" }}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "9px 16px", border: "none", cursor: "pointer",
                backgroundColor: "transparent", fontFamily: "Pretendard, sans-serif",
                fontSize: "13px", fontWeight: tab === t ? 700 : 500,
                color: tab === t ? "#2A66F7" : "#6B7280",
                borderBottom: tab === t ? "2px solid #2A66F7" : "2px solid transparent",
                marginBottom: "-2px",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #E4E6EA", backgroundColor: "#FAFAFA" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6B7280", width: "40px" }}></th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6B7280" }}>제품명</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6B7280", width: "120px" }}>상태</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6B7280" }}>바코드</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6B7280" }}>유효기간</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6B7280" }}>마지막 분석</th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontSize: "12px", fontWeight: 600, color: "#6B7280", width: "80px" }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, idx) => {
                const cfg = STATUS_CONFIG[product.status];
                const Icon = cfg.Icon;
                const isChecked = checked.includes(product.id);
                return (
                  <tr
                    key={product.id}
                    style={{
                      borderBottom: idx < filtered.length - 1 ? "1px solid #F0F0F4" : "none",
                      backgroundColor: isChecked ? "#F5F7FF" : "transparent",
                      cursor: "pointer",
                    }}
                    onClick={() => { setSelected(product); setPanelTab("아동별 판정"); }}
                  >
                    <td style={{ padding: "12px 16px" }} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCheck(product.id)}
                        style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#2A66F7" }}
                      />
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "9px", backgroundColor: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon size={17} color={cfg.color} strokeWidth={2.5} />
                        </div>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 600, color: "#1A1D23" }}>{product.name}</div>
                          <div style={{ fontSize: "11px", color: "#6B7280" }}>{product.maker}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ backgroundColor: cfg.bg, color: cfg.color, fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", whiteSpace: "nowrap" }}>
                        {cfg.label}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "12px", color: "#6B7280" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Barcode size={12} color="#6B7280" />
                        {product.barcode}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontSize: "12px", color: "#3D4350" }}>{product.expiry}</div>
                      {product.dday && (
                        <span style={{ backgroundColor: "#FFF8CC", color: "#C9A800", fontSize: "10px", fontWeight: 700, padding: "1px 6px", borderRadius: "4px" }}>
                          {product.dday}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "12px", color: "#6B7280" }}>{product.lastAnalysis}</td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <button
                        style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "12px", color: "#2A66F7", fontWeight: 600, border: "none", backgroundColor: "transparent", cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}
                      >
                        상세 <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bulk Action Bar */}
        {checked.length > 0 && (
          <div
            style={{
              position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
              backgroundColor: "#1A1D23", borderRadius: "12px", padding: "12px 20px",
              display: "flex", alignItems: "center", gap: "16px", zIndex: 30,
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            }}
          >
            <span style={{ fontSize: "13px", color: "#FFFFFF", fontWeight: 500, fontFamily: "Pretendard, sans-serif" }}>
              {checked.length}개 선택됨
            </span>
            <div style={{ width: "1px", height: "18px", backgroundColor: "rgba(255,255,255,0.2)" }} />
            <button style={{ fontSize: "13px", color: "#FFF8CC", fontWeight: 600, border: "none", backgroundColor: "transparent", cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>
              일괄 보류 처리
            </button>
            <button style={{ fontSize: "13px", color: "#FF6B6B", fontWeight: 600, border: "none", backgroundColor: "transparent", cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>
              일괄 삭제
            </button>
            <button onClick={() => setChecked([])} style={{ width: "24px", height: "24px", borderRadius: "6px", border: "none", backgroundColor: "rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={13} color="#FFFFFF" />
            </button>
          </div>
        )}
      </div>

      {/* Slide Panel */}
      {selected && (
        <>
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.2)", zIndex: 40 }} onClick={() => setSelected(null)} />
          <div
            style={{
              position: "fixed", top: 0, right: 0, width: "460px", height: "100vh",
              backgroundColor: "#FFFFFF", zIndex: 50, display: "flex", flexDirection: "column",
              boxShadow: "-4px 0 24px rgba(0,0,0,0.12)", overflowY: "auto",
              fontFamily: "Pretendard, sans-serif",
            }}
          >
            <div style={{ padding: "24px 24px 0" }}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
                <button onClick={() => setSelected(null)} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1.5px solid #E4E6EA", backgroundColor: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <X size={16} color="#6B7280" />
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "18px" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "12px", backgroundColor: STATUS_CONFIG[selected.status].bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {(() => { const Icon = STATUS_CONFIG[selected.status].Icon; return <Icon size={28} color={STATUS_CONFIG[selected.status].color} strokeWidth={2} />; })()}
                </div>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#1A1D23", marginBottom: "4px" }}>{selected.name}</div>
                  <div style={{ fontSize: "13px", color: "#6B7280", marginBottom: "6px" }}>{selected.maker} · {selected.barcode}</div>
                  <span style={{ backgroundColor: STATUS_CONFIG[selected.status].bg, color: STATUS_CONFIG[selected.status].color, fontSize: "12px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px" }}>
                    {STATUS_CONFIG[selected.status].label}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "4px", borderBottom: "2px solid #E4E6EA" }}>
                {["성분 분석", "아동별 판정", "검사 이력"].map((t) => (
                  <button key={t} onClick={() => setPanelTab(t)} style={{ padding: "8px 14px", border: "none", cursor: "pointer", backgroundColor: "transparent", fontFamily: "Pretendard, sans-serif", fontSize: "13px", fontWeight: panelTab === t ? 700 : 500, color: panelTab === t ? "#2A66F7" : "#6B7280", borderBottom: panelTab === t ? "2px solid #2A66F7" : "2px solid transparent", marginBottom: "-2px" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: "20px 24px" }}>
              {panelTab === "성분 분석" && (
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D23", margin: "0 0 12px" }}>주요 성분 목록</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {INGREDIENTS.map((ing, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: "10px", backgroundColor: ing.safe ? "#FAFAFA" : "#FFF0F0", border: `1.5px solid ${ing.safe ? "#E4E6EA" : "#FFCACA"}` }}>
                        <span style={{ fontSize: "13px", color: ing.safe ? "#3D4350" : "#FF6B6B", fontWeight: ing.safe ? 400 : 600 }}>{ing.name}</span>
                        {!ing.safe && <span style={{ backgroundColor: "#FF6B6B", color: "#FFFFFF", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px" }}>위험 성분</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {panelTab === "아동별 판정" && (
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D23", margin: "0 0 12px" }}>아동별 안전 판정 결과</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {CHILD_RESULTS.map((c, i) => {
                      const cfg = STATUS_CONFIG[c.status];
                      const Icon = cfg.Icon;
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #E4E6EA", backgroundColor: "#FAFAFA" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #2A66F7, #1A50D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>
                              {c.name[0]}
                            </div>
                            <div>
                              <div style={{ fontSize: "13px", fontWeight: 600, color: "#1A1D23" }}>{c.name} ({c.age}세)</div>
                              {c.reason && <div style={{ fontSize: "11px", color: cfg.color }}>{c.reason}</div>}
                            </div>
                          </div>
                          <span style={{ backgroundColor: cfg.bg, color: cfg.color, fontSize: "11px", fontWeight: 700, padding: "3px 9px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "4px" }}>
                            <Icon size={10} strokeWidth={2.5} /> {cfg.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {panelTab === "검사 이력" && (
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D23", margin: "0 0 12px" }}>검사 이력</h4>
                  {["2025.05.16 10:32", "2025.05.10 09:15", "2025.04.28 14:22"].map((date, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: i < 2 ? "1px solid #F0F0F4" : "none" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#2A66F7", flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#1A1D23" }}>{date}</div>
                        <div style={{ fontSize: "11px", color: "#6B7280" }}>담임: 이담임 · 분석 완료</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
                <button style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1.5px solid #2A66F7", backgroundColor: "#FFFFFF", color: "#2A66F7", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>
                  상세 결과 보기
                </button>
                <button style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", backgroundColor: "#2A66F7", color: "#FFFFFF", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <Share2 size={13} /> 보호자 공유
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
