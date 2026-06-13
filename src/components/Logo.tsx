interface Props {
  size?: number
  withText?: boolean
  textColor?: string
}

export default function Logo({ size = 32, withText = true, textColor = 'var(--ink)' }: Props) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
      <img src="/assets/logo.png" alt="딱콕 로고" width={size} height={size} style={{ objectFit: 'contain' }} />
      {withText && (
        <span style={{ fontWeight: 800, fontSize: size * 0.62, letterSpacing: '-0.5px', color: textColor }}>
          딱콕
        </span>
      )}
    </span>
  )
}
