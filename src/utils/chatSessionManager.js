/**
 * chatSessionManager.js
 * Manages multiple AI chat sessions stored in sessionStorage.
 * Each session auto-expires after 48 hours.
 */

const STORAGE_KEY = 'asmit_chat_sessions';
const ACTIVE_SESSION_KEY = 'asmit_chat_active_session';
const SESSION_TTL_MS = 48 * 60 * 60 * 1000; // 48 hours in milliseconds

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function generateSessionName(index) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `Chat ${index} · ${timeStr}`;
}

function isExpired(session) {
  return Date.now() - session.createdAt > SESSION_TTL_MS;
}

// ─── Storage I/O ─────────────────────────────────────────────────────────────

function readAllSessions() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAllSessions(sessions) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.warn('[ChatSession] Failed to persist sessions:', e);
  }
}

// ─── Expiry Sweep ─────────────────────────────────────────────────────────────

/**
 * Remove all sessions older than SESSION_TTL_MS.
 * Returns the pruned sessions map.
 */
export function sweepExpiredSessions() {
  const sessions = readAllSessions();
  let changed = false;
  for (const id of Object.keys(sessions)) {
    if (isExpired(sessions[id])) {
      delete sessions[id];
      changed = true;
    }
  }
  if (changed) writeAllSessions(sessions);
  return sessions;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Load all valid (non-expired) sessions from storage.
 * Returns an array sorted newest-first.
 */
export function loadSessions() {
  const sessions = sweepExpiredSessions();
  return Object.values(sessions).sort((a, b) => b.updatedAt - a.updatedAt);
}

/**
 * Create a brand-new session and persist it.
 * Returns the new session object.
 */
export function createSession(existingCount = 0) {
  const sessions = sweepExpiredSessions();
  const id = generateSessionId();
  const now = Date.now();
  const session = {
    id,
    name: generateSessionName(existingCount + 1),
    messages: [
      {
        type: 'ai',
        content:
          "Hey! I'm Asmit's AI assistant. Ask me anything about his projects, skills, experience, or how to get in touch.",
        timestamp: now,
        isTyping: false,
      },
    ],
    backendSessionId: null, // server-side session token
    createdAt: now,
    updatedAt: now,
  };
  sessions[id] = session;
  writeAllSessions(sessions);
  return session;
}

/**
 * Persist updated messages & optional backendSessionId for a session.
 */
export function saveSession(id, messages, backendSessionId = null) {
  const sessions = sweepExpiredSessions();
  if (!sessions[id]) return;
  sessions[id].messages = messages.map((m) => ({
    ...m,
    // Convert Date objects to timestamps for safe JSON round-trip
    timestamp: m.timestamp instanceof Date ? m.timestamp.getTime() : m.timestamp,
    isTyping: false, // never persist mid-animation state
  }));
  sessions[id].updatedAt = Date.now();
  if (backendSessionId !== null) {
    sessions[id].backendSessionId = backendSessionId;
  }
  writeAllSessions(sessions);
}

/**
 * Rename a session.
 */
export function renameSession(id, newName) {
  const sessions = sweepExpiredSessions();
  if (!sessions[id]) return;
  sessions[id].name = newName.trim() || sessions[id].name;
  sessions[id].updatedAt = Date.now();
  writeAllSessions(sessions);
}

/**
 * Delete a session by id. Returns remaining sessions array.
 */
export function deleteSession(id) {
  const sessions = sweepExpiredSessions();
  delete sessions[id];
  writeAllSessions(sessions);
  return Object.values(sessions).sort((a, b) => b.updatedAt - a.updatedAt);
}

/**
 * Persist the active session id.
 */
export function setActiveSessionId(id) {
  try {
    sessionStorage.setItem(ACTIVE_SESSION_KEY, id);
  } catch {}
}

/**
 * Retrieve the last active session id.
 */
export function getActiveSessionId() {
  try {
    return sessionStorage.getItem(ACTIVE_SESSION_KEY);
  } catch {
    return null;
  }
}

/**
 * Helper: rehydrate timestamps from numbers back to Date objects.
 */
export function rehydrateMessages(messages) {
  return messages.map((m) => ({
    ...m,
    timestamp: m.timestamp instanceof Date ? m.timestamp : new Date(m.timestamp),
  }));
}

/**
 * Returns time remaining before a session expires (human-readable).
 */
export function getTimeRemaining(session) {
  const remaining = SESSION_TTL_MS - (Date.now() - session.createdAt);
  if (remaining <= 0) return 'Expired';
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}
