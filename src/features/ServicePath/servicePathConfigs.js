/**
 * servicePathConfigs.js
 * ──────────────────────
 * Per-agent service path configurations for the Wahaj Service Path feature.
 *
 * Each config describes:
 *   - serviceTitle / serviceProvider / serviceDesc / ctaLabel
 *   - color variant (green | orange | blue | teal)
 *   - checklist items
 *   - followUpMetrics
 *   - impactMetric (baseline label for display)
 *   - followUpDays
 *
 * The Experience agent config is PERSONALIZED at call time based on
 * the raw assessment answers (Q16 = raw[16], Q17 = raw[17]).
 *
 * The Orchestrator config is derived cross-agent and injected from
 * the ResultsDashboard via getOrchestratorServiceConfig().
 *
 * PROTOTYPE NOTICE: No live external service integrations. All service
 * info is demo data for presentation purposes.
 */

// ─── Color variants (used in ServicePathPanel) ────────────────────────────────
export const PANEL_VARIANT = {
  GREEN:  'green',   // normal / self-guided
  ORANGE: 'orange',  // human review recommended
  BLUE:   'blue',    // opportunity
  TEAL:   'teal',    // knowledge / experience
};

// ─── HEALTH ───────────────────────────────────────────────────────────────────

export const HEALTH_SERVICE_CONFIG = {
  agentId:         'health',
  variant:         PANEL_VARIANT.GREEN,
  sectionTitle:    'الخدمة المقترحة من وهج',
  serviceTitle:    'مسار متابعة الصحة والأمراض المزمنة',
  serviceProvider: 'وهج',
  serviceDesc:     'يساعدك وهج على تنظيم المتابعة الصحية المرتبطة بحالتك خلال مرحلة الانتقال للتقاعد.',
  ctaLabel:        'ابدأ مسار المتابعة',
  followUpDays:    30,
  checklist: [
    { id: 'h_review_tests',    label: 'راجع آخر الفحوصات والمتابعات الطبية' },
    { id: 'h_schedule',        label: 'تأكد من انتظام مواعيد المتابعة الدورية' },
    { id: 'h_adherence',       label: 'تابع الالتزام بالخطة العلاجية الموصوفة من المختص' },
    { id: 'h_next_appt',       label: 'حدّد موعد متابعة للفترة القادمة' },
    { id: 'h_track_changes',   label: 'تابع أي تغيرات صحية ملحوظة خلال الشهر الأول' },
  ],
  followUpMetrics: [
    'هل تمت المتابعة الصحية الدورية؟',
    'هل تم حضور المواعيد الطبية؟',
    'هل استمر الالتزام بالخطة العلاجية؟',
    'هل ظهرت حاجة لمراجعة مختص؟',
  ],
  impactBaseline:  'متابعة طبية غير منتظمة',
  impactTarget:    'متابعة منتظمة ومكتملة',
  safetyNote:      'يُنصح بمراجعة طبيبك قبل تغيير أي نظام علاجي. لا يقدم وهج تشخيصًا أو توصية بتغيير الدواء.',
};

// ─── PHYSICAL ────────────────────────────────────────────────────────────────

export const PHYSICAL_SERVICE_CONFIG = {
  agentId:         'physical',
  variant:         PANEL_VARIANT.GREEN,
  sectionTitle:    'الخدمة المقترحة من وهج',
  serviceTitle:    'مسار المزايا — مسار النشاط البدني',
  serviceProvider: 'التأمينات الاجتماعية (نموذج تجريبي)',
  serviceDesc:     'يمكنك الاستفادة من المزايا والخدمات المتاحة لدعم نشاطك وحركتك بعد التقاعد.',
  ctaLabel:        'اذهب إلى مسار النشاط',
  followUpDays:    30,
  checklist: [
    { id: 'p_browse_clubs',    label: 'استعرض أقرب نادي أو مركز رياضي مناسب لك', hasSubAction: true },
    { id: 'p_select_club',     label: 'اختر النادي أو العرض الأنسب' },
    { id: 'p_activate',        label: 'فعّل الخدمة أو الميزة' },
    { id: 'p_first_visit',     label: 'سجّل أول زيارة' },
    { id: 'p_five_days',       label: 'التزم بالخطة خلال أول 5 أيام' },
    { id: 'p_update',          label: 'حدّث تقدمك في وهج بعد الأسبوع الأول' },
  ],
  followUpMetrics: [
    'عدد أيام النشاط الأسبوعي',
    'الاستمرار في الزيارات',
    'مستوى الطاقة والراحة',
    'ظهور حاجة لمختص طبي رياضي',
  ],
  impactBaseline:  '0–2 أيام نشاط/أسبوع',
  impactTarget:    '3+ أيام نشاط/أسبوع',
  safetyNote:      null,
};

// ─── PSYCHOLOGICAL ────────────────────────────────────────────────────────────

export const PSYCHOLOGICAL_SERVICE_CONFIG = {
  agentId:         'psychological',
  variant:         PANEL_VARIANT.BLUE,
  sectionTitle:    'الخدمة المقترحة من وهج',
  serviceTitle:    'مسار التكيّف مع مرحلة التقاعد',
  serviceProvider: 'وهج',
  serviceDesc:     'يساعدك وهج على بناء روتين واضح، واكتشاف هدف جديد، والتكيّف النفسي مع هذه المرحلة.',
  ctaLabel:        'ابدأ مسار التكيّف',
  followUpDays:    30,
  checklist: [
    { id: 'psy_activities',    label: 'حدّد ثلاثة أنشطة مهمة تريد الاستمرار فيها أسبوعيًا' },
    { id: 'psy_routine',       label: 'صمّم روتينًا يوميًا جديدًا لأول أسبوع بعد التقاعد' },
    { id: 'psy_achievement',   label: 'اختر نشاطًا يمنحك شعورًا بالإنجاز' },
    { id: 'psy_goal',          label: 'حدّد هدفًا شخصيًا قصير المدى (شهر واحد)' },
    { id: 'psy_followup',      label: 'راجع مستوى تكيّفك بعد 30 يومًا' },
  ],
  followUpMetrics: [
    'وضوح الروتين اليومي',
    'الشعور بالهدف والمعنى',
    'مستوى التكيّف مع المرحلة',
    'الاستمرار في الأنشطة',
    'الحاجة لدعم نفسي إضافي',
  ],
  impactBaseline:  'غياب روتين أو هدف واضح',
  impactTarget:    'روتين أسبوعي وهدف قصير المدى',
  safetyNote:      'لا يقدم وهج تشخيصًا نفسيًا. إذا تطلب الأمر دعمًا متخصصًا، سيقترح وهج مراجعة مختص.',
};

// ─── SOCIAL ───────────────────────────────────────────────────────────────────

export const SOCIAL_SERVICE_CONFIG = {
  agentId:         'social',
  variant:         PANEL_VARIANT.TEAL,
  sectionTitle:    'الخدمة المقترحة من وهج',
  serviceTitle:    'مسار التواصل والمشاركة المجتمعية',
  serviceProvider: 'وهج',
  serviceDesc:     'يساعدك وهج على الحفاظ على تواصلك الاجتماعي وإيجاد فرص مشاركة مجتمعية ذات معنى.',
  ctaLabel:        'اكتشف فرص المشاركة',
  followUpDays:    30,
  checklist: [
    { id: 'soc_map_circle',    label: 'حدّد دائرة تواصلك الحالية (عائلة، أصدقاء، زملاء)' },
    { id: 'soc_choose_activity', label: 'اختر نشاطًا اجتماعيًا مناسبًا لأسلوب حياتك' },
    { id: 'soc_community',     label: 'استكشف فرصة مشاركة مجتمعية أو تطوعية' },
    { id: 'soc_frequency',     label: 'حدّد عدد مرات المشاركة الأسبوعية المستهدفة' },
    { id: 'soc_track',         label: 'تابع مستوى تواصلك الاجتماعي بعد بدء المسار' },
  ],
  followUpMetrics: [
    'عدد المشاركات الاجتماعية الأسبوعية',
    'استمرار المشاركة في الأنشطة',
    'مستوى التواصل الاجتماعي العام',
    'تغيّر الشعور بالعزلة',
    'الحاجة لدعم اجتماعي إضافي',
  ],
  impactBaseline:  'شبكة اجتماعية محدودة أو متوقع تراجعها',
  impactTarget:    'مشاركة اجتماعية منتظمة أسبوعيًا',
  safetyNote:      null,
};

// ─── FINANCIAL ────────────────────────────────────────────────────────────────

export const FINANCIAL_SERVICE_CONFIG = {
  agentId:         'financial',
  variant:         PANEL_VARIANT.ORANGE,
  sectionTitle:    'الخدمة المقترحة من وهج',
  serviceTitle:    'مسار الاستعداد المالي للتقاعد',
  serviceProvider: 'وهج',
  serviceDesc:     'يساعدك وهج على مراجعة وضوحك المالي وتحديد الجوانب التي تحتاج تخطيطًا قبل التقاعد.',
  ctaLabel:        'ابدأ مراجعة الاستعداد المالي',
  followUpDays:    30,
  checklist: [
    { id: 'fin_income',        label: 'راجع وضوح الدخل المتوقع بعد التقاعد (راتب تقاعدي، مدخرات)' },
    { id: 'fin_obligations',   label: 'حدّد الالتزامات الشهرية الأساسية' },
    { id: 'fin_expenses',      label: 'راجع المصروفات المتوقعة وقارنها بالدخل' },
    { id: 'fin_reserve',       label: 'تحقق من وجود احتياطي مالي للطوارئ' },
    { id: 'fin_gaps',          label: 'حدّد الجوانب التي تحتاج تخطيطًا أو مراجعة مختص' },
  ],
  followUpMetrics: [
    'وضوح الدخل والالتزامات',
    'وجود خطة للمصروفات',
    'الاستعداد للمصروفات غير المتوقعة',
    'مستوى الضغط المالي المُدرَك',
    'الحاجة لمستشار مالي متخصص',
  ],
  impactBaseline:  'غموض في الصورة المالية لما بعد التقاعد',
  impactTarget:    'تصور مالي واضح ومراجعة منتظمة',
  safetyNote:      'لا يقدم وهج استشارة استثمارية أو توصية بمنتجات مالية. للحصول على نصيحة متخصصة، راجع مستشارًا ماليًا مرخصًا.',
};

// ─── EXPERIENCE — personalized by Q16/Q17 answers ────────────────────────────

/**
 * Returns a personalized Experience service config based on the user's
 * preferred modes from Q17 (raw[17]) and continuation intent from Q16.
 *
 * @param {string} q16 - raw[16] value
 * @param {string[]} q17 - raw[17] array
 */
export function getExperienceServiceConfig(q16, q17 = []) {
  const wantsToContribute = q16 === 'yes' || q16 === 'maybe';

  // Pick the most prominent mode
  let primaryMode = null;
  const modeChecks = [
    ['mentoring',         'الإرشاد المهني ونقل الخبرة'],
    ['knowledge_transfer','نقل المعرفة للأجيال القادمة'],
    ['consulting',        'الاستشارات المهنية'],
    ['training',          'تقديم التدريب'],
    ['volunteering',      'التطوع المرتبط بالخبرة'],
    ['flexible_work',     'العمل المرن أو الجزئي'],
    ['entrepreneurship',  'استكشاف ريادة الأعمال'],
  ];
  for (const [val, label] of modeChecks) {
    if (q17.includes(val)) { primaryMode = { val, label }; break; }
  }

  // Service desc & title based on mode
  let serviceTitle, serviceDesc;
  if (!wantsToContribute) {
    serviceTitle = 'استكشاف فرص ما بعد التقاعد';
    serviceDesc  = 'وهج يساعدك على اكتشاف أشكال مرنة من المشاركة تناسب أسلوب حياتك بعد التقاعد.';
  } else if (primaryMode?.val === 'mentoring' || primaryMode?.val === 'knowledge_transfer') {
    serviceTitle = 'مسار الإرشاد المهني ونقل الخبرة';
    serviceDesc  = 'خبرتك رصيد نادر. وهج يساعدك على تحديد فرص الإرشاد ونقل المعرفة للأجيال القادمة.';
  } else if (primaryMode?.val === 'consulting') {
    serviceTitle = 'مسار الاستشارات المهنية';
    serviceDesc  = 'وهج يساعدك على استكشاف الفرص الاستشارية المرنة التي تناسب خبرتك ووقتك.';
  } else if (primaryMode?.val === 'training') {
    serviceTitle = 'مسار التدريب ونقل المعرفة';
    serviceDesc  = 'وهج يساعدك على تحويل خبرتك إلى محتوى تدريبي يفيد الجيل القادم.';
  } else if (primaryMode?.val === 'volunteering') {
    serviceTitle = 'مسار التطوع المرتبط بخبرتك';
    serviceDesc  = 'المشاركة التطوعية ذات المعنى تعزز الهدف والتواصل الاجتماعي بعد التقاعد.';
  } else if (primaryMode?.val === 'flexible_work') {
    serviceTitle = 'مسار العمل المرن أو الجزئي';
    serviceDesc  = 'وهج يساعدك على استكشاف فرص العمل الجزئي أو المستقل بما يناسب مرحلة التقاعد.';
  } else if (primaryMode?.val === 'entrepreneurship') {
    serviceTitle = 'مسار استكشاف ريادة الأعمال';
    serviceDesc  = 'وهج يساعدك على استكشاف خيارات ريادة الأعمال التي تبني على خبرتك القائمة.';
  } else {
    serviceTitle = 'مسار استثمار الخبرة بعد التقاعد';
    serviceDesc  = 'وهج يرافقك في اكتشاف أفضل طريقة للاستفادة من خبرتك ومهاراتك بعد التقاعد.';
  }

  return {
    agentId:         'experience',
    variant:         PANEL_VARIANT.BLUE,
    sectionTitle:    'فرصتك المقترحة من وهج',
    serviceTitle,
    serviceProvider: 'وهج',
    serviceDesc,
    ctaLabel:        'اكتشف فرص استثمار خبرتي',
    followUpDays:    30,
    checklist: [
      { id: 'exp_skills',      label: 'حدّد خبراتك ومهاراتك الرئيسية التي تريد توظيفها' },
      { id: 'exp_mode',        label: 'حدّد نوع الفرصة المفضلة (إرشاد، استشارات، تطوع…)' },
      { id: 'exp_time',        label: 'حدّد الوقت المتاح أسبوعيًا لهذه المشاركة' },
      { id: 'exp_first_opp',   label: 'اختر أول فرصة مناسبة وابدأ بها' },
      { id: 'exp_engage',      label: 'شارك في أول جلسة أو نشاط' },
      { id: 'exp_measure',     label: 'قِس أثر المشاركة على شعورك بالهدف والتواصل' },
    ],
    followUpMetrics: [
      'هل بدأ المستخدم فرصة استثمار الخبرة؟',
      'عدد الجلسات أو المشاركات',
      'الاستمرارية',
      'الشعور بالهدف والرضا',
      'الأثر الاجتماعي والنفسي',
    ],
    impactBaseline:  'لا دور مهني أو مشاركة بعد التقاعد',
    impactTarget:    'مشاركة فعّالة منتظمة بعد التقاعد',
    safetyNote:      null,
  };
}

// ─── ORCHESTRATOR — cross-agent service pick ──────────────────────────────────

/**
 * Given the array of 6 agent result objects and the raw answers,
 * returns { config, crossAgentReason } where:
 *   - config is a ServicePath config for the single highest-impact service
 *   - crossAgentReason is an Arabic user-facing explanation (no chain-of-thought)
 *
 * Priority rules (in order):
 *  1. Health + Physical chronic+low-activity → group activity program
 *  2. Psychological + Social anxiety+weak-network → social-transition program
 *  3. Experience + Psychological strong-identity → mentoring path
 *  4. Financial high-risk → financial clarity path
 *  5. Fallback → physical activity (broadest impact)
 */
export function getOrchestratorServiceConfig(agents, raw) {
  const health     = agents.find((a) => a.id === 'health');
  const physical   = agents.find((a) => a.id === 'physical');
  const psych      = agents.find((a) => a.id === 'psychological');
  const social     = agents.find((a) => a.id === 'social');
  const financial  = agents.find((a) => a.id === 'financial');
  const experience = agents.find((a) => a.id === 'experience');

  const hasChronicCondition = Array.isArray(raw[2]) && raw[2].some((c) => c !== 'none');
  const lowActivity         = raw[4] === 'none' || raw[4] === '1_2';
  const highAnxiety         = raw[7] === 'high_anxiety' || raw[7] === 'some_anxiety';
  const weakNetwork         = raw[11] === 'minimal' || raw[11] === 'limited';
  const expectedDrop        = raw[10] === 'clear_decrease' || raw[10] === 'slight_decrease';
  const wantsExperience     = raw[16] === 'yes' || raw[16] === 'maybe';
  const strongIdentity      = raw[9] === 'major_impact' || raw[9] === 'moderate_impact';
  const highFinancial       = financial?.level === 'high';

  // Rule 1: Chronic health + low activity → group activity
  if (hasChronicCondition && lowActivity) {
    const domains = [
      health?.level !== 'low'    && 'الصحة',
      physical?.level !== 'low'  && 'النشاط',
      psych?.level !== 'low'     && 'الرفاه النفسي',
      social?.level !== 'low'    && 'الحياة الاجتماعية',
    ].filter(Boolean);

    return {
      config: {
        ...PHYSICAL_SERVICE_CONFIG,
        agentId:         'orchestrator',
        serviceTitle:    'برنامج نشاط جماعي مناسب للحالة الصحية',
        serviceDesc:     'نشاط بدني منتظم في بيئة اجتماعية يدعم صحتك ويحسن رفاهيتك النفسية والاجتماعية في آنٍ واحد.',
        ctaLabel:        'ابدأ برنامج النشاط الجماعي',
        variant:         PANEL_VARIANT.GREEN,
        followUpDays:    30,
      },
      domainsServed: domains.length > 0 ? domains : ['الصحة', 'النشاط'],
      crossAgentReason: `اخترنا هذا المسار لأنه يخدم ${domains.length > 1 ? `${domains.length} جوانب` : 'جانبًا'} ظهرت في تقييمك: ${domains.join('، ') || 'الصحة والنشاط'}.`,
    };
  }

  // Rule 2: Anxiety + weak social → social-transition program
  if (highAnxiety && (weakNetwork || expectedDrop)) {
    const domains = [
      psych?.level !== 'low'  && 'الرفاه النفسي',
      social?.level !== 'low' && 'الحياة الاجتماعية',
    ].filter(Boolean);

    return {
      config: {
        ...SOCIAL_SERVICE_CONFIG,
        agentId:         'orchestrator',
        serviceTitle:    'مسار الدعم النفسي والاجتماعي للانتقال',
        serviceDesc:     'دعم الانتقال النفسي والاجتماعي معًا: روتين واضح، شبكة اجتماعية داعمة، وهدف يومي.',
        ctaLabel:        'ابدأ مسار الدعم',
        variant:         PANEL_VARIANT.BLUE,
        followUpDays:    30,
      },
      domainsServed: domains.length > 0 ? domains : ['الرفاه النفسي', 'الحياة الاجتماعية'],
      crossAgentReason: `اخترنا هذا المسار لأنه يخدم جانبين مترابطين ظهرا في تقييمك: ${domains.join(' و') || 'الرفاه النفسي والحياة الاجتماعية'}.`,
    };
  }

  // Rule 3: Experience + identity → mentoring path
  if (wantsExperience && strongIdentity) {
    const domains = [
      experience?.type === 'opportunity' && 'الخبرات',
      psych?.level !== 'low'             && 'الرفاه النفسي',
      social?.type === 'opportunity'     && 'الحياة الاجتماعية',
    ].filter(Boolean);

    return {
      config: {
        ...getExperienceServiceConfig(raw[16], raw[17] ?? []),
        agentId:         'orchestrator',
        serviceTitle:    'مسار الإرشاد المهني ونقل الخبرة',
        serviceDesc:     'توظيف خبرتك في الإرشاد يحافظ على هويتك المهنية ويعزز تواصلك الاجتماعي وشعورك بالهدف.',
        ctaLabel:        'استكشف مسار الإرشاد',
        variant:         PANEL_VARIANT.TEAL,
        followUpDays:    30,
      },
      domainsServed: domains.length > 0 ? domains : ['الخبرات', 'الرفاه النفسي'],
      crossAgentReason: `اخترنا هذا المسار لأنه يخدم ${domains.length > 1 ? `${domains.length} جوانب` : 'جانبًا'} ظهرت في تقييمك: ${domains.join('، ') || 'الخبرات والرفاه النفسي'}.`,
    };
  }

  // Rule 4: High financial risk
  if (highFinancial) {
    return {
      config: {
        ...FINANCIAL_SERVICE_CONFIG,
        agentId:         'orchestrator',
        followUpDays:    30,
      },
      domainsServed: ['الاستقرار المالي'],
      crossAgentReason: 'حدّد وهج الاستقرار المالي أولوية محورية بناءً على إجاباتك في أكثر من سؤال مالي.',
    };
  }

  // Fallback: physical activity (broadest impact)
  return {
    config: {
      ...PHYSICAL_SERVICE_CONFIG,
      agentId: 'orchestrator',
      followUpDays: 30,
    },
    domainsServed: ['النشاط', 'الصحة'],
    crossAgentReason: 'النشاط البدني المنتظم هو الأساس المشترك الذي يدعم معظم جوانب جودة الحياة بعد التقاعد.',
  };
}
