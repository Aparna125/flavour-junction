import { useEffect, useRef } from "react";
import { CloseIcon, MailIcon, SendIcon, StarIcon } from "../Icons.jsx";
import { PILLARS, OVERALL, formatId, formatScore, formatDateTime, capitalize, highlight } from "../../utils/feedbackUi.jsx";
import "./FeedbackSheet.css";

const stars = (n) =>
  [1, 2, 3, 4, 5].map((i) => <StarIcon key={i} width={16} height={16} filled={i <= Math.round(n)} />);

/** Bottom sheet on phones, side panel on larger screens. */
export default function FeedbackSheet({ item, onClose, term }) {
  const closeBtn = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  const overall = item.ratings[OVERALL.key];

  return (
    <div className="sheet-wrap">
      <div className="sheet-backdrop" onClick={onClose} />
      <section className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
        <span className="sheet__grip" aria-hidden="true" />

        <header className="sheet__bar">
          <div className="sheet__who">
            <span className="tag">Feedback {formatId(item.id)}</span>
            <span className="sheet__name">{item.name || "Anonymous guest"}</span>
          </div>
          <button ref={closeBtn} type="button" className="sheet__close" onClick={onClose} aria-label="Close details">
            <CloseIcon width={20} height={20} />
          </button>
        </header>

        <div className="sheet__body">
          <article className="panel">
            <div className="panel__top">
              <div>
                <h2 id="sheet-title">Feedback Review</h2>
                <p className="panel__date">{formatDateTime(item.createdAt)}</p>
              </div>
              <div className="score">
                <strong>{overall.toFixed(1)}</strong>
                <span>Overall rating</span>
              </div>
            </div>

            <div className="contact">
              <MailIcon width={22} height={22} />
              {item.email ? (
                <>
                  <span className="contact__email">{item.email}</span>
                  <a className="contact__btn" href={`mailto:${item.email}`}>
                    Contact <SendIcon width={16} height={16} />
                  </a>
                </>
              ) : (
                <span className="contact__none">No email left by this guest</span>
              )}
            </div>
          </article>

          <article className="panel">
            <h3 className="panel__label">Category ratings</h3>
            <ul className="pillars">
              {PILLARS.map(({ key, label, Icon }) => (
                <li key={key}>
                  <span className="pillars__name"><Icon width={20} height={20} /> {label}</span>
                  <span className="pillars__stars" aria-label={`${item.ratings[key]} out of 5`}>
                    {stars(item.ratings[key])}
                    <strong>{item.ratings[key].toFixed(1)}</strong>
                  </span>
                </li>
              ))}
            </ul>
            <div className="overall">
              <span className="overall__name"><OVERALL.Icon width={20} height={20} /> {OVERALL.label}</span>
              <strong>{overall.toFixed(1)} / 5.0</strong>
            </div>
          </article>

          <article className="panel">
            <h3 className="panel__label">Written feedback</h3>
            <blockquote className="verbatim">“{highlight(item.comment, term)}”</blockquote>

            <div className="sentiment-row">
              <span className={`pill pill--${item.sentiment}`}>{capitalize(item.sentiment)}</span>
              <span className="sentiment-row__score">Sentiment score {formatScore(item.score)}</span>
            </div>
            <p className="sentiment-row__note">
              Sentiment is estimated automatically and can misread sarcasm or mixed opinions. Use it alongside your own judgement.
            </p>
          </article>
        </div>

        <footer className="sheet__foot">
          <button type="button" className="btn-close" onClick={onClose}>Close</button>
        </footer>
      </section>
    </div>
  );
}
