// 백엔드에 아동 생성/수정 API가 없어 데모 화면에서는 localStorage 오버레이로
// 추가·수정 내용을 보관하고, 서버 데이터와 병합해 보여준다.
import type { ChildDetail, ChildHealthProfile, ChildListItem } from './types'

const STORAGE_KEY = 'ddakkok.localChildren'

export interface LocalChild extends ChildListItem {
  health_profile: ChildHealthProfile
  isLocal: true
}

export interface LocalEdit {
  name?: string
  birth_date?: string | null
  gender?: string | null
  memo?: string | null
  health_profile?: ChildHealthProfile
}

interface Store {
  added: LocalChild[]
  edits: Record<number, LocalEdit>
  nextId: number
}

function load(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* fall through to default */
  }
  return { added: [], edits: {}, nextId: 100001 }
}

function save(store: Store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function addLocalChild(
  classroomId: number,
  facilityId: number,
  data: Omit<LocalChild, 'id' | 'facility_id' | 'classroom_id' | 'is_active' | 'isLocal'>,
): LocalChild {
  const store = load()
  const child: LocalChild = {
    ...data,
    id: store.nextId,
    facility_id: facilityId,
    classroom_id: classroomId,
    is_active: true,
    isLocal: true,
  }
  store.added.push(child)
  store.nextId += 1
  save(store)
  return child
}

export function saveLocalEdit(childId: number, edit: LocalEdit) {
  const store = load()
  const added = store.added.find((c) => c.id === childId)
  if (added) {
    Object.assign(added, edit)
  } else {
    store.edits[childId] = { ...store.edits[childId], ...edit }
  }
  save(store)
}

export function mergeChildList(classroomId: number, serverChildren: ChildListItem[]): (ChildListItem & { isLocal?: boolean })[] {
  const store = load()
  const merged = serverChildren.map((c) => {
    const edit = store.edits[c.id]
    return edit ? { ...c, ...edit, health_profile: undefined } : c
  })
  const locals = store.added.filter((c) => c.classroom_id === classroomId)
  return [...merged, ...locals]
}

export function mergeChildDetail(serverChild: ChildDetail): ChildDetail & { isLocal?: boolean } {
  const store = load()
  const edit = store.edits[serverChild.id]
  if (!edit) return serverChild
  return {
    ...serverChild,
    ...edit,
    health_profile: edit.health_profile ?? serverChild.health_profile,
  }
}

export function getLocalChild(childId: number): LocalChild | undefined {
  return load().added.find((c) => c.id === childId)
}

export function isLocalChildId(childId: number): boolean {
  return childId >= 100001
}
