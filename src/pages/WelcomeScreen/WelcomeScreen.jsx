import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './WelcomeScreen.module.css';
import { WahajLogo, Button, AreaPill, AssessmentCard } from '../../components';
import { getBeneficiaryCount, COUNT_KEY } from '../../services/beneficiaryCounter.js';

const AREAS = ['health', 'activity', 'mental', 'social', 'financial', 'purpose'];

export function WelcomeScreen() {
  const navigate = useNavigate();

  // Lazy initializer runs on every true mount.
  // WelcomeScreen is keyed in App.jsx so React Router remounts it on
  // every navigation to "/", meaning this initializer always reads the
  // latest localStorage value — no setState-in-effect needed.
  const [count, setCount] = useState(() => getBeneficiaryCount());

  // Cross-tab sync only (same-tab updates are handled by remounting via key)
  useEffect(() => {
    function handleStorage(e) {
      if (e.key === COUNT_KEY) {
        setCount(getBeneficiaryCount());
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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
            {/* ── Live beneficiary counter ── */}
            <div className={styles.counterBadge} aria-live="polite" aria-atomic="true">
              <span className={styles.counterNumber}>
                {count.toLocaleString('ar-SA')}
              </span>
              <span className={styles.counterLabel}>مستفيد أكمل تقييم وهج</span>
              <span className={styles.counterSub}>وينضم مستفيدون جدد مع كل رحلة مكتملة</span>
            </div>

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
        <Link
          to="/dashboard"
          className={styles.dashboardLink}
          aria-label="لوحة مؤشرات وهج — للمسؤولين وصانعي القرار"
        >
          📊 لوحة المؤشرات
        </Link>
        <Link
          to="/admin-dashboard"
          className={styles.dashboardLink}
          aria-label="لوحة الأثر والمتابعة — للمسؤولين"
        >
          📋 الأثر والمتابعة
        </Link>
      </footer>
    </main>
  );
}
