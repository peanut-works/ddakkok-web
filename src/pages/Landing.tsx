import { useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import Logo from '../components/Logo'
import Reveal from '../components/Reveal'
import CountUp from '../components/CountUp'
import AssetImage from '../components/AssetImage'
import PhoneStory from '../components/PhoneStory'
import Waitlist from '../components/Waitlist'
import {
  IconArrowRight,
  IconBell,
  IconChild,
  IconClock,
  IconHistory,
  IconScan,
  IconShield,
  IconSparkle,
} from '../components/FeatureIcons'
import './landing.css'

const FEATURES = [
  {
    icon: <IconScan />,
    title: '라벨 한 장으로 끝',
    desc: '제품 라벨을 촬영하면 OCR과 AI가 성분을 자동으로 읽고 정리해요. 깨알 같은 성분표를 직접 읽을 필요가 없어요.',
  },
  {
    icon: <IconChild />,
    title: '아이마다 다른 판정',
    desc: '아동별 알레르기·피부 상태·민감 성분 프로필과 대조해 우리 반 아이 한 명 한 명에게 맞는 안전 판정을 내려요.',
  },
  {
    icon: <IconShield />,
    title: '3단계 안전 신호등',
    desc: '사용 가능·주의 필요·사용 보류. 누구나 한눈에 이해할 수 있는 신호등 판정으로 빠르게 결정할 수 있어요.',
  },
  {
    icon: <IconBell />,
    title: '위험 제품 회수 알림',
    desc: '정부 회수 명령·리콜 제품 정보를 실시간으로 받아 우리 시설에서 쓰는 제품인지 바로 확인해요.',
  },
  {
    icon: <IconClock />,
    title: '유통기한 자동 관리',
    desc: '등록된 제품의 유통기한을 추적해 만료 전에 미리 알려줘요. 지난 제품은 자동으로 사용 보류 처리돼요.',
  },
  {
    icon: <IconHistory />,
    title: '검사 이력 한곳에',
    desc: '모든 안전 검사 기록이 자동 저장돼요. 학부모 문의에도 기록으로 바로 답할 수 있어요.',
  },
]

const MARQUEE_CHIPS = [
  { text: '카제인나트륨', tone: 'danger' },
  { text: '향료', tone: 'yellow' },
  { text: '글리세린', tone: 'ok' },
  { text: '페녹시에탄올', tone: 'yellow' },
  { text: '땅콩 단백', tone: 'danger' },
  { text: '정제수', tone: 'ok' },
  { text: '파라벤', tone: 'danger' },
  { text: '에탄올', tone: 'yellow' },
  { text: '코코베타인', tone: 'ok' },
  { text: '폼알데하이드', tone: 'danger' },
  { text: '구연산', tone: 'ok' },
  { text: '벤조페논', tone: 'yellow' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { demoLogin } = useAuth()
  const [demoLoading, setDemoLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scrollPct, setScrollPct] = useState(0)
  const heroVisualRef = useRef<HTMLDivElement | null>(null)
  const heroScrubRef = useRef<HTMLDivElement | null>(null)
  const heroBgVideoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrollPct(max > 0 ? (window.scrollY / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const video = heroBgVideoRef.current
    const wrap = heroScrubRef.current
    if (!video || !wrap) return

    let target = 0
    let raf = 0

    const onScroll = () => {
      const rect = wrap.getBoundingClientRect()
      const total = wrap.offsetHeight - window.innerHeight
      if (total <= 0) return
      target = Math.min(1, Math.max(0, -rect.top / total))
    }

    const tick = () => {
      if (video.duration > 0 && video.readyState >= 2) {
        const want = target * video.duration
        const cur = video.currentTime
        const next = cur + (want - cur) * 0.22
        if (Math.abs(want - cur) > 0.004) video.currentTime = next
      }
      raf = requestAnimationFrame(tick)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  function handleTilt(e: ReactMouseEvent<HTMLDivElement>) {
    const el = heroVisualRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty('--tilt-x', `${y * -9}deg`)
    el.style.setProperty('--tilt-y', `${x * 12}deg`)
  }

  function resetTilt() {
    const el = heroVisualRef.current
    if (!el) return
    el.style.setProperty('--tilt-x', '0deg')
    el.style.setProperty('--tilt-y', '0deg')
  }

  async function handleDemo() {
    setError(null)
    setDemoLoading(true)
    try {
      await demoLogin()
      navigate('/dashboard')
    } catch (e) {
      setError(e instanceof Error ? e.message : '체험 모드 접속에 실패했습니다. 잠시 후 다시 시도해주세요.')
      setDemoLoading(false)
    }
  }

  return (
    <div className="landing">
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />

      <header className="landing-header">
        <Logo size={34} />
        <nav className="landing-nav">
          <a href="#story">사용 방법</a>
          <a href="#features">주요 기능</a>
          <a href="#voices">현장의 목소리</a>
          <a href="#waitlist">출시 알림</a>
        </nav>
        <div className="landing-header-actions">
          <Link to="/login" className="btn btn-ghost">
            로그인
          </Link>
          <button className="btn btn-primary" onClick={handleDemo} disabled={demoLoading}>
            {demoLoading ? '접속 중…' : '체험하기'}
          </button>
        </div>
      </header>

      {/* ───────── HERO ───────── */}
      <div className="hero-scrub-wrap" ref={heroScrubRef}>
      <section className="hero">
        <video
          ref={heroBgVideoRef}
          className="hero-bg-video"
          src="/scrub.mp4"
          muted
          playsInline
          preload="auto"
        />
        <div className="hero-video-overlay" aria-hidden />
        <div className="hero-mesh" aria-hidden />
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />

        <div className="hero-inner">
          <div className="hero-copy">
            <span className="hero-eyebrow">
              <IconSparkle size={15} /> 영유아 맞춤 제품 안전관리 서비스
              <span className="hero-beta-tag">BETA</span>
            </span>
            <h1>
              <span className="hw" style={{ animationDelay: '0.05s' }}>
                우리&nbsp;아이
              </span>{' '}
              <span className="hw" style={{ animationDelay: '0.14s' }}>
                제품&nbsp;안전,
              </span>
              <br />
              <span className="hw" style={{ animationDelay: '0.26s' }}>
                <em>3초</em>&nbsp;만에
              </span>{' '}
              <span className="hw hero-brand" style={{ animationDelay: '0.38s' }}>
                딱콕!
              </span>
            </h1>
            <p className="hero-sub">
              아이마다 다른 알레르기와 피부 상태. 물티슈 한 장, 로션 한 번에도 확인이 필요해요.
              <br />
              딱콕이 제품 성분을 아이별 건강 프로필과 대조해 바로 알려드릴게요.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary hero-cta" onClick={handleDemo} disabled={demoLoading}>
                {demoLoading ? '접속 중…' : '로그인 없이 체험하기'}
                <IconArrowRight />
              </button>
              <Link to="/login" className="btn btn-ghost hero-cta">
                교사 계정 로그인
              </Link>
            </div>
            <a href="#waitlist" className="hero-waitlink">
              아직 베타 기간이에요 · <strong>정식 출시 알림 신청하기 →</strong>
            </a>
            {error && <div className="error-banner">{error}</div>}
          </div>

          <div
            className="hero-visual"
            ref={heroVisualRef}
            onMouseMove={handleTilt}
            onMouseLeave={resetTilt}
          >
            <div className="hero-tilt">
              <div className="safety-card-mock">
                <div className="scm-header">
                  <span className="scm-product">🧻 밀크 프로틴 보습 물티슈</span>
                  <span className="badge badge-FAIL">✕ 사용 보류</span>
                </div>
                <div className="scm-divider" />
                <div className="scm-row">
                  <span className="scm-name">강민준</span>
                  <span className="chip chip-danger">✕ 우유 알레르기 · 카제인나트륨</span>
                </div>
                <div className="scm-row">
                  <span className="scm-name">김서아</span>
                  <span className="chip chip-yellow">⚠ 민감성 피부 · 향료</span>
                </div>
                <div className="scm-row">
                  <span className="scm-name">박도윤</span>
                  <span className="chip chip-blue">✓ 사용 가능</span>
                </div>
                <div className="scm-footer">햇님반 12명 중 보류 1 · 주의 1 · 가능 10</div>
              </div>
              <div className="float-card float-card-1">
                <span>🔔</span> 회수 명령 제품 감지
              </div>
              <div className="float-card float-card-2">
                <span>✓</span> 성분 24개 분석 완료
              </div>
              <div className="orbit-chip oc-1">우유</div>
              <div className="orbit-chip oc-2">향료</div>
              <div className="orbit-chip oc-3">파라벤</div>
            </div>
          </div>
        </div>

        <div className="hero-scroll-hint" aria-hidden>
          <span className="hint-mouse" />
          스크롤해서 딱콕 살펴보기
        </div>
      </section>
      </div>

      {/* ───────── 성분 마퀴 ───────── */}
      <div className="marquee" aria-hidden>
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <div className="marquee-group" key={dup}>
              {MARQUEE_CHIPS.map((c) => (
                <span className={`marquee-chip mc-${c.tone}`} key={`${dup}-${c.text}`}>
                  {c.tone === 'danger' ? '✕' : c.tone === 'yellow' ? '⚠' : '✓'} {c.text}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="marquee-caption">딱콕이 매일 대조하는 성분들이에요</div>
      </div>

      {/* ───────── 스크롤 스토리 (sticky phone) ───────── */}
      <PhoneStory />

      {/* ───────── 숫자 스탯 ───────── */}
      <section className="stats">
        <Reveal>
          <div className="stats-grid">
            <div className="stat">
              <strong>
                <CountUp end={1200} suffix="+" />
              </strong>
              <span>대조 가능 성분 데이터</span>
            </div>
            <div className="stat">
              <strong>
                <CountUp end={3} suffix="초" />
              </strong>
              <span>평균 안전 판정 시간</span>
            </div>
            <div className="stat">
              <strong>
                <CountUp end={365} suffix="일" />
              </strong>
              <span>회수·리콜 정보 모니터링</span>
            </div>
            <div className="stat">
              <strong>
                <CountUp end={100} suffix="%" />
              </strong>
              <span>검사 기록 자동 보관</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ───────── 기능 ───────── */}
      <section className="features" id="features">
        <Reveal>
          <h2 className="landing-section-title">
            선생님의 하루를 지키는 <em>여섯 가지 방법</em>
          </h2>
          <p className="landing-section-sub">바쁜 보육 현장에서도 제품 안전 확인은 놓칠 수 없으니까요.</p>
        </Reveal>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="feature-card card">
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────── 현장 사진 + 목소리 ───────── */}
      <section className="voices" id="voices">
        <Reveal>
          <h2 className="landing-section-title">
            보육 현장의 <em>진짜 이야기</em>
          </h2>
          <p className="landing-section-sub">아이들 곁에서 매일 제품을 고르는 선생님들을 위해 만들었어요.</p>
        </Reveal>
        <div className="voices-grid">
          <Reveal delay={0}>
            <figure className="voice-card card">
              <AssetImage
                name="teacher.jpg"
                alt="딱콕으로 제품을 검사하는 보육교사"
                label="교사 사용 장면 사진"
                ratio="4 / 3"
              />
              <figcaption>
                <blockquote>
                  “물티슈 하나 바꿀 때마다 아이들 알레르기 수첩을 뒤졌는데, 이제는 촬영 한 번이면 끝나요.”
                </blockquote>
                <span className="voice-author">— 7년차 보육교사</span>
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={120}>
            <figure className="voice-card card">
              <AssetImage
                name="kids.jpg"
                alt="어린이집에서 활동 중인 아이들"
                label="아이들 활동 사진"
                ratio="4 / 3"
              />
              <figcaption>
                <blockquote>
                  “알레르기가 있는 아이 부모님께 ‘검사 기록’을 그대로 보여드리니 신뢰가 달라졌어요.”
                </blockquote>
                <span className="voice-author">— 어린이집 원장</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ───────── 출시 알림 신청 ───────── */}
      <Waitlist />

      {/* ───────── CTA ───────── */}
      <section className="cta-banner">
        <Reveal>
          <div className="cta-inner">
            <div className="cta-glow" aria-hidden />
            <h2>지금 바로 체험해보세요</h2>
            <p>회원가입 없이 클릭 한 번이면 데모 시설의 대시보드를 둘러볼 수 있어요.</p>
            <button className="btn cta-btn" onClick={handleDemo} disabled={demoLoading}>
              {demoLoading ? '접속 중…' : '체험하기'}
              <IconArrowRight />
            </button>
          </div>
        </Reveal>
      </section>

      <footer className="landing-footer">
        <Logo size={26} textColor="var(--muted)" />
        <span>영유아 맞춤 제품 안전관리 서비스 · 학교 발표용 데모</span>
      </footer>
    </div>
  )
}
