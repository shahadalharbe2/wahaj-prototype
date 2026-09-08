import styles from './DomainStepper.module.css';
import { SECTIONS } from '../../data/questions';

/**
 * DomainStepper
 * Shows 6 domain dots with labels.
 * currentSectionIndex: 0-based index of the active section.
 */
export function DomainStepper({ currentSectionIndex }) {
  return (
    <div className={styles.stepper} role="list" aria-label="تقدم المحاور">
      {SECTIONS.map((section, idx) => {
        const done    = idx < currentSectionIndex;
        const active  = idx === currentSectionIndex;
        const pending = idx > currentSectionIndex;

        return (
          <div
            key={section.id}
            className={[
              styles.step,
              done    ? styles['step--done']    : '',
              active  ? styles['step--active']  : '',
              pending ? styles['step--pending'] : '',
            ].filter(Boolean).join(' ')}
            role="listitem"
            aria-current={active ? 'step' : undefined}
            aria-label={`${section.shortLabel}${done ? ' — مكتمل' : active ? ' — الحالي' : ''}`}
          >
            <div className={styles.dot}>
              {done ? (
                <span aria-hidden="true">✓</span>
              ) : (
                <span aria-hidden="true">{section.icon}</span>
              )}
            </div>
            <span className={styles.label}>{section.shortLabel}</span>
          </div>
        );
      })}
    </div>
  );
}
