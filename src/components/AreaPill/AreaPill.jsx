import styles from './AreaPill.module.css';

const AREA_CONFIG = {
  health:    { label: 'الصحة والأمراض المزمنة', icon: '🫀', colorVar: '--color-health' },
  activity:  { label: 'النشاط والحركة',          icon: '🏃', colorVar: '--color-activity' },
  mental:    { label: 'الرفاه النفسي',            icon: '🧠', colorVar: '--color-mental' },
  social:    { label: 'الحياة الاجتماعية',        icon: '🤝', colorVar: '--color-social' },
  financial: { label: 'الاستقرار المالي',          icon: '💼', colorVar: '--color-financial' },
  purpose:   { label: 'الخبرات والهدف',            icon: '🌟', colorVar: '--color-purpose' },
};

/**
 * AreaPill – displays one of the six Wahaj life areas.
 * areaKey: keyof AREA_CONFIG
 */
export function AreaPill({ areaKey }) {
  const config = AREA_CONFIG[areaKey];
  if (!config) return null;

  return (
    <div
      className={styles.pill}
      style={{ '--pill-color': `var(${config.colorVar})` }}
      role="listitem"
    >
      <span className={styles.icon} aria-hidden="true">{config.icon}</span>
      <span className={styles.label}>{config.label}</span>
    </div>
  );
}

export { AREA_CONFIG };
