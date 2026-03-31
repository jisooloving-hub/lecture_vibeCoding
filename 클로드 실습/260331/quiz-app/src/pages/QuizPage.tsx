import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';

type FeedbackState = 'idle' | 'correct' | 'wrong' | 'timeout';

const TIMER_SECONDS = 30;

export default function QuizPage() {
  const navigate = useNavigate();
  const {
    questions,
    currentIndex,
    score,
    gameStatus,
    selectedCategory,
    submitAnswer,
    nextQuestion,
  } = useQuizStore();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);

  // 게임 상태에 따른 리다이렉트
  useEffect(() => {
    if (gameStatus === 'idle') navigate('/');
    if (gameStatus === 'finished') navigate('/result');
  }, [gameStatus, navigate]);

  // 문제 바뀌면 선택·타이머 초기화
  useEffect(() => {
    setSelectedOption(null);
    setFeedback('idle');
    setTimeLeft(TIMER_SECONDS);
  }, [currentIndex]);

  // 타이머
  useEffect(() => {
    if (feedback !== 'idle') return; // 이미 답한 경우 정지
    if (timeLeft === 0) {
      // 시간 초과 → 오답 처리
      submitAnswer(-1);
      setFeedback('timeout');
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, feedback, submitAnswer]);

  if (questions.length === 0) return null;

  const current = questions[currentIndex];
  const total = questions.length;
  const isAnswered = feedback !== 'idle';

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    submitAnswer(idx);
    setFeedback(idx === current.answerIndex ? 'correct' : 'wrong');
  };

  // 타이머 색상
  const timerRatio = timeLeft / TIMER_SECONDS;
  const timerBarColor =
    timerRatio > 0.5 ? 'bg-indigo-500' :
    timerRatio > 0.2 ? 'bg-amber-400' :
    'bg-red-500';
  const timerTextColor =
    timerRatio > 0.5 ? 'text-indigo-600' :
    timerRatio > 0.2 ? 'text-amber-500' :
    'text-red-600';

  // 옵션 버튼 색상
  const optionClass = (idx: number): string => {
    const base = 'w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition-all duration-150 text-sm sm:text-base';
    if (!isAnswered) {
      return `${base} border-gray-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer`;
    }
    if (idx === current.answerIndex) {
      return `${base} border-green-500 bg-green-50 text-green-800`;
    }
    if (idx === selectedOption && idx !== current.answerIndex) {
      return `${base} border-red-400 bg-red-50 text-red-800`;
    }
    return `${base} border-gray-200 bg-white text-gray-400`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg p-6 sm:p-8">

        {/* 헤더 */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
            {selectedCategory}
          </span>
          <span className="text-sm text-gray-400">
            {currentIndex + 1} / {total}
          </span>
          <span className="text-sm font-bold text-indigo-600">
            점수 {score}
          </span>
        </div>

        {/* 진행 바 */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3">
          <div
            className="h-1.5 bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>

        {/* 타이머 */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">남은 시간</span>
            <span className={`text-xs font-bold tabular-nums ${timerTextColor}`}>
              {timeLeft}초
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-2 rounded-full ${timerBarColor}`}
              style={{
                width: `${timerRatio * 100}%`,
                transition: 'width 1s linear, background-color 0.3s',
              }}
            />
          </div>
        </div>

        {/* 문제 */}
        <p className="text-lg sm:text-xl font-bold text-gray-800 mb-6 leading-snug">
          Q{currentIndex + 1}. {current.question}
        </p>

        {/* 선택지 */}
        <div className="flex flex-col gap-3 mb-6">
          {current.options.map((opt, idx) => (
            <button key={idx} className={optionClass(idx)} onClick={() => handleSelect(idx)}>
              <span className="mr-2 font-bold text-gray-400">
                {['①', '②', '③', '④'][idx]}
              </span>
              {opt}
              {isAnswered && idx === current.answerIndex && (
                <span className="ml-2 text-green-600">✓</span>
              )}
              {isAnswered && idx === selectedOption && idx !== current.answerIndex && (
                <span className="ml-2 text-red-500">✗</span>
              )}
            </button>
          ))}
        </div>

        {/* 피드백 박스 */}
        {isAnswered && (
          <div
            className={`rounded-xl p-4 mb-5 text-sm leading-relaxed ${
              feedback === 'correct'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            <p className="font-bold mb-1">
              {feedback === 'correct' ? '🎉 정답입니다!' :
               feedback === 'timeout' ? '⏰ 시간 초과!' : '❌ 오답입니다.'}
            </p>
            <p>{current.explanation}</p>
          </div>
        )}

        {/* 다음 버튼 */}
        {isAnswered && (
          <button
            onClick={nextQuestion}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
          >
            {currentIndex + 1 >= total ? '결과 보기' : '다음 문제 →'}
          </button>
        )}
      </div>
    </div>
  );
}
