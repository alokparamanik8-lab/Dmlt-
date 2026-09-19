export type StudentId = 'bishnudev' | 'alok';

export type NavTab = 'home' | 'subjects' | 'aitutor' | 'profile';

export interface StudentProfile {
  id: StudentId;
  name: string;
  role: string;
  avatarInitials: string;
  accentColor: string;
}

export type TopicStatus = 'not_started' | 'in_progress' | 'completed';
export type RevisionStatus = 'needs_revision' | 'revised' | 'strong';

export type AnimationIntensity = 'off' | 'low' | 'medium' | 'high';

export interface WebsiteConfig {
  websiteName: string;
  subtitle: string;
  welcomeMessage: string;
  dashboardGreeting: string;
  motivationMessages: string[];
  startButtonText: string;
  completeButtonText: string;
  footerText: string;
  themeAccent: string; // 'teal' | 'indigo' | 'emerald' | 'blue' | 'rose'
  themeMode: 'light' | 'dark' | 'system';
  borderRadius: 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl';
  animationIntensity: AnimationIntensity;
  homeSections: {
    id: 'welcome' | 'todayStudy' | 'progress' | 'continueStudy' | 'badges' | 'motivation';
    title: string;
    visible: boolean;
  }[];
  xpRewards: {
    topicCompletion: number;
    quizCompletion: number;
    revisionCompletion: number;
    dailyGoal: number;
  };
}

export interface VerifiedKnowledgeSnippet {
  id: string;
  subjectId: string;
  topicId?: string;
  title: string;
  content: string;
  tags?: string[];
  updatedAt?: string;
}

export interface AITutorConfig {
  aiName: string;
  subtitle: string;
  greeting: string;
  personalityPrompt: string;
  defaultAnswerLength: 'short' | 'medium' | 'detailed';
  languageBehavior: 'hinglish' | 'hindi' | 'english' | 'auto';
  quickButtons: {
    id: string;
    label: string;
    action: 'explain' | 'quiz' | 'revise' | 'custom';
    prompt?: string;
  }[];
  verifiedKnowledgeSnippets?: VerifiedKnowledgeSnippet[];
}

export interface TopicStudyMaterial {
  title: string;
  explanation: string;
  keyPoints: string[];
  clinicalImportance: string;
  quickRevisionLine: string;
  normalValues?: string;
  quizQuestions?: QuizQuestion[];
}

export interface TopicItem {
  id: string;
  title: string;
  subjectId: string;
  defaultStatus?: TopicStatus;
  keyPoints?: string[];
  explanation?: string;
  isHidden?: boolean;
}

export interface SubjectItem {
  id: string;
  name: string;
  shortName: string;
  code: string;
  iconName: string;
  description: string;
  topics: TopicItem[];
  isHidden?: boolean;
}

export interface DailyMission {
  id: string;
  title: string;
  subject: string;
  xpReward: number;
  completed: boolean;
  date: string;
  category: 'study' | 'revise' | 'practice' | 'goal';
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  condition: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface StudyNote {
  id: string;
  subject: string;
  topic: string;
  title: string;
  content: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizQuestion {
  id: string;
  subject: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DayStudyRecord {
  tasksCompleted: number;
  xpEarned: number;
  subjects: string[];
}

export interface StudentData {
  studentId: StudentId;
  name?: string;
  xp: number;
  completedTopics?: string[];
  completedTaskIds: string[];
  streak: {
    currentStreak: number;
    bestStreak: number;
    lastActiveDate: string;
  };
  topicsState: Record<string, {
    status: TopicStatus;
    revisionStatus?: RevisionStatus;
    completedAt?: string;
  }>;
  customTopics?: {
    id: string;
    subjectId: string;
    title: string;
    status: TopicStatus;
    revisionStatus: RevisionStatus;
  }[];
  dailyMissions?: DailyMission[];
  customTasks?: DailyMission[];
  notes: StudyNote[];
  quizHistory?: {
    id: string;
    date: string;
    subject: string;
    score: number;
    total: number;
    xpEarned: number;
  }[];
  historyByDate?: Record<string, DayStudyRecord>;
  unlockedBadgeIds: string[];
  lastUpdated?: string;
}

export interface LevelInfo {
  level: number;
  name: string;
  minXp: number;
  maxXp: number | null;
}

export type AdminTab =
  | 'students'
  | 'subjects'
  | 'content'
  | 'ai'
  | 'website'
  | 'badges'
  | 'settings';

