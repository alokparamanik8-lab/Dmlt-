import React from 'react';
import { NavTab, StudentProfile } from '../types';
import { Home, BookOpen, Bot, User, Flame, Sparkles, ArrowRightLeft, Stethoscope, Shield } from 'lucide-react';

interface DesktopSidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  student: StudentProfile;
  onSwitchStudent: () => void;
  xp: number;
  streakDays: number;
  onOpenAdmin?: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentTab,
  onTabChange,
  student,
  onSwitchStudent,
  xp,
  streakDays,
  onOpenAdmin,
}) => {
  const navItems = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'subjects' as NavTab, label: 'Subjects', icon: BookOpen },
    { id: 'aitutor' as NavTab, label: 'AI Tutor', icon: Bot },
    { id: 'profile' as NavTab, label: 'Profile', icon: User },
  ];

  return (
    <aside
      id="desktop-sidebar"
      aria-label="Desktop Navigation"
      className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 shrink-0 select-none"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight">DMLT STUDY HUB</h1>
            <p className="text-[11px] text-slate-500 font-medium">1st Year Study App</p>
          </div>
        </div>
      </div>

      {/* Main 4 Navigation Links */}
      <div className="p-3 flex-1 overflow-y-auto space-y-1">
        <div className="px-3 pt-2 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-teal-50 text-teal-900 border border-teal-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-teal-700 stroke-[2.4]' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {onOpenAdmin && (
          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={onOpenAdmin}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>Admin Center</span>
            </button>
          </div>
        )}
      </div>

      {/* Student Badge & Quick Switch Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
              {student.avatarInitials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{student.name}</p>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-0.5 text-amber-700 font-semibold">
                  <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                  {xp} XP
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-orange-700 font-semibold">
                  <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                  {streakDays}d
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          id="btn-switch-student-sidebar"
          onClick={onSwitchStudent}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-medium text-slate-600 hover:text-teal-900 bg-white border border-slate-200 hover:border-teal-300 transition-colors"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Switch Student Profile</span>
        </button>
      </div>
    </aside>
  );
};
