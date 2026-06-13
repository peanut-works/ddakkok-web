import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
// import { AuthProvider } from './lib/auth'
// import DashboardLayout from './layouts/DashboardLayout'
import Landing from './pages/Landing'
// import Login from './pages/Login'
// import DashboardHome from './pages/DashboardHome'
// import Children from './pages/Children'
// import ChildDetail from './pages/ChildDetail'
// import Checks from './pages/Checks'
// import CheckDetail from './pages/CheckDetail'

export default function App() {
  return (
    // <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route element={<DashboardLayout />}> */}
          {/*   <Route path="/dashboard" element={<DashboardHome />} /> */}
          {/*   <Route path="/children" element={<Children />} /> */}
          {/*   <Route path="/children/:childId" element={<ChildDetail />} /> */}
          {/*   <Route path="/checks" element={<Checks />} /> */}
          {/*   <Route path="/checks/:checkId" element={<CheckDetail />} /> */}
          {/* </Route> */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    // </AuthProvider>
  )
}
