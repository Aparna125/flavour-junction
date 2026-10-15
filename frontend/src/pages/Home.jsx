import { Link } from "react-router-dom";
import signaturecourse from "../Images/signature-course.jpg";
import { ArrowIcon, StarIcon, UtensilsIcon, ServiceIcon, CupIcon, TagHeartIcon } from "../components/Icons.jsx";
import "./Home.css";

const features = [
  {
    title: "Food Quality",
    tag: "Fresh & Authentic",
    text: "Freshly sourced seafood, hand-ground Kerala spices, fragrant curry leaves, and traditional recipes inspired by the Malabar coast.",
    Icon: UtensilsIcon,
    tone: "mint",
  },
  {
    title: "Service",
    tag: "Warm & Welcoming",
    text: "Experience the warmth of Kerala hospitality, with attentive service and thoughtful care that makes every meal feel special.",
    Icon: ServiceIcon,
    tone: "neutral",
  },
  {
    title: "Ambience",
    tag: "Coastal Elegance",
    text: "A refined Kerala-inspired setting with natural textures, warm lighting, traditional accents, and a relaxed atmosphere for memorable dining.",
    Icon: CupIcon,
    tone: "mint",
  },
];

export default function Home() {
  return (
    <main className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__copy">
          <span className="pill"><span className="pill__dot" aria-hidden="true" />Kerala Coastal Seafood</span>
          <h1 className="hero__title">Every experience matters.</h1>
          <p className="hero__text">
           From the backwaters of Kerala to the shores of the Arabian Sea, we celebrate the rich flavours of Malabar, freshly caught seafood, traditional spices, and the warmth of Kerala hospitality. Share your dining experience and help us make every visit unforgettable.
          </p>
          <Link to="/feedback" className="btn btn--primary hero__cta-desktop">
            Share Your Experience <ArrowIcon width={18} height={18} />
          </Link>
        </div>

        <figure className="hero__media">
          <img src={signaturecourse} alt="Fish Nirvana" />
          <figcaption className="hero__caption">
            <div>
              <small>Signature course</small>
              <strong>FISH NIRVANA</strong>
            </div>
          </figcaption>
          <span className="hero__rating"><StarIcon width={16} height={16} /> 4.9</span>
        </figure>

        <Link to="/feedback" className="btn btn--primary hero__cta-mobile">
          Share Your Experience <ArrowIcon width={18} height={18} />
        </Link>
      </section>

      {/* Features */}
      <section className="standard">
        <p className="eyebrow">The tasting standard</p>
        <h2 className="section-title">Crafted with Purpose</h2>

        <div className="feature-list">
          {features.map(({ title, tag, text, Icon, tone }) => (
            <article className="feature" key={title}>
              <span className={`feature__icon feature__icon--${tone}`}><Icon /></span>
              <div className="feature__body">
                <header>
                  <h3>{title}</h3>
                  <span className="feature__tag">{tag}</span>
                </header>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="quote" aria-label="Guest testimonial">
        <div className="quote__stars" aria-label="5 out of 5 stars">
          {[...Array(5)].map((_, i) => <StarIcon key={i} width={16} height={16} />)}
        </div>
        <blockquote>
          “The Fish Nirvana was absolutely delicious, with perfectly balanced spices and authentic Kerala flavours. The warm hospitality made the evening even more special”
        </blockquote>
        <div className="quote__meta">
          <span>Anjali &amp; Rahul. · Table 14</span>
          <span className="quote__verified">Verified Guest</span>
        </div>
      </section>

      {/* CTA band */}
      <section className="cta">
        <TagHeartIcon className="cta__icon" width={26} height={26} />
        <h2>Dined with us recently?</h2>
        <p>Your feedback helps us preserve authentic Kerala flavours while making every dining experience better. Our restaurant team reviews guest feedback regularly to improve our food, service, and ambience.</p>
        <Link to="/feedback" className="btn btn--light">Give Feedback Now</Link>
      </section>
    </main>
  );
}
