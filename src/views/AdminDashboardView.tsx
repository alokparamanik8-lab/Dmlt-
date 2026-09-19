import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Users,
  BookOpen,
  FileText,
  Bot,
  Palette,
  Award,
  Settings,
  LogOut,
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Save,
  Check,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  Download,
  HelpCircle,
  Zap,
} from 'lucide-react';
import {
  WebsiteConfig,
  AITutorConfig,
  SubjectItem,
  TopicItem,
  TopicStudyMaterial,
  StudentData,
  AdminTab,
  VerifiedKnowledgeSnippet,
  AnimationIntensity,
} from '../types';
import {
  fetchWebsiteConfig,
  saveWebsiteConfig,
  fetchSubjects,
  saveSubjects,
  saveTopic,
  deleteTopic,
  fetchStudyContent,
  saveTopicStudyContent,
  fetchAIConfig,
  saveAIConfig,
  fetchAdminStudents,
  adminResetStudentApi,
  adminLogoutApi,
  setAdminToken,
} from '../utils/api';
import { BADGES_DEFINITION } from '../data/syllabus';

interface AdminDashboardViewProps {
  adminToken: string;
  onExit: () => void;
  onLogout: () => void;
  onConfigUpdated?: (config: WebsiteConfig) => void;
  onSubjectsUpdated?: (subjects: SubjectItem[]) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  adminToken,
  onExit,
  onLogout,
  onConfigUpdated,
  onSubjectsUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('students');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Core Data
  const [students, setStudents] = useState<Record<string, StudentData>>({});
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig | null>(null);
  const [aiConfig, setAIConfig] = useState<AITutorConfig | null>(null);
  const [studyContent, setStudyContent] = useState<Record<string, TopicStudyMaterial>>({});

  // Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Subject Edit State
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null);
  const [isNewSubject, setIsNewSubject] = useState(false);

  // Topic Content Edit State
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [editingTopic, setEditingTopic] = useState<{ subjectId: string; topic: TopicItem } | null>(null);
  const [isNewTopic, setIsNewTopic] = useState(false);
  const [editingStudyContent, setEditingStudyContent] = useState<{
    topicId: string;
    content: TopicStudyMaterial;
  } | null>(null);

  // AI Snippet Edit State
  const [editingSnippet, setEditingSnippet] = useState<VerifiedKnowledgeSnippet | null>(null);
  const [isNewSnippet, setIsNewSnippet] = useState(false);

  // Load all data on mount
  useEffect(() => {
    loadAllData();
  }, [adminToken]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [stuRes, subRes, cfgRes, aiRes, cntRes] = await Promise.all([
        fetchAdminStudents(adminToken),
        fetchSubjects(),
        fetchWebsiteConfig(),
        fetchAIConfig(),
        fetchStudyContent(),
      ]);

      setStudents(stuRes || {});
      setSubjects(subRes || []);
      if (subRes && subRes.length > 0 && !selectedSubjectId) {
        setSelectedSubjectId(subRes[0].id);
      }
      setWebsiteConfig(cfgRes);
      setAIConfig(aiRes);
      setStudyContent(cntRes || {});
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showSaveSuccess = (msg: string = 'Changes saved successfully ✓') => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3500);
  };

  // ------------------------------------------------------------------
  // Student Actions
  // ------------------------------------------------------------------
  const handleResetStudent = (studentId: string, studentName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: `Reset ${studentName}'s Progress?`,
      message: `This will reset all completed topics, quiz scores, and streak data for ${studentName} back to zero. This cannot be undone.`,
      onConfirm: async () => {
        try {
          const fresh = await adminResetStudentApi(adminToken, studentId);
          setStudents((prev) => ({ ...prev, [studentId]: fresh }));
          showSaveSuccess(`Reset progress for ${studentName}`);
        } catch (err) {
          alert('Failed to reset student progress');
        }
        setConfirmDialog(null);
      },
    });
  };

  // ------------------------------------------------------------------
  // Subject Actions
  // ------------------------------------------------------------------
  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;

    try {
      let updated: SubjectItem[];
      if (isNewSubject) {
        updated = [...subjects, { ...editingSubject, topics: editingSubject.topics || [] }];
      } else {
        updated = subjects.map((s) => (s.id === editingSubject.id ? editingSubject : s));
      }

      const res = await saveSubjects(adminToken, updated);
      setSubjects(res);
      onSubjectsUpdated?.(res);
      setEditingSubject(null);
      setIsNewSubject(false);
      showSaveSuccess('Subject saved successfully ✓');
    } catch (err) {
      alert('Failed to save subject');
    }
  };

  const handleDeleteSubject = (subjectId: string, subjectName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: `Delete Subject "${subjectName}"?`,
      message: `Are you sure you want to delete this subject and all its topics? Students will no longer see it.`,
      onConfirm: async () => {
        try {
          const updated = subjects.filter((s) => s.id !== subjectId);
          const res = await saveSubjects(adminToken, updated);
          setSubjects(res);
          onSubjectsUpdated?.(res);
          if (selectedSubjectId === subjectId && res.length > 0) {
            setSelectedSubjectId(res[0].id);
          }
          showSaveSuccess('Subject deleted ✓');
        } catch (err) {
          alert('Failed to delete subject');
        }
        setConfirmDialog(null);
      },
    });
  };

  const handleToggleSubjectVisibility = async (subjectId: string) => {
    const updated = subjects.map((s) => (s.id === subjectId ? { ...s, isHidden: !s.isHidden } : s));
    try {
      const res = await saveSubjects(adminToken, updated);
      setSubjects(res);
      onSubjectsUpdated?.(res);
      showSaveSuccess('Visibility updated ✓');
    } catch (err) {
      alert('Failed to update visibility');
    }
  };

  const handleMoveSubject = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === subjects.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...subjects];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);

    try {
      const res = await saveSubjects(adminToken, reordered);
      setSubjects(res);
      onSubjectsUpdated?.(res);
      showSaveSuccess('Subject reordered ✓');
    } catch (err) {
      alert('Failed to reorder subjects');
    }
  };

  // ------------------------------------------------------------------
  // Topic Actions
  // ------------------------------------------------------------------
  const handleSaveTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTopic) return;

    try {
      const res = await saveTopic(adminToken, editingTopic.subjectId, editingTopic.topic);
      setSubjects(res);
      onSubjectsUpdated?.(res);
      setEditingTopic(null);
      setIsNewTopic(false);
      showSaveSuccess('Topic saved ✓');
    } catch (err) {
      alert('Failed to save topic');
    }
  };

  const handleDeleteTopic = (subjectId: string, topicId: string, topicTitle: string) => {
    setConfirmDialog({
      isOpen: true,
      title: `Delete Topic "${topicTitle}"?`,
      message: 'Are you sure you want to delete this topic from the syllabus?',
      onConfirm: async () => {
        try {
          const res = await deleteTopic(adminToken, subjectId, topicId);
          setSubjects(res);
          onSubjectsUpdated?.(res);
          showSaveSuccess('Topic deleted ✓');
        } catch (err) {
          alert('Failed to delete topic');
        }
        setConfirmDialog(null);
      },
    });
  };

  const handleSaveStudyContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudyContent) return;

    try {
      const updated = await saveTopicStudyContent(
        adminToken,
        editingStudyContent.topicId,
        editingStudyContent.content
      );
      setStudyContent((prev) => ({ ...prev, [editingStudyContent.topicId]: updated }));
      setEditingStudyContent(null);
      showSaveSuccess('Study material saved ✓');
    } catch (err) {
      alert('Failed to save study content');
    }
  };

  // ------------------------------------------------------------------
  // AI Config & Snippet Actions
  // ------------------------------------------------------------------
  const handleSaveAIConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiConfig) return;

    try {
      const res = await saveAIConfig(adminToken, aiConfig);
      setAIConfig(res);
      showSaveSuccess('AI Tutor configuration updated ✓');
    } catch (err) {
      alert('Failed to save AI configuration');
    }
  };

  const handleSaveSnippet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSnippet || !aiConfig) return;

    const currentSnippets = aiConfig.verifiedKnowledgeSnippets || [];
    let updatedSnippets: VerifiedKnowledgeSnippet[];

    if (isNewSnippet) {
      updatedSnippets = [
        ...currentSnippets,
        { ...editingSnippet, updatedAt: new Date().toISOString() },
      ];
    } else {
      updatedSnippets = currentSnippets.map((s) =>
        s.id === editingSnippet.id ? { ...editingSnippet, updatedAt: new Date().toISOString() } : s
      );
    }

    try {
      const updatedConfig = { ...aiConfig, verifiedKnowledgeSnippets: updatedSnippets };
      const res = await saveAIConfig(adminToken, updatedConfig);
      setAIConfig(res);
      setEditingSnippet(null);
      setIsNewSnippet(false);
      showSaveSuccess('Knowledge snippet saved ✓');
    } catch (err) {
      alert('Failed to save knowledge snippet');
    }
  };

  const handleDeleteSnippet = (snippetId: string) => {
    if (!aiConfig) return;
    const updatedSnippets = (aiConfig.verifiedKnowledgeSnippets || []).filter((s) => s.id !== snippetId);
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Knowledge Snippet?',
      message: 'Remove this verified study knowledge item from AI memory?',
      onConfirm: async () => {
        try {
          const res = await saveAIConfig(adminToken, {
            ...aiConfig,
            verifiedKnowledgeSnippets: updatedSnippets,
          });
          setAIConfig(res);
          showSaveSuccess('Snippet deleted ✓');
        } catch (err) {
          alert('Failed to delete snippet');
        }
        setConfirmDialog(null);
      },
    });
  };

  // ------------------------------------------------------------------
  // Website Config Actions
  // ------------------------------------------------------------------
  const handleSaveWebsiteConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteConfig) return;

    try {
      const res = await saveWebsiteConfig(adminToken, websiteConfig);
      if (res) {
        setWebsiteConfig(res);
        onConfigUpdated?.(res);
        showSaveSuccess('Website settings saved ✓');
      }
    } catch (err) {
      alert('Failed to save website config');
    }
  };

  // ------------------------------------------------------------------
  // Export Data Action
  // ------------------------------------------------------------------
  const handleExportData = () => {
    const fullBackup = {
      websiteConfig,
      aiConfig,
      subjects,
      studyContent,
      students,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dmlt-study-hub-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentSelectedSubject = subjects.find((s) => s.id === selectedSubjectId);

  return (
    <div id="admin-control-center" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Return to Student App"
          >
            <ArrowLeft size={16} />
            <span>Student App</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>DMLT Admin Control Center</span>
                <span className="text-[10px] font-mono uppercase bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/30">
                  Live
                </span>
              </h1>
              <p className="text-xs text-slate-400">Admin ID: 9973817583 • Alok Paramanik</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveStatus && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium rounded-full flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>{saveStatus}</span>
            </motion.div>
          )}

          <button
            onClick={handleExportData}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
            title="Export full cloud JSON database backup"
          >
            <Download size={14} />
            <span>Export Backup</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/40 text-xs font-semibold rounded-xl transition-colors"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Tab Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 overflow-x-auto">
        <nav className="flex space-x-1 sm:space-x-2 py-2 min-w-max">
          {[
            { id: 'students', label: 'Students', icon: Users },
            { id: 'subjects', label: 'Subjects', icon: BookOpen },
            { id: 'content', label: 'Study Content', icon: FileText },
            { id: 'ai', label: 'AI Tutor Settings', icon: Bot },
            { id: 'website', label: 'Website & Appearance', icon: Palette },
            { id: 'badges', label: 'Badges & XP', icon: Award },
            { id: 'settings', label: 'System & Database', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw size={32} className="animate-spin text-teal-400 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Loading admin control data...</p>
          </div>
        ) : (
          <div>
            {/* 1. STUDENTS TAB */}
            {activeTab === 'students' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Student Management</h2>
                  <p className="text-xs text-slate-400">View progress metrics, streak, XP, and reset student data</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(['bishnudev', 'alok'] as const).map((id) => {
                    const student = students[id] || {
                      studentId: id,
                      name: id === 'bishnudev' ? 'Bishnudev Paramanik' : 'Alok Paramanik',
                      xp: 0,
                      streak: { currentStreak: 1, bestStreak: 1 },
                      completedTopics: [],
                      notes: [],
                      unlockedBadgeIds: [],
                    };
                    const name = student.name || (id === 'bishnudev' ? 'Bishnudev Paramanik' : 'Alok Paramanik');
                    const completedCount = student.completedTopics?.length || 0;

                    return (
                      <div
                        key={id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base ${
                                  id === 'bishnudev' ? 'bg-teal-500/20 text-teal-300' : 'bg-emerald-500/20 text-emerald-300'
                                }`}
                              >
                                {id === 'bishnudev' ? 'BP' : 'AP'}
                              </div>
                              <div>
                                <h3 className="font-bold text-white text-base">{name}</h3>
                                <p className="text-xs text-slate-400 font-mono">ID: {id}</p>
                              </div>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                              DMLT 1st Year
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800 text-center">
                            <div className="bg-slate-950/60 p-2.5 rounded-xl">
                              <p className="text-[11px] text-slate-400 font-medium">Total XP</p>
                              <p className="text-base font-bold text-amber-400 font-mono mt-0.5">{student.xp || 0}</p>
                            </div>
                            <div className="bg-slate-950/60 p-2.5 rounded-xl">
                              <p className="text-[11px] text-slate-400 font-medium">Streak</p>
                              <p className="text-base font-bold text-orange-400 font-mono mt-0.5">
                                🔥 {student.streak?.currentStreak || 1}d
                              </p>
                            </div>
                            <div className="bg-slate-950/60 p-2.5 rounded-xl">
                              <p className="text-[11px] text-slate-400 font-medium">Completed</p>
                              <p className="text-base font-bold text-teal-400 font-mono mt-0.5">
                                {completedCount} topics
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                            <p className="flex justify-between">
                              <span className="text-slate-400">Study Notes Authored:</span>
                              <span className="font-semibold">{student.notes?.length || 0}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-slate-400">Badges Unlocked:</span>
                              <span className="font-semibold">{student.unlockedBadgeIds?.length || 0}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-slate-400">Last Active:</span>
                              <span className="font-mono text-slate-400">
                                {student.lastUpdated ? new Date(student.lastUpdated).toLocaleDateString() : 'Active'}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                          <button
                            onClick={() => handleResetStudent(id, name)}
                            className="px-3.5 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-200 hover:bg-rose-950/60 border border-rose-900/60 rounded-xl transition-all flex items-center gap-1.5"
                          >
                            <RefreshCw size={13} />
                            <span>Reset Progress</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. SUBJECTS TAB */}
            {activeTab === 'subjects' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-white">Subject Manager</h2>
                    <p className="text-xs text-slate-400">Add, edit, hide/show, reorder, or delete DMLT subjects</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingSubject({
                        id: `sub_${Date.now()}`,
                        name: '',
                        shortName: '',
                        code: 'DMLT-10' + (subjects.length + 1),
                        iconName: 'BookOpen',
                        description: '',
                        topics: [],
                        isHidden: false,
                      });
                      setIsNewSubject(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all"
                  >
                    <Plus size={16} />
                    <span>Add New Subject</span>
                  </button>
                </div>

                {/* Subject List */}
                <div className="space-y-3">
                  {subjects.map((sub, index) => (
                    <div
                      key={sub.id}
                      className={`bg-slate-900 border rounded-2xl p-4 transition-all flex flex-wrap items-center justify-between gap-4 ${
                        sub.isHidden ? 'border-slate-800/60 opacity-60' : 'border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-[280px]">
                        <div className="flex flex-col gap-1 text-slate-500">
                          <button
                            onClick={() => handleMoveSubject(index, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:text-white disabled:opacity-20"
                            title="Move Up"
                          >
                            <MoveUp size={14} />
                          </button>
                          <button
                            onClick={() => handleMoveSubject(index, 'down')}
                            disabled={index === subjects.length - 1}
                            className="p-1 hover:text-white disabled:opacity-20"
                            title="Move Down"
                          >
                            <MoveDown size={14} />
                          </button>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-slate-800 text-teal-400 rounded-md">
                              {sub.code}
                            </span>
                            <h3 className="font-bold text-white text-sm">{sub.name}</h3>
                            {sub.isHidden && (
                              <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                                Hidden
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-1">{sub.description}</p>
                          <p className="text-[11px] text-teal-400/80 mt-1 font-medium">
                            {sub.topics?.length || 0} topics in syllabus
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleSubjectVisibility(sub.id)}
                          className={`p-2 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                            sub.isHidden
                              ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                              : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                          }`}
                          title={sub.isHidden ? 'Make visible to students' : 'Hide from students'}
                        >
                          {sub.isHidden ? <EyeOff size={15} /> : <Eye size={15} />}
                          <span className="hidden sm:inline">{sub.isHidden ? 'Show' : 'Hide'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setEditingSubject(sub);
                            setIsNewSubject(false);
                          }}
                          className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <Edit2 size={15} />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteSubject(sub.id, sub.name)}
                          className="p-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 rounded-xl text-xs transition-colors"
                          title="Delete Subject"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. STUDY CONTENT & TOPICS TAB */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Study Content & Topic Editor</h2>
                  <p className="text-xs text-slate-400">
                    Add topics, edit high-yield explanations, key clinical points, and quick revision takeaways
                  </p>
                </div>

                {/* Subject Selector */}
                <div className="flex flex-wrap items-center gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <label className="text-xs font-semibold text-slate-300">Select Subject:</label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code} - {s.name} ({s.topics?.length || 0} topics)
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      if (!selectedSubjectId) return;
                      setEditingTopic({
                        subjectId: selectedSubjectId,
                        topic: {
                          id: `top_${Date.now()}`,
                          subjectId: selectedSubjectId,
                          title: '',
                          keyPoints: [],
                        },
                      });
                      setIsNewTopic(true);
                    }}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-all"
                  >
                    <Plus size={14} />
                    <span>Add Topic to Subject</span>
                  </button>
                </div>

                {/* Topics in Selected Subject */}
                {currentSelectedSubject && (
                  <div className="space-y-3">
                    {currentSelectedSubject.topics && currentSelectedSubject.topics.length > 0 ? (
                      currentSelectedSubject.topics.map((top, idx) => {
                        const content = studyContent[top.id];
                        return (
                          <div
                            key={top.id}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4"
                          >
                            <div className="space-y-1 max-w-xl">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-slate-500">#{idx + 1}</span>
                                <h4 className="font-bold text-white text-sm">{top.title}</h4>
                              </div>
                              {content?.explanation ? (
                                <p className="text-xs text-slate-400 line-clamp-2">{content.explanation}</p>
                              ) : (
                                <p className="text-xs text-slate-500 italic">No custom study material written yet.</p>
                              )}
                              {content?.quickRevisionLine && (
                                <p className="text-[11px] text-teal-400/90 font-medium">
                                  💡 {content.quickRevisionLine}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingStudyContent({
                                    topicId: top.id,
                                    content: content || {
                                      title: top.title,
                                      explanation: '',
                                      keyPoints: [],
                                      clinicalImportance: '',
                                      quickRevisionLine: '',
                                    },
                                  });
                                }}
                                className="px-3 py-1.5 bg-teal-950/60 hover:bg-teal-900/60 border border-teal-800/40 text-teal-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                              >
                                <FileText size={14} />
                                <span>Edit Material</span>
                              </button>

                              <button
                                onClick={() => {
                                  setEditingTopic({
                                    subjectId: currentSelectedSubject.id,
                                    topic: top,
                                  });
                                  setIsNewTopic(false);
                                }}
                                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors"
                                title="Edit Topic Title"
                              >
                                <Edit2 size={14} />
                              </button>

                              <button
                                onClick={() => handleDeleteTopic(currentSelectedSubject.id, top.id, top.title)}
                                className="p-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-xl text-xs transition-colors"
                                title="Delete Topic"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12 text-slate-500 text-sm">
                        No topics in this subject yet. Click "+ Add Topic to Subject" above.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 4. AI TUTOR SETTINGS TAB */}
            {activeTab === 'ai' && aiConfig && (
              <div className="space-y-8">
                <form onSubmit={handleSaveAIConfig} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h2 className="text-lg font-bold text-white">AI Tutor Persona & Behavior</h2>
                      <p className="text-xs text-slate-400">Control AI name, greeting, personality prompt, and answer length</p>
                    </div>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all"
                    >
                      <Save size={15} />
                      <span>Save AI Settings</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">AI Tutor Name</label>
                      <input
                        type="text"
                        value={aiConfig.aiName}
                        onChange={(e) => setAIConfig({ ...aiConfig, aiName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subtitle / Tagline</label>
                      <input
                        type="text"
                        value={aiConfig.subtitle}
                        onChange={(e) => setAIConfig({ ...aiConfig, subtitle: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Greeting Message</label>
                      <input
                        type="text"
                        value={aiConfig.greeting}
                        onChange={(e) => setAIConfig({ ...aiConfig, greeting: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Default Answer Length</label>
                      <select
                        value={aiConfig.defaultAnswerLength}
                        onChange={(e: any) => setAIConfig({ ...aiConfig, defaultAnswerLength: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="short">Short (1–5 crisp lines, recommended)</option>
                        <option value="medium">Medium (Concise clinical summary)</option>
                        <option value="detailed">Detailed (Full textbook breakdown)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Language Style</label>
                      <select
                        value={aiConfig.languageBehavior}
                        onChange={(e: any) => setAIConfig({ ...aiConfig, languageBehavior: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="hinglish">Hinglish / Hindi + English (Natural student tone)</option>
                        <option value="english">Pure English</option>
                        <option value="hindi">Pure Hindi</option>
                        <option value="auto">Auto detect student input</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      AI Tutor System Prompt & Personality Instructions
                    </label>
                    <textarea
                      rows={6}
                      value={aiConfig.personalityPrompt}
                      onChange={(e) => setAIConfig({ ...aiConfig, personalityPrompt: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 leading-relaxed"
                    />
                  </div>
                </form>

                {/* Custom Verified Knowledge Snippets */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Sparkles size={18} className="text-teal-400" />
                        <span>Verified Knowledge Base (Custom Study Material)</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Add official college notes and verified diagnostic procedures so AI always answers with precision
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingSnippet({
                          id: `snip_${Date.now()}`,
                          subjectId: subjects[0]?.id || 'hema_blood',
                          title: '',
                          content: '',
                        });
                        setIsNewSnippet(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-all"
                    >
                      <Plus size={14} />
                      <span>Add Knowledge Snippet</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {aiConfig.verifiedKnowledgeSnippets && aiConfig.verifiedKnowledgeSnippets.length > 0 ? (
                      aiConfig.verifiedKnowledgeSnippets.map((snip) => (
                        <div
                          key={snip.id}
                          className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-wrap items-start justify-between gap-3"
                        >
                          <div className="space-y-1 max-w-2xl">
                            <h4 className="font-bold text-sm text-teal-300">{snip.title}</h4>
                            <p className="text-xs text-slate-300 leading-relaxed">{snip.content}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingSnippet(snip);
                                setIsNewSnippet(false);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                              title="Edit"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteSnippet(snip.id)}
                              className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-lg text-xs"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 py-4 text-center">
                        No verified knowledge snippets yet. Click "+ Add Knowledge Snippet" to supply custom verified material.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 5. WEBSITE & APPEARANCE TAB */}
            {activeTab === 'website' && websiteConfig && (
              <form onSubmit={handleSaveWebsiteConfig} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h2 className="text-lg font-bold text-white">Website & Appearance Editor</h2>
                    <p className="text-xs text-slate-400">
                      Customize visible titles, motivation quotes, animation intensity, and Home Page Builder
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all"
                  >
                    <Save size={15} />
                    <span>Save Website Settings</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Website Name</label>
                    <input
                      type="text"
                      value={websiteConfig.websiteName}
                      onChange={(e) => setWebsiteConfig({ ...websiteConfig, websiteName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Website Subtitle</label>
                    <input
                      type="text"
                      value={websiteConfig.subtitle}
                      onChange={(e) => setWebsiteConfig({ ...websiteConfig, subtitle: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Dashboard Greeting</label>
                    <input
                      type="text"
                      value={websiteConfig.dashboardGreeting}
                      onChange={(e) => setWebsiteConfig({ ...websiteConfig, dashboardGreeting: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Start Button Text</label>
                    <input
                      type="text"
                      value={websiteConfig.startButtonText}
                      onChange={(e) => setWebsiteConfig({ ...websiteConfig, startButtonText: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Complete Button Text</label>
                    <input
                      type="text"
                      value={websiteConfig.completeButtonText}
                      onChange={(e) => setWebsiteConfig({ ...websiteConfig, completeButtonText: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Animation Intensity (Micro-Interactions)
                    </label>
                    <select
                      value={websiteConfig.animationIntensity}
                      onChange={(e: any) =>
                        setWebsiteConfig({ ...websiteConfig, animationIntensity: e.target.value as AnimationIntensity })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-semibold text-teal-400"
                    >
                      <option value="high">High (Silky smooth, modern transitions)</option>
                      <option value="medium">Medium (Standard modern app)</option>
                      <option value="low">Low (Fast & subtle)</option>
                      <option value="off">Off (Zero animations)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Theme Accent Color</label>
                    <select
                      value={websiteConfig.themeAccent}
                      onChange={(e) => setWebsiteConfig({ ...websiteConfig, themeAccent: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="teal">Teal (Medical Cyan)</option>
                      <option value="emerald">Emerald (Clinical Green)</option>
                      <option value="blue">Blue (Hospital Blue)</option>
                      <option value="indigo">Indigo (Deep Laboratory)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Card Corner Radius</label>
                    <select
                      value={websiteConfig.borderRadius}
                      onChange={(e: any) => setWebsiteConfig({ ...websiteConfig, borderRadius: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="rounded-2xl">Modern 16px (rounded-2xl)</option>
                      <option value="rounded-xl">Classic 12px (rounded-xl)</option>
                      <option value="rounded-3xl">Pill Smooth 24px (rounded-3xl)</option>
                    </select>
                  </div>
                </div>

                {/* Home Page Section Builder */}
                <div className="pt-4 border-t border-slate-800">
                  <h3 className="text-sm font-bold text-white mb-2">Home Page Section Builder</h3>
                  <p className="text-xs text-slate-400 mb-3">Reorder or toggle visibility of sections on the student home screen</p>

                  <div className="space-y-2">
                    {websiteConfig.homeSections.map((sec, idx) => (
                      <div
                        key={sec.id}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-slate-500">#{idx + 1}</span>
                          <span className="text-sm font-semibold text-slate-200">{sec.title}</span>
                          <span className="text-xs text-slate-500 font-mono">({sec.id})</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const updatedSections = [...websiteConfig.homeSections];
                              updatedSections[idx] = { ...sec, visible: !sec.visible };
                              setWebsiteConfig({ ...websiteConfig, homeSections: updatedSections });
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                              sec.visible ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {sec.visible ? 'Visible ✓' : 'Hidden'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            )}

            {/* 6. BADGES & XP TAB */}
            {activeTab === 'badges' && websiteConfig && (
              <div className="space-y-6">
                <form
                  onSubmit={handleSaveWebsiteConfig}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h2 className="text-lg font-bold text-white">XP Rewards Manager</h2>
                      <p className="text-xs text-slate-400">Configure XP awarded when a student completes study activities</p>
                    </div>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all"
                    >
                      <Save size={15} />
                      <span>Save XP Rules</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <label className="block text-xs font-medium text-slate-400 mb-1">Topic Completion</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={websiteConfig.xpRewards.topicCompletion}
                          onChange={(e) =>
                            setWebsiteConfig({
                              ...websiteConfig,
                              xpRewards: {
                                ...websiteConfig.xpRewards,
                                topicCompletion: Number(e.target.value) || 20,
                              },
                            })
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-base font-bold text-amber-400 font-mono"
                        />
                        <span className="text-xs text-slate-400">XP</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <label className="block text-xs font-medium text-slate-400 mb-1">Quiz Completion</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={websiteConfig.xpRewards.quizCompletion}
                          onChange={(e) =>
                            setWebsiteConfig({
                              ...websiteConfig,
                              xpRewards: {
                                ...websiteConfig.xpRewards,
                                quizCompletion: Number(e.target.value) || 10,
                              },
                            })
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-base font-bold text-amber-400 font-mono"
                        />
                        <span className="text-xs text-slate-400">XP</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <label className="block text-xs font-medium text-slate-400 mb-1">Revision Task</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={websiteConfig.xpRewards.revisionCompletion}
                          onChange={(e) =>
                            setWebsiteConfig({
                              ...websiteConfig,
                              xpRewards: {
                                ...websiteConfig.xpRewards,
                                revisionCompletion: Number(e.target.value) || 10,
                              },
                            })
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-base font-bold text-amber-400 font-mono"
                        />
                        <span className="text-xs text-slate-400">XP</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <label className="block text-xs font-medium text-slate-400 mb-1">Daily Study Goal</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={websiteConfig.xpRewards.dailyGoal}
                          onChange={(e) =>
                            setWebsiteConfig({
                              ...websiteConfig,
                              xpRewards: {
                                ...websiteConfig.xpRewards,
                                dailyGoal: Number(e.target.value) || 20,
                              },
                            })
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-base font-bold text-amber-400 font-mono"
                        />
                        <span className="text-xs text-slate-400">XP</span>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Badge Definitions */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h3 className="text-base font-bold text-white">Syllabus Badges & Achievements</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {BADGES_DEFINITION.map((badge) => (
                      <div key={badge.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                          <Award size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-xs">{badge.title}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">{badge.description}</p>
                          <span className="inline-block mt-1 text-[10px] bg-slate-800 text-teal-400 px-2 py-0.5 rounded font-mono">
                            Condition: {badge.condition}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 7. SYSTEM & DATABASE TAB */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Zap size={20} className="text-teal-400" />
                    <span>Cloud Storage & System Status</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Real-time status of backend data files, active session tokens, and backup options
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <p className="text-xs text-slate-400">Students Database</p>
                      <p className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span>Connected (/data/students.json)</span>
                      </p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <p className="text-xs text-slate-400">Subjects & Topics</p>
                      <p className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span>{subjects.length} Subjects Active</span>
                      </p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <p className="text-xs text-slate-400">AI Tutor Engine</p>
                      <p className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span>DMLT Buddy 🤖 Ready</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-3">
                    <button
                      onClick={handleExportData}
                      className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
                    >
                      <Download size={15} />
                      <span>Download Full JSON Backup</span>
                    </button>
                    <button
                      onClick={loadAllData}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-2 transition-all"
                    >
                      <RefreshCw size={15} />
                      <span>Refresh From Server</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL: Edit Subject */}
      <AnimatePresence>
        {editingSubject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <h3 className="text-base font-bold text-white">
                {isNewSubject ? 'Add New Subject' : `Edit Subject: ${editingSubject.name}`}
              </h3>

              <form onSubmit={handleSaveSubject} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingSubject.name}
                    onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Code</label>
                    <input
                      type="text"
                      required
                      value={editingSubject.code}
                      onChange={(e) => setEditingSubject({ ...editingSubject, code: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Short Name</label>
                    <input
                      type="text"
                      value={editingSubject.shortName}
                      onChange={(e) => setEditingSubject({ ...editingSubject, shortName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingSubject.description}
                    onChange={(e) => setEditingSubject({ ...editingSubject, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingSubject(null)}
                    className="px-4 py-2 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs"
                  >
                    Save Subject
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Edit Topic */}
      <AnimatePresence>
        {editingTopic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <h3 className="text-base font-bold text-white">
                {isNewTopic ? 'Add New Topic' : 'Edit Topic'}
              </h3>

              <form onSubmit={handleSaveTopic} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Topic Title</label>
                  <input
                    type="text"
                    required
                    value={editingTopic.topic.title}
                    onChange={(e) =>
                      setEditingTopic({
                        ...editingTopic,
                        topic: { ...editingTopic.topic, title: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingTopic(null)}
                    className="px-4 py-2 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs"
                  >
                    Save Topic
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Edit Study Material */}
      <AnimatePresence>
        {editingStudyContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-base font-bold text-white flex items-center justify-between">
                <span>Study Material: {editingStudyContent.content.title}</span>
                <span className="text-xs text-slate-500 font-mono">ID: {editingStudyContent.topicId}</span>
              </h3>

              <form onSubmit={handleSaveStudyContent} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Clear Explanation</label>
                  <textarea
                    rows={4}
                    value={editingStudyContent.content.explanation}
                    onChange={(e) =>
                      setEditingStudyContent({
                        ...editingStudyContent,
                        content: { ...editingStudyContent.content, explanation: e.target.value },
                      })
                    }
                    placeholder="Provide simple, crystal-clear explanation for 1st year students..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Key Points (one bullet per line)
                  </label>
                  <textarea
                    rows={4}
                    value={(editingStudyContent.content.keyPoints || []).join('\n')}
                    onChange={(e) =>
                      setEditingStudyContent({
                        ...editingStudyContent,
                        content: {
                          ...editingStudyContent.content,
                          keyPoints: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                        },
                      })
                    }
                    placeholder="Key step 1&#10;Key step 2&#10;Key step 3"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Clinical Importance</label>
                  <textarea
                    rows={2}
                    value={editingStudyContent.content.clinicalImportance || ''}
                    onChange={(e) =>
                      setEditingStudyContent({
                        ...editingStudyContent,
                        content: { ...editingStudyContent.content, clinicalImportance: e.target.value },
                      })
                    }
                    placeholder="Why this matters in clinical lab diagnosis..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Quick Revision Takeaway Line</label>
                  <input
                    type="text"
                    value={editingStudyContent.content.quickRevisionLine || ''}
                    onChange={(e) =>
                      setEditingStudyContent({
                        ...editingStudyContent,
                        content: { ...editingStudyContent.content, quickRevisionLine: e.target.value },
                      })
                    }
                    placeholder="One memorable exam takeaway sentence..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingStudyContent(null)}
                    className="px-4 py-2 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs"
                  >
                    Save Material
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Edit Knowledge Snippet */}
      <AnimatePresence>
        {editingSnippet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <h3 className="text-base font-bold text-white">
                {isNewSnippet ? 'Add Verified Knowledge' : 'Edit Knowledge Snippet'}
              </h3>

              <form onSubmit={handleSaveSnippet} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Title / Concept</label>
                  <input
                    type="text"
                    required
                    value={editingSnippet.title}
                    onChange={(e) => setEditingSnippet({ ...editingSnippet, title: e.target.value })}
                    placeholder="e.g. Sahli's Hemoglobin Estimation Method"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Association</label>
                  <select
                    value={editingSnippet.subjectId}
                    onChange={(e) => setEditingSnippet({ ...editingSnippet, subjectId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Verified Clinical Notes</label>
                  <textarea
                    rows={5}
                    required
                    value={editingSnippet.content}
                    onChange={(e) => setEditingSnippet({ ...editingSnippet, content: e.target.value })}
                    placeholder="Paste exact syllabus notes, values, formulas or procedures..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingSnippet(null)}
                    className="px-4 py-2 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs"
                  >
                    Save Snippet
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRMATION DIALOG */}
      <AnimatePresence>
        {confirmDialog && confirmDialog.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-slate-900 border border-rose-900/60 rounded-2xl p-5 shadow-2xl space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-base font-bold text-white">{confirmDialog.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{confirmDialog.message}</p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setConfirmDialog(null)}
                  className="px-3 py-1.5 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDialog.onConfirm}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs"
                >
                  Confirm Action
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
