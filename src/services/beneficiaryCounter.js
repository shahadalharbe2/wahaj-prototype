/**
 * Wahaj Beneficiary Counter Service
 *
 * Tracks how many unique completed assessment journeys have occurred
 * in this local prototype. Uses localStorage for persistence.
 *
 * Rules enforced here:
 *  - Counter only increases when a NEW assessment session completes.
 *  - Each session gets a unique ID written to sessionStorage at start.
 *  - Once a session ID is counted, it is stored in localStorage so that
 *    even if sessionStorage is cleared it cannot be counted again.
 *  - The count never increases on page load, refresh, or navigation.
 */

// ─── Storage keys ─────────────────────────────────────────────────────────────
export const COUNT_KEY      = 'wahaj_completed_beneficiaries';
const SESSION_ID_KEY        = 'wahaj_current_assessment_id';
const COUNTED_SESSIONS_KEY  = 'wahaj_counted_sessions';   // localStorage JSON array

// ─── One-time schema migration (runs once at module load) ─────────────────────
// Bumping SCHEMA_VERSION resets any stale demo/old value to 0 on first load.
// After migration the schema key is written and this block never runs again.
const SCHEMA_VERSION = '3';
const SCHEMA_KEY     = 'wahaj_counter_schema_version';

(function migrateOnce() {
  try {
    if (localStorage.getItem(SCHEMA_KEY) !== SCHEMA_VERSION) {
      localStorage.setItem(COUNT_KEY, '0');
      localStorage.setItem(COUNTED_SESSIONS_KEY, '[]');
      localStorage.setItem(SCHEMA_KEY, SCHEMA_VERSION);
    }
  } catch {
    // localStorage unavailable (SSR / privacy mode) — no-op
  }
})();

// ─── Public API ───────────────────────────────────────────────────────────────

/** Returns the current count directly from localStorage. */
export function getBeneficiaryCount() {
  try {
    const stored = localStorage.getItem(COUNT_KEY);
    const parsed = parseInt(stored ?? '0', 10);
    return Number.isFinite(parsed) ? parsed : 0;
  } catch {
    return 0;
  }
}

/**
 * Generates a new unique assessment session ID and writes it to
 * sessionStorage. Call this when the user deliberately starts a new
 * assessment (i.e. when they first land on /assessment).
 */
export function startNewAssessmentSession() {
  try {
    const id = `wahaj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem(SESSION_ID_KEY, id);
    return id;
  } catch {
    return null;
  }
}

/** Returns the current session ID, or null if none exists. */
function getCurrentSessionId() {
  try {
    return sessionStorage.getItem(SESSION_ID_KEY);
  } catch {
    return null;
  }
}

/** Returns the array of already-counted session IDs (from localStorage). */
function getCountedSessions() {
  try {
    const raw = localStorage.getItem(COUNTED_SESSIONS_KEY);
    const parsed = JSON.parse(raw ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Returns true if the current session ID has already been counted.
 * Checks both localStorage (permanent record) so it survives even if
 * the tab is closed and reopened on /results.
 */
export function hasCurrentAssessmentBeenCounted() {
  const id = getCurrentSessionId();
  if (!id) return true; // no session ID → treat as already counted (safe default)
  return getCountedSessions().includes(id);
}

/**
 * Increments the counter by exactly 1 for the current session.
 * Idempotent — subsequent calls for the same session are no-ops.
 * Returns the new count, or the existing count if already counted.
 */
export function countCompletedAssessment() {
  if (hasCurrentAssessmentBeenCounted()) {
    return getBeneficiaryCount();
  }

  const id = getCurrentSessionId();

  // Increment
  const next = getBeneficiaryCount() + 1;
  try {
    localStorage.setItem(COUNT_KEY, String(next));

    // Record this session ID as counted
    const sessions = getCountedSessions();
    sessions.push(id);
    // Keep only the last 100 session IDs to prevent unbounded growth
    const trimmed = sessions.slice(-100);
    localStorage.setItem(COUNTED_SESSIONS_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage write failed — count still returned correctly
  }

  return next;
}
