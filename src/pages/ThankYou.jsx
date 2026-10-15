import { Link, Navigate, useLocation } from "react-router-dom";
import {
  ArrowIcon,
  CameraIcon,
  CheckCircleIcon,
  CheckIcon,
  GlobeIcon,
  LeafIcon,
  SparkleIcon,
  StarIcon,
  TagHeartIcon,
  UtensilsIcon,
  PenIcon,
} from "../components/Icons.jsx";
import "./ThankYou.css";

// The "Palate Points" strip is in the design, but there is no points system in the
// project scope (no customer accounts). Keep this false unless you build one,
// otherwise customers would be promised points they never receive.
const SHOW_PALATE_POINTS = false;

const ratingKeys = [
  "food_quality",
  "service",
  "cleanliness",
  "staff_behaviour",
  "overall_satisfaction",
];

export default function ThankYou() {
  const { state } = useLocation();

  // Only show this page right after a successful submission.
  if (!state?.submitted) return <Navigate to="/feedback" replace />;

  const { submissionId, ratings, submittedAt } = state;

  const values = ratings ? ratingKeys.map((k) => ratings[k]).filter(Boolean) : [];
  const average = values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
  const filledStars = average ? Math.round(average) : 0;

  const formattedId = submissionId != null ? `#FJ-${String(submissionId).padStart(4, "0")}` : null;
  const isoTime = submittedAt ? new Date(submittedAt).toISOString() : undefined;

  return (
    <main className="ty">
      <p className="ty__eyebrow"><span /> Table sentiment logged <span /></p>

      {/* Medal */}
      <div className="medal" aria-hidden="true">
        <span className="medal__glow" />
        <div className="medal__ring">
          <div className="medal__core"><CheckIcon width={46} height={46} /></div>
        </div>
        <span className="medal__spark"><SparkleIcon width={18} height={18} /></span>
        <span className="medal__leaf"><LeafIcon width={14} height={14} /></span>
      </div>

      <h1 className="ty__title">Thank you for sharing your experience with Flavour Junction!</h1>
      <p className="ty__text">
        Your feedback has been delivered directly to Head Chef  and our management team.
        We cherish your thoughts and strive to make every visit memorable.
      </p>

      {/* Kitchen note */}
      <section className="note-card">
        <div className="note-card__top">
          <span className="note-card__icon"><UtensilsIcon width={22} height={22} /></span>
          <div>
            <p className="note-card__label">Kitchen note</p>
            <blockquote>
              “Every plate we serve is a dialogue. Thank you for helping our brigade refine every nuance of flavor.”
            </blockquote>
            <p className="note-card__sign">— Head Chef  &amp; Service Team</p>
          </div>
        </div>

        <dl className="summary">
          {formattedId && (
            <div>
              <dt>Submission ID</dt>
              <dd className="summary__id">{formattedId}</dd>
            </div>
          )}
          <div>
            <dt>Logged Time</dt>
            <dd><span className="live-dot" aria-hidden="true" /><time dateTime={isoTime}>Just now</time></dd>
          </div>
          {average && (
            <div>
              <dt>Category Ratings</dt>
              <dd className="summary__stars" aria-label={`Average rating ${average.toFixed(1)} out of 5`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <StarIcon key={n} width={17} height={17} filled={n <= filledStars} />
                ))}
                <strong>{average.toFixed(1)}/5</strong>
              </dd>
            </div>
          )}
        </dl>
      </section>

      {SHOW_PALATE_POINTS && (
        <section className="points">
          <span className="points__icon"><TagHeartIcon width={20} height={20} /></span>
          <div>
            <strong>Palate Points Credited</strong>
            <p>50 points added to your dining profile</p>
          </div>
          <CheckCircleIcon width={26} height={26} className="points__tick" />
        </section>
      )}

      <div className="ty__actions">
        <Link to="/" className="btn-main">Back to Home <ArrowIcon width={18} height={18} /></Link>
        <Link to="/feedback" className="btn-ghost"><PenIcon width={18} height={18} /> Submit Another Response</Link>
      </div>

      <div className="follow">
        <span>Follow our culinary journal</span>
        <a href="#" aria-label="Instagram"><CameraIcon width={18} height={18} /></a>
        <a href="#" aria-label="Website"><GlobeIcon width={18} height={18} /></a>
      </div>

      <svg className="sprig" viewBox="0 0 320 70" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <path d="M10 52 Q75 40 150 34" />
        <path d="M170 34 Q245 40 310 52" />
        <path d="M160 14 C150 24 150 46 160 58 C170 46 170 24 160 14Z" />
        <circle cx="160" cy="64" r="1.6" />
        <path d="M45 48c4-8 12-10 18-8-3 7-10 10-18 8zM85 44c4-8 12-10 18-8-3 7-10 10-18 8zM118 38c4-8 12-9 18-7-3 7-10 9-18 7z" />
        <path d="M275 48c-4-8-12-10-18-8 3 7 10 10 18 8zM235 44c-4-8-12-10-18-8 3 7 10 10 18 8zM202 38c-4-8-12-9-18-7 3 7 10 9 18 7z" />
      </svg>
    </main>
  );
}
