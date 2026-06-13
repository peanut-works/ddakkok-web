import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { formatDate } from '../lib/status'
import StatusBadge from '../components/StatusBadge'
import Donut from '../components/charts/Donut'
import type { SafetyCheckDetail } from '../lib/types'
import './check-detail.css'

export default function CheckDetail() {
  const { checkId } = useParams()
  const [check, setCheck] = useState<SafetyCheckDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .safetyCheckDetail(Number(checkId))
      .then(setCheck)
      .catch((e) => setError(e instanceof Error ? e.message : '검사 결과를 불러오지 못했습니다.'))
  }, [checkId])

  return (
    <div>
      <Link to="/checks" className="back-link">
        ← 검사 이력으로
      </Link>

      {error && <div className="error-banner">{error}</div>}
      {!check && !error && <div className="spinner" />}

      {check && (
        <>
          <div className="ckd-header card rise">
            <div className="ckd-head-main">
              <h1>{check.product.name}</h1>
              <span className="ckd-meta">
                {[check.product.manufacturer, check.product.category, check.product.expiry_date ? `유통기한 ${formatDate(check.product.expiry_date)}` : null]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            </div>
            <StatusBadge status={check.summary.overall_status} large />
          </div>

          <div className="ckd-overview rise" style={{ animationDelay: '0.08s' }}>
            <div className="card ckd-donut-card">
              <Donut
                size={150}
                thickness={20}
                segments={[
                  { value: check.summary.pass_count, color: '#2A66F7', label: '사용 가능' },
                  { value: check.summary.warn_count, color: '#FFD200', label: '주의 필요' },
                  { value: check.summary.fail_count, color: '#FF6B6B', label: '사용 보류' },
                  { value: check.summary.expired_count, color: '#9aa1ad', label: '기한 만료' },
                ]}
                centerValue={`${check.summary.total_count}명`}
                centerLabel="검사 인원"
              />
            </div>
            <div className="ckd-summary">
              <div className="ckd-stat">
                <strong className="stat-pass">{check.summary.pass_count}</strong>
                <span>사용 가능</span>
              </div>
              <div className="ckd-stat">
                <strong className="stat-warn">{check.summary.warn_count}</strong>
                <span>주의 필요</span>
              </div>
              <div className="ckd-stat">
                <strong className="stat-fail">{check.summary.fail_count}</strong>
                <span>사용 보류</span>
              </div>
              <div className="ckd-stat">
                <strong>{check.summary.total_count}</strong>
                <span>검사 인원</span>
              </div>
            </div>
          </div>

          {check.overall_explanation && (
            <div className="card ckd-explanation">
              <h2 className="section-title">🤖 AI 종합 설명</h2>
              <p>{check.overall_explanation}</p>
            </div>
          )}

          {(check.product.normalized_ingredients?.length ?? 0) > 0 && (
            <div className="card ckd-ingredients">
              <h2 className="section-title">🧪 분석된 성분</h2>
              <div className="cd-chips">
                {check.product.normalized_ingredients!.map((ing) => (
                  <span className="chip" key={ing}>
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          <h2 className="section-title" style={{ marginTop: 30 }}>
            🧒 아동별 판정 결과
          </h2>
          <div className="ckd-results">
            {check.results.map((r) => (
              <article className={`card ckd-result result-${r.status}`} key={r.child_id}>
                <div className="ckd-result-head">
                  <Link to={`/children/${r.child_id}`} className="ckd-child-name">
                    {r.child_name}
                  </Link>
                  <StatusBadge status={r.status} label={r.status_label} />
                </div>
                <p className="ckd-sentence">{r.teacher_sentence}</p>
                {(r.matched_ingredients?.length ?? 0) > 0 && (
                  <div className="ckd-matched">
                    {r.matched_ingredients!.map((ing) => (
                      <span className="chip chip-danger" key={ing}>
                        {ing}
                      </span>
                    ))}
                  </div>
                )}
                {r.reason && r.status !== 'PASS' && <p className="ckd-reason">{r.reason}</p>}
                {r.explanation && <p className="ckd-ai">💬 {r.explanation}</p>}
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
