# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

집 구조를 캔버스에 그리고 가구·서랍별로 물건을 기록해 검색으로 위치를 찾는 웹 앱. TanStack Start(SSR) + React 19 + react-konva + Zustand. Netlify에 배포됨 (https://219-mini-games.netlify.app/workspace).

## 명령어

```bash
npm run dev              # 개발 서버 (port 3000)
npm run build            # vite build (Netlify publish 대상: dist/client)
npm run test             # vitest run (단일 테스트: npx vitest run <파일경로>)
npm run check            # biome check (lint + format 통합)
npm run lint             # biome lint
npm run format           # biome format
npm run generate-routes  # tsr generate — routeTree.gen.ts 재생성
```

- 테스트 파일은 아직 없음. vitest + @testing-library/react + jsdom 세팅만 되어 있음.
- Biome 규칙: 탭 인덴트, 싱글 쿼트. `src/routeTree.gen.ts`는 자동 생성 파일이라 직접 수정·포맷 금지.

## 아키텍처

### 상태: 단일 Zustand 스토어가 전부

`src/store/useHomeStore.ts` 하나가 도메인 상태 전체의 단일 소스. 데이터 모델은 중첩 구조:

- `Room[]` — 캔버스 좌표(x, y, width, height)와 색상
- `Furniture[]` — `roomId`로 방에 속함. 각 Furniture가 `drawers: Drawer[]`를 내장하고, 각 Drawer가 `items: Item[]`을 내장
- 즉 서랍·물건은 별도 배열이 아니라 **furniture 배열 안에 통째로 중첩**되어 있고, 모든 수정은 furniture 배열의 불변 map/filter로 이뤄짐

주요 규칙:

- **모든 뮤테이션 액션은 첫 줄에서 `saveSnapshot()` 호출** — undo/redo가 `{rooms, furniture}` 스냅샷 스택(`_past`/`_future`, 최대 50개)으로 동작하므로, 상태를 바꾸는 새 액션을 추가하면 반드시 스냅샷부터 저장할 것. 선택 상태(selectedRoomId 등)는 스냅샷에 포함되지 않음
- `persist` 미들웨어로 localStorage(`home-finder-data`)에 자동 저장. `partialize`로 `rooms`/`furniture`만 저장 — 선택/검색/히스토리 상태는 저장 안 됨
- 타입 정의는 `src/components/home-item-finder/types.ts`

### 라우팅: TanStack Start 파일 기반

`src/routes/`의 파일이 곧 라우트. 실제 앱은 `/workspace` 하나(`workspace.tsx`). 라우트 추가/삭제 시 `npm run generate-routes`로 `routeTree.gen.ts`를 갱신해야 함 (dev 서버 실행 중엔 플러그인이 자동 갱신).

### 캔버스: react-konva, SSR 회피 필수

- `Canvas.tsx`는 Konva 기반이라 **`workspace.tsx`에서 `lazy()` + `Suspense`로 클라이언트 전용 로드**. Konva는 SSR과 충돌하므로 이 패턴을 깨지 말 것 (`vite.config.ts`의 `ssr.noExternal: ['konva', 'react-konva']`도 같은 이유)
- 캔버스는 그리드 스냅(20px), 줌/팬(ViewTransform), 방 그리기 모드, 우클릭 컨텍스트 메뉴를 자체 관리
- **DOM UI ↔ 캔버스 통신은 CustomEvent 사용**: 사이드바의 "방 추가" 버튼이 `window.dispatchEvent(new CustomEvent('canvas:startDrawing'))`으로 캔버스의 그리기 모드를 켬. props drilling 대신 이 패턴을 씀

### 컴포넌트·스타일 컨벤션

- 도메인 컴포넌트는 `src/components/home-item-finder/`에 모여 있음: Canvas(캔버스), Sidebar(방 목록·가구 추가), DetailPanel(가구 클릭 시 서랍·물건 편집), SearchBar(검색 + 결과 드롭다운)
- styled-components는 컴포넌트별 `*.styles.ts` 파일로 분리 (예: `Canvas.tsx` ↔ `Canvas.styles.ts`). transient prop은 `$` 접두사 (`$danger`)
- import 경로는 `#/*` alias 사용 (= `./src/*`)

### 도메인 동작 불변식

- 가구는 소속 방 경계 밖으로 못 나감. 방을 이동하면 안의 가구도 같이 이동 (`moveRoomWithFurniture`)
- 방 삭제 시 소속 가구(및 중첩된 서랍·물건)도 함께 삭제됨
- 가구 선택 시 소속 방도 함께 선택됨 (`selectFurniture`)
