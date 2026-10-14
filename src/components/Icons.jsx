// src/components/Icons.jsx
// Small inline SVG icon set (no extra dependencies).

const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

// User icon
export const UserIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
  </svg>
);

// Home icon
export const HomeIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 3c-2 2-3 5-3 8h3v10" />
  </svg>
);

// Information icon
export const InfoIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v6M12 7.5v.01" />
  </svg>
);

// Feedback icon
export const FeedbackIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 4h16v12H9l-5 4z" />
    <path d="M8 9l2.5 2.5L16 7" />
  </svg>
);

// Admin icon
export const AdminIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" />
    <circle cx="12" cy="11" r="2" />
  </svg>
);

// Star icon
export const StarIcon = ({ filled = false, ...p }) => (
  <svg {...base} {...p} fill={filled ? "currentColor" : "none"}>
    <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
  </svg>
);

// Arrow icon
export const ArrowIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

// Food / utensils icon
export const UtensilsIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 3l7 7M9 3l-6 6a2.8 2.8 0 0 0 4 4l6-6M20 3c-2.5 1-4 4-4 7h3v10M15 15l-9 6" />
  </svg>
);

// Service icon
export const ServiceIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 8h12M5 8v3a4 4 0 0 0 8 0V8M9 3v2M3 20h6l4-3h4l4-3" />
  </svg>
);

// Cup icon
export const CupIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 5h12v8a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5zM17 7h2a2 2 0 0 1 0 4h-2M5 21h12" />
  </svg>
);

// Tag with heart icon
export const TagHeartIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 12V4h8l10 10-8 8z" />
    <path d="M9.5 10.5c.8-1.2 2.4-.6 2.1.7-.3 1-1.6 1.6-2.1 2-.5-.4-1.8-1-2.1-2-.3-1.3 1.3-1.9 2.1-.7z" />
  </svg>
);

// Location icon
export const PinIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

// Clock icon
export const ClockIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

// Phone icon
export const PhoneIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
);

// Camera icon
export const CameraIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="6" width="18" height="14" rx="3" />
    <circle cx="12" cy="13" r="3.5" />
    <path d="M8 6l1.5-2h5L16 6" />
  </svg>
);

// Wine glass icon
export const WineIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M7 3h10c0 5-1 8-5 8S7 8 7 3zM12 11v9M8 21h8" />
  </svg>
);

// Email icon
export const MailIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

// Leaf icon
export const LeafIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15M5 19c2-4 5-7 9-9" />
  </svg>
);

// Pen icon
export const PenIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 20l1-4L16 5l3 3L8 19zM14 7l3 3" />
  </svg>
);

// Chart icon
export const ChartIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6" />
  </svg>
);

// Eye icon
export const EyeIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// Sprout icon
export const SproutIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 21v-9M12 12c0-4-3-6-7-6 0 4 3 6 7 6zM12 14c0-3 2-5 6-5 0 3-2 5-6 5z" />
  </svg>
);

// Light bulb icon
export const BulbIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
  </svg>
);

// Hand with heart icon
export const HandHeartIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 15h4l4 2h5a2 2 0 0 0 0-4h-3M7 15v5H3M11 17l7-1 3-3M14 4.5c.7-1.3 2.7-.8 2.5.8-.2 1.2-1.7 2-2.5 2.7-.8-.7-2.3-1.5-2.5-2.7-.2-1.6 1.8-2.1 2.5-.8z" />
  </svg>
);

// Chat with plus icon
export const ChatPlusIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 4h16v12H9l-5 4zM12 7v6M9 10h6" />
  </svg>
);
