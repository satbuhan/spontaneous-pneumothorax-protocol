(function () {
  "use strict";

  // This tool's own slug, used to (a) skip self-links when another tool's
  // glossary term points back here and (b) build this tool's own deep links
  // when it's the one being pointed at. Every tool in the atlas sets this to
  // its own repo name.
  const TOOL_SLUG = "spontaneous-pneumothorax-protocol";

  /* The source figure's flow: a single trunk running down the centre
     column, with decision diamonds in that centre column and their Yes/No
     outcomes branching to a box on the left or right of the same row —
     exactly the aortic-dissection-protocol / agitation-delirium-protocol
     "col-left / col-center / col-right" pattern, not metoclopramide's
     multi-row fan-out. One genuinely new feature versus every earlier tool
     in this atlas: a real backward FEEDBACK edge (the figure's dashed
     "Reassess" arrow), from the second-aspiration-attempt box back up to
     the re-expansion decision one row above it — see the "loop" variant
     in drawEdges() below. */
  const LAYOUT = {
    entry:                  { col: "full",      row: 1 },

    "tension-decision":     { col: "col-center", row: 2, decision: true },
    "immediate-rec":        { col: "col-right",  row: 2 },

    "highrisk-list":        { col: "col-left",   row: 3 },
    "highrisk-decision":    { col: "col-center", row: 3, decision: true },
    "tube-thoracostomy-rec":{ col: "col-right",  row: 3 },

    "conservative-rec":     { col: "col-left",   row: 4 },
    "symptomatic-decision": { col: "col-center", row: 4, decision: true },

    "aspiration-rec":       { col: "full",       row: 5 },

    "discharge-rec":        { col: "col-left",   row: 6 },
    "reexpansion-decision": { col: "col-center", row: 6, decision: true },

    "residual-decision":    { col: "col-center", row: 7, decision: true },
    "second-attempt-rec":   { col: "col-right",  row: 7 },

    "ambulatory-rec":       { col: "full",       row: 8 },

    "drain-removal-rec":    { col: "col-left",   row: 9 },
    "airleak-decision":     { col: "col-center", row: 9, decision: true },

    "escalate-rec":         { col: "full",       row: 10 },
    "recurrence-rec":       { col: "full",       row: 11 }
  };

  const EDGES = [
    ["entry", "tension-decision"],
    ["tension-decision", "immediate-rec", "Yes"],
    ["tension-decision", "highrisk-decision", "No"],

    ["highrisk-decision", "highrisk-list", null, "info"],
    ["highrisk-decision", "tube-thoracostomy-rec", "Yes"],
    ["highrisk-decision", "symptomatic-decision", "No"],

    ["symptomatic-decision", "conservative-rec", "No"],
    ["symptomatic-decision", "aspiration-rec", "Yes"],

    ["aspiration-rec", "reexpansion-decision"],

    ["reexpansion-decision", "discharge-rec", "Yes"],
    ["reexpansion-decision", "residual-decision", "No"],

    ["residual-decision", "second-attempt-rec", "Yes"],
    // The figure's dashed feedback arrow: a genuine loop back up to the
    // decision one row above, not a forward step. See drawEdges().
    ["second-attempt-rec", "reexpansion-decision", "Reassess", "loop"],
    ["residual-decision", "ambulatory-rec", "No"],

    ["ambulatory-rec", "airleak-decision"],

    ["airleak-decision", "drain-removal-rec", "No"],
    ["airleak-decision", "escalate-rec", "Yes"],

    ["escalate-rec", "recurrence-rec"]
  ];

  const byId = {};
  NODES.forEach((n) => (byId[n.id] = n));

  /* ---- plain-text safety + glossary auto-linking ---- */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // longest match first, so a longer term wins over any shorter overlapping one
  const GLOSSARY_SORTED = GLOSSARY.slice().sort((a, b) => b.match.length - a.match.length);

  /* ---- agent name emphasis ----
     This tool compares two procedures, not two drugs, so AGENTS is empty —
     kept only so highlightAgentsHtml()/linkify() behave identically to
     every other tool in the atlas without a special case. */
  const AGENTS_SORTED = (typeof AGENTS !== "undefined" ? AGENTS : [])
    .slice()
    .sort((a, b) => b.length - a.length);

  function highlightAgentsHtml(rawText) {
    const text = escapeHtml(rawText);
    let result = "";
    let cursor = 0;
    while (cursor < text.length) {
      let best = null;
      for (const name of AGENTS_SORTED) {
        const re = new RegExp("\\b" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
        const m = re.exec(text.slice(cursor));
        if (
          m &&
          (!best || m.index < best.index || (m.index === best.index && m[0].length > best.text.length))
        ) {
          best = { index: m.index, text: m[0] };
        }
      }
      if (!best) break;
      const matchStart = cursor + best.index;
      const matchEnd = matchStart + best.text.length;
      result += text.slice(cursor, matchStart);
      result += '<strong class="agent-name">' + best.text + "</strong>";
      cursor = matchEnd;
    }
    result += text.slice(cursor);
    return result;
  }

  /* ---- cross-atlas concept links ----
     A term that's independently glossary-defined in 2+ tools (checked and
     curated by hand when the index was built — same string, same clinical
     meaning, not just a coincidental match) gets a "Also covered in" line
     added under its definition, deep-linking straight to the other tool's
     node via its #node-<id> hash. Fetched once, best-effort: the page works
     identically if this never loads (slow network, offline, concepts.json
     unreachable) — it only adds a line that otherwise doesn't appear. */
  let CONCEPTS = null;
  let currentNodeId = null; // re-rendered once CONCEPTS loads, if a node is already open
  fetch("https://satbuhan.github.io/clinical-algorithm-atlas/assets/concepts.json")
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      CONCEPTS = (data && data.terms) || {};
      if (currentNodeId) selectNode(currentNodeId);
    })
    .catch(() => {
      CONCEPTS = {};
    });

  // Other tools' occurrences of this same term, as an "Also covered in"
  // list — empty string if the index hasn't loaded yet, carries nothing to
  // show, or every occurrence is this tool itself.
  function crossLinksHtml(matchText) {
    if (!CONCEPTS) return "";
    const entries = CONCEPTS[matchText.toLowerCase().trim()];
    if (!entries) return "";
    const others = entries.filter((o) => o.tool !== TOOL_SLUG);
    if (!others.length) return "";
    const links = others
      .map((o) => {
        const href = o.nodeId ? o.url + "#node-" + o.nodeId : o.url;
        return '<a href="' + href + '">' + escapeHtml(o.title) + " →</a>";
      })
      .join(", ");
    return '<p class="term-crosslinks">Also covered in: ' + links + "</p>";
  }

  function linkify(rawText, usedTerms) {
    const text = escapeHtml(rawText);
    let result = "";
    let cursor = 0;
    // find the earliest, longest unused glossary match from `cursor` onward
    while (cursor < text.length) {
      let best = null;
      for (const g of GLOSSARY_SORTED) {
        if (usedTerms.has(g.match)) continue;
        const re = new RegExp("\\b" + g.match.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b");
        const m = re.exec(text.slice(cursor));
        if (
          m &&
          (!best || m.index < best.index || (m.index === best.index && m[0].length > best.text.length))
        ) {
          best = { index: m.index, text: m[0], kind: "term", g };
        }
      }
      for (const name of AGENTS_SORTED) {
        const re = new RegExp("\\b" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
        const m = re.exec(text.slice(cursor));
        if (
          m &&
          (!best || m.index < best.index || (m.index === best.index && m[0].length > best.text.length))
        ) {
          best = { index: m.index, text: m[0], kind: "agent" };
        }
      }
      if (!best) break;
      const matchStart = cursor + best.index;
      const matchEnd = matchStart + best.text.length;
      result += text.slice(cursor, matchStart);
      if (best.kind === "agent") {
        result += '<strong class="agent-name">' + best.text + "</strong>";
      } else {
        const g = best.g;
        const label = g.full ? g.full[0].toUpperCase() + g.full.slice(1) : "";
        result +=
          '<button type="button" class="term" aria-expanded="false">' +
          best.text +
          "</button>" +
          '<span class="term-def" hidden>' +
          (g.full ? "<strong>" + escapeHtml(label) + "</strong> — " : "") +
          escapeHtml(g.def) +
          crossLinksHtml(g.match) +
          "</span>";
        usedTerms.add(g.match);
      }
      cursor = matchEnd;
    }
    result += text.slice(cursor);
    return result;
  }

  const flowEl = document.getElementById("flow");
  const edgesSvg = document.getElementById("edges");

  function nodeEl(n) {
    const layout = LAYOUT[n.id] || {};
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "node-" + n.id;
    btn.dataset.node = n.id;
    btn.setAttribute("aria-pressed", "false");

    let cls = "node";
    if (layout.decision) cls += " node--decision";
    if (n.type === "terminal") cls += " node--terminal";
    if (n.tone === "key") cls += " node--key";
    if (n.tone === "alarm") cls += " node--alarm";
    if (n.tone === "note") cls += " node--note";
    if (layout.col) cls += " " + layout.col;
    btn.className = cls;
    if (layout.row) btn.style.gridRow = String(layout.row);

    const title = document.createElement("span");
    title.className = "node__title";
    title.innerHTML = highlightAgentsHtml(n.label);
    btn.appendChild(title);

    if (n.sub) {
      const sub = document.createElement("span");
      sub.className = "node__sub";
      sub.innerHTML = highlightAgentsHtml(n.sub);
      btn.appendChild(sub);
    }

    btn.addEventListener("click", () => selectNode(n.id));
    return btn;
  }

  function render() {
    NODES.forEach((n) => flowEl.appendChild(nodeEl(n)));
  }

  function clearActive() {
    document.querySelectorAll(".node.is-active").forEach((el) => {
      el.classList.remove("is-active");
      el.setAttribute("aria-pressed", "false");
    });
  }

  const readout = document.getElementById("readout");
  const readoutIdle = document.getElementById("readoutIdle");
  const readoutContent = document.getElementById("readoutContent");
  const readoutClose = document.getElementById("readoutClose");
  const backdrop = document.getElementById("backdrop");

  function kindTag(ids) {
    return ids
      .map((id) => '<a class="refchip" href="#ref-' + id + '">[' + id + "]</a>")
      .join("");
  }

  function renderDose(rows, usedTerms) {
    if (!rows) return "";
    const trs = rows
      .map(
        (r) =>
          "<tr><td>" +
          linkify(r[0], usedTerms) +
          "</td><td>" +
          linkify(r[1], usedTerms) +
          "</td></tr>"
      )
      .join("");
    return '<table class="dose-table"><tbody>' + trs + "</tbody></table>";
  }

  function selectNode(id) {
    const n = byId[id];
    if (!n) return;
    currentNodeId = id;
    clearActive();
    const el = document.getElementById("node-" + id);
    if (el) {
      el.classList.add("is-active");
      el.setAttribute("aria-pressed", "true");
    }

    readoutIdle.hidden = true;
    readoutContent.hidden = false;

    const usedTerms = new Set();

    let html = "";
    html += '<p class="readout__tag">' + escapeHtml(n.type) + "</p>";
    html += '<h2 class="readout__title">' + highlightAgentsHtml(n.label) + "</h2>";
    if (n.sub) html += '<p class="readout__sub">' + highlightAgentsHtml(n.sub) + "</p>";
    if (n.needsAuthor) {
      html += '<span class="readout__flag">awaiting author citation</span>';
    }
    html += "<h3>What this means</h3><p>" + linkify(n.meaning, usedTerms) + "</p>";
    if (n.dose) {
      html += "<h3>Dosing, as authored</h3>" + renderDose(n.dose, usedTerms);
    }
    html += "<h3>Why</h3><p>" + linkify(n.rationale, usedTerms) + "</p>";
    if (n.cautions && n.cautions.length) {
      html +=
        "<h3>Cautions &amp; special populations</h3><ul class=\"caution-list\">" +
        n.cautions.map((c) => "<li>" + linkify(c, usedTerms) + "</li>").join("") +
        "</ul>";
    }
    html += "<h3>References</h3><div class=\"refchips\">" + kindTag(n.refs) + "</div>";

    readoutContent.innerHTML = html;

    if (window.matchMedia("(max-width: 900px)").matches) {
      readout.classList.add("is-open");
      backdrop.classList.add("is-open");
    }
  }

  function closeReadout() {
    readout.classList.remove("is-open");
    backdrop.classList.remove("is-open");
  }

  readoutContent.addEventListener("click", (e) => {
    const btn = e.target.closest(".term");
    if (!btn) return;
    const def = btn.nextElementSibling;
    if (!def || !def.classList.contains("term-def")) return;
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", open ? "false" : "true");
    def.hidden = open;
  });

  readoutClose.addEventListener("click", closeReadout);
  backdrop.addEventListener("click", closeReadout);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeReadout();
  });

  /* ---- references list ---- */
  function renderReferences() {
    const list = document.getElementById("referencesList");
    const count = document.getElementById("refCount");
    const verified = typeof VERIFIED !== "undefined" ? VERIFIED : null;
    if (count) {
      count.textContent = "(" + REFERENCES.length + ")" + (verified ? " — verified " + verified : "");
    }
    REFERENCES.forEach((r) => {
      const li = document.createElement("li");
      li.id = "ref-" + r.id;
      const linkHtml = r.url
        ? "<br><a href=\"" + r.url + '" target="_blank" rel="noopener">' + r.url + "</a>"
        : "";
      li.innerHTML = r.text + ' <span class="kind">' + r.kind + "</span>" + linkHtml;
      list.appendChild(li);
    });
  }

  /* ---- connector lines (desktop + mobile) ---- */
  function pointAt(el, side) {
    const flowRect = flowEl.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const x = {
      left: r.left,
      right: r.right,
      center: (r.left + r.right) / 2
    };
    const y = {
      top: r.top,
      bottom: r.bottom,
      center: (r.top + r.bottom) / 2
    };
    return {
      x: x[side.x] - flowRect.left,
      y: y[side.y] - flowRect.top
    };
  }

  function drawEdges() {
    const flowRect = flowEl.getBoundingClientRect();
    edgesSvg.setAttribute("width", flowRect.width);
    edgesSvg.setAttribute("height", flowRect.height);
    edgesSvg.setAttribute("viewBox", "0 0 " + flowRect.width + " " + flowRect.height);
    edgesSvg.innerHTML =
      '<defs><marker id="arrow" markerWidth="9" markerHeight="9" refX="6.5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#4A6684"/></marker></defs>';

    EDGES.forEach(([fromId, toId, label, variant]) => {
      const a = document.getElementById("node-" + fromId);
      const b = document.getElementById("node-" + toId);
      if (!a || !b) return;
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();

      let p1, p2, d, labelPos;

      if (variant === "loop") {
        // The figure's one genuine backward edge: a dashed feedback arrow
        // from a box back up to the decision diamond one row above it
        // ("Reassess"). Every other edge in this atlas so far only ever
        // moves forward (same row, or down), so the generic same-row/
        // vertical logic below assumes the target is level with or below
        // the source — wrong here, hence this dedicated branch.
        // Routed as a small loop bulging out to the right of both nodes
        // (clear of every box in the trunk), connecting the source's own
        // top-right corner to the target diamond's right vertex.
        p1 = pointAt(a, { x: "right", y: "top" });
        p2 = pointAt(b, { x: "right", y: "center" });
        const bulge = 42;
        d =
          "M" + p1.x + "," + p1.y +
          " C" + (p1.x + bulge) + "," + p1.y + " " + (p2.x + bulge) + "," + p2.y + " " + p2.x + "," + p2.y;
        labelPos = { x: Math.max(p1.x, p2.x) + bulge + 4, y: (p1.y + p2.y) / 2, anchor: "start" };
      } else {
        // Compare vertical CENTERS, not tops: a decision diamond uses
        // align-self:center (it doesn't stretch to the row's full height),
        // while an ordinary box with multi-line sub text can be taller
        // than the row's other cells — so two nodes genuinely on the same
        // grid row can still have different `top`s even though they're
        // vertically centered on each other.
        const aCenterY = (ar.top + ar.bottom) / 2;
        const bCenterY = (br.top + br.bottom) / 2;

        if (Math.abs(aCenterY - bCenterY) < 8) {
          p1 = pointAt(a, { x: ar.left < br.left ? "right" : "left", y: "center" });
          p2 = pointAt(b, { x: ar.left < br.left ? "left" : "right", y: "center" });
        } else {
          p1 = pointAt(a, { x: "center", y: "bottom" });
          p2 = pointAt(b, { x: "center", y: "top" });
        }

        const sameRow = Math.abs(p1.y - p2.y) < 4;
        if (sameRow) {
          d = "M" + p1.x + "," + p1.y + " L" + p2.x + "," + p2.y;
        } else {
          const midY = (p1.y + p2.y) / 2;
          d =
            "M" + p1.x + "," + p1.y +
            " C" + p1.x + "," + midY + " " + p2.x + "," + midY + " " + p2.x + "," + p2.y;
        }
        const lx = sameRow ? (p1.x + p2.x) / 2 : p2.x + (p1.x > p2.x ? -10 : 10);
        const ly = sameRow ? p1.y - 8 : p1.y + (p2.y - p1.y) * 0.22;
        labelPos = { x: lx, y: ly, anchor: "middle" };
      }

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d);
      path.setAttribute(
        "class",
        "flow-edge" + (variant === "info" ? " is-info" : "") + (variant === "loop" ? " is-loop" : "")
      );
      if (variant !== "info") path.setAttribute("marker-end", "url(#arrow)");
      edgesSvg.appendChild(path);

      if (label) {
        const labelW = Math.max(28, label.length * 6.1 + 12);
        const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bg.setAttribute("class", "edge-label-bg");
        bg.setAttribute(
          "x",
          labelPos.anchor === "start" ? labelPos.x - 2 : labelPos.x - labelW / 2
        );
        bg.setAttribute("y", labelPos.y - 11);
        bg.setAttribute("width", labelW);
        bg.setAttribute("height", 14);
        edgesSvg.appendChild(bg);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("class", "edge-label");
        text.setAttribute("x", labelPos.x);
        text.setAttribute("y", labelPos.y);
        text.setAttribute("text-anchor", labelPos.anchor);
        text.textContent = label;
        edgesSvg.appendChild(text);
      }
    });
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(drawEdges, 120);
  });

  render();
  renderReferences();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(drawEdges);
  }
  window.addEventListener("load", drawEdges);
  drawEdges();

  // Deep link support: "#node-<id>" opens that node's readout and scrolls
  // it into view on arrival.
  const linkedNodeId = window.location.hash.replace(/^#node-/, "");
  if (linkedNodeId && byId[linkedNodeId]) {
    selectNode(linkedNodeId);
    window.addEventListener("load", () => {
      const el = document.getElementById("node-" + linkedNodeId);
      if (el) el.scrollIntoView({ block: "center", inline: "center" });
    });
  }
})();
