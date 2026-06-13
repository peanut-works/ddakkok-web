import { useId } from 'react'
import { useInView } from '../../hooks/useInView'

interface Props {
  points: number[]
  color?: string
  width?: number
  height?: number
}

/** KPI 카드용 미니 스파크라인 — 선이 그려지고 아래가 은은하게 채워진다 */
export default function Spark({ points, color = 'var(--primary)', width = 110, height = 36 }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4)
  const gid = useId()

  const max = Math.max(...points, 1)
  const min = Math.min(...points, 0)
  const range = Math.max(1, max - min)
  const step = width / (points.length - 1 || 1)
  const coords = points.map((p, i) => [i * step, height - 4 - ((p - min) / range) * (height - 10)])
  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${width},${height} L0,${height} Z`
  // 대략적 길이 (스트로크 드로잉 애니메이션용)
  const approxLen = width * 1.6

  return (
    <div ref={ref} className="spark">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gid})`} opacity={inView ? 1 : 0} style={{ transition: 'opacity 0.9s 0.5s ease' }} />
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray={approxLen}
          strokeDashoffset={inView ? 0 : approxLen}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>
    </div>
  )
}
