/**
 * servicePath.js
 * ──────────────
 * Generic data model and localStorage persistence for ALL Wahaj agent
 * service-path intervention prototypes.
 *
 * PROTOTYPE NOTICE:
 * No live external service integrations exist. All service data is
 * demo/mock for presentation purposes.
 *
 * Designed for longitudinal follow-up: baseline answers (from the
 * 360° assessment) can be compared with reassessment answers after
 * the intervention window (~30 or 90 days depending on agent).
 */

// ─── Per-agent storage keys ───────────────────────────────────────────────────
const STORAGE_KEYS = {
  health:        'wahaj_sp_health',
  physical:      'wahaj_sp_physical',
  psychological: 'wahaj_sp_psychological',
  social:        'wahaj_sp_social',
  financial:     'wahaj_sp_financial',
  experience:    'wahaj_sp_experience',
};

// ─── Generic progress status ──────────────────────────────────────────────────
export const SERVICE_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  STARTED:     'STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED:   'COMPLETED',
  NEEDS_ADJUST:'NEEDS_ADJUST',
  ESCALATED:   'ESCALATED',
};

export const SERVICE_STATUS_LABELS = {
  NOT_STARTED:  'لم يبدأ',
  STARTED:      'بدأ',
  IN_PROGRESS:  'قيد التنفيذ',
  COMPLETED:    'مكتمل',
  NEEDS_ADJUST: 'يحتاج تعديل',
  ESCALATED:    'تم التصعيد لمختص',
};

// ─── Future outcome options ───────────────────────────────────────────────────
export const FUTURE_OUTCOME_LABELS = {
  CONTINUE:  'استمرار',
  ADJUST:    'تعديل المسار',
  REDIRECT:  'إعادة توجيه',
  ESCALATE:  'إحالة لمختص',
};

// ─── Progress track (ordered states shown in UI) ──────────────────────────────
export const PROGRESS_TRACK_STATES = [
  SERVICE_STATUS.NOT_STARTED,
  SERVICE_STATUS.STARTED,
  SERVICE_STATUS.IN_PROGRESS,
  SERVICE_STATUS.COMPLETED,
];

/** Derive status from completed step count vs total */
function deriveStatus(completedCount, totalCount) {
  if (completedCount === 0)                  return SERVICE_STATUS.NOT_STARTED;
  if (completedCount < Math.ceil(totalCount * 0.4)) return SERVICE_STATUS.STARTED;
  if (completedCount < totalCount)           return SERVICE_STATUS.IN_PROGRESS;
  return SERVICE_STATUS.COMPLETED;
}

// ─── Build blank record ───────────────────────────────────────────────────────
function buildBlankRecord(agentId) {
  return {
    agentId,
    serviceId:       `${agentId}-service-v1`,
    serviceName:     null,
    serviceProvider: null,
    completedSteps:  [],
    startedAt:       null,
    lastUpdatedAt:   null,
    currentStatus:   SERVICE_STATUS.NOT_STARTED,
    futureOutcome:   null,
    // Impact measurement: baseline vs follow-up
    impact: {
      baselineNote:  null,   // set at first interaction from config
      followUpNote:  null,   // filled after reassessment
      changeLabel:   null,   // 'تحسن' | 'مستقر' | 'يحتاج تعديل'
    },
    reassessment: {
      scheduledAfterDays: 30,
      dueAt:              null,
      completedAt:        null,
      outcomeAssigned:    null,
      notes:              null,
    },
  };
}

// ─── Load ─────────────────────────────────────────────────────────────────────
export function loadRecord(agentId) {
  const key = STORAGE_KEYS[agentId];
  if (!key) return buildBlankRecord(agentId);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return buildBlankRecord(agentId);
    return { ...buildBlankRecord(agentId), ...JSON.parse(raw) };
  } catch {
    return buildBlankRecord(agentId);
  }
}

// ─── Save ─────────────────────────────────────────────────────────────────────
function save(agentId, record) {
  const key = STORAGE_KEYS[agentId];
  if (!key) return;
  try { localStorage.setItem(key, JSON.stringify(record)); } catch { /* silent */ }
}

// ─── Toggle checklist item ────────────────────────────────────────────────────
export function toggleStep(record, itemId, totalCount) {
  const has = record.completedSteps.includes(itemId);
  const completedSteps = has
    ? record.completedSteps.filter((id) => id !== itemId)
    : [...record.completedSteps, itemId];

  const now = new Date().toISOString();
  const startedAt = record.startedAt ?? (completedSteps.length > 0 ? now : null);

  let dueAt = record.reassessment.dueAt;
  if (!dueAt && completedSteps.length > 0) {
    const d = new Date();
    d.setDate(d.getDate() + record.reassessment.scheduledAfterDays);
    dueAt = d.toISOString();
  }

  const updated = {
    ...record,
    completedSteps,
    startedAt,
    lastUpdatedAt: now,
    currentStatus: deriveStatus(completedSteps.length, totalCount),
    reassessment: { ...record.reassessment, dueAt },
  };
  save(record.agentId, updated);
  return updated;
}

/** Reset record for demo purposes */
export function resetRecord(agentId) {
  const blank = buildBlankRecord(agentId);
  save(agentId, blank);
  return blank;
}

/** Compute { completed, total } */
export function getProgress(record, totalCount) {
  return { completed: record.completedSteps.length, total: totalCount };
}
