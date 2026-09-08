import { useEffect } from 'react';
import styles from './SectionTransition.module.css';

/**
 * SectionTransition
 * Shown briefly between sections (1.6 s) then auto-dismisses.
 *
 * completedSection: the section just finished
 * nextSection: the upcoming section (null if last)
 * onDone: callback when the transition ends
 */
export function SectionTransition({ completedSection, nextSection, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 1600);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <div className={styles.card}>
        {/* Completed */}
        <div className={styles.completedRow}>
          <span className={styles.checkmark} aria-hidden="true">✓</span>
          <div>
            <p className={styles.completedLabel}>اكتمل محور</p>
            <p className={styles.completedName}>{completedSection.label}</p>
          </div>
        </div>

        {/* Next */}
        {nextSection && (
          <div className={styles.nextRow}>
            <span className={styles.nextIcon} aria-hidden="true">{nextSection.icon}</span>
            <p className={styles.nextLabel}>
              ننتقل الآن إلى{' '}
              <strong>{nextSection.label}</strong>
            </p>
          </div>
        )}

        {/* Progress dots */}
        <div className={styles.progressDots} aria-hidden="true">
          <div className={styles.progressFill} />
        </div>
      </div>
    </div>
  );
}
