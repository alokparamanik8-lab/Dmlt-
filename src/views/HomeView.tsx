import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StudentProfile, StudentData, SubjectItem, TopicItem } from '../types';
import { SYLLABUS_SUBJECTS } from '../data/syllabus';
import { calculateOverallProgress } from '../utils/storage';
import { useCountUp, triggerTopicCompleteConfetti } from '../utils/animations';
import { Flame, Sparkles, ArrowRight, CheckCircle2, BookOpen, Check, Award, Trophy } from 'lucide-react';

interface HomeViewProps {
  student: StudentProfile;
  studentData: StudentData;
  onOpenTopic: (subject: SubjectItem, topic: TopicItem) => void;
  onSelectSubject: (subject: SubjectItem) => void;
  onCompleteTopic: (topicId: string) => void;
  onNavigateToTab: (tab: 'home' | 'subjects' | 'aitutor' | 'profile') => void;
  subjectsList?: SubjectItem[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  student,
  studentData,
  onOpenTopic,
  onSelectSubject,
  onCompleteTopic,
  onNavigateToTab,
  subjectsList = SYLLABUS_SUBJECTS,
}) => {
  const [showXpCelebration, setShowXpCelebration] = useState(false);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const overall = calculateOverallProgress(studentData);
  const animatedXp = useCountUp(studentData.xp, 700);
  const animatedProgress = useCountUp(overall.percent, 800);

  // Find today's recommended topic: first uncompleted topic in syllabus
  const completedSet = new Set<string>([
    ...(studentData.completedTopics || []),
    ...Object.entries(studentData.topicsState || {})
      .filter(([_, v]) => v?.status === 'completed')
      .map(([id]) => id),
  ]);

  let todaysSubject: SubjectItem = subjectsList[3] || subjectsList[0]; // Default Hematology
  let todaysTopic: TopicItem = todaysSubject?.topics[0] || { id: 'rbc_hb', title: 'RBC & Hemoglobin Estimation' };
  let foundUncompleted = false;

  for (const subject of subjectsList) {
    for (const topic of subject.topics) {
      if (!completedSet.has(topic.id)) {
        todaysSubject = subject;
        todaysTopic = topic;
        foundUncompleted = true;
        break;
      }
    }
    if (foundUncompleted) break;
  }

  const isTodayTopicDone = completedSet.has(todaysTopic.id);

  // Subject to continue studying (the subject with topics in progress or latest subject)
  let continueSubject = subjectsList[3] || subjectsList[0];
  for (const subject of subjectsList) {
    const sProgress = overall.bySubject[subject.id];
    if (sProgress && sProgress.percent > 0 && sProgress.percent < 100) {
      continueSubject = subject;
      break;
    }
  }
  const continueProgress = overall.bySubject[continueSubject?.id || '']?.percent || 0;

  const handleMarkComplete = () => {
    if (!isTodayTopicDone) {
      triggerTopicCompleteConfetti();
      setShowXpCelebration(true);
      onCompleteTopic(todaysTopic.id);
      setTimeout(() => setShowXpCelebration(false), 2400);
    }
  };

  return (
    <div id="home-screen-container" className="max-w-xl mx-auto px-4 py-5 space-y-5">
      {/* Floating XP Toast Notification */}
      <AnimatePresence>
        {showXpCelebration && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-amber-500/30 flex items-center gap-2 text-sm border-2 border-amber-300"
          >
            <Sparkles size={18} className="animate-spin text-amber-200" />
            <span>Awesome! +20 XP Earned ⭐</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Greeting & Student Header */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        id="home-greeting-section"
        className="border-b border-slate-200/80 pb-4"
      >
        <p className="text-xs sm:text-sm font-medium text-slate-500 flex items-center gap-1.5">
          <span>{getGreeting()}</span>
          <span className="text-base">👋</span>
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
          {student.name}
        </h1>

        <div className="flex items-center gap-2.5 mt-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-200/80 rounded-full text-xs font-bold text-orange-800 shadow-2xs">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
            <span>{studentData.streak.currentStreak} Day Streak</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-xs font-bold text-amber-800 shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{animatedXp} XP</span>
          </div>

          <div className="ml-auto text-xs text-slate-400 font-medium">
            DMLT 1st Year
          </div>
        </div>
      </motion.section>

      {/* 2. TODAY'S STUDY (The Core Focus) */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        id="home-todays-study-section"
        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-teal-800 tracking-wider uppercase bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/70">
            TODAY'S STUDY
          </span>
          <span className="text-xs font-medium text-slate-400">
            1 simple daily goal
          </span>
        </div>

        <div className="mt-2">
          <p className="text-xs font-semibold text-slate-500">
            {todaysSubject?.name}
          </p>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 leading-snug">
            {todaysTopic?.title}
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2.5">
          <button
            id="btn-start-studying"
            onClick={() => onOpenTopic(todaysSubject, todaysTopic)}
            className="flex-1 min-h-[44px] flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:scale-98 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs shadow-teal-600/20"
          >
            <BookOpen className="w-4 h-4" />
            <span>Start Studying</span>
          </button>

          <button
            id="btn-mark-topic-complete"
            onClick={handleMarkComplete}
            disabled={isTodayTopicDone}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              isTodayTopicDone
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 active:scale-98'
            }`}
          >
            {isTodayTopicDone ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Completed (+20 XP)</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-teal-700" />
                <span>✓ I Finished This</span>
              </>
            )}
          </button>
        </div>
      </motion.section>

      {/* 3. YOUR PROGRESS */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        id="home-progress-section"
        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
            YOUR PROGRESS
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {overall.completedTopics} of {overall.totalTopics} Topics
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xs font-semibold text-slate-600">Overall Syllabus Completion:</span>
          <span className="text-2xl font-black text-slate-900">{animatedProgress}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(3, overall.percent)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-teal-600 h-full rounded-full shadow-xs"
          />
        </div>

        <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-500">
          <span>Target: 100% Exam Readiness</span>
          <button
            onClick={() => onNavigateToTab('subjects')}
            className="text-teal-700 font-bold hover:underline"
          >
            View all subjects →
          </button>
        </div>
      </motion.section>

      {/* 4. CONTINUE STUDYING */}
      {continueSubject && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          id="home-continue-studying-section"
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
              CONTINUE STUDYING
            </span>
          </div>

          <div className="flex items-center justify-between mt-1">
            <div className="pr-2">
              <h3 className="text-sm font-bold text-slate-900">
                {continueSubject.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {continueProgress}% syllabus covered
              </p>
            </div>

            <button
              id="btn-continue-studying"
              onClick={() => onSelectSubject(continueSubject)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl border border-teal-200 transition-all shrink-0 active:scale-98"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.section>
      )}
    </div>
  );
};
