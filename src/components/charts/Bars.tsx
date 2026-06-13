import { useInView } from '../../hooks/useInView'

export interface BarDatum {
  label: string
  value: number
  /** 강조 표시 (오늘 등) */
  active?: boolean
}

interface Props {
  data: BarDatum[]
  height?: number
}

/** 아래에서 자라나는 스태거 바 차트 */
export default function Bars({ data, height = 170 }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>(0.35)
  const max = Math.max(1, ...data.map((d) => d.value))

  return (
    <div className="bars" ref={ref} style={{ height }}>
      {data.map((d, i) => (
        <div className="bar-col" key={`${d.label}-${i}`}>
          <span className="bar-value">{d.value > 0 ? d.value : ''}</span>
          <div className="bar-track">
            <div
              className={`bar-fill${d.active ? ' bar-active' : ''}`}
              style={{
                height: `${Math.max(d.value > 0 ? 8 : 3, (d.value / max) * 100)}%`,
                transform: inView ? 'scaleY(1)' : 'scaleY(0)',
                transitionDelay: `${i * 70}ms`,
              }}
            />
          </div>
          <span className={`bar-label${d.active ? ' bar-label-active' : ''}`}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}
