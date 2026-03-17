#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
손글씨 숫자 인식 프로그램
- sklearn 내장 digits 데이터셋으로 SVM 모델 학습
- tkinter 캔버스에서 마우스로 숫자를 그리면 실시간 인식
"""

import tkinter as tk
import numpy as np
import warnings
from PIL import Image, ImageDraw, ImageFilter
from sklearn import datasets, svm
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

warnings.filterwarnings('ignore')


class HandwritingRecognizer:
    def __init__(self, root):
        self.root = root
        self.root.title("손글씨 숫자 인식기")
        self.root.configure(bg='#1E2A3A')
        self.root.resizable(False, False)

        # 캔버스 및 브러시 설정
        self.canvas_size = 280
        self.brush_size = 18
        self.drawing = False

        # PIL 이미지 초기화 (검은 배경에 흰 글씨)
        self.pil_image = Image.new('L', (self.canvas_size, self.canvas_size), 0)
        self.pil_draw = ImageDraw.Draw(self.pil_image)

        # 모델 및 스케일러
        self.model = None
        self.scaler = None

        # UI 구성 및 모델 학습 순서 중요
        self._setup_ui()
        self._train_model()

    def _train_model(self):
        """
        sklearn 내장 digits 데이터셋으로 SVM 모델 학습
        - 별도 다운로드 불필요, 즉시 실행 가능
        - 8x8 픽셀 이미지 1797개 수록
        """
        self.status_label.config(text='모델 학습 중... 잠시 기다려 주세요')
        self.root.update()

        # 내장 digits 데이터 로드
        digits = datasets.load_digits()
        X = digits.images.reshape(len(digits.images), -1).astype('float32')
        y = digits.target

        # 학습/테스트 데이터 분리 (80:20)
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        # 데이터 정규화
        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)

        # SVM(RBF 커널) 분류기 학습 - 확률 출력 활성화
        self.model = svm.SVC(kernel='rbf', C=10, gamma='scale', probability=True)
        self.model.fit(X_train_scaled, y_train)

        accuracy = self.model.score(X_test_scaled, y_test)
        print(f"모델 학습 완료! 테스트 정확도: {accuracy * 100:.1f}%")
        self.status_label.config(
            text=f'준비 완료! (모델 정확도: {accuracy*100:.1f}%) — 아래 캔버스에 숫자를 그리세요'
        )

    def _setup_ui(self):
        """UI 위젯 배치"""

        # ── 제목 ──────────────────────────────────────────────
        tk.Label(
            self.root, text="✏️  손글씨 숫자 인식기",
            font=('맑은 고딕', 16, 'bold'),
            fg='white', bg='#1E2A3A'
        ).pack(pady=(12, 4))

        # ── 메인 영역 (캔버스 + 결과) ─────────────────────────
        main_frame = tk.Frame(self.root, bg='#1E2A3A')
        main_frame.pack(padx=20, pady=5)

        # 왼쪽: 그리기 캔버스
        left_frame = tk.Frame(main_frame, bg='#1E2A3A')
        left_frame.pack(side='left', padx=(0, 15))

        tk.Label(
            left_frame, text="숫자를 여기에 그리세요",
            font=('맑은 고딕', 9), fg='#7F8C8D', bg='#1E2A3A'
        ).pack()

        canvas_border = tk.Frame(left_frame, bg='#2ECC71', bd=2)
        canvas_border.pack()

        self.canvas = tk.Canvas(
            canvas_border,
            width=self.canvas_size, height=self.canvas_size,
            bg='black', cursor='pencil', highlightthickness=0
        )
        self.canvas.pack()

        # 마우스 이벤트 연결
        self.canvas.bind('<Button-1>', self._start_draw)
        self.canvas.bind('<B1-Motion>', self._draw)
        self.canvas.bind('<ButtonRelease-1>', self._stop_draw)

        # 오른쪽: 결과 패널
        right_frame = tk.Frame(main_frame, bg='#1E2A3A')
        right_frame.pack(side='left', fill='both')

        tk.Label(
            right_frame, text="인식 결과",
            font=('맑은 고딕', 11, 'bold'),
            fg='#BDC3C7', bg='#1E2A3A'
        ).pack()

        # 큰 숫자 표시
        self.digit_label = tk.Label(
            right_frame, text="?",
            font=('맑은 고딕', 72, 'bold'),
            fg='#F1C40F', bg='#1E2A3A', width=3
        )
        self.digit_label.pack()

        # 신뢰도 표시
        self.confidence_label = tk.Label(
            right_frame, text="신뢰도: -",
            font=('맑은 고딕', 11),
            fg='#ECF0F1', bg='#1E2A3A'
        )
        self.confidence_label.pack(pady=(0, 8))

        # 각 숫자별 확률 막대 그래프
        tk.Label(
            right_frame, text="숫자별 확률",
            font=('맑은 고딕', 9, 'bold'),
            fg='#7F8C8D', bg='#1E2A3A'
        ).pack()

        self.prob_bars = []
        self.prob_pct_labels = []
        bar_colors = [
            '#3498DB', '#2ECC71', '#E74C3C', '#F39C12', '#9B59B6',
            '#1ABC9C', '#E67E22', '#2980B9', '#8E44AD', '#27AE60'
        ]
        for i in range(10):
            row = tk.Frame(right_frame, bg='#1E2A3A')
            row.pack(fill='x', pady=1)

            tk.Label(row, text=str(i), font=('맑은 고딕', 8),
                     fg='white', bg='#1E2A3A', width=2).pack(side='left')

            bar_cv = tk.Canvas(row, width=150, height=13,
                               bg='#2C3E50', highlightthickness=0)
            bar_cv.pack(side='left', padx=2)

            pct = tk.Label(row, text='0%', font=('맑은 고딕', 7),
                           fg='#7F8C8D', bg='#1E2A3A', width=4)
            pct.pack(side='left')

            self.prob_bars.append((bar_cv, bar_colors[i]))
            self.prob_pct_labels.append(pct)

        # ── 버튼 영역 ─────────────────────────────────────────
        btn_frame = tk.Frame(self.root, bg='#1E2A3A')
        btn_frame.pack(pady=8)

        tk.Button(
            btn_frame, text="  지우기  ",
            font=('맑은 고딕', 11), command=self._clear_canvas,
            bg='#E74C3C', fg='white', relief='flat',
            activebackground='#C0392B', cursor='hand2'
        ).pack(side='left', padx=8)

        tk.Button(
            btn_frame, text="  인식하기  ",
            font=('맑은 고딕', 11), command=self._predict,
            bg='#27AE60', fg='white', relief='flat',
            activebackground='#1E8449', cursor='hand2'
        ).pack(side='left', padx=8)

        # ── 상태 표시줄 ───────────────────────────────────────
        self.status_label = tk.Label(
            self.root, text="초기화 중...",
            font=('맑은 고딕', 8), fg='#7F8C8D', bg='#1E2A3A'
        )
        self.status_label.pack(pady=(0, 8))

    # ── 이벤트 핸들러 ─────────────────────────────────────────

    def _start_draw(self, event):
        """마우스 버튼을 누르면 그리기 시작"""
        self.drawing = True
        self._draw(event)

    def _draw(self, event):
        """마우스를 드래그하는 동안 선 그리기"""
        if not self.drawing:
            return
        x, y = event.x, event.y
        r = self.brush_size // 2

        # tkinter 캔버스에 흰 원 그리기
        self.canvas.create_oval(
            x - r, y - r, x + r, y + r,
            fill='white', outline='white'
        )
        # PIL 이미지에도 동일하게 그리기 (예측에 사용)
        self.pil_draw.ellipse([x - r, y - r, x + r, y + r], fill=255)

    def _stop_draw(self, event):
        """마우스 버튼을 놓으면 그리기 종료 후 자동 인식"""
        self.drawing = False
        self._predict()

    def _clear_canvas(self):
        """캔버스와 PIL 이미지를 모두 초기화"""
        self.canvas.delete('all')
        self.pil_image = Image.new('L', (self.canvas_size, self.canvas_size), 0)
        self.pil_draw = ImageDraw.Draw(self.pil_image)
        self.digit_label.config(text='?', fg='#F1C40F')
        self.confidence_label.config(text='신뢰도: -')
        for bar_cv, _ in self.prob_bars:
            bar_cv.delete('all')
        for pct in self.prob_pct_labels:
            pct.config(text='0%')

    def _predict(self):
        """
        현재 PIL 이미지를 8×8로 축소 후 SVM으로 숫자 예측
        핵심: 그린 영역만 크롭한 뒤 정사각형으로 맞춰 리사이즈해야
        픽셀 밀도가 학습 데이터와 유사해져 정확도가 올라간다.
        """
        if self.model is None:
            return

        # 가우시안 블러로 노이즈 제거
        img = self.pil_image.filter(ImageFilter.GaussianBlur(radius=2))
        arr = np.array(img)

        # 실제로 그려진 픽셀(밝기 > 10)의 행/열 범위 탐색
        rows = np.any(arr > 10, axis=1)
        cols = np.any(arr > 10, axis=0)
        if not rows.any():
            # 아무것도 그리지 않은 경우 예측 중단
            return

        rmin, rmax = np.where(rows)[0][[0, -1]]
        cmin, cmax = np.where(cols)[0][[0, -1]]

        # 상하좌우 여백 추가 (숫자가 가장자리에 붙지 않게)
        pad = 20
        rmin = max(0, rmin - pad)
        rmax = min(self.canvas_size - 1, rmax + pad)
        cmin = max(0, cmin - pad)
        cmax = min(self.canvas_size - 1, cmax + pad)

        # 그린 영역만 크롭
        cropped = Image.fromarray(arr[rmin:rmax + 1, cmin:cmax + 1])

        # 정사각형 캔버스에 중앙 배치 (비율 왜곡 방지)
        w, h = cropped.size
        side = max(w, h)
        square = Image.new('L', (side, side), 0)
        square.paste(cropped, ((side - w) // 2, (side - h) // 2))

        # 8×8로 리사이즈
        img_small = square.resize((8, 8), Image.LANCZOS)

        # numpy 배열로 변환 (0~16 범위로 정규화 — sklearn digits 포맷)
        img_array = np.array(img_small).astype('float32') / 255.0 * 16.0
        img_flat = img_array.reshape(1, -1)

        # 스케일링 후 예측
        img_scaled = self.scaler.transform(img_flat)
        probas = self.model.predict_proba(img_scaled)[0]
        digit = int(np.argmax(probas))
        confidence = probas[digit]

        # 결과 라벨 업데이트
        self.digit_label.config(text=str(digit), fg='#F1C40F')
        self.confidence_label.config(text=f'신뢰도: {confidence * 100:.1f}%')

        # 확률 막대 그래프 업데이트
        for i in range(10):
            bar_cv, color = self.prob_bars[i]
            prob = probas[i]
            width = int(prob * 150)
            bar_cv.delete('all')
            if width > 0:
                # 가장 높은 확률 항목은 노란색으로 강조
                fill_color = '#F1C40F' if i == digit else color
                bar_cv.create_rectangle(0, 0, width, 13, fill=fill_color, outline='')
            self.prob_pct_labels[i].config(text=f'{prob*100:.0f}%')


def main():
    print("손글씨 숫자 인식 프로그램 시작...")
    root = tk.Tk()
    app = HandwritingRecognizer(root)
    root.mainloop()


if __name__ == '__main__':
    main()
