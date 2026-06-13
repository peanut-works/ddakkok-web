import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { isMockMode } from '../lib/api'
import Logo from '../components/Logo'
import { IconBell, IconChild, IconHistory, IconHome, IconLogout } from '../components/FeatureIcons'
import './dashboard-layout.css'

const NAV_ITEMS = [
  { to: '/dashboard', icon: <IconHome />, label: '홈', end: true },
  { to: '/children', icon: <IconChild size={20} />, label: '아동 관리' },
  { to: '/checks', icon: <IconHistory size={20} />, label: '검사 이력' },
]

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export default function DashboardLayout() {
  const { user, isAuthenticated, isDemo, logout } = useAuth()
  const navigate = useNavigate()

  if (!isAuthenticated) return <Navigate to="/" replace />

  function handleLogout() {
    logout()
    navigate('/')
  }

  const now = new Date()
  const dateText = `${now.getMonth() + 1}월 ${now.getDate()}일 ${WEEKDAYS[now.getDay()]}요일`

  return (
    <div className="dash">
      <aside className="dash-sidebar">
        <NavLink to="/dashboard" className="dash-logo">
          <Logo size={30} />
        </NavLink>

        <nav className="dash-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `dash-nav-item${isActive ? ' active' : ''}`}
            >
              <span className="dash-nav-icon">{item.icon}</span>
              <span className="dash-nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="dash-sidebar-footer">
          <div className="dash-user">
            <div className="dash-avatar">{user?.name?.charAt(0) ?? '?'}</div>
            <div className="dash-user-info">
              <strong>{user?.name}</strong>
              <span>{user?.classroom?.name ?? user?.facility?.name}</span>
            </div>
            <button className="dash-logout" onClick={handleLogout} title="로그아웃">
              <IconLogout />
            </button>
          </div>
        </div>
      </aside>

      <div className="dash-body">
        <header className="dash-topbar">
          <div className="dash-topbar-left">
            <strong>{user?.facility?.name}</strong>
            <span className="dash-date">{dateText}</span>
          </div>
          <div className="dash-topbar-right">
            {isDemo && (
              <span className="demo-badge">
                <span className="demo-dot" />
                {isMockMode() ? '오프라인 체험 모드' : '체험 모드'}
              </span>
            )}
            <button className="topbar-bell" title="알림">
              <IconBell size={19} />
              <span className="bell-dot" />
            </button>
          </div>
        </header>

        <main className="dash-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
