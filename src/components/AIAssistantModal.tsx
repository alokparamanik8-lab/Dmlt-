import React, { useState, useEffect, useRef } from 'react';
import { SubjectItem, TopicItem } from '../types';
import { SYLLABUS_SUBJECTS, XP_CONFIG } from '../data/syllabus';
import { findSyllabusKnowledge } from '../data/syllabusKnowledge';
import {
  Sparkles,
  X,
  Send,
  HelpCircle,
  BookOpen,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Check,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  canRetry?: boolean;
  retryQuery?: string;
  isHighDemand?: boolean;
  isQuiz?: boolean;
  quizData?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    answeredIndex?: number;
    awarded?: boolean;
  };
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSubject?: SubjectItem | null;
  activeTopic?: TopicItem | null;
  onSelectContext?: (subject: SubjectItem, topic: TopicItem | null) => void;
  onEarnXp?: (amount: number, reason: string) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  activeSubject,
  activeTopic,
  onSelectContext,
  onEarnXp,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    activeSubject?.id || SYLLABUS_SUBJECTS[3].id // default Hematology
  );
  const [selectedTopicTitle, setSelectedTopicTitle] = useState<string>(
    activeTopic?.title || ''
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync context when props change
  useEffect(() => {
    if (activeSubject) {
      setSelectedSubjectId(activeSubject.id);
    }
    if (activeTopic) {
      setSelectedTopicTitle(activeTopic.title);
    }
  }, [activeSubject, activeTopic]);

  // Initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const currentSub = SYLLABUS_SUBJECTS.find((s) => s.id === selectedSubjectId);
      const subName = currentSub ? currentSub.name : 'DMLT 1st Year Syllabus';
      const topName = selectedTopicTitle || 'General Studies';

      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          text: `Namaste! I am your **DMLT AI ASSISTANT**.\n\nCurrent Focus:\n📚 **Subject:** ${subName}\n🔬 **Topic:** ${topName}\n\nAsk me anything in **English, Hindi, or Hinglish**! You can also use the quick prompt buttons below to start.`,
        },
      ]);
    }
  }, [isOpen, selectedSubjectId, selectedTopicTitle, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const currentSubjectObj = SYLLABUS_SUBJECTS.find((s) => s.id === selectedSubjectId);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsgId = `user_${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.slice(-5).map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          subject: currentSubjectObj?.name || 'General DMLT',
          topic: selectedTopicTitle || 'Core Principles',
          history: historyPayload,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const isDemand = res.status === 503 || data?.isHighDemand;
        const matchedTopic = findSyllabusKnowledge(query);

        if (matchedTopic) {
          const fallbackText = `📚 **DMLT Syllabus Reference Guide:**\n\n${matchedTopic.response}\n\n*(Note: Live AI experienced peak server demand. You can click 'Retry' to request live AI response again.)*`;
          setMessages((prev) => [
            ...prev,
            {
              id: `bot_match_${Date.now()}`,
              role: 'assistant',
              text: fallbackText,
              canRetry: true,
              retryQuery: query,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: `bot_err_${Date.now()}`,
              role: 'assistant',
              text: isDemand
                ? "⚠️ **High Demand Notice**: The AI model is currently receiving a high volume of requests. Click **Retry** below in a moment."
                : (data?.error || "AI Assistant is temporarily unavailable. Please try again."),
              canRetry: true,
              retryQuery: query,
              isHighDemand: isDemand,
            },
          ]);
        }
        return;
      }

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        text: data?.reply || 'I could not generate an answer right now. Please try again.',
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.warn('AI chat request note:', err?.message || err);
      const matchedTopic = findSyllabusKnowledge(query);

      if (matchedTopic) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot_match_${Date.now()}`,
            role: 'assistant',
            text: `📚 **DMLT Syllabus Reference Guide:**\n\n${matchedTopic.response}\n\n*(Note: Live AI experienced peak server demand. You can click 'Retry' to request live AI response again.)*`,
            canRetry: true,
            retryQuery: query,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot_err_${Date.now()}`,
            role: 'assistant',
            text: "⚠️ **Temporary Service Notice**: The AI assistant is experiencing high demand. Click **Retry** below to send your query again.",
            canRetry: true,
            retryQuery: query,
            isHighDemand: true,
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchQuiz = async () => {
    if (loading) return;
    setLoading(true);

    const userPrompt = `Quiz me on: ${selectedTopicTitle || currentSubjectObj?.name || 'DMLT 1st Year'}`;
    setMessages((prev) => [
      ...prev,
      {
        id: `user_quiz_${Date.now()}`,
        role: 'user',
        text: userPrompt,
      },
    ]);

    try {
      const res = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: currentSubjectObj?.name || 'Hematology and Blood Banking',
          topic: selectedTopicTitle || 'General DMLT Principles',
        }),
      });

      const data = await res.json().catch(() => null);
      const qList = (res.ok && data?.questions) ? data.questions : [];

      if (qList.length > 0) {
        const firstQ = qList[0];
        setMessages((prev) => [
          ...prev,
          {
            id: `quiz_${Date.now()}`,
            role: 'assistant',
            text: `Here is a practice question on **${selectedTopicTitle || currentSubjectObj?.name}**:`,
            isQuiz: true,
            quizData: {
              question: firstQ.question,
              options: firstQ.options,
              correctIndex: firstQ.correctIndex,
              explanation: firstQ.explanation,
              awarded: false,
            },
          },
        ]);
      } else {
        throw new Error('Fallback to syllabus bank');
      }
    } catch {
      // High-yield syllabus fallback question based on chosen subject
      let fallbackQ = {
        question: 'Which anticoagulant is universally used for routine complete blood count (CBC) and ESR estimation?',
        options: ['Heparin', 'EDTA (K2/K3)', 'Sodium Citrate (1:4)', 'Sodium Fluoride'],
        correctIndex: 1,
        explanation: 'EDTA acts by chelating ionized calcium, preventing clot formation without distorting blood cell morphology.',
      };

      if (currentSubjectObj?.name.includes('Pathology')) {
        fallbackQ = {
          question: 'What color precipitate indicates a strongly positive test for reducing sugars in Benedict’s test?',
          options: ['Clear blue', 'Greenish yellow', 'Brick red precipitate', 'Deep violet ring'],
          correctIndex: 2,
          explanation: 'When boiled with reducing sugars like glucose, copper sulfate is reduced to insoluble red cuprous oxide (Cu₂O).',
        };
      } else if (currentSubjectObj?.name.includes('Anatomy')) {
        fallbackQ = {
          question: 'Which chamber of the human heart pumps oxygenated blood into the aorta for systemic distribution?',
          options: ['Right atrium', 'Right ventricle', 'Left atrium', 'Left ventricle'],
          correctIndex: 3,
          explanation: 'The left ventricle has thick myocardial walls to pump oxygenated blood into the systemic arterial circulation.',
        };
      } else if (currentSubjectObj?.name.includes('Instruments')) {
        fallbackQ = {
          question: 'Why is immersion oil used with the 100x objective lens on a compound light microscope?',
          options: ['To stain the bacteria directly', 'To match the refractive index of glass and minimize light scattering', 'To reduce lens heat', 'To clean the slide surface'],
          correctIndex: 1,
          explanation: 'Immersion oil has a refractive index (~1.51) nearly identical to glass, preventing light loss at the air-glass interface.',
        };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `quiz_fallback_${Date.now()}`,
          role: 'assistant',
          text: `Here is a practice question on **${selectedTopicTitle || currentSubjectObj?.name || 'DMLT'}**:`,
          isQuiz: true,
          quizData: {
            ...fallbackQ,
            awarded: false,
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerQuiz = (msgId: string, optionIdx: number) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msgId || !m.quizData || m.quizData.answeredIndex !== undefined) {
          return m;
        }

        const isCorrect = optionIdx === m.quizData.correctIndex;
        let awarded = m.quizData.awarded;

        if (isCorrect && !awarded) {
          awarded = true;
          onEarnXp?.(XP_CONFIG.QUIZ_QUESTION, 'AI Quiz Question Correct!');
        }

        return {
          ...m,
          quizData: {
            ...m.quizData,
            answeredIndex: optionIdx,
            awarded,
          },
        };
      })
    );
  };

  const quickActions = [
    { label: 'Explain this topic', query: `Please explain this topic step by step in simple terms: ${selectedTopicTitle || currentSubjectObj?.name}` },
    { label: 'Make it easy', query: `I don't understand. Please explain this in very simple language with real-life examples and Hinglish: ${selectedTopicTitle || currentSubjectObj?.name}` },
    { label: 'Give MCQs', query: `Give me 3 important DMLT exam MCQs with answers on: ${selectedTopicTitle || currentSubjectObj?.name}` },
    { label: 'Revise this topic', query: `Give me a quick 5-bullet high-yield revision for college exams on: ${selectedTopicTitle || currentSubjectObj?.name}` },
    { label: 'Quiz me', action: handleLaunchQuiz },
    { label: 'Summarize this topic', query: `Provide a concise 1-minute summary of: ${selectedTopicTitle || currentSubjectObj?.name}` },
  ];

  return (
    <div
      id="ai-assistant-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        id="ai-assistant-dialog"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col h-[90vh] max-h-[720px] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                DMLT AI ASSISTANT
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300">
                  1st Year
                </span>
              </h2>
              <p className="text-[10px] text-slate-400">
                Ask me about your DMLT studies in English, Hindi, or Hinglish.
              </p>
            </div>
          </div>

          <button
            id="close-ai-assistant-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer Notice */}
        <div className="bg-teal-50/80 border-b border-teal-100 px-4 py-1.5 text-[11px] text-teal-900 flex items-center justify-between gap-2 shrink-0">
          <span className="truncate">
            🛡️ <strong>Syllabus-focused AI assistant.</strong> Verify important official information with your college or official source.
          </span>
        </div>

        {/* Context Selector Bar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-2 shrink-0 text-xs">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-teal-600" />
            Context:
          </span>

          <select
            id="ai-context-subject-select"
            value={selectedSubjectId}
            onChange={(e) => {
              setSelectedSubjectId(e.target.value);
              setSelectedTopicTitle('');
            }}
            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-medium focus:outline-teal-600 max-w-[200px] truncate"
          >
            {SYLLABUS_SUBJECTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {currentSubjectObj && currentSubjectObj.topics.length > 0 && (
            <select
              id="ai-context-topic-select"
              value={selectedTopicTitle}
              onChange={(e) => setSelectedTopicTitle(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-medium focus:outline-teal-600 max-w-[220px] truncate"
            >
              <option value="">All Topics (General)</option>
              {currentSubjectObj.topics.map((t) => (
                <option key={t.id} value={t.title}>
                  {t.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-teal-700 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                }`}
              >
                {/* Regular text */}
                <div className="whitespace-pre-line break-words space-y-1">
                  {msg.text}
                </div>

                {/* Retry Button if failed or high demand */}
                {msg.canRetry && msg.retryQuery && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400">Want to try again?</span>
                    <button
                      type="button"
                      onClick={() => handleSendMessage(msg.retryQuery)}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Retry Question</span>
                    </button>
                  </div>
                )}

                {/* Interactive AI Quiz card if present */}
                {msg.isQuiz && msg.quizData && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-2.5">
                    <p className="font-semibold text-slate-900 text-xs">
                      {msg.quizData.question}
                    </p>

                    <div className="space-y-1.5">
                      {msg.quizData.options.map((opt, optIdx) => {
                        const isAnswered = msg.quizData?.answeredIndex !== undefined;
                        const isSelected = msg.quizData?.answeredIndex === optIdx;
                        const isCorrect = msg.quizData?.correctIndex === optIdx;

                        let btnStyle = 'border-slate-200 hover:border-teal-500 bg-slate-50';
                        if (isAnswered) {
                          if (isCorrect) {
                            btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                          } else if (isSelected) {
                            btnStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                          } else {
                            btnStyle = 'border-slate-200 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={isAnswered}
                            onClick={() => handleAnswerQuiz(msg.id, optIdx)}
                            className={`w-full text-left p-2 rounded-lg border text-xs flex items-center justify-between transition-colors ${btnStyle}`}
                          >
                            <span>
                              <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                            </span>
                            {isAnswered && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {msg.quizData.answeredIndex !== undefined && (
                      <div className="mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                        {msg.quizData.answeredIndex === msg.quizData.correctIndex ? (
                          <p className="text-emerald-700 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Correct! +10 XP earned
                          </p>
                        ) : (
                          <p className="text-rose-700 font-semibold">
                            Not quite. Correct answer: Option {String.fromCharCode(65 + msg.quizData.correctIndex)}
                          </p>
                        )}
                        <p className="text-slate-600 mt-1">{msg.quizData.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-xl w-fit animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-spin" />
              <span>Analyzing DMLT 1st year syllabus...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Buttons Ribbon */}
        <div className="p-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {quickActions.map((qa, i) => (
            <button
              key={i}
              onClick={() => {
                if (qa.action) {
                  qa.action();
                } else if (qa.query) {
                  handleSendMessage(qa.query);
                }
              }}
              className="shrink-0 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 border border-slate-200 transition-colors"
            >
              {qa.label}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
        >
          <input
            id="ai-assistant-input-field"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about RBC, Hemoglobin, Sahli method, Normal values..."
            disabled={loading}
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-600 focus:bg-white text-slate-900 placeholder:text-slate-400"
          />
          <button
            id="ai-assistant-send-btn"
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};

