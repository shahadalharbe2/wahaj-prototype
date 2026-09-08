/**
 * Wahaj Admin Dashboard — Demo Analytics Data
 *
 * ALL DATA IN THIS FILE IS SYNTHETIC / FABRICATED FOR PROTOTYPE PURPOSES.
 * It does NOT represent real GOSI statistics, real beneficiary outcomes,
 * or real clinical/financial results. It is used solely to demonstrate
 * the Wahaj KPI measurement concept to judges and decision-makers.
 */

// ─── Top-level KPIs ──────────────────────────────────────────────────────────
export const TOP_KPIS = [
  {
    id: 'total',
    label: 'إجمالي المستفيدين',
    value: 1248,
    display: '1,248',
    icon: '👥',
    variant: 'neutral',
  },
  {
    id: 'assessment_completed',
    label: 'أكملوا تقييم وهج 360°',
    value: 1086,
    display: '1,086',
    sub: '87٪ من المستفيدين',
    icon: '✅',
    variant: 'brand',
  },
  {
    id: 'service_started',
    label: 'بدأوا خدمة مقترحة',
    value: 824,
    display: '824',
    sub: '76٪ من المؤهلين',
    icon: '🚀',
    variant: 'green',
  },
  {
    id: 'active_paths',
    label: 'مستفيدون نشطون في المسارات',
    value: 697,
    display: '697',
    icon: '📍',
    variant: 'blue',
  },
  {
    id: 'plan_completed',
    label: 'أكملوا خطة التنفيذ',
    value: 512,
    display: '512',
    icon: '🏁',
    variant: 'green',
  },
  {
    id: 'adherence',
    label: 'نسبة الالتزام بالخدمات',
    value: 74,
    display: '74٪',
    icon: '📊',
    variant: 'brand',
  },
  {
    id: 'human_review',
    label: 'حالات Human Review',
    value: 136,
    display: '136',
    icon: '👤',
    variant: 'orange',
  },
  {
    id: 'safety_escalation',
    label: 'حالات Safety Escalation',
    value: 22,
    display: '22',
    icon: '🔴',
    variant: 'red',
  },
  {
    id: 'improvement',
    label: 'مستفيدون أظهروا تحسنًا',
    value: 68,
    display: '68٪',
    icon: '📈',
    variant: 'green',
  },
];

// ─── Service utilization per agent ───────────────────────────────────────────
export const SERVICE_UTILIZATION = [
  { id: 'physical',      label: 'النشاط والحركة',                    count: 312, max: 400, color: '#3A7D44' },
  { id: 'health',        label: 'الصحة والأمراض المزمنة',             count: 245, max: 400, color: '#D64E4E' },
  { id: 'experience',    label: 'استثمار الخبرة بعد التقاعد',         count: 206, max: 400, color: '#B05E35' },
  { id: 'psychological', label: 'الرفاه النفسي والانتقال للتقاعد',   count: 168, max: 400, color: '#7C5CD8' },
  { id: 'social',        label: 'الحياة الاجتماعية',                  count: 142, max: 400, color: '#2472BC' },
  { id: 'financial',     label: 'الاستعداد المالي',                   count: 119, max: 400, color: '#B07D0A' },
];

// ─── Conversion funnel ───────────────────────────────────────────────────────
export const FUNNEL_STAGES = [
  { id: 'recommendation', label: 'التوصية',                            pct: 100, count: 1086 },
  { id: 'presented',      label: 'تم عرض الخدمة',                     pct: 92,  count: 999  },
  { id: 'started',        label: 'بدأ الخدمة',                         pct: 76,  count: 825  },
  { id: 'first_step',     label: 'أكمل أول خطوة',                      pct: 69,  count: 749  },
  { id: 'continued',      label: 'استمر في المسار',                    pct: 61,  count: 663  },
  { id: 'followup',       label: 'أكمل المتابعة',                      pct: 54,  count: 587  },
  { id: 'outcome',        label: 'تحسن / حقق الهدف',                   pct: 68,  count: 399, note: '68٪ من الذين أكملوا المتابعة' },
];

// ─── Physical / Mobility agent deep-dive ─────────────────────────────────────
export const PHYSICAL_KPI = {
  recommended:   312,
  started:       248,
  choseService:  221,
  firstVisit:    198,
  first5Days:    174,
  continuing:    153,
  adherencePct:  70,
  baseline:      1.2,
  followup:      3.1,
  improvement:   '+1.9 يوم أسبوعيًا',
  unit:          'أيام نشاط أسبوعية (متوسط)',
};

// ─── Per-agent KPIs ───────────────────────────────────────────────────────────
export const AGENT_KPIS = [
  {
    id: 'health',
    label: 'الصحة والأمراض المزمنة',
    color: '#D64E4E',
    icon: '🏥',
    stats: [
      { label: 'تم تحليلهم',                       value: '1,086' },
      { label: 'تم رصد أولويات وقائية',             value: '418' },
      { label: 'حالات Human Review',                value: '68' },
      { label: 'أكملوا المتابعة الصحية',            value: '312' },
    ],
  },
  {
    id: 'physical',
    label: 'النشاط والحركة',
    color: '#3A7D44',
    icon: '🏃',
    stats: [
      { label: 'رُصد لديهم ضعف نشاط',              value: '389' },
      { label: 'بدأوا مسار النشاط',                value: '248' },
      { label: 'نسبة الالتزام',                    value: '70٪' },
      { label: 'تحسن في المتابعة',                 value: '62٪' },
    ],
  },
  {
    id: 'psychological',
    label: 'الرفاه النفسي',
    color: '#7C5CD8',
    icon: '🧠',
    stats: [
      { label: 'رُصد لديهم احتياج دعم نفسي',       value: '214' },
      { label: 'بدأوا مسار التكيف',                value: '168' },
      { label: 'أكملوا المتابعة',                  value: '121' },
      { label: 'حالات Human Review',               value: '31' },
    ],
  },
  {
    id: 'social',
    label: 'الحياة الاجتماعية',
    color: '#2472BC',
    icon: '🤝',
    stats: [
      { label: 'رُصدت لديهم فرص مشاركة',           value: '198' },
      { label: 'بدأوا مسار المجتمع',               value: '142' },
      { label: 'أكملوا أول خطوة',                  value: '118' },
      { label: 'مستمرون',                          value: '97' },
    ],
  },
  {
    id: 'financial',
    label: 'الاستعداد المالي',
    color: '#B07D0A',
    icon: '💰',
    stats: [
      { label: 'رُصد احتياج للإرشاد المالي',        value: '156' },
      { label: 'بدأوا مسار الإرشاد الرسمي',        value: '119' },
      { label: 'إحالات لمختص',                     value: '38' },
      { label: 'أكملوا المتابعة',                  value: '82' },
    ],
  },
  {
    id: 'experience',
    label: 'استثمار الخبرة',
    color: '#B05E35',
    icon: '⭐',
    stats: [
      { label: 'رُصدت لديهم فرص للاستفادة',        value: '267' },
      { label: 'مسار التوجيه والإرشاد',            value: '91' },
      { label: 'مسار الاستشارات',                  value: '64' },
      { label: 'مسار التطوع والعمل المرن',         value: '51' },
    ],
  },
];

// ─── Risk / Priority distribution ────────────────────────────────────────────
export const PRIORITY_DIST = [
  { id: 'safety',    label: 'Safety Priority',    count: 22,  color: '#D64E4E', emoji: '🔴' },
  { id: 'review',    label: 'Human Review',        count: 136, color: '#E8873D', emoji: '🟠' },
  { id: 'preventive',label: 'Preventive Priority', count: 418, color: '#B07D0A', emoji: '🟡' },
  { id: 'opportunity',label: 'Opportunity',        count: 386, color: '#2472BC', emoji: '🔵' },
  { id: 'maintain',  label: 'Maintain & Monitor',  count: 286, color: '#3A7D44', emoji: '🟢' },
];

// ─── Human-in-the-loop KPI ────────────────────────────────────────────────────
export const HITL_KPI = {
  totalScreened:   1248,
  humanReview:     136,
  safetyEscalated: 22,
  pct:             '10.9٪',
};

// ─── Impact measurement ───────────────────────────────────────────────────────
export const IMPACT_KPIS = [
  { label: 'تحسن النشاط البدني',                   pct: 68, color: '#3A7D44' },
  { label: 'تحسن وضوح الروتين بعد التقاعد',        pct: 61, color: '#7C5CD8' },
  { label: 'زيادة المشاركة الاجتماعية',            pct: 57, color: '#2472BC' },
  { label: 'تحسن وضوح الاستعداد المالي',            pct: 52, color: '#B07D0A' },
  { label: 'بدأوا فرصة للاستفادة من الخبرة',       pct: 64, color: '#B05E35' },
];

// ─── Follow-up status ─────────────────────────────────────────────────────────
export const FOLLOWUP_STATUS = [
  { label: 'متابعة 30 يوم',           count: 720, color: '#2472BC' },
  { label: 'متابعة 90 يوم',           count: 438, color: '#3A7D44' },
  { label: 'بانتظار إعادة التقييم',   count: 282, color: '#B07D0A' },
  { label: 'مكتمل',                   count: 301, color: '#3A7D44' },
  { label: 'يحتاج تعديل المسار',      count: 87,  color: '#E8873D' },
  { label: 'تمت إعادة التوجيه',       count: 41,  color: '#7C5CD8' },
  { label: 'تمت الإحالة لمختص',       count: 22,  color: '#D64E4E' },
];

// ─── Recent follow-up table ───────────────────────────────────────────────────
export const RECENT_CASES = [
  { id: 'WAH-1042', path: 'النشاط والحركة',           status: 'نشط',              pct: 80, followup: '2025-02-10', priority: 'وقائية' },
  { id: 'WAH-1178', path: 'الصحة',                    status: 'يحتاج مراجعة',    pct: 45, followup: '2025-01-28', priority: 'Human Review' },
  { id: 'WAH-0893', path: 'الرفاه النفسي',            status: 'مكتمل',            pct: 100,followup: '2025-01-15', priority: 'وقائية' },
  { id: 'WAH-1301', path: 'استثمار الخبرة',           status: 'نشط',              pct: 60, followup: '2025-02-18', priority: 'فرصة' },
  { id: 'WAH-0674', path: 'الاستعداد المالي',         status: 'إحالة لمختص',      pct: 30, followup: '2025-01-20', priority: 'Safety' },
  { id: 'WAH-1512', path: 'الحياة الاجتماعية',        status: 'نشط',              pct: 55, followup: '2025-02-25', priority: 'فرصة' },
  { id: 'WAH-0731', path: 'النشاط والحركة',           status: 'بانتظار التقييم', pct: 90, followup: '2025-03-01', priority: 'متابعة' },
  { id: 'WAH-1089', path: 'الصحة',                    status: 'نشط',              pct: 70, followup: '2025-02-14', priority: 'وقائية' },
];

// ─── Filter options ───────────────────────────────────────────────────────────
export const FILTER_OPTIONS = {
  period:    ['كل الفترات', 'آخر 30 يوم', 'آخر 90 يوم', 'آخر 6 أشهر'],
  phase:     ['الكل', 'قبل التقاعد', 'بعد التقاعد'],
  agent:     ['الكل', 'الصحة', 'النشاط والحركة', 'الرفاه النفسي', 'الحياة الاجتماعية', 'الاستعداد المالي', 'استثمار الخبرة'],
  priority:  ['الكل', 'Safety', 'Human Review', 'وقائية', 'فرصة', 'متابعة'],
  svcStatus: ['الكل', 'نشط', 'مكتمل', 'بانتظار التقييم', 'يحتاج تعديل', 'إحالة'],
  followup:  ['الكل', 'ضمن الجدول', 'متأخر', 'مكتمل'],
};
