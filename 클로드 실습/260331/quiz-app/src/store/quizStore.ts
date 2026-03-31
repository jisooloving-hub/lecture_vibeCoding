import { create } from 'zustand';
import type { GameMode, Question } from '../data/questions';
import { getQuestionsByCategory, getAllQuestionsShuffled } from '../data/questions';

export type GameStatus = 'idle' | 'playing' | 'finished';

interface AnswerRecord {
  questionId: number;
  selectedIndex: number;
  isCorrect: boolean;
}

interface QuizState {
  selectedCategory: GameMode | null;
  questions: Question[];
  currentIndex: number;
  score: number;
  answers: AnswerRecord[];
  gameStatus: GameStatus;

  startGame: (category: GameMode) => void;
  submitAnswer: (selectedIndex: number) => void;
  nextQuestion: () => void;
  resetGame: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  selectedCategory: null,
  questions: [],
  currentIndex: 0,
  score: 0,
  answers: [],
  gameStatus: 'idle',

  startGame: (category) => {
    const questions =
      category === '전체'
        ? getAllQuestionsShuffled()
        : getQuestionsByCategory(category);
    set({
      selectedCategory: category,
      questions,
      currentIndex: 0,
      score: 0,
      answers: [],
      gameStatus: 'playing',
    });
  },

  submitAnswer: (selectedIndex) => {
    const { questions, currentIndex, score, answers } = get();
    const current = questions[currentIndex];
    const isCorrect = selectedIndex === current.answerIndex;

    set({
      score: isCorrect ? score + 1 : score,
      answers: [
        ...answers,
        { questionId: current.id, selectedIndex, isCorrect },
      ],
    });
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get();
    if (currentIndex + 1 >= questions.length) {
      set({ gameStatus: 'finished' });
    } else {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  resetGame: () => {
    set({
      selectedCategory: null,
      questions: [],
      currentIndex: 0,
      score: 0,
      answers: [],
      gameStatus: 'idle',
    });
  },
}));
