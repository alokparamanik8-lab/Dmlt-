import React, { useState } from 'react';
import { StudentData, SubjectItem } from '../types';
import { SYLLABUS_SUBJECTS, BADGES_DEFINITION } from '../data/syllabus';
import { calculateOverallProgress, calculateLevel, getTodayDateString } from '../utils/storage';
import {
  BarChart3,
  Calendar,
  Flame,
  Award,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';

interface ProgressViewProps {
  studentData: StudentData;
  onSelectSubject: (subject: SubjectItem) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  studentData,
  onSelectSubject,
}) => {
  const overall = calculateOverallProgress(studentData);
  const levelInfo = calculateLevel(studentData.xp);

  // Simple Study Calendar: Current Month
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const todayStr = getTodayDateString();

  // Generate calendar days for current month
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  const activeDaysCount = Object.keys(studentData.historyByDate || {}).length;
  const selectedDayData = studentData.historyByDate?.[selectedDate];

  return (
    <div id="dmlt-progress-view" className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-serif">
          SYLLABUS PROGRESS DASHBOARD
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track syllabus topic completions, subject mastery percentages, and study history records.
        </p>

        {/* Big Overall Progress Display */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Overall Syllabus Progress
            </span>
            <span className="text-xl sm:text-2xl font-black text-teal-800 font-mono">
              {overall.percent}%
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-3.5 overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-teal-500 to-cyan-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(overall.percent, 2)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>
              <strong>{overall.completedTopics}</strong> topics completed
            </span>
            <span>
              <strong>{overall.totalTopics - overall.completedTopics}</strong> topics pending
            </span>
          </div>
        </div>
      </div>

      {/* 8 Syllabus Subjects Progress Bars */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-700" />
            Subject Wise Completion Breakdown
          </h2>
          <span className="text-xs font-mono text-slate-400">8 Subjects</span>
        </div>

        <div className="space-y-3.5 pt-1">
          {SYLLABUS_SUBJECTS.map((subject) => {
            const stats = overall.bySubject[subject.id] || {
              total: subject.topics.length,
              completed: 0,
              percent: 0,
            };

            return (
              <div
                key={subject.id}
                onClick={() => onSelectSubject(subject)}
                className="p-3 rounded-xl border border-slate-100 hover:border-teal-300 hover:bg-slate-50/80 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {subject.code}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-teal-900 truncate">
                      {subject.name}
                    </h3>
                  </div>

                  <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded shrink-0">
                    {stats.percent}%
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-teal-600 group-hover:bg-teal-700 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(stats.percent, 2)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>
                    {stats.completed} of {stats.total} topics finished
                  </span>
                  <span className="text-teal-700 font-semibold group-hover:underline">
                    View Topics →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Study Calendar & History Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Study Calendar & Activity Log
              </h2>
              <p className="text-[11px] text-slate-500">
                Click any date to inspect tasks completed, XP earned, and subjects studied
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              Streak: {studentData.streak.currentStreak} Days
            </span>
            <span className="text-slate-500">
              Active Days: <strong>{activeDaysCount}</strong>
            </span>
          </div>
        </div>

        {/* Month Calendar Grid */}
        <div className="pt-2">
          <div className="text-xs font-bold text-slate-700 mb-2">
            {monthName}
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-[10px] font-bold text-slate-400 py-1">
                {day}
              </div>
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;
              const hasActivity = Boolean(studentData.historyByDate?.[dateStr]);

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`p-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-teal-700 text-white shadow-xs'
                      : isToday
                      ? 'bg-teal-50 text-teal-800 border border-teal-300'
                      : hasActivity
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>{dayNum}</span>
                  {hasActivity && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                        isSelected ? 'bg-white' : 'bg-emerald-500'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details Box */}
        <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between font-semibold text-slate-800">
            <span>Activity on {selectedDate}:</span>
            {selectedDate === todayStr && (
              <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-100 text-teal-800 rounded">
                Today
              </span>
            )}
          </div>

          {selectedDayData ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-slate-700">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase text-slate-400 font-bold block">
                  Tasks Completed
                </span>
                <span className="text-base font-bold text-teal-700">
                  {selectedDayData.tasksCompleted}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase text-slate-400 font-bold block">
                  XP Earned
                </span>
                <span className="text-base font-bold text-teal-800">
                  +{selectedDayData.xpEarned} XP
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase text-slate-400 font-bold block">
                  Subjects Studied
                </span>
                <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                  {selectedDayData.subjects.join(', ') || 'General'}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 italic py-1">
              No study tasks were recorded for this date. Complete today's mission to log active study hours!
            </p>
          )}
        </div>
      </div>

      {/* Bottom Summary Metrics (Strictly per Section 14) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Cumulative Laboratory Metrics
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Completed Tasks
            </span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              {studentData.completedTaskIds.length}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Total XP
            </span>
            <div className="text-lg font-bold text-teal-800 mt-0.5">
              {studentData.xp} XP
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Current Level
            </span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              Lvl {levelInfo.level}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Current Streak
            </span>
            <div className="text-lg font-bold text-amber-600 mt-0.5 flex items-center justify-center gap-1">
              🔥 {studentData.streak.currentStreak}d
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Badges Earned
            </span>
            <div className="text-lg font-bold text-teal-700 mt-0.5">
              {studentData.unlockedBadgeIds.length} / {BADGES_DEFINITION.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
