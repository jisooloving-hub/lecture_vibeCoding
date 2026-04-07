# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

냉장고 사진을 업로드하면 AI가 재료를 인식하고 레시피를 추천하는 웹 애플리케이션.
OpenRouter API를 통해 두 개의 무료 모델을 사용한다.

## 실행 방법

```bash
# 의존성 설치
pip install flask requests python-dotenv

# 서버 실행
python app.py
# → http://localhost:5000 에서 접속
```

## 환경 변수

`.env` 파일에 아래 형식으로 저장 (`.gitignore`에 등록됨):
```
OPENROUTER_API_KEY=sk-or-v1-...
```

`.env.example`을 참고해 키를 발급받아 설정한다.

## 프로젝트 구조

```
app.py                  # Flask 백엔드 (API 키 관리 + OpenRouter 연동)
templates/
  step1.html            # 이미지 업로드 & 재료 인식
  step2.html            # 레시피 생성 & 저장
  step3.html            # 사용자 프로필 & 레시피 보관함
.env                    # API 키 (git 제외)
.env.example            # 키 구조 예시
PRD_step1.md            # Step 1 기획서
PRD_step2.md            # Step 2 기획서
PRD_step3.md            # Step 3 기획서
test_api.py             # API 동작 테스트 스크립트 (개발용)
test_api2.py            # fallback 모델 포함 API 테스트 스크립트
```

## 아키텍처

### 전체 흐름

```
/ (Step 1)  →  /step2 (Step 2)  →  /step3 (Step 3)
```

재료 목록은 `localStorage('ingredients')`로 Step 1 → Step 2에 전달된다.
사용자 정보와 저장 레시피는 `localStorage`에 보관하며 백엔드 DB가 없다.

### 백엔드 (app.py)

| 라우트 | 역할 |
|---|---|
| `GET /` | step1.html 렌더링 |
| `GET /step2` | step2.html 렌더링 |
| `GET /step3` | step3.html 렌더링 |
| `POST /analyze` | 이미지 → 재료 목록 반환 |
| `POST /recipe` | 재료 목록 → 레시피 3개 반환 |

API 키는 서버에서만 관리하며 프론트엔드에 노출되지 않는다.
`.env`를 `python-dotenv` 없이 직접 파싱한다 (`os.environ.setdefault`).

### 사용 모델

| 용도 | 모델 | 비고 |
|---|---|---|
| 이미지 인식 | `google/gemma-3-4b-it:free` | `google/gemma-3-27b-it:free` rate limit 시 대체 |
| 텍스트(레시피) | `qwen/qwen3.6-plus:free` | |

무료 모델은 upstream rate limit(429)이 간헐적으로 발생한다.

### 프론트엔드 상태 관리 (localStorage)

```
localStorage['ingredients']   # 재료 목록 (Step 1 → Step 2)
localStorage['user']          # 로그인 유저 { nickname, email, dietaryRestrictions }
localStorage['accounts']      # 회원 정보 { [email]: { nickname, email, pw, dietaryRestrictions } }
localStorage['savedRecipes']  # 저장된 레시피 배열
localStorage['pendingRecipe'] # 미로그인 상태에서 저장 시도한 레시피 (로그인 후 자동 복원)
```

### /recipe API 파라미터

```json
{
  "ingredients": ["재료1", "재료2"],
  "time_filter": "제한 없음 | 30분 | 1시간",
  "difficulty_filter": "전체 | 쉬움만",
  "dietary_restrictions": ["채식", "글루텐 프리"]
}
```

`dietary_restrictions`는 Step 3 프로필에서 설정하며, Step 2가 `localStorage['user']`에서 읽어 자동으로 전송한다.

### 레시피 파싱 (parse_recipes)

qwen 모델 응답을 `**요리명**:` 구분자로 블록 분리 후 정규식으로 각 필드를 추출한다.
파싱 실패 시 원문 텍스트를 steps 배열에 담아 그대로 반환한다.
