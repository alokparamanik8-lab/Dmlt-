import React, { useState } from 'react';
import { TopicItem, SubjectItem, StudentId, StudyNote } from '../types';
import { getTopicStudyMaterial } from '../data/topicContent';
import { triggerTopicCompleteConfetti } from '../utils/animations';
import {
  X,
  CheckCircle2,
  Check,
  Bot,
  Sparkles,
  BookOpen,
  FileText,
  Trash2,
  RotateCcw,
  Stethoscope,
  Lightbulb,
} from 'lucide-react';

interface TopicStudyModalProps {
  topic: TopicItem;
  subject: SubjectItem;
  studentId: StudentId;
  isCompleted: boolean;
  notes: StudyNote[];
  onCompleteTopic: (topicId: string) => void;
  onAskAI: (subject: SubjectItem, topic: TopicItem) => void;
  onSaveNote: (subject: string, topic: string, content: string, title?: string, noteId?: string) => void;
  onDeleteNote: (noteId: string) => void;
  onClose: () => void;
}

export const TopicStudyModal: React.FC<TopicStudyModalProps> = ({
  topic,
  subject,
  isCompleted,
  notes,
  onCompleteTopic,
  onAskAI,
  onSaveNote,
  onDeleteNote,
  onClose,
}) => {
  const study = getTopicStudyMaterial(topic.id, topic.title, subject.name);

  // Notes state
  const topicNotes = notes.filter(
    (n) => n.topic === topic.title || n.topic === topic.id
  );
  const [isWritingNote, setIsWritingNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // AI Revision State
  const [isRevising, setIsRevising] = useState(false);
  const [revisionData, setRevisionData] = useState<string | null>(null);
  const [revisionError, setRevisionError] = useState<string | null>(null);

  const handleStartNewNote = () => {
    setEditingNoteId(null);
    setNoteTitle(`${topic.title} Notes`);
    setNoteContent('');
    setIsWritingNote(true);
  };

  const handleEditNote = (note: StudyNote) => {
    setEditingNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setIsWritingNote(true);
  };

  const handleSaveNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    onSaveNote(
      subject.name,
      topic.title,
      noteContent.trim(),
      noteTitle.trim() || `${topic.title} Notes`,
      editingNoteId || undefined
    );
    setIsWritingNote(false);
    setNoteContent('');
    setNoteTitle('');
    setEditingNoteId(null);
  };

  const handleRequestRevision = async () => {
    setIsRevising(true);
    setRevisionError(null);
    try {
      const res = await fetch('/api/ai/revise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.name,
          topic: topic.title,
        }),
      });

      if (!res.ok) {
        throw new Error('AI revision is currently busy.');
      }
      const data = await res.json();
      setRevisionData(data.revision || 'No revision generated.');
    } catch (err: any) {
      setRevisionError(err.message || 'Could not load revision.');
    } finally {
      setIsRevising(false);
    }
  };

  return (
    <div
      id="topic-study-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    >
      <div
        id="topic-study-modal-container"
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                {subject.shortName || subject.name}
              </span>
              {isCompleted && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Completed
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1.5 leading-snug">
              {topic.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            id="btn-close-study-modal"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Real Study Material */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* 1. Simple Explanation */}
          <section id="study-explanation-section" className="space-y-2">
            <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Simple Explanation
            </h3>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm sm:text-base leading-relaxed text-slate-800 font-normal">
              {study.explanation}
            </div>
          </section>

          {/* 2. Key Points */}
          <section id="study-keypoints-section" className="space-y-2.5">
            <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" />
              Key Points & Protocols
            </h3>
            <ul className="space-y-2">
              {study.keyPoints.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-normal"
                >
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Clinical & Laboratory Importance */}
          <section id="study-clinical-section" className="bg-teal-50/70 border border-teal-200 rounded-xl p-4 space-y-1.5">
            <h3 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
              Clinical Importance
            </h3>
            <p className="text-xs sm:text-sm text-teal-950 leading-relaxed">
              {study.clinicalImportance}
            </p>
          </section>

          {/* 4. Quick Revision Line */}
          <section id="study-takeaway-section" className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 space-y-1">
            <h3 className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Quick Revision Line
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-amber-950 italic">
              "{study.quickRevisionLine}"
            </p>
          </section>

          {/* 5. AI Revision Section (When requested) */}
          <section id="study-ai-revision-section" className="border-t border-slate-200 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-teal-600" />
                  AI Revision
                </h3>
                <p className="text-[11px] text-slate-500">Points, key terms, viva questions & MCQs</p>
              </div>
              <button
                id="btn-revise-this"
                onClick={handleRequestRevision}
                disabled={isRevising}
                className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-900 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isRevising ? 'animate-spin text-teal-600' : ''}`} />
                <span>{isRevising ? 'Generating...' : 'Revise This'}</span>
              </button>
            </div>

            {revisionError && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                {revisionError}
              </p>
            )}

            {revisionData && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                {revisionData}
              </div>
            )}
          </section>

          {/* 6. My Notes Section */}
          <section id="study-notes-section" className="border-t border-slate-200 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                My Personal Notes ({topicNotes.length})
              </h3>
              {!isWritingNote && (
                <button
                  id="btn-write-note"
                  onClick={handleStartNewNote}
                  className="px-3 py-1 bg-teal-50 text-teal-800 hover:bg-teal-100 text-xs font-semibold rounded-lg border border-teal-200 transition-colors"
                >
                  + Write Note
                </button>
              )}
            </div>

            {isWritingNote && (
              <form onSubmit={handleSaveNoteSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Note Title..."
                  className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-teal-600"
                />
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Write your study notes, key mnemonics or teacher tips here..."
                  rows={4}
                  required
                  className="w-full text-xs leading-relaxed px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-teal-600"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWritingNote(false)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-2xs"
                  >
                    Save Note
                  </button>
                </div>
              </form>
            )}

            {topicNotes.length > 0 && !isWritingNote && (
              <div className="space-y-2">
                {topicNotes.map((n) => (
                  <div
                    key={n.id}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{n.title}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400">{n.date}</span>
                        <button
                          onClick={() => handleEditNote(n)}
                          className="text-teal-700 hover:underline text-[11px] font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteNote(n.id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-700 whitespace-pre-line leading-relaxed">{n.content}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Modal Footer: The 2 Main Actions requested */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          {/* 1 Help Button: [ 🤖 Ask AI ] */}
          <button
            id="btn-ask-ai-topic"
            onClick={() => {
              onClose();
              onAskAI(subject, topic);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-teal-800 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 transition-colors shadow-xs"
          >
            <Bot className="w-4 h-4 text-teal-700" />
            <span>🤖 Ask AI</span>
          </button>

          {/* 1 Main Action: [ ✓ I Finished This ] */}
          <button
            id="btn-i-finished-this"
            onClick={() => {
              if (!isCompleted) {
                triggerTopicCompleteConfetti();
                onCompleteTopic(topic.id);
              }
            }}
            disabled={isCompleted}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs ${
              isCompleted
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-teal-700 hover:bg-teal-800 text-white'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>✓ Completed (+20 XP Earned)</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>✓ I Finished This (+20 XP)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
