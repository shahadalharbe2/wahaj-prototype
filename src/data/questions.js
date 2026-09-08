/**
 * Wahaj 360° Assessment — Questions Data
 *
 * type: 'single'  — radio-style, exactly one answer
 *       'multi'   — checkbox-style, one or more answers
 *       'single-with-text' — single select + optional freetext
 *
 * domain: which Wahaj agent(s) this question feeds.
 *   Matches the six specialized agents + 'overall'.
 */

export const QUESTIONS = [
  // ─── Health ──────────────────────────────────────────────────────────────
  {
    id: 1,
    domain: ['health'],
    type: 'single',
    required: true,
    text: 'كيف تقيّم صحتك بشكل عام؟',
    options: [
      { value: 'excellent',  label: 'ممتازة' },
      { value: 'very_good',  label: 'جيدة جدًا' },
      { value: 'good',       label: 'جيدة' },
      { value: 'fair',       label: 'مقبولة' },
      { value: 'poor',       label: 'ضعيفة' },
    ],
  },
  {
    id: 2,
    domain: ['health'],
    type: 'multi',
    required: true,
    text: 'هل لديك أي من الحالات الصحية التالية؟',
    hint: 'يمكنك اختيار أكثر من إجابة',
    exclusiveValue: 'none',   // selecting this deselects everything else
    options: [
      { value: 'none',        label: 'لا توجد' },
      { value: 'diabetes',    label: 'السكري' },
      { value: 'hypertension',label: 'ارتفاع ضغط الدم' },
      { value: 'heart',       label: 'أمراض القلب' },
      { value: 'cholesterol', label: 'ارتفاع الدهون أو الكوليسترول' },
      { value: 'respiratory', label: 'أمراض تنفسية' },
      { value: 'joints',      label: 'مشكلات المفاصل أو العظام' },
      { value: 'other',       label: 'أخرى' },
    ],
  },
  {
    id: 3,
    domain: ['health'],
    type: 'single',
    required: true,
    text: 'إلى أي مدى تلتزم بالأدوية والفحوصات والمواعيد الطبية الموصى بها لك؟',
    options: [
      { value: 'always',       label: 'دائمًا' },
      { value: 'usually',      label: 'غالبًا' },
      { value: 'sometimes',    label: 'أحيانًا' },
      { value: 'rarely',       label: 'نادرًا' },
      { value: 'not_applicable', label: 'لا ينطبق عليّ' },
    ],
  },

  // ─── Physical & Mobility ─────────────────────────────────────────────────
  {
    id: 4,
    domain: ['physical'],
    type: 'single',
    required: true,
    text: 'كم يومًا في الأسبوع تمارس نشاطًا بدنيًا مثل المشي أو الرياضة؟',
    options: [
      { value: 'none',    label: 'لا أمارس نشاطًا حاليًا' },
      { value: '1_2',     label: 'يوم إلى يومين' },
      { value: '3_4',     label: '3 إلى 4 أيام' },
      { value: '5_plus',  label: '5 أيام أو أكثر' },
    ],
  },
  {
    id: 5,
    domain: ['physical'],
    type: 'single',
    required: true,
    text: 'هل تواجه صعوبة في المشي أو صعود الدرج أو التوازن أو أداء أنشطتك اليومية؟',
    options: [
      { value: 'none',      label: 'لا أواجه صعوبة' },
      { value: 'mild',      label: 'صعوبة بسيطة' },
      { value: 'moderate',  label: 'صعوبة متوسطة' },
      { value: 'severe',    label: 'صعوبة كبيرة' },
    ],
  },
  {
    id: 6,
    domain: ['physical'],
    type: 'single',
    required: true,
    text: 'كيف تتوقع أن يتغير مستوى نشاطك اليومي بعد التقاعد؟',
    options: [
      { value: 'increase',       label: 'سيزداد' },
      { value: 'same',           label: 'سيبقى تقريبًا كما هو' },
      { value: 'slight_decrease',label: 'قد ينخفض قليلًا' },
      { value: 'clear_decrease', label: 'أتوقع أن ينخفض بشكل واضح' },
    ],
  },

  // ─── Psychological Wellbeing ──────────────────────────────────────────────
  {
    id: 7,
    domain: ['psychological'],
    type: 'single',
    required: true,
    text: 'كيف تشعر تجاه انتقالك إلى مرحلة التقاعد؟',
    options: [
      { value: 'very_excited', label: 'متحمس جدًا' },
      { value: 'excited',      label: 'متحمس' },
      { value: 'neutral',      label: 'محايد' },
      { value: 'some_anxiety', label: 'أشعر ببعض القلق' },
      { value: 'high_anxiety', label: 'أشعر بقلق كبير' },
    ],
  },
  {
    id: 8,
    domain: ['psychological'],
    type: 'single',
    required: true,
    text: 'إلى أي مدى لديك تصور واضح لهدف وروتين يومي بعد التقاعد؟',
    options: [
      { value: 'very_clear',   label: 'واضح جدًا' },
      { value: 'somewhat',     label: 'واضح إلى حد ما' },
      { value: 'unsure',       label: 'غير متأكد' },
      { value: 'not_clear',    label: 'ليس لدي تصور واضح حتى الآن' },
    ],
  },
  {
    id: 9,
    domain: ['psychological', 'experience'],
    type: 'single',
    required: true,
    text: 'إلى أي مدى تعتقد أن ترك العمل قد يؤثر على شعورك بالإنجاز أو القيمة أو الهوية؟',
    options: [
      { value: 'no_impact',     label: 'لن يؤثر' },
      { value: 'minor_impact',  label: 'تأثير بسيط' },
      { value: 'moderate_impact', label: 'تأثير متوسط' },
      { value: 'major_impact',  label: 'تأثير كبير' },
    ],
  },

  // ─── Social ───────────────────────────────────────────────────────────────
  {
    id: 10,
    domain: ['social'],
    type: 'single',
    required: true,
    text: 'بعد التقاعد، كيف تتوقع أن يتغير تواصلك مع الأشخاص الذين تتفاعل معهم حاليًا؟',
    options: [
      { value: 'increase',       label: 'سيزداد' },
      { value: 'same',           label: 'سيبقى كما هو' },
      { value: 'slight_decrease',label: 'سينخفض قليلًا' },
      { value: 'clear_decrease', label: 'سينخفض بشكل واضح' },
    ],
  },
  {
    id: 11,
    domain: ['social'],
    type: 'single',
    required: true,
    text: 'هل لديك شبكة من العائلة أو الأصدقاء أو المجتمع يمكنك التواصل والاعتماد عليها خارج بيئة العمل؟',
    options: [
      { value: 'strong',   label: 'شبكة قوية' },
      { value: 'good',     label: 'شبكة جيدة' },
      { value: 'limited',  label: 'شبكة محدودة' },
      { value: 'minimal',  label: 'تكاد لا توجد' },
    ],
  },
  {
    id: 12,
    domain: ['social', 'experience'],
    type: 'single',
    required: true,
    text: 'هل ترغب في المشاركة في أنشطة اجتماعية أو مجتمعية أو تطوعية بعد التقاعد؟',
    options: [
      { value: 'definitely', label: 'نعم بالتأكيد' },
      { value: 'maybe',      label: 'ربما' },
      { value: 'unsure',     label: 'غير متأكد' },
      { value: 'not_now',    label: 'لا حاليًا' },
    ],
  },

  // ─── Financial ────────────────────────────────────────────────────────────
  {
    id: 13,
    domain: ['financial'],
    type: 'single',
    required: true,
    text: 'إلى أي مدى لديك تصور واضح عن دخلك والتزاماتك ومصروفاتك بعد التقاعد؟',
    options: [
      { value: 'very_clear',   label: 'واضح جدًا' },
      { value: 'somewhat',     label: 'واضح إلى حد ما' },
      { value: 'limited',      label: 'لدي تصور محدود' },
      { value: 'not_clear',    label: 'غير واضح' },
    ],
  },
  {
    id: 14,
    domain: ['financial'],
    type: 'single',
    required: true,
    text: 'هل تتوقع أن تسبب الالتزامات المالية بعد التقاعد ضغطًا عليك؟',
    options: [
      { value: 'no_pressure',  label: 'لا أتوقع ضغطًا' },
      { value: 'low',          label: 'ضغط بسيط' },
      { value: 'moderate',     label: 'ضغط متوسط' },
      { value: 'high',         label: 'ضغط مرتفع' },
    ],
  },
  {
    id: 15,
    domain: ['financial'],
    type: 'single',
    required: true,
    text: 'هل لديك احتياطي أو خطة مالية للتعامل مع المصروفات غير المتوقعة؟',
    options: [
      { value: 'yes',     label: 'نعم' },
      { value: 'somewhat',label: 'إلى حد ما' },
      { value: 'no',      label: 'لا' },
      { value: 'unsure',  label: 'غير متأكد' },
    ],
  },

  // ─── Experience & Purpose ─────────────────────────────────────────────────
  {
    id: 16,
    domain: ['experience'],
    type: 'single',
    required: true,
    text: 'هل ترغب في الاستمرار في الاستفادة من خبراتك ومهاراتك بعد التقاعد؟',
    options: [
      { value: 'yes',    label: 'نعم' },
      { value: 'maybe',  label: 'ربما' },
      { value: 'unsure', label: 'غير متأكد' },
      { value: 'no',     label: 'لا' },
    ],
  },
  {
    id: 17,
    domain: ['experience'],
    type: 'multi',
    required: true,
    text: 'كيف تفضّل الاستفادة من خبرتك بعد التقاعد؟',
    hint: 'يمكنك اختيار أكثر من إجابة',
    options: [
      { value: 'mentoring',      label: 'الإرشاد المهني (Mentoring)' },
      { value: 'consulting',     label: 'الاستشارات' },
      { value: 'training',       label: 'التدريب' },
      { value: 'volunteering',   label: 'التطوع' },
      { value: 'flexible_work',  label: 'العمل المرن أو الجزئي' },
      { value: 'entrepreneurship', label: 'ريادة الأعمال' },
      { value: 'knowledge_transfer', label: 'نقل المعرفة للأجيال القادمة' },
      { value: 'not_decided',    label: 'لم أحدد بعد' },
    ],
  },

  // ─── Overall Priority ─────────────────────────────────────────────────────
  {
    id: 18,
    domain: ['overall'],
    type: 'single-with-text',
    required: true,
    text: 'ما أكثر جانب يشغلك عند التفكير في حياتك بعد التقاعد؟',
    textPlaceholder: 'إذا رغبت، أخبرنا أكثر عمّا يشغلك',
    options: [
      { value: 'health',      label: 'صحتي' },
      { value: 'physical',    label: 'النشاط والحركة' },
      { value: 'psychological', label: 'الرفاه النفسي' },
      { value: 'social',      label: 'الحياة الاجتماعية' },
      { value: 'financial',   label: 'الاستقرار المالي' },
      { value: 'experience',  label: 'الاستفادة من خبراتي' },
      { value: 'none',        label: 'لا يوجد جانب محدد حاليًا' },
    ],
  },
];

/**
 * SECTIONS — groups the 18 questions into 6 Agent domains for the UX flow.
 *
 * IMPORTANT: This purely organises the presentation layer.
 * - Question IDs, domain mappings, answer values, and payload are UNCHANGED.
 * - Q18 is presented in the Experience section but retains its ['overall']
 *   domain mapping for analysis.
 * - Each section has exactly 3 questions (questionIds array).
 */
export const SECTIONS = [
  {
    id: 'health',
    agentKey: 'health',
    icon: '🫀',
    label: 'الصحة والأمراض المزمنة',
    shortLabel: 'الصحة',
    description: 'نبدأ بفهم حالتك الصحية والمتابعة الحالية لبناء خط أساس مناسب لك.',
    questionIds: [1, 2, 3],
  },
  {
    id: 'physical',
    agentKey: 'physical',
    icon: '🏃',
    label: 'النشاط والحركة',
    shortLabel: 'الحركة',
    description: 'نتعرف على مستوى نشاطك الحالي وتوقعاتك بعد التقاعد.',
    questionIds: [4, 5, 6],
  },
  {
    id: 'psychological',
    agentKey: 'psychological',
    icon: '🧠',
    label: 'الرفاه النفسي والانتقال للتقاعد',
    shortLabel: 'النفسي',
    description: 'نستكشف مشاعرك تجاه التقاعد وتصورك للهدف والهوية في هذه المرحلة.',
    questionIds: [7, 8, 9],
  },
  {
    id: 'social',
    agentKey: 'social',
    icon: '🤝',
    label: 'الحياة الاجتماعية',
    shortLabel: 'الاجتماعي',
    description: 'نقيّم شبكة علاقاتك واهتمامك بالمشاركة المجتمعية بعد التقاعد.',
    questionIds: [10, 11, 12],
  },
  {
    id: 'financial',
    agentKey: 'financial',
    icon: '💼',
    label: 'الاستعداد المالي',
    shortLabel: 'المالي',
    description: 'نفهم وضوحك المالي ومستوى استعدادك للالتزامات بعد التقاعد.',
    questionIds: [13, 14, 15],
  },
  {
    id: 'experience',
    agentKey: 'experience',
    icon: '🌟',
    label: 'الخبرة والهدف بعد التقاعد',
    shortLabel: 'الخبرة',
    description: 'نختم بفهم كيف تريد توظيف خبرتك وما يشغل تفكيرك أكثر.',
    questionIds: [16, 17, 18],
  },
];

/**
 * Build a flat lookup: questionId → { section, sectionIndex, indexInSection }
 * Used by the AssessmentScreen to know where any question sits.
 */
export const QUESTION_SECTION_MAP = (() => {
  const map = {};
  SECTIONS.forEach((section, sIdx) => {
    section.questionIds.forEach((qId, qIdx) => {
      map[qId] = {
        section,
        sectionIndex: sIdx,        // 0-based section index
        indexInSection: qIdx,      // 0-based position within section (0,1,2)
        totalInSection: section.questionIds.length,
      };
    });
  });
  return map;
})();


export const TOTAL_QUESTIONS = QUESTIONS.length; // 18

/**
 * Time estimate — rough reading/answering time per question (seconds).
 * Used to compute remaining time label.
 */
export const SECONDS_PER_QUESTION = 15;

/**
 * Build an empty answers object keyed by question id.
 * single / single-with-text  → null
 * multi                       → []
 * single-with-text also gets a _text key
 */
export function buildEmptyAnswers() {
  return QUESTIONS.reduce((acc, q) => {
    if (q.type === 'multi') {
      acc[q.id] = [];
    } else if (q.type === 'single-with-text') {
      acc[q.id] = null;
      acc[`${q.id}_text`] = '';
    } else {
      acc[q.id] = null;
    }
    return acc;
  }, {});
}
