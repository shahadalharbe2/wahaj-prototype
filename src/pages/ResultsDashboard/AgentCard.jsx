import { useState } from 'react';
import styles from './AgentCard.module.css';
import { ServicePathPanel } from '../../features/ServicePath/ServicePathPanel.jsx';

const TYPE_CONFIG = {
  stable:      { label: 'مستقر',          dot: '🟢' },
  risk:        { label: 'يحتاج اهتمام',   dot: '🟠' },
  opportunity: { label: 'فرصة',           dot: '🔵' },
};

const LEVEL_CONFIG = {
  low:      { label: 'منخفض',  color: 'green'  },
  moderate: { label: 'متوسط',  color: 'orange' },
  high:     { label: 'مرتفع',  color: 'red'    },
};

function resolveCardType(agent) {
  if (agent.level === 'high' && agent.type === 'risk') return 'high_risk';
  return agent.type;
}

// ── Evidence panel sub-component ─────────────────────────────────────────────
function EvidencePanel({ agent }) {
  const hasRealSources = Array.isArray(agent.sources) && agent.sources.length > 0;
  const isOfficial = agent.validationLabel?.isOfficial ?? false;
  const validationText = agent.validationLabel?.label ?? 'قاعدة تجريبية للعرض — تتطلب اعتماد مختص';

  return (
    <div className={styles.explainPanel}>
      {/* 1. Signals used */}
      <div className={styles.evidenceSection}>
        <p className={styles.evidenceSectionTitle}>المؤشرات التي اعتمد عليها وهج</p>
        {agent.signals.length > 0 ? (
          <ul className={styles.signalList}>
            {agent.signals.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        ) : (
          <p className={styles.evidenceNA}>—</p>
        )}
      </div>

      {/* 2. Evidence rationale */}
      {agent.evidenceRationale && (
        <div className={styles.evidenceSection}>
          <p className={styles.evidenceSectionTitle}>سبب التوصية</p>
          <p className={styles.evidenceRationale}>{agent.evidenceRationale}</p>
        </div>
      )}

      {/* 3. Sources */}
      <div className={styles.evidenceSection}>
        <p className={styles.evidenceSectionTitle}>مصدر الدليل</p>
        {hasRealSources ? (
          <div className={styles.sourceList}>
            {agent.sources.map((src) => (
              <div key={src.id} className={styles.sourceItem}>
                <div className={styles.sourceHeader}>
                  <span className={styles.sourceOrg}>{src.organization}</span>
                  {src.evidenceType && (
                    <span className={styles.sourceType}>{src.evidenceType}</span>
                  )}
                </div>
                <p className={styles.sourceTitle}>{src.title}</p>
                {src.usage && (
                  <p className={styles.sourceUsage}>{src.usage}</p>
                )}
                {src.url && src.url !== '' && (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.sourceLink}
                  >
                    عرض المصدر ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noSource}>لا يوجد مصدر موثق مرتبط بهذه القاعدة حاليًا.</p>
        )}
      </div>

      {/* 4. Validation status */}
      <div className={styles.evidenceSection}>
        <p className={styles.evidenceSectionTitle}>حالة القاعدة</p>
        <span
          className={`${styles.validationBadge} ${
            isOfficial ? styles['validationBadge--official'] : styles['validationBadge--proto']
          }`}
        >
          {isOfficial ? '✓ ' : '⚠ '}{validationText}
        </span>
        {agent.ruleId && (
          <p className={styles.ruleId}>معرّف القاعدة: {agent.ruleId}</p>
        )}
      </div>
    </div>
  );
}

// ── Main AgentCard ────────────────────────────────────────────────────────────
export function AgentCard({ agent, onHumanReview, servicePathConfig }) {
  const [expanded, setExpanded] = useState(false);
  const cardType = resolveCardType(agent);
  const typeConf = TYPE_CONFIG[agent.type] ?? TYPE_CONFIG.stable;
  const levelConf = LEVEL_CONFIG[agent.level] ?? LEVEL_CONFIG.low;

  const dotLabel = agent.level === 'high' && agent.type === 'risk' ? '🔴' : typeConf.dot;

  return (
    <article
      className={`${styles.card} ${styles[`card--${cardType}`]}`}
      aria-labelledby={`agent-title-${agent.id}`}
    >
      {/* Card header */}
      <div className={styles.header}>
        <span className={styles.icon} aria-hidden="true">{agent.icon}</span>
        <div className={styles.headerText}>
          <h3 id={`agent-title-${agent.id}`} className={styles.title}>
            {agent.title}
          </h3>
          <span className={`${styles.badge} ${styles[`badge--${agent.type}`]}`}>
            <span aria-hidden="true">{dotLabel}</span> {typeConf.label}
          </span>
        </div>
        {agent.level !== 'low' && (
          <span className={`${styles.levelPill} ${styles[`levelPill--${levelConf.color}`]}`}>
            {levelConf.label}
          </span>
        )}
      </div>

      {/* Summary */}
      <p className={styles.summary}>{agent.summary}</p>

      {/* Signals */}
      {agent.signals.length > 0 && (
        <ul className={styles.signals} aria-label="المؤشرات">
          {agent.signals.map((s, i) => (
            <li key={i} className={styles.signal}>{s}</li>
          ))}
        </ul>
      )}

      {/* Experience modes */}
      {agent.experienceModes && agent.experienceModes.length > 0 && (
        <div className={styles.modes}>
          {agent.experienceModes.map((m) => (
            <span key={m} className={styles.modeTag}>{m}</span>
          ))}
        </div>
      )}

      {/* Recommendation */}
      <div className={styles.recommendation}>
        <span className={styles.recLabel}>التوصية:</span>
        <p className={styles.recText}>{agent.recommendation}</p>
      </div>

      {/* Disclaimer */}
      {agent.disclaimer && (
        <p className={styles.disclaimer}>{agent.disclaimer}</p>
      )}

      {/* Explainability toggle */}
      <button
        className={styles.explainBtn}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={`explain-${agent.id}`}
      >
        {expanded ? '▲' : '▼'} لماذا أوصى وهج بهذا؟
      </button>

      {expanded && (
        <div id={`explain-${agent.id}`}>
          <EvidencePanel agent={agent} />
        </div>
      )}

      {/* Human review trigger */}
      {agent.humanReview && (
        <button
          className={styles.reviewBtn}
          onClick={() => onHumanReview?.(agent)}
        >
          🔶 مراجعة مختص مقترحة
        </button>
      )}

      {/* ── Service path panel (all agents) ── */}
      {/* servicePathConfig is passed from ResultsDashboard via AgentCard prop.
          Safety note inside the panel is shown first when humanReview is true. */}
      {servicePathConfig && (
        <ServicePathPanel
          config={servicePathConfig}
          agentHasHumanReview={agent.humanReview ?? false}
        />
      )}
    </article>
  );
}
