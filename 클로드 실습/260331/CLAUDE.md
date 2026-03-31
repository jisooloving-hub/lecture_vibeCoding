# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트

`quiz-app/` — React + TypeScript + Vite 기반 상식 퀴즈 게임

## 실행 명령

```bash
cd quiz-app
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드 (타입 검사 포함)
npm run preview  # 빌드 결과 미리보기
```

## 기술 스택

- React 19 + TypeScript (`verbatimModuleSyntax` 활성화 → 타입은 반드시 `import type`)
- Vite 8
- Zustand 5 (전역 상태)
- React Router DOM 7
- Tailwind CSS v4 (`@tailwindcss/vite` 플러그인, `index.css`에 `@import "tailwindcss"`)

## 아키텍처

```
src/
  data/questions.ts     # 40문제 데이터 (한국사·과학·지리·일반상식 각 10문제)
  store/quizStore.ts    # Zustand 전역 상태
  pages/
    HomePage.tsx        # 카테고리 선택
    QuizPage.tsx        # 문제 풀기 + 즉시 피드백
    ResultPage.tsx      # 최종 점수 + 닉네임 모달 → localStorage 저장
    LeaderboardPage.tsx # localStorage 상위 10개 표시
  App.tsx               # BrowserRouter 라우팅 (/, /quiz, /result, /leaderboard)
```

### 상태 흐름 (quizStore)

`idle` → `startGame(category)` → `playing` → `submitAnswer(idx)` + `nextQuestion()` 반복 → `finished`

- `resetGame()` : 모든 상태 초기화 → `idle`
- QuizPage·ResultPage는 `gameStatus`를 감시해 잘못된 경로 접근 시 자동 리다이렉트

### 점수 저장 (localStorage)

키: `quiz_scores` / 형태: `{ nickname, score, total, category, date }[]`
ResultPage에서 닉네임 입력 모달 → 저장 → LeaderboardPage로 이동

### 퀴즈 문제 교차 검증 가이드라인 ###

모든 문제 작성 시 확인 사항
1. 정답이 하나뿐인가?
-다른 해석 가능 시 조건 명시 (예 : 면적 기준, 2026년기준)

2.최상급 표현에 기준이 있는가?
-'가장 큰', '최초의' 등 표현에 측정 기준 명시

3. 시간과 범위가 명확한가?
- 변할 수 있는 정보는 시점 명시
- 지리적, 분류적 범위 한정

4. 교차 검증했는가?
- 의심스러운 정보는 2개 이상 출처 확인
- 논란 있는 내용은 주류 학설 기준
