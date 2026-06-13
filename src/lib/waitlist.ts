// 출시 알림 이메일 수집.
// 백엔드를 건드리지 않고 Web3Forms(또는 호환 엔드포인트)로 전송하며,
// 항상 localStorage 에도 저장해 발표 데모 중에는 절대 실패하지 않는다.
//
// 연결 방법(.env):
//   VITE_WAITLIST_KEY=<web3forms access key>     // https://web3forms.com 에서 이메일만으로 무료 발급
//   VITE_WAITLIST_URL=https://api.web3forms.com/submit   // (선택) 다른 서비스로 바꿀 때만
//
// 키가 없으면 로컬 저장만 하고 성공 처리(데모 모드).

const STORE_KEY = 'ddakkok.waitlist'
const ENDPOINT = import.meta.env.VITE_WAITLIST_URL ?? 'https://api.web3forms.com/submit'
const ACCESS_KEY = import.meta.env.VITE_WAITLIST_KEY ?? ''

// 사회적 증거용 베이스 카운트 (데모에서 "이미 N명 신청" 느낌)
const BASE_COUNT = 84

interface Store {
  emails: string[]
}

export type JoinResult = 'ok' | 'duplicate' | 'invalid'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim())
}

function load(): Store {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* fall through */
  }
  return { emails: [] }
}

function save(store: Store) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store))
}

export function joinedEmail(): string | null {
  return load().emails[0] ?? null
}

export function hasJoined(): boolean {
  return load().emails.length > 0
}

export function waitlistCount(): number {
  return BASE_COUNT + load().emails.length
}

export async function joinWaitlist(emailRaw: string): Promise<JoinResult> {
  const email = emailRaw.trim().toLowerCase()
  if (!isValidEmail(email)) return 'invalid'

  const store = load()
  if (store.emails.includes(email)) return 'duplicate'

  // 실제 전송 (키가 설정된 경우에만). 실패해도 데모가 멈추지 않도록 조용히 로컬 저장.
  if (ACCESS_KEY) {
    try {
      await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: '[딱콕] 출시 알림 신청',
          from_name: '딱콕 랜딩페이지',
          email,
          source: 'ddakkok-landing-waitlist',
          submitted_at: new Date().toISOString(),
        }),
      })
    } catch {
      /* 네트워크 오류는 무시하고 로컬 저장으로 대체 */
    }
  }

  store.emails.push(email)
  save(store)
  return 'ok'
}
