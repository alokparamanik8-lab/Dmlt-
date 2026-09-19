import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SubjectItem, StudentData } from '../types';
import { SYLLABUS_SUBJECTS } from '../data/syllabus';
import { calculateOverallProgress } from '../utils/storage';
import { ChevronRight, Search } from 'lucide-react';

interface SubjectsViewProps {
  studentData: StudentData;
  onSelectSubject: (subject: SubjectItem) => void;
  subjectsList?: SubjectItem[];
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({
  studentData,
  onSelectSubject,
  subjectsList = SYLLABUS_SUBJECTS,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const overall = calculateOverallProgress(studentData);

  const filteredSubjects = subjectsList.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.shortName && s.shortName.toLowerCase().includes(q)) ||
      s.topics.some((t) => t.title.toLowerCase().includes(q))
    );
  });

  return (
    <div id="subjects-view-container" className="max-w-xl mx-auto px-4 py-5 space-y-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Syllabus Subjects
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Select any DMLT 1st year subject to view syllabus topics & study materials.
        </p>
      </motion.div>

      {/* Search Filter */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative"
      >
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search subjects or topics (e.g. Hemoglobin, Gram Stain)..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-9.5 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-600 shadow-2xs"
        />
      </motion.div>

      {/* Subjects List */}
      <div className="space-y-3">
        {filteredSubjects.map((subject, index) => {
          const stats = overall.bySubject[subject.id] || { total: subject.topics.length, completed: 0, percent: 0 };
          const isFinished = stats.percent === 100;

          return (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              id={`subject-card-${subject.id}`}
              onClick={() => onSelectSubject(subject)}
              className="bg-white border border-slate-200 hover:border-teal-400 rounded-2xl p-4 sm:p-5 transition-all cursor-pointer shadow-2xs hover:shadow-xs group active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-teal-50 text-slate-600 group-hover:text-teal-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider bg-teal-50 px-1.5 py-0.5 rounded">
                      {subject.code}
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-teal-900 transition-colors mt-1">
                      {subject.name}
                    </h2>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {subject.description}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal-700 shrink-0 transition-transform group-hover:translate-x-0.5 mt-2" />
              </div>

              {/* Progress */}
              <div className="mt-3.5 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-600 font-medium">
                    {stats.completed} of {stats.total} topics completed
                  </span>
                  <span className="font-bold text-slate-900">
                    {stats.percent}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isFinished ? 'bg-emerald-600' : 'bg-teal-600'
                    }`}
                    style={{ width: `${Math.max(2, stats.percent)}%` }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredSubjects.length === 0 && (
          <div className="text-center py-10 bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-xs font-medium text-slate-500">No subjects matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};
