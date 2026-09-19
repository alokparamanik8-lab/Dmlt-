import React from 'react';
import { StudentProfile } from '../types';
import { Sparkles, ArrowRightLeft, Flame, Shield } from 'lucide-react';

interface HeaderProps {
  student: StudentProfile;
  onSwitchStudent: () => void;
  streakDays: number;
  xp: number;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  student,
  onSwitchStudent,
  streakDays,
  xp,
  onOpenAdmin,
}) => {
  return (
    <header
      id="dmlt-app-header"
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-2xs"
    >
      {/* Student Profile Info */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
          {student.avatarInitials}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-none">
              {student.name}
            </span>
            <button
              onClick={onSwitchStudent}
              id="header-switch-student-btn"
              title="Switch Student Profile"
              className="text-slate-400 hover:text-teal-700 p-0.5 rounded transition-colors"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">DMLT 1st Year</p>
        </div>
      </div>

      {/* Quick Stats: Streak & XP & Optional Admin Shortcut */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 border border-orange-200/70 rounded-full text-xs font-bold text-orange-800">
          <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
          <span>{streakDays}d Streak</span>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200/70 rounded-full text-xs font-bold text-amber-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{xp} XP</span>
        </div>

        {onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            id="header-open-admin-btn"
            title="Open Admin Dashboard"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors ml-0.5"
          >
            <Shield size={16} />
          </button>
        )}
      </div>
    </header>
  );
};
