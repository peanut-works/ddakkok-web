import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { getLocalChild, isLocalChildId, mergeChildDetail, saveLocalEdit } from '../lib/localChildren'
import { ageFromBirth, formatDate } from '../lib/status'
import ChildFormModal from '../components/ChildFormModal'
import type { ChildFormValues } from '../components/ChildFormModal'
import type { ChildDetail as ChildDetailType } from '../lib/types'
import './child-detail.css'

export default function ChildDetail() {
  const { childId } = useParams()
  const id = Number(childId)
  const [child, setChild] = useState<(ChildDetailType & { isLocal?: boolean }) | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)

  const load = useCallback(() => {
    setError(null)
    if (isLocalChildId(id)) {
      const local = getLocalChild(id)
      if (local) setChild(local)
      else setError('아동 정보를 찾을 수 없습니다.')
      return
    }
    api
      .childDetail(id)
      .then((c) => setChild(mergeChildDetail(c)))
      .catch((e) => setError(e instanceof Error ? e.message : '아동 정보를 불러오지 못했습니다.'))
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  function handleEdit(values: ChildFormValues) {
    saveLocalEdit(id, {
      name: values.name,
      birth_date: values.birth_date,
      gender: values.gender,
      memo: values.memo,
      health_profile: values.health_profile,
    })
    setEditing(false)
    load()
  }

  const hp = child?.health_profile

  return (
    <div>
      <Link to="/children" className="back-link">
        ← 아동 목록으로
      </Link>

      {error && <div className="error-banner">{error}</div>}
      {!child && !error && <div className="spinner" />}

      {child && (
        <>
          <div className="cd-header card rise">
            <div className="cd-avatar">{child.name.charAt(0)}</div>
            <div className="cd-head-info">
              <h1>
                {child.name}
                {child.isLocal && <span className="local-tag">신규</span>}
              </h1>
              <span className="cd-meta">
                {[
                  ageFromBirth(child.birth_date),
                  child.gender === 'M' ? '남아' : child.gender === 'F' ? '여아' : null,
                  child.birth_date ? `생일 ${formatDate(child.birth_date)}` : null,
                ]
                  .filter(Boolean)
                  .join(' · ') || '기본 정보 미입력'}
              </span>
              {child.memo && <span className="cd-memo">📌 {child.memo}</span>}
            </div>
            <button className="btn btn-soft" onClick={() => setEditing(true)}>
              ✏️ 수정
            </button>
          </div>

          <div className="cd-grid">
            <section className="card cd-section rise" style={{ animationDelay: '0.08s' }}>
              <h2 className="section-title">🚫 알레르기</h2>
              {hp?.allergies?.length ? (
                <div className="cd-chips">
                  {hp.allergies.map((a) => (
                    <span className="chip chip-danger" key={a}>
                      {a}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="cd-empty">등록된 알레르기가 없어요.</p>
              )}
            </section>

            <section className="card cd-section rise" style={{ animationDelay: '0.14s' }}>
              <h2 className="section-title">🧴 피부 상태</h2>
              {hp?.skin_conditions?.length ? (
                <div className="cd-chips">
                  {hp.skin_conditions.map((s) => (
                    <span className="chip chip-yellow" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="cd-empty">등록된 피부 상태가 없어요.</p>
              )}
            </section>

            <section className="card cd-section rise" style={{ animationDelay: '0.2s' }}>
              <h2 className="section-title">⚗️ 민감 성분</h2>
              {hp?.sensitive_ingredients?.length ? (
                <div className="cd-chips">
                  {hp.sensitive_ingredients.map((s) => (
                    <span className="chip chip-blue" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="cd-empty">등록된 민감 성분이 없어요.</p>
              )}
            </section>

            <section className="card cd-section rise" style={{ animationDelay: '0.26s' }}>
              <h2 className="section-title">📝 건강 메모</h2>
              {hp?.notes ? <p className="cd-notes">{hp.notes}</p> : <p className="cd-empty">건강 메모가 없어요.</p>}
            </section>
          </div>
        </>
      )}

      {editing && child && (
        <ChildFormModal title={`${child.name} 정보 수정`} initial={child} onSubmit={handleEdit} onClose={() => setEditing(false)} />
      )}
    </div>
  )
}
