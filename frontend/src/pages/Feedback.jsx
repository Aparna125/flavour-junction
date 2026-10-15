// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import StarRating from "../components/StarRating.jsx";
// import { submitFeedback } from "../api/feedback.js";
// import {
//   UtensilsIcon,
//   BowlIcon,
//   DomeIcon,
//   SprayIcon,
//   SmileIcon,
//   StarBurstIcon,
//   ShieldIcon,
//   IdCardIcon,
//   AtIcon,
//   ArrowIcon,
//   CheckCircleIcon,
// } from "../components/Icons.jsx";
// import "./Feedback.css";

// const MAX_COMMENT = 500;

// // `key` matches the field names the Express API expects.
// const categories = [
//   { key: "food_quality", title: "Food Quality", hint: "Flavour balance, temperature & presentation", Icon: BowlIcon },
//   { key: "service", title: "Service", hint: "Attentiveness, pacing & warmth", Icon: DomeIcon },
//   { key: "cleanliness", title: "Cleanliness", hint: "Dining room, tableware & restrooms", Icon: SprayIcon },
//   { key: "staff_behaviour", title: "Staff Behaviour", hint: "Courtesy, knowledge & welcoming spirit", Icon: SmileIcon },
//   { key: "overall_satisfaction", title: "Overall Satisfaction", hint: "Your complete dining experience", Icon: StarBurstIcon },
// ];

// const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// export default function Feedback() {
//   const navigate = useNavigate();

//   const [ratings, setRatings] = useState({});
//   const [comment, setComment] = useState("");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [serverError, setServerError] = useState("");

//   const setRating = (key, value) => {
//     setRatings((r) => ({ ...r, [key]: value }));
//     setErrors((e) => ({ ...e, [key]: undefined }));
//   };

//   const validate = () => {
//     const next = {};
//     categories.forEach(({ key }) => {
//       if (!ratings[key]) next[key] = "Please choose a star rating.";
//     });
//     if (!comment.trim()) next.comment = "Please share a few words about your visit.";
//     if (email.trim() && !emailPattern.test(email.trim())) next.email = "Please enter a valid email address.";
//     return next;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setServerError("");

//     const found = validate();
//     setErrors(found);
//     if (Object.keys(found).length) {
//       // Bring the first problem into view.
//       requestAnimationFrame(() =>
//         document.querySelector("[data-invalid='true']")?.scrollIntoView({ behavior: "smooth", block: "center" })
//       );
//       return;
//     }

//     setSubmitting(true);
//     try {
//       await submitFeedback({
//         ...ratings,
//         comment: comment.trim(),
//         name: name.trim() || null,
//         email: email.trim() || null,
//       });
//       // Only reached after the backend confirms the feedback was saved.
//       navigate("/feedback/success", { state: { submitted: true } });
//     } catch (err) {
//       setServerError(err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <main className="feedback">
//       <form className="feedback__form" onSubmit={handleSubmit} noValidate>
//         {/* Intro */}
//         <section className="intro">
//           <p className="intro__label">
//             <span className="intro__icon"><UtensilsIcon width={18} height={18} /></span>
//             Guest experience
//           </p>
//           <h1>Tell us about your visit</h1>
//           <p>Your feedback directly influences our kitchen and hospitality.</p>
//         </section>

//         {/* Ratings */}
//         <section className="panel">
//           <header className="panel__head">
//             <div>
//               <h2>Course Evaluations</h2>
//               <p>Tap the stars to score each touchpoint</p>
//             </div>
//             <span className="badge">5 Pillars</span>
//           </header>

//           <div className="rate-list">
//             {categories.map(({ key, title, hint, Icon }) => (
//               <fieldset
//                 className={`rate ${errors[key] ? "rate--error" : ""}`}
//                 key={key}
//                 data-invalid={errors[key] ? "true" : undefined}
//               >
//                 <div className="rate__top">
//                   <legend className="rate__title">
//                     <Icon width={18} height={18} /> {title}
//                   </legend>
//                   <span className={`tap ${ratings[key] ? "tap--done" : ""}`}>
//                     {ratings[key] ? "Rated" : "Tap to rate"}
//                   </span>
//                 </div>
//                 <p className="rate__hint">{hint}</p>
//                 <StarRating
//                   name={key}
//                   label={title}
//                   value={ratings[key] ?? 0}
//                   onChange={(v) => setRating(key, v)}
//                   describedBy={errors[key] ? `err-${key}` : undefined}
//                 />
//                 {errors[key] && (
//                   <p className="error" id={`err-${key}`} role="alert">{errors[key]}</p>
//                 )}
//               </fieldset>
//             ))}
//           </div>
//         </section>

//         {/* Comment */}
//         <section className="panel">
//           <header className="panel__head">
//             <h2>Open Reflections</h2>
//             <span className="counter">{comment.length} / {MAX_COMMENT} characters</span>
//           </header>
//           <label htmlFor="comment" className="panel__sub">
//             What dishes did you try? Any memorable moments or areas we can polish?
//           </label>
//           <textarea
//             id="comment"
//             rows={5}
//             maxLength={MAX_COMMENT}
//             value={comment}
//             placeholder="e.g., The saffron risotto was divine; our server Rahul paired the natural wine flawlessly..."
//             onChange={(e) => {
//               setComment(e.target.value);
//               setErrors((er) => ({ ...er, comment: undefined }));
//             }}
//             aria-invalid={!!errors.comment}
//             aria-describedby={errors.comment ? "err-comment" : undefined}
//             data-invalid={errors.comment ? "true" : undefined}
//           />
//           {errors.comment && <p className="error" id="err-comment" role="alert">{errors.comment}</p>}
//         </section>

//         {/* Diner details */}
//         <section className="panel">
//           <header className="panel__head">
//             <h2>Diner Details</h2>
//             <span className="badge badge--green">Optional</span>
//           </header>
//           <p className="panel__sub panel__sub--icon">
//             <ShieldIcon width={16} height={16} /> Leave blank to submit anonymously
//           </p>

//           <div className="field">
//             <label htmlFor="name">Your Name</label>
//             <div className="input">
//               <IdCardIcon width={20} height={20} />
//               <input
//                 id="name"
//                 type="text"
//                 maxLength={100}
//                 autoComplete="name"
//                 placeholder="e.g., Sophia Montgomery"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="field">
//             <label htmlFor="email">Email Address</label>
//             <div className="input" data-invalid={errors.email ? "true" : undefined}>
//               <AtIcon width={20} height={20} />
//               <input
//                 id="email"
//                 type="email"
//                 maxLength={150}
//                 autoComplete="email"
//                 placeholder="e.g., sophia@junction.com"
//                 value={email}
//                 onChange={(e) => {
//                   setEmail(e.target.value);
//                   setErrors((er) => ({ ...er, email: undefined }));
//                 }}
//                 aria-invalid={!!errors.email}
//                 aria-describedby={errors.email ? "err-email" : "email-note"}
//               />
//             </div>
//             {errors.email ? (
//               <p className="error" id="err-email" role="alert">{errors.email}</p>
//             ) : (
//               <p className="note" id="email-note">We only reach out if you request culinary follow-up.</p>
//             )}
//           </div>
//         </section>

//         {serverError && <p className="server-error" role="alert">{serverError}</p>}

//         <button type="submit" className="submit" disabled={submitting}>
//           {submitting ? "Submitting…" : <>Submit Feedback <ArrowIcon width={18} height={18} /></>}
//         </button>

//         <p className="assurance">
//           <CheckCircleIcon width={16} height={16} />
//           Reviewed directly by Executive Chef &amp; General Manager
//         </p>
//       </form>
//     </main>
//   );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating.jsx";
import { submitFeedback } from "../api/feedback.js";
import {
  UtensilsIcon,
  BowlIcon,
  DomeIcon,
  SprayIcon,
  SmileIcon,
  StarBurstIcon,
  ShieldIcon,
  IdCardIcon,
  AtIcon,
  ArrowIcon,
  CheckCircleIcon,
} from "../components/Icons.jsx";
import "./Feedback.css";

const MAX_COMMENT = 500;

// `key` matches the field names the Express API expects.
const categories = [
  { key: "food_quality", title: "Food Quality", hint: "Flavour balance, temperature & presentation", Icon: BowlIcon },
  { key: "service", title: "Service", hint: "Attentiveness, pacing & warmth", Icon: DomeIcon },
  { key: "cleanliness", title: "Cleanliness", hint: "Dining room, tableware & restrooms", Icon: SprayIcon },
  { key: "staff_behaviour", title: "Staff Behaviour", hint: "Courtesy, knowledge & welcoming spirit", Icon: SmileIcon },
  { key: "overall_satisfaction", title: "Overall Satisfaction", hint: "Your complete dining experience", Icon: StarBurstIcon },
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Feedback() {
  const navigate = useNavigate();

  const [ratings, setRatings] = useState({});
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const setRating = (key, value) => {
    setRatings((r) => ({ ...r, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    categories.forEach(({ key }) => {
      if (!ratings[key]) next[key] = "Please choose a star rating.";
    });
    if (!comment.trim()) next.comment = "Please share a few words about your visit.";
    if (email.trim() && !emailPattern.test(email.trim())) next.email = "Please enter a valid email address.";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      // Bring the first problem into view.
      requestAnimationFrame(() =>
        document.querySelector("[data-invalid='true']")?.scrollIntoView({ behavior: "smooth", block: "center" })
      );
      return;
    }

    setSubmitting(true);
    try {
      const saved = await submitFeedback({
        ...ratings,
        comment: comment.trim(),
        name: name.trim() || null,
        email: email.trim() || null,
      });
      // Only reached after the backend confirms the feedback was saved.
      navigate("/feedback/success", {
        state: {
          submitted: true,
          submissionId: saved?.id ?? null, // returned by the backend (MySQL insert id)
          ratings,
          submittedAt: Date.now(),
        },
      });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="feedback">
      <form className="feedback__form" onSubmit={handleSubmit} noValidate>
        {/* Intro */}
        <section className="intro">
          <p className="intro__label">
            <span className="intro__icon"><UtensilsIcon width={18} height={18} /></span>
            Guest experience
          </p>
          <h1>Tell us about your visit</h1>
          <p>Your feedback directly influences our kitchen and hospitality.</p>
        </section>

        {/* Ratings */}
        <section className="panel">
          <header className="panel__head">
            <div>
              <h2>Course Evaluations</h2>
              <p>Tap the stars to score each touchpoint</p>
            </div>
            <span className="badge">5 Pillars</span>
          </header>

          <div className="rate-list">
            {categories.map(({ key, title, hint, Icon }) => (
              <fieldset
                className={`rate ${errors[key] ? "rate--error" : ""}`}
                key={key}
                data-invalid={errors[key] ? "true" : undefined}
              >
                <div className="rate__top">
                  <legend className="rate__title">
                    <Icon width={18} height={18} /> {title}
                  </legend>
                  <span className={`tap ${ratings[key] ? "tap--done" : ""}`}>
                    {ratings[key] ? "Rated" : "Tap to rate"}
                  </span>
                </div>
                <p className="rate__hint">{hint}</p>
                <StarRating
                  name={key}
                  label={title}
                  value={ratings[key] ?? 0}
                  onChange={(v) => setRating(key, v)}
                  describedBy={errors[key] ? `err-${key}` : undefined}
                />
                {errors[key] && (
                  <p className="error" id={`err-${key}`} role="alert">{errors[key]}</p>
                )}
              </fieldset>
            ))}
          </div>
        </section>

        {/* Comment */}
        <section className="panel">
          <header className="panel__head">
            <h2>Open Reflections</h2>
            <span className="counter">{comment.length} / {MAX_COMMENT} characters</span>
          </header>
          <label htmlFor="comment" className="panel__sub">
            What dishes did you try? Any memorable moments or areas we can polish?
          </label>
          <textarea
            id="comment"
            rows={5}
            maxLength={MAX_COMMENT}
            value={comment}
            placeholder="e.g., The saffron risotto was divine; our server Rahul paired the natural wine flawlessly..."
            onChange={(e) => {
              setComment(e.target.value);
              setErrors((er) => ({ ...er, comment: undefined }));
            }}
            aria-invalid={!!errors.comment}
            aria-describedby={errors.comment ? "err-comment" : undefined}
            data-invalid={errors.comment ? "true" : undefined}
          />
          {errors.comment && <p className="error" id="err-comment" role="alert">{errors.comment}</p>}
        </section>

        {/* Diner details */}
        <section className="panel">
          <header className="panel__head">
            <h2>Diner Details</h2>
            <span className="badge badge--green">Optional</span>
          </header>
          <p className="panel__sub panel__sub--icon">
            <ShieldIcon width={16} height={16} /> Leave blank to submit anonymously
          </p>

          <div className="field">
            <label htmlFor="name">Your Name</label>
            <div className="input">
              <IdCardIcon width={20} height={20} />
              <input
                id="name"
                type="text"
                maxLength={100}
                autoComplete="name"
                placeholder="e.g., Sophia Montgomery"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="email">Email Address</label>
            <div className="input" data-invalid={errors.email ? "true" : undefined}>
              <AtIcon width={20} height={20} />
              <input
                id="email"
                type="email"
                maxLength={150}
                autoComplete="email"
                placeholder="e.g., sophia@junction.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((er) => ({ ...er, email: undefined }));
                }}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "err-email" : "email-note"}
              />
            </div>
            {errors.email ? (
              <p className="error" id="err-email" role="alert">{errors.email}</p>
            ) : (
              <p className="note" id="email-note">We only reach out if you request culinary follow-up.</p>
            )}
          </div>
        </section>

        {serverError && <p className="server-error" role="alert">{serverError}</p>}

        <button type="submit" className="submit" disabled={submitting}>
          {submitting ? "Submitting…" : <>Submit Feedback <ArrowIcon width={18} height={18} /></>}
        </button>

        <p className="assurance">
          <CheckCircleIcon width={16} height={16} />
          Reviewed directly by Executive Chef &amp; General Manager
        </p>
      </form>
    </main>
  );
}
