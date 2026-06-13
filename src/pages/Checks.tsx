import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { formatDateTime } from '../lib/status'
import StatusBadge from '../components/StatusBadge'
import type { SafetyCheckListItem, Status } from '../lib/types'
import './checks.css'

const FILTERS: { value: Status | ''; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'PASS', label: '사용 가능' },
  { value: 'WARN', label: '주의 필요' },
  { value: 'FAIL', label: '사용 보류' },
  { value: 'EXPIRED', label: '기한 만료' },
]

const CATEGORY_ICON: Record<string, string> = {
  WET_TISSUE: '🧻',
  CLEANSER: '🧼',
  LOTION: '🧴',
  SUNSCREEN: '🌞',
  ETC: '📦',
}

export default function Checks() {
  const [filter, setFilter] = useState<Status | ''>('')
  const [all, setAll] = useState<SafetyCheckListItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .safetyChecks({ limit: 30 })
      .then(setAll)
      .catch((e) => setError(e instanceof Error ? e.message : '검사 이력을 불러오지 못했습니다.'))
  }, [])

  const counts = useMemo(() => {
    const map: Record<string, number> = { '': all?.length ?? 0 }
    for (const f of FILTERS) {
      if (f.value) map[f.value] = (all ?? []).filter((c) => c.overall_status === f.value).length
    }
    return map
  }, [all])

  const checks = useMemo(() => {
    if (!all) return null
    return filter ? all.filter((c) => c.overall_status === filter) : all
  }, [all, filter])

  return (
    <div>
      <div className="rise">
        <h1 className="page-title">검사 이력</h1>
        <p className="page-sub">제품별 안전 검사 결과를 확인해요.</p>
      </div>

      <div className="check-filters rise" style={{ animationDelay: '0.08s' }}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`classroom-tab${filter === f.value ? ' active' : ''}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
            <span className="filter-count">{counts[f.value] ?? 0}</span>
          </button>
        ))}
      </div>

      {error && <div className="error-banner">{error}</div>}
      {checks == null && !error && <div className="spinner" />}

      {checks != null && checks.length === 0 && (
        <div className="card empty-state">조건에 맞는 검사 기록이 없어요.</div>
      )}

      {checks != null && checks.length > 0 && (
        <div className="check-list">
          {checks.map((check, i) => {
            const total = Math.max(1, check.total_count)
            return (
              <Link
                to={`/checks/${check.id}`}
                className="card check-card rise"
                style={{ animationDelay: `${0.12 + i * 0.05}s` }}
                key={check.id}
              >
                <div className="check-icon">{CATEGORY_ICON[check.product.category] ?? '📦'}</div>
                <div className="check-body">
                  <div className="check-head">
                    <h3>{check.product.name}</h3>
                    <StatusBadge status={check.overall_status} />
                  </div>
                  <div className="check-ratio">
                    {check.pass_count > 0 && (
                      <span className="rb rb-pass" style={{ width: `${(check.pass_count / total) * 100}%` }} />
                    )}
                    {check.warn_count > 0 && (
                      <span className="rb rb-warn" style={{ width: `${(check.warn_count / total) * 100}%` }} />
                    )}
                    {check.fail_count > 0 && (
                      <span className="rb rb-fail" style={{ width: `${(check.fail_count / total) * 100}%` }} />
                    )}
                    {check.expired_count > 0 && (
                      <span className="rb rb-etc" style={{ width: `${(check.expired_count / total) * 100}%` }} />
                    )}
                  </div>
                  <div className="check-counts">
                    {check.pass_count > 0 && <span className="count-pill pill-pass">가능 {check.pass_count}</span>}
                    {check.warn_count > 0 && <span className="count-pill pill-warn">주의 {check.warn_count}</span>}
                    {check.fail_count > 0 && <span className="count-pill pill-fail">보류 {check.fail_count}</span>}
                    {check.expired_count > 0 && <span className="count-pill pill-etc">만료 {check.expired_count}</span>}
                    {check.unknown_count > 0 && <span className="count-pill pill-etc">미확인 {check.unknown_count}</span>}
                    <span className="check-total">총 {check.total_count}명</span>
                  </div>
                  <div className="check-children">
                    {check.children
                      .filter((c) => c.status !== 'PASS')
                      .slice(0, 6)
                      .map((c) => (
                        <span
                          key={c.child_id}
                          className={`chip ${c.status === 'FAIL' ? 'chip-danger' : c.status === 'WARN' ? 'chip-yellow' : ''}`}
                        >
                          {c.child_name} · {c.status_label}
                        </span>
                      ))}
                  </div>
                </div>
                <time className="check-time">{formatDateTime(check.created_at)}</time>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
