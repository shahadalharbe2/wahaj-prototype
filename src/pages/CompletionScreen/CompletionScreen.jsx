import { useNavigate } from 'react-router-dom';
import styles from './CompletionScreen.module.css';
import { WahajLogo, Button } from '../../components';
import { useAssessment } from '../../context/useAssessment';

export function CompletionScreen() {
  const navigate = useNavigate();
  const { restart } = useAssessment();

  function handleViewAnalysis() {
    navigate('/analysis');
  }

  function handleRestart() {
    restart();
    navigate('/assessment');
  }

  return (
    <main className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <WahajLogo size="sm" />
      </header>

      <section className={styles.content}>
        {/* Glow mark */}
        <div className={styles.glowWrap} aria-hidden="true">
          <div className={styles.glowOuter} />
          <div className={styles.glowRing3} />
          <div className={styles.glowRing2} />
          <div className={styles.glowRing1} />
          <span className={styles.checkmark}>✓</span>
        </div>

        {/* Completion headline */}
        <h1 className={styles.title}>اكتمل تقييم وهج 360°</h1>
        <p className={styles.subtitle}>
          شكرًا لك. أصبح لدينا الآن تصور أولي متكامل عن استعدادك للمرحلة القادمة.
        </p>

        <Button
          variant="primary"
          size="lg"
          onClick={handleViewAnalysis}
        >
          عرض تحليلي
        </Button>

        {/* Secondary actions */}
        <div className={styles.secondaryActions}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRestart}
          >
            إعادة التقييم
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
          >
            العودة للرئيسية
          </Button>
        </div>
      </section>
    </main>
  );
}
