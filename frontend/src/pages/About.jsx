import { useState } from "react";
import { Link } from "react-router-dom";
import aboutHero from "../Images/about-hero.jpg"
import keralaFishFry from "../Images/kerala-fish-fry.jpg";
import keralaMeenCurry from "../Images/kerala-meen-fish-curry.jpg";
import {
  LeafIcon,
  UtensilsIcon,
  ArrowIcon,
  PenIcon,
  ChartIcon,
  EyeIcon,
  SproutIcon,
  BulbIcon,
  HandHeartIcon,
  ChatPlusIcon,
} from "../components/Icons.jsx";
import "./About.css";

const phases = [
  {
    label: "Share",
    time: "2 mins",
    Icon: PenIcon,
    text: "Take 2 minutes to rate food, service, and ambience right from your table or after you return home.",
  },
  {
    label: "Analyse",
    time: "Instant",
    Icon: ChartIcon,
    text: "Your written comment is read by a sentiment tool that marks it positive, neutral or negative, so patterns are easy to spot.",
  },
  {
    label: "Observe",
    time: "Daily",
    Icon: EyeIcon,
    text: "Our manager reviews the ratings, charts and comments each morning to see what guests love and what needs attention.",
  },
  {
    label: "Evolve",
    time: "Ongoing",
    Icon: SproutIcon,
    text: "Insights guide changes to our menu, service rhythm and cellar selections in the weeks that follow.",
  },
];

const notes = [
  {
    title: "Immediate Kitchen Reflection",
    text: "Insights stream directly into the morning chef line-up to fine-tune taste profiles, pairing balances, and texture notes.",
    Icon: BulbIcon,
  },
  {
    title: "Personal Hospitality Touch",
    text: "Every detailed guest review is personally read by our general manager to ensure your dining habits feel recognized upon return.",
    Icon: HandHeartIcon,
  },
];

export default function About() {
  const [step, setStep] = useState(0);
  const phase = phases[step];
  const isLast = step === phases.length - 1;

  return (
    <main className="about">
      {/* Hero */}
      <section className="about-hero">
        <img src={aboutHero} alt="" className="about-hero__bg" />
        <div className="about-hero__shade" />
        <div className="about-hero__content">
          <span className="chip chip--dark">
            <LeafIcon width={14} height={14} /> Our philosophy
          </span>
          <h1>About Flavour Junction</h1>
          <p>Preserving the soul of Kerala's coastal cuisine through authentic flavours, warm hospitality, and meaningful guest feedback.</p>
        </div>
      </section>

      {/* Craft of listening */}
      <section className="craft card">
        <div className="craft__text">
          <p className="card-label">
            <UtensilsIcon width={16} height={16} /> The Art of Coastal Hospitality
          </p>
          <p>
            At Flavour Junction, every meal is inspired by the rich culinary 
            heritage of Kerala. From freshly sourced seafood and traditional spice blends to
             recipes passed down through generations, we bring the authentic taste of the Malabar 
             coast to your table.
          </p>
          <p>
           But a memorable dining experience goes beyond the food. We believe that listening
            to our guests is just as important as preparing every dish with care. Your thoughts on our 
            flavours, service, and ambience help us preserve our traditions while continually improving the way we serve you.
          </p>
        </div>

        <div className="craft__photos">
          <figure>
            <img src={keralaMeenCurry} alt="Roasted meat with glazed carrots" />
            <figcaption>Kerala Meen Curry</figcaption>
          </figure>
          <figure>
            <img src={keralaFishFry} alt="Candlelit dining room full of guests" />
            <figcaption>Kerala Fish Fry</figcaption>
          </figure>
        </div>
      </section>

      {/* How feedback works */}
      <section className="loop">
        <p className="eyebrow">Continuous loop</p>
        <h2 className="section-title">How your feedback works</h2>
        <p className="loop__intro">
          Tap each phase to observe how your dinner thoughts shape tomorrow's service.
        </p>

        <div className="tabs" role="tablist" aria-label="Feedback phases">
          {phases.map((p, i) => (
            <button
              key={p.label}
              role="tab"
              id={`phase-tab-${i}`}
              aria-selected={i === step}
              aria-controls="phase-panel"
              className={`tab ${i === step ? "tab--active" : ""}`}
              onClick={() => setStep(i)}
            >
              <span className="tab__num">{String(i + 1).padStart(2, "0")}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        <article
          className="phase card"
          id="phase-panel"
          role="tabpanel"
          aria-labelledby={`phase-tab-${step}`}
        >
          <div className="phase__top">
            <span className="phase__icon"><phase.Icon width={24} height={24} /></span>
            <div className="phase__title">
              <small>Phase {String(step + 1).padStart(2, "0")} of {String(phases.length).padStart(2, "0")}</small>
              <h3>{phase.label}</h3>
            </div>
            <span className="phase__time">{phase.time}</span>
          </div>

          <p className="phase__text">{phase.text}</p>

          <div className="phase__footer">
            <div className="dots" aria-hidden="true">
              {phases.map((_, i) => (
                <span key={i} className={i === step ? "dot dot--on" : "dot"} />
              ))}
            </div>
            <button
              className="phase__next"
              onClick={() => setStep(isLast ? 0 : step + 1)}
            >
              {isLast ? "Start over" : "Next step"} <ArrowIcon width={16} height={16} />
            </button>
          </div>
        </article>
      </section>

      {/* Chef quote */}
      <section className="chef">
        <div className="chef__top">
          <span className="chef__mark" aria-hidden="true">99</span>
          <span className="chip chip--outline">Kitchen notes</span>
        </div>
        <blockquote>
          “Every dish tells a story of Kerala's coast. Your feedback helps us make that story more memorable with every meal”
        </blockquote>
        <div className="chef__who">
          <div>
            <strong>Head Chef . Flavour Junction </strong>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="notes">
        {notes.map(({ title, text, Icon }) => (
          <article className="note card" key={title}>
            <span className="note__icon"><Icon width={22} height={22} /></span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h2>Dined with us recently?</h2>
        <p>Your opinion shapes our seasonal menus, service warmth, and cellar selections.</p>
        <Link to="/feedback" className="about-cta__btn">
          <ChatPlusIcon width={20} height={20} /> Give Feedback
        </Link>
      </section>
    </main>
  );
}
