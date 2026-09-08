import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminImpactDashboard.module.css';
import { WahajLogo } from '../../components';
import {
  DEMO_BENEFICIARIES,
  IMPACT_OVERVIEW_KPIS,
  IMPACT_FILTER_OPTIONS,
} from '../../data/followUpDemoData.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Derive the latest metric values for a beneficiary (most recent follow-up). */
function getLatestMetrics(ben) {
  if (!ben.followUps || ben.followUps.length === 0) return {};
  return ben.followUps[ben.followUps.length - 1].metrics;
}

/** Build comparison rows: baseline vs each follow-up checkpoint. */
function buildComparisonRows(ben) {
  const metricKeys = Object.keys(ben.baseline);
  return metricKeys.map((key) => {
    const bm = ben.baseline[key];
    const checkpoints = ben.followUps.map((fu) => ({
      label: fu.label,
      value: fu.metrics[key]?.value ?? '—',
      unit:  fu.metrics[key]?.unit  ?? '',
    }));
    // Determine status by comparing first vs last non-null value
    const last = ben.followUps.length > 0 ? ben.followUps[ben.followUps.length - 1].metrics[key] : null;
    const status = last ? deriveMetricStatus(bm.value, last.value, bm.direction) : 'stable';
    return { key, label: bm.label, baseline: `${bm.value}${bm.unit ? ' ' + bm.unit : ''}`, checkpoints, status };
  });
}

function deriveMetricStatus(baseline, current, direction) {
  // Both numeric
  if (typeof baseline === 'number' && typeof current === 'number') {
    if (direction === 'higher_better') return current > baseline ? 'improved' : current < baseline ? 'needs_adjustment' : 'stable';
    return current < baseline ? 'improved' : current > baseline ? 'needs_adjustment' : 'stable';
  }
  // Ordered Arabic qualitative scale (rough mapping)
  const qualScale = ['منعدم', 'غير منتظم', 'غير منتظمة', 'سيئة', 'منخفض', 'منخفضة', 'محدود', 'محدودة جداً', 'محدودة',
    'متوسط', 'متوسطة', 'شهري', 'جيد', 'جيدة', 'أسبوعي', 'واضح', 'إيجابية', 'مكتمل', 'مستقر', 'مستقرة'];
  const bi = qualScale.indexOf(String(baseline));
  const ci = qualScale.indexOf(String(current));
  if (bi === -1 || ci === -1) return 'stable';
  if (direction === 'higher_better') return ci > bi ? 'improved' : ci < bi ? 'needs_adjustment' : 'stable';
  return ci < bi ? 'improved' : ci > bi ? 'needs_adjustment' : 'stable';
}

const STATUS_LABEL = {
  improved: 'تحسن',
  stable: 'مستقر',
  needs_adjustment: 'يحتاج تعديل',
};

const STATUS_CLASS = {
  improved: styles.compImproved,
  stable: styles.compStable,
  needs_adjustment: styles.compNeedsWork,
};

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ type, label }) {
  return <span className={styles.badge} data-type={type}>{label}</span>;
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ kpi }) {
  return (
    <div className={styles.kpiCard} data-variant={kpi.variant}>
      <span className={styles.kpiIcon} aria-hidden="true">{kpi.icon}</span>
      <div className={styles.kpiValue}>{kpi.display}</div>
      <div className={styles.kpiLabel}>{kpi.label}</div>
    </div>
  );
}

// ─── Filter bar ───────────────────────────────────────────────────────────────
function FilterBar({ filters, onChange }) {
  const fields = [
    { key: 'period',       label: 'الفترة',        options: IMPACT_FILTER_OPTIONS.period },
    { key: 'agent',        label: 'الوكيل',        options: IMPACT_FILTER_OPTIONS.agent },
    { key: 'priority',     label: 'الأولوية',      options: IMPACT_FILTER_OPTIONS.priority },
    { key: 'svcStatus',    label: 'حالة المسار',   options: IMPACT_FILTER_OPTIONS.svcStatus },
    { key: 'impactStatus', label: 'حالة الأثر',    options: IMPACT_FILTER_OPTIONS.impactStatus },
    { key: 'humanReview',  label: 'Human Review',  options: IMPACT_FILTER_OPTIONS.humanReview },
  ];
  return (
    <div className={styles.filtersBar} role="group" aria-label="فلاتر لوحة الأثر">
      {fields.map((f) => (
        <div key={f.key} className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor={`if-${f.key}`}>{f.label}</label>
          <select
            id={`if-${f.key}`}
            className={styles.filterSelect}
            value={filters[f.key]}
            onChange={(e) => onChange(f.key, e.target.value)}
          >
            {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      ))}
    </div>
  );
}

// ─── Impact Summary sub-component ────────────────────────────────────────────
/**
 * Reads ben.baseline and ben.followUps directly — no hard-coded values.
 * Works for every beneficiary in the demo dataset.
 */
function ImpactSummary({ ben }) {
  const compRows = buildComparisonRows(ben);

  // ── Checkpoint strip data ──────────────────────────────────────────────────
  // We map each follow-up to a checkpoint label. Gaps beyond available follow-ups
  // are shown as "لم يحن موعد المتابعة".
  const CHECKPOINT_LABELS = ['خط الأساس', '30 يومًا', '3 أشهر', '6 أشهر'];

  // Determine per-checkpoint overall status (best single status across metrics)
  function checkpointStatus(fuIndex) {
    if (fuIndex >= ben.followUps.length) return null;
    const fu = ben.followUps[fuIndex];
    const statuses = compRows.map((row) => {
      const bm = ben.baseline[row.key];
      const val = fu.metrics[row.key]?.value;
      if (val === undefined || val === null) return 'stable';
      return deriveMetricStatus(bm.value, val, bm.direction);
    });
    if (statuses.includes('improved')) return 'improved';
    if (statuses.includes('needs_adjustment')) return 'needs_adjustment';
    return 'stable';
  }

  // ── Improved metric count ──────────────────────────────────────────────────
  const improvedCount = compRows.filter((r) => r.status === 'improved').length;
  const adjustCount   = compRows.filter((r) => r.status === 'needs_adjustment').length;

  function overallDesc() {
    if (ben.followUps.length === 0) return 'لم تبدأ متابعة بعد';
    if (improvedCount > 0 && adjustCount === 0)
      return `تحسن في ${improvedCount} مؤشر${improvedCount > 1 ? 'ات' : ''} مقارنةً بخط الأساس`;
    if (improvedCount > 0 && adjustCount > 0)
      return `تحسن في ${improvedCount} مؤشر${improvedCount > 1 ? 'ات' : ''} — ${adjustCount} مؤشر يحتاج متابعة`;
    if (adjustCount > 0)
      return `${adjustCount} مؤشر يحتاج تعديلًا في المسار`;
    return 'المؤشرات مستقرة مقارنةً بخط الأساس';
  }

  // Service effectiveness note (never claims medical outcome)
  function serviceNote() {
    if (ben.followUps.length === 0) return 'لا تتوفر بيانات متابعة بعد لتقييم أثر الخدمة.';
    if (ben.impactStatus === 'improved')
      return 'تظهر المتابعة تحسنًا في المؤشرات المرتبطة بالمسار.';
    if (ben.impactStatus === 'needs_adjustment')
      return 'تشير المتابعة إلى الحاجة لتعديل المسار أو تدخل إضافي.';
    return 'تشير المتابعة إلى استقرار الوضع مع استمرار المسار الحالي.';
  }

  return (
    <div className={styles.impactSummary} aria-label="ملخص تطور المستفيد">
      <h3 className={styles.impactSummaryTitle}>ملخص تطور المستفيد</h3>

      {/* ── 1. Horizontal checkpoint strip ── */}
      <div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 10 }}>
          مراحل المتابعة
        </div>
        <div className={styles.checkpointStrip} role="list" aria-label="مراحل المتابعة">
          {CHECKPOINT_LABELS.map((label, idx) => {
            const isBaseline = idx === 0;
            const fuIndex    = idx - 1; // follow-up 0 = 30 days, 1 = 3 months, 2 = 6 months
            const isDone     = isBaseline || fuIndex < ben.followUps.length;
            const cpStatus   = isBaseline ? 'done' : (isDone ? checkpointStatus(fuIndex) : null);
            const subLabel   = isBaseline
              ? ben.assessmentDate
              : isDone
                ? ben.followUps[fuIndex].date
                : 'لم يحن موعد المتابعة';

            return (
              <span key={label} style={{ display: 'flex', alignItems: 'flex-start' }} role="listitem">
                <span className={styles.checkpoint}>
                  <span
                    className={styles.checkpointDot}
                    data-done={String(isDone)}
                    data-status={cpStatus ?? ''}
                    aria-label={`${label}: ${isDone ? 'مكتملة' : 'لم تبدأ'}`}
                  >
                    {isDone ? '✓' : '○'}
                  </span>
                  <span className={styles.checkpointLabel} data-done={String(isDone)}>
                    {label}
                  </span>
                  <span className={styles.checkpointLabel} data-done={String(isDone)}
                    style={{ fontWeight: 400, fontSize: 10 }}>
                    {subLabel}
                  </span>
                </span>
                {idx < CHECKPOINT_LABELS.length - 1 && (
                  <span
                    className={styles.checkpointConnector}
                    data-done={String(isDone && fuIndex < ben.followUps.length - 1)}
                  />
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── 2. Metric-by-metric progress rows ── */}
      {compRows.length > 0 && (
        <div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>
            تطور المؤشرات: خط الأساس ← آخر متابعة
          </div>
          <div className={styles.metricProgressList}>
            {compRows.map((row) => (
              <div key={row.key} className={styles.metricProgressRow}>
                <span className={styles.metricProgressLabel}>{row.label}</span>
                <div className={styles.metricProgressValues}>
                  {/* Baseline pill */}
                  <span className={`${styles.metricVal} ${styles.metricValBaseline}`}>
                    {row.baseline}
                  </span>
                  {/* Each follow-up checkpoint */}
                  {row.checkpoints.map((cp, i) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span className={styles.metricArrow}>←</span>
                      <span className={styles.metricVal}>
                        {cp.value}{cp.unit ? ` ${cp.unit}` : ''}
                      </span>
                    </span>
                  ))}
                  {/* Status chip */}
                  <span className={styles.metricStatusChip} data-s={row.status}>
                    {row.status === 'improved' ? '↑ تحسن' : row.status === 'needs_adjustment' ? '⚠ يحتاج تعديل' : '→ مستقر'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {ben.followUps.length === 0 && (
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 6, fontStyle: 'italic' }}>
              لا تتوفر بيانات متابعة بعد — ستظهر مقارنة المؤشرات بعد أول متابعة.
            </p>
          )}
        </div>
      )}

      {/* ── 3. Overall impact + service connection ── */}
      <div className={styles.overallImpactCard}>
        {/* Impact status card */}
        <div className={styles.impactStatusCard} data-s={ben.impactStatus}>
          <span className={styles.impactStatusLabel}>حالة الأثر</span>
          <span className={styles.impactStatusValue}>{ben.impactLabel}</span>
          <span className={styles.impactStatusDesc}>{overallDesc()}</span>
        </div>

        {/* Service card */}
        <div className={styles.serviceCard}>
          <span className={styles.serviceCardLabel}>الخدمة الحالية</span>
          <span className={styles.serviceCardName}>{ben.serviceName}</span>
          <span className={styles.serviceCardQuestion}>هل أحدثت الخدمة فرقًا؟</span>
          <span className={styles.serviceCardAnswer}>{serviceNote()}</span>
        </div>
      </div>

      {/* ── 4. Next follow-up ── */}
      <div className={styles.nextFollowupCard}>
        <span className={styles.nextFollowupIcon} aria-hidden="true">📅</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span className={styles.nextFollowupLabel}>المتابعة القادمة</span>
          <span className={styles.nextFollowupValue}>
            {ben.nextFollowUp ?? 'لا يوجد موعد مجدول'}
          </span>
        </div>
      </div>

      {/* Mantra */}
      <p className={styles.summaryMantra}>
        وهج لا يكتفي بالتوصية؛ بل يقارن خط الأساس بالمتابعة لقياس الأثر وتحديد ما إذا كان المسار يجب أن يستمر أو يتغير.
      </p>
    </div>
  );
}

// ─── Beneficiary Detail Modal ─────────────────────────────────────────────────
function BeneficiaryModal({ ben, onClose }) {
  const compRows = buildComparisonRows(ben);
  const latest   = getLatestMetrics(ben);

  // Derive per-domain impact from the beneficiary's agent
  const agentImpactRows = [
    { id: ben.agentId, label: ben.agentLabel, baseline: 'انظر المؤشرات أدناه', current: ben.impactLabel, status: ben.impactStatus },
  ];

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <h2 id="modal-title" className={styles.modalTitle}>
              {ben.name} — {ben.beneficiaryId}
            </h2>
            <span className={styles.modalSubtitle}>
              بيانات تجريبية — لا تمثل مستفيدًا حقيقيًا
            </span>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose} aria-label="إغلاق">✕</button>
        </div>

        <div className={styles.modalBody}>
          {/* Meta row */}
          <div className={styles.metaRow}>
            {[
              { label: 'رقم المستفيد',      value: ben.beneficiaryId },
              { label: 'تاريخ التقييم',     value: ben.assessmentDate },
              { label: 'المجال الرئيسي',    value: ben.agentLabel },
              { label: 'الأولوية',           value: <Badge type={ben.priority} label={ben.priorityLabel} /> },
              { label: 'الخدمة',             value: ben.serviceName },
              { label: 'حالة المسار',        value: <Badge type={ben.serviceStatus} label={ben.serviceStatusLabel} /> },
              { label: 'آخر متابعة',         value: ben.lastFollowUp ?? 'لم تبدأ' },
              { label: 'المتابعة القادمة',   value: ben.nextFollowUp ?? 'لا يوجد' },
              { label: 'حالة الأثر',         value: <Badge type={ben.impactStatus} label={ben.impactLabel} /> },
            ].map((m) => (
              <div key={m.label} className={styles.metaItem}>
                <span className={styles.metaLabel}>{m.label}</span>
                <span className={styles.metaValue}>{m.value}</span>
              </div>
            ))}
          </div>

          {/* ── Impact Summary (new) ── */}
          <ImpactSummary ben={ben} />

          {/* ── A. Baseline ── */}
          <div className={styles.modalSection}>
            <h3 className={styles.modalSectionTitle}>أ — المؤشرات الأساسية (التقييم الأول)</h3>
            <div className={styles.baselineGrid}>
              {Object.entries(ben.baseline).map(([key, metric]) => (
                <div key={key} className={styles.baselineCard}>
                  <div className={styles.baselineMetricLabel}>{metric.label}</div>
                  <div className={styles.baselineMetricValue}>
                    {metric.value}{metric.unit ? ` ${metric.unit}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── B. Follow-up Timeline ── */}
          {ben.followUps.length > 0 && (
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>ب — سجل المتابعة الزمني</h3>
              <div className={styles.timeline}>
                {ben.followUps.map((fu, idx) => (
                  <div key={fu.id} className={styles.timelineEntry}>
                    <div className={styles.timelineLeft}>
                      <div className={styles.timelineDot} data-status={fu.status} />
                      {idx < ben.followUps.length - 1 && <div className={styles.timelineLine} />}
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineEntryTitle}>
                        <span>{fu.label}</span>
                        <span className={styles.timelineDate}>{fu.date}</span>
                      </div>

                      {/* Metrics chips */}
                      <div className={styles.timelineMetrics}>
                        {Object.entries(fu.metrics).map(([mk, mv]) => (
                          <span key={mk} className={styles.timelineMetricItem}>
                            {ben.baseline[mk]?.label ?? mk}: {mv.value}{mv.unit ? ` ${mv.unit}` : ''}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className={styles.timelineActions}>
                        الإجراءات المكتملة:
                        <div className={styles.timelineActionList}>
                          {fu.completedActions.map((a) => (
                            <span key={a} className={styles.timelineActionChip}>{a}</span>
                          ))}
                        </div>
                      </div>

                      {/* Response */}
                      <div className={styles.timelineResponse}>
                        💬 {fu.beneficiaryResponse}
                      </div>

                      {fu.notes && (
                        <div className={styles.timelineNotes}>ملاحظات: {fu.notes}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── C. Baseline vs Follow-up Comparison ── */}
          {compRows.length > 0 && ben.followUps.length > 0 && (
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>ج — مقارنة المؤشرات: الأساس vs المتابعة</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className={styles.compTable}>
                  <thead>
                    <tr>
                      <th>المؤشر</th>
                      <th>الأساس</th>
                      {ben.followUps.map((fu) => <th key={fu.id}>{fu.label}</th>)}
                      <th>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compRows.map((row) => (
                      <tr key={row.key}>
                        <td style={{ fontWeight: 600 }}>{row.label}</td>
                        <td>{row.baseline}</td>
                        {row.checkpoints.map((cp, i) => (
                          <td key={i}>{cp.value}{cp.unit ? ` ${cp.unit}` : ''}</td>
                        ))}
                        <td>
                          <span className={STATUS_CLASS[row.status] ?? ''}>
                            {STATUS_LABEL[row.status] ?? row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: 12, color: '#9B856D', marginTop: 8, fontStyle: 'italic' }}>
                * المقارنة مبنية على البيانات التجريبية فقط ولا تمثل نتائج سريرية.
              </p>
            </div>
          )}

          {/* ── D. Agent Impact View ── */}
          <div className={styles.modalSection}>
            <h3 className={styles.modalSectionTitle}>د — الأثر حسب المجال</h3>
            <div className={styles.agentImpactList}>
              {agentImpactRows.map((row) => (
                <div key={row.id} className={styles.agentImpactRow}>
                  <span className={styles.agentImpactName}>{row.label}</span>
                  <span className={styles.agentImpactBaseline}>
                    {Object.values(ben.baseline).map((m) => `${m.label}: ${m.value}`).join(' · ')}
                  </span>
                  <span className={styles.agentImpactArrow}>→</span>
                  <span className={styles.agentImpactCurrent} data-s={latest ? ben.impactStatus : 'not_started'}>
                    {latest ? ben.impactLabel : 'لم تبدأ المتابعة بعد'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── E. Attention alerts ── */}
          {ben.needsAttention.length > 0 && (
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle} style={{ color: '#9A4400' }}>
                ⚠️ تنبيهات تحتاج إجراء
              </h3>
              <div className={styles.attentionList}>
                {ben.needsAttention.map((msg, i) => (
                  <div key={i} className={styles.attentionItem}>
                    <span className={styles.attentionId}>{ben.beneficiaryId}</span>
                    <span className={styles.attentionMsg}>{msg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export function AdminImpactDashboard() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    period: 'كل الفترات',
    agent: 'الكل',
    priority: 'الكل',
    svcStatus: 'الكل',
    impactStatus: 'الكل',
    humanReview: 'الكل',
  });

  const [selectedBen, setSelectedBen] = useState(null);

  function handleFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  // Filter beneficiaries against active filters
  const filtered = DEMO_BENEFICIARIES.filter((b) => {
    if (filters.agent !== 'الكل' && !b.agentLabel.includes(filters.agent)) return false;
    if (filters.priority !== 'الكل' && b.priorityLabel !== filters.priority) return false;
    if (filters.svcStatus !== 'الكل' && b.serviceStatusLabel !== filters.svcStatus) return false;
    if (filters.impactStatus !== 'الكل' && b.impactLabel !== filters.impactStatus) return false;
    if (filters.humanReview === 'يحتاج مراجعة' && b.priority !== 'review' && b.priority !== 'safety') return false;
    if (filters.humanReview === 'لا يحتاج' && (b.priority === 'review' || b.priority === 'safety')) return false;
    return true;
  });

  // Beneficiaries that need attention
  const attentionCases = DEMO_BENEFICIARIES.filter((b) => b.needsAttention.length > 0);

  return (
    <div className={styles.page} dir="rtl" lang="ar">
      {/* Demo data warning */}
      <div className={styles.demoBanner} role="alert">
        ⚠️ بيانات تجريبية لأغراض النموذج الأولي — لا تمثّل مستفيدين حقيقيين أو إحصاءات مؤسسية
      </div>

      {/* Sticky header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <WahajLogo size="sm" />
            <div>
              <div className={styles.headerTitle}>لوحة الأثر والمتابعة</div>
              <div className={styles.headerSubtitle}>
                رصد تقدم المستفيدين من التقييم إلى الأثر الفعلي
              </div>
            </div>
          </div>
          <div className={styles.headerActions}>
            <span className={styles.demoBadge}>🔬 بيانات تجريبية</span>
            <button className={styles.navBtn} onClick={() => navigate('/dashboard')} aria-label="لوحة المؤشرات">
              📊 لوحة المؤشرات
            </button>
            <button className={styles.navBtn} onClick={() => navigate('/')} aria-label="الرئيسية">
              ← الرئيسية
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Page title */}
        <div>
          <h1 className={styles.pageTitle}>لوحة الأثر والمتابعة</h1>
          <p className={styles.pageSubtitle}>
            رصد تقدم المستفيدين من التقييم إلى الأثر الفعلي عبر الزمن
          </p>
        </div>

        {/* Mission strip */}
        <div className={styles.missionStrip}>
          وهج لا يتوقف عند التوصية؛ بل يتابع أثر التدخل بمرور الوقت.
          <div className={styles.missionFlow}>
            {['التقييم', 'الخدمة', 'المتابعة', 'الأثر', 'التعديل / الاستمرار / التصعيد'].map((s, i, arr) => (
              <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{s}</span>
                {i < arr.length - 1 && <span className={styles.missionArrow}>→</span>}
              </span>
            ))}
          </div>
        </div>

        {/* ══ SECTION 1 — Overview KPIs ══════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="impact-kpi-heading">
          <div className={styles.sectionHeader}>
            <h2 id="impact-kpi-heading" className={styles.sectionTitle}>المؤشرات الرئيسية</h2>
            <span className={styles.sectionNote}>بيانات تجريبية للنموذج الأولي</span>
          </div>
          <div className={styles.kpiGrid}>
            {IMPACT_OVERVIEW_KPIS.map((kpi) => <KpiCard key={kpi.id} kpi={kpi} />)}
          </div>
        </section>

        {/* ══ SECTION 2 — Needs Attention ════════════════════════════════════ */}
        {attentionCases.length > 0 && (
          <section className={styles.section} aria-labelledby="attention-heading">
            <h2 id="attention-heading" className={styles.sectionTitle}>
              ⚠️ يحتاج متابعة
            </h2>
            <div className={styles.attentionPanel}>
              <div className={styles.attentionTitle}>تنبيهات تحتاج إجراء من المسؤول</div>
              <div className={styles.attentionList}>
                {attentionCases.flatMap((b) =>
                  b.needsAttention.map((msg, i) => (
                    <div key={`${b.beneficiaryId}-${i}`} className={styles.attentionItem}>
                      <span className={styles.attentionId}>{b.beneficiaryId}</span>
                      <span className={styles.attentionMsg}>{msg}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {/* ══ SECTION 3 — Filters + Table ════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="table-heading">
          <h2 id="table-heading" className={styles.sectionTitle}>
            جدول المستفيدين والمتابعة
          </h2>
          <FilterBar filters={filters} onChange={handleFilter} />

          <div className={styles.tableWrapper}>
            <table className={styles.table} aria-label="جدول متابعة المستفيدين">
              <thead>
                <tr>
                  <th>رقم المستفيد</th>
                  <th>تاريخ التقييم</th>
                  <th>الأولوية</th>
                  <th>الخدمة الحالية</th>
                  <th>حالة المسار</th>
                  <th>آخر متابعة</th>
                  <th>المتابعة القادمة</th>
                  <th>حالة الأثر</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: '#9B856D', padding: 24 }}>
                      لا توجد نتائج تطابق الفلاتر المختارة
                    </td>
                  </tr>
                ) : filtered.map((b) => (
                  <tr
                    key={b.beneficiaryId}
                    onClick={() => setSelectedBen(b)}
                    title="انقر لعرض التفاصيل"
                  >
                    <td><span className={styles.beneficiaryId}>{b.beneficiaryId}</span></td>
                    <td>{b.assessmentDate}</td>
                    <td><Badge type={b.priority} label={b.priorityLabel} /></td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      title={b.serviceName}>{b.serviceName}</td>
                    <td><Badge type={b.serviceStatus} label={b.serviceStatusLabel} /></td>
                    <td>{b.lastFollowUp ?? '—'}</td>
                    <td>{b.nextFollowUp ?? '—'}</td>
                    <td><Badge type={b.impactStatus} label={b.impactLabel} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12, color: '#9B856D', textAlign: 'center' }}>
            انقر على أي صف لعرض التفاصيل الكاملة للمستفيد
          </p>
        </section>

        {/* ══ SECTION 4 — Agent impact summary ═══════════════════════════════ */}
        <section className={styles.section} aria-labelledby="agent-impact-heading">
          <div className={styles.sectionHeader}>
            <h2 id="agent-impact-heading" className={styles.sectionTitle}>الأثر حسب المجال</h2>
            <span className={styles.sectionNote}>نتائج تجريبية توضيحية</span>
          </div>
          <div className={styles.agentImpactList}>
            {[
              { id: 'health',        label: 'الصحة والأمراض المزمنة',  baseline: 'أمراض مزمنة، متابعة غير منتظمة',  current: 'مستقر',       status: 'stable'           },
              { id: 'physical',      label: 'النشاط والحركة',           baseline: '0–1 أيام نشاط/أسبوع',             current: 'تحسن → 3 أيام/أسبوع', status: 'improved'    },
              { id: 'psychological', label: 'الرفاه النفسي',             baseline: 'توتر، وضوح منخفض',                current: 'تحسن — اكتمل البرنامج', status: 'improved'  },
              { id: 'social',        label: 'الحياة الاجتماعية',         baseline: 'دائرة اجتماعية محدودة',            current: 'مستقر — في تحسن', status: 'stable'         },
              { id: 'financial',     label: 'الاستقرار المالي',           baseline: 'وضع مالي غير واضح، ديون',         current: 'يحتاج تعديل — تصعيد', status: 'needs_adjustment' },
              { id: 'experience',    label: 'الخبرة والهدف',             baseline: 'انخراط منخفض بعد التقاعد',         current: 'مستقر — بدأ التوجيه', status: 'stable'     },
            ].map((row) => (
              <div key={row.id} className={styles.agentImpactRow}>
                <span className={styles.agentImpactName}>{row.label}</span>
                <span className={styles.agentImpactBaseline}>{row.baseline}</span>
                <span className={styles.agentImpactArrow}>→</span>
                <span className={styles.agentImpactCurrent} data-s={row.status}>{row.current}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--color-border)',
        padding: 'var(--space-5) var(--space-6)',
        textAlign: 'center',
        fontSize: 12,
        color: '#9B856D',
      }}>
        وهج — لوحة الأثر والمتابعة | نموذج أولي © {new Date().getFullYear()} |{' '}
        جميع البيانات تجريبية ولا تمثل مستفيدين أو نتائج حقيقية
      </footer>

      {/* Detail modal */}
      {selectedBen && (
        <BeneficiaryModal ben={selectedBen} onClose={() => setSelectedBen(null)} />
      )}
    </div>
  );
}
