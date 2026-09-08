import styles from './ProgressBar.module.css';

/**
 * ProgressBar
 * value: 0–100 (percentage)
 * label: optional accessible label text
 */
export function ProgressBar({ value, label }) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? `تقدم التقييم ${Math.round(clamped)}%`}
    >
      <div
        className={styles.fill}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
