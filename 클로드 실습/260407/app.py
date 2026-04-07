import os
import re
import base64
import requests
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# .env 파싱
env_path = os.path.join(os.path.dirname(__file__), ".env")
with open(env_path) as f:
    for line in f:
        if "=" in line:
            k, v = line.strip().split("=", 1)
            os.environ.setdefault(k, v)

API_KEY = os.environ["OPENROUTER_API_KEY"]
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


@app.route("/")
def index():
    return render_template("step1.html")


@app.route("/step2")
def step2():
    return render_template("step2.html")


@app.route("/step3")
def step3():
    return render_template("step3.html")


@app.route("/analyze", methods=["POST"])
def analyze():
    file = request.files.get("image")
    if not file:
        return jsonify({"error": "이미지가 없습니다."}), 400

    ext = file.filename.rsplit(".", 1)[-1].lower()
    mime_map = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "webp": "image/webp"}
    mime = mime_map.get(ext, "image/jpeg")

    image_data = base64.b64encode(file.read()).decode("utf-8")
    data_url = f"data:{mime};base64,{image_data}"

    response = requests.post(
        OPENROUTER_URL,
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
        json={
            "model": "google/gemma-3-4b-it:free",
            "messages": [{
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": data_url}},
                    {"type": "text", "text": "이 이미지에서 보이는 식재료를 한국어로 목록화해줘. 재료명만 쉼표로 구분해서 나열해. 다른 설명 없이 재료명만 써줘."},
                ],
            }],
        },
        timeout=30,
    )

    if response.status_code != 200:
        return jsonify({"error": f"API 오류: {response.status_code}"}), 500

    content = response.json()["choices"][0]["message"]["content"]
    ingredients = [i.strip() for i in content.replace("、", ",").replace("\n", ",").split(",") if i.strip()]

    return jsonify({"ingredients": ingredients, "raw": content})


@app.route("/recipe", methods=["POST"])
def recipe():
    data = request.get_json()
    ingredients = data.get("ingredients", [])
    time_filter = data.get("time_filter", "제한 없음")
    difficulty_filter = data.get("difficulty_filter", "전체")
    dietary_restrictions = data.get("dietary_restrictions", [])

    if not ingredients:
        return jsonify({"error": "재료가 없습니다."}), 400

    filter_note = ""
    if time_filter != "제한 없음":
        filter_note += f" 조리 시간은 {time_filter} 이내여야 해."
    if difficulty_filter == "쉬움만":
        filter_note += " 난이도는 쉬움인 레시피만 추천해."
    if dietary_restrictions:
        filter_note += f" 식이 제한 사항: {', '.join(dietary_restrictions)}."

    prompt = f"""다음 재료로 만들 수 있는 한국 가정식 레시피 3가지를 추천해줘: {", ".join(ingredients)}
{filter_note}

반드시 아래 형식을 정확히 지켜서 작성해줘. 형식 외의 다른 말은 하지 마:

**요리명**: 요리 이름
- 난이도: 쉬움 또는 보통 또는 어려움
- 조리시간: 숫자분
- 보유재료: 재료1, 재료2
- 추가필요재료: 재료1, 재료2 (없으면 없음)
- 조리순서:
  1. 첫 번째 단계
  2. 두 번째 단계
  3. 세 번째 단계

---

**요리명**: 요리 이름
- 난이도: ...
"""

    response = requests.post(
        OPENROUTER_URL,
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
        json={
            "model": "qwen/qwen3.6-plus:free",
            "messages": [{"role": "user", "content": prompt}],
        },
        timeout=60,
    )

    if response.status_code != 200:
        return jsonify({"error": f"API 오류: {response.status_code}"}), 500

    raw = response.json()["choices"][0]["message"]["content"]
    recipes = parse_recipes(raw)

    return jsonify({"recipes": recipes, "raw": raw})


def parse_recipes(text):
    recipes = []
    # **요리명**: 으로 블록 분리
    blocks = re.split(r"\*\*요리명\*\*\s*[:：]", text)
    for block in blocks[1:]:
        lines = block.strip().splitlines()
        name = lines[0].strip().lstrip("*").strip() if lines else "이름 없음"

        def extract(label):
            for line in lines:
                if label in line:
                    return line.split(":", 1)[-1].strip()
            return ""

        difficulty = extract("난이도")
        cook_time = extract("조리시간")
        owned = [i.strip() for i in extract("보유재료").split(",") if i.strip()]
        extra = extract("추가필요재료")
        extra_list = [] if extra in ("없음", "") else [i.strip() for i in extra.split(",") if i.strip()]

        # 조리순서 파싱
        steps = []
        in_steps = False
        for line in lines:
            if "조리순서" in line:
                in_steps = True
                continue
            if in_steps:
                step = re.sub(r"^\s*\d+[\.\)]\s*", "", line).strip()
                if step and not step.startswith("-"):
                    steps.append(step)

        recipes.append({
            "name": name,
            "difficulty": difficulty or "보통",
            "cook_time": cook_time or "-",
            "owned_ingredients": owned,
            "extra_ingredients": extra_list,
            "steps": steps,
        })

    # 파싱 실패 시 원문 반환
    if not recipes:
        recipes = [{"name": "레시피", "difficulty": "-", "cook_time": "-",
                    "owned_ingredients": [], "extra_ingredients": [],
                    "steps": [text]}]
    return recipes


if __name__ == "__main__":
    app.run(debug=True, port=5000)
