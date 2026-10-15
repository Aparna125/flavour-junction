import { BowlIcon, DomeIcon, SprayIcon, SmileIcon, StarBurstIcon } from "../components/Icons.jsx";

// The four category ratings, in the order shown in the detail view.
export const PILLARS = [
  { key: "food_quality", label: "Food Quality", Icon: BowlIcon },
  { key: "service", label: "Service", Icon: DomeIcon },
  { key: "cleanliness", label: "Cleanliness", Icon: SprayIcon },
  { key: "staff_behaviour", label: "Staff Behaviour", Icon: SmileIcon },
];
export const OVERALL = { key: "overall_satisfaction", label: "Overall Satisfaction", Icon: StarBurstIcon };

export const formatId = (id) => `#FJ-${String(id).padStart(4, "0")}`;

export const formatScore = (s) => `${s >= 0 ? "+" : "−"}${Math.abs(s).toFixed(2)}`;

export function formatDateTime(iso) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${date} · ${time}`;
}

export function initials(name) {
  if (!name) return null;
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** Wraps matches of the search term in <mark> so the manager sees why a comment matched. */
export function highlight(text, term) {
  if (!term) return text;
  const safe = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${safe})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === term.toLowerCase() ? <mark key={i}>{part}</mark> : part
  );
}
