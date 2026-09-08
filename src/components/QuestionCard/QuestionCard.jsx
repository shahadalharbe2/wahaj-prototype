import styles from './QuestionCard.module.css';
import { useAssessment } from '../../context/useAssessment';

// ─── Single-option item ───────────────────────────────────────────────────────
function SingleOption({ option, questionId, selected, onSelect }) {
  const id = `q${questionId}_${option.value}`;
  return (
    <label
      htmlFor={id}
      className={`${styles.option} ${selected ? styles['option--selected'] : ''}`}
    >
      <input
        id={id}
        type="radio"
        name={`q${questionId}`}
        value={option.value}
        checked={selected}
        onChange={() => onSelect(option.value)}
        className={styles.hiddenInput}
      />
      <span className={styles.optionIndicator} aria-hidden="true">
        {selected ? '●' : '○'}
      </span>
      <span className={styles.optionLabel}>{option.label}</span>
    </label>
  );
}

// ─── Multi-option item ────────────────────────────────────────────────────────
function MultiOption({ option, questionId, selected, onToggle }) {
  const id = `q${questionId}_${option.value}`;
  return (
    <label
      htmlFor={id}
      className={`${styles.option} ${selected ? styles['option--selected'] : ''}`}
    >
      <input
        id={id}
        type="checkbox"
        name={`q${questionId}`}
        value={option.value}
        checked={selected}
        onChange={() => onToggle(option.value)}
        className={styles.hiddenInput}
      />
      <span className={styles.optionIndicator} aria-hidden="true">
        {selected ? '☑' : '☐'}
      </span>
      <span className={styles.optionLabel}>{option.label}</span>
    </label>
  );
}

// ─── Main QuestionCard ────────────────────────────────────────────────────────
export function QuestionCard({ question, showError }) {
  const { state, setAnswer, toggleMulti, setTextAnswer } = useAssessment();
  const answer = state.answers[question.id];
  const textAnswer = state.answers[`${question.id}_text`] ?? '';

  const isSingle = question.type === 'single' || question.type === 'single-with-text';
  const isMulti  = question.type === 'multi';

  return (
    <div className={styles.card}>
      {/* Question text */}
      <p className={styles.questionText}>{question.text}</p>

      {/* Hint for multi-select */}
      {question.hint && (
        <p className={styles.hint}>{question.hint}</p>
      )}

      {/* Validation error */}
      {showError && (
        <p className={styles.error} role="alert">
          يرجى اختيار إجابة للمتابعة
        </p>
      )}

      {/* Options list */}
      <div
        className={styles.options}
        role={isMulti ? 'group' : undefined}
        aria-label={isMulti ? question.text : undefined}
      >
        {question.options.map((option) => {
          if (isSingle) {
            return (
              <SingleOption
                key={option.value}
                option={option}
                questionId={question.id}
                selected={answer === option.value}
                onSelect={(val) => setAnswer(question.id, val)}
              />
            );
          }
          if (isMulti) {
            const selected = Array.isArray(answer) && answer.includes(option.value);
            return (
              <MultiOption
                key={option.value}
                option={option}
                questionId={question.id}
                selected={selected}
                onToggle={(val) =>
                  toggleMulti(question.id, val, question.exclusiveValue)
                }
              />
            );
          }
          return null;
        })}
      </div>

      {/* Optional free-text for single-with-text */}
      {question.type === 'single-with-text' && (
        <div className={styles.textFieldWrap}>
          <textarea
            className={styles.textField}
            placeholder={question.textPlaceholder}
            value={textAnswer}
            onChange={(e) => setTextAnswer(question.id, e.target.value)}
            rows={3}
            aria-label={question.textPlaceholder}
          />
        </div>
      )}
    </div>
  );
}
