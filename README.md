# 딱콕 웹 프론트엔드 (ddakkok-web)

영유아 맞춤 제품 안전관리 서비스 **딱콕**의 학교 발표용 데모 웹사이트입니다.
기존 FastAPI 백엔드를 그대로 사용하며, 웹 프론트엔드만 포함합니다.

## 실행 방법

```bash
npm install
npm run dev      # 개발 서버 (기본 5173, 사용 중이면 5174)
npm run build    # 프로덕션 빌드 (dist/)
```

## 환경변수

`.env` 파일로 주입합니다.

```
VITE_API_URL=http://localhost:8000   # 백엔드 API 베이스 URL (끝에 / 없이)
VITE_WAITLIST_KEY=                    # 출시 알림 이메일 수집용 Web3Forms access key
```

### 출시 알림(이메일 수집) 연결 방법

랜딩 페이지 하단의 **출시 알림 신청** 폼은 백엔드를 거치지 않고
[Web3Forms](https://web3forms.com)로 이메일을 전송합니다.

1. https://web3forms.com 에서 **받을 이메일 주소**만 입력하면 access key가 발급됩니다(무료, 가입 불필요).
2. `.env` 에 `VITE_WAITLIST_KEY=발급받은키` 를 넣고 재빌드합니다.
3. 이제 신청이 들어올 때마다 지정한 메일함으로 도착합니다.

키를 비워두면 **데모 모드**로 동작합니다 — 이메일을 브라우저(localStorage)에만 저장하고
신청 완료 화면은 정상적으로 보여줍니다. 발표 중 네트워크가 끊겨도 화면이 깨지지 않습니다.

> 다른 폼 서비스(Formspree/Getform 등)를 쓰려면 `VITE_WAITLIST_URL` 로 엔드포인트를 바꾸세요.
> 기본값은 Web3Forms입니다.

## 페이지 구성

| 경로 | 설명 |
| --- | --- |
| `/` | 서비스 소개 랜딩 페이지 — 로그인 / **체험하기** 버튼 |
| `/login` | 교사 계정 로그인 (`teacher@ddakkok.com` / `ddakkok1234`) |
| `/dashboard` | 홈 — 회수·리콜 알림, 유통기한 알림, 주의 제품 |
| `/children` | 반별 아동 목록 + 아동 추가 |
| `/children/:id` | 아동 상세 (알레르기·피부 상태·민감 성분) + 수정 |
| `/checks` | 안전 검사 이력 (상태 필터) |
| `/checks/:id` | 검사 상세 — 아동별 판정, 성분, AI 설명 |

**체험하기** 버튼은 `POST /api/auth/demo`를 호출해 토큰을 받고 바로 대시보드로 진입합니다.

## 참고: 아동 추가·수정 동작

백엔드에 아동 생성/수정 API가 없어(조회만 제공), 추가·수정 내용은
브라우저 `localStorage`에 저장하고 서버 데이터와 병합해 표시합니다.
백엔드는 일절 수정하지 않았습니다. 새로 추가한 아동은 "신규" 태그가 붙습니다.

## 랜딩 페이지 에셋 슬롯

아래 파일을 `public/assets/` 에 넣으면 **코드 수정 없이** 자동으로 표시됩니다.
파일이 없으면 안내 플레이스홀더가 대신 보여요.

| 파일명 | 용도 | 권장 스펙 |
| --- | --- | --- |
| `scrub.mp4` | 스크롤하면 재생/역재생되는 시연 영상 | mp4(H.264), 5~12초, 가로 1280px+, **모든 프레임 키프레임** (`ffmpeg -i in.mp4 -g 1 -an scrub.mp4`) |
| `teacher.jpg` | "현장의 목소리" 교사 사용 장면 | 4:3, 800px+ |
| `kids.jpg` | "현장의 목소리" 아이들 활동 사진 | 4:3, 800px+ |

검증용 스크린샷 스크립트: `node scripts/shoot.mjs` (로컬 크롬 필요)

## 기술 스택

- Vite + React 18 + TypeScript
- react-router-dom
- 순수 CSS (모바일 앱과 동일한 브랜드 컬러 팔레트, Pretendard 폰트)
