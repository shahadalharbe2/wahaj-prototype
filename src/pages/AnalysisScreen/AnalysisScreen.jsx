import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AnalysisScreen.module.css';
import { WahajLogo } from '../../components';
import { useAssessment } from '../../context/useAssessment';
import { runAnalysis } from '../../services/analysisService';
import { countCompletedAssessment } from '../../services/beneficiaryCounter.js';

const AGENTS = [
  { id: 'health',        label: 'الصحة والأمراض المزمنة',  icon: '🫀' },
  { id: 'physical',      label: 'النشاط والحركة',           icon: '🏃' },
  { id: 'psychological', label: 'الرفاه النفسي',             icon: '🧠' },
  { id: 'social',        label: 'الحياة الاجتماعية',         icon: '🤝' },
  { id: 'financial',     label: 'الاستقرار المالي',           icon: '💼' },
  { id: 'experience',    label: 'الخبرات والهدف',             icon: '🌟' },
];

// Timing (ms) – total ~2.8 s
const AGENT_DELAY    = 300;   // between agents starting
const AGENT_DURATION = 480;   // each agent takes ~480 ms
const ORCH_DELAY     = 400;   // pause before orchestrator
const ORCH_DURATION  = 600;
const NAV_DELAY      = 500;   // pause after done before navigating

export function AnalysisScreen() {
  const navigate = useNavigate();
  const { getStructuredPayload, state } = useAssessment();

  // agent states: 'waiting' | 'running' | 'done'
  const [agentStates, setAgentStates] = useState(
    Object.fromEntries(AGENTS.map((a) => [a.id, 'waiting']))
  );
  const [orchState, setOrchState] = useState('waiting');  // 'waiting' | 'running' | 'done'
  const [allDone, setAllDone] = useState(false);

  // Store analysis result in a ref so it's available when we navigate
  const analysisRef = useRef(null);

  // Guard: if assessment is not complete, redirect
  useEffect(() => {
    if (!state.isComplete) {
      navigate('/assessment', { replace: true });
    }
  }, [state.isComplete, navigate]);

  // Run the animation sequence on mount
  useEffect(() => {
    if (!state.isComplete) return;

    // Run the actual analysis synchronously (pure function)
    const payload = getStructuredPayload();
    const result = runAnalysis(payload);
    analysisRef.current = result;

    // Sequence: stagger each agent start, then orchestrator, then done
    const timers = [];

    AGENTS.forEach((agent, idx) => {
      // Start agent
      timers.push(
        setTimeout(() => {
          setAgentStates((prev) => ({ ...prev, [agent.id]: 'running' }));
        }, idx * AGENT_DELAY)
      );
      // Finish agent
      timers.push(
        setTimeout(() => {
          setAgentStates((prev) => ({ ...prev, [agent.id]: 'done' }));
        }, idx * AGENT_DELAY + AGENT_DURATION)
      );
    });

    const orchStart = AGENTS.length * AGENT_DELAY + ORCH_DELAY;
    timers.push(setTimeout(() => setOrchState('running'), orchStart));
    timers.push(setTimeout(() => setOrchState('done'), orchStart + ORCH_DURATION));
    timers.push(setTimeout(() => setAllDone(true), orchStart + ORCH_DURATION + 100));

    // Navigate after all done
    timers.push(
      setTimeout(() => {
        // Increment the beneficiary counter for this newly completed assessment.
        // countCompletedAssessment() is idempotent — safe even if this timer fires twice.
        countCompletedAssessment();

        // Also persist raw answers so ResultsDashboard can personalize service paths
        const toStore = { ...result, rawAnswers: payload.raw };
        sessionStorage.setItem('wahaj_analysis', JSON.stringify(toStore));
        navigate('/results');
      }, orchStart + ORCH_DURATION + NAV_DELAY)
    );

    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getStatusLabel(s) {
    if (s === 'waiting') return 'بانتظار التحليل';
    if (s === 'running') return 'جارٍ التحليل...';
    return 'اكتمل ✓';
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <WahajLogo size="sm" />
        <span className={styles.headerTag}>تقييم وهج 360°</span>
      </header>

      <section className={styles.content}>
        {/* Ambient glow */}
        <div className={styles.glow} aria-hidden="true" />

        <h1 className={styles.title}>وهج يحلل صورتك المتكاملة</h1>
        <p className={styles.subtitle}>
          يعمل وكلاء وهج المتخصصون على تحليل إجاباتك وربط المؤشرات لبناء مسار
          يناسب احتياجاتك.
        </p>

        {/* Agent grid */}
        <div className={styles.agentGrid} role="list" aria-label="حالة وكلاء وهج">
          {AGENTS.map((agent) => {
            const s = agentStates[agent.id];
            return (
              <div
                key={agent.id}
                className={`${styles.agentCard} ${styles[`agentCard--${s}`]}`}
                role="listitem"
              >
                <span className={styles.agentIcon} aria-hidden="true">{agent.icon}</span>
                <span className={styles.agentLabel}>{agent.label}</span>
                <span className={`${styles.agentStatus} ${styles[`status--${s}`]}`}>
                  {getStatusLabel(s)}
                </span>
                {s === 'running' && (
                  <div className={styles.agentProgress} aria-hidden="true">
                    <div className={styles.agentProgressFill} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Orchestrator */}
        <div className={`${styles.orchestrator} ${styles[`orchestrator--${orchState}`]}`}>
          <div className={styles.orchHeader}>
            <div className={styles.orchIcon} aria-hidden="true">
              <span className={styles.orchRing3} />
              <span className={styles.orchRing2} />
              <span className={styles.orchCore}>⟳</span>
            </div>
            <div className={styles.orchText}>
              <p className={styles.orchTitle}>منسق وهج الذكي</p>
              <p className={styles.orchSub}>Wahaj Orchestrator</p>
            </div>
            {orchState === 'done' && (
              <span className={styles.orchDone} aria-label="اكتمل">✓</span>
            )}
          </div>
          {orchState !== 'waiting' && (
            <p className={styles.orchDesc}>
              يربط منسق وهج نتائج الوكلاء لاكتشاف العلاقات وتحديد الأولويات.
            </p>
          )}
          {orchState === 'running' && (
            <div className={styles.orchProgress} aria-hidden="true">
              <div className={styles.orchProgressFill} />
            </div>
          )}
        </div>

        {allDone && (
          <p className={styles.readyNote} role="status">
            اكتملت جميع التحليلات — جارٍ تحضير نتائجك...
          </p>
        )}
      </section>
    </main>
  );
}
