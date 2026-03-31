import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data/questions';
import type { Category, GameMode } from '../data/questions';
import { useQuizStore } from '../store/quizStore';

const CATEGORY_META: Record<Category, { emoji: string; color: string }> = {
  한국사: { emoji: '📜', color: 'bg-amber-50 border-amber-300 hover:border-amber-500 hover:bg-amber-100' },
  과학:   { emoji: '🔬', color: 'bg-sky-50 border-sky-300 hover:border-sky-500 hover:bg-sky-100' },
  지리:   { emoji: '🌍', color: 'bg-green-50 border-green-300 hover:border-green-500 hover:bg-green-100' },
  일반상식: { emoji: '💡', color: 'bg-purple-50 border-purple-300 hover:border-purple-500 hover:bg-purple-100' },
};

export default function HomePage() {
  const navigate = useNavigate();
  const startGame = useQuizStore((s) => s.startGame);

  const handleStart = (mode: GameMode) => {
    startGame(mode);
    navigate('/quiz');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">상식 퀴즈 게임</h1>
          <p className="text-gray-500 text-base">카테고리를 선택하여 도전하세요!</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {CATEGORIES.map((cat) => {
            const { emoji, color } = CATEGORY_META[cat];
            return (
              <button
                key={cat}
                onClick={() => handleStart(cat)}
                className={`flex flex-col items-center gap-2 p-6 rounded-2xl border-2 transition-all duration-150 cursor-pointer ${color}`}
              >
                <span className="text-4xl">{emoji}</span>
                <span className="font-bold text-gray-800 text-base">{cat}</span>
                <span className="text-xs text-gray-400">10문제</span>
              </button>
            );
          })}
        </div>

        {/* 전체 도전 */}
        <button
          onClick={() => handleStart('전체')}
          className="w-full py-4 mb-4 rounded-2xl border-2 border-indigo-300 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-500 transition-all duration-150 flex items-center justify-center gap-3"
        >
          <span className="text-3xl">🌟</span>
          <div className="text-left">
            <p className="font-bold text-indigo-700 text-base">전체 도전</p>
            <p className="text-xs text-indigo-400">4개 카테고리 40문제 랜덤</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/leaderboard')}
          className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-base hover:bg-indigo-700 transition-colors"
        >
          🏆 리더보드 보기
        </button>
      </div>
    </div>
  );
}
