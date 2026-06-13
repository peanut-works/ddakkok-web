interface Props {
  size?: number
  withText?: boolean
  textColor?: string
}

export default function Logo({ size = 32, withText = true, textColor = 'var(--ink)' }: Props) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
        <rect width="64" height="64" rx="16" fill="#2A66F7" />
        <path d="M22 16v32" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
        <path
          d="M42 18 28 32l14 14"
          stroke="#FFD200"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {withText && (
        <span style={{ fontWeight: 800, fontSize: size * 0.62, letterSpacing: '-0.5px', color: textColor }}>
          딱콕
        </span>
      )}
    </span>
  )
}
