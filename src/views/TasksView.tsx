import React, { useState } from 'react';
import { StudentData, DailyMission } from '../types';
import { XP_CONFIG, SYLLABUS_SUBJECTS } from '../data/syllabus';
import { calculateLevel } from '../utils/storage';
import {
  CheckSquare,
  Award,
  Plus,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  Check,
  TrendingUp,
  Tag,
} from 'lucide-react';

interface TasksViewProps {
  studentData: StudentData;
  onCompleteTask: (taskId: string, xpReward: number, title: string) => void;
  onAddCustomTask: (task: Omit<DailyMission, 'id' | 'completed' | 'date'>) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  studentData,
  onCompleteTask,
  onAddCustomTask,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState(SYLLABUS_SUBJECTS[0].name);
  const [taskCategory, setTaskCategory] = useState<'study' | 'revise' | 'practice' | 'goal'>('study');
  const [taskXp, setTaskXp] = useState(XP_CONFIG.NORMAL_STUDY_TASK);

  const levelInfo = calculateLevel(studentData.xp);

  // Combine daily missions + any custom tasks
  const allMissions = [
    ...(studentData.dailyMissions || []),
    ...(studentData.customTasks || []),
  ];

  const filteredMissions = allMissions.filter((m) => {
    if (filter === 'pending') return !m.completed;
    if (filter === 'completed') return m.completed;
    return true;
  });

  const completedCount = allMissions.filter((m) => m.completed).length;
  const totalCount = allMissions.length;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    onAddCustomTask({
      title: taskTitle.trim(),
      subject: taskSubject,
      xpReward: Number(taskXp) || 20,
      category: taskCategory,
    });

    setTaskTitle('');
    setIsAddOpen(false);
  };

  return (
    <div id="dmlt-tasks-view" className="space-y-5 pb-12">
      {/* Title Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-serif">
            TODAY'S MISSIONS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete daily missions to earn XP, level up your technician rank, and preserve your study streak.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-colors shadow-xs self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Custom Mission</span>
        </button>
      </div>

      {/* Level & XP Strip */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-5 rounded-2xl shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  Current Level: Level {levelInfo.level}
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-teal-300">
                  {levelInfo.name}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Total XP: <strong className="text-white">{studentData.xp} XP</strong>
                {levelInfo.maxXp !== null && ` • ${levelInfo.xpToNext} XP to Level ${levelInfo.level + 1}`}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
              {completedCount}/{totalCount} Completed
            </span>
          </div>
        </div>

        {/* Level Progress bar */}
        <div className="space-y-1">
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Level {levelInfo.level} ({levelInfo.minXp} XP)</span>
            <span>{levelInfo.progressPercent}% to next rank</span>
            <span>{levelInfo.maxXp !== null ? `Level ${levelInfo.level + 1} (${levelInfo.maxXp + 1} XP)` : 'Max Level'}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Missions ({totalCount})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'pending'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Pending ({totalCount - completedCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'completed'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Duplicate XP prevented on completed tasks
        </span>
      </div>

      {/* Missions List */}
      <div className="space-y-3">
        {filteredMissions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-teal-600 mx-auto opacity-70" />
            <h3 className="text-sm font-bold text-slate-800">
              {filter === 'completed'
                ? 'Complete your first mission to start your progress.'
                : 'No pending missions right now!'}
            </h3>
            <p className="text-xs text-slate-500">
              {filter === 'completed'
                ? 'Click "Complete Task" on any active mission to earn XP and level up.'
                : 'Great job staying on top of your daily laboratory studies!'}
            </p>
          </div>
        ) : (
          filteredMissions.map((mission, idx) => {
            return (
              <div
                key={mission.id}
                id={`task-item-${mission.id}`}
                className={`bg-white rounded-xl border p-4 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  mission.completed
                    ? 'border-slate-200 bg-slate-50/60'
                    : 'border-slate-200 hover:border-teal-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    {mission.completed ? (
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-lg border-2 border-slate-300 flex items-center justify-center" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-sm font-semibold ${
                          mission.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                        }`}
                      >
                        {mission.title}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200/60">
                        +{mission.xpReward} XP
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span>{mission.subject}</span>
                      <span>•</span>
                      <span className="capitalize">{mission.category}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 sm:self-center">
                  {mission.completed ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      ✓ Completed
                    </span>
                  ) : (
                    <button
                      id={`complete-task-btn-${mission.id}`}
                      onClick={() => onCompleteTask(mission.id, mission.xpReward, mission.title)}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Complete Task (+{mission.xpReward} XP)
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Custom Mission Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Add Custom Daily Study Mission
            </h3>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mission / Task Name
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Practice Hemocytometer Neubauer grid calculations"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-teal-600 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject
                </label>
                <select
                  value={taskSubject}
                  onChange={(e) => setTaskSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-teal-600 text-slate-900"
                >
                  {SYLLABUS_SUBJECTS.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-teal-600 text-slate-900"
                  >
                    <option value="study">Study</option>
                    <option value="revise">Revise</option>
                    <option value="practice">Practice</option>
                    <option value="goal">Goal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    XP Reward
                  </label>
                  <select
                    value={taskXp}
                    onChange={(e) => setTaskXp(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-teal-600 text-slate-900"
                  >
                    <option value={15}>+15 XP (Revision)</option>
                    <option value={20}>+20 XP (Study)</option>
                    <option value={25}>+25 XP (Practice)</option>
                    <option value={30}>+30 XP (Daily Goal)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs"
                >
                  Create Mission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
