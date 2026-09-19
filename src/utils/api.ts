import { WebsiteConfig, AITutorConfig, SubjectItem, TopicItem, TopicStudyMaterial, StudentData } from '../types';

export const ADMIN_TOKEN_KEY = 'dmlt_admin_session_token';

export function getAdminToken(): string | null {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string | null): void {
  try {
    if (token) {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  } catch (err) {
    console.error('Failed to set admin token in session storage', err);
  }
}

// -------------------------------------------------------------
// Website Config API
// -------------------------------------------------------------
export async function fetchWebsiteConfig(): Promise<WebsiteConfig | null> {
  try {
    const res = await fetch('/api/config');
    if (!res.ok) return null;
    const data = await res.json();
    return data.config || null;
  } catch (err) {
    console.error('Failed to fetch website config:', err);
    return null;
  }
}

export async function saveWebsiteConfig(token: string, config: Partial<WebsiteConfig>): Promise<WebsiteConfig | null> {
  try {
    const res = await fetch('/api/admin/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(config),
    });
    if (!res.ok) throw new Error('Save failed');
    const data = await res.json();
    return data.config;
  } catch (err) {
    console.error('Failed to save website config:', err);
    throw err;
  }
}

// -------------------------------------------------------------
// Subjects API
// -------------------------------------------------------------
export async function fetchSubjects(): Promise<SubjectItem[]> {
  try {
    const res = await fetch('/api/subjects');
    if (!res.ok) throw new Error('Failed to load subjects');
    const data = await res.json();
    return data.subjects || [];
  } catch (err) {
    console.error('fetchSubjects error:', err);
    return [];
  }
}

export async function saveSubjects(token: string, subjects: SubjectItem[]): Promise<SubjectItem[]> {
  try {
    const res = await fetch('/api/admin/subjects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ subjects }),
    });
    if (!res.ok) throw new Error('Failed to save subjects');
    const data = await res.json();
    return data.subjects;
  } catch (err) {
    console.error('saveSubjects error:', err);
    throw err;
  }
}

export async function saveSingleSubject(token: string, subject: Partial<SubjectItem>): Promise<SubjectItem[]> {
  try {
    const res = await fetch('/api/admin/subjects/save-one', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ subject }),
    });
    if (!res.ok) throw new Error('Failed to save subject');
    const data = await res.json();
    return data.subjects;
  } catch (err) {
    console.error('saveSingleSubject error:', err);
    throw err;
  }
}

export async function deleteSubject(token: string, subjectId: string): Promise<SubjectItem[]> {
  try {
    const res = await fetch(`/api/admin/subjects/${encodeURIComponent(subjectId)}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to delete subject');
    const data = await res.json();
    return data.subjects;
  } catch (err) {
    console.error('deleteSubject error:', err);
    throw err;
  }
}

export async function saveTopic(token: string, subjectId: string, topic: Partial<TopicItem>): Promise<SubjectItem[]> {
  try {
    const res = await fetch(`/api/admin/subjects/${encodeURIComponent(subjectId)}/topics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ topic }),
    });
    if (!res.ok) throw new Error('Failed to save topic');
    const data = await res.json();
    return data.subjects;
  } catch (err) {
    console.error('saveTopic error:', err);
    throw err;
  }
}

export async function deleteTopic(token: string, subjectId: string, topicId: string): Promise<SubjectItem[]> {
  try {
    const res = await fetch(
      `/api/admin/subjects/${encodeURIComponent(subjectId)}/topics/${encodeURIComponent(topicId)}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) throw new Error('Failed to delete topic');
    const data = await res.json();
    return data.subjects;
  } catch (err) {
    console.error('deleteTopic error:', err);
    throw err;
  }
}

// -------------------------------------------------------------
// Study Content API
// -------------------------------------------------------------
export async function fetchStudyContent(): Promise<Record<string, TopicStudyMaterial>> {
  try {
    const res = await fetch('/api/study-content');
    if (!res.ok) return {};
    const data = await res.json();
    return data.content || {};
  } catch (err) {
    console.error('fetchStudyContent error:', err);
    return {};
  }
}

export async function saveTopicStudyContent(
  token: string,
  topicId: string,
  content: Partial<TopicStudyMaterial>
): Promise<TopicStudyMaterial> {
  try {
    const res = await fetch(`/api/admin/study-content/${encodeURIComponent(topicId)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error('Failed to save study content');
    const data = await res.json();
    return data.topicContent;
  } catch (err) {
    console.error('saveTopicStudyContent error:', err);
    throw err;
  }
}

// -------------------------------------------------------------
// AI Config API
// -------------------------------------------------------------
export async function fetchAIConfig(): Promise<AITutorConfig | null> {
  try {
    const res = await fetch('/api/ai/config');
    if (!res.ok) return null;
    const data = await res.json();
    return data.aiConfig || null;
  } catch (err) {
    console.error('fetchAIConfig error:', err);
    return null;
  }
}

export async function saveAIConfig(token: string, aiConfig: Partial<AITutorConfig>): Promise<AITutorConfig> {
  try {
    const res = await fetch('/api/admin/ai/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(aiConfig),
    });
    if (!res.ok) throw new Error('Failed to save AI config');
    const data = await res.json();
    return data.aiConfig;
  } catch (err) {
    console.error('saveAIConfig error:', err);
    throw err;
  }
}

// -------------------------------------------------------------
// Admin Authentication & Students API
// -------------------------------------------------------------
export async function adminLoginApi(adminId: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminId, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Login failed' };
    }
    if (data.token) {
      setAdminToken(data.token);
    }
    return { success: true, token: data.token };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

export async function verifyAdminTokenApi(token: string): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/verify', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.valid;
  } catch {
    return false;
  }
}

export async function adminLogoutApi(token: string): Promise<void> {
  try {
    await fetch('/api/admin/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // silent
  } finally {
    setAdminToken(null);
  }
}

export async function fetchAdminStudents(token: string): Promise<Record<string, StudentData>> {
  try {
    const res = await fetch('/api/admin/students', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load students');
    const data = await res.json();
    return data.students || {};
  } catch (err) {
    console.error('fetchAdminStudents error:', err);
    throw err;
  }
}

export async function adminResetStudentApi(token: string, studentId: string): Promise<StudentData> {
  try {
    const res = await fetch(`/api/admin/students/${encodeURIComponent(studentId)}/reset`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to reset student');
    const data = await res.json();
    return data.student;
  } catch (err) {
    console.error('adminResetStudentApi error:', err);
    throw err;
  }
}
