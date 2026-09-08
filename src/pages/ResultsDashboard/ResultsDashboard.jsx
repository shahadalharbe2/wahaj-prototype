import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ResultsDashboard.module.css';
import { WahajLogo, Button } from '../../components';
import { AgentCard } from './AgentCard';
import { HumanReviewModal } from './HumanReviewModal';
import { DOMAIN_META } from '../../data/analysisRules';

// ── helpers ──────────────────────────────────────────────────────────────────
function loadAnalysis() {
  try {
    const stored = sessionStorage.getItem('wahaj_analysis');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

const DOMAIN_LABELS_SHORT = {
  health:        'الصحة',
  physical:      'الحركة',
  psychological: 'النفسي',
  social:        'الاجتماعي',
  financial:     'المالي',
  experience:    'الخبرات',
  overall:       'الأولويات',
};

export function ResultsDashboard() {
  const navigate = useNavigate();
  // Lazy initializer reads sessionStorage once on first render — no effect needed
  const [analysis] = useState(() => loadAnalysis());
  const [reviewAgent, setReviewAgent] = useState(null); // agent for human-review modal

  if (!analysis) {
    return (
      <main className={styles.page}>
        <header className={styles.header}>
          <WahajLogo size="sm" />
        </header>
        <section className={styles.emptyState}>
          <p className={styles.emptyText}>
            لم يتم العثور على نتائج تقييم. يرجى إكمال تقييم وهج 360° أولًا.
          </p>
          <Button variant="primary" size="md" onClick={() => navigate('/assessment')}>
            ابدأ تقييم وهج 360°
          </Button>
        </section>
      </main>
    );
  }

  const { overall, agents, crossInsights, priorities, escalations } = analysis;

  // Determine top-level escalation for banner
  const hasHumanReview = escalations.length > 0;

  return (
    <main className={styles.page}>
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <WahajLogo size="sm" />
        <div className={styles.headerActions}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            الرئيسية
          </Button>
        </div>
      </header>

      <div className={styles.inner}>
        {/* ── Page title ──────────────────────────────────────────────────── */}
        <section className={styles.titleSection}>
          <div className={styles.glowBlob} aria-hidden="true" />
          <h1 className={styles.pageTitle}>صورتك المتكاملة مع وهج</h1>
          <p className={styles.pageSubtitle}>
            حلّل وهج إجاباتك عبر ستة مجالات مترابطة لتحديد الأولويات والفرص المناسبة
            لمرحلة التقاعد.
          </p>
        </section>

        {/* ── SECTION A: Overall Summary ────────────────────────────────── */}
        <section className={styles.section} aria-labelledby="summary-heading">
          <h2 id="summary-heading" className={styles.sectionHeading}>
            الملخص العام
          </h2>
          <div className={styles.summaryCard}>
            <p className={styles.summaryText}>{overall.summary}</p>
            {overall.topDomain && (
              <p className={styles.summaryTopDomain}>{overall.topDomain}</p>
            )}
            <div className={styles.summaryStats}>
              {overall.highCount > 0 && (
                <span className={`${styles.statChip} ${styles['statChip--red']}`}>
                  {overall.highCount} أولوية مرتفعة
                </span>
              )}
              {overall.moderateCount > 0 && (
                <span className={`${styles.statChip} ${styles['statChip--orange']}`}>
                  {overall.moderateCount} يحتاج اهتمام
                </span>
              )}
              {overall.opportunityCount > 0 && (
                <span className={`${styles.statChip} ${styles['statChip--blue']}`}>
                  {overall.opportunityCount} فرصة
                </span>
              )}
            </div>
          </div>
        </section>

        {/* ── SECTION B: Six Agent Cards ────────────────────────────────── */}
        <section className={styles.section} aria-labelledby="agents-heading">
          <h2 id="agents-heading" className={styles.sectionHeading}>
            تحليل المجالات الستة
          </h2>
          <div className={styles.agentGrid}>
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onHumanReview={(a) => setReviewAgent(a)}
              />
            ))}
          </div>
        </section>

        {/* ── SECTION C: Cross-agent insights ─────────────────────────── */}
        {crossInsights.length > 0 && (
          <section className={styles.section} aria-labelledby="cross-heading">
            <h2 id="cross-heading" className={styles.sectionHeading}>
              ما الذي ربطه وهج؟
            </h2>
            <p className={styles.sectionDesc}>
              لاحظ منسق وهج الذكي هذه الروابط بين مجالات تقييمك.
            </p>
            <div className={styles.insightList}>
              {crossInsights.map((insight) => (
                <div key={insight.id} className={styles.insightCard}>
                  <div className={styles.insightDomains}>
                    {insight.domains.map((d) => (
                      <span key={d} className={styles.domainTag}>
                        {DOMAIN_META[d]?.icon ?? ''} {DOMAIN_LABELS_SHORT[d] ?? d}
                      </span>
                    ))}
                  </div>
                  <p className={styles.insightText}>{insight.conclusion}</p>
                  <p className={styles.insightIntervention}>
                    <strong>التدخل المقترح:</strong> {insight.intervention}
                  </p>
                  <p className={styles.insightSource}>{insight.evidenceSource}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── SECTION D: Priorities ─────────────────────────────────────── */}
        {priorities.length > 0 && (
          <section className={styles.section} aria-labelledby="priorities-heading">
            <h2 id="priorities-heading" className={styles.sectionHeading}>
              أولوياتك مع وهج
            </h2>
            <div className={styles.priorityList}>
              {priorities.map((p, idx) => (
                <PriorityCard key={p.id} priority={p} rank={idx + 1} />
              ))}
            </div>
          </section>
        )}

        {/* ── SECTION E: Human escalation banner ───────────────────────── */}
        {hasHumanReview && (
          <section className={styles.section} aria-labelledby="escalation-heading">
            <h2 id="escalation-heading" className={styles.sectionHeading}>
              مراجعة مختص مقترحة
            </h2>
            <div className={styles.escalationBanner}>
              <p className={styles.escalationText}>
                بناءً على إجاباتك، يقترح وهج مراجعة متخصصين في المجالات التالية للحصول على أفضل دعم:
              </p>
              <div className={styles.escalationItems}>
                {escalations.map((e) => (
                  <div key={e.domain} className={styles.escalationItem}>
                    <span className={styles.escalationDomain}>{e.title}</span>
                    {e.specialistType && (
                      <span className={styles.escalationSpecialist}>
                        {e.specialistType}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Footer prototype note ─────────────────────────────────────── */}
        <div className={styles.protoNote} role="note">
          <p>
            <strong>ملاحظة:</strong> نتائج وهج في هذه المرحلة مبنية على قواعد تجريبية
            للعرض وتتطلب اعتماد مختصين قبل النشر الإنتاجي. لا تُعدّ تشخيصًا طبيًا
            أو نفسيًا أو استشارة مالية.
          </p>
        </div>

        {/* ── Actions ──────────────────────────────────────────────────── */}
        <div className={styles.actions}>
          <Button variant="secondary" size="md" onClick={() => navigate('/assessment')}>
            إعادة التقييم
          </Button>
          <Button variant="ghost" size="md" onClick={() => navigate('/')}>
            الرئيسية
          </Button>
        </div>
      </div>

      {/* ── Human Review Modal ────────────────────────────────────────────── */}
      {reviewAgent && (
        <HumanReviewModal
          agent={reviewAgent}
          analysis={analysis}
          onClose={() => setReviewAgent(null)}
        />
      )}
    </main>
  );
}

// ── Priority Card sub-component ──────────────────────────────────────────────
function PriorityCard({ priority, rank }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.priorityCard}>
      <div className={styles.priorityHeader}>
        <span className={styles.priorityRank}>{rank}</span>
        <div className={styles.priorityMeta}>
          <h3 className={styles.priorityTitle}>{priority.title}</h3>
          <div className={styles.priorityDomains}>
            {priority.domains.map((d) => (
              <span key={d} className={styles.domainTag}>
                {DOMAIN_META[d]?.icon ?? ''} {DOMAIN_LABELS_SHORT[d] ?? d}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className={styles.priorityAction}>{priority.action}</p>

      <button
        className={styles.whyBtn}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {expanded ? '▲' : '▼'} لماذا أوصى وهج بهذا؟
      </button>

      {expanded && (
        <div className={styles.whyPanel}>
          <dl className={styles.whyList}>
            <dt>السبب:</dt>
            <dd>{priority.why}</dd>
            <dt>المجالات المرتبطة:</dt>
            <dd>{priority.domains.map((d) => DOMAIN_META[d]?.label ?? d).join(' + ')}</dd>
            <dt>فئة المصدر:</dt>
            <dd>{priority.evidenceSource}</dd>
            {priority.additionalContext && (
              <>
                <dt>ملاحظتك:</dt>
                <dd>{priority.additionalContext}</dd>
              </>
            )}
            <dt>حالة الاعتماد:</dt>
            <dd className={styles.validationNote}>
              قاعدة تجريبية للعرض — تتطلب اعتماد مختص
            </dd>
          </dl>
        </div>
      )}
    </div>
  );
}
