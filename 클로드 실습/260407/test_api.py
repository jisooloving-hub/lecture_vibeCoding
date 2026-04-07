import requests
from dotenv import load_dotenv
import os
import sys

sys.stdout.reconfigure(encoding="utf-8")

load_dotenv()
API_KEY = os.getenv("OPENROUTER_API_KEY")
BASE_URL = "https://openrouter.ai/api/v1/chat/completions"
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

def test_text(prompt):
    print("=== 텍스트 테스트 (qwen/qwen3.6-plus:free) ===")
    response = requests.post(BASE_URL, headers=HEADERS, json={
        "model": "qwen/qwen3.6-plus:free",
        "messages": [{"role": "user", "content": prompt}],
    })
    if response.status_code == 200:
        answer = response.json()["choices"][0]["message"]["content"]
        print(f"응답: {answer}")
    else:
        print(f"오류 {response.status_code}: {response.text}")

def test_image(image_url, question):
    print("\n=== 이미지 테스트 (google/gemma-3-27b-it:free) ===")
    response = requests.post(BASE_URL, headers=HEADERS, json={
        "model": "google/gemma-3-27b-it:free",
        "messages": [{
            "role": "user",
            "content": [
                {"type": "image_url", "image_url": {"url": image_url}},
                {"type": "text", "text": question},
            ],
        }],
    })
    if response.status_code == 200:
        answer = response.json()["choices"][0]["message"]["content"]
        print(f"응답: {answer}")
    else:
        print(f"오류 {response.status_code}: {response.text}")

if __name__ == "__main__":
    test_text("'안녕하세요'를 영어, 일본어, 스페인어로 번역해줘.")
    test_image(
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png",
        question="이 이미지에 무엇이 보이나요? 한국어로 설명해주세요.",
    )
