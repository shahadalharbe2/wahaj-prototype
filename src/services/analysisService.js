/**
 * Wahaj Analysis Service
 * ──────────────────────
 * Deterministic prototype multi-agent analysis engine.
 *
 * Architecture:
 *   Structured Assessment Payload
 *     → 6 Specialized Agents (one per domain)
 *     → Wahaj Orchestrator (cross-agent reasoning)
 *     → Safety / Escalation Layer (deterministic, KB-backed)
 *     → Final Results Object (with KB evidence attached)
 *
 * IMPORTANT: This is a PROTOTYPE.
 * All rules use validationStatus from the KB.
 * This service is intentionally architected as a pure function so it can be
 * replaced by:  Wahaj Knowledge Base → RAG → IBM Granite → real agents
 *
 * Safety principles:
 *  - Does NOT diagnose diseases
 *  - Does NOT provide personalized investment advice
 *  - Does NOT claim clinical validity beyond what the KB documents
 *  - Safety escalation is deterministic, KB-backed, and separate from scoring
 *  - Sources are ONLY attached when explicitly mapped in the KB rule
 */

import {
  evalSelfRatedHealth,
  evalChronicConditions,
  evalMedicalAdherence,
  evalActivityFrequency,
  evalMobilityDifficulty,
  evalActivityExpectation,
  evalRetirementFeeling,
  evalPurposeClarity,
  evalWorkIdentityImpact,
  evalSocialContactChange,
  evalSupportNetwork,
  evalCommunityInterest,
  evalFinancialClarity,
  evalFinancialPressure,
  evalEmergencyReserve,
  evalExperienceContinuation,
  evalExperienceModes,
  evalTopPriority,
  DOMAIN_META,
  ESCALATION,
} from '../data/analysisRules';

import {
  getRuleById,
  getSourcesForRule,
  getEscalationRulesForDomain,
  resolveValidationLabel,
  PROTOTYPE_NOTICE,
  governance,
} from './knowledgeBaseService';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function maxLevel(a, b) {
  const order = { low: 0, moderate: 1, high: 2 };
  return (order[a] ?? 0) >= (order[b] ?? 0) ? a : b;
}

function levelToEscalation(level) {
  if (level === 'high') return ESCALATION.ORANGE;
  return ESCALATION.GREEN;
}

/**
 * Fetch a KB rule and attach evidence fields.
 * If the rule has official sources, those are returned.
 * If not (or ruleId is null), the prototype notice is used.
 *
 * Returns: { ruleId, evidenceRationale, sources, validationStatus, confidence, validationLabel }
 */
function attachKBEvidence(ruleId) {
  if (!ruleId) {
    return {
      ruleId: null,
      evidenceRationale: null,
      sources: [],
      validationStatus: PROTOTYPE_NOTICE,
      confidence: null,
      validationLabel: { label: PROTOTYPE_NOTICE, isOfficial: false },
    };
  }
  const rule = getRuleById(ruleId);
  if (!rule) {
    return {
      ruleId,
      evidenceRationale: null,
      sources: [],
      validationStatus: PROTOTYPE_NOTICE,
      confidence: null,
      validationLabel: { label: PROTOTYPE_NOTICE, isOfficial: false },
    };
  }
  const sources = getSourcesForRule(ruleId);
  const validationLabel = resolveValidationLabel(rule.validationStatus);
  return {
    ruleId: rule.ruleId,
    evidenceRationale: rule.evidenceRationale,
    sources,
    validationStatus: rule.validationStatus,
    confidence: rule.confidence,
    validationLabel,
  };
}

/**
 * Pick the best escalation rule from the KB for a domain.
 * Returns the matched ESC-XX rule object, or null.
 */
function findEscalationRule(domainAr, isHumanReview) {
  if (!isHumanReview) return null;
  const matches = getEscalationRulesForDomain(domainAr);
  // Prefer 🟠 Human Review level; fall back to first match
  return (
    matches.find((r) => r.level && r.level.includes('🟠')) ??
    matches[0] ??
    null
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT 1: HEALTH
// ═══════════════════════════════════════════════════════════════════════════════

function runHealthAgent(raw) {
  const srHealth  = evalSelfRatedHealth(raw[1]);
  const chronic   = evalChronicConditions(raw[2]);
  const adherence = evalMedicalAdherence(raw[3]);

  const overallLevel = maxLevel(srHealth.level, maxLevel(chronic.level, adherence.level));
  const hasConditions = chronic.conditions && chronic.conditions.length > 0;
  const poorAdherence = raw[3] === 'sometimes' || raw[3] === 'rarely';

  const signals = [
    srHealth.signal,
    ...(chronic.signals ?? []),
    adherence.adherenceSignal,
  ].filter(Boolean);

  const type = overallLevel === 'low' ? 'stable' : 'risk';

  // Select the best matching KB rule
  let primaryRuleId = null;
  if (hasConditions && poorAdherence) {
    primaryRuleId = 'KB-H-01'; // chronic + low adherence → human review
  } else if (raw[1] === 'poor') {
    primaryRuleId = 'KB-H-05'; // poor self-rated health
  } else if (
    chronic.conditions.includes('diabetes') ||
    chronic.conditions.includes('hypertension') ||
    chronic.conditions.includes('heart')
  ) {
    primaryRuleId = 'KB-H-02'; // specific chronic conditions
  } else if (hasConditions) {
    primaryRuleId = 'KB-H-04'; // generic chronic condition
  }

  const kbEvidence = attachKBEvidence(primaryRuleId);

  let summary, recommendation;
  if (overallLevel === 'low') {
    summary = 'صحتك العامة جيدة ومستوى متابعتك الطبية مناسب.';
    recommendation = 'استمر في المتابعة الدورية والفحوصات الوقائية المنتظمة.';
  } else if (overallLevel === 'moderate') {
    summary = 'هناك بعض المؤشرات الصحية التي تستحق الاهتمام والمتابعة.';
    recommendation = kbEvidence.sources.length > 0
      ? 'يُنصح بمراجعة طبيبك المعتاد وإعادة التحقق من خطة الرعاية الصحية قبيل التقاعد.'
      : 'يُنصح بمراجعة طبيبك المعتاد وإعادة التحقق من خطة الرعاية الصحية قبيل التقاعد.';
  } else {
    summary = 'تبيّن وجود مؤشرات صحية تستدعي متابعة دقيقة في مرحلة التقاعد.';
    recommendation = 'نوصي بمناقشة المختص الصحي لوضع خطة رعاية شاملة تناسب مرحلة التقاعد.';
  }

  const safetyFlag = hasConditions && chronic.conditions.includes('heart');
  const humanReview = safetyFlag || overallLevel === 'high' || (hasConditions && poorAdherence);
  const escalation = humanReview ? ESCALATION.ORANGE : ESCALATION.GREEN;
  const escRule = findEscalationRule('الصحة', humanReview);

  return {
    id: 'health',
    domain: 'health',
    title: DOMAIN_META.health.label,
    icon: DOMAIN_META.health.icon,
    type,
    level: overallLevel,
    signals,
    summary,
    recommendation,
    // KB evidence
    ...kbEvidence,
    safetyFlag,
    humanReview,
    escalation,
    escalationRule: escRule,
    specialistType: escRule?.humanDestination ?? (humanReview ? 'طبيب أو أخصائي صحي' : null),
    disclaimer: governance.clinicalGuardrail,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT 2: PHYSICAL
// ═══════════════════════════════════════════════════════════════════════════════

function runPhysicalAgent(raw) {
  const activity    = evalActivityFrequency(raw[4]);
  const mobility    = evalMobilityDifficulty(raw[5]);
  const expectation = evalActivityExpectation(raw[6]);

  const overallLevel = maxLevel(activity.level, mobility.level);
  const hasMobilityIssue = raw[5] === 'moderate' || raw[5] === 'severe';
  const expectsDecrease = raw[6] === 'slight_decrease' || raw[6] === 'clear_decrease';
  const noActivity = raw[4] === 'none';

  const signals = [
    activity.signal,
    mobility.signal,
    expectation.signal,
  ].filter(Boolean);

  let type = overallLevel === 'low' ? 'stable' : 'risk';
  if (raw[6] === 'increase' && overallLevel === 'low') type = 'opportunity';

  // Select KB rule
  let primaryRuleId = null;
  if (hasMobilityIssue) {
    primaryRuleId = 'KB-P-03';
  } else if (noActivity) {
    primaryRuleId = 'KB-P-01';
  } else if (raw[4] === '1_2') {
    primaryRuleId = 'KB-P-02';
  } else if (expectsDecrease) {
    primaryRuleId = 'KB-P-04';
  }

  const kbEvidence = attachKBEvidence(primaryRuleId);

  let summary, recommendation;
  if (overallLevel === 'low' && !expectsDecrease) {
    summary = 'مستوى نشاطك البدني مناسب ولا توجد تحديات حركية واضحة.';
    recommendation = 'حافظ على روتين النشاط البدني بعد التقاعد لتعزيز صحتك ورفاهيتك.';
  } else if (overallLevel === 'moderate' || (overallLevel === 'low' && expectsDecrease)) {
    summary = 'هناك فرصة لتحسين مستوى النشاط البدني والحركة في مرحلة التقاعد.';
    recommendation = 'يُنصح بوضع برنامج تدريجي للنشاط البدني يناسب وضعك الصحي.';
  } else {
    summary = 'تبيّنت تحديات في الحركة والنشاط البدني تستدعي الاهتمام قبل التقاعد.';
    recommendation = 'يُنصح بمناقشة المختص لتصميم برنامج نشاط آمن ومناسب لوضعك.';
  }

  const humanReview = hasMobilityIssue && overallLevel === 'high';
  const escalation = humanReview ? ESCALATION.ORANGE : ESCALATION.GREEN;
  const escRule = findEscalationRule('الحركة', humanReview);

  return {
    id: 'physical',
    domain: 'physical',
    title: DOMAIN_META.physical.label,
    icon: DOMAIN_META.physical.icon,
    type,
    level: overallLevel,
    signals,
    summary,
    recommendation,
    ...kbEvidence,
    safetyFlag: false,
    humanReview,
    escalation,
    escalationRule: escRule,
    specialistType: escRule?.humanDestination ?? (humanReview ? 'أخصائي طب رياضي أو علاج طبيعي' : null),
    disclaimer: null,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT 3: PSYCHOLOGICAL
// ═══════════════════════════════════════════════════════════════════════════════

function runPsychologicalAgent(raw) {
  const feeling  = evalRetirementFeeling(raw[7]);
  const purpose  = evalPurposeClarity(raw[8]);
  const identity = evalWorkIdentityImpact(raw[9]);

  const overallLevel = maxLevel(feeling.level, maxLevel(purpose.level, identity.level));

  const signals = [
    feeling.signal,
    purpose.signal,
    identity.signal,
  ].filter(Boolean);

  const type = overallLevel === 'low' ? 'stable' : 'risk';

  // Select KB rule
  const highAnxiety = raw[7] === 'high_anxiety';
  const noPurpose = raw[8] === 'not_clear' || raw[8] === 'unsure';
  const bigIdentityImpact = raw[9] === 'major_impact' || raw[9] === 'moderate_impact';

  let primaryRuleId = null;
  if (highAnxiety && noPurpose) {
    primaryRuleId = 'KB-PSY-02';
  } else if (highAnxiety) {
    primaryRuleId = 'KB-PSY-01';
  } else if (noPurpose && bigIdentityImpact) {
    primaryRuleId = 'KB-PSY-02';
  }

  const kbEvidence = attachKBEvidence(primaryRuleId);

  let summary, recommendation;
  if (overallLevel === 'low') {
    summary = 'تبدو مستعدًا نفسيًا بشكل جيد للانتقال لمرحلة التقاعد.';
    recommendation = 'يساعد وضع روتين يومي وأهداف واضحة في الحفاظ على الشعور بالهدف.';
  } else if (overallLevel === 'moderate') {
    summary = 'هناك بعض المخاوف النفسية المتعلقة بالانتقال للتقاعد تستحق الاهتمام.';
    recommendation = 'يُنصح باستكشاف ما تحب القيام به بعد التقاعد مبكرًا لبناء شعور بالهدف والاتجاه.';
  } else {
    summary = 'تبيّن وجود قلق ملحوظ أو غموض حول الهدف والهوية بعد التقاعد.';
    recommendation = 'قد يكون التحدث مع مختص في الإرشاد النفسي مفيدًا للتعامل مع هذه المرحلة بثقة.';
  }

  const safetyFlag = raw[7] === 'high_anxiety' && raw[8] === 'not_clear';
  const humanReview = overallLevel === 'high' && safetyFlag;
  const escalation = humanReview ? ESCALATION.ORANGE : levelToEscalation(overallLevel);
  const escRule = findEscalationRule('النفسي', humanReview);

  return {
    id: 'psychological',
    domain: 'psychological',
    title: DOMAIN_META.psychological.label,
    icon: DOMAIN_META.psychological.icon,
    type,
    level: overallLevel,
    signals,
    summary,
    recommendation,
    ...kbEvidence,
    safetyFlag,
    humanReview,
    escalation,
    escalationRule: escRule,
    specialistType: escRule?.humanDestination ?? (humanReview ? 'مستشار نفسي أو أخصائي إرشاد' : null),
    disclaimer: 'لا يقدم وهج تشخيصًا نفسيًا، وتُحال الحالات التي تتطلب دعمًا متخصصًا للمختص.',
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT 4: SOCIAL
// ═══════════════════════════════════════════════════════════════════════════════

function runSocialAgent(raw) {
  const contact   = evalSocialContactChange(raw[10]);
  const network   = evalSupportNetwork(raw[11]);
  const community = evalCommunityInterest(raw[12]);

  const overallLevel = maxLevel(contact.level, network.level);
  const hasCommunityOpportunity = community.type === 'opportunity';

  const signals = [
    contact.signal,
    network.signal,
    community.signal,
  ].filter(Boolean);

  let type = overallLevel === 'low' ? 'stable' : 'risk';
  if (overallLevel === 'low' && hasCommunityOpportunity) type = 'opportunity';

  // Select KB rule
  let primaryRuleId = null;
  if (hasCommunityOpportunity) {
    primaryRuleId = 'KB-SOC-03';
  } else if (raw[11] === 'minimal' || raw[11] === 'limited') {
    primaryRuleId = 'KB-SOC-02';
  } else if (raw[10] === 'clear_decrease' || raw[10] === 'slight_decrease') {
    primaryRuleId = 'KB-SOC-01';
  }

  const kbEvidence = attachKBEvidence(primaryRuleId);

  let summary, recommendation;
  if (overallLevel === 'low') {
    summary = 'شبكة دعمك الاجتماعي قوية وتتوقع حفاظًا جيدًا على التواصل.';
    recommendation = hasCommunityOpportunity
      ? 'الانخراط في أنشطة مجتمعية أو تطوعية سيعزز شبكتك الاجتماعية أكثر.'
      : 'استمر في بناء العلاقات خارج بيئة العمل كاستعداد للتقاعد.';
  } else if (overallLevel === 'moderate') {
    summary = 'هناك فرصة لتوسيع شبكتك الاجتماعية وتنويعها خارج بيئة العمل.';
    recommendation = 'يُنصح بالتعرف على الأنشطة المجتمعية والمجموعات الاجتماعية قبيل التقاعد.';
  } else {
    summary = 'شبكة الدعم الاجتماعي تحتاج تعزيزًا، خاصة مع توقع انخفاض التواصل بعد التقاعد.';
    recommendation = 'يُعدّ بناء علاقات وشبكة اجتماعية متنوعة من أبرز أولويات مرحلة التقاعد.';
  }

  const humanReview = overallLevel === 'high';
  const escRule = findEscalationRule('الاجتماعي', humanReview);

  return {
    id: 'social',
    domain: 'social',
    title: DOMAIN_META.social.label,
    icon: DOMAIN_META.social.icon,
    type,
    level: overallLevel,
    signals,
    summary,
    recommendation,
    ...kbEvidence,
    safetyFlag: false,
    humanReview,
    escalation: levelToEscalation(overallLevel),
    escalationRule: escRule,
    specialistType: escRule?.humanDestination ?? null,
    disclaimer: null,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT 5: FINANCIAL
// ═══════════════════════════════════════════════════════════════════════════════

function runFinancialAgent(raw) {
  const clarity  = evalFinancialClarity(raw[13]);
  const pressure = evalFinancialPressure(raw[14]);
  const reserve  = evalEmergencyReserve(raw[15]);

  const overallLevel = maxLevel(clarity.level, maxLevel(pressure.level, reserve.level));

  const signals = [
    clarity.signal,
    pressure.signal,
    reserve.signal,
  ].filter(Boolean);

  const type = overallLevel === 'low' ? 'stable' : 'risk';

  // Select KB rule — compound first, then individual
  let primaryRuleId = null;
  const allThreeHigh = raw[13] === 'not_clear' && raw[14] === 'high' && (raw[15] === 'no' || raw[15] === 'unsure');
  if (allThreeHigh) {
    primaryRuleId = 'KB-FIN-04';
  } else if (raw[14] === 'high' || raw[14] === 'moderate') {
    primaryRuleId = 'KB-FIN-02';
  } else if (raw[15] === 'no' || raw[15] === 'unsure') {
    primaryRuleId = 'KB-FIN-03';
  } else if (raw[13] === 'not_clear' || raw[13] === 'limited') {
    primaryRuleId = 'KB-FIN-01';
  }

  const kbEvidence = attachKBEvidence(primaryRuleId);

  let summary, recommendation;
  if (overallLevel === 'low') {
    summary = 'وضعك المالي يبدو واضحًا ومستقرًا نسبيًا لمرحلة التقاعد.';
    recommendation = 'الاستمرار في مراجعة الخطة المالية بشكل دوري يساعد على الجاهزية الكاملة.';
  } else if (overallLevel === 'moderate') {
    summary = 'هناك بعض الغموض أو الضغط المالي المتوقع يستحق التخطيط المسبق.';
    recommendation = 'يُنصح بمراجعة مستشار مالي لتوضيح الصورة المالية بعد التقاعد.';
  } else {
    summary = 'تبيّن وجود ضغط مالي مرتفع أو غياب تصور مالي واضح لمرحلة التقاعد.';
    recommendation = 'يُنصح بالتواصل مع مستشار مالي متخصص لوضع خطة مالية واضحة قبل التقاعد.';
  }

  const humanReview = overallLevel === 'high';
  const escRule = findEscalationRule('المالي', humanReview);

  return {
    id: 'financial',
    domain: 'financial',
    title: DOMAIN_META.financial.label,
    icon: DOMAIN_META.financial.icon,
    type,
    level: overallLevel,
    signals,
    summary,
    recommendation,
    ...kbEvidence,
    safetyFlag: false,
    humanReview,
    escalation: humanReview ? ESCALATION.ORANGE : levelToEscalation(overallLevel),
    escalationRule: escRule,
    specialistType: escRule?.humanDestination ?? (humanReview ? 'مستشار مالي متخصص' : null),
    disclaimer: governance.financialGuardrail,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT 6: EXPERIENCE / PURPOSE (opportunity-first)
// ═══════════════════════════════════════════════════════════════════════════════

function runExperienceAgent(raw) {
  const continuation = evalExperienceContinuation(raw[16]);
  const modes        = evalExperienceModes(raw[17]);
  const identityImpact = evalWorkIdentityImpact(raw[9]);

  const wantsToContribute = raw[16] === 'yes' || raw[16] === 'maybe';
  const hasSpecificModes = modes.hasDecided;
  const wantsMentorOrKnowledge = Array.isArray(raw[17]) &&
    (raw[17].includes('mentoring') || raw[17].includes('knowledge_transfer'));
  const wantsVolunteer = Array.isArray(raw[17]) && raw[17].includes('volunteering');

  const signals = [
    continuation.signal,
    ...(modes.labels.length > 0 ? [`يفضّل: ${modes.labels.join('، ')}`] : []),
    identityImpact.signal,
  ].filter(Boolean);

  // Select KB rule — opportunity-first
  let primaryRuleId = null;
  if (wantsToContribute && wantsMentorOrKnowledge) {
    primaryRuleId = 'KB-EXP-02';
  } else if (wantsToContribute && wantsVolunteer) {
    primaryRuleId = 'KB-EXP-03';
  } else if (wantsToContribute && (raw[8] === 'not_clear' || raw[9] === 'major_impact')) {
    primaryRuleId = 'KB-EXP-04';
  } else if (wantsToContribute) {
    primaryRuleId = 'KB-EXP-01';
  }

  const kbEvidence = attachKBEvidence(primaryRuleId);

  let type, level, summary, recommendation;
  if (wantsToContribute && hasSpecificModes) {
    type = 'opportunity'; level = 'low';
    summary = `لديك رغبة واضحة في توظيف خبرتك عبر: ${modes.labels.join('، ')}.`;
    recommendation = 'وهج سيساعدك على استكشاف مسارات تناسب خبرتك واهتماماتك بعد التقاعد.';
  } else if (wantsToContribute) {
    type = 'opportunity'; level = 'low';
    summary = 'لديك رغبة في الاستمرار في توظيف خبرتك بعد التقاعد.';
    recommendation = 'استكشاف مجالات محددة للتوظيف كالإرشاد أو الاستشارات سيساعدك في تحديد المسار.';
  } else if (identityImpact.level === 'high') {
    type = 'risk'; level = 'moderate';
    summary = 'قد يكون للتوقف عن العمل تأثير على الشعور بالهدف والهوية.';
    recommendation = 'استكشاف أشكال مرنة من المشاركة قد يساعد في الحفاظ على الشعور بالإنجاز.';
  } else {
    type = 'stable'; level = 'low';
    summary = 'لديك مرونة في تحديد كيفية توظيف وقتك وخبرتك بعد التقاعد.';
    recommendation = 'التقاعد فرصة لاستكشاف اهتمامات جديدة إلى جانب توظيف خبرتك.';
  }

  return {
    id: 'experience',
    domain: 'experience',
    title: DOMAIN_META.experience.label,
    icon: DOMAIN_META.experience.icon,
    type,
    level,
    signals,
    summary,
    recommendation,
    experienceModes: modes.labels,
    ...kbEvidence,
    safetyFlag: false,
    humanReview: false,
    escalation: ESCALATION.GREEN,
    escalationRule: null,
    specialistType: null,
    disclaimer: null,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// WAHAJ ORCHESTRATOR — Cross-Agent Reasoning
// ═══════════════════════════════════════════════════════════════════════════════

function runOrchestrator(agents, raw) {
  const crossInsights = [];
  const priorities    = [];

  const health     = agents.find((a) => a.id === 'health');
  const physical   = agents.find((a) => a.id === 'physical');
  const psych      = agents.find((a) => a.id === 'psychological');
  const social     = agents.find((a) => a.id === 'social');
  const financial  = agents.find((a) => a.id === 'financial');
  const experience = agents.find((a) => a.id === 'experience');

  // ── Cross-insight 1: Health + Physical (KB-ORCH-01) ─────────────────────────
  const hasChronicCondition = Array.isArray(raw[2]) && raw[2].some((c) => c !== 'none');
  const lowActivity = raw[4] === 'none' || raw[4] === '1_2';
  const hasMobilityIssue = raw[5] === 'moderate' || raw[5] === 'severe';

  if (hasChronicCondition && (lowActivity || hasMobilityIssue)) {
    const kbEvidence = attachKBEvidence('KB-ORCH-01');
    crossInsights.push({
      id: 'cross_health_physical',
      domains: ['health', 'physical'],
      signals: [health.signals[0], physical.signals[0]].filter(Boolean),
      conclusion: 'لاحظ وهج ارتباطًا بين الحالات الصحية المزمنة وانخفاض مستوى النشاط البدني أو تحديات الحركة، مما يجعل الحفاظ على النشاط أولوية صحية محورية.',
      intervention: 'برنامج نشاط بدني تدريجي مُصمَّم مع مراعاة الحالة الصحية',
      ...kbEvidence,
    });
    priorities.push({
      id: 'priority_active_health',
      rank: 1,
      title: 'برنامج نشاط تدريجي مناسب',
      domains: ['health', 'physical'],
      action: 'تصميم روتين نشاط بدني تدريجي يناسب وضعك الصحي وقدراتك الحركية.',
      why: 'بناءً على وجود حالات صحية مزمنة مع انخفاض النشاط البدني أو تحديات في الحركة.',
      ...kbEvidence,
    });
  }

  // ── Cross-insight 2: Psychological + Social (KB-PSY-03) ─────────────────────
  const highAnxiety = raw[7] === 'high_anxiety' || raw[7] === 'some_anxiety';
  const weakNetwork = raw[11] === 'minimal' || raw[11] === 'limited';
  const expectedSocialDrop = raw[10] === 'clear_decrease' || raw[10] === 'slight_decrease';

  if (highAnxiety && (weakNetwork || expectedSocialDrop)) {
    const kbEvidence = attachKBEvidence('KB-PSY-03');
    crossInsights.push({
      id: 'cross_psych_social',
      domains: ['psychological', 'social'],
      signals: [psych.signals[0], social.signals[0]].filter(Boolean),
      conclusion: 'لاحظ وهج ارتباطًا بين القلق من التقاعد وضعف الشبكة الاجتماعية أو توقع تراجعها، مما يجعل بناء الروابط الاجتماعية أولوية للتكيّف النفسي.',
      intervention: 'دعم الانتقال النفسي والاجتماعي بشكل مترابط',
      ...kbEvidence,
    });
    priorities.push({
      id: 'priority_social_psych',
      rank: 2,
      title: 'دعم الانتقال النفسي والاجتماعي',
      domains: ['psychological', 'social'],
      action: 'بناء شبكة روابط اجتماعية متنوعة قبل التقاعد وتحديد هدف يومي واضح.',
      why: 'بناءً على القلق من الانتقال وضعف الشبكة الاجتماعية خارج بيئة العمل.',
      ...kbEvidence,
    });
  }

  // ── Cross-insight 3: Experience + Psychological + Social (KB-ORCH-02) ────────
  const wantsExperience = raw[16] === 'yes' || raw[16] === 'maybe';
  const strongWorkIdentity = raw[9] === 'major_impact' || raw[9] === 'moderate_impact';
  const wantsMentorOrConsult = Array.isArray(raw[17]) &&
    (raw[17].includes('mentoring') || raw[17].includes('consulting') ||
     raw[17].includes('training') || raw[17].includes('volunteering'));

  if (wantsExperience && (strongWorkIdentity || wantsMentorOrConsult)) {
    const kbEvidence = attachKBEvidence('KB-ORCH-02');
    crossInsights.push({
      id: 'cross_exp_psych_social',
      domains: ['experience', 'psychological', 'social'],
      signals: [experience.signals[0], psych.signals[1] ?? psych.signals[0]].filter(Boolean),
      conclusion: 'رغبتك في الاستفادة من خبرتك قد تساعد في الحفاظ على الشعور بالهدف وتعزيز التواصل الاجتماعي بعد التقاعد.',
      intervention: 'استكشاف فرص الإرشاد والاستشارات والتطوع كمسار تحقيق ذاتي',
      ...kbEvidence,
    });
    priorities.push({
      id: 'priority_experience_purpose',
      rank: 3,
      title: 'مسار توظيف الخبرة والهدف',
      domains: ['experience', 'psychological', 'social'],
      action: 'استكشاف فرص الإرشاد المهني، الاستشارات، أو التطوع بما يحافظ على شعورك بالهدف.',
      why: 'بناءً على رغبتك في الاستمرار مهنيًا وارتباط هويتك بالعمل.',
      ...kbEvidence,
    });
  }

  // ── Cross-insight 4: Financial + priority ────────────────────────────────────
  const highFinancialRisk = financial.level === 'high' || financial.level === 'moderate';
  const financialIsPriority = raw[18] === 'financial';
  if (highFinancialRisk && financialIsPriority) {
    const kbEvidence = attachKBEvidence('KB-FIN-04');
    crossInsights.push({
      id: 'cross_financial_priority',
      domains: ['financial', 'overall'],
      signals: [financial.signals[0], `الأولوية المحددة: ${raw[18]}`].filter(Boolean),
      conclusion: 'صنّف وهج الاستقرار المالي أولوية محورية استنادًا لإجاباتك وما ذكرته كشاغل رئيسي.',
      intervention: 'مراجعة مالية شاملة وتحديد خطة واضحة للدخل والمصروفات بعد التقاعد',
      ...kbEvidence,
    });
  }

  if (crossInsights.length === 0) {
    crossInsights.push({
      id: 'cross_general',
      domains: ['health', 'psychological', 'social'],
      signals: ['إجاباتك تُظهر مؤشرات إيجابية عبر معظم المجالات'],
      conclusion: 'يظهر وهج صورة متوازنة نسبيًا في مجالات التقاعد الستة. التحضير المبكر في المجالات المرصودة يعزز الجاهزية.',
      intervention: 'استمر في المتابعة الدورية عبر مسارات وهج',
      ...attachKBEvidence(null),
    });
  }

  // Stated priority
  const topPriority = evalTopPriority(raw[18], raw['18_text']);
  const priorityAlreadyCovered = priorities.some((p) => p.domains.includes(topPriority.topPriority));
  if (topPriority.topPriority && topPriority.topPriority !== 'none' && !priorityAlreadyCovered) {
    priorities.push({
      id: 'priority_stated',
      rank: priorities.length + 1,
      title: 'أولويتك التي حددتها',
      domains: [topPriority.topPriority],
      action: 'وهج سيولي هذا المجال اهتمامًا خاصًا في توصياته المخصصة.',
      why: 'بناءً على ما ذكرته كأبرز شاغل لك بعد التقاعد.',
      additionalContext: topPriority.additionalContext,
      ...attachKBEvidence(null),
    });
  }

  return { crossInsights, priorities: priorities.slice(0, 3) };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SAFETY / ESCALATION LAYER
// ═══════════════════════════════════════════════════════════════════════════════

function runSafetyLayer(agents) {
  return agents
    .filter((a) => a.humanReview || a.escalation !== ESCALATION.GREEN)
    .map((a) => ({
      domain: a.domain,
      title: a.title,
      level: a.level,
      escalation: a.escalation,
      escalationRule: a.escalationRule,
      specialistType: a.specialistType,
      signals: a.signals,
      guardrail: a.escalationRule?.guardrail ?? null,
      ruleBasis: a.escalationRule?.ruleBasis ?? null,
      priority: a.escalationRule?.priority ?? null,
      // Preserve the escalation rule's own sources for the modal
      escalationSources: a.escalationRule?.sources ?? [],
    }));
}

// ═══════════════════════════════════════════════════════════════════════════════
// OVERALL SUMMARY
// ═══════════════════════════════════════════════════════════════════════════════

function buildOverallSummary(agents, raw) {
  const highCount       = agents.filter((a) => a.level === 'high').length;
  const moderateCount   = agents.filter((a) => a.level === 'moderate').length;
  const opportunityCount = agents.filter((a) => a.type === 'opportunity').length;
  const topPriority     = evalTopPriority(raw[18], null);

  let summary;
  if (highCount >= 2) {
    summary = 'حلّل وهج إجاباتك وتبيّن وجود عدة مجالات تستدعي الاهتمام والمتابعة في مرحلة التقاعد. الأهم هو التخطيط المبكر والتواصل مع المختصين المناسبين.';
  } else if (highCount === 1 || moderateCount >= 2) {
    summary = 'الصورة العامة فيها مجالات إيجابية، مع بعض الجوانب التي تستحق الاهتمام والتخطيط قبيل التقاعد.';
  } else if (opportunityCount >= 2) {
    summary = 'تظهر صورتك المتكاملة مؤشرات إيجابية وفرصًا واعدة للاستفادة منها في مرحلة التقاعد.';
  } else {
    summary = 'تبدو صورتك العامة متوازنة. وهج يرافقك في بناء مسار واضح يحافظ على جودة حياتك بعد التقاعد.';
  }

  const topDomain = topPriority.topPriority && topPriority.topPriority !== 'none'
    ? `أشرت إلى اهتمامك الأبرز بمجال: ${DOMAIN_META[topPriority.topPriority]?.label ?? topPriority.topPriority}.`
    : '';

  return { summary, topDomain, highCount, moderateCount, opportunityCount };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ENTRY POINT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * runAnalysis(payload)
 *
 * @param {object} payload — from getStructuredPayload() { raw, byDomain, completedAt }
 * @returns {object} Full analysis results with KB evidence attached
 *
 * Pure synchronous function.
 * Replace internals with async agent calls when integrating real AI.
 */
export function runAnalysis(payload) {
  const { raw, completedAt } = payload;

  const agents = [
    runHealthAgent(raw),
    runPhysicalAgent(raw),
    runPsychologicalAgent(raw),
    runSocialAgent(raw),
    runFinancialAgent(raw),
    runExperienceAgent(raw),
  ];

  const { crossInsights, priorities } = runOrchestrator(agents, raw);
  const escalations = runSafetyLayer(agents);
  const overall = buildOverallSummary(agents, raw);

  return {
    completedAt,
    generatedAt: new Date().toISOString(),
    agents,
    crossInsights,
    priorities,
    escalations,
    overall,
    _meta: {
      engineVersion: '0.2.0-kb-integrated',
      kbVersion: '1.0',
      disclaimer: governance.prototypeNotice,
      readyForProductionWith: ['IBM Granite', 'Wahaj Knowledge Base', 'RAG', 'Expert validation'],
      aiRole: governance.aiRole,
      safetyRule: governance.safetyRule,
    },
  };
}
