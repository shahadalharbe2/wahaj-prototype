/**
 * physicalServicePath.js
 * ──────────────────────
 * Data model and localStorage persistence for the Physical / Mobility
 * service-path intervention prototype.
 *
 * PROTOTYPE NOTICE:
 * This is an experimental feature. No live GOSI / Taqdeer / maps integration
 * exists. All service data is demo/mock for presentation purposes.
 *
 * The data structure is intentionally designed for longitudinal follow-up:
 * baseline answers (from the 360° assessment) can be compared with
 * reassessment answers after the intervention window (e.g. ~3 months).
 */

// ─── Storage key ─────────────────────────────────────────────────────────────
const STORAGE_KEY = 'wahaj_physical_service_path';

// ─── Progress status enum ─────────────────────────────────────────────────────
export const PROGRESS_STATUS = {
  NOT_STARTED:        'NOT_STARTED',
  STARTED:            'STARTED',
  SERVICE_SELECTED:   'SERVICE_SELECTED',
  FIRST_VISIT:        'FIRST_VISIT',
  FIVE_DAY_COMMITMENT:'FIVE_DAY_COMMITMENT',
  ONGOING:            'ONGOING',
};

export const PROGRESS_STATUS_LABELS = {
  NOT_STARTED:        'لم يبدأ بعد',
  STARTED:            'بدأ المسار',
  SERVICE_SELECTED:   'اختار الخدمة',
  FIRST_VISIT:        'أكمل أول زيارة',
  FIVE_DAY_COMMITMENT:'أكمل أول 5 أيام',
  ONGOING:            'مستمر',
};

// ─── Future outcome options (prepared, not yet auto-assigned) ─────────────────
export const FUTURE_OUTCOME = {
  CONTINUE:  'CONTINUE',
  ADJUST:    'ADJUST',
  REDIRECT:  'REDIRECT',
  ESCALATE:  'ESCALATE',
};

export const FUTURE_OUTCOME_LABELS = {
  CONTINUE:  'استمرار',
  ADJUST:    'تعديل المسار',
  REDIRECT:  'إعادة توجيه',
  ESCALATE:  'إحالة لمختص',
};

// ─── Checklist definition ─────────────────────────────────────────────────────
export const CHECKLIST_ITEMS = [
  {
    id: 'browse_clubs',
    label: 'استعرض أقرب نادي أو مركز رياضي مناسب لك',
    hasSubAction: true,   // triggers NearbyClubsModal
  },
  {
    id: 'select_club',
    label: 'اختر النادي أو العرض الأنسب',
    hasSubAction: false,
  },
  {
    id: 'activate_service',
    label: 'فعّل الخدمة أو الميزة',
    hasSubAction: false,
  },
  {
    id: 'first_visit',
    label: 'سجّل أول زيارة',
    hasSubAction: false,
  },
  {
    id: 'five_days',
    label: 'التزم بالخطة خلال أول 5 أيام',
    hasSubAction: false,
  },
  {
    id: 'update_progress',
    label: 'حدّث تقدمك في وهج بعد الأسبوع الأول',
    hasSubAction: false,
  },
];

// ─── Derive progress status from completed checklist steps ───────────────────
function deriveStatus(completedIds) {
  const count = completedIds.length;
  if (count === 0) return PROGRESS_STATUS.NOT_STARTED;
  if (count < 2)   return PROGRESS_STATUS.STARTED;
  if (count < 3)   return PROGRESS_STATUS.SERVICE_SELECTED;
  if (count < 4)   return PROGRESS_STATUS.FIRST_VISIT;
  if (count < 5)   return PROGRESS_STATUS.FIVE_DAY_COMMITMENT;
  return PROGRESS_STATUS.ONGOING;
}

// ─── Build a blank intervention record ───────────────────────────────────────
function buildBlankRecord() {
  return {
    // Metadata
    recommendationId:  'physical-mobility-v1',
    agent:             'physical',
    interventionType:  'physical_activity_program',
    // Service info (filled when user selects a club)
    serviceName:       null,   // e.g. "تقدير"
    serviceProvider:   null,   // e.g. "التأمينات الاجتماعية"
    selectedClubName:  null,

    // Checklist progress
    completedSteps:    [],     // array of checklist item ids

    // Timestamps (ISO strings)
    startedAt:         null,
    lastUpdatedAt:     null,

    // Derived
    currentStatus:     PROGRESS_STATUS.NOT_STARTED,

    // Future: outcome assigned by reassessment analysis
    futureOutcome:     null,

    /**
     * Reassessment scaffold:
     * Populated when a reassessment is triggered (~3 months post-intervention).
     * Baseline answers come from the original 360° assessment payload.
     */
    reassessment: {
      scheduledAfterDays: 90,   // prototype: 90-day follow-up window
      dueAt:              null, // ISO string — set when intervention starts
      completedAt:        null,
      outcomeAssigned:    null, // one of FUTURE_OUTCOME
      notes:              null,
    },
  };
}

// ─── Load from localStorage ───────────────────────────────────────────────────
export function loadServicePathRecord() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildBlankRecord();
    const parsed = JSON.parse(raw);
    // Merge with blank in case new fields were added
    return { ...buildBlankRecord(), ...parsed };
  } catch {
    return buildBlankRecord();
  }
}

// ─── Save to localStorage ─────────────────────────────────────────────────────
function saveRecord(record) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Silently ignore storage errors in prototype
  }
}

// ─── Mutation helpers ─────────────────────────────────────────────────────────

/**
 * Toggle a checklist item (check / uncheck).
 * Returns the updated record.
 */
export function toggleChecklistItem(record, itemId) {
  const isCompleted = record.completedSteps.includes(itemId);
  const completedSteps = isCompleted
    ? record.completedSteps.filter((id) => id !== itemId)
    : [...record.completedSteps, itemId];

  const now = new Date().toISOString();
  const startedAt = record.startedAt ?? (completedSteps.length > 0 ? now : null);

  // Compute reassessment due date when first item is checked
  let dueAt = record.reassessment.dueAt;
  if (!dueAt && completedSteps.length > 0) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + record.reassessment.scheduledAfterDays);
    dueAt = dueDate.toISOString();
  }

  const updated = {
    ...record,
    completedSteps,
    startedAt,
    lastUpdatedAt: now,
    currentStatus: deriveStatus(completedSteps),
    reassessment: { ...record.reassessment, dueAt },
  };
  saveRecord(updated);
  return updated;
}

/**
 * Record a selected club/service.
 * Returns the updated record.
 */
export function selectClub(record, clubName, serviceName, serviceProvider) {
  const now = new Date().toISOString();
  // Also auto-check the first two items (browse + select) when a club is selected
  const completedSteps = Array.from(
    new Set([...record.completedSteps, 'browse_clubs', 'select_club'])
  );
  const startedAt = record.startedAt ?? now;

  let dueAt = record.reassessment.dueAt;
  if (!dueAt) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + record.reassessment.scheduledAfterDays);
    dueAt = dueDate.toISOString();
  }

  const updated = {
    ...record,
    selectedClubName: clubName,
    serviceName,
    serviceProvider,
    completedSteps,
    startedAt,
    lastUpdatedAt: now,
    currentStatus: deriveStatus(completedSteps),
    reassessment: { ...record.reassessment, dueAt },
  };
  saveRecord(updated);
  return updated;
}

/**
 * Reset the intervention record (for demo purposes).
 */
export function resetRecord() {
  const blank = buildBlankRecord();
  saveRecord(blank);
  return blank;
}

// ─── Derived helpers ──────────────────────────────────────────────────────────

/** Returns how many checklist items are done and total. */
export function getChecklistProgress(record) {
  return {
    completed: record.completedSteps.length,
    total: CHECKLIST_ITEMS.length,
  };
}

/** Ordered list of status values for the progress track */
export const PROGRESS_TRACK = [
  PROGRESS_STATUS.NOT_STARTED,
  PROGRESS_STATUS.STARTED,
  PROGRESS_STATUS.SERVICE_SELECTED,
  PROGRESS_STATUS.FIRST_VISIT,
  PROGRESS_STATUS.FIVE_DAY_COMMITMENT,
  PROGRESS_STATUS.ONGOING,
];
