/*
 * Template for a new page. To add one:
 *   1. Copy this file to pages/<screen-name>.js (kebab-case).
 *   2. Add <script src="pages/<screen-name>.js"></script> to index.html, where it should sit in the sidebar.
 *   3. Build the screen from UI.* blocks (kit/ui.js). A block the app doesn't have yet?
 *      Add it to kit/ui.js + kit/ui.css, so the Components page shows it too.
 *
 * Not loaded by index.html; it's only here to copy.
 */
(() => {
  Design.page({
    id: "example", // URL: index.html#/example
    title: "Example",
    group: "Screens", // sidebar heading: "Screens", "Sheets", "Library"…
    source: "apps/mobile/src/app/example.tsx", // the RN file this mirrors (or "planned")

    // One frame per state. Omit `states` (and use render() with no argument) for a board page.
    states: [
      { id: "default", title: "Default", note: "What the user sees first." },
      { id: "empty", title: "Empty", note: "Nothing to show yet." },
    ],

    // Optional: ▶ Play flow steps through these [stateId, milliseconds].
    flow: [
      ["default", 2000],
      ["empty", 2000],
    ],

    // Returns the HTML inside the phone for one state.
    render(s) {
      return `
        <div class="screen">
          <div class="grow">
            <span class="h1">${UI.esc(s.title)}</span><p class="body">${UI.esc(s.note)}</p>
          </div>
          ${UI.button("Tiếp tục")}
        </div>`;
    },
  });
})();
