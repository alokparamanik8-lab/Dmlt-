import React, { useState } from 'react';
import { StudyNote } from '../types';
import { SYLLABUS_SUBJECTS } from '../data/syllabus';
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Edit3,
  BookOpen,
  Calendar,
  X,
  Check,
} from 'lucide-react';

interface NotesViewProps {
  notes: StudyNote[];
  onSaveNote: (note: { subject: string; topic: string; title: string; content: string; date?: string }, id?: string) => void;
  onDeleteNote: (id: string) => void;
  initialSubject?: string;
  initialTopic?: string;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onSaveNote,
  onDeleteNote,
  initialSubject,
  initialTopic,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(Boolean(initialSubject || initialTopic));
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Form states
  const [formSubject, setFormSubject] = useState(initialSubject || SYLLABUS_SUBJECTS[0].name);
  const [formTopic, setFormTopic] = useState(initialTopic || '');
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');

  const filteredNotes = notes.filter((n) => {
    const matchesFilter =
      selectedSubjectFilter === 'all' || n.subject === selectedSubjectFilter;
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      n.title.toLowerCase().includes(query) ||
      n.topic.toLowerCase().includes(query) ||
      n.content.toLowerCase().includes(query) ||
      n.subject.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingNoteId(null);
    setFormSubject(initialSubject || SYLLABUS_SUBJECTS[0].name);
    setFormTopic(initialTopic || '');
    setFormTitle('');
    setFormContent('');
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (note: StudyNote) => {
    setEditingNoteId(note.id);
    setFormSubject(note.subject);
    setFormTopic(note.topic);
    setFormTitle(note.title);
    setFormContent(note.content);
    setIsEditorOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    onSaveNote(
      {
        subject: formSubject,
        topic: formTopic.trim() || 'General',
        title: formTitle.trim(),
        content: formContent.trim(),
      },
      editingNoteId || undefined
    );

    setIsEditorOpen(false);
  };

  return (
    <div id="dmlt-notes-view" className="space-y-5 pb-12">
      {/* Title Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-serif">
            DMLT STUDY NOTES
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Personal laboratory notes, procedures, staining principles, and revision summaries.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-colors shadow-xs self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Note</span>
        </button>
      </div>

      {/* Search and Subject Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-2.5">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes by title, topic, procedure, or keywords..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-teal-600 focus:bg-white text-slate-900"
          />
        </div>

        <select
          value={selectedSubjectFilter}
          onChange={(e) => setSelectedSubjectFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-teal-600 text-slate-700 font-medium"
        >
          <option value="all">All 8 Subjects ({notes.length})</option>
          {SYLLABUS_SUBJECTS.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Notes Grid or Empty State */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">
            No notes yet. Start making your first study note.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Record important DMLT formulas, standard operating procedures (SOPs), normal reference ranges, or key test summaries.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Create First Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200/60 truncate max-w-[200px]">
                    {note.subject}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(note)}
                      className="p-1 text-slate-400 hover:text-teal-700 hover:bg-slate-100 rounded"
                      title="Edit note"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-2">
                  {note.title}
                </h3>
                <p className="text-[11px] font-semibold text-slate-500">
                  Topic: {note.topic}
                </p>

                <div className="mt-2.5 text-xs text-slate-700 whitespace-pre-line leading-relaxed line-clamp-6 bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                  {note.content}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {note.updatedAt || note.date}
                </span>
                <span>Saved locally</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingNoteId ? 'Edit Study Note' : 'Add New Study Note'}
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject (Syllabus)
                </label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-teal-600 text-slate-900 font-medium"
                >
                  {SYLLABUS_SUBJECTS.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Topic / Subtopic
                </label>
                <input
                  type="text"
                  required
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  placeholder="e.g. Sahli Acid Hematin Method"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-teal-600 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Principle, Reagent, and Normal Values"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-teal-600 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Content (Procedures, points, formulas)
                </label>
                <textarea
                  required
                  rows={6}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Enter detailed laboratory steps, reaction mechanisms, normal ranges, and clinical significance..."
                  className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-teal-600 focus:bg-white text-slate-900 resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs"
                >
                  {editingNoteId ? 'Update Note' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
