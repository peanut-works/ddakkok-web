import { Header } from "../components/Header";
import { SummaryCards } from "../components/SummaryCards";
import { KanbanBoard } from "../components/KanbanBoard";
import { AnalyticsCharts } from "../components/AnalyticsCharts";
import { RecentList } from "../components/RecentList";
import { NotificationPanel } from "../components/NotificationPanel";

export function DashboardPage() {
  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
      <div
        style={{
          flex: "0 0 75%",
          maxWidth: "75%",
          padding: "28px 20px 28px 28px",
          overflowY: "auto",
        }}
      >
        <Header />
        <SummaryCards />
        <KanbanBoard />
        <AnalyticsCharts />
        <RecentList />
      </div>
      <div
        style={{
          flex: "0 0 25%",
          maxWidth: "25%",
          padding: "28px 24px 28px 4px",
          overflowY: "auto",
          borderLeft: "1px solid #E4E6EA",
        }}
      >
        <h2
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#1A1D23",
            margin: "0 0 16px",
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          알림
        </h2>
        <NotificationPanel />
      </div>
    </div>
  );
}
