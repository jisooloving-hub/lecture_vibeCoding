import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { CATEGORIES } from '../data/questions';

const STORAGE_KEY = 'quiz_scores';
const NICKNAME_KEY = 'quiz_last_nickname';

interface ScoreEntry {
  nickname: string;
  score: number;
  total: number;
  category: string;
  date: string;
}

function saveScore(entry: ScoreEntry) {
  const raw = localStorage.getItem(STORAGE_KEY);
  const scores: ScoreEntry[] = raw ? JSON.parse(raw) : [];
  scores.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  localStorage.setItem(NICKNAME_KEY, entry.nickname);
}

export default function ResultPage() {
  const navigate = useNavigate();
  const { score, questions, answers, selectedCategory, resetGame } = useQuizStore();
  const total = questions.length;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  const [showModal, setShowModal] = useState(false);
  const [nickname, setNickname] = useState(
    () => localStorage.getItem(NICKNAME_KEY) ?? ''
  );
  const [copied, setCopied] = useState(false);

  const grade = () => {
    if (pct >= 90) return { label: '완벽해요! 🏆', color: 'text-yellow-500' };
    if (pct >= 70) return { label: '잘했어요! 🎉', color: 'text-green-500' };
    if (pct >= 50) return { label: '괜찮아요! 👍', color: 'text-blue-500' };
    return { label: '다시 도전해봐요 💪', color: 'text-gray-500' };
  };

  const { label, color } = grade();

  const handleSaveAndGo = () => {
    const trimmed = nickname.trim();
    if (!trimmed) return;
    saveScore({
      nickname: trimmed,
      score,
      total,
      category: selectedCategory ?? '',
      date: new Date().toLocaleDateString('ko-KR'),
    });
    setShowModal(false);
    navigate('/leaderboard');
  };

  const handleRetry = () => {
    resetGame();
    navigate('/');
  };

  const handleShare = async () => {
    const text = `나는 ${selectedCategory} 퀴즈에서 ${score}점을 받았어요! 🎉`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard 미지원 환경 무시
    }
  };

  // 카테고리별 성취도 (전체 도전 모드에서만 표시)
  const categoryStats = selectedCategory === '전체'
    ? CATEGORIES.map((cat) => {
        const catQs = questions.filter((q) => q.category === cat);
        const correct = answers.filter(
          (a) => catQs.some((q) => q.id === a.questionId) && a.isCorrect
        ).length;
        const total = catQs.length;
        return { cat, correct, total, pct: total > 0 ? Math.round((correct / total) * 100) : 0 };
      })
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-8 text-center">

        <div className="text-6xl mb-4">
          {pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '👍' : '💪'}
        </div>

        <h1 className="text-2xl font-extrabold text-gray-800 mb-1">퀴즈 완료!</h1>
        <p className={`text-base font-semibold mb-6 ${color}`}>{label}</p>

        {/* 점수 원형 */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-32 h-32 rounded-full border-8 border-indigo-200 flex flex-col items-center justify-center mb-2">
            <span className="text-3xl font-extrabold text-indigo-600">{score}</span>
            <span className="text-xs text-gray-400">/ {total}</span>
          </div>
          <span className="text-2xl font-bold text-indigo-500">{pct}점</span>
        </div>

        <div className="text-sm text-gray-500 bg-gray-50 rounded-xl py-2 px-4 mb-4">
          카테고리: <span className="font-semibold text-gray-700">{selectedCategory}</span>
        </div>

        {/* 카테고리별 성취도 차트 (전체 도전 모드) */}
        {categoryStats && (
          <div className="bg-gray-50 rounded-2xl p-4 mb-4 text-left">
            <p className="text-xs font-bold text-gray-500 mb-3">카테고리별 성취도</p>
            {categoryStats.map(({ cat, correct, total: catTotal, pct: catPct }) => (
              <div key={cat} className="mb-3 last:mb-0">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-gray-700">{cat}</span>
                  <span className="text-gray-400">{correct}/{catTotal} ({catPct}%)</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-indigo-500 rounded-full"
                    style={{ width: `${catPct}%`, transition: 'width 0.6s ease-out' }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
          >
            🏆 리더보드에 등록
          </button>

          {/* 공유 버튼 */}
          <button
            onClick={handleShare}
            className="w-full py-3 rounded-xl border-2 border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors"
          >
            {copied ? '✅ 복사됐어요!' : '🔗 점수 공유하기'}
          </button>

          <button
            onClick={handleRetry}
            className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-semibold hover:bg-gray-50 transition-colors"
          >
            다시 도전
          </button>
        </div>
      </div>

      {/* 닉네임 입력 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xs">
            <h2 className="text-lg font-bold text-gray-800 mb-1">닉네임 입력</h2>
            <p className="text-sm text-gray-400 mb-4">리더보드에 표시될 이름을 입력하세요.</p>
            <input
              type="text"
              maxLength={10}
              placeholder="닉네임 (최대 10자)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveAndGo()}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-400 mb-4"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 rounded-xl border-2 border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleSaveAndGo}
                disabled={!nickname.trim()}
                className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40 transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
