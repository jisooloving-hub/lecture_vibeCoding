<!-- 생성일시: 2026-03-17 -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개요

손글씨 숫자 인식기의 **데스크톱 버전**. 기존 `digit_recognizer.py`를 기반으로 발전.

## 기술 스택 방향

- Python + tkinter — GUI
- scikit-learn SVM — 모델 (sklearn 내장 digits 데이터셋, 8×8)
- Pillow — 이미지 전처리

## 의존성 설치

```bash
pip install scikit-learn pillow
```

## 실행 방법

```bash
python digit_recognizer.py
```

## 핵심 아키텍처

상위 폴더의 `digit_recognizer.py` 참고. 예측 시 반드시 **바운딩 박스 크롭 → 정사각형 패딩 → 8×8 리사이즈** 순서를 지켜야 정확도가 유지됨. 크롭 없이 전체 이미지를 축소하면 픽셀 밀도 부족으로 오인식 발생.
