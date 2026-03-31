import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'quiz_scores';

interface ScoreEntry {
  nickname: string;
  score: number;
  total: number;
  category: string;
  date: string;
}

function loadScores(): ScoreEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const all: ScoreEntry[] = JSON.parse(raw);
  // 점수 내림차순 → 상위 10개
  return [...all].sort((a, b) => b.score - a.score).slice(0, 10);
}

const RANK_ICON = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const scores = loadScores();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg p-6 sm:p-8">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-indigo-700">🏆 리더보드</h1>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-indigo-500 hover:underline"
          >
            ← 홈으로
          </button>
        </div>

        {scores.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-base">아직 기록이 없어요.</p>
            <p className="text-sm mt-1">퀴즈를 풀고 첫 번째 기록을 남겨보세요!</p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 px-6 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              퀴즈 시작하기
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100">
                  <th className="py-2 text-center w-10">순위</th>
                  <th className="py-2 text-left pl-2">닉네임</th>
                  <th className="py-2 text-center">점수</th>
                  <th className="py-2 text-center">카테고리</th>
                  <th className="py-2 text-center">날짜</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((entry, i) => (
                  <tr
                    key={i}
                    className={`border-b border-gray-50 transition-colors ${
                      i === 0 ? 'bg-yellow-50' : i === 1 ? 'bg-gray-50' : ''
                    }`}
                  >
                    <td className="py-3 text-center text-lg">
                      {i < 3 ? RANK_ICON[i] : <span className="text-gray-400 font-bold">{i + 1}</span>}
                    </td>
                    <td className="py-3 pl-2 font-semibold text-gray-800">{entry.nickname}</td>
                    <td className="py-3 text-center">
                      <span className="font-bold text-indigo-600">{entry.score}</span>
                      <span className="text-gray-400 text-xs"> / {entry.total}</span>
                    </td>
                    <td className="py-3 text-center">
                      <span className="bg-indigo-50 text-indigo-600 text-xs font-medium px-2 py-0.5 rounded-full">
                        {entry.category}
                      </span>
                    </td>
                    <td className="py-3 text-center text-gray-400 text-xs">{entry.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="mt-6 w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
        >
          다시 도전하기
        </button>
      </div>
    </div>
  );
}
