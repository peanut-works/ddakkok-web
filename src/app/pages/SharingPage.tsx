import { useState } from "react";
import { Share2, CheckCircle2, AlertTriangle, XCircle, X, Clock, Check } from "lucide-react";

const UNSHARED = [
  { id: 1, status: "fail" as const, guardian: "조하나 부모님", child: "조하나", product: "퓨어 물티슈", reason: "MIT 성분 포함", teacher: "김선생", time: "10분 전" },
  { id: 2, status: "warn" as const, guardian: "강하준 부모님", child: "강하준", product: "키즈 샴푸", reason: "향료 알레르기 주의", teacher: "이담임", time: "1시간 전" },
  { id: 3, status: "fail" as const, guardian: "임도현 부모님", child: "임도현", product: "베이비 로션", reason: "CMIT/MIT 포함", teacher: "이담임", time: "2시간 전" },
  { id: 4, status: "warn" as const, guardian: "박민준 부모님", child: "박민준", product: "올리브 샴푸", reason: "접촉성 주의 성분", teacher: "이담임", time: "3시간 전" },
];

const SHARED = [
  { id: 5, guardian: "이지은 부모님", product: "키즈 샴푸", status: "warn" as const, sharedAt: "2025.05.16 09:41", read: true },
  { id: 6, guardian: "최서연 부모님", product: "베이비 로션", status: "warn" as const, sharedAt: "2025.05.15 15:22", read: true },
  { id: 7, guardian: "김서준 부모님", product: "물티슈", status: "safe" as const, sharedAt: "2025.05.15 11:05", read: false },
  { id: 8, guardian: "정도윤 부모님", product: "유아세제", status: "safe" as const, sharedAt: "2025.05.14 14:30", read: true },
];

const STATUS_MAP = {
  safe: { label: "안전", color: "#2A66F7", bg: "#EBF1FF", Icon: CheckCircle2 },
  warn: { label: "주의", color: "#C9A800", bg: "#FFF8CC", Icon: AlertTriangle },
  fail: { label: "보류", color: "#FF6B6B", bg: "#FFF0F0", Icon: XCircle },
};

export function SharingPage() {
  const [tab, setTab] = useState("미공유");
  const [modal, setModal] = useState<typeof UNSHARED[0] | null>(null);
  const [shared, setShared] = useState<number[]>([]);

  const handleShare = (id: number) => {
    setShared((prev) => [...prev, id]);
    setModal(null);
  };

  const unsharedRemaining = UNSHARED.filter((u) => !shared.includes(u.id));

  return (
    <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#FAFAFA", fontFamily: "Pretendard, sans-serif" }}>
      <div style={{ padding: "28px", display: "flex", gap: "20px" }}>
        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1A1D23", margin: 0 }}>보호자 공유 관리</h1>
              <p style={{ fontSize: "13px", color: "#6B7280", margin: "4px 0 0" }}>미공유 안전 결과를 보호자에게 전달하세요.</p>
            </div>
            <button
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "10px 18px", borderRadius: "10px", border: "none",
                backgroundColor: "#2A66F7", color: "#FFFFFF",
                fontSize: "13px", fontWeight: 600, cursor: "pointer",
                fontFamily: "Pretendard, sans-serif", position: "relative",
              }}
            >
              <Share2 size={15} />
              미공유 건 일괄 공유
              <span style={{ marginLeft: "4px", backgroundColor: "#FFFFFF", color: "#2A66F7", borderRadius: "20px", padding: "1px 7px", fontSize: "11px", fontWeight: 700 }}>
                {unsharedRemaining.length}
              </span>
            </button>
          </div>

          {/* Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {[
              { label: "공유 완료", value: "24건", color: "#2A66F7", bg: "#EBF1FF", Icon: CheckCircle2 },
              { label: "미공유 (주의 이상)", value: `${unsharedRemaining.length}건`, color: "#FF6B6B", bg: "#FFF0F0", Icon: XCircle },
              { label: "오늘 공유 예정", value: "7건", color: "#C9A800", bg: "#FFF8CC", Icon: Clock },
            ].map((c) => {
              const Icon = c.Icon;
              return (
                <div key={c.label} style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={20} color={c.color} strokeWidth={2.5} />
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "2px" }}>{c.label}</div>
                    <div style={{ fontSize: "22px", fontWeight: 700, color: c.label === "미공유 (주의 이상)" ? "#FF6B6B" : "#1A1D23" }}>{c.value}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "16px", borderBottom: "2px solid #E4E6EA" }}>
            {["미공유", "공유 완료", "전체 이력"].map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: "9px 18px", border: "none", cursor: "pointer", backgroundColor: "transparent", fontFamily: "Pretendard, sans-serif", fontSize: "13px", fontWeight: tab === t ? 700 : 500, color: tab === t ? "#2A66F7" : "#6B7280", borderBottom: tab === t ? "2px solid #2A66F7" : "2px solid transparent", marginBottom: "-2px" }}>
                {t}
                {t === "미공유" && unsharedRemaining.length > 0 && (
                  <span style={{ marginLeft: "6px", backgroundColor: "#FF6B6B", color: "#FFFFFF", borderRadius: "10px", padding: "1px 6px", fontSize: "10px", fontWeight: 700 }}>
                    {unsharedRemaining.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab: 미공유 */}
          {tab === "미공유" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {unsharedRemaining.length === 0 && (
                <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "40px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <CheckCircle2 size={40} color="#2A66F7" style={{ marginBottom: "12px" }} />
                  <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>모든 공유가 완료되었습니다.</p>
                </div>
              )}
              {unsharedRemaining.map((item) => {
                const cfg = STATUS_MAP[item.status];
                const Icon = cfg.Icon;
                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "18px 20px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                      border: item.status === "fail" ? "1.5px solid #FFCACA" : "1.5px solid #F5E88A",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon size={18} color={cfg.color} strokeWidth={2.5} />
                        </div>
                        <div>
                          <div style={{ fontSize: "15px", fontWeight: 700, color: "#1A1D23" }}>{item.guardian}</div>
                          <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                            <Clock size={11} />
                            {item.time} 등록
                          </div>
                        </div>
                      </div>
                      <span style={{ backgroundColor: cfg.bg, color: cfg.color, fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px" }}>{cfg.label}</span>
                    </div>
                    <div style={{ backgroundColor: "#FAFAFA", borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#1A1D23", marginBottom: "4px" }}>{item.product}</div>
                      <div style={{ fontSize: "12px", color: cfg.color, marginBottom: "2px" }}>사유: {item.reason}</div>
                      <div style={{ fontSize: "11px", color: "#6B7280" }}>담임: {item.teacher}</div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setModal(item)}
                        style={{ flex: 1, padding: "9px", borderRadius: "9px", border: "1.5px solid #E4E6EA", backgroundColor: "#FFFFFF", color: "#3D4350", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}
                      >
                        메시지 미리보기
                      </button>
                      <button
                        onClick={() => handleShare(item.id)}
                        style={{ flex: 1, padding: "9px", borderRadius: "9px", border: "none", backgroundColor: "#2A66F7", color: "#FFFFFF", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}
                      >
                        <Share2 size={13} /> 공유하기
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab: 공유 완료 */}
          {tab === "공유 완료" && (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#FAFAFA", borderBottom: "2px solid #E4E6EA" }}>
                    {["보호자명", "제품", "상태", "공유 일시", "수신 확인"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#6B7280" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SHARED.map((s, i) => {
                    const cfg = STATUS_MAP[s.status];
                    return (
                      <tr key={s.id} style={{ borderBottom: i < SHARED.length - 1 ? "1px solid #F0F0F4" : "none" }}>
                        <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: "#1A1D23" }}>{s.guardian}</td>
                        <td style={{ padding: "12px 16px", fontSize: "12px", color: "#3D4350" }}>{s.product}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ backgroundColor: cfg.bg, color: cfg.color, fontSize: "11px", fontWeight: 700, padding: "3px 9px", borderRadius: "20px" }}>{cfg.label}</span>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: "12px", color: "#6B7280" }}>{s.sharedAt}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: s.read ? "#2A66F7" : "#6B7280", fontWeight: 600 }}>
                            <Check size={13} />
                            {s.read ? "읽음" : "미읽음"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {tab === "전체 이력" && (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", textAlign: "center", color: "#6B7280", fontSize: "13px" }}>
              전체 이력은 공유 완료 탭과 동일한 포맷으로 전체 기간 데이터를 표시합니다.
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div style={{ width: "260px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D23", margin: "0 0 14px" }}>이번달 공유 통계</h3>
            {[
              { label: "총 공유 건수", value: "47건" },
              { label: "평균 응답 시간", value: "2.3시간" },
              { label: "미확인율", value: "12%" },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #F0F0F4" }}>
                <span style={{ fontSize: "12px", color: "#6B7280" }}>{s.label}</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#1A1D23" }}>{s.value}</span>
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D23", margin: "0 0 14px" }}>자주 공유하는 보호자</h3>
            {["조하나 부모님", "강하준 부모님", "이지은 부모님", "박민준 부모님"].map((name, i) => (
              <button
                key={i}
                style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "8px 0", border: "none", backgroundColor: "transparent", cursor: "pointer", fontFamily: "Pretendard, sans-serif", borderBottom: i < 3 ? "1px solid #F0F0F4" : "none" }}
              >
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #2A66F7, #1A50D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#FFFFFF", flexShrink: 0 }}>
                  {name[0]}
                </div>
                <span style={{ fontSize: "13px", color: "#3D4350", fontWeight: 500 }}>{name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Message Preview Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "28px", width: "480px", boxShadow: "0 8px 40px rgba(0,0,0,0.15)", fontFamily: "Pretendard, sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1A1D23", margin: 0 }}>공유 메시지 미리보기</h3>
              <button onClick={() => setModal(null)} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1.5px solid #E4E6EA", backgroundColor: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={16} color="#6B7280" />
              </button>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <span style={{ fontSize: "12px", color: "#6B7280" }}>받는 분: </span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1D23" }}>{modal.guardian}</span>
            </div>
            <div style={{ backgroundColor: "#F5F6FA", borderRadius: "12px", padding: "16px", marginBottom: "20px", fontSize: "13px", color: "#3D4350", lineHeight: "1.7" }}>
              안녕하세요. 햇살어린이집입니다.<br />
              <strong>[{modal.product}]</strong> 제품 검사 결과를 안내드립니다.<br />
              <strong>{modal.child}</strong> 어린이 기준{" "}
              <span style={{ color: STATUS_MAP[modal.status].color, fontWeight: 700 }}>
                [{STATUS_MAP[modal.status].label}]
              </span>{" "}
              판정이 나왔습니다.<br /><br />
              📌 사유: {modal.reason}<br />
              📌 담임: {modal.teacher}<br /><br />
              자세한 내용은 딱콕 앱에서 확인하실 수 있습니다.<br />
              궁금하신 점은 원으로 연락 주세요. 감사합니다.
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setModal(null)}
                style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "1.5px solid #E4E6EA", backgroundColor: "#FFFFFF", color: "#3D4350", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}
              >
                수정
              </button>
              <button
                onClick={() => handleShare(modal.id)}
                style={{ flex: 2, padding: "11px", borderRadius: "10px", border: "none", backgroundColor: "#2A66F7", color: "#FFFFFF", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
              >
                <Share2 size={14} /> 공유하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
