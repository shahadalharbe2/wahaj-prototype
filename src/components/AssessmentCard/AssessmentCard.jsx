import styles from './AssessmentCard.module.css';

/**
 * AssessmentCard – the featured Wahaj 360° card shown on the welcome screen.
 */
export function AssessmentCard() {
  return (
    <div className={styles.card} role="group" aria-label="معلومات تقييم وهج 360">
      {/* Card header */}
      <div className={styles.header}>
        <div className={styles.badge} aria-hidden="true">360°</div>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>تقييم وهج 360°</h2>
        </div>
      </div>

      {/* Stats row */}
      <div className={styles.stats} role="list">
        <div className={styles.stat} role="listitem">
          <span className={styles.statValue}>18</span>
          <span className={styles.statLabel}>سؤالًا</span>
        </div>
        <div className={styles.divider} aria-hidden="true" />
        <div className={styles.stat} role="listitem">
          <span className={styles.statValue}>5–3</span>
          <span className={styles.statLabel}>دقائق</span>
        </div>
        <div className={styles.divider} aria-hidden="true" />
        <div className={styles.stat} role="listitem">
          <span className={styles.statValue}>✦</span>
          <span className={styles.statLabel}>رحلة مصممة لك</span>
        </div>
      </div>
    </div>
  );
}
