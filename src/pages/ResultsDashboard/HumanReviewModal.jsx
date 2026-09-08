import { useState } from 'react';
import styles from './HumanReviewModal.module.css';
import { Button } from '../../components';
import { DOMAIN_META } from '../../data/analysisRules';
import { PROTOTYPE_NOTICE } from '../../services/knowledgeBaseService';

const ESCALATION_LEVEL_LABEL = {
  green:  'مسار ذاتي',
  orange: 'مراجعة مختص',
  red:    'تدخل بشري مطلوب',
};

/**
 * HumanReviewModal
 *
 * Shows the AI Case Summary for a domain that triggered human review.
 * Pulls structured escalation data from the KB-backed agent output.
 * Demo only — no real contact. Actions update local UI state.
 */
export function HumanReviewModal({ agent, analysis, onClose }) {
  const [action, setAction] = useState(null);

  const generatedAt   = analysis?.generatedAt ?? new Date().toISOString();
  const escalLabel    = ESCALATION_LEVEL_LABEL[agent.escalation] ?? agent.escalation;
  const domainLabel   = DOMAIN_META[agent.domain]?.label ?? agent.domain;

  // KB escalation rule (may be null for green-level agents)
  const escRule = agent.escalationRule ?? null;

  const actionMessages = {
    approve: 'تم اعتماد المسار من قبل المختص (محاكاة تجريبية فقط).',
    modify:  'تم تعديل المسار من قبل المختص (محاكاة تجريبية فقط).',
    refer:   'تمت الإحالة لخدمة أخرى (محاكاة تجريبية فقط).',
  };

  // Sources for this escalation: prefer escRule.sources, fall back to agent.sources
  const escSources =
    (escRule?.sources && escRule.sources.length > 0)
      ? escRule.sources
      : (agent.sources ?? []);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 id="modal-title" className={styles.modalTitle}>
            ملخص الحالة للمختص
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="إغلاق">✕</button>
        </div>

        {/* Disclaimer */}
        <div className={styles.disclaimer} role="note">
          هذا الملخص مولد بواسطة نموذج وهج الأولي لدعم المختص، ولا يمثل تشخيصًا أو قرارًا مهنيًا نهائيًا.
        </div>

        {/* Summary fields */}
        <dl className={styles.summaryList}>
          <dt>سبب الإحالة:</dt>
          <dd>{agent.summary}</dd>

          <dt>المجال المرتبط:</dt>
          <dd>{domainLabel}</dd>

          <dt>المؤشرات من تقييم وهج 360°:</dt>
          <dd>
            <ul className={styles.signalList}>
              {agent.signals.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </dd>

          <dt>مستوى الأولوية:</dt>
          <dd>
            <span className={`${styles.escalationBadge} ${styles[`badge--${agent.escalation}`]}`}>
              {escalLabel}
            </span>
            {escRule?.priority && (
              <span className={styles.priorityNote}> — {escRule.priority}</span>
            )}
          </dd>

          <dt>التدخل المطلوب من المختص:</dt>
          <dd>{agent.recommendation}</dd>

          <dt>نوع المختص المقترح:</dt>
          <dd>{escRule?.humanDestination ?? agent.specialistType ?? '—'}</dd>

          {escRule?.ruleId && (
            <>
              <dt>معرّف قاعدة التصعيد:</dt>
              <dd className={styles.ruleIdField}>{escRule.ruleId}</dd>
            </>
          )}

          {escRule?.ruleBasis && (
            <>
              <dt>أساس القاعدة:</dt>
              <dd>{escRule.ruleBasis}</dd>
            </>
          )}

          {escRule?.guardrail && (
            <>
              <dt>الضمانة / الحارس:</dt>
              <dd className={styles.guardrailNote}>{escRule.guardrail}</dd>
            </>
          )}

          {/* Evidence sources for this escalation */}
          {escSources.length > 0 && (
            <>
              <dt>مصادر الدليل المرتبطة:</dt>
              <dd>
                <div className={styles.escSourceList}>
                  {escSources.map((src) => (
                    <div key={src.id} className={styles.escSourceItem}>
                      <span className={styles.escSourceOrg}>{src.organization}</span>
                      <span className={styles.escSourceTitle}>{src.title}</span>
                      {src.url && (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.escSourceLink}
                        >
                          عرض المصدر ↗
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </dd>
            </>
          )}

          <dt>حالة الاعتماد:</dt>
          <dd className={styles.validationNote}>
            {agent.validationStatus ?? PROTOTYPE_NOTICE}
          </dd>

          <dt>تاريخ التوليد:</dt>
          <dd>{new Date(generatedAt).toLocaleString('ar-SA')}</dd>
        </dl>

        {/* Demo actions */}
        {action ? (
          <div className={styles.actionResult} role="status">
            <p>{actionMessages[action]}</p>
            <Button variant="secondary" size="sm" onClick={onClose}>
              إغلاق
            </Button>
          </div>
        ) : (
          <div className={styles.actions}>
            <p className={styles.actionsLabel}>إجراءات المختص (تجريبية):</p>
            <div className={styles.actionButtons}>
              <Button variant="primary"   size="sm" onClick={() => setAction('approve')}>اعتماد المسار</Button>
              <Button variant="secondary" size="sm" onClick={() => setAction('modify')}>تعديل المسار</Button>
              <Button variant="ghost"     size="sm" onClick={() => setAction('refer')}>إحالة لخدمة أخرى</Button>
            </div>
          </div>
        )}

        {!action && (
          <div className={styles.requestFooter}>
            <Button variant="primary" size="md" fullWidth onClick={() => setAction('approve')}>
              طلب مراجعة مختص
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
