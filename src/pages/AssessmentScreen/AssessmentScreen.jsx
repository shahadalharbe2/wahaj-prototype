import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AssessmentScreen.module.css';
import {
  WahajLogo,
  Button,
  QuestionCard,
  DomainStepper,
  SectionTransition,
} from '../../components';
import { useAssessment } from '../../context/useAssessment';
import { QUESTIONS, SECTIONS } from '../../data/questions';
import { startNewAssessmentSession } from '../../services/beneficiaryCounter.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build the next-button label given the next section (or null if last). */
function nextButtonLabel(nextSection) {
  if (!nextSection) return 'اكتشف مساري مع وهج ✨';
  return `التالي: ${nextSection.label} →`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AssessmentScreen() {
  const navigate = useNavigate();
  const {
    sectionIndex,
    totalSections,
    isComplete,
    getUnansweredInSection,
    goNext,
    goPrev,
  } = useAssessment();

  // Generate a fresh session ID when the user first enters the assessment.
  // This runs once on mount — it is the canonical "new journey has started" signal.
  // The session ID is later checked by countCompletedAssessment() to prevent
  // double-counting if the user refreshes or revisits results.
  useEffect(() => {
    startNewAssessmentSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Validation errors: { forSection: number, ids: Set<number> }
  // Storing the section index alongside the IDs means errors are automatically
  // invalidated when the user moves to a different section — no useEffect needed.
  const [validationState, setValidationState] = useState({ forSection: -1, ids: new Set() });

  // Section-transition overlay state
  // When truthy: { completedSection, nextSection|null }
  const [transition, setTransition] = useState(null);

  // Refs keyed by question id — used to scroll to first unanswered question
  const questionRefs = useRef({});

  // Navigate to completion screen when context signals complete
  useEffect(() => {
    if (isComplete) navigate('/assessment/complete');
  }, [isComplete, navigate]);

  // Derive: errors only apply when they were set for the current section
  const errorIds = validationState.forSection === sectionIndex
    ? validationState.ids
    : new Set();

  // ── Derived values ────────────────────────────────────────────────────────
  const currentSection  = SECTIONS[sectionIndex];
  const nextSection     = SECTIONS[sectionIndex + 1] ?? null;
  const prevSection     = SECTIONS[sectionIndex - 1] ?? null;
  const isFirstSection  = sectionIndex === 0;
  const isLastSection   = sectionIndex === totalSections - 1;

  // The 3 question objects for this section
  const sectionQuestions = currentSection.questionIds.map(
    (qId) => QUESTIONS.find((q) => q.id === qId),
  );

  // ── Navigation handlers ───────────────────────────────────────────────────

  function handleNext() {
    const unanswered = getUnansweredInSection(sectionIndex);

    if (unanswered.length > 0) {
      // Mark all unanswered questions as errored for the current section
      setValidationState({ forSection: sectionIndex, ids: new Set(unanswered) });

      // Scroll to the first unanswered question
      const firstId = unanswered[0];
      const el = questionRefs.current[firstId];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // All answered — clear errors
    setValidationState({ forSection: -1, ids: new Set() });

    if (isLastSection) {
      // Last section → mark complete (navigates via useEffect)
      goNext();
    } else {
      // Show transition overlay, then advance
      setTransition({ completedSection: currentSection, nextSection });
    }
  }

  function handlePrev() {
    setValidationState({ forSection: -1, ids: new Set() });
    if (isFirstSection) {
      navigate('/');
    } else {
      goPrev();
    }
  }

  const handleTransitionDone = useCallback(() => {
    setTransition(null);
    goNext();
  }, [goNext]);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <main className={styles.page}>

      {/* ── Sticky header ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <WahajLogo size="sm" />
          <span className={styles.assessmentLabel}>تقييم وهج 360°</span>
        </div>
      </header>

      {/* ── Domain stepper ── */}
      <div className={styles.stepperZone}>
        <div className={styles.stepperInner}>
          <DomainStepper currentSectionIndex={sectionIndex} />
        </div>
      </div>

      {/* ── Section header ── */}
      <div className={styles.sectionHeader}>
        <div className={styles.sectionHeaderInner}>
          <div className={styles.sectionMeta}>
            <span className={styles.sectionCounter}>
              المحور {sectionIndex + 1} من {totalSections}
            </span>
            <span className={styles.sectionQuestionCount}>
              {currentSection.questionIds.length} أسئلة
            </span>
          </div>
          <div className={styles.sectionTitleRow}>
            <span className={styles.sectionIcon} aria-hidden="true">
              {currentSection.icon}
            </span>
            <h1 className={styles.sectionTitle}>{currentSection.label}</h1>
          </div>
          <p className={styles.sectionDescription}>{currentSection.description}</p>
        </div>
      </div>

      {/* ── Questions ── */}
      <section className={styles.questionsArea} aria-label="أسئلة المحور الحالي">
        <div className={styles.questionsInner}>
          {sectionQuestions.map((question, idx) => (
            <div
              key={question.id}
              className={styles.questionWrapper}
              ref={(el) => { questionRefs.current[question.id] = el; }}
            >
              {/* Question number badge */}
              <div className={styles.questionNumber} aria-hidden="true">
                {idx + 1}
              </div>

              <QuestionCard
                question={question}
                showError={errorIds.has(question.id)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Navigation ── */}
      <nav className={styles.navBar} aria-label="التنقل بين المحاور">
        <div className={styles.navInner}>
          <Button
            variant="ghost"
            size="md"
            onClick={handlePrev}
            aria-label={
              isFirstSection
                ? 'العودة إلى الرئيسية'
                : `العودة إلى محور ${prevSection?.label}`
            }
          >
            {isFirstSection ? '← الرئيسية' : `← ${prevSection?.shortLabel}`}
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleNext}
            aria-label={nextButtonLabel(nextSection)}
          >
            {nextButtonLabel(nextSection)}
          </Button>
        </div>

        {/* Overall progress footnote */}
        <p className={styles.progressFootnote} aria-hidden="true">
          18 سؤالًا • 6 محاور • 3–5 دقائق
        </p>
      </nav>

      {/* ── Section transition overlay ── */}
      {transition && (
        <SectionTransition
          completedSection={transition.completedSection}
          nextSection={transition.nextSection}
          onDone={handleTransitionDone}
        />
      )}
    </main>
  );
}
