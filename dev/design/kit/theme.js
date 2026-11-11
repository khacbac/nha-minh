/*
 * Turns apps/mobile/src/lib/theme/tokens.js into CSS variables, so every mockup
 * uses the app's real values: change a colour in tokens.js, reload, done.
 *
 * semantic.ink.heading   -> --ink-heading
 * semantic.accent.on-primary -> --accent-on-primary
 * palette.ink[900]         -> --palette-ink-900
 */
(() => {
  const tokens = window.module?.exports;
  if (!tokens?.semantic) {
    document.documentElement.dataset.tokens = "missing";
    return;
  }
  const style = document.documentElement.style;
  const walk = (obj, path) => {
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === "object") walk(value, [...path, key]);
      else if (typeof value === "string") style.setProperty(`--${[...path, key].join("-")}`, value);
    }
  };
  walk(tokens.semantic, []);
  walk(tokens.palette, ["palette"]);
  window.SoNhaTokens = tokens;
})();
