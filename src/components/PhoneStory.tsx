import { useEffect, useRef, useState } from 'react'

const STEPS = [
  {
    key: 'scan',
    title: '제품을 비추면',
    desc: '바코드 스캔 또는 라벨 촬영 한 번이면 제품 인식 끝. 깨알 성분표를 직접 읽을 필요가 없어요.',
  },
  {
    key: 'analyze',
    title: 'AI가 성분을 읽고',
    desc: 'OCR이 성분을 추출하고, 우리 반 아이들의 알레르기·피부 프로필과 하나하나 대조해요.',
  },
  {
    key: 'result',
    title: '안전카드가 딱!',
    desc: '아이별 신호등 판정과 교사용 설명이 담긴 안전카드가 3초 만에 도착해요.',
  },
]

const ANALYZE_ROWS = [
  { name: '정제수', state: 'ok' },
  { name: '글리세린', state: 'ok' },
  { name: '카제인나트륨', state: 'fail' },
  { name: '페녹시에탄올', state: 'warn' },
  { name: '향료', state: 'warn' },
]

export default function PhoneStory() {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      if (total <= 0) return
      setProgress(Math.min(1, Math.max(0, -rect.top / total)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const phase = progress < 0.34 ? 0 : progress < 0.67 ? 1 : 2
  // 분석 단계에서 성분 줄이 하나씩 등장하는 로컬 진행도
  const analyzeLocal = Math.min(1, Math.max(0, (progress - 0.34) / 0.3))
  const visibleRows = phase >= 2 ? ANALYZE_ROWS.length : Math.floor(analyzeLocal * (ANALYZE_ROWS.length + 1))

  return (
    <section className="story" ref={sectionRef} id="story">
      <div className="story-sticky">
        <div className="story-inner">
          <div className="story-steps">
            <span className="story-eyebrow">HOW IT WORKS</span>
            <h2>
              스크롤해보세요,
              <br />
              딱콕이 일하는 순서예요
            </h2>
            {STEPS.map((s, i) => (
              <div className={`story-step${phase === i ? ' active' : ''}${phase > i ? ' done' : ''}`} key={s.key}>
                <span className="story-step-num">{i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
            <div className="story-progress">
              <div className="story-progress-fill" style={{ height: `${progress * 100}%` }} />
            </div>
          </div>

          <div className="story-phone-wrap">
            <div className="story-phone" style={{ transform: `rotate(${(progress - 0.5) * 4}deg)` }}>
              <div className="phone-notch" />
              <div className="phone-screen">
                {/* 1. 스캔 화면 */}
                <div className={`pscreen pscreen-scan${phase === 0 ? ' active' : ''}`}>
                  <div className="pscan-header">라벨 촬영</div>
                  <div className="pscan-viewport">
                    <span className="pscan-corner c1" />
                    <span className="pscan-corner c2" />
                    <span className="pscan-corner c3" />
                    <span className="pscan-corner c4" />
                    <div className="pscan-product">
                      <span className="pscan-emoji">🧻</span>
                      <span className="pscan-label">
                        밀크 프로틴
                        <br />
                        보습 물티슈
                      </span>
                    </div>
                    <div className="pscan-laser" />
                  </div>
                  <div className="pscan-caption">성분표를 화면에 맞춰주세요</div>
                </div>

                {/* 2. 분석 화면 */}
                <div className={`pscreen pscreen-analyze${phase === 1 ? ' active' : ''}`}>
                  <div className="panalyze-header">
                    <span className="panalyze-spinner" />
                    AI 성분 분석 중
                  </div>
                  <div className="panalyze-rows">
                    {ANALYZE_ROWS.map((row, i) => (
                      <div className={`panalyze-row${i < visibleRows ? ' show' : ''}`} key={row.name}>
                        <span>{row.name}</span>
                        <span className={`panalyze-dot dot-${row.state}`}>
                          {row.state === 'ok' ? '✓' : row.state === 'warn' ? '!' : '✕'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="panalyze-caption">햇님반 5명의 프로필과 대조하고 있어요…</div>
                </div>

                {/* 3. 안전카드 화면 */}
                <div className={`pscreen pscreen-result${phase === 2 ? ' active' : ''}`}>
                  <div className="presult-header">
                    <span>안전카드</span>
                    <span className="badge badge-FAIL">✕ 사용 보류</span>
                  </div>
                  <div className="presult-product">🧻 밀크 프로틴 보습 물티슈</div>
                  <div className="presult-rows">
                    <div className="presult-row">
                      <strong>강민준</strong>
                      <span className="chip chip-danger">우유 알레르기</span>
                    </div>
                    <div className="presult-row">
                      <strong>김서아</strong>
                      <span className="chip chip-yellow">민감성 피부</span>
                    </div>
                    <div className="presult-row">
                      <strong>박도윤</strong>
                      <span className="chip chip-blue">사용 가능</span>
                    </div>
                  </div>
                  <div className="presult-ai">💬 카제인나트륨은 우유 유래 성분으로, 민준이에게는 사용을 보류해주세요.</div>
                </div>
              </div>
            </div>

            <div className={`story-float sf-1${phase === 1 ? ' show' : ''}`}>🔍 성분 5개 추출 완료</div>
            <div className={`story-float sf-2${phase === 2 ? ' show' : ''}`}>⚡ 판정까지 2.4초</div>
          </div>
        </div>
      </div>
    </section>
  )
}
