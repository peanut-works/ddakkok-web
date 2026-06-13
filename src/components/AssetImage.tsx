import { useState } from 'react'

interface Props {
  /** public/assets/ 안의 파일명 — 파일을 넣으면 자동으로 표시된다 */
  name: string
  alt: string
  /** 파일이 없을 때 플레이스홀더에 표시할 설명 */
  label: string
  ratio?: string
  className?: string
}

export default function AssetImage({ name, alt, label, ratio = '4 / 3', className = '' }: Props) {
  const [missing, setMissing] = useState(false)

  if (missing) {
    return (
      <div className={`asset-placeholder ${className}`.trim()} style={{ aspectRatio: ratio }}>
        <span className="asset-ph-icon" aria-hidden>
          🖼️
        </span>
        <strong>{label}</strong>
        <code>public/assets/{name}</code>
      </div>
    )
  }

  return (
    <img
      src={`/assets/${name}`}
      alt={alt}
      className={`asset-img ${className}`.trim()}
      style={{ aspectRatio: ratio }}
      onError={() => setMissing(true)}
    />
  )
}
