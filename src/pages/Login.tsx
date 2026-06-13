import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import Logo from '../components/Logo'
import './login.css'

export default function Login() {
  const navigate = useNavigate()
  const { login, demoLogin } = useAuth()
  const [email, setEmail] = useState('teacher@ddakkok.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
      setLoading(false)
    }
  }

  async function handleDemo() {
    setError(null)
    setDemoLoading(true)
    try {
      await demoLogin()
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : '체험 모드 접속에 실패했습니다.')
      setDemoLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card card">
        <Link to="/" className="login-logo">
          <Logo size={40} />
        </Link>
        <h1>다시 만나서 반가워요!</h1>
        <p className="login-sub">교사 계정으로 로그인하고 우리 반 안전을 확인하세요.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@ddakkok.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="error-banner">{error}</div>}

          <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
            {loading ? '로그인 중…' : '로그인'}
          </button>
        </form>

        <div className="login-divider">
          <span>또는</span>
        </div>

        <button className="btn btn-soft login-demo" onClick={handleDemo} disabled={demoLoading}>
          {demoLoading ? '접속 중…' : '🚀 로그인 없이 체험하기'}
        </button>

        <p className="login-hint">
          데모 계정: teacher@ddakkok.com / ddakkok1234
        </p>
      </div>
    </div>
  )
}
