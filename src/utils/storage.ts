import { StudentId, StudentData, LevelInfo, DailyMission, StudyNote } from '../types';
import { SYLLABUS_SUBJECTS, LEVELS, XP_CONFIG, BADGES_DEFINITION } from '../data/syllabus';

const STORAGE_PREFIX = 'dmlt_study_hub_';
const ACTIVE_STUDENT_KEY = 'dmlt_study_hub_active_student_id';

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getInitialStudentData(studentId: StudentId): StudentData {
  const today = getTodayDateString();
  return {
    studentId,
    name: studentId === 'bishnudev' ? 'Bishnudev Paramanik' : 'Alok Paramanik',
    xp: 0,
    completedTopics: [],
    completedTaskIds: [],
    streak: {
      currentStreak: 1,
      bestStreak: 1,
      lastActiveDate: today,
    },
    topicsState: {},
    notes: [
      {
        id: `note_welcome_${studentId}`,
        subject: 'Hematology and Blood Banking',
        topic: 'Hemoglobin Estimation (Sahli’s & Cyanmethemoglobin Methods)',
        title: 'Sahli vs Cyanmethemoglobin',
        content: 'Sahli’s method converts Hb to acid hematin with N/10 HCl (read at 10 mins). Cyanmethemoglobin uses Drabkin’s reagent at 540 nm (standard reference method).',
        date: today,
      },
    ],
    unlockedBadgeIds: ['first_topic'],
    lastUpdated: new Date().toISOString(),
  };
}

export function loadActiveStudentId(): StudentId | null {
  try {
    const val = localStorage.getItem(ACTIVE_STUDENT_KEY);
    if (val === 'bishnudev' || val === 'alok') {
      return val;
    }
    return null;
  } catch (e) {
    console.error('Failed to load active student id', e);
    return null;
  }
}

export function saveActiveStudentId(studentId: StudentId | null): void {
  try {
    if (studentId) {
      localStorage.setItem(ACTIVE_STUDENT_KEY, studentId);
    } else {
      localStorage.removeItem(ACTIVE_STUDENT_KEY);
    }
  } catch (e) {
    console.error('Failed to save active student id', e);
  }
}

export function loadStudentData(studentId: StudentId): StudentData {
  try {
    const key = `${STORAGE_PREFIX}${studentId}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      const initial = getInitialStudentData(studentId);
      saveStudentData(studentId, initial);
      return initial;
    }

    const parsed: StudentData = JSON.parse(raw);
    if (!parsed.completedTopics) parsed.completedTopics = [];
    if (!parsed.completedTaskIds) parsed.completedTaskIds = [];
    if (!parsed.notes) parsed.notes = [];
    if (!parsed.unlockedBadgeIds) parsed.unlockedBadgeIds = ['first_topic'];
    if (!parsed.topicsState) parsed.topicsState = {};
    if (!parsed.streak) {
      parsed.streak = { currentStreak: 1, bestStreak: 1, lastActiveDate: getTodayDateString() };
    }

    return parsed;
  } catch (e) {
    console.error(`Error loading data for ${studentId}:`, e);
    return getInitialStudentData(studentId);
  }
}

export function saveStudentData(studentId: StudentId, data: StudentData): void {
  try {
    const key = `${STORAGE_PREFIX}${studentId}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save student data for ${studentId}`, e);
  }
}

export function resetStudentData(studentId: StudentId): StudentData {
  const fresh = getInitialStudentData(studentId);
  saveStudentData(studentId, fresh);
  return fresh;
}

// Cloud Synchronization
export async function syncStudentFromCloud(studentId: StudentId): Promise<StudentData> {
  try {
    const res = await fetch(`/api/students/${studentId}`);
    if (res.ok) {
      const body = await res.json();
      if (body.student) {
        const local = loadStudentData(studentId);
        const merged: StudentData = {
          ...local,
          ...body.student,
          xp: Math.max(local.xp || 0, body.student.xp || 0),
          completedTopics: Array.from(new Set([...(local.completedTopics || []), ...(body.student.completedTopics || [])])),
          unlockedBadgeIds: Array.from(new Set([...(local.unlockedBadgeIds || []), ...(body.student.unlockedBadgeIds || [])])),
          notes: body.student.notes && body.student.notes.length > 0 ? body.student.notes : local.notes,
        };
        saveStudentData(studentId, merged);
        return merged;
      }
    }
  } catch (err) {
    console.warn('Sync from cloud failed, using offline local cache:', err);
  }
  return loadStudentData(studentId);
}

export async function syncStudentToCloud(studentId: StudentId, data: StudentData): Promise<boolean> {
  try {
    const res = await fetch(`/api/students/${studentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (err) {
    console.warn('Sync to cloud failed, progress preserved locally:', err);
    return false;
  }
}

export async function resetStudentCloudAndLocal(studentId: StudentId): Promise<StudentData> {
  try {
    const res = await fetch(`/api/students/${studentId}/reset`, { method: 'POST' });
    if (res.ok) {
      const body = await res.json();
      if (body.student) {
        saveStudentData(studentId, body.student);
        return body.student;
      }
    }
  } catch (err) {
    console.warn('Reset via cloud API failed, resetting locally:', err);
  }
  return resetStudentData(studentId);
}

export function calculateLevel(xp: number): {
  level: number;
  name: string;
  minXp: number;
  maxXp: number | null;
  progressPercent: number;
  xpToNext: number;
} {
  let matchedLevel: LevelInfo = LEVELS[0];

  for (const lvl of LEVELS) {
    if (xp >= lvl.minXp) {
      if (lvl.maxXp === null || xp <= lvl.maxXp) {
        matchedLevel = lvl;
        break;
      }
    }
  }

  if (xp >= 800) {
    matchedLevel = LEVELS[4];
    return {
      level: 5,
      name: matchedLevel.name,
      minXp: matchedLevel.minXp,
      maxXp: null,
      progressPercent: 100,
      xpToNext: 0,
    };
  }

  const range = (matchedLevel.maxXp ?? matchedLevel.minXp + 100) - matchedLevel.minXp;
  const currentLevelProgress = Math.max(0, xp - matchedLevel.minXp);
  const progressPercent = Math.min(100, Math.round((currentLevelProgress / range) * 100));
  const xpToNext = Math.max(0, (matchedLevel.maxXp ?? xp) + 1 - xp);

  return {
    level: matchedLevel.level,
    name: matchedLevel.name,
    minXp: matchedLevel.minXp,
    maxXp: matchedLevel.maxXp,
    progressPercent,
    xpToNext,
  };
}

export function calculateOverallProgress(data: StudentData): {
  totalTopics: number;
  completedTopics: number;
  percent: number;
  bySubject: Record<string, { total: number; completed: number; percent: number }>;
} {
  let totalTopics = 0;
  let completedTopics = 0;
  const bySubject: Record<string, { total: number; completed: number; percent: number }> = {};

  const completedSet = new Set<string>([
    ...(data.completedTopics || []),
    ...Object.entries(data.topicsState || {})
      .filter(([_, val]) => val?.status === 'completed')
      .map(([id]) => id),
  ]);

  for (const subject of SYLLABUS_SUBJECTS) {
    const allSubjectTopics = subject.topics;
    const total = allSubjectTopics.length;

    let completed = 0;
    for (const t of allSubjectTopics) {
      if (completedSet.has(t.id)) {
        completed++;
      }
    }

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    bySubject[subject.id] = { total, completed, percent };

    totalTopics += total;
    completedTopics += completed;
  }

  const percent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return {
    totalTopics,
    completedTopics,
    percent,
    bySubject,
  };
}

export function updateStreakOnActivity(streak: StudentData['streak']): {
  updatedStreak: StudentData['streak'];
  isNewDay: boolean;
} {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  if (streak.lastActiveDate === today) {
    return { updatedStreak: streak, isNewDay: false };
  }

  let newCurrent = streak.currentStreak;
  if (streak.lastActiveDate === yesterday) {
    newCurrent += 1;
  } else {
    newCurrent = 1;
  }

  const newBest = Math.max(streak.bestStreak, newCurrent);

  return {
    updatedStreak: {
      currentStreak: newCurrent,
      bestStreak: newBest,
      lastActiveDate: today,
    },
    isNewDay: true,
  };
}

export function evaluateBadges(data: StudentData): string[] {
  const unlocked = new Set<string>(data.unlockedBadgeIds || []);
  const overall = calculateOverallProgress(data);
  const streakDays = Math.max(data.streak.currentStreak, data.streak.bestStreak);

  // 1. First Topic
  if (overall.completedTopics >= 1 || (data.completedTopics && data.completedTopics.length >= 1)) {
    unlocked.add('first_topic');
  }

  // 2. 3 Day Streak
  if (streakDays >= 3) {
    unlocked.add('streak_3');
  }

  // 3. 7 Day Streak
  if (streakDays >= 7) {
    unlocked.add('streak_7');
  }

  // 4. 50% Complete
  if (overall.percent >= 50) {
    unlocked.add('halfway_there');
  }

  // 5. DMLT Complete
  if (overall.percent >= 100 || (overall.totalTopics > 0 && overall.completedTopics >= overall.totalTopics)) {
    unlocked.add('dmlt_complete');
  }

  return Array.from(unlocked);
}

// Single Main Action for Topic Completion: [✓ I Finished This Topic]
// Awards +20 XP, updates streak, subject progress, overall progress, and badges.
// Strictly prevents duplicate XP!
export function completeTopic(
  studentId: StudentId,
  topicId: string
): {
  updatedData: StudentData;
  isNewlyCompleted: boolean;
  newBadges: { id: string; title: string }[];
} {
  const data = loadStudentData(studentId);

  if (!data.completedTopics) data.completedTopics = [];
  const alreadyCompleted =
    data.completedTopics.includes(topicId) ||
    data.topicsState[topicId]?.status === 'completed';

  if (alreadyCompleted) {
    return { updatedData: data, isNewlyCompleted: false, newBadges: [] };
  }

  // Record completion
  data.completedTopics.push(topicId);
  data.topicsState[topicId] = {
    status: 'completed',
    completedAt: new Date().toISOString(),
  };

  // Award exactly +20 XP
  data.xp += 20;

  // Update streak
  const { updatedStreak } = updateStreakOnActivity(data.streak);
  data.streak = updatedStreak;

  // Evaluate badges
  const prevBadges = new Set(data.unlockedBadgeIds || []);
  const updatedBadges = evaluateBadges(data);
  const newlyUnlocked = updatedBadges
    .filter((id) => !prevBadges.has(id))
    .map((id) => {
      const def = BADGES_DEFINITION.find((b) => b.id === id);
      return { id, title: def ? def.title : id };
    });

  data.unlockedBadgeIds = updatedBadges;
  data.lastUpdated = new Date().toISOString();

  saveStudentData(studentId, data);
  syncStudentToCloud(studentId, data);

  return { updatedData: data, isNewlyCompleted: true, newBadges: newlyUnlocked };
}

// Notes inside each topic
export function saveTopicNote(
  studentId: StudentId,
  subject: string,
  topic: string,
  content: string,
  title?: string,
  noteId?: string
): StudentData {
  const data = loadStudentData(studentId);
  const today = getTodayDateString();

  if (noteId) {
    data.notes = (data.notes || []).map((n) =>
      n.id === noteId ? { ...n, content, title: title || n.title, updatedAt: today } : n
    );
  } else {
    const newNote: StudyNote = {
      id: `note_${Date.now()}`,
      subject,
      topic,
      title: title || `${topic} Notes`,
      content,
      date: today,
      createdAt: today,
    };
    data.notes = [newNote, ...(data.notes || [])];
  }

  saveStudentData(studentId, data);
  syncStudentToCloud(studentId, data);
  return data;
}

export function deleteTopicNote(studentId: StudentId, noteId: string): StudentData {
  const data = loadStudentData(studentId);
  data.notes = (data.notes || []).filter((n) => n.id !== noteId);
  saveStudentData(studentId, data);
  syncStudentToCloud(studentId, data);
  return data;
}

// Compatibility exports
export const getActiveStudentId = loadActiveStudentId;
export const setActiveStudentId = saveActiveStudentId;
export const getStudentData = loadStudentData;

export function awardDirectXp(
  studentId: StudentId,
  amount: number,
  _reason: string
): { updatedData: StudentData; newBadges: { id: string; title: string }[] } {
  const data = loadStudentData(studentId);
  data.xp += amount;
  const { updatedStreak } = updateStreakOnActivity(data.streak);
  data.streak = updatedStreak;

  const prevBadges = new Set(data.unlockedBadgeIds || []);
  const updatedBadges = evaluateBadges(data);
  const newlyUnlocked = updatedBadges
    .filter((id) => !prevBadges.has(id))
    .map((id) => {
      const def = BADGES_DEFINITION.find((b) => b.id === id);
      return { id, title: def ? def.title : id };
    });

  data.unlockedBadgeIds = updatedBadges;
  saveStudentData(studentId, data);
  syncStudentToCloud(studentId, data);
  return { updatedData: data, newBadges: newlyUnlocked };
}
