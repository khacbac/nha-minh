/**
 * Line icons, 24×24, stroke only. One `d` string per icon so the RN `<Icon>` and the HTML
 * design (dev/design/kit/ui.js) draw the exact same shapes. Stroke width and caps are set by
 * the renderer (1.8, round). Add an icon here, never inline an SVG in a screen.
 */

/** A full circle as a path, so every icon stays a single `d` string. */
const circle = (cx, cy, r) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

const icons = {
  // Categories (features/categories/category-data.js)
  basket:
    "M3 10h18M4.8 10l1.5 8.3A2 2 0 0 0 8.3 20h7.4a2 2 0 0 0 2-1.7L19.2 10M8.5 10 11 4.5M15.5 10 13 4.5M10 13.5v3M14 13.5v3",
  utensils: "M6 3v6a3 3 0 0 0 6 0V3M9 3v18M18 21V3c-2 1-3.5 3.5-3.5 7.5V13H18",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3",
  scooter: `${circle(6, 17, 2.5)}${circle(18, 17, 2.5)}M8.5 17h7M14 5h2.6l2.4 9.5M18.9 14.5H12L10.4 11H4.5`,
  baby: `${circle(12, 13, 7)}M12 6c0-1.6 1.1-2.6 2.6-2.6M9.5 12.2v.01M14.5 12.2v.01M10 15.6a2.6 2.6 0 0 0 4 0`,
  lotus:
    "M12 20c-4.2 0-8-2-9-6.2 3 0 6.2 1.2 9 4.2 2.8-3 6-4.2 9-4.2-1 4.2-4.8 6.2-9 6.2zM12 18c-2.2-2.2-2.6-6.2 0-10.5 2.6 4.3 2.2 8.3 0 10.5z",
  gift: "M4 11h16v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM3 7h18v4H3zM12 7v13M12 7C10.5 3.5 7.2 3.8 7.6 5.8 8 7.2 12 7 12 7zM12 7c1.5-3.5 4.8-3.2 4.4-1.2C16 7.2 12 7 12 7z",
  heart:
    "M12 20s-7.5-4.4-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.6 12 20 12 20zM7.5 11.5h2.2l1.2-2 2.2 4 1.2-2h2.2",
  bag: "M5 8h14l-1 12.2H6zM9 8V6.5a3 3 0 0 1 6 0V8",
  home: "M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z",
  users: `${circle(9, 8, 3.2)}M3 20a6 6 0 0 1 12 0${circle(17, 9, 2.5)}M16 14.1A4.6 4.6 0 0 1 21 18.6`,
  paw: `${circle(6.5, 10.5, 1.6)}${circle(9.6, 6.6, 1.6)}${circle(14.4, 6.6, 1.6)}${circle(17.5, 10.5, 1.6)}M12 12.2c-3 0-5.5 3.1-5.5 5.4 0 1.5 1.2 2.4 2.7 2.4 1 0 1.8-.5 2.8-.5s1.8.5 2.8.5c1.5 0 2.7-.9 2.7-2.4 0-2.3-2.5-5.4-5.5-5.4z`,
  sparkle:
    "M11 3.5l1.8 4.7 4.7 1.8-4.7 1.8L11 16.5l-1.8-4.7L4.5 10l4.7-1.8zM18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z",
  star: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z",
  wallet:
    "M4 7.5h14.5a1.5 1.5 0 0 1 1.5 1.5v9.5a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 18.5zM4 7.5 15.5 4v3.5M16.5 13.75h.01",
  dots: `${circle(6, 12, 1.2)}${circle(12, 12, 1.2)}${circle(18, 12, 1.2)}`,

  // UI
  plus: "M12 5v14M5 12h14",
  back: "M15 5l-7 7 7 7",
  "chevron-left": "M14.5 6l-6 6 6 6",
  "chevron-right": "M9.5 6l6 6-6 6",
  close: "M6 6l12 12M18 6 6 18",
  check: "M5 12.5l4.5 4.5L19 7",
  trash:
    "M4 7h16M9.5 7V4.5h5V7M6 7l1 12.5a1 1 0 0 0 1 .9h8a1 1 0 0 0 1-.9L18 7M10 11v5.5M14 11v5.5",
  pencil: "M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17zM14 8l2 2",
  calendar:
    "M5 5.5h14a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1zM4 10h16M8.5 3.5v4M15.5 3.5v4",
  clock: `${circle(12, 12, 8.5)}M12 7.5V12l3 2`,
  note: "M5 6h14M5 11h14M5 16h9",
  book: "M5 4.5h11a2 2 0 0 1 2 2V20H7a2 2 0 0 1-2-2zM5 18a2 2 0 0 1 2-2h11",
  chart: "M4 20h16M7 16.5v-5M12 16.5V6M17 16.5v-8",
};

module.exports = { icons };
