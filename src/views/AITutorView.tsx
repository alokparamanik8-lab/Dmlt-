import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Award,
  ChevronRight,
  BookOpen,
  Zap,
} from 'lucide-react';
import { SubjectItem, TopicItem } from '../types';
import { SYLLABUS_SUBJECTS } from '../data/syllabus';
import { triggerTopicCompleteConfetti } from '../utils/animations';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  isQuiz?: boolean;
}

interface QuizItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface AITutorViewProps {
  initialSubject?: SubjectItem | null;
  initialTopic?: TopicItem | null;
  onAwardXP?: (amount: number, reason: string) => void;
  subjectsList?: SubjectItem[];
}

export const AITutorView: React.FC<AITutorViewProps> = ({
  initialSubject,
  initialTopic,
  onAwardXP,
  subjectsList = SYLLABUS_SUBJECTS,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Active Subject & Topic Context
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    initialSubject?.id || subjectsList[3]?.id || subjectsList[0]?.id || 'hema_blood'
  );
  const [selectedTopicTitle, setSelectedTopicTitle] = useState<string>(
    initialTopic?.title || ''
  );

  // Interactive Quiz State
  const [quizMode, setQuizMode] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizItem[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [xpAwardedForQuiz, setXpAwardedForQuiz] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync props if passed
  useEffect(() => {
    if (initialSubject) {
      setSelectedSubjectId(initialSubject.id);
    }
    if (initialTopic) {
      setSelectedTopicTitle(initialTopic.title);
    }
  }, [initialSubject, initialTopic]);

  const activeSubject = subjectsList.find((s) => s.id === selectedSubjectId) || subjectsList[0];

  // Initial welcome from DMLT Buddy 🤖
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          text: `Hey! I'm DMLT Buddy 🤖, your friendly study buddy.\n\nKuch bhi pooch lo! Short me samjhaunga, exam ke liye high-yield points ke saath 😄\n\nAbhi ham padh rahe hain: **${activeSubject?.name || 'General DMLT'}**${
            selectedTopicTitle ? ` • *${selectedTopicTitle}*` : ''
          }.`,
        },
      ]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          subject: activeSubject?.name || 'General DMLT 1st Year',
          topic: selectedTopicTitle || 'General Lab Topic',
          history: historyPayload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'DMLT Buddy is busy right now.');
      }

      const replyText = data.reply || 'Ek baar firse poocho, samajh nahi aaya! 😄';
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          text: replyText,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          text: `Koi tension nahi 😄 Server thoda busy tha. Ek baar dobara Send daba do!`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Quick action: Explain
  const handleQuickExplain = () => {
    const target = selectedTopicTitle || activeSubject?.name || 'RBC and Hemoglobin';
    handleSendMessage(`Explain ${target} in simple short points with a real-life analogy`);
  };

  // Quick action: Revise
  const handleQuickRevise = () => {
    const target = selectedTopicTitle || activeSubject?.name || 'Hematology';
    handleSendMessage(`Quick revision points & normal values for ${target}`);
  };

  // Quick action: Interactive Quiz
  const handleStartQuiz = async () => {
    setQuizMode(true);
    setQuizLoading(true);
    setQuizQuestions([]);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setHasAnsweredCurrent(false);
    setScore(0);
    setQuizFinished(false);
    setXpAwardedForQuiz(false);

    try {
      const res = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: activeSubject?.name || 'Hematology and Blood Banking',
          topic: selectedTopicTitle || 'Core DMLT Syllabus',
        }),
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuizQuestions(data.questions.slice(0, 5));
      } else {
        // Fallback quality quiz questions
        setQuizQuestions([
          {
            question: 'What is the standard life span of a normal human erythrocyte (RBC)?',
            options: ['60 days', '90 days', '120 days', '150 days'],
            correctIndex: 2,
            explanation: 'RBCs circulate for approximately 120 days before being filtered by spleen macrophages.',
          },
          {
            question: 'Which reagent is used in the reference Cyanmethemoglobin method for Hb estimation?',
            options: ['N/10 HCl', 'Drabkin’s Reagent', 'Leishman Stain', 'Normal Saline'],
            correctIndex: 1,
            explanation: 'Drabkin’s reagent converts hemoglobin to cyanmethemoglobin, read at 540 nm photometrically.',
          },
          {
            question: 'What is the primary function of Hemoglobin in blood?',
            options: ['Clotting blood', 'Oxygen delivery to tissues', 'Antibody production', 'Phagocytosis'],
            correctIndex: 1,
            explanation: 'Hemoglobin binds oxygen in the lungs and delivers it to peripheral body tissues.',
          },
        ]);
      }
    } catch (err) {
      setQuizQuestions([
        {
          question: 'What is the primary function of Hemoglobin in blood?',
          options: ['Clotting blood', 'Oxygen delivery to tissues', 'Antibody production', 'Phagocytosis'],
          correctIndex: 1,
          explanation: 'Hemoglobin binds oxygen in lungs and delivers it to body tissues.',
        },
      ]);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (hasAnsweredCurrent) return;
    setSelectedOption(idx);
    setHasAnsweredCurrent(true);

    const isCorrect = idx === quizQuestions[currentQIndex]?.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < quizQuestions.length - 1) {
      setCurrentQIndex((i) => i + 1);
      setSelectedOption(null);
      setHasAnsweredCurrent(false);
    } else {
      setQuizFinished(true);
      if (!xpAwardedForQuiz) {
        setXpAwardedForQuiz(true);
        onAwardXP?.(10, 'Quiz completed with DMLT Buddy');
        triggerTopicCompleteConfetti();
      }
    }
  };

  return (
    <div id="ai-tutor-container" className="max-w-2xl mx-auto px-4 py-4 space-y-4">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-sm shadow-teal-600/20">
              <Bot size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">DMLT Buddy 🤖</h1>
                <span className="text-[10px] font-bold uppercase bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Your study buddy • Friendly, short & playful</p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setQuizMode(false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                !quizMode
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Chat
            </button>
            <button
              onClick={handleStartQuiz}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                quizMode
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>🧠 Quiz</span>
            </button>
          </div>
        </div>

        {/* Active Subject & Topic Context Pill Badge */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-teal-600" />
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                setSelectedTopicTitle('');
              }}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-600 max-w-[210px] truncate"
            >
              {subjectsList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shortName || s.name}
                </option>
              ))}
            </select>
          </div>

          {activeSubject && activeSubject.topics && activeSubject.topics.length > 0 && (
            <select
              value={selectedTopicTitle}
              onChange={(e) => setSelectedTopicTitle(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2 py-1 text-xs font-medium max-w-[190px] truncate focus:outline-none"
            >
              <option value="">All Topics</option>
              {activeSubject.topics.map((t) => (
                <option key={t.id} value={t.title}>
                  {t.title}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* QUIZ MODE INTERFACE */}
      {quizMode ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5 min-h-[380px]">
          {quizLoading ? (
            <div className="py-20 text-center space-y-3">
              <Bot size={32} className="animate-bounce text-teal-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-800">Generating a fun quiz for you... 🧠</p>
              <p className="text-xs text-slate-400">Selecting 3-5 high-yield DMLT questions</p>
            </div>
          ) : quizFinished ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                <Award size={36} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {score}/{quizQuestions.length} 🎯 {score === quizQuestions.length ? 'Perfect Score!' : 'Nice work!'}
              </h2>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                You tested your knowledge with DMLT Buddy and earned{' '}
                <span className="font-bold text-amber-600">+10 XP ⭐</span>!
              </p>
              <div className="pt-3 flex justify-center gap-3">
                <button
                  onClick={handleStartQuiz}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Play Again 🔄
                </button>
                <button
                  onClick={() => setQuizMode(false)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Back to Chat 💬
                </button>
              </div>
            </div>
          ) : (
            quizQuestions.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                    Question {currentQIndex + 1} of {quizQuestions.length}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">Score: {score}</span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {quizQuestions[currentQIndex]?.question}
                </h3>

                {/* Multiple choice options */}
                <div className="space-y-2 pt-1">
                  {quizQuestions[currentQIndex]?.options.map((opt, optIdx) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    const isSelected = selectedOption === optIdx;
                    const isCorrect = optIdx === quizQuestions[currentQIndex]?.correctIndex;

                    let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
                    if (hasAnsweredCurrent) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-50 border-rose-300 text-rose-900 line-through';
                      } else {
                        btnStyle = 'bg-slate-50/60 border-slate-200 text-slate-400';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        disabled={hasAnsweredCurrent}
                        className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                            {letters[optIdx]}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {hasAnsweredCurrent && isCorrect && <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
                        {hasAnsweredCurrent && isSelected && !isCorrect && (
                          <XCircle size={16} className="text-rose-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Immediate feedback & explanation */}
                {hasAnsweredCurrent && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl space-y-1 text-xs text-slate-800"
                  >
                    <p className="font-bold flex items-center gap-1.5">
                      {selectedOption === quizQuestions[currentQIndex]?.correctIndex ? (
                        <span className="text-emerald-700">Correct! 🔥</span>
                      ) : (
                        <span className="text-rose-700">
                          Not quite 😅 Correct: {['A', 'B', 'C', 'D'][quizQuestions[currentQIndex]?.correctIndex]}
                        </span>
                      )}
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      {quizQuestions[currentQIndex]?.explanation}
                    </p>
                  </motion.div>
                )}

                {hasAnsweredCurrent && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNextQuestion}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <span>{currentQIndex === quizQuestions.length - 1 ? 'See Results 🏆' : 'Next Question'}</span>
                      <ChevronRight size={15} />
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      ) : (
        /* CHAT MODE INTERFACE */
        <div className="space-y-3">
          {/* Chat Messages Log */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 min-h-[360px] max-h-[460px] overflow-y-auto">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      isUser
                        ? 'bg-teal-600 text-white font-medium rounded-br-xs shadow-xs'
                        : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              );
            })}

            {/* Typing Indicator: 3 pulsing bouncing dots ● ● ● */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-slate-500 text-xs bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 w-fit"
              >
                <span className="font-semibold text-teal-700">DMLT Buddy</span>
                <div className="flex items-center gap-1 pt-0.5 text-teal-600">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce"></span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Buttons (Explain, Quiz, Revise) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={handleQuickExplain}
              disabled={loading}
              className="px-3 py-1.5 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-800 rounded-xl font-semibold shadow-2xs transition-all shrink-0 flex items-center gap-1"
            >
              <span>🎯 Explain</span>
            </button>
            <button
              onClick={handleStartQuiz}
              disabled={loading}
              className="px-3 py-1.5 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-800 rounded-xl font-semibold shadow-2xs transition-all shrink-0 flex items-center gap-1"
            >
              <span>🧠 Quiz</span>
            </button>
            <button
              onClick={handleQuickRevise}
              disabled={loading}
              className="px-3 py-1.5 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-800 rounded-xl font-semibold shadow-2xs transition-all shrink-0 flex items-center gap-1"
            >
              <span>🔄 Revise</span>
            </button>
            <button
              onClick={() => handleSendMessage('Detail me batao')}
              disabled={loading}
              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl font-medium transition-all shrink-0 text-[11px]"
            >
              Detail me batao
            </button>
            <button
              onClick={() => handleSendMessage('Samajh nahi aaya, easy analogy do')}
              disabled={loading}
              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl font-medium transition-all shrink-0 text-[11px]"
            >
              Samajh nahi aaya
            </button>
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="bg-white border border-slate-200 rounded-2xl p-2 sm:p-2.5 flex items-center gap-2 shadow-xs"
          >
            <input
              type="text"
              id="input-ai-buddy-message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything... (e.g. RBC kya hota hai?)"
              disabled={loading}
              className="flex-1 px-3 py-2 text-xs sm:text-sm text-slate-900 bg-transparent border-none focus:outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              id="btn-send-ai-buddy"
              disabled={!input.trim() || loading}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
