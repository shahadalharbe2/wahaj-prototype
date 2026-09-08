import styles from './WahajLogo.module.css';

/**
 * WahajLogo – brand mark + wordmark.
 * size: 'sm' | 'md' | 'lg'  (default: 'md')
 */
export function WahajLogo({ size = 'md' }) {
  return (
    <div className={`${styles.logo} ${styles[`logo--${size}`]}`} aria-label="وهج">
      <div className={styles.mark} aria-hidden="true">
        {/* Concentric glowing rings */}
        <span className={styles.ring3} />
        <span className={styles.ring2} />
        <span className={styles.ring1} />
        <span className={styles.core} />
      </div>
      <span className={styles.wordmark}>وهج</span>
    </div>
  );
}
