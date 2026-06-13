import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { CheckCircle2, Barcode, Share2 } from "lucide-react";

const trendData = [
  { date: "5/10", total: 14, warn: 4, fail: 1 },
  { date: "5/11", total: 18, warn: 5, fail: 2 },
  { date: "5/12", total: 12, warn: 3, fail: 1 },
  { date: "5/13", total: 20, warn: 6, fail: 2 },
  { date: "5/14", total: 16, warn: 4, fail: 1 },
  { date: "5/15", total: 22, warn: 7, fail: 2 },
  { date: "5/16", total: 18, warn: 7, fail: 2 },
];

const donutData = [
  { name: "안전", value: 84, color: "#2A66F7" },
  { name: "주의", value: 30, color: "#C9A800" },
  { name: "보류", value: 12, color: "#FF6B6B" },
];

function DonutCenterLabel() {
  return (
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="middle"
      style={{ fontFamily: "Pretendard, sans-serif" }}
    >
      <tspan x="50%" dy="-10" fontSize="13" fill="#6B7280" fontWeight={500}>
        전체
      </tspan>
      <tspan x="50%" dy="24" fontSize="22" fill="#1A1D23" fontWeight={700}>
        126건
      </tspan>
    </text>
  );
}

export function AnalyticsCharts() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "16px",
        marginBottom: "24px",
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      {/* Line Chart */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.04)",
        }}
      >
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D23", margin: "0 0 16px" }}>
          최근 7일 분석 추이
        </h3>
        <div style={{ display: "flex", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
          {[
            { color: "#2A66F7", label: "전체" },
            { color: "#C9A800", label: "주의" },
            { color: "#FF6B6B", label: "보류" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: "10px", height: "3px", borderRadius: "2px", backgroundColor: item.color }} />
              <span style={{ fontSize: "11px", color: "#6B7280" }}>{item.label}</span>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#6B7280", fontFamily: "Pretendard, sans-serif" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#6B7280", fontFamily: "Pretendard, sans-serif" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: "12px",
                fontFamily: "Pretendard, sans-serif",
                borderRadius: "8px",
                border: "1px solid #E4E6EA",
              }}
            />
            <Line type="monotone" dataKey="total" stroke="#2A66F7" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="warn" stroke="#C9A800" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="fail" stroke="#FF6B6B" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Donut Chart */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.04)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D23", margin: "0 0 8px" }}>
          판정 비율
        </h3>
        <div style={{ position: "relative", flex: 1 }}>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                strokeWidth={0}
              >
                {donutData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <DonutCenterLabel />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
          {donutData.map((item) => (
            <div key={item.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "3px", backgroundColor: item.color }} />
                <span style={{ fontSize: "12px", color: "#3D4350" }}>{item.name}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#1A1D23" }}>{item.value}건</span>
                <span style={{ fontSize: "11px", color: "#6B7280" }}>
                  {((item.value / 126) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #E4E6EA" }}>
          <span style={{ fontSize: "12px", color: "#6B7280" }}>분석 제품 수 </span>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#1A1D23" }}>62개</span>
        </div>
      </div>

      {/* Recent Product */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.04)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D23", margin: "0 0 16px" }}>
          최근 분석 제품
        </h3>
        <div
          style={{
            backgroundColor: "#FAFAFA",
            borderRadius: "12px",
            border: "1px solid #E4E6EA",
            padding: "14px",
            marginBottom: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#1A1D23", lineHeight: "1.4" }}>
              퓨어 물티슈 캡형 (100매)
            </span>
            <span
              style={{
                backgroundColor: "#EBF1FF",
                color: "#2A66F7",
                fontSize: "11px",
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: "6px",
                whiteSpace: "nowrap",
                flexShrink: 0,
                marginLeft: "8px",
              }}
            >
              <CheckCircle2 size={10} style={{ display: "inline", marginRight: "3px", verticalAlign: "middle" }} />
              안전
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {[
              { label: "분석일시", value: "2025.05.16 10:32" },
              { label: "제조사", value: "퓨어랩" },
              { label: "유효기간", value: "2026.11.20" },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", gap: "8px" }}>
                <span style={{ fontSize: "11px", color: "#6B7280", minWidth: "52px" }}>{row.label}</span>
                <span style={{ fontSize: "11px", color: "#3D4350", fontWeight: 500 }}>{row.value}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "#6B7280", minWidth: "52px" }}>바코드</span>
              <span style={{ fontSize: "11px", color: "#3D4350", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px" }}>
                <Barcode size={11} color="#6B7280" />
                8801234567890
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
          <button
            style={{
              flex: 1,
              padding: "9px",
              borderRadius: "9px",
              border: "1.5px solid #2A66F7",
              backgroundColor: "#FFFFFF",
              color: "#2A66F7",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "Pretendard, sans-serif",
            }}
          >
            상세 결과 보기
          </button>
          <button
            style={{
              flex: 1,
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
            보호자 공유
          </button>
        </div>
      </div>
    </div>
  );
}
