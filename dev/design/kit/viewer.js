/*
 * The Figma-like shell: page list on the left, frames on a canvas, click a
 * frame to focus it, ▶ to play a page's flow. Pages register themselves with
 * Design.page({...}) from pages/*.js; see pages/_template.js for the shape.
 *
 * URL hash keeps your place: #/flash, #/flash/playing (focused).
 */
(() => {
  const pages = [];
  window.Design = {
    page(def) {
      pages.push(def);
    },
    // Lets a flow page reuse another page's frame: Design.frame("learn", "playing").
    frame(pageId, stateId) {
      const page = pages.find((p) => p.id === pageId);
      const state = page?.states?.find((s) => s.id === stateId);
      return page && state
        ? page.render(state)
        : `<p class="empty">Missing ${pageId}/${stateId}</p>`;
    },
  };

  const esc = (s) => window.UI.esc(s);
  const $ = (sel) => document.querySelector(sel);

  const storage = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(`bibo-design.${key}`);
        return v === null ? fallback : JSON.parse(v);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(`bibo-design.${key}`, JSON.stringify(value));
      } catch {}
    },
  };

  const ZOOMS = [0.25, 0.33, 0.5, 0.67, 0.75, 1];
  let zoom = storage.get("zoom", 0.5);
  let playTimer = null;

  function parseHash() {
    const [, pageId, stateId] = location.hash.split("/");
    const page = pages.find((p) => p.id === pageId) ?? pages[0];
    const state = page?.states?.find((s) => s.id === stateId) ?? null;
    return { page, state };
  }

  function go(pageId, stateId) {
    location.hash = stateId ? `#/${pageId}/${stateId}` : `#/${pageId}`;
  }

  function renderSidebar(page, state) {
    const groups = [...new Set(pages.map((p) => p.group ?? "Pages"))];
    $("#pages").innerHTML = groups
      .map(
        (g) =>
          `<div class="group">${esc(g)}</div>${pages
            .filter((p) => (p.group ?? "Pages") === g)
            .map(
              (p) =>
                `<a class="page-link${p === page ? " active" : ""}" href="#/${p.id}">${esc(p.title)}</a>`,
            )
            .join("")}`,
      )
      .join("");
    $("#layers").innerHTML = page?.states
      ? `<div class="group">Frames</div>${page.states
          .map(
            (s) =>
              `<a class="layer-link${s === state ? " active" : ""}" href="#/${page.id}/${s.id}">${esc(s.title)}</a>`,
          )
          .join("")}`
      : "";
  }

  function renderToolbar(page) {
    $("#title").textContent = page.title;
    $("#source").textContent = page.source ?? "";
    $("#zoom-value").textContent = `${Math.round(zoom * 100)}%`;
    $("#zoom-tools").hidden = !page.states;
    $("#play").hidden = !page.flow;
  }

  function renderCanvas(page) {
    const canvas = $("#canvas");
    canvas.style.setProperty("--zoom", zoom);
    if (!page.states) {
      canvas.innerHTML = `<div class="board">${page.render()}</div>`;
      return;
    }
    canvas.innerHTML = `<div class="frames">${page.states
      .map(
        (s) => `<figure class="frame">
          <figcaption><a href="#/${page.id}/${s.id}">${esc(page.title)} / ${esc(s.title)}</a></figcaption>
          <a class="frame-body" href="#/${page.id}/${s.id}" aria-label="Focus ${esc(s.title)}">${window.UI.phone(page.render(s))}</a>
          ${s.note ? `<p class="note">${esc(s.note)}</p>` : ""}
        </figure>`,
      )
      .join("")}</div>`;
  }

  function renderFocus(page, state) {
    const overlay = $("#focus");
    if (!state) {
      overlay.hidden = true;
      stopPlay();
      return;
    }
    overlay.hidden = false;
    const scale = Math.min((innerHeight - 170) / 844, (innerWidth - 120) / 390, 1);
    const i = page.states.indexOf(state);
    $("#focus-title").textContent = `${page.title} / ${state.title}`;
    $("#focus-note").textContent = state.note ?? "";
    $("#focus-stage").innerHTML =
      `<div class="focus-phone" style="zoom:${scale}">${window.UI.phone(page.render(state))}</div>`;
    $("#focus-states").innerHTML = page.states
      .map(
        (s) =>
          `<a class="chip${s === state ? " active" : ""}" href="#/${page.id}/${s.id}">${esc(s.title)}</a>`,
      )
      .join("");
    $("#prev").onclick = () => go(page.id, page.states.at(i - 1).id);
    $("#next").onclick = () => go(page.id, page.states[(i + 1) % page.states.length].id);
    $("#focus-play").hidden = !page.flow;
    $("#focus-play").textContent = playTimer ? "■ Stop" : "▶ Play flow";
  }

  function startPlay(page) {
    stopPlay();
    const flow = page.flow;
    let i = 0;
    const step = () => {
      const [stateId, ms] = flow[i % flow.length];
      i += 1;
      go(page.id, stateId);
      playTimer = setTimeout(step, ms);
    };
    playTimer = -1; // mark as playing before the first render
    step();
  }

  function stopPlay() {
    if (playTimer && playTimer !== -1) clearTimeout(playTimer);
    playTimer = null;
  }

  function render() {
    const { page, state } = parseHash();
    if (!page) {
      $("#canvas").innerHTML = '<p class="empty">No pages registered. See pages/_template.js.</p>';
      return;
    }
    document.title = `${page.title} · Nhà Mình Design`;
    renderSidebar(page, state);
    renderToolbar(page);
    // Re-render the canvas only when the page changes, so focusing doesn't restart its animations.
    if ($("#canvas").dataset.page !== page.id) {
      renderCanvas(page);
      $("#canvas").dataset.page = page.id;
    }
    renderFocus(page, state);
  }

  function setZoom(next) {
    zoom = next;
    storage.set("zoom", zoom);
    $("#zoom-value").textContent = `${Math.round(zoom * 100)}%`;
    $("#canvas").style.setProperty("--zoom", zoom);
  }
  const stepZoom = (dir) => {
    const i = ZOOMS.findIndex((z) => z >= zoom - 0.001);
    setZoom(ZOOMS[Math.max(0, Math.min(ZOOMS.length - 1, (i < 0 ? 0 : i) + dir))]);
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (document.documentElement.dataset.tokens === "missing") {
      $("#warning").hidden = false;
    }
    $("#zoom-in").onclick = () => stepZoom(1);
    $("#zoom-out").onclick = () => stepZoom(-1);
    $("#zoom-fit").onclick = () => {
      const { page } = parseHash();
      const n = page?.states?.length ?? 1;
      const width = $("#canvas").clientWidth - 96;
      const fit = (width - (n - 1) * 48) / (n * 390);
      setZoom(ZOOMS.filter((z) => z <= Math.max(fit, ZOOMS[0])).at(-1) ?? ZOOMS[0]);
    };
    $("#play").onclick = () => startPlay(parseHash().page);
    $("#focus-play").onclick = () => {
      if (playTimer) {
        stopPlay();
        render();
      } else startPlay(parseHash().page);
    };
    $("#focus-close").onclick = () => {
      stopPlay();
      go(parseHash().page.id);
    };
    $("#focus").addEventListener("click", (e) => {
      if (e.target.id === "focus") $("#focus-close").click();
    });
    $("#menu").onclick = () => document.body.classList.toggle("sidebar-open");

    addEventListener("hashchange", () => {
      document.body.classList.remove("sidebar-open");
      render();
    });
    addEventListener("resize", () => {
      if (parseHash().state) render();
    });
    addEventListener("keydown", (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const focused = !$("#focus").hidden;
      if (focused && e.key === "ArrowRight") $("#next").click();
      else if (focused && e.key === "ArrowLeft") $("#prev").click();
      else if (focused && e.key === "Escape") $("#focus-close").click();
      else if (focused && e.key === " ") {
        e.preventDefault();
        $("#focus-play").click();
      } else if (!focused && (e.key === "+" || e.key === "=")) stepZoom(1);
      else if (!focused && e.key === "-") stepZoom(-1);
    });
    render();
  });
})();
