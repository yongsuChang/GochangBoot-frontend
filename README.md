# 고창농악 전수 후기 백업 사이트 (프론트)

옛 게시판 글과 댓글을 보여주는 React + Vite 앱. API 는 [GochangBoot](https://github.com/yongsuChang/GochangBoot) 저장소.
운영: https://gochang-visitor.duckdns.org

## 실행

```bash
pnpm install
pnpm dev      # http://localhost:5173, /api 는 Vite 가 localhost:8080 으로 프록시
pnpm build    # dist/
pnpm lint
```

백엔드는 GochangBoot 저장소에서 `./gradlew bootRun --args='--spring.profiles.active=dev'` 로 샘플 데이터와 함께 띄운다.

## 화면

| 경로 | 페이지 | 사용하는 API |
|---|---|---|
| `/` | 목록, 검색, 페이지 크기 선택 | `/api/contents`, `/api/contents/search` |
| `/contents/:id` | 본문, 댓글 전체, 앞뒤 글 | `/api/contents/{id}`, `/api/replies/byContent/{id}`, `/api/contents/{id}/neighbors` |

```
src/
├── pages/       MainPage, DetailPage
├── components/  Navbar, BoardList, SearchBar, Pagination, PrevNext, ReplyList
└── hooks/       useBoardData(목록), useContentDetail(상세)
public/lib/      옛 사이트의 AdminLTE/Bootstrap CSS·JS (디자인 유지용, lint 제외)
```

## API 주소

프론트와 API 는 같은 도메인(nginx)에서 서빙되므로 `VITE_API_URL` 은 **비워 둔다.** 비어 있으면 `/api/...` 상대경로로 호출한다.
다른 도메인의 API 를 쓸 때만 `VITE_API_URL=https://...` 로 빌드한다 (그 경우 백엔드에 CORS 설정이 필요하다).

## 배포 (수동)

```bash
pnpm build
scp -r dist/* Oracle:/var/www/gochang/
```

nginx 가 `/var/www/gochang` 을 서빙하고, 없는 경로는 `index.html` 로 보낸다 (SPA 라우팅).
자동화하려면 GochangBoot 저장소의 `deploy/frontend-deploy.example.yml` 을 `.github/workflows/` 에 복사한다.
