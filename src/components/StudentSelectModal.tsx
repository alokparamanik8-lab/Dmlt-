import React from 'react';
import { StudentId } from '../types';
import { STUDENTS } from '../data/syllabus';
import { Award, BookOpen, CheckCircle, GraduationCap, ShieldCheck, User } from 'lucide-react';

interface StudentSelectModalProps {
  isOpen: boolean;
  activeStudentId: StudentId | null;
  onSelectStudent: (studentId: StudentId) => void;
  onClose?: () => void;
  canClose?: boolean;
}

export const StudentSelectModal: React.FC<StudentSelectModalProps> = ({
  isOpen,
  activeStudentId,
  onSelectStudent,
  onClose,
  canClose = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="student-select-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="student-select-dialog"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 md:p-8 text-center"
      >
        {/* Medical / Laboratory Emblem */}
        <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 mx-auto flex items-center justify-center text-teal-600 mb-4 shadow-xs">
          <GraduationCap className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
          DMLT STUDY HUB
        </h1>
        <p className="text-sm font-medium text-teal-700 mt-1">
          Learn • Practice • Complete • Improve
        </p>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          "Your personal DMLT 1st Year study companion."
        </p>

        <div className="my-6 border-t border-slate-100 pt-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Choose your student profile
          </h2>

          <div className="space-y-3">
            {STUDENTS.map((student) => {
              const isSelected = activeStudentId === student.id;
              return (
                <button
                  key={student.id}
                  id={`select-student-${student.id}`}
                  onClick={() => onSelectStudent(student.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-150 ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/20'
                      : 'border-slate-200 hover:border-teal-400 hover:bg-slate-50/80 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm tracking-wide ${
                        student.id === 'bishnudev'
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-emerald-600 text-white shadow-xs'
                      }`}
                    >
                      {student.avatarInitials}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-base leading-snug">
                        {student.name}
                      </h3>
                      <p className="text-xs text-slate-500">{student.role}</p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Active
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-400 group-hover:text-teal-600">
                        Select →
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500 border border-slate-100 text-left flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <p>
            Student profiles are completely separate. All tasks, XP, levels, notes, streaks, and syllabus progress remain private to each student.
          </p>
        </div>

        {canClose && onClose && (
          <button
            onClick={onClose}
            className="mt-4 text-xs font-medium text-slate-500 hover:text-slate-700 py-1"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
