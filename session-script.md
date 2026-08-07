# Session Script — M365 Copilot Advanced Workshop (Brown & Brown Finance)

**One 2-hour in-person session · four modules · fully hands-on.**
Facts verified 2026-07-31 (see `copilot-context.md` §6 re-verify list before delivery).
Legend: **[SAY]** talk track · **[DO]** facilitator action · **[THEY]** attendee action · **[NOTE]** timing/recovery.

Companion pages: the four module hubs carry the same agenda blocks; demo prompts with copy
buttons live in `pages/workshops/facilitator-guide.html`; game answer keys live in
`escape-room/README.md` and `control-room/README.md`.

---

## 0:00–0:10 · Open

- **[DO]** Project the site home page. Attendees: laptops open, signed in to the Microsoft 365 Copilot app.
- **[SAY]** "Everyone in this room already has Copilot. Today isn't an intro — it's the advanced session:
  by 10:00 you'll have run grounded prompts on finance data, put Copilot to work inside Excel and Word,
  commissioned a research agent on a deal file, and audited a Python analysis line by line. Everything we
  touch today is synthetic data shaped like ours — nothing real goes into a prompt."
- **[SAY]** The arc, one breath each: Module 1 Chat mastery → Module 2 the apps → Module 3 Researcher →
  Module 4 Analyst and the capstone. "One thing to know now: at 0:25 you'll each start a research run
  that takes half an hour. We start it early on purpose — that habit is half of what 'advanced' means."
- **[THEY]** Maturity poll on the Before-We-Start page (`pages/training/index.html#maturity`).
- **[DO]** Access check by show of hands: Work IQ available (if shown)? Agents list shows Researcher + Analyst?
  Anyone missing either pairs with a neighbor — log names for IT, don't debug live.

## 0:10–0:35 · Module 1 — Foundations & Copilot Chat

- **[DO]** 0:10 Start the Module 1 deck (`pages/training/module-1-slides.html`).
- **[SAY]** 0:10–0:18 The landscape (Lesson 1 beats): three surfaces; grounding as signals, not a
  toggle; the three data rules.
  **[DO]** THE demo: same question ("what drove our June variances?") asked with no source named →
  generic, ungrounded essay; then asked again with Work IQ on and `/profit-center-pnl.csv` named
  explicitly → real answer, citation visible. Open the citation and show the class — "before we
  read the answer, where did it come from?" — that's the habit, not the toggle.
  **[SAY]** the data rules, verbatim beats: "It sees only what you already have permission to see.
  It doesn't train on our data. And one nuance for a finance team: agent sessions aren't e-discoverable
  by default — so important agent outputs get saved into files that are governed."
- **[SAY]** 0:18–0:25 Prompt like an analyst (Lesson 2): Goal · Context · Expectations · Source.
  Walk the before/after on the close-commentary ask. One goal per prompt; say do, not don't;
  scheduled prompts in sixty seconds (up to 10 — Monday digest, close-week status).
- **[THEY]** 0:25–0:35 **Chat Sprint lab** (Lesson 3): three grounded prompts (find → explain → draft)
  on `profit-center-pnl.csv`.
- **[DO]** 0:30 sharp — freeze the room for two minutes: everyone opens **Agents → Researcher**, pastes
  the Project Lighthouse mission brief (copy button on the lab page), answers the clarifying questions
  ("work files and web · US market · finance audience"), and leaves it running.
  **[NOTE]** Protect this beat at all costs; it feeds Module 3. Common blockers: Work IQ left off;
  OneDrive not indexed → attach the CSV directly.

## 0:35–1:00 · Module 2 — Copilot in the Apps

- **[DO]** 0:35 Module 2 deck. Everyone opens `profit-center-pnl.csv` in desktop Excel (pre-work).
- **[DO]** 0:37 Excel demo (prompt in facilitator guide): variance table + 4-of-6-months flag + chart.
  Narrate three things: the **plan** before it acts, the **Python** it invokes, and **Show Changes**
  after — "every cell it touched, attributed."
  **[NOTE]** Planted finding: **PC-402 Manhattan Retail, compensation ~9% over every month (~$651k H1).**
- **[SAY]** 0:43 Finance skills library (`@variance-analysis`, `@deal-screening`…) and data connectors —
  "reusable prompts as files; ask us about wiring these into the close." <!-- SCAFFOLD: confirm tenant -->
- **[SAY]** 0:47–0:53 Quick hits, 90 seconds each from the deck: Outlook triage + rewrite-selection;
  Teams intelligent recap + Facilitator agent; Word grounded drafting; PowerPoint Narrative Builder
  + brand kits; Pages/Notebooks as the close binder.
- **[THEY]** 0:53–1:00 **Close-Package circuit** (Lesson 7): Excel variance table → Word commentary
  paragraph (prompts on the lab page). Stretch: one-slide Narrative Builder summary.
- **[SAY]** 0:59 "Take-home #1: the **Variance Vault** — four findings are buried in this data; the
  vault opens when you dig them out with Copilot. Links on Lesson 7."

## 1:00–1:05 · Break

- **[NOTE]** Researcher runs keep cooking. Check your spare run is ready to project.

## 1:05–1:30 · Module 3 — The Researcher Agent

- **[THEY]** 1:05–1:15 **Reports come home** (Lesson 11): open your run. Review pass: are the four
  questions answered? Spot-check three citations. Separate work-sourced from web-sourced claims.
  **[NOTE]** Expect a spread — done / mid-flight / failed. Say why that's the lesson (10–45 min runs →
  commission early). Pair unfinished with finished; project the spare if needed.
  **[NOTE]** A good Lighthouse report flags: contingent-dependence (15.5% of revenue), Gulfstream
  concentration (38% of core commissions), the uncapped earn-out. A miss = your follow-up-question demo.
- **[SAY]** 1:15–1:23 Briefing craft (Lesson 9), taught off the room's own runs: brief like a memo to a
  sharp new hire — objective, scope, sources, deliverable spec, audience. The clarifying phase is where
  quality is won. Budget: 25 Researcher+Analyst queries a month — missions, not curiosities.
- **[THEY]** 1:23–1:30 Researcher on the finance desk (Lesson 10): each table names one real mission
  they'll commission this month, and one thing they would NOT send to Researcher.
  **[NOTE]** Running hot? Cut this discussion, never the review pass.

## 1:30–1:52 · Module 4 — Analyst & The Close Room

- **[DO]** 1:30 Analyst demo (prompt in facilitator guide): attach `carrier-commission-statements.csv`,
  ask for loss-ratio-vs-threshold analysis. **Read the Python pane out loud** — that's the signature.
  **[NOTE]** Planted finding: **Gulfstream ends June at 0.83 vs a 0.60 threshold — accrual at risk;
  Old Colony (0.45) is the healthy contrast.**
- **[THEY]** 1:34–1:42 Everyone reproduces the run, then one variation each (Lesson 13 patterns:
  comp-variance trend, or the H2 segment forecast). Verify pass: does the code filter and sum what
  you meant?
- **[SAY]** 1:42–1:48 Choosing your Copilot (Lesson 14), rapid-fire call-outs: quick fact → Chat ·
  open-workbook edit → Excel Copilot · cited multi-source research → Researcher · multi-file
  statistics → Analyst. Governance overlay: shared query pool; save agent outputs to governed files.
- **[SAY]** 1:48–1:52 **The Close Room** briefing (Lesson 16): close night, four stations — Variance
  Triage, Contingents Desk, Trust Rec, Deal Desk — each signs off with a code the data yields. Teams
  of 3–4, deadline end of week, leaderboard on the admin console.

## 1:52–2:00 · Debrief & close

- **[SAY]** "Three things before you stand up. One: the four knowledge checks — end of each lab lesson,
  pass all four, certificate on My Progress. Two: the take-homes — Variance Vault, Close Room, and the
  one-week practice plan on Make It Stick; your manager will ask about them, we briefed them. Three:
  the two-minute feedback, right now, while it's fresh."
- **[THEY]** Feedback form (`pages/workshops/feedback.html`).
- **[SAY]** Close: "Copilot drafts. You verify, you sign, you own it. That was true four times today —
  it'll be true every day after."

---

## Facilitator prep appendix

- **Day before:** tenant verification (Agents enabled, scheduled prompts, Excel Python, model pickers)
  — record findings in the facilitator guide SCAFFOLD comment; commission the spare Lighthouse run;
  test both games locally; print cheat sheets.
- **Ground truths in the synthetic data** (full derivations in the game READMEs):
  PC-103 Tampa Bay March contingent windfall $336k vs $94.5k budget · PC-402 Manhattan comp +9%/month ·
  PC-501 Coastal Programs core commissions −5/−9/−13% Apr–Jun · PC-204 Denver May occupancy exactly
  $180k over · Harborlight (acquired Mar) integration-cost overruns · investment income ~+12% everywhere ·
  Gulfstream LR 0.48→0.83 vs 0.60 threshold · trust rec: 6 exceptions (3 unremitted, 1 duplicate wire,
  1 unidentified Tallgrass receipt, 1 stale Driftwood item) · Lighthouse: contingents 15.5% of revenue,
  Gulfstream 38% of core commissions, uncapped earn-out at 6.0×.
