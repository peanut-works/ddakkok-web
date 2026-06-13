import { BrowserRouter, Routes, Route } from "react-router";
import { Sidebar } from "./components/Sidebar";
import { DashboardPage } from "./pages/DashboardPage";
import { ChildrenPage } from "./pages/ChildrenPage";
import { ProductsPage } from "./pages/ProductsPage";
import { SafetyPage } from "./pages/SafetyPage";
import { SharingPage } from "./pages/SharingPage";
import { RecordsPage } from "./pages/RecordsPage";
import { SettingsPage } from "./pages/SettingsPage";

export default function App() {
  return (
    /* MARKER-MAKE-KIT-INVOKED */
    <BrowserRouter>
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "#FAFAFA",
          fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <Sidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/children" element={<ChildrenPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/sharing" element={<SharingPage />} />
            <Route path="/records" element={<RecordsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
