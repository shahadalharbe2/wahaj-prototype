import { useContext } from 'react';
import { AssessmentContext } from './AssessmentContextObject';

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error('useAssessment must be used inside AssessmentProvider');
  return ctx;
}
