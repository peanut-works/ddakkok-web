import { useEffect, useRef, useState } from 'react'

/**
 * 스크롤 위치에 따라 영상이 재생/역재생되는 섹션.
 * public/assets/{src} 에 영상을 넣으면 자동으로 활성화되고,
 * 없으면 안내 플레이스홀더가 표시된다.
 *
 * 영상 권장 스펙: mp4(H.264), 5~12초, 1280px 이상, 키프레임 간격 짧게
 * (모든 프레임 키프레임이면 스크럽이 가장 부드럽다: ffmpeg -g 1)
 */
export default function ScrollScrubVideo({ src, title, sub }: { src: string; title: string; sub: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [missing, setMissing] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (missing) return
    const video = videoRef.current
    const wrap = wrapRef.current
    if (!video || !wrap) return

    let target = 0
    let raf = 0

    const onScroll = () => {
      const rect = wrap.getBoundingClientRect()
      const total = wrap.offsetHeight - window.innerHeight
      if (total <= 0) return
      target = Math.min(1, Math.max(0, -rect.top / total))
      setProgress(target)
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
  }, [missing])

  if (missing) {
    return (
      <section className="scrub-placeholder-section">
        <div className="scrub-placeholder">
          <span aria-hidden>🎬</span>
          <strong>여기에 시연 영상이 들어가요</strong>
          <p>
            스크롤하면 영상이 따라 재생/역재생되는 구간이에요.
            <br />
            <code>public/assets/{src}</code> 에 mp4 파일을 넣으면 자동으로 활성화됩니다.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="scrub-section" ref={wrapRef}>
      <div className="scrub-sticky">
        <div className="scrub-copy">
          <h2>{title}</h2>
          <p>{sub}</p>
        </div>
        <div className="scrub-frame">
          <video
            ref={videoRef}
            src={`/assets/${src}`}
            muted
            playsInline
            preload="auto"
            onError={() => setMissing(true)}
          />
          <div className="scrub-progress">
            <div className="scrub-progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </div>
    </section>
  )
}
