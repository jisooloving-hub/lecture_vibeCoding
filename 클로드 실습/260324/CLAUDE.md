# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

개인용 할 일 관리 웹앱. 서버 없이 `index.html`을 브라우저에서 직접 열어 실행한다.

## 실행 방법

빌드 도구 없음. `index.html`을 브라우저에서 직접 열면 된다.

```bash
# Windows
start index.html

# 또는 브라우저에서 파일 직접 열기
```

## 기술 제약

- **순수 Vanilla JS** — 외부 라이브러리, CDN, npm 패키지 사용 금지
- **단일 오리진 제약 없음** — `file://` 프로토콜로 직접 실행되므로 fetch/XHR 불필요
- **데이터 저장**: `localStorage` key `"todos"` 에 JSON 배열로 저장

## 아키텍처

3개 파일로 구성된 단순 구조:

```
index.html   — 레이아웃 마크업, style.css / app.js 연결
style.css    — 카테고리별 색상 뱃지 (업무=파랑, 개인=초록, 공부=주황)
app.js       — 전체 로직 (데이터 레이어 + DOM 조작 + 이벤트 핸들링)
```

### app.js 핵심 구조

| 레이어 | 함수 | 역할 |
|--------|------|------|
| 데이터 | `loadTodos()` / `saveTodos()` | localStorage 직렬화/역직렬화 |
| CRUD | `addTodo()` / `deleteTodo(id)` / `toggleDone(id)` / `editTodo(id, text)` | 상태 변경 후 반드시 `saveTodos()` 호출 |
| 렌더링 | `renderTodos()` / `renderProgress()` / `renderTabCounts()` | 상태 → DOM 전체 재렌더링 방식 |
| 다크모드 | `initDarkMode()` / `toggleDarkMode()` | localStorage `"darkMode"` 키로 유지 |
| 자동분류 | `autoClassify(text)` / `applyAutoClassify(text)` | 키워드 매칭으로 카테고리 자동 선택 |
| 데이터 IO | `exportTodos()` / `importTodos(file)` | JSON 파일 내보내기/가져오기 |

**데이터 흐름**: 사용자 이벤트 → CRUD 함수 → `saveTodos()` → `renderTodos()` + `renderProgress()`

### 데이터 모델

```js
// todos 배열의 단일 항목
{
  id: string,          // Date.now() + Math.random() 조합
  text: string,
  category: "업무" | "개인" | "공부",
  done: boolean,
  createdAt: number    // timestamp
}
```

### 상태 변수

- `todos` — 전체 할 일 배열 (localStorage와 항상 동기화)
- `currentFilter` — 현재 활성 카테고리 탭 (`'전체'` | `'업무'` | `'개인'` | `'공부'`)

### localStorage 키 목록

| 키 | 값 | 용도 |
|----|-----|------|
| `"todos"` | JSON 배열 | 할 일 데이터 |
| `"darkMode"` | `"true"` \| `"false"` | 다크모드 설정 유지 |

### CSS 테마 구조

모든 색상은 CSS 변수로 관리. 다크모드는 `body.dark { }` 에서 변수값만 덮어씌운다.
새로운 UI 컴포넌트 추가 시 하드코딩 색상 대신 반드시 기존 변수(`--bg-card`, `--text-main`, `--accent` 등)를 사용할 것.

### 자동 카테고리 분류

`CATEGORY_KEYWORDS` 객체에 카테고리별 키워드 배열이 정의돼 있다. 키워드 추가/수정은 이 객체만 편집하면 된다. 입력 중 실시간으로 동작하며, 자동 분류 후에도 사용자가 드롭다운으로 수동 변경 가능하다.

### 데이터 내보내기/가져오기

- 내보내기: `Blob` + 임시 `<a>` 태그로 `todos_YYYY-MM-DD.json` 다운로드
- 가져오기: 기존 데이터가 있으면 백업(내보내기) 여부를 먼저 confirm으로 확인 후 덮어씀

## 주요 UI 동작 규칙

- 항목 삭제: 확인 대화상자 없이 즉시 삭제
- 항목 수정: 텍스트 더블클릭 → inline `<input>` 전환 → 엔터/포커스아웃 시 저장, Esc 시 원복
- 완료 항목: 목록 하단으로 정렬, 취소선(`text-decoration: line-through`) 표시
- 빈 입력(공백 포함) 추가 차단
- 전체 완료 시 진행률 바 색상이 파랑 → 초록으로 전환
