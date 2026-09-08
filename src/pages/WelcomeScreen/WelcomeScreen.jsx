import { useNavigate } from 'react-router-dom';
import styles from './WelcomeScreen.module.css';
import { WahajLogo, Button, AreaPill, AssessmentCard } from '../../components';

const AREAS = ['health', 'activity', 'mental', 'social', 'financial', 'purpose'];

export function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <main className={styles.page}>
      {/* ===== Header / Nav ===== */}
      <header className={styles.header}>
        <WahajLogo size="md" />
      </header>

      {/* ===== Hero Section ===== */}
      <section className={styles.hero} aria-labelledby="hero-headline">
        {/* Decorative glow blob */}
        <div className={styles.glowBlob} aria-hidden="true" />

        <div className={styles.heroContent}>
          <h1 id="hero-headline" className={styles.headline}>
            بداية التقاعد ليست نهاية رحلة، بل بداية مرحلة جديدة تستحق أن تُصمَّم لك.
          </h1>

          <p className={styles.description}>
            وهج منظومة ذكية ترافقك منذ بداية إجراءات التقاعد، لفهم احتياجاتك
            والاستعداد للمرحلة القادمة، ثم تستمر معك بعد التقاعد لمتابعة رحلتك
            وتحسين جودة حياتك.
          </p>
        </div>
      </section>

      {/* ===== Life Areas Section ===== */}
      <section className={styles.areasSection} aria-labelledby="areas-title">
        <h2 id="areas-title" className={styles.sectionLabel}>
          وهج يرافقك في ستة محاور
        </h2>
        <div className={styles.areasList} role="list">
          {AREAS.map((key) => (
            <AreaPill key={key} areaKey={key} />
          ))}
        </div>
      </section>

      {/* ===== Assessment Card + CTA Section ===== */}
      <section className={styles.ctaSection} aria-labelledby="assessment-title">
        <div className={styles.ctaInner}>
          <div id="assessment-title" className={styles.srOnly}>
            تقييم وهج 360°
          </div>
          <AssessmentCard />

          <div className={styles.ctaActions}>
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/assessment')}
              aria-label="ابدأ رحلتك مع وهج – تقييم 360 درجة"
            >
              ابدأ رحلتي مع وهج
            </Button>

            <p className={styles.privacyNote} role="note">
              <span className={styles.privacyIcon} aria-hidden="true">🔒</span>
              خصوصيتك أولويتنا، ولن تتم مشاركة معلوماتك مع أي جهة دون موافقتك.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className={styles.footer}>
        <span>وهج © {new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}
