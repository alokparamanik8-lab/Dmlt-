import React, { useState } from 'react';
import { motion } from 'motion/react';
import { StudentProfile, StudentData } from '../types';
import { BADGES_DEFINITION } from '../data/syllabus';
import { calculateOverallProgress } from '../utils/storage';
import { useCountUp } from '../utils/animations';
import {
  Flame,
  Sparkles,
  Award,
  ArrowRightLeft,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Settings,
} from 'lucide-react';

interface ProfileViewProps {
  student: StudentProfile;
  studentData: StudentData;
  onSwitchStudent: () => void;
  onResetStudentProgress: () => void;
  onOpenAdmin: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  student,
  studentData,
  onSwitchStudent,
  onResetStudentProgress,
  onOpenAdmin,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const overall = calculateOverallProgress(studentData);
  const animatedXp = useCountUp(studentData.xp, 600);

  const unlockedSet = new Set<string>(studentData.unlockedBadgeIds || []);
  const unlockedBadgesCount = BADGES_DEFINITION.filter((b) =>
    unlockedSet.has(b.id)
  ).length;

  const handleConfirmReset = () => {
    onResetStudentProgress();
    setShowConfirmReset(false);
  };

  return (
    <div id="profile-view-container" className="max-w-xl mx-auto px-4 py-5 space-y-5">
      {/* Student Identity Card */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white text-lg font-bold flex items-center justify-center shadow-sm shadow-teal-600/20">
            {student.avatarInitials}
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              {student.name}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              DMLT 1st Year Student
            </p>
            <span className="inline-block mt-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              Cloud Database Active
            </span>
          </div>
        </div>

        <button
          id="btn-profile-switch-student"
          onClick={onSwitchStudent}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-teal-50 hover:text-teal-900 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all shrink-0 active:scale-98"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Switch</span>
        </button>
      </motion.div>

      {/* Rewards: XP, Streak, Badges */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3"
      >
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          YOUR STUDY STATS
        </h2>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-center">
            <span className="text-xs font-semibold text-amber-800 block">⭐ XP</span>
            <span className="text-xl font-bold text-amber-950 mt-0.5 block">
              {animatedXp}
            </span>
          </div>

          <div className="bg-orange-50/70 border border-orange-200/80 rounded-xl p-3 text-center">
            <span className="text-xs font-semibold text-orange-800 block">🔥 Streak</span>
            <span className="text-xl font-bold text-orange-950 mt-0.5 block">
              {studentData.streak.currentStreak}d
            </span>
          </div>

          <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-3 text-center">
            <span className="text-xs font-semibold text-teal-800 block">🏆 Badges</span>
            <span className="text-xl font-bold text-teal-950 mt-0.5 block">
              {unlockedBadgesCount} / {BADGES_DEFINITION.length}
            </span>
          </div>
        </div>

        <div className="pt-2 text-xs text-slate-500 flex justify-between border-t border-slate-100">
          <span>Syllabus Completed:</span>
          <span className="font-semibold text-slate-900">{overall.percent}% ({overall.completedTopics} topics)</span>
        </div>
      </motion.div>

      {/* Admin Control Center Portal Card */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Admin Control Center</h2>
              <p className="text-[11px] text-slate-400">Configure syllabus, home layout, AI tutor & data</p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
            Staff Only
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Authorized teachers and administrators can add subjects, manage topics, change the home screen layout, and tune the AI tutor.
        </p>

        <button
          id="btn-open-admin-dashboard"
          onClick={onOpenAdmin}
          className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-400 active:scale-98 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <Settings size={15} />
          <span>Open Admin Dashboard</span>
        </button>
      </motion.div>

      {/* Badges List */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3"
      >
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          STUDY BADGES ({unlockedBadgesCount} / {BADGES_DEFINITION.length})
        </h2>

        <div className="space-y-2.5">
          {BADGES_DEFINITION.map((badge) => {
            const isUnlocked = unlockedSet.has(badge.id);

            return (
              <div
                key={badge.id}
                id={`badge-card-${badge.id}`}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-amber-50/40 border-amber-200/80'
                    : 'bg-slate-50/50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isUnlocked
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isUnlocked ? '🏆' : <Lock className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      {badge.title}
                    </h3>
                    <p className="text-[11px] text-slate-500">{badge.description}</p>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    isUnlocked
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isUnlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Reset Progress Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          DANGER ZONE
        </h2>
        <p className="text-xs text-slate-600">
          Resetting will clear {student.name}'s completed topics, XP, and streak.
          The other student's data will NOT be affected.
        </p>

        {!showConfirmReset ? (
          <button
            id="btn-reset-progress"
            onClick={() => setShowConfirmReset(true)}
            className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Progress</span>
          </button>
        ) : (
          <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-2.5 text-rose-900">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold">
                  Are you sure you want to reset your study progress?
                </h3>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  This will reset ONLY {student.name}'s study data. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-reset"
                onClick={handleConfirmReset}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-2xs"
              >
                Yes, Reset My Progress
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
