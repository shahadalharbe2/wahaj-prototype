/**
 * Wahaj Admin Impact & Follow-up Dashboard — Demo Data
 *
 * ALL DATA IN THIS FILE IS SYNTHETIC / FABRICATED FOR PROTOTYPE PURPOSES.
 * It does NOT represent real GOSI beneficiaries, real clinical outcomes,
 * or real programme statistics.
 *
 * Structure per beneficiary record:
 * {
 *   beneficiaryId      — anonymised display ID
 *   name               — first name or code (demo only)
 *   assessmentDate     — ISO date string
 *   agentId            — primary agent domain
 *   priority           — 'safety' | 'review' | 'preventive' | 'opportunity' | 'maintain'
 *   serviceId          — service identifier
 *   serviceName        — human-readable Arabic name
 *   serviceStatus      — 'not_started' | 'started' | 'in_progress' | 'completed' | 'needs_adjustment' | 'escalated'
 *   lastFollowUp       — ISO date string
 *   nextFollowUp       — ISO date string
 *   impactStatus       — 'improved' | 'stable' | 'needs_adjustment'
 *   needsAttention     — string[] — alert messages
 *   baseline           — { [metricKey]: { label, value, unit } }
 *   followUps          — FollowUp[]
 * }
 *
 * FollowUp: { id, label, date, metrics, completedActions, beneficiaryResponse, status, notes }
 */

// ─── Shared metric definitions ────────────────────────────────────────────────
// Each metric: { label (AR), value, unit, direction: 'higher_better' | 'lower_better' }

export const DEMO_BENEFICIARIES = [
  // ── 1 — سالم ────────────────────────────────────────────────────────────────
  {
    beneficiaryId: 'WAH-1042',
    name: 'سالم',
    assessmentDate: '2024-10-01',
    agentId: 'physical',
    agentLabel: 'النشاط والحركة',
    priority: 'preventive',
    priorityLabel: 'وقائية',
    serviceId: 'physical_gradual_activity',
    serviceName: 'برنامج نشاط تدريجي مناسب للحالة الصحية',
    serviceStatus: 'in_progress',
    serviceStatusLabel: 'قيد التنفيذ',
    lastFollowUp: '2025-01-05',
    nextFollowUp: '2025-02-05',
    impactStatus: 'improved',
    impactLabel: 'تحسن',
    needsAttention: [],
    baseline: {
      physical_activity: { label: 'النشاط البدني (أيام/أسبوع)', value: 0,         unit: 'أيام', direction: 'higher_better' },
      social_interaction:{ label: 'التواصل الاجتماعي',           value: 'محدود',  unit: '',     direction: 'higher_better' },
      routine_clarity:   { label: 'وضوح الروتين اليومي',          value: 'منخفض', unit: '',     direction: 'higher_better' },
      health_followup:   { label: 'متابعة الصحة',                 value: 'غير منتظمة', unit: '', direction: 'higher_better' },
    },
    followUps: [
      {
        id: 'fu-1042-1',
        label: 'متابعة 30 يومًا',
        date: '2024-11-01',
        metrics: {
          physical_activity: { value: 2,           unit: 'أيام' },
          social_interaction:{ value: 'شهري',       unit: '' },
          routine_clarity:   { value: 'متوسط',      unit: '' },
          health_followup:   { value: 'موعد محجوز', unit: '' },
        },
        completedActions: ['اختار ناديًا رياضيًا', 'أكمل أول 5 أيام', 'حجز موعد طبي'],
        beneficiaryResponse: 'يشعر بتحسن في الطاقة اليومية',
        status: 'in_progress',
        notes: 'الالتزام جيد، ينصح بالاستمرار',
      },
      {
        id: 'fu-1042-2',
        label: 'متابعة 3 أشهر',
        date: '2025-01-05',
        metrics: {
          physical_activity: { value: 3,            unit: 'أيام' },
          social_interaction:{ value: 'أسبوعي',     unit: '' },
          routine_clarity:   { value: 'جيد',         unit: '' },
          health_followup:   { value: 'مكتمل',       unit: '' },
        },
        completedActions: ['أكمل 12 أسبوعًا من البرنامج', 'أجرى الفحص الدوري', 'انضم لمجموعة رياضية'],
        beneficiaryResponse: 'تحسن ملحوظ في المزاج والنشاط',
        status: 'improved',
        notes: 'يُنصح بالاستمرار والانتقال لمرحلة الصيانة',
      },
    ],
  },

  // ── 2 — مستفيد 002 ──────────────────────────────────────────────────────────
  {
    beneficiaryId: 'WAH-1178',
    name: 'مستفيد 002',
    assessmentDate: '2024-10-14',
    agentId: 'health',
    agentLabel: 'الصحة والأمراض المزمنة',
    priority: 'review',
    priorityLabel: 'Human Review',
    serviceId: 'health_chronic_monitoring',
    serviceName: 'برنامج المتابعة الدورية للأمراض المزمنة',
    serviceStatus: 'escalated',
    serviceStatusLabel: 'تم التصعيد لمختص',
    lastFollowUp: '2024-12-20',
    nextFollowUp: '2025-01-28',
    impactStatus: 'needs_adjustment',
    impactLabel: 'يحتاج تعديل',
    needsAttention: ['الحالة تحتاج Human Review — تم التصعيد للمختص'],
    baseline: {
      chronic_conditions: { label: 'أمراض مزمنة مُبلَّغ عنها', value: 'ضغط دم، سكري', unit: '',         direction: 'lower_better' },
      medication_adherence:{ label: 'الالتزام بالدواء',          value: 'غير منتظم',     unit: '',         direction: 'higher_better' },
      medical_checkups:   { label: 'الفحوصات الدورية',           value: 0,               unit: 'في السنة', direction: 'higher_better' },
      physical_activity:  { label: 'النشاط البدني',              value: 'منعدم',         unit: '',         direction: 'higher_better' },
    },
    followUps: [
      {
        id: 'fu-1178-1',
        label: 'متابعة 30 يومًا',
        date: '2024-11-14',
        metrics: {
          chronic_conditions: { value: 'مستقرة',      unit: '' },
          medication_adherence:{ value: 'منتظم أحيانًا', unit: '' },
          medical_checkups:   { value: 1,              unit: 'في السنة' },
          physical_activity:  { value: 'خفيف',         unit: '' },
        },
        completedActions: ['زيارة طبيب الأسرة'],
        beneficiaryResponse: 'صعوبة في الالتزام',
        status: 'needs_adjustment',
        notes: 'يحتاج دعمًا إضافيًا وربما مراجعة مختص',
      },
    ],
  },

  // ── 3 — مستفيد 003 ──────────────────────────────────────────────────────────
  {
    beneficiaryId: 'WAH-0893',
    name: 'مستفيد 003',
    assessmentDate: '2024-09-20',
    agentId: 'psychological',
    agentLabel: 'الرفاه النفسي',
    priority: 'preventive',
    priorityLabel: 'وقائية',
    serviceId: 'psych_transition_support',
    serviceName: 'برنامج التكيف النفسي مع مرحلة التقاعد',
    serviceStatus: 'completed',
    serviceStatusLabel: 'مكتمل',
    lastFollowUp: '2025-01-10',
    nextFollowUp: null,
    impactStatus: 'improved',
    impactLabel: 'تحسن',
    needsAttention: [],
    baseline: {
      mood:              { label: 'الحالة المزاجية',          value: 'متوترة',    unit: '',    direction: 'higher_better' },
      purpose_clarity:   { label: 'وضوح الهدف بعد التقاعد',    value: 'منخفض',    unit: '',    direction: 'higher_better' },
      social_support:    { label: 'الدعم الاجتماعي',            value: 'محدود',    unit: '',    direction: 'higher_better' },
      sleep_quality:     { label: 'جودة النوم',                 value: 'سيئة',     unit: '',    direction: 'higher_better' },
    },
    followUps: [
      {
        id: 'fu-0893-1',
        label: 'متابعة 30 يومًا',
        date: '2024-10-20',
        metrics: {
          mood:            { value: 'مستقرة',   unit: '' },
          purpose_clarity: { value: 'متوسط',    unit: '' },
          social_support:  { value: 'متوسط',    unit: '' },
          sleep_quality:   { value: 'متوسطة',   unit: '' },
        },
        completedActions: ['جلستان مع مرشد التقاعد', 'مشاركة في مجموعة دعم'],
        beneficiaryResponse: 'شعور أفضل بعد الجلسات',
        status: 'in_progress',
        notes: 'تقدم واضح، يُنصح بالاستمرار',
      },
      {
        id: 'fu-0893-2',
        label: 'متابعة 3 أشهر',
        date: '2025-01-10',
        metrics: {
          mood:            { value: 'إيجابية',  unit: '' },
          purpose_clarity: { value: 'واضح',     unit: '' },
          social_support:  { value: 'جيد',      unit: '' },
          sleep_quality:   { value: 'جيدة',     unit: '' },
        },
        completedActions: ['أكمل البرنامج الكامل', 'انضم لنادي المتقاعدين المحلي'],
        beneficiaryResponse: 'راضٍ جداً، يشعر باستعداد للمرحلة الجديدة',
        status: 'completed',
        notes: 'مكتمل بنجاح',
      },
    ],
  },

  // ── 4 — مستفيد 004 ──────────────────────────────────────────────────────────
  {
    beneficiaryId: 'WAH-1301',
    name: 'مستفيد 004',
    assessmentDate: '2024-11-03',
    agentId: 'experience',
    agentLabel: 'الخبرة والهدف',
    priority: 'opportunity',
    priorityLabel: 'فرصة',
    serviceId: 'experience_mentoring',
    serviceName: 'برنامج التوجيه والإرشاد — مشاركة الخبرة',
    serviceStatus: 'started',
    serviceStatusLabel: 'بدأ',
    lastFollowUp: '2024-12-03',
    nextFollowUp: '2025-02-03',
    impactStatus: 'stable',
    impactLabel: 'مستقر',
    needsAttention: ['لم يتم تسجيل متابعة خلال 30 يومًا'],
    baseline: {
      years_experience: { label: 'سنوات الخبرة المهنية',    value: 28,         unit: 'سنة',  direction: 'higher_better' },
      mentoring_desire: { label: 'رغبة في التوجيه',          value: 'عالية',   unit: '',      direction: 'higher_better' },
      engagement:       { label: 'مستوى الانخراط بعد التقاعد', value: 'منخفض', unit: '',      direction: 'higher_better' },
    },
    followUps: [
      {
        id: 'fu-1301-1',
        label: 'متابعة 30 يومًا',
        date: '2024-12-03',
        metrics: {
          years_experience: { value: 28,         unit: 'سنة' },
          mentoring_desire: { value: 'عالية',    unit: '' },
          engagement:       { value: 'متوسط',    unit: '' },
        },
        completedActions: ['تسجيل في منصة التوجيه', 'أول لقاء توجيه'],
        beneficiaryResponse: 'متحمس جداً للمشاركة',
        status: 'started',
        notes: 'يحتاج متابعة أوثق في الشهر القادم',
      },
    ],
  },

  // ── 5 — مستفيد 005 ──────────────────────────────────────────────────────────
  {
    beneficiaryId: 'WAH-0674',
    name: 'مستفيد 005',
    assessmentDate: '2024-10-25',
    agentId: 'financial',
    agentLabel: 'الاستقرار المالي',
    priority: 'safety',
    priorityLabel: 'Safety',
    serviceId: 'financial_guidance',
    serviceName: 'مسار الإرشاد المالي الرسمي',
    serviceStatus: 'escalated',
    serviceStatusLabel: 'تم التصعيد لمختص',
    lastFollowUp: '2024-12-10',
    nextFollowUp: '2025-01-20',
    impactStatus: 'needs_adjustment',
    impactLabel: 'يحتاج تعديل',
    needsAttention: ['الحالة تحتاج Human Review', 'تم التصعيد لمختص مالي'],
    baseline: {
      retirement_income:  { label: 'وضوح دخل التقاعد',     value: 'غير واضح',  unit: '',    direction: 'higher_better' },
      financial_plan:     { label: 'خطة مالية',              value: 'غير موجودة', unit: '',   direction: 'higher_better' },
      debt_status:        { label: 'وضع الديون',             value: 'توجد ديون', unit: '',    direction: 'lower_better' },
    },
    followUps: [
      {
        id: 'fu-0674-1',
        label: 'متابعة 30 يومًا',
        date: '2024-11-25',
        metrics: {
          retirement_income: { value: 'قيد المراجعة',  unit: '' },
          financial_plan:    { value: 'بدأ التخطيط',   unit: '' },
          debt_status:       { value: 'قيد الإدارة',   unit: '' },
        },
        completedActions: ['اجتماع مع مستشار مالي', 'طلب مراجعة الراتب التقاعدي'],
        beneficiaryResponse: 'قلق لكن ملتزم',
        status: 'escalated',
        notes: 'تم إحالته لمختص مالي معتمد',
      },
    ],
  },

  // ── 6 — مستفيد 006 ──────────────────────────────────────────────────────────
  {
    beneficiaryId: 'WAH-1512',
    name: 'مستفيد 006',
    assessmentDate: '2024-11-15',
    agentId: 'social',
    agentLabel: 'الحياة الاجتماعية',
    priority: 'opportunity',
    priorityLabel: 'فرصة',
    serviceId: 'social_community',
    serviceName: 'برنامج المشاركة المجتمعية',
    serviceStatus: 'in_progress',
    serviceStatusLabel: 'قيد التنفيذ',
    lastFollowUp: '2025-01-01',
    nextFollowUp: '2025-02-15',
    impactStatus: 'stable',
    impactLabel: 'مستقر',
    needsAttention: [],
    baseline: {
      social_circle:    { label: 'الدائرة الاجتماعية',       value: 'محدودة جداً', unit: '',    direction: 'higher_better' },
      community_engage: { label: 'المشاركة المجتمعية',       value: 'منعدمة',      unit: '',    direction: 'higher_better' },
      family_relations: { label: 'العلاقات الأسرية',          value: 'جيدة',        unit: '',    direction: 'higher_better' },
    },
    followUps: [
      {
        id: 'fu-1512-1',
        label: 'متابعة 30 يومًا',
        date: '2024-12-15',
        metrics: {
          social_circle:    { value: 'بدأت تتسع',  unit: '' },
          community_engage: { value: 'شهري',        unit: '' },
          family_relations: { value: 'جيدة',        unit: '' },
        },
        completedActions: ['انضم لنادي محلي', 'حضر فعالية مجتمعية'],
        beneficiaryResponse: 'يستمتع بالتواصل مع الآخرين',
        status: 'in_progress',
        notes: 'تقدم إيجابي',
      },
      {
        id: 'fu-1512-2',
        label: 'متابعة 3 أشهر',
        date: '2025-01-01',
        metrics: {
          social_circle:    { value: 'متوسطة',  unit: '' },
          community_engage: { value: 'أسبوعي',  unit: '' },
          family_relations: { value: 'جيدة',    unit: '' },
        },
        completedActions: ['عضوية نادي المتقاعدين', 'مجموعة رحلات شهرية'],
        beneficiaryResponse: 'راضٍ عن التواصل الاجتماعي',
        status: 'improved',
        notes: 'مستمر في التحسن',
      },
    ],
  },

  // ── 7 — مستفيد 007 ──────────────────────────────────────────────────────────
  {
    beneficiaryId: 'WAH-0731',
    name: 'مستفيد 007',
    assessmentDate: '2024-12-01',
    agentId: 'physical',
    agentLabel: 'النشاط والحركة',
    priority: 'preventive',
    priorityLabel: 'وقائية',
    serviceId: 'physical_walking',
    serviceName: 'برنامج المشي اليومي المُنظَّم',
    serviceStatus: 'not_started',
    serviceStatusLabel: 'لم يبدأ',
    lastFollowUp: null,
    nextFollowUp: '2025-01-20',
    impactStatus: 'stable',
    impactLabel: 'مستقر',
    needsAttention: ['لم يبدأ المستفيد الخدمة خلال 14 يومًا — يحتاج تواصلًا'],
    baseline: {
      physical_activity:  { label: 'النشاط البدني (أيام/أسبوع)', value: 1,         unit: 'أيام',  direction: 'higher_better' },
      stamina:            { label: 'القدرة على التحمل',            value: 'منخفضة', unit: '',       direction: 'higher_better' },
    },
    followUps: [],
  },
];

// ─── Aggregated overview KPIs (derived from DEMO_BENEFICIARIES) ───────────────
export const IMPACT_OVERVIEW_KPIS = [
  { id: 'total',           label: 'إجمالي المستفيدين',    value: 7,  display: '7',  icon: '👥', variant: 'neutral' },
  { id: 'assessed',        label: 'أكملوا التقييم',       value: 7,  display: '7',  icon: '✅', variant: 'brand' },
  { id: 'started',         label: 'بدأوا الخدمة',         value: 6,  display: '6',  icon: '🚀', variant: 'green' },
  { id: 'active',          label: 'مسارات نشطة',          value: 4,  display: '4',  icon: '📍', variant: 'blue' },
  { id: 'attention',       label: 'يحتاج متابعة',         value: 3,  display: '3',  icon: '⚠️', variant: 'orange' },
  { id: 'improved',        label: 'تحسن',                  value: 3,  display: '3',  icon: '📈', variant: 'green' },
  { id: 'adjustment',      label: 'يحتاج تعديل',          value: 2,  display: '2',  icon: '🔄', variant: 'orange' },
  { id: 'human_review',    label: 'Human Review',          value: 2,  display: '2',  icon: '👤', variant: 'orange' },
  { id: 'escalated',       label: 'Human Escalation',      value: 2,  display: '2',  icon: '🔴', variant: 'red' },
];

// ─── Filter option lists ──────────────────────────────────────────────────────
export const IMPACT_FILTER_OPTIONS = {
  period:      ['كل الفترات', 'آخر 30 يوم', 'آخر 3 أشهر', 'آخر 6 أشهر'],
  agent:       ['الكل', 'الصحة', 'النشاط والحركة', 'الرفاه النفسي', 'الحياة الاجتماعية', 'الاستقرار المالي', 'الخبرة والهدف'],
  priority:    ['الكل', 'Safety', 'Human Review', 'وقائية', 'فرصة', 'متابعة'],
  svcStatus:   ['الكل', 'لم يبدأ', 'بدأ', 'قيد التنفيذ', 'مكتمل', 'يحتاج تعديل', 'تم التصعيد'],
  impactStatus:['الكل', 'تحسن', 'مستقر', 'يحتاج تعديل'],
  humanReview: ['الكل', 'يحتاج مراجعة', 'لا يحتاج'],
};
