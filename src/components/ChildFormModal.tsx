import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ChildDetail, ChildHealthProfile } from '../lib/types'

export interface ChildFormValues {
  name: string
  birth_date: string | null
  gender: string | null
  memo: string | null
  health_profile: ChildHealthProfile
}

interface Props {
  title: string
  initial?: Partial<ChildDetail>
  onSubmit: (values: ChildFormValues) => void
  onClose: () => void
}

function toCsv(list?: string[] | null): string {
  return (list ?? []).join(', ')
}

function fromCsv(text: string): string[] {
  return text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export default function ChildFormModal({ title, initial, onSubmit, onClose }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [birthDate, setBirthDate] = useState(initial?.birth_date ?? '')
  const [gender, setGender] = useState(initial?.gender ?? '')
  const [memo, setMemo] = useState(initial?.memo ?? '')
  const [allergies, setAllergies] = useState(toCsv(initial?.health_profile?.allergies))
  const [skinConditions, setSkinConditions] = useState(toCsv(initial?.health_profile?.skin_conditions))
  const [sensitive, setSensitive] = useState(toCsv(initial?.health_profile?.sensitive_ingredients))
  const [notes, setNotes] = useState(initial?.health_profile?.notes ?? '')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit({
      name: name.trim(),
      birth_date: birthDate || null,
      gender: gender || null,
      memo: memo.trim() || null,
      health_profile: {
        allergies: fromCsv(allergies),
        skin_conditions: fromCsv(skinConditions),
        sensitive_ingredients: fromCsv(sensitive),
        notes: notes.trim() || null,
      },
    })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="cf-name">이름 *</label>
            <input id="cf-name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="예: 강민준" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field">
              <label htmlFor="cf-birth">생년월일</label>
              <input id="cf-birth" type="date" value={birthDate ?? ''} onChange={(e) => setBirthDate(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="cf-gender">성별</label>
              <select id="cf-gender" value={gender ?? ''} onChange={(e) => setGender(e.target.value)}>
                <option value="">선택 안 함</option>
                <option value="M">남아</option>
                <option value="F">여아</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="cf-allergies">알레르기 (쉼표로 구분)</label>
            <input
              id="cf-allergies"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="예: 우유, 땅콩"
            />
          </div>

          <div className="field">
            <label htmlFor="cf-skin">피부 상태 (쉼표로 구분)</label>
            <input
              id="cf-skin"
              value={skinConditions}
              onChange={(e) => setSkinConditions(e.target.value)}
              placeholder="예: 아토피, 민감성 피부"
            />
          </div>

          <div className="field">
            <label htmlFor="cf-sensitive">민감 성분 (쉼표로 구분)</label>
            <input
              id="cf-sensitive"
              value={sensitive}
              onChange={(e) => setSensitive(e.target.value)}
              placeholder="예: 향료, 에탄올"
            />
          </div>

          <div className="field">
            <label htmlFor="cf-notes">건강 메모</label>
            <textarea
              id="cf-notes"
              rows={2}
              value={notes ?? ''}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="예: 우유 및 우유 유래 성분 접촉 주의"
            />
          </div>

          <div className="field">
            <label htmlFor="cf-memo">일반 메모</label>
            <input id="cf-memo" value={memo ?? ''} onChange={(e) => setMemo(e.target.value)} placeholder="예: 우유 알레르기 주의" />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-soft" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn btn-primary">
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
