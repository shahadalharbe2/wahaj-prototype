/**
 * Wahaj Analysis Rules
 *
 * IMPORTANT DISCLAIMER
 * ─────────────────────
 * These are PROTOTYPE HEURISTICS only.
 * They are NOT clinically validated risk scores, medical thresholds, or financial
 * advice. Every rule is marked validationStatus: "prototype_rule_requires_expert_validation"
 * and must be reviewed and approved by qualified domain experts before any
 * production deployment.
 *
 * The architecture is designed so this file can be replaced by:
 *   Wahaj Trusted Knowledge Base → RAG → IBM Granite → specialized agents
 *
 * Evidence source placeholders used here are CATEGORIES ONLY.
 * No specific citations, study names, or URLs are fabricated.
 */

// ─── Evidence Source Categories ──────────────────────────────────────────────
export const EVIDENCE_SOURCES = {
  MOH:        'وزارة الصحة السعودية',
  GOSI:       'التأمينات الاجتماعية GOSI',
  SAMA:       'البنك المركزي السعودي SAMA',
  MHRSD:      'وزارة الموارد البشرية والتنمية الاجتماعية',
  WHO:        'منظمة الصحة العالمية WHO',
  WAHAJ_RULE: 'قاعدة تجريبية للعرض — تتطلب اعتماد مختص',
};

// ─── Escalation Levels ────────────────────────────────────────────────────────
export const ESCALATION = {
  GREEN:  'green',   // مسار ذاتي — AI-guided self-follow-up
  ORANGE: 'orange',  // مراجعة مختص — professional should review
  RED:    'red',     // تدخل بشري مطلوب — automated path insufficient
};

// ─── Validation Status (attached to every rule/finding) ──────────────────────
export const VALIDATION_STATUS = 'prototype_rule_requires_expert_validation';

// ─── Domain Configuration ─────────────────────────────────────────────────────
export const DOMAIN_META = {
  health:        { id: 'health',        label: 'الصحة والأمراض المزمنة',  icon: '🫀' },
  physical:      { id: 'physical',      label: 'النشاط والحركة',           icon: '🏃' },
  psychological: { id: 'psychological', label: 'الرفاه النفسي',             icon: '🧠' },
  social:        { id: 'social',        label: 'الحياة الاجتماعية',         icon: '🤝' },
  financial:     { id: 'financial',     label: 'الاستقرار المالي',           icon: '💼' },
  experience:    { id: 'experience',    label: 'الخبرات والهدف',             icon: '🌟' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT RULE SETS
// Each rule returns a partial finding object when its condition matches.
// Rules are evaluated in order; only the first matching rule fires per category.
// ═══════════════════════════════════════════════════════════════════════════════

// ─── HEALTH AGENT RULES ───────────────────────────────────────────────────────

/**
 * Evaluate self-rated health (Q1)
 * Values: excellent | very_good | good | fair | poor
 */
export function evalSelfRatedHealth(q1) {
  if (q1 === 'excellent' || q1 === 'very_good') {
    return { level: 'low', type: 'stable', signal: 'تقييمك لصحتك العامة إيجابي' };
  }
  if (q1 === 'good') {
    return { level: 'low', type: 'stable', signal: 'تقييمك لصحتك العامة جيد' };
  }
  if (q1 === 'fair') {
    return { level: 'moderate', type: 'risk', signal: 'تقييمك لصحتك العامة مقبول — يستحق الاهتمام' };
  }
  if (q1 === 'poor') {
    return { level: 'high', type: 'risk', signal: 'تقييمك لصحتك العامة يستدعي متابعة دقيقة' };
  }
  return { level: 'low', type: 'stable', signal: 'لم يتم تحديد تقييم الصحة' };
}

/**
 * Evaluate chronic conditions (Q2)
 * Values: none | diabetes | hypertension | heart | cholesterol | respiratory | joints | other
 * Returns { level, type, signals[], conditions[] }
 */
export function evalChronicConditions(q2) {
  const conditions = Array.isArray(q2) ? q2 : [];
  if (conditions.includes('none') || conditions.length === 0) {
    return { level: 'low', type: 'stable', signals: [], conditions: [] };
  }
  const highRisk = ['heart', 'diabetes', 'respiratory'];
  const hasHighRisk = conditions.some((c) => highRisk.includes(c));
  const count = conditions.filter((c) => c !== 'none').length;

  const conditionLabels = {
    diabetes:     'السكري',
    hypertension: 'ارتفاع ضغط الدم',
    heart:        'أمراض القلب',
    cholesterol:  'ارتفاع الدهون أو الكوليسترول',
    respiratory:  'أمراض تنفسية',
    joints:       'مشكلات المفاصل أو العظام',
    other:        'حالات أخرى',
  };
  const signals = conditions
    .filter((c) => c !== 'none')
    .map((c) => conditionLabels[c] ?? c);

  if (hasHighRisk) {
    return { level: 'high', type: 'risk', signals, conditions };
  }
  if (count >= 2) {
    return { level: 'moderate', type: 'risk', signals, conditions };
  }
  return { level: 'moderate', type: 'risk', signals, conditions };
}

/**
 * Evaluate medical adherence (Q3)
 * Values: always | usually | sometimes | rarely | not_applicable
 */
export function evalMedicalAdherence(q3) {
  if (q3 === 'always') return { level: 'low', adherenceSignal: 'التزام كامل بالمتابعة الطبية' };
  if (q3 === 'usually') return { level: 'low', adherenceSignal: 'التزام جيد بالمتابعة الطبية' };
  if (q3 === 'sometimes') return { level: 'moderate', adherenceSignal: 'الالتزام بالمتابعة الطبية متقطع' };
  if (q3 === 'rarely') return { level: 'high', adherenceSignal: 'ضعف الالتزام بالمتابعة الطبية' };
  if (q3 === 'not_applicable') return { level: 'low', adherenceSignal: 'لا تنطبق المتابعة الطبية حاليًا' };
  return { level: 'low', adherenceSignal: '' };
}

// ─── PHYSICAL AGENT RULES ─────────────────────────────────────────────────────

export function evalActivityFrequency(q4) {
  if (q4 === 'none') return { level: 'high', type: 'risk', signal: 'لا يوجد نشاط بدني حالي' };
  if (q4 === '1_2') return { level: 'moderate', type: 'risk', signal: 'مستوى النشاط البدني منخفض' };
  if (q4 === '3_4') return { level: 'low', type: 'stable', signal: 'مستوى النشاط البدني معتدل' };
  if (q4 === '5_plus') return { level: 'low', type: 'stable', signal: 'مستوى النشاط البدني جيد' };
  return { level: 'low', type: 'stable', signal: '' };
}

export function evalMobilityDifficulty(q5) {
  if (q5 === 'none') return { level: 'low', type: 'stable', signal: 'لا توجد صعوبات في الحركة أو التوازن' };
  if (q5 === 'mild') return { level: 'low', type: 'stable', signal: 'صعوبات بسيطة في الحركة' };
  if (q5 === 'moderate') return { level: 'moderate', type: 'risk', signal: 'صعوبات متوسطة في الحركة أو التوازن' };
  if (q5 === 'severe') return { level: 'high', type: 'risk', signal: 'صعوبات كبيرة في الحركة — يتطلب متابعة' };
  return { level: 'low', type: 'stable', signal: '' };
}

export function evalActivityExpectation(q6) {
  if (q6 === 'increase') return { type: 'opportunity', signal: 'تتوقع زيادة نشاطك بعد التقاعد' };
  if (q6 === 'same') return { type: 'stable', signal: 'تتوقع الحفاظ على مستوى نشاطك' };
  if (q6 === 'slight_decrease') return { type: 'risk', signal: 'تتوقع انخفاضًا طفيفًا في النشاط بعد التقاعد' };
  if (q6 === 'clear_decrease') return { type: 'risk', signal: 'تتوقع انخفاضًا واضحًا في النشاط بعد التقاعد' };
  return { type: 'stable', signal: '' };
}

// ─── PSYCHOLOGICAL AGENT RULES ────────────────────────────────────────────────

export function evalRetirementFeeling(q7) {
  if (q7 === 'very_excited' || q7 === 'excited') {
    return { level: 'low', type: 'stable', signal: 'موقف إيجابي من التقاعد' };
  }
  if (q7 === 'neutral') {
    return { level: 'low', type: 'stable', signal: 'موقف محايد من التقاعد' };
  }
  if (q7 === 'some_anxiety') {
    return { level: 'moderate', type: 'risk', signal: 'بعض القلق تجاه الانتقال للتقاعد' };
  }
  if (q7 === 'high_anxiety') {
    return { level: 'high', type: 'risk', signal: 'قلق مرتفع تجاه الانتقال للتقاعد' };
  }
  return { level: 'low', type: 'stable', signal: '' };
}

export function evalPurposeClarity(q8) {
  if (q8 === 'very_clear') return { level: 'low', type: 'stable', signal: 'تصور واضح جدًا للهدف والروتين بعد التقاعد' };
  if (q8 === 'somewhat') return { level: 'low', type: 'stable', signal: 'تصور معقول للهدف بعد التقاعد' };
  if (q8 === 'unsure') return { level: 'moderate', type: 'risk', signal: 'عدم وضوح كافٍ للهدف والروتين بعد التقاعد' };
  if (q8 === 'not_clear') return { level: 'high', type: 'risk', signal: 'غياب التصور عن الهدف اليومي بعد التقاعد' };
  return { level: 'low', type: 'stable', signal: '' };
}

export function evalWorkIdentityImpact(q9) {
  if (q9 === 'no_impact') return { level: 'low', type: 'stable', signal: 'لا يتوقع تأثيرًا على الهوية المهنية' };
  if (q9 === 'minor_impact') return { level: 'low', type: 'stable', signal: 'تأثير بسيط متوقع على الهوية المهنية' };
  if (q9 === 'moderate_impact') return { level: 'moderate', type: 'risk', signal: 'تأثير متوسط متوقع على الهوية والإنجاز' };
  if (q9 === 'major_impact') return { level: 'high', type: 'risk', signal: 'تأثير كبير متوقع على الهوية والشعور بالقيمة' };
  return { level: 'low', type: 'stable', signal: '' };
}

// ─── SOCIAL AGENT RULES ───────────────────────────────────────────────────────

export function evalSocialContactChange(q10) {
  if (q10 === 'increase') return { level: 'low', type: 'stable', signal: 'تتوقع زيادة التواصل الاجتماعي بعد التقاعد' };
  if (q10 === 'same') return { level: 'low', type: 'stable', signal: 'تتوقع الحفاظ على التواصل الاجتماعي' };
  if (q10 === 'slight_decrease') return { level: 'moderate', type: 'risk', signal: 'تتوقع انخفاضًا طفيفًا في التواصل الاجتماعي' };
  if (q10 === 'clear_decrease') return { level: 'high', type: 'risk', signal: 'تتوقع انخفاضًا واضحًا في التواصل الاجتماعي' };
  return { level: 'low', type: 'stable', signal: '' };
}

export function evalSupportNetwork(q11) {
  if (q11 === 'strong') return { level: 'low', type: 'stable', signal: 'شبكة دعم اجتماعي قوية خارج بيئة العمل' };
  if (q11 === 'good') return { level: 'low', type: 'stable', signal: 'شبكة دعم اجتماعي جيدة' };
  if (q11 === 'limited') return { level: 'moderate', type: 'risk', signal: 'شبكة الدعم الاجتماعي محدودة' };
  if (q11 === 'minimal') return { level: 'high', type: 'risk', signal: 'شبكة الدعم الاجتماعي ضعيفة جدًا' };
  return { level: 'low', type: 'stable', signal: '' };
}

export function evalCommunityInterest(q12) {
  if (q12 === 'definitely') return { type: 'opportunity', signal: 'رغبة قوية في المشاركة المجتمعية أو التطوع' };
  if (q12 === 'maybe') return { type: 'opportunity', signal: 'اهتمام محتمل بالأنشطة المجتمعية' };
  if (q12 === 'unsure') return { type: 'stable', signal: 'غير متأكد من المشاركة المجتمعية' };
  if (q12 === 'not_now') return { type: 'stable', signal: 'لا رغبة حالية في المشاركة المجتمعية' };
  return { type: 'stable', signal: '' };
}

// ─── FINANCIAL AGENT RULES ───────────────────────────────────────────────────

export function evalFinancialClarity(q13) {
  if (q13 === 'very_clear') return { level: 'low', type: 'stable', signal: 'وضوح تام للوضع المالي بعد التقاعد' };
  if (q13 === 'somewhat') return { level: 'low', type: 'stable', signal: 'وضوح معقول للوضع المالي بعد التقاعد' };
  if (q13 === 'limited') return { level: 'moderate', type: 'risk', signal: 'وضوح محدود للوضع المالي بعد التقاعد' };
  if (q13 === 'not_clear') return { level: 'high', type: 'risk', signal: 'غياب التصور المالي بعد التقاعد' };
  return { level: 'low', type: 'stable', signal: '' };
}

export function evalFinancialPressure(q14) {
  if (q14 === 'no_pressure') return { level: 'low', type: 'stable', signal: 'لا ضغط مالي متوقع بعد التقاعد' };
  if (q14 === 'low') return { level: 'low', type: 'stable', signal: 'ضغط مالي بسيط متوقع' };
  if (q14 === 'moderate') return { level: 'moderate', type: 'risk', signal: 'ضغط مالي متوسط متوقع بعد التقاعد' };
  if (q14 === 'high') return { level: 'high', type: 'risk', signal: 'ضغط مالي مرتفع متوقع — يتطلب مراجعة' };
  return { level: 'low', type: 'stable', signal: '' };
}

export function evalEmergencyReserve(q15) {
  if (q15 === 'yes') return { level: 'low', type: 'stable', signal: 'يتوفر احتياطي أو خطة مالية للطوارئ' };
  if (q15 === 'somewhat') return { level: 'moderate', type: 'risk', signal: 'الاحتياطي المالي للطوارئ محدود' };
  if (q15 === 'no') return { level: 'high', type: 'risk', signal: 'لا يتوفر احتياطي مالي للطوارئ' };
  if (q15 === 'unsure') return { level: 'moderate', type: 'risk', signal: 'عدم التأكد من وجود احتياطي مالي' };
  return { level: 'low', type: 'stable', signal: '' };
}

// ─── EXPERIENCE AGENT RULES ──────────────────────────────────────────────────

export function evalExperienceContinuation(q16) {
  if (q16 === 'yes') return { type: 'opportunity', signal: 'رغبة قوية في الاستمرار باستخدام الخبرات بعد التقاعد' };
  if (q16 === 'maybe') return { type: 'opportunity', signal: 'رغبة محتملة في توظيف الخبرة بعد التقاعد' };
  if (q16 === 'unsure') return { type: 'stable', signal: 'غير متأكد من استمرار توظيف الخبرة' };
  if (q16 === 'no') return { type: 'stable', signal: 'لا رغبة حالية في الاستمرار مهنيًا' };
  return { type: 'stable', signal: '' };
}

const EXPERIENCE_MODE_LABELS = {
  mentoring:          'الإرشاد المهني',
  consulting:         'الاستشارات',
  training:           'التدريب',
  volunteering:       'التطوع',
  flexible_work:      'العمل المرن أو الجزئي',
  entrepreneurship:   'ريادة الأعمال',
  knowledge_transfer: 'نقل المعرفة للأجيال',
  not_decided:        'لم يحدد بعد',
};

export function evalExperienceModes(q17) {
  const modes = Array.isArray(q17) ? q17 : [];
  const labels = modes
    .filter((m) => m !== 'not_decided')
    .map((m) => EXPERIENCE_MODE_LABELS[m] ?? m);
  return { modes, labels, hasDecided: !modes.includes('not_decided') && modes.length > 0 };
}

export function evalTopPriority(q18, q18Text) {
  return {
    topPriority: q18,
    additionalContext: q18Text ?? '',
  };
}
