import requests
import sys
import os

sys.stdout.reconfigure(encoding="utf-8")

# .env 직접 파싱
env_path = os.path.join(os.path.dirname(__file__), ".env")
with open(env_path) as f:
    for line in f:
        if "=" in line:
            k, v = line.strip().split("=", 1)
            os.environ[k] = v

API_KEY = os.environ["OPENROUTER_API_KEY"]
BASE_URL = "https://openrouter.ai/api/v1/chat/completions"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

def call(model, messages):
    r = requests.post(BASE_URL, headers=HEADERS, json={"model": model, "messages": messages}, timeout=30)
    if r.status_code == 200:
        return "성공", r.json()["choices"][0]["message"]["content"]
    else:
        return "오류", f"{r.status_code} - {r.json().get('error', {}).get('message', r.text)}"

# 텍스트 테스트 - 지정 모델 먼저, 실패 시 대체 모델
TEXT_MODELS = ["qwen/qwen3.6-plus:free", "google/gemma-3-4b-it:free"]
IMAGE_MODELS = ["google/gemma-3-27b-it:free", "nvidia/nemotron-nano-12b-v2-vl:free", "google/gemma-3-4b-it:free"]

print("=" * 50)
print("텍스트 인식 테스트")
print("=" * 50)
for model in TEXT_MODELS:
    print(f"모델: {model}")
    status, result = call(model, [{"role": "user", "content": "'안녕하세요'를 영어, 일본어, 스페인어로 번역해줘."}])
    print(f"[{status}] {result[:300]}")
    if status == "성공":
        break
    print("→ 대체 모델로 시도...\n")

print()
print("=" * 50)
print("이미지 인식 테스트")
print("=" * 50)
for model in IMAGE_MODELS:
    print(f"모델: {model}")
    status, result = call(model, [{"role": "user", "content": [
        {"type": "image_url", "image_url": {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png"}},
        {"type": "text", "text": "이 이미지에 무엇이 보이나요? 한국어로 설명해주세요."},
    ]}])
    print(f"[{status}] {result[:300]}")
    if status == "성공":
        break
    print("→ 대체 모델로 시도...\n")
