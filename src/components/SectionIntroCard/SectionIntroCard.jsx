import styles from './SectionIntroCard.module.css';

/**
 * SectionIntroCard
 * Shown inline above the first question of each section.
 * sectionIndex: 0-based (displayed as 1-based to user)
 * totalSections: 6
 */
export function SectionIntroCard({ section, sectionIndex, totalSections }) {
  return (
    <div className={styles.card} aria-label={`بداية محور ${section.label}`}>
      <div className={styles.topRow}>
        <span className={styles.icon} aria-hidden="true">{section.icon}</span>
        <span className={styles.sectionCounter}>
          المحور {sectionIndex + 1} من {totalSections}
        </span>
      </div>
      <h2 className={styles.label}>{section.label}</h2>
      <p className={styles.description}>{section.description}</p>
    </div>
  );
}
