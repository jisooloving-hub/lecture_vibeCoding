// ── 데이터 레이어 ─────────────────────────────────────
function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem('todos')) || [];
  } catch {
    return [];
  }
}

function saveTodos(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ── 상태 ──────────────────────────────────────────────
let todos = loadTodos();
let currentFilter = '전체';

// ── 데이터 내보내기/가져오기 ───────────────────────────
function exportTodos() {
  const json = JSON.stringify(todos, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `todos_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importTodos(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    let imported;
    try {
      imported = JSON.parse(e.target.result);
    } catch {
      alert('올바른 JSON 파일이 아닙니다.');
      return;
    }

    if (!Array.isArray(imported)) {
      alert('할 일 데이터 형식이 올바르지 않습니다.');
      return;
    }

    // 가져오기 전 현재 데이터 백업 확인
    if (todos.length > 0) {
      const backup = confirm(
        `현재 할 일 ${todos.length}개가 있습니다.\n` +
        `가져오기 전 현재 데이터를 백업하시겠습니까?\n\n` +
        `확인 → 백업 후 가져오기\n취소 → 백업 없이 바로 가져오기`
      );
      if (backup) exportTodos();
    }

    todos = imported;
    saveTodos(todos);
    renderTodos();
    alert(`${todos.length}개의 할 일을 가져왔습니다.`);
  };
  reader.readAsText(file);
}

// ── 자동 카테고리 분류 ─────────────────────────────────
const CATEGORY_KEYWORDS = {
  업무: [
    '회의', '미팅', '보고서', '기획', '발표', '출장', '업무', '메일', '이메일',
    '프로젝트', '계약', '거래처', '제안서', '검토', '팀', '클라이언트', '일정',
    '마감', '결재', '작성', '수정', '피드백', '슬랙', '협업',
  ],
  공부: [
    '공부', '강의', '복습', '시험', '과제', '알고리즘', '코딩', '프로그래밍',
    '학습', '문제', '연습', '수업', '강좌', '책', '읽기', '독서', '노트',
    '정리', '풀기', '외우기', '암기', '개념', '강화',
  ],
  개인: [
    '운동', '청소', '장보기', '약속', '친구', '가족', '여행', '쇼핑', '병원',
    '요리', '산책', '취미', '영화', '음악', '게임', '휴식', '약', '헬스',
    '세탁', '청구서', '납부', '생일', '기념일',
  ],
};

function autoClassify(text) {
  const t = text.trim();
  if (!t) return null;

  const scores = { 업무: 0, 공부: 0, 개인: 0 };
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (t.includes(kw)) scores[category]++;
    }
  }

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best[1] > 0 ? best[0] : null;
}

function applyAutoClassify(text) {
  const detected = autoClassify(text);
  const select   = document.getElementById('categorySelect');
  const hint     = document.getElementById('classifyHint');

  if (detected) {
    select.value = detected;
    hint.textContent = `✦ "${detected}" 자동 분류됨`;
    hint.style.opacity = '1';
  } else {
    hint.style.opacity = '0';
  }
}

// ── 다크모드 ───────────────────────────────────────────
function initDarkMode() {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
    document.getElementById('darkToggle').textContent = '☀️';
  }
}

function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark');
  document.getElementById('darkToggle').textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('darkMode', isDark);
}

// ── 앱 초기화 ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();

  document.getElementById('darkToggle').addEventListener('click', toggleDarkMode);

  // 내보내기/가져오기 이벤트
  document.getElementById('exportBtn').addEventListener('click', exportTodos);
  document.getElementById('importFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) importTodos(file);
    e.target.value = ''; // 같은 파일 재업로드 허용
  });

  // 카테고리 필터 탭 이벤트
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentFilter = tab.dataset.filter;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderTodos();
    });
  });

  // 추가 버튼 이벤트
  document.getElementById('addBtn').addEventListener('click', addTodo);

  // 입력 필드 이벤트
  const todoInput = document.getElementById('todoInput');
  todoInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTodo();
  });
  todoInput.addEventListener('input', e => {
    applyAutoClassify(e.target.value);
  });

  renderTodos();
  renderProgress();
});

// ── CRUD ───────────────────────────────────────────────
function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  if (!text) return;

  const category = document.getElementById('categorySelect').value;
  todos.push({
    id: generateId(),
    text,
    category,
    done: false,
    createdAt: Date.now(),
  });

  saveTodos(todos);
  input.value = '';
  input.focus();
  document.getElementById('classifyHint').style.opacity = '0';
  renderTodos();
  renderProgress();
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos(todos);
  renderTodos();
  renderProgress();
}

function toggleDone(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) todo.done = !todo.done;
  saveTodos(todos);
  renderTodos();
  renderProgress();
}

function editTodo(id, newText) {
  const text = newText.trim();
  if (!text) return;
  const todo = todos.find(t => t.id === id);
  if (todo) todo.text = text;
  saveTodos(todos);
  renderTodos();
  renderProgress();
}

// ── 렌더링 ─────────────────────────────────────────────
function renderTodos() {
  const list = document.getElementById('todoList');

  // 필터링
  const filtered = currentFilter === '전체'
    ? [...todos]
    : todos.filter(t => t.category === currentFilter);

  // 미완료 → 완료 순 정렬
  filtered.sort((a, b) => a.done - b.done);

  list.innerHTML = '';

  // 빈 상태 메시지
  if (filtered.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = '할 일이 없어요 🎉';
    list.appendChild(empty);
    return;
  }

  filtered.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.done ? ' done' : '');

    // 체크박스
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', () => toggleDone(todo.id));

    // 카테고리 뱃지
    const badge = document.createElement('span');
    badge.className = `badge badge-${todo.category}`;
    badge.textContent = todo.category;

    // 텍스트 (더블클릭 시 인라인 편집)
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;
    span.addEventListener('dblclick', () => startEdit(li, span, todo.id, todo.text));

    // 삭제 버튼
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '✕';
    delBtn.addEventListener('click', () => deleteTodo(todo.id));

    li.append(checkbox, badge, span, delBtn);
    list.appendChild(li);
  });

  renderProgress();
  renderTabCounts();
}

function renderTabCounts() {
  document.querySelectorAll('.tab').forEach(tab => {
    const filter = tab.dataset.filter;
    const count = filter === '전체'
      ? todos.length
      : todos.filter(t => t.category === filter).length;
    tab.dataset.count = count;
  });
}

function startEdit(li, span, id, originalText) {
  const input = document.createElement('input');
  input.type = 'text';
  input.value = originalText;
  input.className = 'todo-text';
  input.style.cssText = 'border:1px solid #4f8ef7; border-radius:6px; padding:2px 6px; outline:none; font-size:15px;';

  li.replaceChild(input, span);
  input.focus();
  input.select();

  const commit = () => {
    const newText = input.value.trim();
    if (newText && newText !== originalText) {
      editTodo(id, newText);
    } else {
      renderTodos(); // 변경 없으면 원복
    }
  };

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') renderTodos();
  });
  input.addEventListener('blur', commit);
}

function renderProgress() {
  const total = todos.length;
  const done  = todos.filter(t => t.done).length;
  const pct   = total === 0 ? 0 : Math.round((done / total) * 100);

  document.getElementById('progressText').textContent =
    `${done} / ${total} 완료 (${pct}%)`;

  const bar = document.getElementById('progressBarFill');
  bar.style.width = pct + '%';
  bar.classList.toggle('complete', total > 0 && done === total);
}
