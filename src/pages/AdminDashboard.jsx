import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDashboard } from "../api/dashboard.js";
import TrendChart from "../components/admin/TrendChart.jsx";
import SentimentDoughnut, { sentimentColors } from "../components/admin/SentimentDoughnut.jsx";
import {
  CalendarIcon,
  ChatIcon,
  SmileIcon,
  FrownIcon,
  PieIcon,
  TrendUpIcon,
  TrendDownIcon,
  StarIcon,
  ArrowIcon,
  UserIcon,
} from "../components/Icons.jsx";
import "./AdminDashboard.css";

const RANGES = [
  { days: 7, label: "Last 7 days" },
  { days: 30, label: "Last 30 days" },
  { days: 90, label: "Last 90 days" },
];

const nf = new Intl.NumberFormat("en");
const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

const stars = (n, size = 16) =>
  [1, 2, 3, 4, 5].map((i) => <StarIcon key={i} width={size} height={size} filled={i <= Math.round(n)} />);

function formatWhen(iso) {
  const d = new Date(iso);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  if (d.toDateString() === now.toDateString()) return `Today ${time}`;
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday ${time}`;
  return `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} ${time}`;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [range, setRange] = useState(7);
  const [reloadKey, setReloadKey] = useState(0);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    getDashboard(range)
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
  }, [range, reloadKey, navigate]);

  // Everything derived from the API data (percentages, changes, chart series).
  const v = useMemo(() => {
    if (!data) return null;
    const { sentiment: s, totals, previous } = data;
    const sentTotal = s.positive + s.neutral + s.negative;
    const share = (n) => (sentTotal ? (n / sentTotal) * 100 : 0);
    const prevSentTotal = previous ? previous.total : 0;
    const prevShare = (n) => (prevSentTotal ? (n / prevSentTotal) * 100 : null);

    const totalChange = previous?.total ? Math.round(((totals.feedback - previous.total) / previous.total) * 100) : null;
    const prevNeg = previous ? prevShare(previous.negative) : null;
    const negChange = prevNeg == null ? null : Math.round((share(s.negative) - prevNeg) * 10) / 10;

    const dist = data.ratingDistribution;
    const distTotal = [1, 2, 3, 4, 5].reduce((sum, k) => sum + (dist[k] || 0), 0);

    const trend = data.trend;
    const labels = trend.map((t, i) => {
      const d = new Date(t.date);
      if (range === 7) return i === trend.length - 1 ? "Today" : d.toLocaleDateString("en-GB", { weekday: "short" });
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    });
    const values = trend.map((t) => t.average);
    const counts = trend.map((t) => t.count);
    const trendChange = values.length > 1 ? Math.round((values[values.length - 1] - values[0]) * 10) / 10 : null;

    return {
      sentTotal,
      posPct: Math.round(share(s.positive)),
      neuPct: Math.round(share(s.neutral)),
      negPct: Math.round(share(s.negative)),
      totalChange,
      negChange,
      dist,
      distTotal,
      labels,
      values,
      counts,
      trendChange,
    };
  }, [data, range]);

  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="dash">
      {/* Title */}
      <div className="dash__head">
        <div>
          <h1>Executive Summary</h1>
          <p>Guest perception at a glance</p>
        </div>
        <span className="date-chip"><CalendarIcon width={18} height={18} /> Today: {today}</span>
      </div>

      {/* Range filter */}
      <div className="chips" role="group" aria-label="Time range">
        {RANGES.map((r) => (
          <button
            key={r.days}
            type="button"
            className={`chip ${range === r.days ? "chip--on" : ""}`}
            aria-pressed={range === r.days}
            onClick={() => setRange(r.days)}
          >
            {r.label}
          </button>
        ))}
      </div>

      {data?.isSample && (
        <p className="sample-note">Showing sample data for design preview. These are not real guest figures.</p>
      )}

      {status === "loading" && !data && <p className="dash__state" aria-live="polite">Loading dashboard…</p>}

      {status === "error" && (
        <div className="dash__error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => setReloadKey((k) => k + 1)}>Try again</button>
        </div>
      )}

      {data && v && data.totals.feedback === 0 && (
        <p className="dash__state">No feedback has been submitted in this period yet.</p>
      )}

      {data && v && data.totals.feedback > 0 && (
        <div className={`dash__body ${status === "loading" ? "is-loading" : ""}`}>
          {/* KPI cards */}
          <section className="kpis" aria-label="Key figures">
            <article className="kpi kpi--mint">
              <header><span>Feedback</span><ChatIcon width={20} height={20} /></header>
              <strong className="kpi__big">{nf.format(data.totals.feedback)}</strong>
              {v.totalChange != null && (
                <p className={`kpi__delta ${v.totalChange < 0 ? "kpi__delta--down" : ""}`}>
                  {v.totalChange >= 0 ? <TrendUpIcon width={16} height={16} /> : <TrendDownIcon width={16} height={16} />}
                  {v.totalChange >= 0 ? "+" : ""}{v.totalChange}% vs previous
                </p>
              )}
            </article>

            <article className="kpi">
              <header><span>Avg Rating</span><StarIcon width={20} height={20} /></header>
              <strong className="kpi__big">{data.averageOverall.toFixed(1)}<small> / 5.0</small></strong>
              <div className="kpi__stars" aria-label={`${data.averageOverall.toFixed(1)} out of 5`}>{stars(data.averageOverall)}</div>
            </article>

            <article className="kpi">
              <header><span>Positive</span><SmileIcon width={20} height={20} className="ico-good" /></header>
              <strong className="kpi__big">{v.posPct}%</strong>
              <span className="pill pill--positive">{nf.format(data.sentiment.positive)} comments</span>
            </article>

            <article className="kpi">
              <header><span>Negative</span><FrownIcon width={20} height={20} className="ico-bad" /></header>
              <strong className="kpi__big">{v.negPct}%</strong>
              <span className="pill pill--negative">
                {v.negChange != null
                  ? `${v.negChange <= 0 ? "−" : "+"}${Math.abs(v.negChange)} pts vs previous`
                  : `${nf.format(data.sentiment.negative)} comments`}
              </span>
            </article>
          </section>

          {/* Trend */}
          <section className="card card--trend">
            <header className="card__head">
              <div>
                <h2>Guest Satisfaction Trend</h2>
                <p>Average overall rating per day</p>
              </div>
              {v.trendChange != null && (
                <span className={`badge ${v.trendChange < 0 ? "badge--down" : ""}`}>
                  {v.trendChange >= 0 ? "+" : "−"}{Math.abs(v.trendChange).toFixed(1)} pts
                </span>
              )}
            </header>
            <TrendChart
              labels={v.labels}
              values={v.values}
              counts={v.counts}
              ariaLabel={`Line chart of the daily average overall rating over the last ${range} days, from ${v.values[0]} to ${v.values[v.values.length - 1]}.`}
            />
          </section>

          {/* Sentiment */}
          <section className="card card--sentiment">
            <header className="card__head">
              <div>
                <h2>Sentiment Share</h2>
                <p>Automatic analysis of written comments</p>
              </div>
              <PieIcon width={24} height={24} />
            </header>
            <div className="sentiment">
              <SentimentDoughnut
                positive={data.sentiment.positive}
                neutral={data.sentiment.neutral}
                negative={data.sentiment.negative}
                ariaLabel={`Doughnut chart: ${v.posPct}% positive, ${v.neuPct}% neutral, ${v.negPct}% negative comments.`}
              >
                <strong>{v.posPct}%</strong>
                <span>Positive</span>
              </SentimentDoughnut>
              <ul className="legend">
                {[
                  ["Positive", data.sentiment.positive, v.posPct, sentimentColors.positive],
                  ["Neutral", data.sentiment.neutral, v.neuPct, sentimentColors.neutral],
                  ["Negative", data.sentiment.negative, v.negPct, sentimentColors.negative],
                ].map(([name, count, pct, color]) => (
                  <li key={name}>
                    <span className="legend__dot" style={{ background: color }} aria-hidden="true" />
                    <span className="legend__name">{name}</span>
                    <span className="legend__num">{nf.format(count)} ({pct}%)</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="card__note">Sentiment is an estimate. It can misread sarcasm or mixed opinions.</p>
          </section>

          {/* Rating scale */}
          <section className="card card--scale">
            <header className="card__head">
              <div>
                <h2>Rating Scale</h2>
                <p>Overall satisfaction frequency</p>
              </div>
              <span className="badge badge--grey">{compact.format(v.distTotal)} Total</span>
            </header>
            <ul className="bars">
              {[5, 4, 3, 2, 1].map((star) => {
                const pct = v.distTotal ? Math.round(((v.dist[star] || 0) / v.distTotal) * 100) : 0;
                return (
                  <li key={star}>
                    <span className="bars__label">{star} <StarIcon width={13} height={13} filled /></span>
                    <span className="bars__track" role="img" aria-label={`${star} stars: ${pct}%`}>
                      <span className={`bars__fill bars__fill--${star}`} style={{ width: `${pct}%` }} />
                    </span>
                    <span className="bars__pct">{pct}%</span>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Recent */}
          <section className="recent">
            <header className="recent__head">
              <div>
                <h2>Recent Feedback</h2>
                <p>Latest guest submissions</p>
              </div>
              <Link to="/admin/feedback" className="recent__all">View all <ArrowIcon width={14} height={14} /></Link>
            </header>

            <div className="recent__list">
              {data.recent.map((f) => (
                <article className="entry" key={f.id}>
                  <header>
                    <span className="entry__when">{formatWhen(f.createdAt)}</span>
                    <span className={`pill pill--${f.sentiment}`}>
                      {f.sentiment.charAt(0).toUpperCase() + f.sentiment.slice(1)}
                    </span>
                  </header>
                  <div className="entry__stars" aria-label={`${f.overall} out of 5`}>
                    {stars(f.overall, 15)}
                    <strong>{Number(f.overall).toFixed(1)}</strong>
                  </div>
                  <p className="entry__text">“{f.comment}”</p>
                  <footer>
                    <span className="entry__who"><UserIcon width={16} height={16} /> {f.name || "Anonymous"}</span>
                    <Link className="inspect" to={`/admin/feedback?open=${f.id}`}>Inspect <ArrowIcon width={14} height={14} /></Link>
                  </footer>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
