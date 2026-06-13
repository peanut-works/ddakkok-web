import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import { formatDate, formatDateTime } from '../lib/status'
import StatusBadge from '../components/StatusBadge'
import CountUp from '../components/CountUp'
import Donut from '../components/charts/Donut'
import Bars from '../components/charts/Bars'
import Spark from '../components/charts/Spark'
import type { BarDatum } from '../components/charts/Bars'
import { IconAlertTriangle, IconBell, IconChild, IconClock, IconHistory, IconShield } from '../components/FeatureIcons'
import type { DashboardSummary, SafetyCheckListItem } from '../lib/types'
import './dashboard-home.css'

const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토']

const STATUS_COLOR: Record<string, string> = {
  PASS: '#2A66F7',
  WARN: '#FFD200',
  FAIL: '#FF6B6B',
  EXPIRED: '#9aa1ad',
  UNKNOWN: '#d4d8df',
}

export default function DashboardHome() {
  const { user } = useAuth()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [checks, setChecks] = useState<SafetyCheckListItem[] | null>(null)
  const [childCount, setChildCount] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .dashboardSummary()
      .then(setSummary)
      .catch((e) => setError(e instanceof Error ? e.message : '대시보드를 불러오지 못했습니다.'))

    api
      .safetyChecks({ limit: 30 })
      .then(setChecks)
      .catch(() => setChecks([]))

    api
      .classrooms()
      .then(async (rooms) => {
        const lists = await Promise.all(rooms.map((r) => api.childrenByClassroom(r.id).catch(() => [])))
        setChildCount(lists.reduce((s, l) => s + l.length, 0))
      })
      .catch(() => setChildCount(0))
  }, [])

  // 판정 분포 (도넛)
  const distribution = useMemo(() => {
    const counts = { PASS: 0, WARN: 0, FAIL: 0, EXPIRED: 0, UNKNOWN: 0 }
    for (const c of checks ?? []) {
      counts.PASS += c.pass_count
      counts.WARN += c.warn_count
      counts.FAIL += c.fail_count
      counts.EXPIRED += c.expired_count
      counts.UNKNOWN += c.unknown_count
    }
    return counts
  }, [checks])

  const totalJudgements =
    distribution.PASS + distribution.WARN + distribution.FAIL + distribution.EXPIRED + distribution.UNKNOWN

  // 최근 7일 검사 활동 (바 차트)
  const weekBars = useMemo<BarDatum[]>(() => {
    const days: BarDatum[] = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = d.toDateString()
      const count = (checks ?? []).filter((c) => new Date(c.created_at).toDateString() === key).length
      days.push({ label: WEEKDAY[d.getDay()], value: count, active: i === 0 })
    }
    return days
  }, [checks])

  const recallCount = summary?.recall_alerts.length ?? 0
  const attentionCount = summary?.attention_products.length ?? 0
  const safeRate = totalJudgements > 0 ? Math.round((distribution.PASS / totalJudgements) * 100) : 0

  const loading = !summary && !error

  return (
    <div className="home">
      <div className="home-head rise">
        <div>
          <h1 className="page-title">
            안녕하세요, {user?.name} 선생님 <span className="wave">👋</span>
          </h1>
          <p className="page-sub">
            {user?.classroom ? `${user.classroom.name} ` : ''}오늘의 안전 현황을 한눈에 확인하세요.
          </p>
        </div>
        <Link to="/checks" className="btn btn-primary home-head-cta">
          검사 이력 보기
        </Link>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {loading && <div className="spinner" />}

      {summary && (
        <>
          {/* ── KPI 카드 ── */}
          <div className="kpi-grid">
            <div className="kpi card rise" style={{ animationDelay: '0.05s' }}>
              <div className="kpi-top">
                <span className="kpi-icon ki-blue">
                  <IconChild size={19} />
                </span>
                <Spark points={[3, 4, 4, 5, 5, 6, childCount ?? 6]} />
              </div>
              <strong className="kpi-value">{childCount != null ? <CountUp end={childCount} /> : '–'}</strong>
              <span className="kpi-label">등록 아동</span>
            </div>

            <div className="kpi card rise" style={{ animationDelay: '0.12s' }}>
              <div className="kpi-top">
                <span className="kpi-icon ki-blue">
                  <IconHistory size={19} />
                </span>
                <Spark points={weekBars.map((b) => b.value)} />
              </div>
              <strong className="kpi-value">
                <CountUp end={checks?.length ?? 0} />
              </strong>
              <span className="kpi-label">최근 안전 검사</span>
            </div>

            <div className="kpi card rise" style={{ animationDelay: '0.19s' }}>
              <div className="kpi-top">
                <span className="kpi-icon ki-green">
                  <IconShield size={19} />
                </span>
                <Spark points={[78, 82, 80, 86, 84, 90, safeRate]} color="#2A66F7" />
              </div>
              <strong className="kpi-value">
                <CountUp end={safeRate} suffix="%" />
              </strong>
              <span className="kpi-label">사용 가능 판정률</span>
            </div>

            <div className={`kpi card rise${recallCount > 0 ? ' kpi-danger' : ''}`} style={{ animationDelay: '0.26s' }}>
              <div className="kpi-top">
                <span className="kpi-icon ki-red">
                  <IconBell size={19} />
                </span>
                <Spark points={[0, 1, 1, 2, 2, 2, recallCount]} color="#FF6B6B" />
              </div>
              <strong className="kpi-value">
                <CountUp end={recallCount + attentionCount} />
              </strong>
              <span className="kpi-label">회수·주의 알림</span>
            </div>
          </div>

          {/* ── 차트 행 ── */}
          <div className="chart-row">
            <section className="card panel rise" style={{ animationDelay: '0.32s' }}>
              <div className="panel-head">
                <h2>주간 검사 활동</h2>
                <span className="panel-sub">최근 7일</span>
              </div>
              <Bars data={weekBars} />
            </section>

            <section className="card panel rise" style={{ animationDelay: '0.4s' }}>
              <div className="panel-head">
                <h2>아동별 판정 분포</h2>
                <span className="panel-sub">최근 검사 {checks?.length ?? 0}건 기준</span>
              </div>
              <div className="donut-flex">
                <Donut
                  segments={[
                    { value: distribution.PASS, color: STATUS_COLOR.PASS, label: '사용 가능' },
                    { value: distribution.WARN, color: STATUS_COLOR.WARN, label: '주의 필요' },
                    { value: distribution.FAIL, color: STATUS_COLOR.FAIL, label: '사용 보류' },
                    { value: distribution.EXPIRED, color: STATUS_COLOR.EXPIRED, label: '기한 만료' },
                  ]}
                  centerValue={`${safeRate}%`}
                  centerLabel="사용 가능"
                />
                <ul className="donut-legend">
                  {[
                    { key: 'PASS', label: '사용 가능', value: distribution.PASS },
                    { key: 'WARN', label: '주의 필요', value: distribution.WARN },
                    { key: 'FAIL', label: '사용 보류', value: distribution.FAIL },
                    { key: 'EXPIRED', label: '기한 만료', value: distribution.EXPIRED },
                  ].map((it) => (
                    <li key={it.key}>
                      <span className="legend-dot" style={{ background: STATUS_COLOR[it.key] }} />
                      {it.label}
                      <strong>{it.value}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          {/* ── 알림 행 ── */}
          <div className="alert-row">
            <section className="card panel rise" style={{ animationDelay: '0.48s' }}>
              <div className="panel-head">
                <h2>
                  <span className="panel-head-icon ph-red">
                    <IconBell size={15} />
                  </span>
                  회수·리콜 알림
                </h2>
                <span className="count-bubble">{recallCount}</span>
              </div>
              {summary.recall_alerts.length === 0 ? (
                <div className="empty-state">현재 회수 대상 제품이 없어요. 안심하세요!</div>
              ) : (
                <div className="recall-list">
                  {summary.recall_alerts.map((r, i) => (
                    <article className="recall-item rise" style={{ animationDelay: `${0.55 + i * 0.08}s` }} key={r.id}>
                      <span className={`severity-stripe ${r.severity === 'HIGH' ? 'sv-high' : 'sv-mid'}`} />
                      <div className="recall-body">
                        <div className="recall-title">
                          <h3>{r.product_name}</h3>
                          {r.is_new && <span className="new-dot">NEW</span>}
                        </div>
                        <span className="recall-meta">
                          {[r.manufacturer, r.category, formatDate(r.recall_date)].filter(Boolean).join(' · ')}
                        </span>
                        <p className="recall-reason">{r.reason}</p>
                        {r.action_guide && <p className="recall-guide">{r.action_guide}</p>}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <div className="alert-col">
              <section className="card panel rise" style={{ animationDelay: '0.55s' }}>
                <div className="panel-head">
                  <h2>
                    <span className="panel-head-icon ph-yellow">
                      <IconAlertTriangle size={15} />
                    </span>
                    주의가 필요한 제품
                  </h2>
                  <span className="count-bubble">{attentionCount}</span>
                </div>
                {summary.attention_products.length === 0 ? (
                  <div className="empty-state">주의가 필요한 제품이 없어요.</div>
                ) : (
                  summary.attention_products.map((p) => (
                    <Link to={`/checks/${p.check_id}`} className="attention-item" key={p.check_id}>
                      <div className="attention-head">
                        <h3>{p.product_name}</h3>
                        <StatusBadge status={p.overall_status} label={p.status_label} />
                      </div>
                      <p>{p.summary}</p>
                      <div className="attention-children">
                        {p.children.map((c) => (
                          <span
                            key={c.child_id}
                            className={`chip ${
                              c.status === 'FAIL' ? 'chip-danger' : c.status === 'WARN' ? 'chip-yellow' : 'chip-blue'
                            }`}
                          >
                            {c.child_name}
                          </span>
                        ))}
                      </div>
                    </Link>
                  ))
                )}
              </section>

              <section className="card panel rise" style={{ animationDelay: '0.62s' }}>
                <div className="panel-head">
                  <h2>
                    <span className="panel-head-icon ph-gray">
                      <IconClock size={15} />
                    </span>
                    유통기한 알림
                  </h2>
                  <span className="count-bubble">{summary.expiry_alerts.length}</span>
                </div>
                {summary.expiry_alerts.length === 0 ? (
                  <div className="empty-state">유통기한이 임박한 제품이 없어요.</div>
                ) : (
                  summary.expiry_alerts.map((e) => (
                    <div className="expiry-item" key={`${e.product_id}-${e.alert_type}`}>
                      <div>
                        <strong>{e.product_name}</strong>
                        <span className="expiry-date">유통기한 {formatDate(e.expiry_date)}</span>
                      </div>
                      <span className={`chip ${e.alert_type === 'EXPIRED' ? 'chip-danger' : 'chip-yellow'}`}>
                        {e.alert_type === 'EXPIRED' ? '만료됨' : '임박'}
                      </span>
                    </div>
                  ))
                )}
              </section>
            </div>
          </div>

          {/* ── 최근 검사 ── */}
          {checks && checks.length > 0 && (
            <section className="card panel rise" style={{ animationDelay: '0.7s' }}>
              <div className="panel-head">
                <h2>최근 검사</h2>
                <Link to="/checks" className="panel-link">
                  전체 보기 →
                </Link>
              </div>
              <div className="recent-list">
                {checks.slice(0, 5).map((c) => {
                  const total = Math.max(1, c.total_count)
                  return (
                    <Link to={`/checks/${c.id}`} className="recent-item" key={c.id}>
                      <div className="recent-main">
                        <strong>{c.product.name}</strong>
                        <time>{formatDateTime(c.created_at)}</time>
                      </div>
                      <div className="recent-bar">
                        {c.pass_count > 0 && (
                          <span className="rb rb-pass" style={{ width: `${(c.pass_count / total) * 100}%` }} />
                        )}
                        {c.warn_count > 0 && (
                          <span className="rb rb-warn" style={{ width: `${(c.warn_count / total) * 100}%` }} />
                        )}
                        {c.fail_count > 0 && (
                          <span className="rb rb-fail" style={{ width: `${(c.fail_count / total) * 100}%` }} />
                        )}
                        {c.expired_count > 0 && (
                          <span className="rb rb-etc" style={{ width: `${(c.expired_count / total) * 100}%` }} />
                        )}
                      </div>
                      <StatusBadge status={c.overall_status} />
                    </Link>
                  )
                })}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
