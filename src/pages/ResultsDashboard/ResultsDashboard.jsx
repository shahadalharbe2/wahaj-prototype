import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ResultsDashboard.module.css';
import { WahajLogo, Button } from '../../components';
import { AgentCard } from './AgentCard';
import { HumanReviewModal } from './HumanReviewModal';
import { DOMAIN_META } from '../../data/analysisRules';
import {
  HEALTH_SERVICE_CONFIG,
  PHYSICAL_SERVICE_CONFIG,
  PSYCHOLOGICAL_SERVICE_CONFIG,
  SOCIAL_SERVICE_CONFIG,
  FINANCIAL_SERVICE_CONFIG,
  getExperienceServiceConfig,
  getOrchestratorServiceConfig,
} from '../../features/ServicePath/servicePathConfigs.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

function buildServicePathConfigs(rawAnswers) {
  const raw = rawAnswers ?? {};
  return {
    health:        HEALTH_SERVICE_CONFIG,
    physical:      PHYSICAL_SERVICE_CONFIG,
    psychological: PSYCHOLOGICAL_SERVICE_CONFIG,
    social:        SOCIAL_SERVICE_CONFIG,
    financial:     FINANCIAL_SERVICE_CONFIG,
    experience:    getExperienceServiceConfig(raw[16], raw[17] ?? []),
  };
}

/** Sort agents: high-risk first, then risk, then opportunity, then stable */
function agentSortScore(agent) {
  if (agent.type === 'risk' && agent.level === 'high')   return 0;
  if (agent.type === 'risk' && agent.level === 'moderate') return 1;
  if (agent.type === 'risk')                               return 2;
  if (agent.type === 'opportunity')                        return 3;
  return 4;
}

// ─── ResultsDashboard ─────────────────────────────────────────────────────────
export function ResultsDashboard() {
  const navigate = useNavigate();
  const [analysis]    = useState(() => loadAnalysis());
  const [reviewAgent, setReviewAgent] = useState(null);
  const [showAll,     setShowAll]     = useState(false);

  // ── Empty state ──────────────────────────────────────────────────────────
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

  const { overall, agents, crossInsights, priorities, escalations, rawAnswers } = analysis;
  const hasHumanReview = escalations.length > 0;
  const servicePathConfigs = buildServicePathConfigs(rawAnswers);
  const orchestratorService = getOrchestratorServiceConfig(agents, rawAnswers ?? {});

  // Sort agents by priority; split top 3 vs rest
  const sorted    = [...agents].sort((a, b) => agentSortScore(a) - agentSortScore(b));
  const topAgents = sorted.slice(0, 3);
  const restAgents = sorted.slice(3);

  return (
    <main className={styles.page}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <WahajLogo size="sm" />
        <div className={styles.headerActions}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            الرئيسية
          </Button>
        </div>
      </header>

      <div className={styles.inner}>

        {/* ══ 1. Page title ══════════════════════════════════════════════ */}
        <section className={styles.titleSection}>
          <div className={styles.glowBlob} aria-hidden="true" />
          <h1 className={styles.pageTitle}>نتيجة تقييم وهج 360°</h1>
          <p className={styles.pageSubtitle}>
            حلّل وهج إجاباتك عبر ستة مجالات لتحديد أبرز أولوياتك والفرص المناسبة
            لمرحلة التقاعد.
          </p>
        </section>

        {/* ══ 2. ملخص وهج ════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="summary-heading">
          <h2 id="summary-heading" className={styles.sectionHeading}>ملخص وهج</h2>
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

        {/* ══ 3. أهم أولوياتك ════════════════════════════════════════════ */}
        {priorities.length > 0 && (
          <section className={styles.section} aria-labelledby="priorities-heading">
            <h2 id="priorities-heading" className={styles.sectionHeading}>
              أهم أولوياتك
            </h2>
            <div className={styles.priorityList}>
              {priorities.map((p, idx) => (
                <PriorityCard key={p.id} priority={p} rank={idx + 1} />
              ))}
            </div>
          </section>
        )}

        {/* ══ 4. Top agent cards (sorted by priority) ════════════════════ */}
        <section className={styles.section} aria-labelledby="agents-heading">
          <h2 id="agents-heading" className={styles.sectionHeading}>
            توصيات وهج المقترحة
          </h2>
          <p className={styles.sectionDesc}>
            اختر مسارًا للبدء — كل بطاقة تحتوي على خدمة مصمّمة خصيصًا لك.
          </p>
          <div className={styles.agentGrid}>
            {topAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onHumanReview={(a) => setReviewAgent(a)}
                servicePathConfig={servicePathConfigs[agent.id] ?? null}
                isTopPriority
              />
            ))}
          </div>

          {/* Collapsible secondary agents */}
          {restAgents.length > 0 && (
            <div className={styles.secondarySection}>
              <button
                className={styles.showAllBtn}
                onClick={() => setShowAll((v) => !v)}
                aria-expanded={showAll}
              >
                {showAll ? '▲ إخفاء بقية النتائج' : `▼ عرض بقية نتائج وهج (${restAgents.length})`}
              </button>

              {showAll && (
                <div className={`${styles.agentGrid} ${styles.agentGridSecondary}`}>
                  {restAgents.map((agent) => (
                    <AgentCard
                      key={agent.id}
                      agent={agent}
                      onHumanReview={(a) => setReviewAgent(a)}
                      servicePathConfig={servicePathConfigs[agent.id] ?? null}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* ══ 5. أبرز خدمة — Orchestrator highlight ══════════════════════ */}
        <section className={styles.section} aria-labelledby="orch-heading">
          <h2 id="orch-heading" className={styles.sectionHeading}>
            أبرز خدمة يوصي بها وهج لك
          </h2>
          <p className={styles.sectionDesc}>
            بعد تحليل جميع المجالات الستة، اختار منسق وهج الخدمة التي تخدم أكثر من جانب في تقييمك.
          </p>
          <OrchestratorCard service={orchestratorService} onNavigate={navigate} />
        </section>

        {/* ══ 6. Cross-agent insights (collapsed by default) ══════════════ */}
        {crossInsights.length > 0 && (
          <CrossInsightsSection insights={crossInsights} />
        )}

        {/* ══ 7. Human escalation banner ══════════════════════════════════ */}
        {hasHumanReview && (
          <section className={styles.section} aria-labelledby="escalation-heading">
            <h2 id="escalation-heading" className={styles.sectionHeading}>
              مراجعة مختص مقترحة
            </h2>
            <div className={styles.escalationBanner}>
              <p className={styles.escalationText}>
                بناءً على إجاباتك، يقترح وهج مراجعة متخصصين في المجالات التالية:
              </p>
              <div className={styles.escalationItems}>
                {escalations.map((e) => (
                  <div key={e.domain} className={styles.escalationItem}>
                    <span className={styles.escalationDomain}>{e.title}</span>
                    {e.specialistType && (
                      <span className={styles.escalationSpecialist}>{e.specialistType}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══ 8. Prototype note ═══════════════════════════════════════════ */}
        <div className={styles.protoNote} role="note">
          <p>
            <strong>ملاحظة:</strong> نتائج وهج في هذه المرحلة مبنية على قواعد تجريبية
            للعرض وتتطلب اعتماد مختصين قبل النشر الإنتاجي. لا تُعدّ تشخيصًا طبيًا
            أو نفسيًا أو استشارة مالية.
          </p>
        </div>

        {/* ══ 9. Actions ══════════════════════════════════════════════════ */}
        <div className={styles.actions}>
          <Button variant="secondary" size="md" onClick={() => navigate('/assessment')}>
            إعادة التقييم
          </Button>
          <Button variant="ghost" size="md" onClick={() => navigate('/')}>
            الرئيسية
          </Button>
        </div>
      </div>

      {/* Human Review Modal */}
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

// ─── Orchestrator highlight card ──────────────────────────────────────────────
function OrchestratorCard({ service, onNavigate }) {
  const { config, domainsServed, crossAgentReason } = service;
  if (!config) return null;

  return (
    <div className={styles.orchCard}>
      <div className={styles.orchCardHeader}>
        <span className={styles.orchIcon} aria-hidden="true">⟳</span>
        <div>
          <p className={styles.orchCardTitle}>{config.serviceName}</p>
          {crossAgentReason && (
            <p className={styles.orchCardReason}>{crossAgentReason}</p>
          )}
        </div>
      </div>

      {domainsServed && domainsServed.length > 0 && (
        <div className={styles.orchDomains}>
          {domainsServed.map((d) => (
            <span key={d} className={styles.domainTag}>
              {DOMAIN_META[d]?.icon ?? ''} {DOMAIN_LABELS_SHORT[d] ?? d}
            </span>
          ))}
        </div>
      )}

      <button
        className={styles.orchCtaBtn}
        onClick={() => onNavigate(`/service/${config.sourceAgentId ?? config.agentId ?? 'physical'}`)}
      >
        ابدأ الخدمة المقترحة ←
      </button>
    </div>
  );
}

// ─── Cross Insights collapsible section ──────────────────────────────────────
function CrossInsightsSection({ insights }) {
  const [open, setOpen] = useState(false);
  return (
    <section className={styles.section} aria-labelledby="cross-heading">
      <button
        id="cross-heading"
        className={styles.showAllBtn}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? '▲' : '▼'} {open ? 'إخفاء' : 'عرض'} ما ربطه وهج بين المجالات
      </button>
      {open && (
        <div className={styles.insightList}>
          {insights.map((insight) => (
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
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Priority Card ────────────────────────────────────────────────────────────
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
