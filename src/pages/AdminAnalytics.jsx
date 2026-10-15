import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAnalytics } from "../api/analytics.js";
import TrendChart from "../components/admin/TrendChart.jsx";
import SentimentDoughnut, { sentimentColors } from "../components/admin/SentimentDoughnut.jsx";
import HorizontalBarChart from "../components/admin/HorizontalBarChart.jsx";
import {
  TrendUpIcon,
  TrendDownIcon,
  SproutIcon,
  BulbIcon,
  ChartIcon,
  PieIcon,
  StarIcon,
  ArrowIcon,
} from "../components/Icons.jsx";
import "./AdminAnalytics.css";

const PRESETS = [
  ["7", "Last 7 Days"],
  ["30", "Last 30 Days"],
  ["90", "Last 90 Days"],
  ["custom", "Custom"],
];

const CATEGORIES = [
  ["food_quality", "Food Quality"],
  ["service", "Service"],
  ["cleanliness", "Cleanliness"],
  ["staff_behaviour", "Staff Behaviour"],
  ["overall_satisfaction", "Overall Satisfaction"],
];

const PILLAR_COLORS = ["#17291e", "#1f5c3f", "#2f7a54", "#8fc7a3", "#c9a56a"]; // best -> lowest
const STAR_COLORS = ["#17291e", "#2f7a54", "#9ccfae", "#d98b80", "#b5483a"]; // 5 -> 1

// Stable formatters (the bar chart is rebuilt if these change between renders).
const nf = new Intl.NumberFormat("en");
const fmtRating = (v) => Number(v).toFixed(1);
const fmtCount = (v) => nf.format(v);

const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const mean = (obj) => CATEGORIES.reduce((s, [k]) => s + obj[k], 0) / CATEGORIES.length;
const round1 = (n) => Math.round(n * 10) / 10;

export default function AdminAnalytics() {
  const navigate = useNavigate();

  const [query, setQuery] = useState({ range: "30" });
  const [customOpen, setCustomOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState(() => toISO(new Date(Date.now() - 13 * 86400000)));
  const [customTo, setCustomTo] = useState(() => toISO(new Date()));
  const [customError, setCustomError] = useState("");

  const [reloadKey, setReloadKey] = useState(0);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    getAnalytics(query)
      .then((d) => {
        if (cancelled) return;
        setData(d);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.code === "AUTH") {
          navigate("/admin/login", { replace: true });
          return;
        }
        setError(err.message);
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [query, reloadKey, navigate]);

  const choosePreset = (value) => {
    if (value === "custom") {
      setCustomOpen(true);
      return;
    }
    setCustomOpen(false);
    setCustomError("");
    setQuery({ range: value });
  };

  const applyCustom = () => {
    const today = toISO(new Date());
    if (!customFrom || !customTo) return setCustomError("Please choose both dates.");
    if (customFrom > customTo) return setCustomError("The start date must be before the end date.");
    if (customTo > today) return setCustomError("The end date cannot be in the future.");
    if ((new Date(customTo) - new Date(customFrom)) / 86400000 > 365) return setCustomError("Please choose a period of up to one year.");
    setCustomError("");
    setQuery({ range: "custom", from: customFrom, to: customTo });
  };

  const v = useMemo(() => {
    if (!data) return null;

    const cats = data.categoryAverages;
    const ranked = CATEGORIES.map(([key, label]) => ({ key, label, value: cats[key] })).sort((a, b) => b.value - a.value);

    const index = (mean(cats) / 5) * 100;
    const prevIndex = data.previous ? (mean(data.previous.categoryAverages) / 5) * 100 : null;
    const indexDelta = prevIndex == null ? null : round1(index - prevIndex);

    const dist = data.ratingDistribution;
    const distTotal = [1, 2, 3, 4, 5].reduce((s, k) => s + (dist[k] || 0), 0);
    const avgRating = distTotal ? [1, 2, 3, 4, 5].reduce((s, k) => s + k * (dist[k] || 0), 0) / distTotal : 0;
    const positiveRatings = distTotal ? Math.round((((dist[4] || 0) + (dist[5] || 0)) / distTotal) * 1000) / 10 : 0;

    const s = data.sentiment;
    const sentTotal = s.positive + s.neutral + s.negative;
    const pct = (n) => (sentTotal ? Math.round((n / sentTotal) * 100) : 0);

    const trendValues = data.trend.map((t) => t.average);
    const trendChange = trendValues.length > 1 ? round1(trendValues[trendValues.length - 1] - trendValues[0]) : 0;
    const trendWord = trendChange > 0.1 ? "Upward" : trendChange < -0.1 ? "Downward" : "Steady";

    const ratingDelta = data.previous?.averageOverall != null ? Math.round((avgRating - data.previous.averageOverall) * 100) / 100 : null;

    return {
      ranked,
      pillarLabels: ranked.map((r) => r.label),
      pillarValues: ranked.map((r) => r.value),
      index,
      prevIndex,
      indexDelta,
      distTotal,
      avgRating,
      positiveRatings,
      starLabels: ["5 ★", "4 ★", "3 ★", "2 ★", "1 ★"],
      starValues: [5, 4, 3, 2, 1].map((k) => dist[k] || 0),
      sentTotal,
      posPct: pct(s.positive),
      neuPct: pct(s.neutral),
      negPct: pct(s.negative),
      trendLabels: data.trend.map((t) => t.label),
      trendValues,
      trendCounts: data.trend.map((t) => t.count),
      trendChange,
      trendWord,
      ratingDelta,
    };
  }, [data]);

  const periodText = data
    ? `${new Date(data.period.from).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${new Date(data.period.to).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
    : "";

  const feedbackLink = `/admin/feedback?sentiment=negative&range=${query.range === "custom" ? "all" : query.range}`;

  return (
    <div className="an">
      <div className="an__head">
        <h1>Analytics</h1>
        <p>Patterns across ratings and comments{data ? ` · ${periodText}` : ""}</p>
      </div>

      {/* Period filter */}
      <div className="an-chips" role="group" aria-label="Time period">
        {PRESETS.map(([value, label]) => {
          const on = value === "custom" ? query.range === "custom" || customOpen : query.range === value && !customOpen;
          return (
            <button key={value} type="button" className={`an-chip ${on ? "an-chip--on" : ""}`} aria-pressed={on} onClick={() => choosePreset(value)}>
              {label}
            </button>
          );
        })}
      </div>

      {customOpen && (
        <div className="custom">
          <label>
            From
            <input type="date" value={customFrom} max={customTo || undefined} onChange={(e) => setCustomFrom(e.target.value)} />
          </label>
          <label>
            To
            <input type="date" value={customTo} max={toISO(new Date())} onChange={(e) => setCustomTo(e.target.value)} />
          </label>
          <button type="button" className="custom__apply" onClick={applyCustom}>Apply</button>
          {customError && <p className="custom__error" role="alert">{customError}</p>}
        </div>
      )}

      {data?.isSample && <p className="sample-note">Showing sample data for design preview. These are not real guest figures.</p>}

      {status === "loading" && !data && <p className="an__state" aria-live="polite">Loading analytics…</p>}

      {status === "error" && (
        <div className="an__error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => setReloadKey((k) => k + 1)}>Try again</button>
        </div>
      )}

      {data && v && data.totals.feedback === 0 && <p className="an__state">No feedback was submitted in this period.</p>}

      {data && v && data.totals.feedback > 0 && (
        <div className={`an__body ${status === "loading" ? "is-loading" : ""}`}>
          {/* Index */}
          <section className="index card">
            <SproutIcon className="index__leaf" width={110} height={110} aria-hidden="true" />
            <header>
              <span className="eyebrow">Overall metric</span>
              {v.indexDelta != null && (
                <span className={`delta ${v.indexDelta < 0 ? "delta--down" : ""}`}>
                  {v.indexDelta >= 0 ? <TrendUpIcon width={14} height={14} /> : <TrendDownIcon width={14} height={14} />}
                  {v.indexDelta >= 0 ? "+" : "−"}{Math.abs(v.indexDelta).toFixed(1)} pts vs previous
                </span>
              )}
            </header>
            <h2>Satisfaction Index</h2>
            <p className="index__value">{v.index.toFixed(1)}<small>%</small></p>
            <p className="index__sub">
              {v.prevIndex != null && <>vs {v.prevIndex.toFixed(1)}% in the previous period · </>}
              {nf.format(data.totals.feedback)} responses
            </p>
            <div className="meter" role="img" aria-label={`Satisfaction index ${v.index.toFixed(1)} percent`}>
              <span style={{ width: `${Math.min(100, v.index)}%` }} />
            </div>
            <p className="index__note">Average of the five category ratings, shown as a percentage of the maximum score.</p>
          </section>

          {/* Insight */}
          <section className="insight">
            <span className="insight__tag"><TrendUpIcon width={14} height={14} /> Period insight</span>
            <p className="insight__text">
              {v.ratingDelta == null
                ? `The average overall rating for this period is ${v.avgRating.toFixed(2)} out of 5.`
                : Math.abs(v.ratingDelta) < 0.05
                  ? `The average overall rating held steady at ${v.avgRating.toFixed(2)} compared with the previous period.`
                  : `The average overall rating ${v.ratingDelta > 0 ? "rose" : "fell"} by ${Math.abs(v.ratingDelta).toFixed(2)} points to ${v.avgRating.toFixed(2)} compared with the previous period.`}{" "}
              {v.ranked[0].label} is the highest-rated category.
            </p>
          </section>

          {/* Category pillars */}
          <section className="card card--pillars">
            <header className="card__head">
              <div>
                <h2>Category Ratings</h2>
                <p>Average rating per category, out of 5.0</p>
              </div>
              <ChartIcon width={24} height={24} />
            </header>
            <HorizontalBarChart
              labels={v.pillarLabels}
              values={v.pillarValues}
              colors={PILLAR_COLORS}
              max={5}
              format={fmtRating}
              ariaLabel={`Bar chart of average ratings. ${v.ranked.map((r) => `${r.label} ${r.value.toFixed(1)}`).join(", ")}.`}
            />
            <div className="tip">
              <BulbIcon width={22} height={22} />
              <p>
                <strong>Insight</strong>
                {v.ranked[v.ranked.length - 1].label} is the lowest-rated category at {v.ranked[v.ranked.length - 1].value.toFixed(1)} / 5.0.
                Reading its low-rated comments can show what to improve.
              </p>
            </div>
          </section>

          {/* Sentiment */}
          <section className="card card--sentiment">
            <header className="card__head">
              <div>
                <h2>Sentiment Breakdown</h2>
                <p>Automatic analysis of written comments</p>
              </div>
              <PieIcon width={24} height={24} />
            </header>
            <div className="donut-wrap">
              <SentimentDoughnut
                positive={data.sentiment.positive}
                neutral={data.sentiment.neutral}
                negative={data.sentiment.negative}
                ariaLabel={`Doughnut chart: ${v.posPct}% positive, ${v.neuPct}% neutral, ${v.negPct}% negative comments.`}
              >
                <strong>{v.posPct}%</strong>
                <span>Positive</span>
              </SentimentDoughnut>
            </div>
            <ul className="rows">
              {[
                ["Positive", v.posPct, data.sentiment.positive, sentimentColors.positive],
                ["Neutral", v.neuPct, data.sentiment.neutral, sentimentColors.neutral],
                ["Negative", v.negPct, data.sentiment.negative, sentimentColors.negative],
              ].map(([name, p, count, color]) => (
                <li key={name}>
                  <span className="rows__name"><span className="rows__dot" style={{ background: color }} aria-hidden="true" />{name}</span>
                  <span className="rows__num"><strong>{p}%</strong> ({nf.format(count)} comments)</span>
                </li>
              ))}
            </ul>
            <p className="card__note">Sentiment is an estimate. It can misread sarcasm or mixed opinions.</p>
          </section>

          {/* Trend */}
          <section className="card card--trend">
            <header className="card__head">
              <div>
                <h2>Satisfaction Trend</h2>
                <p>Average overall rating over the selected period</p>
              </div>
              <span className={`badge ${v.trendWord === "Downward" ? "badge--down" : v.trendWord === "Steady" ? "badge--steady" : ""}`}>
                {v.trendWord === "Downward" ? <TrendDownIcon width={14} height={14} /> : <TrendUpIcon width={14} height={14} />} {v.trendWord}
              </span>
            </header>
            <TrendChart
              labels={v.trendLabels}
              values={v.trendValues}
              counts={v.trendCounts}
              ariaLabel={`Line chart of the average overall rating, from ${v.trendValues[0]} to ${v.trendValues[v.trendValues.length - 1]}.`}
            />
          </section>

          {/* Rating distribution */}
          <section className="card card--dist">
            <header className="card__head">
              <div>
                <h2>Rating Distribution</h2>
                <p>{nf.format(v.distTotal)} overall ratings submitted</p>
              </div>
              <span className="avg"><StarIcon width={18} height={18} filled /> {v.avgRating.toFixed(2)} avg</span>
            </header>
            <HorizontalBarChart
              labels={v.starLabels}
              values={v.starValues}
              colors={STAR_COLORS}
              format={fmtCount}
              rowHeight={40}
              ariaLabel={`Bar chart of overall ratings. ${v.starLabels.map((l, i) => `${l} ${v.starValues[i]}`).join(", ")}.`}
            />
            <footer className="dist-foot">
              <span><i className="dist-foot__dot" aria-hidden="true" /> {v.positiveRatings}% positive ratings (4–5 ★)</span>
              <Link to={feedbackLink}>Review negative comments <ArrowIcon width={14} height={14} /></Link>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
