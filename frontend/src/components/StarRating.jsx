import { useRef } from "react";
import { StarIcon } from "./Icons.jsx";
import "./StarRating.css";

export const ratingWords = ["", "Very poor", "Poor", "Average", "Good", "Excellent"];

/**
 * Accessible 1-5 star selector (radio group with arrow-key support).
 */
export default function StarRating({ name, label, value, onChange, describedBy }) {
  const refs = useRef([]);

  const move = (next) => {
    const n = Math.min(5, Math.max(1, next));
    onChange(n);
    refs.current[n - 1]?.focus();
  };

  const onKeyDown = (e, star) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); move(star + 1); }
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); move(star - 1); }
  };

  return (
    <div className="stars" role="radiogroup" aria-label={label} aria-describedby={describedBy}>
      <div className="stars__row">
        {[1, 2, 3, 4, 5].map((star) => {
          const checked = value === star;
          // Roving tabindex: the selected star (or the first one) is the tab stop.
          const tabbable = checked || (!value && star === 1);
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={`${star} star${star > 1 ? "s" : ""}, ${ratingWords[star]}`}
              tabIndex={tabbable ? 0 : -1}
              ref={(el) => (refs.current[star - 1] = el)}
              className={`stars__btn ${star <= value ? "stars__btn--on" : ""}`}
              onClick={() => onChange(star)}
              onKeyDown={(e) => onKeyDown(e, star)}
              data-name={name}
            >
              <StarIcon width={34} height={34} filled={star <= value} />
            </button>
          );
        })}
      </div>
      <span className="stars__value" aria-live="polite">
        {value ? `${value}/5 · ${ratingWords[value]}` : "--"}
      </span>
    </div>
  );
}
