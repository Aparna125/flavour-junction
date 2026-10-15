import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { listFeedback, getFeedbackItem } from "../api/adminFeedback.js";
import FeedbackSheet from "../components/admin/FeedbackSheet.jsx";
import {
  SearchIcon,
  CloseIcon,
  StarIcon,
  CalendarIcon,
  ChevronDownIcon,
  SortIcon,
  ResetIcon,
  TrendUpIcon,
  UserIcon,
} from "../components/Icons.jsx";
import { capitalize, formatDateTime, formatScore, highlight, initials } from "../utils/feedbackUi.jsx";
import "./AdminFeedback.css";

const PAGE_SIZE = 10;
const DEFAULTS = { search: "", sentiment: "all", rating: "all", range: "30", sort: "newest" };

const RANGE_OPTIONS = [
  ["7", "Last 7 Days"],
  ["30", "Last 30 Days"],
  ["90", "Last 90 Days"],
  ["all", "All Time"],
];

const nf = new Intl.NumberFormat("en");

export default function AdminFeedback() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const openId = searchParams.get("open");

  const [filters, setFilters] = useState(DEFAULTS);
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState({ all: 0, positive: 0, neutral: 0, negative: 0 });
  const [pageCount, setPageCount] = useState(1);
  const [status, setStatus] = useState("loading"); // loading | more | ready | error
  const [error, setError] = useState("");

  const [selected, setSelected] = useState(null);

  const changeFilters = (patch) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  };

  // Wait for the manager to stop typing before searching.
  useEffect(() => {
    const t = setTimeout(() => {
      const value = searchInput.trim();
      setFilters((f) => (f.search === value ? f : { ...f, search: value }));
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Load the list whenever the filters or page change.
  useEffect(() => {
    let cancelled = false;
    setStatus(page === 1 ? "loading" : "more");
    setError("");

    listFeedback({ ...filters, page, pageSize: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return;
        setItems((prev) => (page === 1 ? res.items : [...prev, ...res.items]));
        setTotal(res.total);
        setCounts(res.counts);
        setPageCount(res.pageCount);
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
  }, [filters, page, reloadKey, navigate]);

  // Opened from the dashboard ("Inspect") via /admin/feedback?open=ID
  useEffect(() => {
    if (!openId) return;
    let cancelled = false;
    getFeedbackItem(openId)
      .then((item) => {
        if (!cancelled) setSelected(item);
      })
      .catch((err) => {
        if (err.code === "AUTH") navigate("/admin/login", { replace: true });
      });
    return () => {
      cancelled = true;
    };
  }, [openId, navigate]);

  const closeSheet = () => {
    setSelected(null);
    if (openId) {
      const next = new URLSearchParams(searchParams);
      next.delete("open");
      setSearchParams(next, { replace: true });
    }
  };

  const isDefault = JSON.stringify(filters) === JSON.stringify(DEFAULTS) && !searchInput;
  const resetFilters = () => {
    setSearchInput("");
    setFilters(DEFAULTS);
    setPage(1);
  };

  const net = counts.all ? Math.round(((counts.positive - counts.negative) / counts.all) * 100) : null;

  const chips = [
    ["all", "All", counts.all, null],
    ["positive", "Positive", counts.positive, "positive"],
    ["neutral", "Neutral", counts.neutral, "neutral"],
    ["negative", "Negative", counts.negative, "negative"],
  ];

  return (
    <div className="fm">
      {/* Title */}
      <div className="fm__head">
        <div>
          <p className="fm__eyebrow">Guest voice</p>
          <h1>Feedback Hub</h1>
        </div>
        {net != null && (
          <span className="net" title="Share of positive comments minus share of negative comments in this view">
            <TrendUpIcon width={18} height={18} /> {net >= 0 ? "+" : "−"}{Math.abs(net)} Net sentiment
          </span>
        )}
      </div>

      {/* Search */}
      <div className="search">
        <SearchIcon width={20} height={20} />
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search comments or guest names"
          aria-label="Search feedback"
        />
        {searchInput && (
          <button type="button" onClick={() => setSearchInput("")} aria-label="Clear search">
            <CloseIcon width={18} height={18} />
          </button>
        )}
      </div>

      {/* Sentiment chips */}
      <div className="fm-chips" role="group" aria-label="Filter by sentiment">
        {chips.map(([value, label, count, tone]) => (
          <button
            key={value}
            type="button"
            className={`fm-chip ${filters.sentiment === value ? "fm-chip--on" : ""}`}
            aria-pressed={filters.sentiment === value}
            onClick={() => changeFilters({ sentiment: value })}
          >
            {tone && <span className={`dot dot--${tone}`} aria-hidden="true" />}
            {label} <small>{nf.format(count)}</small>
          </button>
        ))}
      </div>

      {/* Selects */}
      <div className="selects">
        <label className="select">
          <StarIcon width={20} height={20} />
          <span className="sr-only">Filter by overall rating</span>
          <select value={filters.rating} onChange={(e) => changeFilters({ rating: e.target.value })}>
            <option value="all">All Stars (1 - 5★)</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? "Star" : "Stars"}</option>
            ))}
          </select>
          <ChevronDownIcon width={18} height={18} />
        </label>

        <label className="select">
          <CalendarIcon width={20} height={20} />
          <span className="sr-only">Filter by date</span>
          <select value={filters.range} onChange={(e) => changeFilters({ range: e.target.value })}>
            {RANGE_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <ChevronDownIcon width={18} height={18} />
        </label>
      </div>

      {/* Sort + reset */}
      <div className="fm__tools">
        <button
          type="button"
          className="sort"
          onClick={() => changeFilters({ sort: filters.sort === "newest" ? "oldest" : "newest" })}
        >
          <SortIcon width={18} height={18} /> Sorted: {filters.sort === "newest" ? "Newest First" : "Oldest First"}
        </button>
        <button type="button" className="reset" onClick={resetFilters} disabled={isDefault}>
          <ResetIcon width={16} height={16} /> Reset Filters
        </button>
      </div>

      {/* List */}
      {status === "loading" && <p className="fm__state" aria-live="polite">Loading feedback…</p>}

      {status === "error" && (
        <div className="fm__error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => setReloadKey((k) => k + 1)}>Try again</button>
        </div>
      )}

      {status !== "loading" && status !== "error" && items.length === 0 && (
        <div className="fm__state">
          <p>No feedback matches these filters.</p>
          {!isDefault && <button type="button" className="link-btn" onClick={resetFilters}>Reset filters</button>}
        </div>
      )}

      {items.length > 0 && status !== "error" && (
        <>
          <p className="fm__count" aria-live="polite">Showing {items.length} of {nf.format(total)}</p>
          <ul className="fb-list">
            {items.map((f) => {
              const overall = f.ratings.overall_satisfaction;
              const ini = initials(f.name);
              return (
                <li key={f.id}>
                  <button type="button" className={`fb-card fb-card--${f.sentiment}`} onClick={() => setSelected(f)}>
                    <span className="fb-card__top">
                      <span className="avatar" aria-hidden="true">{ini ?? <UserIcon width={18} height={18} />}</span>
                      <span className="fb-card__who">
                        <strong>{f.name || "Anonymous guest"}</strong>
                        <small>{formatDateTime(f.createdAt)}</small>
                      </span>
                      <span className={`score-chip score-chip--${f.sentiment}`} title="Sentiment score">
                        {formatScore(f.score)}
                      </span>
                    </span>
                    <span className="fb-card__text">{highlight(f.comment, filters.search)}</span>
                    <span className="fb-card__foot">
                      <span className="fb-card__stars" aria-label={`${overall} out of 5`}>
                        {[1, 2, 3, 4, 5].map((i) => <StarIcon key={i} width={15} height={15} filled={i <= overall} />)}
                        <strong>{overall.toFixed(1)}</strong>
                      </span>
                      <span className={`pill pill--${f.sentiment}`}>{capitalize(f.sentiment)}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {page < pageCount && (
            <button type="button" className="more" onClick={() => setPage((p) => p + 1)} disabled={status === "more"}>
              {status === "more" ? "Loading…" : "Load more"}
            </button>
          )}
        </>
      )}

      {selected && <FeedbackSheet item={selected} onClose={closeSheet} term={filters.search} />}
    </div>
  );
}
