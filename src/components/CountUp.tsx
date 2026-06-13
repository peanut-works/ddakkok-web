import { useEffect, useState } from 'react'
import { useInView } from '../hooks/useInView'

interface Props {
  end: number
  duration?: number
  suffix?: string
  decimals?: number
}

export default function CountUp({ end, duration = 1400, suffix = '', decimals = 0 }: Props) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.5)
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(end * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, end, duration])

  const text = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString()
  return (
    <span ref={ref}>
      {text}
      {suffix}
    </span>
  )
}
