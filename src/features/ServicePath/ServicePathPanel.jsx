import { useState } from 'react';
import styles from './ServicePathPanel.module.css';
import {
  SERVICE_STATUS_LABELS,
  FUTURE_OUTCOME_LABELS,
  PROGRESS_TRACK_STATES,
  loadRecord,
  toggleStep,
  resetRecord,
  getProgress,
} from './servicePath.js';
import { PHYSICAL_DEMO_CLUBS } from './physicalDemoClubs.js';

/**
 * ServicePathPanel
 * ─────────────────
 * Generic service-path panel for ALL Wahaj agents.
 * Shown under the agent recommendation in the Results Dashboard.
 *
 * Props:
 *   config         — from servicePathConfigs.js (shape defined there)
 *   agentHasHumanReview — boolean, controls safety-first banner
 *
 * PROTOTYPE NOTICE: No live external integrations. All service info is demo.
 */

// ─── Progress track ────────────────────────────────────────────────────────────
function ProgressTrack({ currentStatus }) {
  const currentIdx = PROGRESS_TRACK_STATES.indexOf(currentStatus);
  return (
    <div className={styles.progressTrack} role="list" aria-label="تقدمك في المسار">
      {PROGRESS_TRACK_STATES.map((status, idx) => {
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
              {SERVICE_STATUS_LABELS[status]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Nearby Clubs Modal (physical agent only) ─────────────────────────────────
function NearbyClubsModal({ onSelectClub, onClose }) {
  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="clubs-modal-title"
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 id="clubs-modal-title" className={styles.modalTitle}>
            خيارات قريبة منك
          </h3>
          <button className={styles.modalClose} onClick={onClose} aria-label="إغلاق">✕</button>
        </div>
        <div className={styles.protoNotice} role="note">
          <span aria-hidden="true">⚠</span>
          <span>
            بيانات تجريبية لأغراض النموذج الأولي — لا تعكس مواقع حقيقية أو توفر الخدمة فعليًا.
          </span>
        </div>
        <ul className={styles.clubList} role="list">
          {PHYSICAL_DEMO_CLUBS.map((club) => (
            <li key={club.id} className={styles.clubItem} role="listitem">
              <div className={styles.clubInfo}>
                <p className={styles.clubName}>{club.name}</p>
                <p className={styles.clubDistance}>📍 {club.distance}</p>
                <p className={styles.clubActivity}>🏃 {club.activityType}</p>
                <div className={styles.clubTags}>
                  {club.tags.map((tag) => (
                    <span key={tag} className={styles.clubTag}>{tag}</span>
                  ))}
                </div>
              </div>
              <button className={styles.clubSelectBtn} onClick={() => onSelectClub(club)}>
                اختيار
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Service card ─────────────────────────────────────────────────────────────
function ServiceCard({ config, record, onCTAClick }) {
  return (
    <div className={`${styles.serviceCard} ${styles[`serviceCard--${config.variant}`]}`}>
      <span className={styles.protoBadge} role="note">نموذج تجريبي لمسار الخدمة</span>
      <div className={styles.serviceHeader}>
        <div className={styles.serviceIconWrap} aria-hidden="true">
          <span className={styles.serviceIcon}>
            {config.variant === 'green' ? '🏛' :
             config.variant === 'orange' ? '💼' :
             config.variant === 'teal' ? '🤝' : '🌟'}
          </span>
        </div>
        <div>
          <p className={styles.serviceName}>{config.serviceTitle}</p>
          <p className={styles.serviceProvider}>{config.serviceProvider}</p>
        </div>
      </div>
      <p className={styles.serviceDesc}>{config.serviceDesc}</p>
      {record.selectedClubName && (
        <div className={styles.selectedClub}>
          <span className={styles.selectedClubLabel}>الخيار المختار:</span>
          <span className={styles.selectedClubName}>{record.selectedClubName}</span>
        </div>
      )}
      {config.safetyNote && (
        <p className={styles.serviceSafetyNote}>{config.safetyNote}</p>
      )}
      <button className={`${styles.serviceBtn} ${styles[`serviceBtn--${config.variant}`]}`} onClick={onCTAClick}>
        {config.ctaLabel}
      </button>
    </div>
  );
}

// ─── Checklist ────────────────────────────────────────────────────────────────
function Checklist({ config, record, onToggle, onOpenClubs }) {
  return (
    <div className={styles.checklistSection}>
      <h4 className={styles.subHeading}>خطة التنفيذ</h4>
      <ul className={styles.checklist} role="list">
        {config.checklist.map((item) => {
          const checked = record.completedSteps.includes(item.id);
          return (
            <li key={item.id} className={`${styles.checklistItem} ${checked ? styles['checklistItem--done'] : ''}`} role="listitem">
              <label className={styles.checklistLabel}>
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={checked}
                  onChange={() => onToggle(item.id)}
                  aria-label={item.label}
                />
                <span className={`${styles.checkboxCustom} ${checked ? styles['checkboxCustom--checked'] : ''}`} aria-hidden="true">
                  {checked ? '✓' : ''}
                </span>
                <span className={`${styles.checklistText} ${checked ? styles['checklistText--done'] : ''}`}>
                  {item.label}
                </span>
              </label>
              {item.hasSubAction && !checked && (
                <button className={styles.subActionBtn} onClick={onOpenClubs}>
                  استعرض الخيارات ←
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Impact measurement ───────────────────────────────────────────────────────
function ImpactRow({ config, record }) {
  const { completed, total } = getProgress(record, config.checklist.length);
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const changeLabel = pct >= 100 ? 'مكتمل' : pct >= 50 ? 'قيد التنفيذ' : pct > 0 ? 'بدأ' : null;

  if (!changeLabel) return null;

  return (
    <div className={styles.impactRow}>
      <div className={styles.impactCell}>
        <span className={styles.impactCellLabel}>خط الأساس</span>
        <span className={styles.impactCellValue}>{config.impactBaseline}</span>
      </div>
      <span className={styles.impactArrow} aria-hidden="true">←</span>
      <div className={`${styles.impactCell} ${styles['impactCell--target']}`}>
        <span className={styles.impactCellLabel}>الهدف</span>
        <span className={styles.impactCellValue}>{config.impactTarget}</span>
      </div>
      <span className={`${styles.impactBadge} ${
        pct >= 100 ? styles['impactBadge--done'] :
        pct >= 50  ? styles['impactBadge--progress'] :
                     styles['impactBadge--started']
      }`}>
        {changeLabel}
      </span>
    </div>
  );
}

// ─── Follow-up metrics ────────────────────────────────────────────────────────
function FollowUpMetrics({ config }) {
  return (
    <div className={styles.followUpSection}>
      <h4 className={styles.subHeading}>مؤشرات المتابعة</h4>
      <ul className={styles.metricsList}>
        {config.followUpMetrics.map((metric, i) => (
          <li key={i} className={styles.metricsItem}>{metric}</li>
        ))}
      </ul>
    </div>
  );
}

// ─── Reassessment note ────────────────────────────────────────────────────────
function ReassessmentNote({ config, record }) {
  const { completed } = getProgress(record, config.checklist.length);
  let dueDateStr = null;
  if (record.reassessment.dueAt) {
    try {
      dueDateStr = new Date(record.reassessment.dueAt).toLocaleDateString('ar-SA', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch { /* ignore */ }
  }

  return (
    <div className={styles.reassessmentNote}>
      <div className={styles.reassessmentHeader}>
        <span aria-hidden="true">🔄</span>
        <h4 className={styles.subHeading} style={{ margin: 0 }}>
          متابعة وهج — سنراجع تقدمك لاحقًا
        </h4>
      </div>
      <p className={styles.reassessmentText}>
        سيستخدم وهج تقدمك في هذا المسار مع نتائج إعادة التقييم لمقارنة وضعك الحالي
        بخط الأساس وتحديد ما إذا كان المسار يحتاج إلى استمرار أو تعديل.
        {config.followUpDays > 0 && (
          <> <strong>سنراجع معك أثر هذا المسار بعد {config.followUpDays} يومًا.</strong></>
        )}
      </p>
      {completed > 0 && dueDateStr && (
        <p className={styles.reassessmentDue}>
          📅 الموعد التقريبي لإعادة التقييم: <strong>{dueDateStr}</strong>
        </p>
      )}
      <div className={styles.outcomeGrid}>
        {Object.entries(FUTURE_OUTCOME_LABELS).map(([key, label]) => (
          <span key={key} className={styles.outcomeChip}>{label}</span>
        ))}
      </div>
      <p className={styles.outcomeNote}>سيحدد وهج المسار المناسب تلقائيًا بعد مراجعة تقدمك.</p>
    </div>
  );
}

// ─── Cross-agent reason (Orchestrator only) ───────────────────────────────────
function CrossAgentReason({ domainsServed, crossAgentReason }) {
  if (!crossAgentReason) return null;
  return (
    <div className={styles.crossAgentReason}>
      <p className={styles.crossAgentLabel}>لماذا اختار وهج هذه الخدمة لك؟</p>
      <p className={styles.crossAgentText}>{crossAgentReason}</p>
      {domainsServed?.length > 0 && (
        <div className={styles.domainsServedRow}>
          {domainsServed.map((d) => (
            <span key={d} className={styles.domainServedChip}>{d}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export function ServicePathPanel({
  config,
  agentHasHumanReview = false,
  domainsServed,
  crossAgentReason,
}) {
  const agentId = config.agentId;
  const [record, setRecord] = useState(() => loadRecord(agentId));
  const [showClubsModal, setShowClubsModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const totalSteps = config.checklist.length;
  const { completed, total } = getProgress(record, totalSteps);

  function handleToggle(itemId) {
    setRecord((prev) => toggleStep(prev, itemId, totalSteps));
  }

  function handleSelectClub(club) {
    // Auto-check first two steps and record club name
    let r = record;
    ['p_browse_clubs', 'p_select_club'].forEach((id) => {
      if (!r.completedSteps.includes(id)) {
        r = toggleStep(r, id, totalSteps);
      }
    });
    setRecord({ ...r, selectedClubName: club.name });
    setShowClubsModal(false);
  }

  function handleCTAClick() {
    const hasSubAction = config.checklist.some((c) => c.hasSubAction);
    if (hasSubAction) {
      setShowClubsModal(true);
    }
    // For other agents, CTA is cosmetic in prototype
  }

  function handleReset() {
    setRecord(resetRecord(agentId));
    setShowResetConfirm(false);
  }

  return (
    <div className={styles.pathPanel}>
      {/* Safety-first banner */}
      {agentHasHumanReview && (
        <div className={styles.safetyFirst} role="note">
          <span aria-hidden="true">🔶</span>
          <p className={styles.safetyText}>
            يرجى مراجعة المختص المقترح أعلاه قبل الشروع في هذا المسار.
          </p>
        </div>
      )}

      {/* Cross-agent reason (Orchestrator) */}
      {crossAgentReason && (
        <CrossAgentReason
          domainsServed={domainsServed}
          crossAgentReason={crossAgentReason}
        />
      )}

      {/* Panel header */}
      <div className={styles.panelHeader}>
        <div>
          <h3 className={`${styles.panelTitle} ${styles[`panelTitle--${config.variant}`]}`}>
            {config.sectionTitle}
          </h3>
          <p className={styles.panelSubtitle}>
            وهج لا يكتفي بالتوصية — يرافقك في تنفيذها خطوة بخطوة.
          </p>
        </div>
      </div>

      {/* Progress summary */}
      <div className={styles.progressSummary}>
        <p className={styles.progressSummaryText}>
          تقدمك في المسار
          <strong className={styles.progressCount}> {completed} من {total} </strong>
          خطوات مكتملة
        </p>
        <ProgressTrack currentStatus={record.currentStatus} />
      </div>

      {/* Impact measurement (once started) */}
      <ImpactRow config={config} record={record} />

      {/* Service card */}
      <div className={styles.subSection}>
        <h4 className={styles.subHeading}>الخدمة المقترحة</h4>
        <ServiceCard config={config} record={record} onCTAClick={handleCTAClick} />
      </div>

      {/* Checklist */}
      <Checklist
        config={config}
        record={record}
        onToggle={handleToggle}
        onOpenClubs={() => setShowClubsModal(true)}
      />

      {/* Follow-up metrics */}
      <FollowUpMetrics config={config} />

      {/* Reassessment note */}
      <ReassessmentNote config={config} record={record} />

      {/* Demo reset */}
      <div className={styles.demoActions}>
        {!showResetConfirm ? (
          <button className={styles.demoResetBtn} onClick={() => setShowResetConfirm(true)}>
            إعادة ضبط التقدم (للعرض التجريبي)
          </button>
        ) : (
          <div className={styles.resetConfirm}>
            <span>هل أنت متأكد؟</span>
            <button className={styles.resetConfirmYes} onClick={handleReset}>نعم</button>
            <button className={styles.resetConfirmNo} onClick={() => setShowResetConfirm(false)}>إلغاء</button>
          </div>
        )}
      </div>

      {/* Nearby clubs modal (physical only) */}
      {showClubsModal && (
        <NearbyClubsModal
          onSelectClub={handleSelectClub}
          onClose={() => setShowClubsModal(false)}
        />
      )}
    </div>
  );
}
