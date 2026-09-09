import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AgentCard.module.css';

// ─── Static configs ───────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  stable:      { label: 'مستقر',        dot: '🟢', badgeMod: 'stable'      },
  risk:        { label: 'يحتاج اهتمام', dot: '🟠', badgeMod: 'risk'        },
  opportunity: { label: 'فرصة',         dot: '🔵', badgeMod: 'opportunity' },
};

function resolveCardType(agent) {
  if (agent.level === 'high' && agent.type === 'risk') return 'high_risk';
  return agent.type;
}

// ─── Collapsed evidence panel (assessment signals + rationale only) ───────────
function EvidencePanel({ agent }) {
  return (
    <div className={styles.evidencePanel}>
      {/* Signals from assessment */}
      {agent.signals.length > 0 && (
        <div className={styles.evidenceBlock}>
          <p className={styles.evidenceLabel}>ما الذي رصده وهج في إجاباتك؟</p>
          <ul className={styles.evidenceList}>
            {agent.signals.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}

      {/* Rationale */}
      {agent.evidenceRationale && (
        <div className={styles.evidenceBlock}>
          <p className={styles.evidenceLabel}>لماذا هذه التوصية؟</p>
          <p className={styles.evidenceRationale}>{agent.evidenceRationale}</p>
        </div>
      )}

      {/* Minimal validation note */}
      <p className={styles.evidenceProtoNote}>
        ⚠ قاعدة تجريبية للعرض — تتطلب اعتماد مختص قبل الاستخدام الإنتاجي.
      </p>
    </div>
  );
}

// ─── Main AgentCard ───────────────────────────────────────────────────────────
export function AgentCard({ agent, onHumanReview, servicePathConfig, isTopPriority }) {
  const [whyOpen, setWhyOpen] = useState(false);
  const navigate = useNavigate();

  const cardType = resolveCardType(agent);
  const typeConf = TYPE_CONFIG[agent.type] ?? TYPE_CONFIG.stable;
  const dotLabel = agent.level === 'high' && agent.type === 'risk' ? '🔴' : typeConf.dot;

  // Up to 2 key signals shown inline in the card
  const keySignals = agent.signals.slice(0, 2);

  function handleStartService() {
    // Navigate to the service path for this agent.
    // We pass the agent id so ServicePath can load the right config.
    navigate(`/service/${agent.id}`);
  }

  return (
    <article
      className={`${styles.card} ${styles[`card--${cardType}`]} ${isTopPriority ? styles['card--priority'] : ''}`}
      aria-labelledby={`agent-title-${agent.id}`}
    >
      {/* ── Header: icon + name + status badge ── */}
      <div className={styles.header}>
        <span className={styles.icon} aria-hidden="true">{agent.icon}</span>
        <div className={styles.headerText}>
          <h3 id={`agent-title-${agent.id}`} className={styles.title}>
            {agent.title}
          </h3>
          <span className={`${styles.badge} ${styles[`badge--${typeConf.badgeMod}`]}`}>
            <span aria-hidden="true">{dotLabel}</span> {typeConf.label}
          </span>
        </div>
      </div>

      {/* ── Key finding: max 2 signals ── */}
      {keySignals.length > 0 && (
        <ul className={styles.keyFindings} aria-label="أبرز النتائج">
          {keySignals.map((s, i) => (
            <li key={i} className={styles.keyFinding}>{s}</li>
          ))}
        </ul>
      )}

      {/* ── Recommendation ── */}
      <div className={styles.recommendation}>
        <span className={styles.recLabel}>التوصية</span>
        <p className={styles.recText}>{agent.recommendation}</p>
      </div>

      {/* ── Human review — compact badge only ── */}
      {agent.humanReview && (
        <button
          className={styles.reviewBadge}
          onClick={() => onHumanReview?.(agent)}
          aria-label="مراجعة مختص مقترحة — انقر للتفاصيل"
        >
          🔶 يتطلب مراجعة مختص قبل البدء
        </button>
      )}

      {/* ── CTA button ── */}
      {servicePathConfig && (
        <button className={styles.ctaBtn} onClick={handleStartService}>
          ابدأ الخدمة المقترحة ←
        </button>
      )}

      {/* ── Collapsible explainability ── */}
      <button
        className={styles.whyBtn}
        onClick={() => setWhyOpen((v) => !v)}
        aria-expanded={whyOpen}
        aria-controls={`why-${agent.id}`}
      >
        {whyOpen ? '▲' : '▼'} لماذا أوصى وهج بهذا؟
      </button>

      {whyOpen && (
        <div id={`why-${agent.id}`}>
          <EvidencePanel agent={agent} />
        </div>
      )}
    </article>
  );
}
