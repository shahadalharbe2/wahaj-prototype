import { useState } from 'react';
import styles from './PhysicalServicePath.module.css';
import { NearbyClubsModal } from './NearbyClubsModal';
import {
  CHECKLIST_ITEMS,
  PROGRESS_STATUS_LABELS,
  PROGRESS_TRACK,
  FUTURE_OUTCOME_LABELS,
  loadServicePathRecord,
  toggleChecklistItem,
  selectClub,
  resetRecord,
  getChecklistProgress,
} from './physicalServicePath';

/**
 * PhysicalServicePath
 * ────────────────────
 * Experimental service-path panel shown ONLY under the Physical / Mobility
 * Agent recommendation in the Results Dashboard.
 *
 * Shows:
 *  1. Service card (مسار مزايا — demo, clearly labeled as prototype)
 *  2. Nearby clubs modal (demo data)
 *  3. Interactive action checklist (persisted in localStorage)
 *  4. Progress tracker (status + step count)
 *  5. Reassessment preparation note
 *
 * SAFETY: If the Physical Agent has humanReview=true, the human-review
 * banner in AgentCard is shown FIRST (above this component). This panel
 * does NOT override or bypass safety rules.
 *
 * PROTOTYPE NOTICE: No live GOSI / Taqdeer / maps integration exists.
 */

// ─── Progress track sub-component ────────────────────────────────────────────
function ProgressTrack({ currentStatus }) {
  const currentIdx = PROGRESS_TRACK.indexOf(currentStatus);

  return (
    <div className={styles.progressTrack} role="list" aria-label="تقدمك في المسار">
      {PROGRESS_TRACK.map((status, idx) => {
        const isDone    = idx < currentIdx;
        const isActive  = idx === currentIdx;
        const isPending = idx > currentIdx;
        return (
          <div
            key={status}
            className={[
              styles.progressStep,
              isDone    ? styles['progressStep--done']    : '',
              isActive  ? styles['progressStep--active']  : '',
              isPending ? styles['progressStep--pending'] : '',
            ].filter(Boolean).join(' ')}
            role="listitem"
            aria-current={isActive ? 'step' : undefined}
          >
            <div className={styles.progressDot}>
              {isDone ? <span aria-hidden="true">✓</span> : null}
            </div>
            <span className={styles.progressLabel}>
              {PROGRESS_STATUS_LABELS[status]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Service card sub-component ───────────────────────────────────────────────
function ServiceCard({ selectedClubName, onOpenCatalog }) {
  return (
    <div className={styles.serviceCard}>
      {/* Proto badge */}
      <span className={styles.protoBadge} role="note">
        نموذج تجريبي لمسار الخدمة
      </span>

      <div className={styles.serviceHeader}>
        <div className={styles.serviceIconWrap} aria-hidden="true">
          <span className={styles.serviceIcon}>🏛</span>
        </div>
        <div className={styles.serviceInfo}>
          <p className={styles.serviceName}>مسار مزايا</p>
          <p className={styles.serviceProvider}>التأمينات الاجتماعية</p>
        </div>
      </div>

      <p className={styles.serviceDesc}>
        يمكنك الاستفادة من المزايا والخدمات المتاحة لدعم نشاطك وحركتك بعد التقاعد.
      </p>

      {selectedClubName && (
        <div className={styles.selectedClub}>
          <span className={styles.selectedClubLabel}>النادي المختار:</span>
          <span className={styles.selectedClubName}>{selectedClubName}</span>
        </div>
      )}

      <button
        className={styles.serviceBtn}
        onClick={onOpenCatalog}
        aria-label="استعرض الأندية والمراكز الرياضية القريبة منك"
      >
        اذهب إلى مسار مزايا
      </button>
    </div>
  );
}

// ─── Checklist sub-component ──────────────────────────────────────────────────
function Checklist({ record, onToggle, onOpenClubs }) {
  return (
    <div className={styles.checklistSection}>
      <h4 className={styles.subHeading}>خطة التنفيذ</h4>
      <ul className={styles.checklist} role="list">
        {CHECKLIST_ITEMS.map((item) => {
          const checked = record.completedSteps.includes(item.id);
          return (
            <li key={item.id} className={styles.checklistItem} role="listitem">
              <label className={styles.checklistLabel}>
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={checked}
                  onChange={() => onToggle(item.id)}
                  aria-label={item.label}
                />
                <span
                  className={`${styles.checkboxCustom} ${checked ? styles['checkboxCustom--checked'] : ''}`}
                  aria-hidden="true"
                >
                  {checked ? '✓' : ''}
                </span>
                <span
                  className={`${styles.checklistText} ${checked ? styles['checklistText--done'] : ''}`}
                >
                  {item.label}
                </span>
              </label>
              {/* Sub-action: browse clubs */}
              {item.hasSubAction && !checked && (
                <button
                  className={styles.subActionBtn}
                  onClick={onOpenClubs}
                  aria-label="استعرض الأندية القريبة منك"
                >
                  استعرض الأندية ←
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Reassessment note sub-component ─────────────────────────────────────────
function ReassessmentNote({ record }) {
  const { completed, total } = getChecklistProgress(record);
  const hasStarted = completed > 0;

  // Format due date if available
  let dueDateStr = null;
  if (record.reassessment.dueAt) {
    try {
      dueDateStr = new Date(record.reassessment.dueAt).toLocaleDateString('ar-SA', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch {
      dueDateStr = null;
    }
  }

  return (
    <div className={styles.reassessmentNote}>
      <div className={styles.reassessmentHeader}>
        <span className={styles.reassessmentIcon} aria-hidden="true">🔄</span>
        <h4 className={styles.subHeading} style={{ margin: 0 }}>سنراجع تقدمك لاحقًا</h4>
      </div>
      <p className={styles.reassessmentText}>
        سيستخدم وهج تقدمك في هذا المسار مع نتائج إعادة التقييم لمقارنة وضعك
        الحالي بخط الأساس وتحديد ما إذا كان المسار يحتاج إلى استمرار أو تعديل.
      </p>

      {hasStarted && dueDateStr && (
        <p className={styles.reassessmentDue}>
          📅 الموعد التقريبي لإعادة التقييم: <strong>{dueDateStr}</strong>
        </p>
      )}

      {/* Future outcome options — display-only, not yet assigned */}
      <div className={styles.outcomeGrid} aria-label="مسارات التكيّف المستقبلية">
        {Object.entries(FUTURE_OUTCOME_LABELS).map(([key, label]) => (
          <span
            key={key}
            className={`${styles.outcomeChip} ${
              record.reassessment.outcomeAssigned === key
                ? styles['outcomeChip--assigned']
                : ''
            }`}
          >
            {label}
          </span>
        ))}
      </div>
      <p className={styles.outcomeNote}>
        سيحدد وهج المسار المناسب تلقائيًا بعد مراجعة تقدمك.
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function PhysicalServicePath({ agentHasHumanReview }) {
  // Lazy-initialise from localStorage once on first render
  const [record, setRecord] = useState(() => loadServicePathRecord());
  const [showClubsModal, setShowClubsModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const { completed, total } = getChecklistProgress(record);

  function handleToggle(itemId) {
    setRecord((prev) => toggleChecklistItem(prev, itemId));
  }

  function handleSelectClub(club) {
    setRecord((prev) =>
      selectClub(prev, club.name, 'تقدير', 'التأمينات الاجتماعية')
    );
    setShowClubsModal(false);
  }

  function handleReset() {
    setRecord(resetRecord());
    setShowResetConfirm(false);
  }

  return (
    <div className={styles.pathPanel}>
      {/* ── Safety note: shown only when human review is flagged ── */}
      {agentHasHumanReview && (
        <div className={styles.safetyFirst} role="note">
          <span className={styles.safetyIcon} aria-hidden="true">🔶</span>
          <p className={styles.safetyText}>
            يرجى مراجعة المختص المقترح أعلاه قبل الشروع في أي برنامج نشاط بدني.
          </p>
        </div>
      )}

      {/* ── Section header ── */}
      <div className={styles.panelHeader}>
        <span className={styles.panelIcon} aria-hidden="true">🗺</span>
        <div>
          <h3 className={styles.panelTitle}>خطوتك التالية مع وهج</h3>
          <p className={styles.panelSubtitle}>
            وهج لا يكتفي بالتوصية — يرافقك في تنفيذها خطوة بخطوة.
          </p>
        </div>
      </div>

      {/* ── Progress summary ── */}
      <div className={styles.progressSummary}>
        <p className={styles.progressSummaryText}>
          تقدمك في المسار
          <strong className={styles.progressCount}> {completed} من {total} </strong>
          خطوات مكتملة
        </p>
        <ProgressTrack currentStatus={record.currentStatus} />
      </div>

      {/* ── Service card ── */}
      <div className={styles.subSection}>
        <h4 className={styles.subHeading}>الخدمة المقترحة لك</h4>
        <ServiceCard
          selectedClubName={record.selectedClubName}
          onOpenCatalog={() => setShowClubsModal(true)}
        />
      </div>

      {/* ── Checklist ── */}
      <Checklist
        record={record}
        onToggle={handleToggle}
        onOpenClubs={() => setShowClubsModal(true)}
      />

      {/* ── Reassessment note ── */}
      <ReassessmentNote record={record} />

      {/* ── Demo reset (for presentation) ── */}
      <div className={styles.demoActions}>
        {!showResetConfirm ? (
          <button
            className={styles.demoResetBtn}
            onClick={() => setShowResetConfirm(true)}
          >
            إعادة ضبط التقدم (للعرض التجريبي)
          </button>
        ) : (
          <div className={styles.resetConfirm}>
            <span className={styles.resetConfirmText}>هل أنت متأكد؟</span>
            <button className={styles.resetConfirmYes} onClick={handleReset}>
              نعم، أعد الضبط
            </button>
            <button
              className={styles.resetConfirmNo}
              onClick={() => setShowResetConfirm(false)}
            >
              إلغاء
            </button>
          </div>
        )}
      </div>

      {/* ── Nearby clubs modal ── */}
      {showClubsModal && (
        <NearbyClubsModal
          onSelectClub={handleSelectClub}
          onClose={() => setShowClubsModal(false)}
        />
      )}
    </div>
  );
}
