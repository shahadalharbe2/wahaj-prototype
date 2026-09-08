import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';
import { WahajLogo } from '../../components';
import {
  DonutChart,
  HorizontalBar,
  FunnelChart,
  ImpactBar,
} from '../../components/DashboardCharts/DashboardCharts.jsx';
import {
  TOP_KPIS,
  SERVICE_UTILIZATION,
  FUNNEL_STAGES,
  PHYSICAL_KPI,
  AGENT_KPIS,
  PRIORITY_DIST,
  HITL_KPI,
  IMPACT_KPIS,
  FOLLOWUP_STATUS,
  RECENT_CASES,
  FILTER_OPTIONS,
} from '../../data/dashboardDemoData.js';

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
function KpiCard({ kpi }) {
  return (
    <div className={styles.kpiCard} data-variant={kpi.variant}>
      <span className={styles.kpiIcon} aria-hidden="true">{kpi.icon}</span>
      <div className={styles.kpiValue}>{kpi.display}</div>
      <div className={styles.kpiLabel}>{kpi.label}</div>
      {kpi.sub && <div className={styles.kpiSub}>{kpi.sub}</div>}
    </div>
  );
}

function FilterBar({ filters, onChange }) {
  return (
    <div className={styles.filtersBar} role="group" aria-label="فلاتر لوحة المؤشرات">
      {[
        { key: 'period',    label: 'الفترة',           options: FILTER_OPTIONS.period },
        { key: 'phase',     label: 'المرحلة',          options: FILTER_OPTIONS.phase },
        { key: 'agent',     label: 'الوكيل',           options: FILTER_OPTIONS.agent },
        { key: 'priority',  label: 'الأولوية',         options: FILTER_OPTIONS.priority },
        { key: 'svcStatus', label: 'حالة الخدمة',      options: FILTER_OPTIONS.svcStatus },
        { key: 'followup',  label: 'حالة المتابعة',    options: FILTER_OPTIONS.followup },
      ].map((f) => (
        <div key={f.key} className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor={`filter-${f.key}`}>
            {f.label}
          </label>
          <select
            id={`filter-${f.key}`}
            className={styles.filterSelect}
            value={filters[f.key]}
            onChange={(e) => onChange(f.key, e.target.value)}
            aria-label={f.label}
          >
            {f.options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function AdminDashboard() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    period:    'كل الفترات',
    phase:     'الكل',
    agent:     'الكل',
    priority:  'الكل',
    svcStatus: 'الكل',
    followup:  'الكل',
  });

  function handleFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  // Filter table rows by agent and priority (demo-level local filter)
  const filteredCases = RECENT_CASES.filter((c) => {
    const agentMatch = filters.agent === 'الكل' || c.path.includes(filters.agent);
    const prioMatch  = filters.priority === 'الكل' || c.priority === filters.priority;
    const svcMatch   = filters.svcStatus === 'الكل' || c.status.includes(filters.svcStatus);
    return agentMatch && prioMatch && svcMatch;
  });

  return (
    <div className={styles.page} dir="rtl" lang="ar">
      {/* ── Demo data warning banner ─────────────────────────────────── */}
      <div className={styles.demoBanner} role="alert">
        ⚠️ بيانات تجريبية لأغراض النموذج الأولي — لا تمثّل إحصاءات حقيقية للمؤسسة العامة للتأمينات الاجتماعية
      </div>

      {/* ── Sticky header ────────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <WahajLogo size="sm" />
            <div>
              <div className={styles.headerTitle}>لوحة مؤشرات وهج</div>
              <div className={styles.headerSubtitle}>
                متابعة استفادة المستفيدين من خدمات وهج وقياس الأثر
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span className={styles.demoBadge}>
              🔬 بيانات تجريبية للنموذج الأولي
            </span>
            <button
              className={styles.backBtn}
              onClick={() => navigate('/admin-dashboard')}
              aria-label="لوحة الأثر والمتابعة"
            >
              📋 الأثر والمتابعة
            </button>
            <button
              className={styles.backBtn}
              onClick={() => navigate('/')}
              aria-label="العودة للصفحة الرئيسية"
            >
              ← الرئيسية
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ──────────────────────────────────────────────────────── */}
      <main className={styles.main}>
        {/* Page title */}
        <div>
          <h1 className={styles.pageTitle}>لوحة مؤشرات وهج</h1>
          <p className={styles.pageSubtitle}>
            متابعة استفادة المستفيدين من خدمات وهج وقياس الأثر على مراحل الرحلة كاملةً
          </p>
        </div>

        {/* ── Filters ─────────────────────────────────────────────────── */}
        <FilterBar filters={filters} onChange={handleFilter} />

        {/* ══════════════════════════════════════════════════════════════
            SECTION 1 — Top KPI Cards
        ═══════════════════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="kpi-heading">
          <div className={styles.sectionHeader}>
            <h2 id="kpi-heading" className={styles.sectionTitle}>المؤشرات الرئيسية</h2>
            <span className={styles.sectionNote}>بيانات تجريبية للنموذج الأولي</span>
          </div>
          <div className={styles.kpiGrid}>
            {TOP_KPIS.map((kpi) => <KpiCard key={kpi.id} kpi={kpi} />)}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 2 — Service utilization + Conversion funnel
        ═══════════════════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="util-heading">
          <h2 id="util-heading" className={styles.sectionTitle}>
            استخدام الخدمات حسب المسار
          </h2>
          <div className={styles.twoCol}>
            {/* Horizontal bar */}
            <div className={styles.utilizationCard}>
              <div className={styles.cardTitle}>عدد المستفيدين لكل مسار</div>
              <HorizontalBar data={SERVICE_UTILIZATION} />
            </div>

            {/* Funnel */}
            <div className={styles.funnelCard}>
              <div className={styles.cardTitle} style={{ alignSelf: 'flex-start', width: '100%' }}>
                رحلة المستفيد من التوصية إلى الأثر
              </div>
              <FunnelChart stages={FUNNEL_STAGES} />
              <p className={styles.funnelNote}>
                وهج يقيس التنفيذ الفعلي، لا الاقتراحات فقط — من التوصية حتى تحقيق الهدف.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 3 — Physical agent deep-dive
        ═══════════════════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="physical-heading">
          <h2 id="physical-heading" className={styles.sectionTitle}>
            مسار النشاط والحركة — تعمّق في المؤشرات
          </h2>
          <div className={styles.physicalCard}>
            <div className={styles.physicalTitle}>
              🏃 مسار النشاط والحركة
            </div>
            <div className={styles.physicalGrid}>
              {[
                { value: PHYSICAL_KPI.recommended,  label: 'موصى لهم بالمسار' },
                { value: PHYSICAL_KPI.started,       label: 'بدأوا المسار' },
                { value: PHYSICAL_KPI.choseService,  label: 'اختاروا خدمة / نادٍ' },
                { value: PHYSICAL_KPI.firstVisit,    label: 'سجلوا أول زيارة' },
                { value: PHYSICAL_KPI.first5Days,    label: 'أكملوا أول 5 أيام' },
                { value: PHYSICAL_KPI.continuing,    label: 'مستمرون بعد المتابعة' },
                { value: `${PHYSICAL_KPI.adherencePct}٪`, label: 'نسبة الالتزام' },
              ].map((s) => (
                <div key={s.label} className={styles.physicalStat}>
                  <div className={styles.physicalStatValue}>{typeof s.value === 'number' ? s.value.toLocaleString('ar') : s.value}</div>
                  <div className={styles.physicalStatLabel}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Impact comparison */}
            <div className={styles.physicalImpact}>
              <div className={styles.impactMetric}>
                <div className={styles.impactMetricValue}>{PHYSICAL_KPI.baseline}</div>
                <div className={styles.impactMetricLabel}>قبل المتابعة</div>
              </div>
              <div className={styles.impactArrow}>→</div>
              <div className={styles.impactMetric}>
                <div className={styles.impactMetricValue}>{PHYSICAL_KPI.followup}</div>
                <div className={styles.impactMetricLabel}>بعد المتابعة</div>
              </div>
              <div style={{ flex: 1 }} />
              <div className={styles.impactDelta}>{PHYSICAL_KPI.improvement}</div>
            </div>
            <p style={{ fontSize: 12, color: '#9B856D', marginTop: 8, textAlign: 'center' }}>
              {PHYSICAL_KPI.unit} | بيانات تجريبية توضيحية — لا تمثّل نتائج سريرية
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 4 — Per-agent KPIs
        ═══════════════════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="agents-heading">
          <div className={styles.sectionHeader}>
            <h2 id="agents-heading" className={styles.sectionTitle}>مؤشرات الوكلاء</h2>
            <span className={styles.sectionNote}>بيانات تجريبية للنموذج الأولي</span>
          </div>
          <div className={styles.agentGrid}>
            {AGENT_KPIS.map((agent) => (
              <div
                key={agent.id}
                className={styles.agentCard}
                style={{ '--agent-color': agent.color }}
              >
                <div className={styles.agentHeader}>
                  <span className={styles.agentIcon} aria-hidden="true">{agent.icon}</span>
                  <span className={styles.agentName}>{agent.label}</span>
                </div>
                <div className={styles.agentStats}>
                  {agent.stats.map((s) => (
                    <div key={s.label} className={styles.agentStat}>
                      <span className={styles.agentStatLabel}>{s.label}</span>
                      <span className={styles.agentStatValue}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 5 — Priority distribution + HITL
        ═══════════════════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="priority-heading">
          <h2 id="priority-heading" className={styles.sectionTitle}>
            توزيع الأولويات وكفاءة الإحالة
          </h2>
          <div className={styles.twoCol}>
            {/* Donut chart */}
            <div className={styles.priorityCard}>
              <div className={styles.cardTitle} style={{ alignSelf: 'flex-start', width: '100%', marginBottom: 0 }}>
                توزيع الأولويات حسب نموذج وهج
              </div>
              <DonutChart
                data={PRIORITY_DIST}
                size={220}
                title="توزيع الأولويات"
              />
            </div>

            {/* HITL card */}
            <div className={styles.hitlCard}>
              <div className={styles.cardTitle}>كفاءة الإحالة للمختص</div>
              <div className={styles.hitlStats}>
                <div className={styles.hitlStat}>
                  <div className={styles.hitlStatValue}>
                    {HITL_KPI.totalScreened.toLocaleString('ar')}
                  </div>
                  <div className={styles.hitlStatLabel}>حالة تم فرزها بواسطة وهج</div>
                </div>
                <div className={styles.hitlStat}>
                  <div className={styles.hitlStatValue} style={{ color: '#C96B2B' }}>
                    {HITL_KPI.humanReview}
                  </div>
                  <div className={styles.hitlStatLabel}>احتاجت مراجعة بشرية</div>
                </div>
                <div className={styles.hitlStat}>
                  <div className={styles.hitlStatValue} style={{ color: '#D64E4E' }}>
                    {HITL_KPI.safetyEscalated}
                  </div>
                  <div className={styles.hitlStatLabel}>حالة Safety Escalation</div>
                </div>
                <div className={styles.hitlStat}>
                  <div className={styles.hitlStatValue} style={{ color: '#3A7D44' }}>
                    {HITL_KPI.pct}
                  </div>
                  <div className={styles.hitlStatLabel}>
                    نسبة الحالات التي وصلت للمختص
                  </div>
                </div>
              </div>
              <p className={styles.hitlMessage}>
                وهج يساعد على ترتيب الأولويات بحيث يركّز المختص على الحالات التي تحتاج
                حكمًا مهنيًا بدل مراجعة جميع المستفيدين يدويًا.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 6 — Impact measurement
        ═══════════════════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="impact-heading">
          <div className={styles.sectionHeader}>
            <h2 id="impact-heading" className={styles.sectionTitle}>قياس الأثر</h2>
            <span className={styles.sectionNote}>نتائج تجريبية توضيحية للنموذج الأولي</span>
          </div>
          <div className={styles.impactCard}>
            <div className={styles.cardTitle}>
              نسب التحسن المُبلَّغ عنها بعد متابعة وهج
            </div>
            <div className={styles.impactBars}>
              {IMPACT_KPIS.map((imp) => (
                <ImpactBar
                  key={imp.label}
                  label={imp.label}
                  pct={imp.pct}
                  color={imp.color}
                />
              ))}
            </div>
            <p className={styles.demoNote}>
              * هذه الأرقام نموذج توضيحي للنموذج الأولي فقط ولا تمثل نتائج دراسة سريرية أو إحصاءات مؤسسية.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 7 — Follow-up status
        ═══════════════════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="followup-heading">
          <h2 id="followup-heading" className={styles.sectionTitle}>حالة المتابعة</h2>
          <div className={styles.followupGrid}>
            {FOLLOWUP_STATUS.map((f) => (
              <div key={f.label} className={styles.followupCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className={styles.followupDot} style={{ background: f.color }} aria-hidden="true" />
                  <div className={styles.followupValue}>{f.count.toLocaleString('ar')}</div>
                </div>
                <div className={styles.followupLabel}>{f.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 8 — Recent cases table
        ═══════════════════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="table-heading">
          <div className={styles.sectionHeader}>
            <h2 id="table-heading" className={styles.sectionTitle}>
              أحدث حالات المتابعة
            </h2>
            <span className={styles.sectionNote}>
              معرّفات مجهولة الهوية — بيانات تجريبية
            </span>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table} aria-label="جدول أحدث حالات المتابعة">
              <thead>
                <tr>
                  <th scope="col">معرّف المستفيد</th>
                  <th scope="col">المسار</th>
                  <th scope="col">الحالة</th>
                  <th scope="col">نسبة الإنجاز</th>
                  <th scope="col" className="hideOnMobile">موعد المتابعة</th>
                  <th scope="col">الأولوية</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: '#9B856D', padding: 24 }}>
                      لا توجد نتائج تطابق الفلاتر المختارة
                    </td>
                  </tr>
                ) : (
                  filteredCases.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <span className={styles.beneficiaryId}>{c.id}</span>
                      </td>
                      <td>{c.path}</td>
                      <td>{c.status}</td>
                      <td>
                        <div className={styles.progressCell}>
                          <div className={styles.progressMini}>
                            <div
                              className={styles.progressMiniFill}
                              style={{ width: `${c.pct}%` }}
                            />
                          </div>
                          <span style={{ fontSize: 13, minWidth: 32 }}>{c.pct}٪</span>
                        </div>
                      </td>
                      <td className="hideOnMobile">{c.followup}</td>
                      <td>
                        <span
                          className={styles.priorityBadge}
                          data-p={c.priority}
                        >
                          {c.priority}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            KPI Story — conceptual layer footer
        ═══════════════════════════════════════════════════════════════ */}
        <section
          className={styles.section}
          style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}
          aria-label="قصة مؤشرات وهج"
        >
          <h2 className={styles.sectionTitle} style={{ marginBottom: 'var(--space-4)' }}>
            وهج يقيس أكثر من عدد المستخدمين
          </h2>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-3)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {[
              { label: 'Reach',               sub: 'الوصول',            color: '#C96B2B' },
              { label: 'Assessment',          sub: 'التقييم',           color: '#E8873D' },
              { label: 'Recommendation',      sub: 'التوصية',           color: '#B07D0A' },
              { label: 'Service Activation',  sub: 'تفعيل الخدمة',      color: '#3A7D44' },
              { label: 'Engagement',          sub: 'الالتزام',          color: '#2472BC' },
              { label: 'Follow-up',           sub: 'المتابعة',          color: '#7C5CD8' },
              { label: 'Outcome',             sub: 'الأثر',             color: '#3A7D44' },
              { label: 'Human Escalation',    sub: 'الإحالة للمختص',    color: '#D64E4E' },
            ].map((layer, i, arr) => (
              <div key={layer.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    background: layer.color,
                    color: '#fff',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 14px',
                    fontSize: 13,
                    fontWeight: 600,
                    textAlign: 'center',
                  }}
                >
                  <div>{layer.label}</div>
                  <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.9 }}>{layer.sub}</div>
                </div>
                {i < arr.length - 1 && (
                  <span style={{ color: '#9B856D', fontSize: 18 }}>→</span>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border)',
          padding: 'var(--space-5) var(--space-6)',
          textAlign: 'center',
          fontSize: 12,
          color: '#9B856D',
        }}
      >
        وهج — لوحة مؤشرات النموذج الأولي © {new Date().getFullYear()} |{' '}
        جميع البيانات المعروضة تجريبية ولا تمثل إحصاءات مؤسسية حقيقية
      </footer>
    </div>
  );
}
