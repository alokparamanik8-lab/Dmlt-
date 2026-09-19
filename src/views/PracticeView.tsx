import React, { useState } from 'react';
import { QuizQuestion, StudentData } from '../types';
import { INITIAL_QUIZ_QUESTIONS, SYLLABUS_SUBJECTS, XP_CONFIG } from '../data/syllabus';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Check,
} from 'lucide-react';

interface PracticeViewProps {
  studentData: StudentData;
  onEarnXp: (amount: number, reason: string) => void;
  onOpenAIQuiz: (subjectName: string) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  studentData,
  onEarnXp,
  onOpenAIQuiz,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [awardedQuestionIds, setAwardedQuestionIds] = useState<Record<string, boolean>>({});

  const filteredQuestions = INITIAL_QUIZ_QUESTIONS.filter((q) => {
    if (selectedSubject === 'all') return true;
    return q.subject === selectedSubject;
  });

  const handleSelectOption = (question: QuizQuestion, optionIndex: number) => {
    if (userAnswers[question.id] !== undefined) return; // Prevent changing/re-answering for duplicate XP

    setUserAnswers((prev) => ({
      ...prev,
      [question.id]: optionIndex,
    }));

    if (optionIndex === question.correctIndex && !awardedQuestionIds[question.id]) {
      setAwardedQuestionIds((prev) => ({ ...prev, [question.id]: true }));
      onEarnXp(XP_CONFIG.QUIZ_QUESTION, 'Practice Question Correct!');
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
  };

  // Scorecard calculation
  const totalAnswered = Object.keys(userAnswers).length;
  let correctCount = 0;
  let wrongCount = 0;

  filteredQuestions.forEach((q) => {
    const ans = userAnswers[q.id];
    if (ans !== undefined) {
      if (ans === q.correctIndex) {
        correctCount++;
      } else {
        wrongCount++;
      }
    }
  });

  const xpEarnedInSession = correctCount * XP_CONFIG.QUIZ_QUESTION;

  return (
    <div id="dmlt-practice-view" className="space-y-5 pb-12">
      {/* Title Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-serif">
            PRACTICE QUESTIONS & MCQS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Test your laboratory knowledge with high-yield DMLT 1st Year MCQs. Earn +10 XP per correct question.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAIQuiz(selectedSubject !== 'all' ? selectedSubject : 'Hematology and Blood Banking')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Generate AI Quiz</span>
          </button>
        </div>
      </div>

      {/* Scorecard Widget */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-5 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
            Current Practice Scorecard
          </span>
          {totalAnswered > 0 && (
            <button
              onClick={handleResetQuiz}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Answers
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">
              Score
            </span>
            <span className="text-xl font-black text-white">
              {filteredQuestions.length > 0 ? Math.round((correctCount / filteredQuestions.length) * 100) : 0}%
            </span>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">
              Correct
            </span>
            <span className="text-xl font-black text-emerald-400">
              {correctCount}
            </span>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">
              Wrong
            </span>
            <span className="text-xl font-black text-rose-400">
              {wrongCount}
            </span>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">
              XP Earned
            </span>
            <span className="text-xl font-black text-teal-300">
              +{xpEarnedInSession} XP
            </span>
          </div>
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setSelectedSubject('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedSubject === 'all'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Subjects ({INITIAL_QUIZ_QUESTIONS.length})
        </button>

        {SYLLABUS_SUBJECTS.map((s) => {
          const count = INITIAL_QUIZ_QUESTIONS.filter((q) => q.subject === s.name).length;
          if (count === 0) return null;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedSubject(s.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedSubject === s.name
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {s.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, qIndex) => {
          const userAnswer = userAnswers[q.id];
          const isAnswered = userAnswer !== undefined;
          const isCorrect = isAnswered && userAnswer === q.correctIndex;

          return (
            <div
              key={q.id}
              id={`quiz-question-${q.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      Q{qIndex + 1}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200/60">
                      {q.subject}
                    </span>
                    <span className="text-xs text-slate-400">{q.topic}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {q.question}
                  </h3>
                </div>

                <div className="shrink-0 text-xs font-bold text-teal-700">
                  +10 XP
                </div>
              </div>

              {/* Options A, B, C, D */}
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const isSelected = userAnswer === optIdx;
                  const isThisCorrect = optIdx === q.correctIndex;

                  let btnStyle = 'border-slate-200 hover:border-teal-400 bg-white text-slate-800';

                  if (isAnswered) {
                    if (isThisCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500/20';
                    } else if (isSelected) {
                      btnStyle = 'border-rose-400 bg-rose-50 text-rose-950 font-medium';
                    } else {
                      btnStyle = 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(q, optIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between transition-all ${btnStyle}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-100 font-bold text-slate-600 flex items-center justify-center text-xs shrink-0">
                          {letter}
                        </span>
                        <span>{opt}</span>
                      </span>

                      {isAnswered && (
                        <span>
                          {isThisCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          )}
                          {!isThisCorrect && isSelected && (
                            <XCircle className="w-4 h-4 text-rose-500" />
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback & Explanation Box */}
              {isAnswered && (
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 animate-in fade-in duration-150 ${
                    isCorrect
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50/70 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {isCorrect ? (
                      <span className="flex items-center gap-1.5 text-emerald-700">
                        <Check className="w-4 h-4 stroke-[3]" />
                        Correct Answer! (+10 XP)
                      </span>
                    ) : (
                      <span className="text-rose-700">
                        Incorrect. Correct answer is Option {String.fromCharCode(65 + q.correctIndex)}: {q.options[q.correctIndex]}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-700 leading-relaxed font-normal">
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
