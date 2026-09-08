import { useReducer, useCallback } from 'react';
import { AssessmentContext } from './AssessmentContextObject';
import { QUESTIONS, SECTIONS, buildEmptyAnswers } from '../data/questions';

// ─── Constants ────────────────────────────────────────────────────────────────
const TOTAL_SECTIONS = SECTIONS.length; // 6

// ─── State shape ─────────────────────────────────────────────────────────────
const initialState = {
  sectionIndex: 0,          // 0-based index into SECTIONS (0–5)
  answers: buildEmptyAnswers(),
  isComplete: false,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'SET_ANSWER': {
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.value },
      };
    }
    case 'SET_TEXT_ANSWER': {
      return {
        ...state,
        answers: { ...state.answers, [`${action.questionId}_text`]: action.value },
      };
    }
    case 'TOGGLE_MULTI': {
      const { questionId, value, exclusiveValue } = action;
      const current = state.answers[questionId] ?? [];

      let next;
      if (value === exclusiveValue) {
        // Selecting the exclusive option (e.g. "لا توجد") → only that value
        next = current.includes(value) ? [] : [value];
      } else {
        // Regular option: deselect exclusive if present, then toggle this value
        const withoutExclusive = current.filter((v) => v !== exclusiveValue);
        next = withoutExclusive.includes(value)
          ? withoutExclusive.filter((v) => v !== value)
          : [...withoutExclusive, value];
      }

      return {
        ...state,
        answers: { ...state.answers, [questionId]: next },
      };
    }
    case 'NEXT_SECTION': {
      if (state.sectionIndex >= TOTAL_SECTIONS - 1) return state;
      return { ...state, sectionIndex: state.sectionIndex + 1 };
    }
    case 'PREV_SECTION': {
      if (state.sectionIndex <= 0) return state;
      return { ...state, sectionIndex: state.sectionIndex - 1 };
    }
    case 'COMPLETE': {
      return { ...state, isComplete: true };
    }
    case 'RESTART': {
      return { ...initialState, answers: buildEmptyAnswers() };
    }
    default:
      return state;
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function AssessmentProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * Returns the IDs of any unanswered required questions in the given section.
   * Used for inline validation before advancing sections.
   */
  const getUnansweredInSection = useCallback((sIdx) => {
    const section = SECTIONS[sIdx];
    if (!section) return [];
    return section.questionIds.filter((qId) => {
      const q = QUESTIONS.find((q) => q.id === qId);
      if (!q || !q.required) return false;
      const answer = state.answers[qId];
      if (q.type === 'multi') return !Array.isArray(answer) || answer.length === 0;
      return answer === null || answer === undefined || answer === '';
    });
  }, [state.answers]);

  const setAnswer = useCallback((questionId, value) => {
    dispatch({ type: 'SET_ANSWER', questionId, value });
  }, []);

  const setTextAnswer = useCallback((questionId, value) => {
    dispatch({ type: 'SET_TEXT_ANSWER', questionId, value });
  }, []);

  const toggleMulti = useCallback((questionId, value, exclusiveValue) => {
    dispatch({ type: 'TOGGLE_MULTI', questionId, value, exclusiveValue });
  }, []);

  const goNext = useCallback(() => {
    if (state.sectionIndex === TOTAL_SECTIONS - 1) {
      dispatch({ type: 'COMPLETE' });
    } else {
      dispatch({ type: 'NEXT_SECTION' });
    }
  }, [state.sectionIndex]);

  const goPrev = useCallback(() => dispatch({ type: 'PREV_SECTION' }), []);
  const restart = useCallback(() => dispatch({ type: 'RESTART' }), []);

  /**
   * Structured payload ready for the Wahaj Orchestrator and specialized agents.
   * Grouped by domain so each agent can consume its slice directly.
   * UNCHANGED from original — same output format.
   */
  const getStructuredPayload = useCallback(() => {
    const domainMap = {};
    QUESTIONS.forEach((q) => {
      q.domain.forEach((d) => {
        if (!domainMap[d]) domainMap[d] = {};
        domainMap[d][`q${q.id}`] = state.answers[q.id];
        if (q.type === 'single-with-text') {
          domainMap[d][`q${q.id}_text`] = state.answers[`${q.id}_text`];
        }
      });
    });
    return {
      completedAt: new Date().toISOString(),
      raw: state.answers,
      byDomain: domainMap,
    };
  }, [state.answers]);

  const value = {
    state,
    sectionIndex: state.sectionIndex,
    totalSections: TOTAL_SECTIONS,
    isComplete: state.isComplete,
    getUnansweredInSection,
    setAnswer,
    setTextAnswer,
    toggleMulti,
    goNext,
    goPrev,
    restart,
    getStructuredPayload,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}
