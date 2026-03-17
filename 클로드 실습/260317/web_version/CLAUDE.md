<!-- 생성일시: 2026-03-17 -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개요

손글씨 숫자 인식기의 **웹 버전**. 브라우저에서 동작하며 별도 설치 불필요.

## 기술 스택 방향

- HTML5 Canvas — 손글씨 입력
- TensorFlow.js — 브라우저 내 모델 추론
- 순수 HTML/CSS/JS (프레임워크 없이 단일 파일로 유지)

## 실행 방법

브라우저에서 `index.html`을 직접 열거나, 로컬 서버 사용:

```bash
python -m http.server 8000
```

## 주요 설계 원칙

- 서버 없이 동작하는 **완전한 클라이언트 사이드** 앱
- 모델은 TensorFlow.js로 브라우저 내에서 직접 추론
- 단일 `index.html` 파일로 배포 가능하게 유지
