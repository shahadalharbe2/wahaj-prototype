/**
 * Wahaj Knowledge Base Service
 * ─────────────────────────────
 * Single access point to src/data/wahaj-knowledge-base.json.
 *
 * Provides pure lookup functions so the rest of the codebase never reads
 * the JSON directly. When IBM Granite / RAG replaces this layer, only this
 * file needs to change.
 *
 * SAFETY CONTRACT:
 *  - Never fabricate sources.
 *  - Never display an official organization name unless explicitly mapped
 *    in the JSON for that rule.
 *  - If a rule has no verified source mapping, return the prototype notice.
 *
 * No external API. No LLM. Pure local JSON access.
 */

import KB from '../data/wahaj-knowledge-base.json';

// ── Internal lookup maps (built once at module load) ─────────────────────────

/** Map ruleId → knowledgeRule */
const _ruleMap = Object.fromEntries(
  KB.knowledgeRules.map((r) => [r.ruleId, r])
);

/** Map sourceId → source */
const _sourceMap = Object.fromEntries(
  KB.sourceRegistry.map((s) => [s.id, s])
);

/**
 * Real escalation rules only (filter out the schema-documentation rows
 * that have null trigger/level and descriptive-string ruleIds).
 */
const _escalationRules = KB.humanEscalationRules.filter(
  (r) => r.trigger !== null && r.level !== null
);

/** Map escalation ruleId → escalation rule */
const _escalationMap = Object.fromEntries(
  _escalationRules.map((r) => [r.ruleId, r])
);

// ── Public API ────────────────────────────────────────────────────────────────

/** Governance object from the knowledge base */
export const governance = KB.governance;

/** Full source registry array */
export const sourceRegistry = KB.sourceRegistry;

/**
 * getRuleById(ruleId)
 * Returns the knowledge rule with that ID, or null.
 */
export function getRuleById(ruleId) {
  return _ruleMap[ruleId] ?? null;
}

/**
 * getRulesForAgent(agentDomainAr)
 * Returns all knowledge rules whose `agent` field matches the Arabic domain label.
 * e.g. getRulesForAgent('الصحة') → [KB-H-01, KB-H-02, …]
 */
export function getRulesForAgent(agentDomainAr) {
  return KB.knowledgeRules.filter((r) => r.agent === agentDomainAr);
}

/**
 * getSourceById(sourceId)
 * Returns the source entry from the registry, or null.
 */
export function getSourceById(sourceId) {
  return _sourceMap[sourceId] ?? null;
}

/**
 * getSourcesForRule(ruleId)
 * Returns the sources[] array embedded in the rule itself.
 * Falls back to looking up each sourceId in the registry.
 * Returns [] if the rule doesn't exist.
 */
export function getSourcesForRule(ruleId) {
  const rule = _ruleMap[ruleId];
  if (!rule) return [];
  // Prefer inline sources; fall back to registry lookup
  if (rule.sources && rule.sources.length > 0) return rule.sources;
  return rule.sourceIds.map((id) => _sourceMap[id]).filter(Boolean);
}

/**
 * getEscalationRule(ruleId)
 * Returns a humanEscalationRule by ruleId, or null.
 */
export function getEscalationRule(ruleId) {
  return _escalationMap[ruleId] ?? null;
}

/**
 * getEscalationRulesForDomain(domainAr)
 * Returns all escalation rules matching a domain (partial match).
 */
export function getEscalationRulesForDomain(domainAr) {
  return _escalationRules.filter((r) => r.domain && r.domain.includes(domainAr));
}

/**
 * resolveValidationLabel(validationStatus)
 *
 * Maps a raw validationStatus string to a user-facing Arabic label + a boolean
 * indicating whether it is officially backed.
 *
 * Rules:
 *  - If the text includes "prototype" or "heuristic" (case-insensitive)
 *    → prototype label
 *  - If it includes "مصدر رسمي" or "Official" or "WHO guideline" or "GOSI"
 *    → official label
 *  - Otherwise use the raw text but mark as prototype
 */
export function resolveValidationLabel(validationStatus) {
  if (!validationStatus) {
    return { label: 'قاعدة تجريبية للعرض — تتطلب اعتماد مختص', isOfficial: false };
  }
  const lower = validationStatus.toLowerCase();
  if (lower.includes('prototype') || lower.includes('heuristic')) {
    return { label: 'قاعدة تجريبية للعرض — تتطلب اعتماد مختص', isOfficial: false };
  }
  if (
    validationStatus.includes('مصدر رسمي') ||
    lower.includes('official') ||
    lower.includes('who guideline') ||
    lower.includes('hard safety') ||
    lower.includes('governance') ||
    lower.includes('core differentiator') ||
    validationStatus.includes('قاعدة مصدرية') ||
    validationStatus.includes('مدعومة')
  ) {
    return { label: 'مدعومة بمصدر موثوق', isOfficial: true };
  }
  // Specific Arabic statuses in the KB
  if (
    validationStatus.includes('MVP') ||
    validationStatus.includes('cross-agent') ||
    validationStatus.includes('Cross-agent') ||
    validationStatus.includes('فرصة')
  ) {
    return { label: validationStatus, isOfficial: false };
  }
  // Default
  return { label: validationStatus, isOfficial: false };
}

/**
 * PROTOTYPE_NOTICE
 * The canonical Arabic notice for prototype/unvalidated rules.
 * Use this everywhere instead of raw string literals.
 */
export const PROTOTYPE_NOTICE = 'قاعدة تجريبية للعرض — تتطلب اعتماد مختص';

export default KB;
