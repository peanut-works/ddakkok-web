import type { Status } from './types'

export const STATUS_LABEL: Record<Status, string> = {
  PASS: '사용 가능',
  WARN: '주의 필요',
  FAIL: '사용 보류',
  EXPIRED: '기한 만료',
  UNKNOWN: '확인 필요',
}

export const STATUS_ICON: Record<Status, string> = {
  PASS: '✓',
  WARN: '⚠',
  FAIL: '✕',
  EXPIRED: '⏰',
  UNKNOWN: '?',
}

export function formatDate(iso?: string | null): string {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export function formatDateTime(iso?: string | null): string {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${formatDate(iso)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function ageFromBirth(birth?: string | null): string {
  if (!birth) return ''
  const b = new Date(birth)
  if (Number.isNaN(b.getTime())) return ''
  const now = new Date()
  let age = now.getFullYear() - b.getFullYear()
  const m = now.getMonth() - b.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age -= 1
  return `만 ${age}세`
}
