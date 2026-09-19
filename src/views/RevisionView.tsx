import React, { useState } from 'react';
import { RevisionStatus, StudentData, TopicItem, SubjectItem } from '../types';
import { SYLLABUS_SUBJECTS, XP_CONFIG } from '../data/syllabus';
import {
  RotateCcw,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  ThumbsUp,
  Tag,
  BookOpen,
} from 'lucide-react';

interface RevisionViewProps {
  studentData: StudentData;
  onUpdateRevisionStatus: (topicId: string, status: RevisionStatus, xpAward?: number) => void;
  onOpenAIWithTopic: (subject: SubjectItem, topic: TopicItem) => void;
}

export const RevisionView: React.FC<RevisionViewProps> = ({
  studentData,
  onUpdateRevisionStatus,
  onOpenAIWithTopic,
}) => {
  const [activeTab, setActiveTab] = useState<RevisionStatus>('needs_revision');

  // Gather all topics from syllabus + student custom topics
  const allTopicsWithSubject: { topic: TopicItem; subject: SubjectItem }[] = [];
  SYLLABUS_SUBJECTS.forEach((sub) => {
    sub.topics.forEach((top) => {
      allTopicsWithSubject.push({ topic: top, subject: sub });
    });
    // Add custom topics
    const custom = (studentData.customTopics || []).filter((ct) => ct.subjectId === sub.id);
    custom.forEach((ct) => {
      allTopicsWithSubject.push({
        topic: { id: ct.id, title: ct.title, subjectId: ct.subjectId },
        subject: sub,
      });
    });
  });

  // Filter topics by revision status
  // By default, if no revision status is saved, it is considered 'needs_revision' if not marked
  const topicsInTab = allTopicsWithSubject.filter(({ topic }) => {
    const revState = studentData.topicsState[topic.id]?.revisionStatus;
    if (activeTab === 'needs_revision') {
      return !revState || revState === 'needs_revision';
    }
    return revState === activeTab;
  });

  const countNeeds = allTopicsWithSubject.filter(
    ({ topic }) => !studentData.topicsState[topic.id]?.revisionStatus || studentData.topicsState[topic.id]?.revisionStatus === 'needs_revision'
  ).length;

  const countRevised = allTopicsWithSubject.filter(
    ({ topic }) => studentData.topicsState[topic.id]?.revisionStatus === 'revised'
  ).length;

  const countStrong = allTopicsWithSubject.filter(
    ({ topic }) => studentData.topicsState[topic.id]?.revisionStatus === 'strong'
  ).length;

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'needs_revision':
        return 'Nothing needs revision right now.';
      case 'revised':
        return 'No revised topics yet.';
      case 'strong':
        return 'No strong topics marked yet.';
    }
  };

  return (
    <div id="dmlt-revision-view" className="space-y-5 pb-12">
      {/* Title Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-serif">
          REVISION HUB
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review, categorize, and master core topics before exams. Earn +15 XP when you complete a revision.
        </p>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 flex-wrap">
          <button
            onClick={() => setActiveTab('needs_revision')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'needs_revision'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Needs Revision ({countNeeds})</span>
          </button>

          <button
            onClick={() => setActiveTab('revised')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'revised'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Revised ({countRevised})</span>
          </button>

          <button
            onClick={() => setActiveTab('strong')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'strong'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Strong ({countStrong})</span>
          </button>
        </div>
      </div>

      {/* Topics list */}
      {topicsInTab.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
          <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">{getEmptyMessage()}</h3>
          <p className="text-xs text-slate-400">
            Use the tags on any topic below to categorize your exam confidence.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {topicsInTab.map(({ topic, subject }) => {
            const currentStatus: RevisionStatus =
              studentData.topicsState[topic.id]?.revisionStatus || 'needs_revision';

            return (
              <div
                key={topic.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                      {subject.code}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {subject.name}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    {topic.title}
                  </h3>

                  {topic.keyPoints && topic.keyPoints.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {topic.keyPoints.slice(0, 3).map((kp, kIdx) => (
                        <span
                          key={kIdx}
                          className="text-[10px] bg-slate-50 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded"
                        >
                          {kp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  {/* Status Toggle Buttons */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 text-[11px] font-semibold">
                    <button
                      onClick={() => onUpdateRevisionStatus(topic.id, 'needs_revision')}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        currentStatus === 'needs_revision'
                          ? 'bg-amber-500 text-white shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Needs Revision
                    </button>
                    <button
                      onClick={() =>
                        onUpdateRevisionStatus(
                          topic.id,
                          'revised',
                          currentStatus !== 'revised' ? XP_CONFIG.REVISION : undefined
                        )
                      }
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        currentStatus === 'revised'
                          ? 'bg-teal-700 text-white shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Revised (+15 XP)
                    </button>
                    <button
                      onClick={() => onUpdateRevisionStatus(topic.id, 'strong')}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        currentStatus === 'strong'
                          ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Strong ⭐
                    </button>
                  </div>

                  {/* Ask AI */}
                  <button
                    onClick={() => onOpenAIWithTopic(subject, topic)}
                    className="p-2 text-slate-700 hover:text-white bg-slate-100 hover:bg-slate-900 rounded-xl transition-colors"
                    title="Ask AI to revise this topic"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
