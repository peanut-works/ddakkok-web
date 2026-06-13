import { useState } from 'react'
import type { FormEvent } from 'react'
import { hasJoined, isValidEmail, joinWaitlist, joinedEmail, waitlistCount } from '../lib/waitlist'
import { IconArrowRight } from './FeatureIcons'
import Reveal from './Reveal'
import './waitlist.css'

type Phase = 'idle' | 'submitting' | 'done'

export default function Waitlist() {
  const alreadyJoined = hasJoined()
  const [phase, setPhase] = useState<Phase>(alreadyJoined ? 'done' : 'idle')
  const [email, setEmail] = useState('')
  const [savedEmail, setSavedEmail] = useState<string | null>(joinedEmail())
  const [error, setError] = useState<string | null>(null)
  const [count, setCount] = useState(waitlistCount())

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!isValidEmail(email)) {
      setError('올바른 이메일 주소를 입력해주세요.')
      return
    }
    setPhase('submitting')
    const result = await joinWaitlist(email)
    if (result === 'duplicate') {
      setError('이미 신청하신 이메일이에요. 출시되면 알려드릴게요!')
      setPhase('idle')
      return
    }
    if (result === 'invalid') {
      setError('올바른 이메일 주소를 입력해주세요.')
      setPhase('idle')
      return
    }
    setSavedEmail(email.trim().toLowerCase())
    setCount(waitlistCount())
    setPhase('done')
  }

  return (
    <section className="waitlist" id="waitlist">
      <Reveal>
        <div className="waitlist-card">
          <div className="waitlist-glow" aria-hidden />

          <span className="waitlist-pill">
            <span className="beta-dot" /> 현재 베타 테스트 중
          </span>

          {phase !== 'done' ? (
            <>
              <h2>
                딱콕이 정식 출시되면
                <br />
                <em>가장 먼저</em> 알려드릴게요
              </h2>
              <p className="waitlist-sub">
                지금은 시범 운영 기간이에요. 이메일을 남겨주시면 정식 출시 소식을 보내드릴게요.
              </p>

              <form className="waitlist-form" onSubmit={handleSubmit}>
                <div className="waitlist-input-wrap">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일 주소를 입력하세요"
                    autoComplete="email"
                    aria-label="이메일 주소"
                    disabled={phase === 'submitting'}
                  />
                  <button type="submit" className="btn" disabled={phase === 'submitting'}>
                    {phase === 'submitting' ? '신청 중…' : '출시 알림 신청'}
                    {phase !== 'submitting' && <IconArrowRight size={17} />}
                  </button>
                </div>
                {error && <p className="waitlist-error">{error}</p>}
              </form>

              <div className="waitlist-foot">
                <div className="waitlist-avatars" aria-hidden>
                  <span style={{ background: 'linear-gradient(135deg,#7AA4FA,#2A66F7)' }}>김</span>
                  <span style={{ background: 'linear-gradient(135deg,#FFD86B,#F0A800)' }}>이</span>
                  <span style={{ background: 'linear-gradient(135deg,#7FD8A8,#2BA86A)' }}>박</span>
                  <span style={{ background: 'linear-gradient(135deg,#C2A8F5,#8B5CF6)' }}>최</span>
                </div>
                <span className="waitlist-count">
                  이미 <strong>{count.toLocaleString()}</strong>명의 선생님이 기다리고 있어요
                </span>
              </div>

              <p className="waitlist-privacy">🔒 출시 알림 외 다른 용도로 사용하지 않고, 광고를 보내지 않아요.</p>
            </>
          ) : (
            <div className="waitlist-success">
              <span className="success-check" aria-hidden>
                <svg viewBox="0 0 52 52">
                  <circle className="sc-circle" cx="26" cy="26" r="24" />
                  <path className="sc-mark" d="M16 27l7 7 13-15" />
                </svg>
              </span>
              <h2>신청이 완료됐어요! 🎉</h2>
              <p className="waitlist-sub">
                정식 출시되면 <strong>{savedEmail}</strong> 으로
                <br />
                가장 먼저 소식을 보내드릴게요.
              </p>
              <span className="waitlist-count">
                <strong>{count.toLocaleString()}</strong>번째 신청자로 함께해주셔서 감사해요
              </span>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  )
}
