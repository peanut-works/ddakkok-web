import { useState } from "react";
import {
  FileDown, FileText, ChevronLeft, ChevronRight, Save, Printer,
  AlertTriangle, CheckCircle2, XCircle, Search, X,
} from "lucide-react";

// ─────────────────────────────────────────
// Shared
// ─────────────────────────────────────────
const STATUS_MAP = {
  safe:  { label: "안전", color: "#2A66F7", bg: "#EBF1FF", Icon: CheckCircle2 },
  warn:  { label: "주의", color: "#C9A800", bg: "#FFF8CC", Icon: AlertTriangle },
  fail:  { label: "보류", color: "#FF6B6B", bg: "#FFF0F0", Icon: XCircle },
};

// ─────────────────────────────────────────
// 검사 기록 탭
// ─────────────────────────────────────────
const RECORDS = [
  { date: "2025.05.16", time: "10:32", child: "김서준", teacher: "이담임", product: "퓨어 물티슈 캡형 (100매)", status: "safe" as const, reason: "-" },
  { date: "2025.05.16", time: "09:41", child: "이지은", teacher: "이담임", product: "키즈 샴푸 (500ml)", status: "warn" as const, reason: "향료 알레르기" },
  { date: "2025.05.16", time: "09:12", child: "조하나", teacher: "김선생", product: "베이비 로션 (300ml)", status: "safe" as const, reason: "-" },
  { date: "2025.05.15", time: "16:21", child: "강하준", teacher: "이담임", product: "유아 세탁세제 (1L)", status: "fail" as const, reason: "MIT 성분 포함" },
  { date: "2025.05.15", time: "14:33", child: "이유나", teacher: "김선생", product: "베이비 로션 (300ml)", status: "warn" as const, reason: "계란 알레르기" },
  { date: "2025.05.14", time: "11:05", child: "최서연", teacher: "김선생", product: "키즈 선크림 (60g)", status: "fail" as const, reason: "CMIT/MIT 포함" },
];

function RecordsTab() {
  const [statusFilter, setStatusFilter] = useState("전체");
  const groupedByDate: Record<string, typeof RECORDS> = {};
  RECORDS.forEach((r) => {
    if (!groupedByDate[r.date]) groupedByDate[r.date] = [];
    groupedByDate[r.date].push(r);
  });

  return (
    <div>
      {/* Filter Bar */}
      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "14px 18px", marginBottom: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", border: "1.5px solid #E4E6EA", borderRadius: "9px", padding: "7px 12px", minWidth: "160px" }}>
          <Search size={14} color="#6B7280" />
          <input placeholder="제품명 검색" style={{ border: "none", outline: "none", backgroundColor: "transparent", fontSize: "13px", color: "#3D4350", fontFamily: "Pretendard, sans-serif", width: "100%" }} />
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {["전체", "안전", "주의", "보류"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: "5px 12px", borderRadius: "20px", border: "1.5px solid", borderColor: statusFilter === s ? "#2A66F7" : "#E4E6EA", backgroundColor: statusFilter === s ? "#EBF1FF" : "#FFFFFF", color: statusFilter === s ? "#2A66F7" : "#6B7280", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>
              {s}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "13px", color: "#6B7280" }}>총 <strong style={{ color: "#1A1D23" }}>{RECORDS.length}건</strong></span>
          <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "9px", border: "1.5px solid #E4E6EA", backgroundColor: "#FFFFFF", color: "#3D4350", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>
            <FileDown size={14} /> 엑셀 내보내기
          </button>
        </div>
      </div>

      {/* Timeline grouped */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {Object.entries(groupedByDate).map(([date, items]) => (
          <div key={date}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#2A66F7" }} />
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#1A1D23" }}>{date}</span>
              <span style={{ fontSize: "12px", color: "#6B7280" }}>({items.length}건)</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#E4E6EA" }} />
            </div>
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {items.map((r, i) => {
                    const cfg = STATUS_MAP[r.status];
                    const Icon = cfg.Icon;
                    return (
                      <tr key={i} style={{ borderBottom: i < items.length - 1 ? "1px solid #F0F0F4" : "none" }}>
                        <td style={{ padding: "11px 16px", fontSize: "12px", color: "#6B7280", width: "60px" }}>{r.time}</td>
                        <td style={{ padding: "11px 16px", fontSize: "13px", fontWeight: 600, color: "#1A1D23", width: "80px" }}>{r.child}</td>
                        <td style={{ padding: "11px 16px", fontSize: "12px", color: "#6B7280", width: "80px" }}>{r.teacher}</td>
                        <td style={{ padding: "11px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: "28px", height: "28px", borderRadius: "7px", backgroundColor: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Icon size={13} color={cfg.color} strokeWidth={2.5} />
                            </div>
                            <span style={{ fontSize: "13px", color: "#3D4350" }}>{r.product}</span>
                          </div>
                        </td>
                        <td style={{ padding: "11px 16px", width: "120px" }}>
                          <span style={{ backgroundColor: cfg.bg, color: cfg.color, fontSize: "11px", fontWeight: 700, padding: "3px 9px", borderRadius: "20px" }}>{cfg.label}</span>
                        </td>
                        <td style={{ padding: "11px 16px", fontSize: "12px", color: r.reason === "-" ? "#6B7280" : cfg.color }}>{r.reason}</td>
                        <td style={{ padding: "11px 16px" }}>
                          <button style={{ fontSize: "12px", color: "#2A66F7", fontWeight: 600, border: "none", backgroundColor: "transparent", cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>상세보기</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 리포트 발행 탭
// ─────────────────────────────────────────
const PAST_REPORTS = [
  { date: "2025.05.09", type: "주간", author: "김관리", period: "2025년 5월 2주차" },
  { date: "2025.05.02", type: "주간", author: "김관리", period: "2025년 5월 1주차" },
  { date: "2025.04.30", type: "월간", author: "김관리", period: "2025년 4월" },
];

function ReportTab() {
  const [type, setType] = useState("주간");
  const [includes, setIncludes] = useState({ children: true, class: true, issues: true, sharing: true });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px" }}>
      {/* Settings */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D23", margin: "0 0 14px" }}>리포트 설정</h3>
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "12px", color: "#6B7280", marginBottom: "8px", display: "block" }}>리포트 종류</label>
            <div style={{ display: "flex", gap: "6px" }}>
              {["주간", "월간", "사용자 지정"].map((t) => (
                <button key={t} onClick={() => setType(t)} style={{ padding: "6px 12px", borderRadius: "8px", border: "1.5px solid", borderColor: type === t ? "#2A66F7" : "#E4E6EA", backgroundColor: type === t ? "#EBF1FF" : "#FFFFFF", color: type === t ? "#2A66F7" : "#6B7280", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "12px", color: "#6B7280", marginBottom: "8px", display: "block" }}>포함 범위</label>
            {[
              { key: "children", label: "전체 아동" },
              { key: "class", label: "반별 통계" },
              { key: "issues", label: "주의·보류 제품 목록" },
              { key: "sharing", label: "보호자 공유 현황" },
            ].map((item) => (
              <label key={item.key} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={(includes as any)[item.key]}
                  onChange={(e) => setIncludes((prev) => ({ ...prev, [item.key]: e.target.checked }))}
                  style={{ width: "15px", height: "15px", accentColor: "#2A66F7" }}
                />
                <span style={{ fontSize: "13px", color: "#3D4350" }}>{item.label}</span>
              </label>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button style={{ padding: "10px", borderRadius: "10px", border: "1.5px solid #2A66F7", backgroundColor: "#FFFFFF", color: "#2A66F7", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>
              미리보기
            </button>
            <button style={{ padding: "10px", borderRadius: "10px", border: "none", backgroundColor: "#2A66F7", color: "#FFFFFF", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <FileText size={14} /> PDF 생성
            </button>
          </div>
        </div>

        {/* Past reports */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D23", margin: "0 0 12px" }}>발행된 리포트</h3>
          {PAST_REPORTS.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < PAST_REPORTS.length - 1 ? "1px solid #F0F0F4" : "none" }}>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#1A1D23" }}>{r.period}</div>
                <div style={{ fontSize: "11px", color: "#6B7280" }}>{r.date} · {r.author}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ backgroundColor: "#EBF1FF", color: "#2A66F7", fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "4px" }}>{r.type}</span>
                <button style={{ fontSize: "11px", color: "#6B7280", border: "none", backgroundColor: "transparent", cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>다운로드</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "380px", backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1.5px solid #E4E6EA",
            overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          {/* Report header */}
          <div style={{ background: "linear-gradient(135deg, #2A66F7, #1A50D4)", padding: "24px", color: "#FFFFFF", textAlign: "center" }}>
            <div style={{ fontSize: "20px", marginBottom: "6px" }}>🏫</div>
            <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "2px" }}>햇살어린이집</div>
            <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: "4px" }}>2025년 5월 3주차</div>
            <div style={{ fontSize: "13px", fontWeight: 600 }}>제품 안전 관리 리포트</div>
          </div>
          <div style={{ padding: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
              {[
                { label: "검사 제품", value: "18개", color: "#1A1D23" },
                { label: "이상 없음", value: "14개", color: "#2A66F7" },
                { label: "주의 필요", value: "3개", color: "#C9A800" },
                { label: "사용 보류", value: "1개", color: "#FF6B6B" },
              ].map((s) => (
                <div key={s.label} style={{ backgroundColor: "#F5F6FA", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: "11px", color: "#6B7280" }}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* Fake bar chart */}
            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "8px" }}>안전 판정 비율</div>
              <div style={{ display: "flex", height: "12px", borderRadius: "6px", overflow: "hidden" }}>
                <div style={{ flex: 77, backgroundColor: "#2A66F7" }} />
                <div style={{ flex: 17, backgroundColor: "#C9A800" }} />
                <div style={{ flex: 6, backgroundColor: "#FF6B6B" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "10px", color: "#6B7280" }}>
                <span>안전 77.8%</span><span>주의 16.7%</span><span>보류 5.5%</span>
              </div>
            </div>
            <div style={{ fontSize: "10px", color: "#6B7280", textAlign: "center" }}>생성일: 2025.05.16 · 담당: 김관리</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 식단 관리 탭
// ─────────────────────────────────────────
const DAYS = ["월(19)", "화(20)", "수(21)", "목(22)", "금(23)"];
const MEALS = ["아침", "점심", "간식"];

type Allergen = "우유" | "계란" | "땅콩" | "밀";

interface MealCell {
  menu: string[];
  allergens: Allergen[];
}

const MEAL_DATA: Record<string, Record<string, MealCell>> = {
  "월(19)": {
    "아침": { menu: ["흰쌀밥", "미역국"], allergens: [] },
    "점심": { menu: ["소불고기", "시금치나물"], allergens: [] },
    "간식": { menu: ["요거트", "바나나"], allergens: ["우유"] },
  },
  "화(20)": {
    "아침": { menu: ["잡곡밥", "된장국"], allergens: [] },
    "점심": { menu: ["닭볶음탕", "감자조림"], allergens: [] },
    "간식": { menu: ["사과", "방울토마토"], allergens: [] },
  },
  "수(21)": {
    "아침": { menu: ["흰쌀밥", "콩나물국"], allergens: [] },
    "점심": { menu: ["제육볶음", "두부조림"], allergens: [] },
    "간식": { menu: ["삶은달걀", "우유"], allergens: ["계란", "우유"] },
  },
  "목(22)": {
    "아침": { menu: ["잡곡밥", "김치국"], allergens: [] },
    "점심": { menu: ["생선구이", "깍두기"], allergens: [] },
    "간식": { menu: ["쿠키", "크래커"], allergens: ["밀"] },
  },
  "금(23)": {
    "아침": { menu: ["흰쌀밥", "무국"], allergens: [] },
    "점심": { menu: ["돈가스", "샐러드"], allergens: ["계란", "밀"] },
    "간식": { menu: ["치즈", "우유"], allergens: ["우유"] },
  },
};

const CHILD_ALLERGIES: Record<string, Allergen[]> = {
  "이지은(4세)": ["우유", "계란"],
  "최서연(3세)": ["우유"],
  "조하나(4세)": ["우유", "땅콩"],
  "이유나(4세)": ["계란", "밀"],
};

const ALLERGEN_COLOR: Record<Allergen, { text: string; bg: string }> = {
  "우유": { text: "#2A66F7", bg: "#EBF1FF" },
  "계란": { text: "#C9A800", bg: "#FFF8CC" },
  "땅콩": { text: "#FF6B6B", bg: "#FFF0F0" },
  "밀": { text: "#8A8A8A", bg: "#ECECEC" },
};

function AllergyWarning({ allergens }: { allergens: Allergen[] }) {
  const [show, setShow] = useState(false);
  const riskChildren = Object.entries(CHILD_ALLERGIES)
    .filter(([, childAllergens]) => allergens.some((a) => childAllergens.includes(a)))
    .map(([name]) => name.split("(")[0]);

  if (allergens.length === 0) return null;
  return (
    <div style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span
        style={{
          display: "inline-flex", alignItems: "center", gap: "3px",
          backgroundColor: "#FFF0F0", color: "#FF6B6B",
          fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px",
          cursor: "pointer", border: "1px solid #FFCACA",
        }}
      >
        📍 {allergens.join("·")}
      </span>
      {show && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: "0",
          backgroundColor: "#1A1D23", color: "#FFFFFF", fontSize: "11px",
          padding: "6px 10px", borderRadius: "6px", zIndex: 10, whiteSpace: "nowrap",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}>
          ⚠ 위험 아동: {riskChildren.join(", ") || "없음"}
          <div style={{ fontSize: "10px", opacity: 0.8, marginTop: "2px" }}>클릭하여 대체 방안 확인</div>
        </div>
      )}
    </div>
  );
}

function MealPlanTab() {
  const [editModal, setEditModal] = useState<{ day: string; meal: string } | null>(null);
  const [searchIngredient, setSearchIngredient] = useState("");

  const searchResults = searchIngredient
    ? Object.entries(CHILD_ALLERGIES).filter(([, allergens]) =>
        allergens.some((a) => a.includes(searchIngredient))
      ).map(([name]) => name)
    : [];

  return (
    <div>
      {/* Week Navigator */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1.5px solid #E4E6EA", backgroundColor: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft size={16} color="#6B7280" />
          </button>
          <span style={{ fontSize: "15px", fontWeight: 700, color: "#1A1D23", minWidth: "160px", textAlign: "center" }}>
            2025년 5월 3주차
          </span>
          <button style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1.5px solid #E4E6EA", backgroundColor: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronRight size={16} color="#6B7280" />
          </button>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "10px", border: "1.5px solid #2A66F7", backgroundColor: "#FFFFFF", color: "#2A66F7", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>
            <Save size={14} /> 식단표 저장
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "10px", border: "none", backgroundColor: "#2A66F7", color: "#FFFFFF", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>
            <Printer size={14} /> PDF 출력
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "70% 30%", gap: "16px" }}>
        {/* Meal Calendar */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#F5F7FF", borderBottom: "2px solid #E4E6EA" }}>
                <th style={{ padding: "12px 14px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#6B7280", width: "70px" }}>구분</th>
                {DAYS.map((d) => (
                  <th key={d} style={{ padding: "12px 14px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: "#1A1D23" }}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MEALS.map((meal, mealIdx) => (
                <tr key={meal} style={{ borderBottom: mealIdx < MEALS.length - 1 ? "1px solid #E4E6EA" : "none" }}>
                  <td style={{ padding: "14px", backgroundColor: "#FAFAFA", borderRight: "1px solid #E4E6EA" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#6B7280" }}>{meal}</span>
                  </td>
                  {DAYS.map((day) => {
                    const cell = MEAL_DATA[day]?.[meal] || { menu: [], allergens: [] };
                    return (
                      <td
                        key={day}
                        style={{ padding: "12px 14px", verticalAlign: "top", cursor: "pointer", borderLeft: "1px solid #F0F0F4" }}
                        onClick={() => setEditModal({ day, meal })}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F5F7FF")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        {cell.menu.map((m, i) => (
                          <div key={i} style={{ fontSize: "12px", color: "#3D4350", marginBottom: "2px" }}>{m}</div>
                        ))}
                        {cell.allergens.length > 0 && (
                          <div style={{ marginTop: "4px" }}>
                            <AllergyWarning allergens={cell.allergens as Allergen[]} />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Weekly allergy summary */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#1A1D23", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "6px" }}>
              <AlertTriangle size={14} color="#C9A800" /> 이번 주 알레르기 주의
            </h4>
            {([
              { allergen: "우유", count: 3, children: "이지은·최서연·조하나" },
              { allergen: "계란", count: 2, children: "이지은·이유나" },
              { allergen: "땅콩", count: 1, children: "박민준·조하나" },
            ] as { allergen: Allergen; count: number; children: string }[]).map((item, i) => (
              <div key={i} style={{ padding: "10px 12px", borderRadius: "10px", backgroundColor: "#FFF8F8", border: "1px solid #FFCACA", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: 700, color: "#FF6B6B" }}>
                    📍 {item.allergen} 포함 {item.count}회
                  </span>
                </div>
                <div style={{ fontSize: "11px", color: "#6B7280" }}>위험 아동: <span style={{ color: "#FF6B6B", fontWeight: 600 }}>{item.children}</span></div>
              </div>
            ))}
          </div>

          {/* Child allergy list */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#1A1D23", margin: "0 0 12px" }}>아동별 주의 식품</h4>
            {Object.entries(CHILD_ALLERGIES).map(([name, allergens], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: i < Object.keys(CHILD_ALLERGIES).length - 1 ? "1px solid #F0F0F4" : "none" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#1A1D23" }}>{name}</span>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {allergens.map((a) => (
                    <span key={a} style={{ backgroundColor: ALLERGEN_COLOR[a].bg, color: ALLERGEN_COLOR[a].text, fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "4px" }}>
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Substitution */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#1A1D23", margin: "0 0 12px" }}>대체 식품 제안</h4>
            {[
              { from: "우유", to: "두유 제공 필요", children: "이지은·최서연·조하나" },
              { from: "달걀 요리", to: "콩부침 대체 가능", children: "이지은·이유나" },
            ].map((item, i) => (
              <div key={i} style={{ padding: "10px 12px", borderRadius: "10px", backgroundColor: "#F0F5FF", border: "1px solid #C3D4FD", marginBottom: "8px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#2A66F7", marginBottom: "3px" }}>
                  {item.from} → {item.to}
                </div>
                <div style={{ fontSize: "11px", color: "#6B7280" }}>{item.children}</div>
              </div>
            ))}
          </div>

          {/* Quick ingredient search */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#1A1D23", margin: "0 0 10px" }}>빠른 성분 검색</h4>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", border: "1.5px solid #E4E6EA", borderRadius: "9px", padding: "8px 12px", marginBottom: "10px" }}>
              <Search size={13} color="#6B7280" />
              <input
                value={searchIngredient}
                onChange={(e) => setSearchIngredient(e.target.value)}
                placeholder="식재료명 입력"
                style={{ border: "none", outline: "none", backgroundColor: "transparent", fontSize: "13px", color: "#3D4350", fontFamily: "Pretendard, sans-serif", flex: 1 }}
              />
              {searchIngredient && (
                <button onClick={() => setSearchIngredient("")} style={{ border: "none", backgroundColor: "transparent", cursor: "pointer", padding: 0 }}>
                  <X size={13} color="#6B7280" />
                </button>
              )}
            </div>
            {searchIngredient && (
              <div>
                <div style={{ fontSize: "11px", color: "#6B7280", marginBottom: "6px" }}>위험 아동 ({searchResults.length}명)</div>
                {searchResults.length === 0 ? (
                  <div style={{ fontSize: "12px", color: "#6B7280" }}>해당 성분 알레르기 아동 없음</div>
                ) : (
                  searchResults.map((name, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 10px", borderRadius: "8px", backgroundColor: "#FFF0F0", marginBottom: "4px" }}>
                      <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#FF6B6B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: "#FFFFFF" }}>
                        {name[0]}
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#FF6B6B" }}>{name}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "28px", width: "420px", boxShadow: "0 8px 40px rgba(0,0,0,0.15)", fontFamily: "Pretendard, sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1A1D23", margin: 0 }}>
                {editModal.day.split("(")[0]}요일 {editModal.meal} 편집
              </h3>
              <button onClick={() => setEditModal(null)} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1.5px solid #E4E6EA", backgroundColor: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={16} color="#6B7280" />
              </button>
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "12px", color: "#6B7280", marginBottom: "6px", display: "block" }}>메뉴명</label>
              <input
                defaultValue={(MEAL_DATA[editModal.day]?.[editModal.meal]?.menu || []).join(", ")}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "9px", border: "1.5px solid #E4E6EA", fontSize: "13px", color: "#3D4350", fontFamily: "Pretendard, sans-serif", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: "18px" }}>
              <label style={{ fontSize: "12px", color: "#6B7280", marginBottom: "8px", display: "block" }}>알레르기 유발 성분</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {(["우유", "계란", "땅콩", "밀"] as Allergen[]).map((a) => {
                  const isChecked = (MEAL_DATA[editModal.day]?.[editModal.meal]?.allergens || []).includes(a);
                  const riskCount = Object.values(CHILD_ALLERGIES).filter((childA) => childA.includes(a)).length;
                  return (
                    <label key={a} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 12px", borderRadius: "8px", border: `1.5px solid ${isChecked ? ALLERGEN_COLOR[a].bg : "#E4E6EA"}`, backgroundColor: isChecked ? ALLERGEN_COLOR[a].bg : "#FAFAFA", cursor: "pointer" }}>
                      <input type="checkbox" defaultChecked={isChecked} style={{ accentColor: "#2A66F7" }} />
                      <span style={{ fontSize: "12px", fontWeight: 600, color: isChecked ? ALLERGEN_COLOR[a].text : "#6B7280" }}>{a}</span>
                      {riskCount > 0 && <span style={{ fontSize: "10px", color: "#FF6B6B", fontWeight: 700 }}>({riskCount}명)</span>}
                    </label>
                  );
                })}
              </div>
            </div>
            <div style={{ padding: "12px", borderRadius: "10px", backgroundColor: "#FFF8F8", border: "1px solid #FFCACA", marginBottom: "16px", fontSize: "12px", color: "#FF6B6B" }}>
              ⚠ 선택된 성분 알레르기 위험 아동이 자동으로 표시됩니다.
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setEditModal(null)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1.5px solid #E4E6EA", backgroundColor: "#FFFFFF", color: "#3D4350", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>
                취소
              </button>
              <button onClick={() => setEditModal(null)} style={{ flex: 2, padding: "10px", borderRadius: "10px", border: "none", backgroundColor: "#2A66F7", color: "#FFFFFF", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// Main
// ─────────────────────────────────────────
export function RecordsPage() {
  const [tab, setTab] = useState("검사 기록");

  return (
    <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#FAFAFA", fontFamily: "Pretendard, sans-serif" }}>
      <div style={{ padding: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1A1D23", margin: 0 }}>기록 및 리포트</h1>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: "4px 0 0" }}>검사 기록을 조회하고 리포트를 생성하세요.</p>
          </div>
          {tab === "리포트 발행" && (
            <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", borderRadius: "10px", border: "none", backgroundColor: "#2A66F7", color: "#FFFFFF", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>
              <FileText size={15} /> 리포트 생성
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: "4px", marginBottom: "24px", borderBottom: "2px solid #E4E6EA" }}>
          {["검사 기록", "리포트 발행", "식단 관리"].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "10px 20px", border: "none", cursor: "pointer", backgroundColor: "transparent", fontFamily: "Pretendard, sans-serif", fontSize: "14px", fontWeight: tab === t ? 700 : 500, color: tab === t ? "#2A66F7" : "#6B7280", borderBottom: tab === t ? "2px solid #2A66F7" : "2px solid transparent", marginBottom: "-2px" }}>
              {t}
              {t === "식단 관리" && <span style={{ marginLeft: "6px", backgroundColor: "#2A66F7", color: "#FFFFFF", borderRadius: "6px", padding: "1px 6px", fontSize: "10px", fontWeight: 700 }}>영양사</span>}
            </button>
          ))}
        </div>

        {tab === "검사 기록" && <RecordsTab />}
        {tab === "리포트 발행" && <ReportTab />}
        {tab === "식단 관리" && <MealPlanTab />}
      </div>
    </div>
  );
}
