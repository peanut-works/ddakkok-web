import type {
  AuthResponse,
  ChildDetail,
  ChildListItem,
  Classroom,
  DashboardSummary,
  SafetyCheckDetail,
  SafetyCheckListItem,
} from './types'
import type { Status } from './types'
import {
  MOCK_AUTH,
  MOCK_CHILD_DETAILS,
  MOCK_CHECK_DETAILS,
  MOCK_CHILDREN_BY_CLASSROOM,
  MOCK_CLASSROOMS,
  MOCK_DASHBOARD,
  MOCK_SAFETY_CHECKS,
} from './mockData'

const BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')

const TOKEN_KEY = 'ddakkok.token'
const USER_KEY = 'ddakkok.user'
const MOCK_MODE_KEY = 'ddakkok.mockMode'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function isMockMode(): boolean {
  return localStorage.getItem(MOCK_MODE_KEY) === '1'
}

function setMockMode(on: boolean) {
  if (on) localStorage.setItem(MOCK_MODE_KEY, '1')
  else localStorage.removeItem(MOCK_MODE_KEY)
}

export function setSession(auth: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, auth.access_token)
  localStorage.setItem(USER_KEY, JSON.stringify({ ...auth.user, login_method: auth.login_method }))
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  setMockMode(false)
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function isNetworkError(e: unknown): boolean {
  return e instanceof TypeError && (e.message.includes('fetch') || e.message.includes('network') || e.message.includes('Failed'))
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (res.status === 401) {
    clearSession()
    window.location.href = '/'
    throw new ApiError(401, '인증이 만료되었습니다. 다시 로그인해주세요.')
  }

  if (!res.ok) {
    let message = `요청에 실패했습니다 (${res.status})`
    try {
      const body = await res.json()
      message = body?.error?.message ?? body?.detail?.[0]?.msg ?? message
    } catch {
      /* keep default message */
    }
    throw new ApiError(res.status, message)
  }

  return res.json() as Promise<T>
}

/** 오프라인 목 API — 백엔드 없이도 동작 */
const mockApi = {
  demoLogin(): AuthResponse {
    setMockMode(true)
    return MOCK_AUTH
  },
  classrooms(): Classroom[] {
    return MOCK_CLASSROOMS
  },
  childrenByClassroom(classroomId: number): ChildListItem[] {
    return MOCK_CHILDREN_BY_CLASSROOM[classroomId] ?? []
  },
  childDetail(childId: number): ChildDetail {
    const c = MOCK_CHILD_DETAILS[childId]
    if (!c) throw new ApiError(404, '아동 정보를 찾을 수 없습니다.')
    return c
  },
  safetyChecks(params: { status?: string } = {}): SafetyCheckListItem[] {
    if (!params.status) return MOCK_SAFETY_CHECKS
    return MOCK_SAFETY_CHECKS.filter((c) => c.overall_status === (params.status as Status))
  },
  safetyCheckDetail(checkId: number): SafetyCheckDetail {
    const c = MOCK_CHECK_DETAILS[checkId]
    if (!c) throw new ApiError(404, '검사 결과를 찾을 수 없습니다.')
    return c
  },
  dashboardSummary(): DashboardSummary {
    return MOCK_DASHBOARD
  },
}

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 180))
}

export const api = {
  async login(email: string, password: string) {
    return request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, login_method: 'EMAIL' }),
    })
  },

  async demoLogin(): Promise<AuthResponse> {
    try {
      const auth = await request<AuthResponse>('/api/auth/demo', { method: 'POST' })
      setMockMode(false)
      return auth
    } catch (e) {
      if (isNetworkError(e)) {
        return delay(mockApi.demoLogin())
      }
      throw e
    }
  },

  async classrooms(): Promise<Classroom[]> {
    if (isMockMode()) return delay(mockApi.classrooms())
    try {
      return await request<Classroom[]>('/api/classrooms')
    } catch (e) {
      if (isNetworkError(e)) return delay(mockApi.classrooms())
      throw e
    }
  },

  async childrenByClassroom(classroomId: number): Promise<ChildListItem[]> {
    if (isMockMode()) return delay(mockApi.childrenByClassroom(classroomId))
    try {
      return await request<ChildListItem[]>(`/api/classrooms/${classroomId}/children`)
    } catch (e) {
      if (isNetworkError(e)) return delay(mockApi.childrenByClassroom(classroomId))
      throw e
    }
  },

  async childDetail(childId: number): Promise<ChildDetail> {
    if (isMockMode()) return delay(mockApi.childDetail(childId))
    try {
      return await request<ChildDetail>(`/api/children/${childId}`)
    } catch (e) {
      if (isNetworkError(e)) return delay(mockApi.childDetail(childId))
      throw e
    }
  },

  async safetyChecks(
    params: { classroom_id?: number; status?: string; limit?: number; offset?: number } = {},
  ): Promise<SafetyCheckListItem[]> {
    if (isMockMode()) return delay(mockApi.safetyChecks(params))
    const search = new URLSearchParams()
    if (params.classroom_id != null) search.set('classroom_id', String(params.classroom_id))
    if (params.status) search.set('status', params.status)
    if (params.limit != null) search.set('limit', String(params.limit))
    if (params.offset != null) search.set('offset', String(params.offset))
    const qs = search.toString()
    try {
      return await request<SafetyCheckListItem[]>(`/api/safety-checks${qs ? `?${qs}` : ''}`)
    } catch (e) {
      if (isNetworkError(e)) return delay(mockApi.safetyChecks(params))
      throw e
    }
  },

  async safetyCheckDetail(checkId: number): Promise<SafetyCheckDetail> {
    if (isMockMode()) return delay(mockApi.safetyCheckDetail(checkId))
    try {
      return await request<SafetyCheckDetail>(`/api/safety-checks/${checkId}`)
    } catch (e) {
      if (isNetworkError(e)) return delay(mockApi.safetyCheckDetail(checkId))
      throw e
    }
  },

  async dashboardSummary(classroomId?: number): Promise<DashboardSummary> {
    if (isMockMode()) return delay(mockApi.dashboardSummary())
    const qs = classroomId != null ? `?classroom_id=${classroomId}` : ''
    try {
      return await request<DashboardSummary>(`/api/dashboard/summary${qs}`)
    } catch (e) {
      if (isNetworkError(e)) return delay(mockApi.dashboardSummary())
      throw e
    }
  },
}
