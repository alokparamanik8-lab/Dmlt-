import React, { useState, useEffect } from 'react';
import {
  StudentId,
  StudentData,
  SubjectItem,
  TopicItem,
  NavTab,
  WebsiteConfig,
} from './types';
import { STUDENTS, SYLLABUS_SUBJECTS } from './data/syllabus';
import {
  getActiveStudentId,
  setActiveStudentId,
  loadStudentData,
  syncStudentFromCloud,
  completeTopic,
  saveTopicNote,
  deleteTopicNote,
  resetStudentCloudAndLocal,
} from './utils/storage';
import { fetchSubjects, fetchWebsiteConfig, setAdminToken as setApiAdminToken } from './utils/api';

// Components
import { StudentSelectModal } from './components/StudentSelectModal';
import { DesktopSidebar } from './components/DesktopSidebar';
import { MobileNav } from './components/MobileNav';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { TopicStudyModal } from './components/TopicStudyModal';
import { AdminLoginModal } from './components/AdminLoginModal';

// Views
import { HomeView } from './views/HomeView';
import { SubjectsView } from './views/SubjectsView';
import { SubjectDetailView } from './views/SubjectDetailView';
import { AITutorView } from './views/AITutorView';
import { ProfileView } from './views/ProfileView';
import { AdminDashboardView } from './views/AdminDashboardView';

export default function App() {
  const [activeStudentId, setActiveIdState] = useState<StudentId | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(null);

  // Dynamic Subjects List (synced with cloud and admin edits)
  const [subjectsList, setSubjectsList] = useState<SubjectItem[]>(SYLLABUS_SUBJECTS);
  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig | null>(null);

  // Active topic study reader modal
  const [activeStudy, setActiveStudy] = useState<{
    subject: SubjectItem;
    topic: TopicItem;
  } | null>(null);

  // AI Tutor initial subject/topic context
  const [aiContext, setAiContext] = useState<{
    subject?: SubjectItem | null;
    topic?: TopicItem | null;
  }>({});

  // Admin Control Center State
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [adminToken, setAdminTokenState] = useState<string | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; subMessage?: string } | null>(null);

  // Initialize active student on mount and sync with cloud
  useEffect(() => {
    const savedId = getActiveStudentId();
    if (savedId) {
      setActiveIdState(savedId);
      const localData = loadStudentData(savedId);
      setStudentData(localData);

      // Background cloud fetch to update any external changes
      syncStudentFromCloud(savedId).then((cloudData) => {
        setStudentData(cloudData);
      });
    } else {
      setIsStudentModalOpen(true);
    }

    // Check saved admin session if any
    const savedAdminToken = localStorage.getItem('dmlt_admin_token');
    if (savedAdminToken) {
      setAdminTokenState(savedAdminToken);
      setApiAdminToken(savedAdminToken);
    }

    // Load subjects & website config from backend
    fetchSubjects().then((subs) => {
      if (subs && subs.length > 0) {
        setSubjectsList(subs);
      }
    });

    fetchWebsiteConfig().then((cfg) => {
      if (cfg) {
        setWebsiteConfig(cfg);
      }
    });
  }, []);

  const showToast = (message: string, subMessage?: string) => {
    setToast({ message, subMessage });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  const handleSelectStudent = (id: StudentId) => {
    setActiveStudentId(id);
    setActiveIdState(id);
    const localData = loadStudentData(id);
    setStudentData(localData);
    setIsStudentModalOpen(false);
    showToast(`Logged in as ${id === 'bishnudev' ? 'Bishnudev Paramanik' : 'Alok Paramanik'}`);

    // Sync from cloud database for selected student
    syncStudentFromCloud(id).then((cloudData) => {
      setStudentData(cloudData);
    });
  };

  const handleSwitchStudentClick = () => {
    setIsStudentModalOpen(true);
  };

  const activeProfile = STUDENTS.find((s) => s.id === activeStudentId) || STUDENTS[0];

  // Topic Completion ([✓ I Finished This])
  const handleCompleteTopic = (topicId: string) => {
    if (!activeStudentId || !studentData) return;

    const { updatedData, isNewlyCompleted, newBadges } = completeTopic(
      activeStudentId,
      topicId
    );

    setStudentData(updatedData);

    if (isNewlyCompleted) {
      if (newBadges.length > 0) {
        showToast(
          'Topic completed! 🎉 (+20 XP)',
          `🏆 Unlocked Badge: ${newBadges[0].title}`
        );
      } else {
        showToast('Topic completed! 🎉', '+20 XP earned');
      }
    } else {
      showToast('Topic already completed', 'No duplicate XP awarded.');
    }
  };

  // Award XP (e.g. from AI Quiz completion)
  const handleAwardXP = (amount: number, reason: string) => {
    if (!activeStudentId || !studentData) return;
    const currentXp = studentData.xp || 0;
    const newXp = currentXp + amount;
    const updated = { ...studentData, xp: newXp };
    setStudentData(updated);
    localStorage.setItem(`dmlt_data_${activeStudentId}`, JSON.stringify(updated));

    // Async push to server
    fetch(`/api/students/${activeStudentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});

    showToast(`+${amount} XP Earned! ⭐`, reason);
  };

  // Open Topic Modal for real study material
  const handleOpenTopic = (subject: SubjectItem, topic: TopicItem) => {
    setActiveStudy({ subject, topic });
  };

  // Ask AI from inside topic or home
  const handleAskAIFromTopic = (subject: SubjectItem, topic: TopicItem) => {
    setActiveStudy(null);
    setAiContext({ subject, topic });
    setCurrentTab('aitutor');
  };

  // Notes inside topic
  const handleSaveNote = (
    subject: string,
    topic: string,
    content: string,
    title?: string,
    noteId?: string
  ) => {
    if (!activeStudentId) return;
    const updated = saveTopicNote(activeStudentId, subject, topic, content, title, noteId);
    setStudentData(updated);
    showToast(noteId ? 'Note Updated' : 'Note Saved');
  };

  const handleDeleteNote = (noteId: string) => {
    if (!activeStudentId) return;
    const updated = deleteTopicNote(activeStudentId, noteId);
    setStudentData(updated);
    showToast('Note Deleted');
  };

  // Reset progress for this student ONLY
  const handleResetStudentProgress = async () => {
    if (!activeStudentId) return;
    const fresh = await resetStudentCloudAndLocal(activeStudentId);
    setStudentData(fresh);
    showToast('Progress Reset', `Reset study progress for ${activeProfile.name}`);
  };

  const isTopicCompleted = (topicId: string) => {
    if (!studentData) return false;
    return (
      Boolean(studentData.completedTopics?.includes(topicId)) ||
      studentData.topicsState[topicId]?.status === 'completed'
    );
  };

  // Admin Login Handlers
  const handleAdminLoginSuccess = (token: string) => {
    setAdminTokenState(token);
    setApiAdminToken(token);
    localStorage.setItem('dmlt_admin_token', token);
    setIsAdminLoginOpen(false);
    setIsAdminDashboardOpen(true);
    showToast('Admin Logged In', 'Welcome to Admin Control Center');
  };

  const handleAdminLogout = () => {
    setAdminTokenState(null);
    setApiAdminToken(null);
    localStorage.removeItem('dmlt_admin_token');
    setIsAdminDashboardOpen(false);
    showToast('Admin Logged Out');
  };

  // If Admin Dashboard is active, render it full screen
  if (isAdminDashboardOpen && adminToken) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
        {toast && (
          <Toast
            message={toast.message}
            subMessage={toast.subMessage}
            onClose={() => setToast(null)}
          />
        )}
        <AdminDashboardView
          adminToken={adminToken}
          onExit={() => setIsAdminDashboardOpen(false)}
          onLogout={handleAdminLogout}
          onConfigUpdated={(cfg) => setWebsiteConfig(cfg)}
          onSubjectsUpdated={(subs) => setSubjectsList(subs)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row antialiased font-sans">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          subMessage={toast.subMessage}
          onClose={() => setToast(null)}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Student Selection Modal */}
      <StudentSelectModal
        isOpen={isStudentModalOpen || !activeStudentId}
        activeStudentId={activeStudentId}
        onSelectStudent={handleSelectStudent}
        onClose={() => setIsStudentModalOpen(false)}
        canClose={Boolean(activeStudentId)}
      />

      {/* Topic Study Material Modal */}
      {activeStudy && activeStudentId && studentData && (
        <TopicStudyModal
          topic={activeStudy.topic}
          subject={activeStudy.subject}
          studentId={activeStudentId}
          isCompleted={isTopicCompleted(activeStudy.topic.id)}
          notes={studentData.notes || []}
          onCompleteTopic={handleCompleteTopic}
          onAskAI={handleAskAIFromTopic}
          onSaveNote={handleSaveNote}
          onDeleteNote={handleDeleteNote}
          onClose={() => setActiveStudy(null)}
        />
      )}

      {activeStudentId && studentData && (
        <>
          {/* Desktop Left Sidebar: Exactly 4 Items + Discreet Admin link */}
          <DesktopSidebar
            currentTab={currentTab}
            onTabChange={(tab) => {
              setCurrentTab(tab);
              if (tab !== 'subjects') setSelectedSubject(null);
            }}
            student={activeProfile}
            onSwitchStudent={handleSwitchStudentClick}
            xp={studentData.xp}
            streakDays={studentData.streak.currentStreak}
            onOpenAdmin={() => {
              if (adminToken) {
                setIsAdminDashboardOpen(true);
              } else {
                setIsAdminLoginOpen(true);
              }
            }}
          />

          {/* Main App Content Area */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 md:pb-6">
            {/* Clean Minimal Header */}
            <Header
              student={activeProfile}
              onSwitchStudent={handleSwitchStudentClick}
              streakDays={studentData.streak.currentStreak}
              xp={studentData.xp}
              onOpenAdmin={() => {
                if (adminToken) {
                  setIsAdminDashboardOpen(true);
                } else {
                  setIsAdminLoginOpen(true);
                }
              }}
            />

            {/* Main Tab Views */}
            <main className="flex-1 max-w-2xl w-full mx-auto px-3.5 sm:px-6 py-4">
              {/* 1. 🏠 Home */}
              {currentTab === 'home' && (
                <HomeView
                  student={activeProfile}
                  studentData={studentData}
                  onOpenTopic={handleOpenTopic}
                  onSelectSubject={(subject) => {
                    setSelectedSubject(subject);
                    setCurrentTab('subjects');
                  }}
                  onCompleteTopic={handleCompleteTopic}
                  onNavigateToTab={(tab) => {
                    setCurrentTab(tab);
                    if (tab !== 'subjects') setSelectedSubject(null);
                  }}
                  subjectsList={subjectsList}
                />
              )}

              {/* 2. 📚 Subjects */}
              {currentTab === 'subjects' &&
                (selectedSubject ? (
                  <SubjectDetailView
                    subject={selectedSubject}
                    studentData={studentData}
                    onBack={() => setSelectedSubject(null)}
                    onOpenTopic={handleOpenTopic}
                    onAskAI={handleAskAIFromTopic}
                  />
                ) : (
                  <SubjectsView
                    studentData={studentData}
                    onSelectSubject={(subj) => setSelectedSubject(subj)}
                    subjectsList={subjectsList}
                  />
                ))}

              {/* 3. 🤖 AI Tutor (DMLT Buddy) */}
              {currentTab === 'aitutor' && (
                <AITutorView
                  initialSubject={aiContext.subject}
                  initialTopic={aiContext.topic}
                  onAwardXP={handleAwardXP}
                  subjectsList={subjectsList}
                />
              )}

              {/* 4. 👤 Profile */}
              {currentTab === 'profile' && (
                <ProfileView
                  student={activeProfile}
                  studentData={studentData}
                  onSwitchStudent={handleSwitchStudentClick}
                  onResetStudentProgress={handleResetStudentProgress}
                  onOpenAdmin={() => {
                    if (adminToken) {
                      setIsAdminDashboardOpen(true);
                    } else {
                      setIsAdminLoginOpen(true);
                    }
                  }}
                />
              )}
            </main>

            {/* Mobile Bottom Navigation: Exactly 4 Items */}
            <MobileNav
              currentTab={currentTab}
              onTabChange={(tab) => {
                setCurrentTab(tab);
                if (tab !== 'subjects') setSelectedSubject(null);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
