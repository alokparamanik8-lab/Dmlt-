import React from 'react';
import { motion } from 'motion/react';
import { SubjectItem, TopicItem, StudentData } from '../types';
import { ArrowLeft, BookOpen, CheckCircle2, Check, Bot } from 'lucide-react';

interface SubjectDetailViewProps {
  subject: SubjectItem;
  studentData: StudentData;
  onBack: () => void;
  onOpenTopic: (subject: SubjectItem, topic: TopicItem) => void;
  onAskAI?: (subject: SubjectItem, topic: TopicItem) => void;
}

export const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({
  subject,
  studentData,
  onBack,
  onOpenTopic,
  onAskAI,
}) => {
  const completedSet = new Set<string>([
    ...(studentData.completedTopics || []),
    ...Object.entries(studentData.topicsState || {})
      .filter(([_, v]) => v?.status === 'completed')
      .map(([id]) => id),
  ]);

  const totalTopics = subject.topics.length;
  let completedCount = 0;
  for (const t of subject.topics) {
    if (completedSet.has(t.id)) {
      completedCount++;
    }
  }

  const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  return (
    <div id="subject-detail-view-container" className="max-w-xl mx-auto px-4 py-5 space-y-5">
      {/* Top Bar with Back Button */}
      <div className="flex items-center gap-3">
        <button
          id="btn-back-to-subjects"
          onClick={onBack}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold active:scale-98"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Subjects</span>
        </button>
      </div>

      {/* Subject Header & Progress */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs"
      >
        <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
          {subject.code}
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 tracking-tight">
          {subject.name}
        </h1>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          {subject.description}
        </p>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-1.5 text-xs">
            <span className="font-bold text-slate-800">
              Progress: {progressPercent}%
            </span>
            <span className="text-slate-500 font-medium">
              {completedCount} of {totalTopics} Completed
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(3, progressPercent)}%` }}
              transition={{ duration: 0.6 }}
              className="bg-teal-600 h-full rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* TOPICS LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            TOPICS LIST ({totalTopics})
          </h2>
        </div>

        <div className="space-y-2.5">
          {subject.topics.map((topic, index) => {
            const isCompleted = completedSet.has(topic.id);

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                id={`topic-item-${topic.id}`}
                className={`bg-white border rounded-2xl p-4 transition-all flex items-center justify-between gap-3 shadow-2xs ${
                  isCompleted
                    ? 'border-emerald-200/90 bg-emerald-50/20'
                    : 'border-slate-200 hover:border-teal-300'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : index + 1}
                  </span>

                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {topic.title}
                    </h3>
                    {isCompleted && (
                      <p className="text-[11px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Completed (+20 XP)</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {onAskAI && (
                    <button
                      onClick={() => onAskAI(subject, topic)}
                      title="Ask DMLT Buddy about this topic"
                      className="p-2 rounded-xl bg-slate-50 hover:bg-teal-50 text-slate-600 hover:text-teal-700 border border-slate-200 transition-all text-xs font-semibold flex items-center gap-1"
                    >
                      <Bot size={14} />
                      <span className="hidden sm:inline text-[11px]">Ask AI</span>
                    </button>
                  )}

                  <button
                    id={`btn-study-topic-${topic.id}`}
                    onClick={() => onOpenTopic(subject, topic)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-98 ${
                      isCompleted
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-teal-600 hover:bg-teal-700 text-white shadow-2xs'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isCompleted ? 'Review' : 'Study'}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
