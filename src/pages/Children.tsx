import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import { addLocalChild, getLocalChild, isLocalChildId, mergeChildDetail, mergeChildList } from '../lib/localChildren'
import { ageFromBirth } from '../lib/status'
import ChildFormModal from '../components/ChildFormModal'
import type { ChildFormValues } from '../components/ChildFormModal'
import type { ChildDetail, ChildListItem, Classroom } from '../lib/types'
import './children.css'

type MergedChild = ChildListItem & { isLocal?: boolean }

const AVATAR_PALETTES = [
  'linear-gradient(135deg, #7AA4FA, #2A66F7)',
  'linear-gradient(135deg, #FFD86B, #F0A800)',
  'linear-gradient(135deg, #FF9D9D, #FF6B6B)',
  'linear-gradient(135deg, #7FD8A8, #2BA86A)',
  'linear-gradient(135deg, #C2A8F5, #8B5CF6)',
  'linear-gradient(135deg, #8AD5EC, #2BA3C9)',
]

export default function Children() {
  const { user } = useAuth()
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [children, setChildren] = useState<MergedChild[] | null>(null)
  const [details, setDetails] = useState<Record<number, ChildDetail>>({})
  const [error, setError] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    api
      .classrooms()
      .then((rooms) => {
        setClassrooms(rooms)
        const preferred = rooms.find((r) => r.id === user?.classroom?.id) ?? rooms[0]
        if (preferred) setSelected(preferred.id)
      })
      .catch((e) => setError(e instanceof Error ? e.message : '반 목록을 불러오지 못했습니다.'))
  }, [user?.classroom?.id])

  const loadChildren = useCallback((classroomId: number) => {
    setChildren(null)
    api
      .childrenByClassroom(classroomId)
      .then(async (list) => {
        const merged = mergeChildList(classroomId, list)
        setChildren(merged)
        // 카드에 알레르기·피부 칩을 보여주기 위해 상세를 병렬 로드
        const pairs = await Promise.all(
          merged.map(async (c) => {
            if (isLocalChildId(c.id)) {
              const local = getLocalChild(c.id)
              return local ? ([c.id, local] as const) : null
            }
            try {
              const d = await api.childDetail(c.id)
              return [c.id, mergeChildDetail(d)] as const
            } catch {
              return null
            }
          }),
        )
        const map: Record<number, ChildDetail> = {}
        for (const p of pairs) if (p) map[p[0]] = p[1]
        setDetails(map)
      })
      .catch((e) => setError(e instanceof Error ? e.message : '아동 목록을 불러오지 못했습니다.'))
  }, [])

  useEffect(() => {
    if (selected != null) loadChildren(selected)
  }, [selected, loadChildren])

  function handleAdd(values: ChildFormValues) {
    if (selected == null || !user) return
    addLocalChild(selected, user.facility.id, {
      name: values.name,
      birth_date: values.birth_date,
      gender: values.gender,
      memo: values.memo,
      health_profile: values.health_profile,
    })
    setShowAdd(false)
    loadChildren(selected)
  }

  const selectedRoom = classrooms.find((r) => r.id === selected)

  const allergyCount = Object.values(details).filter((d) => (d.health_profile?.allergies?.length ?? 0) > 0).length
  const skinCount = Object.values(details).filter(
    (d) =>
      (d.health_profile?.skin_conditions?.length ?? 0) > 0 ||
      (d.health_profile?.sensitive_ingredients?.length ?? 0) > 0,
  ).length

  return (
    <div>
      <div className="children-header rise">
        <div>
          <h1 className="page-title">아동 관리</h1>
          <p className="page-sub">반별 아동의 알레르기·피부 상태를 관리해요.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)} disabled={selected == null}>
          + 아동 추가
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="classroom-tabs rise" style={{ animationDelay: '0.08s' }}>
        {classrooms.map((room) => (
          <button
            key={room.id}
            className={`classroom-tab${room.id === selected ? ' active' : ''}`}
            onClick={() => setSelected(room.id)}
          >
            {room.name}
            {room.age_group && <span className="classroom-age">{room.age_group}</span>}
          </button>
        ))}
      </div>

      {children != null && (
        <div className="children-stats rise" style={{ animationDelay: '0.14s' }}>
          <div className="cstat">
            <strong>{children.length}</strong>
            <span>{selectedRoom?.name ?? ''} 인원</span>
          </div>
          <div className="cstat cstat-danger">
            <strong>{allergyCount}</strong>
            <span>알레르기 보유</span>
          </div>
          <div className="cstat cstat-yellow">
            <strong>{skinCount}</strong>
            <span>피부·민감 주의</span>
          </div>
        </div>
      )}

      {children == null && !error && <div className="spinner" />}

      {children != null && children.length === 0 && (
        <div className="card empty-state">
          {selectedRoom?.name ?? '이 반'}에 등록된 아동이 없어요. 위의 ‘아동 추가’ 버튼으로 등록해보세요.
        </div>
      )}

      {children != null && children.length > 0 && (
        <div className="children-grid">
          {children.map((child, i) => {
            const hp = details[child.id]?.health_profile
            const allergies = hp?.allergies ?? []
            const skins = hp?.skin_conditions ?? []
            const clean = allergies.length === 0 && skins.length === 0
            return (
              <Link
                to={`/children/${child.id}`}
                className="card child-card rise"
                style={{ animationDelay: `${0.18 + i * 0.06}s` }}
                key={child.id}
              >
                <div className="child-card-top">
                  <div className="child-avatar" style={{ background: AVATAR_PALETTES[i % AVATAR_PALETTES.length] }}>
                    {child.name.charAt(0)}
                  </div>
                  <div className="child-info">
                    <h3>
                      {child.name}
                      {child.isLocal && <span className="local-tag">신규</span>}
                    </h3>
                    <span className="child-meta">
                      {[ageFromBirth(child.birth_date), child.gender === 'M' ? '남아' : child.gender === 'F' ? '여아' : null]
                        .filter(Boolean)
                        .join(' · ') || '정보 미입력'}
                    </span>
                  </div>
                  <span className="child-arrow" aria-hidden>
                    ›
                  </span>
                </div>
                <div className="child-chips">
                  {allergies.slice(0, 3).map((a) => (
                    <span className="chip chip-danger" key={a}>
                      🚫 {a}
                    </span>
                  ))}
                  {skins.slice(0, 2).map((s) => (
                    <span className="chip chip-yellow" key={s}>
                      {s}
                    </span>
                  ))}
                  {clean && <span className="chip chip-blue">특이사항 없음</span>}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {showAdd && (
        <ChildFormModal
          title={`${selectedRoom?.name ?? ''} 아동 추가`}
          onSubmit={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  )
}
