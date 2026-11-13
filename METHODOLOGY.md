# How these tools are built — methodology

This file exists so that **any** collaborator — a person, or any AI
assistant (Claude, ChatGPT, Gemini, or otherwise) — can pick up this project
in a new session and build the next tool the same way, without having to
reverse-engineer the conventions from scratch. If you are an AI reading
this because you were asked to build or extend a tool for this atlas, treat
this file as your instructions.

**Authors:** Dr. Özgür Karcıoğlu & Dr. Satuk Buğra Han Bozatlı.
**What this is:** a growing series of interactive, referenced
clinical-algorithm web tools, each converted from the authors' own
hand-drawn flowcharts or manuscript figures. Existing tools:
`aortic-dissection-protocol`, `agitation-delirium-protocol`,
`influenza-antiviral-protocol`, `nsaid-pain-protocol`,
`anticoagulant-reversal-protocol`, `obesity-critical-care-protocol`,
`dapagliflozin-overdose-protocol`, `lidocaine-prilocaine-protocol`,
`pte-thrombolysis-protocol`, `lmwh-nste-acs-protocol`,
`ketamine-head-injury-protocol`, `midazolam-clonazepam-protocol`,
`vasopressor-shock-protocol`, `wbct-trauma-protocol`,
`epinephrine-revisited-protocol`, `ketamine-indications-protocol`,
`tenecteplase-alteplase-stemi-protocol`, `cwa-blood-gas-protocol`,
`ccb-toxicity-protocol`, `haloperidol-adjunct-protocol`,
`succinylcholine-rocuronium-protocol`, `geriatric-pain-protocol`,
`metoclopramide-ondansetron-protocol`, `spontaneous-pneumothorax-protocol`,
`button-battery-protocol`,
`beta-lactam-infusion-protocol`
(GitHub account: satbuhan). Hub page listing all of them:
`clinical-algorithm-atlas`.

## The one rule that overrides everything else

The authored algorithm — every box, every decision diamond, every drug
name, every numeric dose — must stay **byte-for-byte unchanged** from what
the authors drew or specified. You may add supplementary explanatory /
academic content only: what a step means, why the protocol calls for it,
cautions, and citations. Never "fix", paraphrase, round, or standardize a
`label`, `sub`, or `dose` field without the author team's explicit
sign-off — those fields are the algorithm itself, not prose. If you edit
`content.js`, grep the `NODES` array before and after your edit and
confirm every `label`/`sub`/`dose` string is identical. This includes
punctuation: splitting one authored box's text across `label` and `sub`
must not silently drop a semicolon, comma, or parenthesis that was present
in the original — reconstruct `label + " " + sub` and compare it against
the source, not just the words. The same fidelity rule has two directions,
not one: never invent punctuation the source doesn't have, but also never
add punctuation to "fix" a plain line break the source genuinely leaves
unpunctuated — a bare line break can correctly map to no inserted
character, to a preserved literal `\n` (see "Itemized / bulleted box
content" below), but never to a comma or semicolon you supplied yourself.

This extends to the diagram's own shape, not just its text: if a source
figure draws two visually separate, arrow-connected boxes where a first
read might see one box with an internal split (a header label over its own
content), or draws only some of the arrows a decision's downstream options
might seem to deserve, preserve exactly what is drawn — the number of
boxes and the number and direction of arrows are part of the authored
algorithm too. When in doubt, crop the source image at native resolution
and look again rather than trusting an earlier description (this caught a
real error in `ketamine-head-injury-protocol`: a complication-decision box
was initially described as fanning out to all six downstream boxes, when
the source actually draws only two arrows out of it).

## Repo structure — one GitHub repo per tool

Each tool is its **own** GitHub repository, with its own independent
GitHub Pages deployment — not a subfolder inside another tool's repo. (An
earlier version of this project put two tools in one repo; the GitHub
Pages deployments list mixed them together in a confusing way and this
was explicitly abandoned in favor of full separation. Don't repeat that.)

Each tool repo looks like this:

```
index.html          page structure, masthead, English-only disclaimer
                     (an earlier version of this project carried a Turkish
                     translation of the disclaimer too; that was dropped
                     project-wide — keep everything on these pages in
                     English, including the disclaimer, not just the
                     algorithm content),
                     footer with a single absolute cross-link (target="_blank"
                     rel="noopener") back to the atlas hub, plus a
                     "Report an issue" link straight to this repo's own
                     GitHub issues/new page — the hub's own grouped,
                     always-current gallery is the one place to browse
                     every tool now; don't reintroduce a per-tool sister
                     link list here.
assets/style.css     visual design — shared paper/ink/navy "journal"
                     palette across the atlas; the diagram grid (column
                     count and widths) adapted per tool to match how many
                     parallel branches that algorithm actually has
assets/content.js    single source of truth for content: REFERENCES[],
                     NODES[], GLOSSARY[] — schema below
assets/app.js        rendering + interaction: a LAYOUT + EDGES description
                     drives an SVG flowchart; click-to-expand detail panel
                     on desktop, bottom sheet on mobile
README.md            what the tool is, links to sister tools in the atlas,
                     status, disclaimer, how it's built, how to edit it
LICENSE.md           CC BY-NC-SA 4.0, both authors credited
```

No build step, no framework — plain static files that GitHub Pages serves
directly from the `main` branch root. Enabling Pages is a manual step in
the repo's Settings → Pages → "Deploy from branch" → `main` → `/ (root)` →
**Save** — the Save click is easy to miss. Don't assume Pages is live
because the branch/folder was picked; verify with
`gh api repos/<owner>/<repo> --jq '{has_pages}'`.

Creating the empty GitHub repository itself is a step only the human
author can do — an AI assistant working from an API-scoped session
typically cannot call a repo-creation endpoint. Ask the author to create
an empty repo (no README/.gitignore/license) via GitHub's web UI, then
clone into it and push.

## `content.js` schema

- `VERIFIED`: top-level `const VERIFIED = "YYYY-MM-DD";` (or `null`) -- the
  date this tool's content and citations were last built/checked together.
  Set it to the date you actually *finish* the citation-verification pass
  below, not when you started. Use `null` with an explanatory comment
  instead of a backfilled guess if verification is genuinely incomplete
  when you ship. `assets/app.js`'s References `<summary>` shows
  "(N) — verified <date>" when set, nothing extra when `null`.
- `REFERENCES`: array of `{id, kind, text, url}`. `url` can be `null` (or
  omitted) for a source with no stable link — e.g. an unpublished
  manuscript. When rendering references, skip the linked-URL line entirely
  if `url` is falsy; don't link to something that doesn't exist. If a
  trial is multi-arm and only two of its arms are the comparison this tool
  cites, say so directly in `kind` rather than citing it as if it were a
  plain two-arm trial.
- `NODES`: array of `{id, type, label, sub?, meaning, rationale,
  dose?: [[label, value], ...], cautions?: [...], refs: [...], tone?,
  needsAuthor?}`. `needsAuthor: true` flags a number or claim that the
  author team still needs to confirm or source — flag it, never invent a
  plausible-sounding citation or number to fill the gap. `tone: "key"`
  marks the pivotal action box on a branch; `tone: "alarm"` marks a "do
  not" / contraindication box — use sparingly, only where the algorithm
  itself singles the step out.
- `GLOSSARY`: array of `{match, full?, def}` — terms auto-linked (with a
  click-to-expand definition) inside the readout panel's prose. An
  abbreviation that appears directly inside a diagram box's own
  `label`/`sub` text is not auto-linked there (those fields render as
  plain text, deliberately, so the diagram stays exactly as authored) —
  expand those instead in a short `.abbrev-note` legend printed under the
  diagram, the same way the original flowchart would carry a legend.

### Cross-atlas concept links

Every tool fetches one shared file at runtime —
`https://satbuhan.github.io/clinical-algorithm-atlas/assets/concepts.json`
— which maps a `GLOSSARY` term (lowercased `match` string) to every tool
that independently defines the same term, each with its own `def`, `url`,
and the `id` of the node that term is actually linked from there (for
deep-linking straight to that box via `#node-<id>`, the same hash every
node button's own DOM id already uses). When a term in this tool's own
`GLOSSARY` has other tools listed against it, its click-to-expand
`.term-def` panel grows an extra "Also covered in: <tool> →" line,
rendered by `crossLinksHtml()` in `app.js`. The fetch is best-effort and
non-blocking — the page is byte-identical without it, just missing that
one extra line.

`concepts.json` itself is generated by hand-reviewing every term that
appears in 2+ tools' `GLOSSARY` arrays, not by blind string matching.
Regenerate it with `clinical-algorithm-atlas/tools/gen_concepts.py` and
push the one updated file to the hub repo whenever a new tool's `GLOSSARY`
is likely to overlap with an existing one. Every tool also sets its own
`TOOL_SLUG` constant near the top of `app.js` (its repo name).

### Itemized / bulleted box content

Most boxes flatten naturally to one line or to comma-separated prose. But
when a source box is genuinely drawn as a bulleted or enumerated list,
preserve it as literal `\n` line breaks inside the `sub` string, one item
per line, with `white-space: pre-line;` on both `.node__sub` and
`.readout__sub` — without it the browser collapses the `\n` characters
back into a single run-on line.

### A real backward FEEDBACK edge (`spontaneous-pneumothorax-protocol`)

Every earlier tool's "reassess"/"repeat" box was just an ordinary forward
step named "reassess" — the flow always moved down or sideways, never
back up to a node already drawn higher on the page. This tool's source
figure is the first genuine exception: a dashed arrow, explicitly labelled
"Reassess" in the figure's own caption, running from the "second
aspiration attempt" box back up to the re-expansion decision diamond one
row above it, closing an actual loop a reader can repeat (first aspiration
→ reassess → fails → second aspiration → reassess again).

The existing `drawEdges()` same-row/vertical logic assumes a target is
level with or below its source — wrong for a backward edge, and trying to
force it through that path produces a confusing, overlapping line. The fix
is a dedicated `variant === "loop"` branch in `drawEdges()`, checked
*before* the generic row logic (not layered on top of it via the `DETOUR`
table, which only ever reroutes an otherwise-normal forward path around an
obstacle): it connects the source node's own top-right corner to the
target's right vertex with a fixed-size rightward bulge (a cubic Bézier
whose control points sit a constant distance further right than either
endpoint), clear of every box in the trunk since nothing else occupies
that outer gutter. Styled as its own CSS class, `.is-loop` — dashed like
the existing no-arrowhead `.is-info` connector (both read as "secondary,"
not part of the principal pathway), but keeping the arrowhead marker
`.is-info` deliberately omits, since a loop edge still denotes real flow
direction rather than a bare reference link. The edge's label ("Reassess")
is positioned beside the bulge rather than reusing the generic same-row/
vertical label placement math, which assumes the label sits between two
points moving in one consistent direction.

This generalizes directly: any future tool whose source figure draws a
genuine backward loop (not just a box someone happens to call
"reassess") can reuse the same `"loop"` variant rather than inventing a
new one — the implementation takes only the two node ids and draws
correctly regardless of which row either one is actually on.

## Citation verification — do not skip this (default rule — see exception below)

Every reference must be **independently verified** against a real primary
source (search for and open the actual paper, check the DOI resolves to
the claim being cited) before it goes in `REFERENCES`. Do not trust a
source list at face value, even one supplied by the authors' own
manuscript — reference lists can and do contain real errors.

> **Author-directed exception, granted per-tool — not a standing policy.**
> Six tools so far have been built this way, each on its own explicit
> instruction from Dr. Bozatlı, not as a carried-over default:
>
> - `epinephrine-revisited-protocol` (2026) — 57 entries.
> - `ketamine-indications-protocol` (2026) — 47 entries.
> - `haloperidol-adjunct-protocol` (2026) — 74 entries.
> - `geriatric-pain-protocol` (2026) — 52 entries.
> - `metoclopramide-ondansetron-protocol` (2026) — 105 entries.
> - `spontaneous-pneumothorax-protocol` (2026) — asked directly whether to
>   extend the same policy to this tool's 80-entry bibliography (built
>   from a Gemini condensation plus the authors' own Figure 1 and
>   Graphical Abstract `.docx` files), Dr. Bozatlı selected "Yine istisna
>   uygula (hızlı)" (apply the exception again, quick) from the offered
>   choices. 80 entries.
>
> In all six cases the manuscript's own reference list is accepted as
> correct on the author's explicit instruction; every entry in
> `REFERENCES` is transcribed directly from the manuscript's own
> bibliography (DOIs as given, not independently re-resolved), and every
> entry's `kind` field says so plainly ("As cited in the manuscript; not
> independently re-verified"). **This still does not change the default
> rule above for any other tool, including future ones.** Each instance is
> a deliberate, recorded exception for that one build, made at the
> author's explicit direction for that specific manuscript — not a
> precedent a builder may apply on its own judgement just because it was
> used before. A future builder should run the full independent
> verification pass by default, and only skip it when the author gives
> this same explicit instruction again, for that specific tool, in that
> session — recording it in `content.js`'s header comment and in this
> file exactly as these entries do.

If the authors' own manuscript is itself the source for an algorithm and
is unpublished, cite it with `url: null` and note "in preparation" in
`text`/`kind` rather than inventing a fake link. Anything you cannot
independently verify gets flagged (`needsAuthor`-style) in the UI and in
`content.js` — it does not get a fabricated citation.

## Rendering / SVG edge routing (`app.js`)

`LAYOUT` (`{col, decision?, group?, row?}` per node) and `EDGES`
(`[fromId, toId, label?, variant?]`) drive the diagram. Pick the column
count and widths to match the algorithm's actual shape — two columns for
a genuine two-way fork, three equal columns for three parallel branches,
an asymmetric `1fr 1.6fr 1fr` only when the center lane carries a decision
and the side lanes are branch outcomes (this tool's own layout: a single
trunk of decisions down the centre column, Yes/No outcomes branching to
the left or right of the same row — see `aortic-dissection-protocol` for
the original version of this pattern).

If two nodes end up sharing a pixel column with a third node sandwiched
between them, an edge between the outer two can visually cross straight
through the middle box. Diagnose this by sampling points along each
rendered SVG path (`path.getPointAtLength()`) and checking for
bounding-rect overlap against every *other* node's live
`getBoundingClientRect()` — don't just eyeball a screenshot. Fix it with a
small per-edge detour table (`DETOUR`) that routes the path around the
obstacle's live bounding rect at draw time. This tool's own trunk needed
no `DETOUR` entries at all (every edge connects adjacent rows, nothing is
ever sandwiched) — don't add one speculatively. See the dedicated section
above for this tool's one genuinely new rendering feature, the backward
`"loop"` edge variant.

## QA — do this yourself, every time, before calling something done

The authors do not want a manual test checklist handed back to them to run
— do the strict checking yourself, and let them catch real-world edge
cases from actual field use afterward:

- Syntax-check JS with a parse-only check (e.g. `node --check app.js`) —
  not by executing it in a bare Node context, which throws on missing
  browser globals and looks like a syntax error but isn't.
- Validate data integrity mechanically: every `NODES[].id` has a matching
  `LAYOUT` entry, every `EDGES` endpoint resolves to a real node id, every
  `NODES[].refs` entry resolves to a real `REFERENCES[].id`, and there are
  no duplicate node ids — don't just eyeball the arrays.
- Serve the folder locally and drive it with an automated browser at both
  a desktop width (~1360px) and a mobile width (~412px).
- Run the geometric overlap check (above) at both viewports and confirm
  zero hits before calling the diagram done.
- Grep the content file before and after any edit to prove the authored
  `label`/`sub`/`dose` text is untouched — and specifically reconstruct
  `label + " " + sub` for every node and diff it against your own
  transcription of the source image, to catch a dropped semicolon, comma,
  or parenthesis that a careless split point can introduce.
- Click through a representative sample of nodes (including any node with
  zero references, and any node whose readout contains a glossary term)
  in the live rendered page and confirm zero console/page errors, the
  references list renders every entry, and a glossary term expands on
  click.
- Verify a git push actually landed by checking the remote directly
  (`git ls-remote`, `git ls-tree -r origin/main --name-only`) rather than
  trusting the push command's own output.

## Tone / working style

Explicit, direct instructions over general guidance; honest, critical
findings over reassurance. If something isn't actually working yet (a
page not deployed, a reference not verifiable), say so plainly rather than
assuming it's probably fine.
