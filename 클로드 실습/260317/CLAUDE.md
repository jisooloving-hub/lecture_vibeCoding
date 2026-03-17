# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 실행 방법

```bash
python digit_recognizer.py
```

## 의존성 설치

```bash
pip install scikit-learn pillow
```

`tkinter`는 Python 표준 라이브러리에 포함되어 있어 별도 설치 불필요.

## 아키텍처

단일 파일(`digit_recognizer.py`)로 구성된 손글씨 숫자 인식 GUI 앱.

**모델 학습 — `HandwritingRecognizer._train_model`**
- `sklearn.datasets.load_digits()` 사용 (8×8 해상도, 1797개 샘플, 다운로드 불필요)
- SVM RBF 커널 (`C=10`, `gamma='scale'`, `probability=True`)
- `StandardScaler`로 정규화 후 학습, 테스트 정확도 약 98%

**예측 파이프라인 — `HandwritingRecognizer._predict`**
1. 280×280 tkinter 캔버스에서 마우스로 그린 흰 획을 PIL 이미지에 동기화
2. GaussianBlur 적용 후 그려진 영역만 **바운딩 박스 크롭**
3. 정사각형 캔버스에 중앙 배치 → 8×8 리사이즈
4. 0–16 범위로 정규화 (sklearn digits 포맷) → `StandardScaler` 변환 → SVM 예측

> **주의:** 크롭 없이 280×280 전체를 8×8로 줄이면 픽셀 밀도가 너무 낮아져 모든 입력이 동일한 숫자로 예측된다. 반드시 크롭 후 리사이즈해야 한다.
