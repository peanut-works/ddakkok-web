import { useEffect, useState } from 'react'
import { useInView } from '../../hooks/useInView'

export interface DonutSegment {
  value: number
  color: string
  label: string
}

interface Props {
  segments: DonutSegment[]
  size?: number
  thickness?: number
  centerValue?: string
  centerLabel?: string
}

/** stroke-dasharray 트랜지션으로 차오르는 도넛 차트 */
export default function Donut({ segments, size = 190, thickness = 24, centerValue, centerLabel }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setDrawn(true), 80)
      return () => clearTimeout(t)
    }
  }, [inView])

  const total = Math.max(
    1,
    segments.reduce((s, seg) => s + seg.value, 0),
  )
  const r = (size - thickness) / 2
  const C = 2 * Math.PI * r

  let acc = 0
  const arcs = segments
    .filter((s) => s.value > 0)
    .map((seg) => {
      const frac = seg.value / total
      const start = acc
      acc += frac
      return { ...seg, frac, start }
    })

  return (
    <div className="donut-wrap" ref={ref}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--surface-soft)"
          strokeWidth={thickness}
        />
        {arcs.map((arc) => (
          <circle
            key={arc.label}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={arc.color}
            strokeWidth={thickness}
            strokeLinecap="butt"
            strokeDasharray={`${drawn ? arc.frac * C : 0} ${C}`}
            strokeDashoffset={-arc.start * C}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dasharray 1.1s cubic-bezier(0.22, 1, 0.36, 1)' }}
          />
        ))}
      </svg>
      {(centerValue || centerLabel) && (
        <div className="donut-center">
          {centerValue && <strong>{centerValue}</strong>}
          {centerLabel && <span>{centerLabel}</span>}
        </div>
      )}
    </div>
  )
}
