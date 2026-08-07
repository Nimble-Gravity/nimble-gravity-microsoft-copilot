# M365 Copilot Advanced Workshop — Subject Brief (Brown & Brown Finance)

Read this before writing or revising lesson content. It captures who the program is for, the agreed
structure, and the researched facts the lessons are grounded in. Sources and date-sensitive caveats
are at the bottom. This brief replaces `cowork-context.md` (the prior Claude Cowork program).

> **Date-sensitive — researched 2026-07-31** against Microsoft Learn / Microsoft 365 blog and
> Brown & Brown primary sources (IR releases, SEC filings). Re-verify the flagged items in §6
> before each delivery — especially the 25-query agent cap, model names, and B&B quarterly figures
> (next earnings ~late Oct 2026).

## 1. Engagement & positioning

- **Client:** Brown & Brown, Inc. (NYSE: BRO) — **finance department**. Delivered by **Nimble Gravity**
  (site keeps NG branding; B&B appears as the client throughout the content).
- **Format:** **one 2-hour, in-person, fully hands-on workshop** covering all four modules
  (~25 min each). Every attendee has an **M365 Copilot license and a laptop** in the room.
  The microsite is the spine: pre-work before, projection + follow-along during, take-home depth after.
- **Subject:** advanced use of **Microsoft 365 Copilot** — Copilot in the M365 apps, Copilot Chat,
  and the out-of-the-box reasoning agents **Researcher** and **Analyst**.
- **Labs run on synthetic finance files** (built for this program, B&B-shaped but fake): P&L /
  budget-vs-actuals by profit center, commission statements, a mini acquisition data room, a
  fiduciary-cash rec. Never ask attendees to put real client or deal data into an exercise.
- **Tone:** practitioner-to-practitioner, not marketing. Use B&B's own language — **"teammates"**
  (never "employees"), decentralized profit centers, "The Power of WE". Frame AI as helping the
  finance org **absorb the Accession integration workload** — never as commentary on performance
  (organic growth has been soft two quarters; don't touch that nerve).

## 2. The 4-module curriculum (one 2-hour session)

| Module | Focus | Lessons |
|---|---|---|
| **1 · Foundations & Copilot Chat** | The Copilot surface map + prompting mastery | The Copilot Landscape · Prompt Like an Analyst · Grounded Chat Sprint (lab) |
| **2 · Copilot in the Apps** | Excel deep-dive + Outlook/Teams + Word/PowerPoint | Excel + Copilot · Outlook & Teams · Word & PowerPoint · The Close-Package Circuit (lab) |
| **3 · The Researcher Agent** | Deep research on work + web data | Meet Researcher · Briefing Researcher · Researcher for Finance · Researcher Mission (lab) |
| **4 · The Analyst Agent & Capstone** | Advanced data analysis + choosing the right tool | Meet Analyst · Analyst on Finance Data · Choosing the Right Copilot · Make It Stick · The Close Room (capstone) |

**In-room run of show (2:00):** Open (10) → M1 teach + Chat sprint (25, and attendees **kick off a
Researcher run here** so it's done by M3) → M2 Excel-led app circuit (25) → break (5) → M3 review
the Researcher results + briefing craft (25) → M4 Analyst hands-on + decision framework (22) →
debrief, take-home challenges, feedback (8). The gamified labs survive as **take-home / extension
challenges**: the escape room re-themed as a prompting-and-agents challenge, the control-room
simulation re-themed as **The Close Room** (a month-end close fire drill using Researcher + Analyst
that produces a close-package one-pager).

## 3. Researched facts — Microsoft 365 Copilot (verified 2026-07-31)

### The surface map
- **Microsoft 365 Copilot Chat** — free with M365 subscriptions: web-grounded chat, enterprise data
  protection, file upload, Pages, agents on pay-as-you-go. Since Dec 2025 it has inbox/calendar
  awareness. **Microsoft 365 Copilot** (paid add-on, ~$30/user/mo; Business SKU $21 ≤300 seats;
  new **E7 "Frontier Suite"** $99 bundles it) adds: work-grounded Chat (Graph), Copilot in
  Word/Excel/PowerPoint/Outlook/Teams, **Copilot Search**, **Researcher & Analyst**, scheduled
  prompts, memory, Notebooks. B&B finance attendees are licensed — teach the licensed surface.
- **Grounding is signals, not a toggle:** the current Copilot Chat design may not surface a simple
  Work/Web switch — teach it as controls: **Work IQ** (Microsoft Graph — mail, meetings, chats,
  files *you already have permission to see*, plus connectors), the prompt, files
  attached/referenced, the sources Copilot cites, and the agent selected. Web/public-source answers
  come from asking for them explicitly, not from a mode switch. Source inspection (checking
  citations before trusting the answer) is the habit that carries across every surface.
- **Model choice (2026):** GPT-5.5-class default; **Anthropic Claude Opus selectable for reasoning**
  (GA 2026-06-16). Note for a regulated audience: **Anthropic-provided models are currently excluded
  from the EU Data Boundary** — a sharp, quotable caveat.
- **Copilot Credits** ($0.01/credit) meter agent usage for unlicensed users and premium agentic
  services (Copilot Studio, Cowork); admins set budgets/alerts. **Copilot Cowork** (Microsoft's
  cloud agentic system, GA 2026-06-16) exists — name it only to situate it; out of scope.
- **Agentic apps milestone:** Copilot's agentic capabilities in Word/Excel/PowerPoint hit **GA
  2026-04-22** — Copilot takes multi-step native actions in documents, not just suggestions.

### Prompting (Microsoft's official framework — teach verbatim)
- **Four elements: Goal · Context · Expectations · Source** (support.microsoft.com "Get better
  results with Copilot prompting"). Plus: positive instructions ("do" not "don't"), one goal per
  prompt, iterate. Reference specific files, people, and meetings with "/" or attachments.
- **Scheduled prompts** — GA: any prompt on a schedule, up to **10 per user**, output lands in chat
  history; works in Copilot Chat, Teams, Outlook. (Recurring variance commentary, Monday close-status
  digests.)
- **Copilot Search** — GA, no extra cost: semantic search across Graph + 100+ connectors with
  Copilot Answers. **Copilot Memory** — GA rollout completed ~July 2026: personalizes from saved
  memories and chat history; manage on the Memory settings page.

### Copilot in the apps (advanced highlights)
- **Excel (the deep one for finance):** Copilot writes/runs **Python in the grid** (inside the edit
  workflow as of Apr–May 2026); **Plan with Copilot** outlines intended changes before executing;
  **Copilot attribution in Show Changes** = auditability of every cell Copilot touched (compliance
  demo point); Agent Mode with OpenAI/Anthropic model choice; **custom skills** — reusable finance
  workflows as markdown files in OneDrive invoked by @-mention, with Microsoft's own **finance
  skills library**: `@variance-analysis`, `@model-update`, `@comps-analysis`, `@deal-screening`,
  `@portfolio-monitoring`, `@catalyst-calendar` (GA ~July 2026); **financial data connectors**:
  FactSet, PitchBook, Morningstar, S&P Global, Daloopa, CB Insights. Anchor citation: Microsoft's
  "Copilot in Excel: Built for the era of Frontier Finance" (2026-06-25).
- **Word:** draft/rewrite grounded in referenced files; edits documents directly by default (2026);
  Writing Coaching in the context menu.
- **PowerPoint:** **Narrative Builder** (outline-first deck drafting); **admin-approved brand kits**
  (June 2026) so decks start on-brand; reference SharePoint/OneDrive sources.
- **Outlook:** summarize threads, draft with instructions, coaching; 2026 agentic experiences —
  inbox triage/prioritization, reschedule conflicts, agendas from chat, rewrite selected passage only.
- **Teams:** intelligent recap (notes, speaker attribution, action items); custom summaries +
  executive report format; **Facilitator agent** (GA Nov 2025) takes real-time notes with owners.
- **Copilot Pages** = persistent shareable canvases from chat outputs. **Copilot Notebooks** =
  grounded workspaces (answers only from the sources you add; audio overviews) — GA July 2026.

### Researcher (OOTB deep-research agent)
- Multi-step research producing a **structured, source-cited report**. GA 2025-06-02.
- **Reach:** web (Bing) + work data (files, mail, meetings, chats) + Graph connectors; user scopes
  the brief per run — name the work sources and/or web scope explicitly rather than relying on a
  mode toggle.
- **Model picker (2026):** **Critique** (default — GPT drafts, Claude second-pass), **Model Council**
  (parallel GPT + Claude + comparison), GPT only, Claude only. Claude modes need admin-enabled
  Anthropic models.
- **Behavior:** asks **clarifying questions** before running — engaging with that phase is the #1
  best practice. Runs: **<5 min simple, 10–45 min complex** → the in-room "kick it off early" beat.
- **Invocation:** Agents list in the M365 Copilot app, or `@Researcher` in Copilot Chat.
- **Limits (FAQ, updated 2026-03-26):** **25 combined Researcher+Analyst queries/user/month**
  (resets the 1st); can't process images in input docs; PPT/PDF export "coming"; not customizable
  via Copilot Studio; web-site allow/block is tenant-level only.
- **Researcher with Computer Use** (Frontier, ~Feb 2026): operates a secure temporary VM — browses,
  signs into gated sites with approval, runs code. Mention as horizon, not core.

### Analyst (OOTB data-analysis agent)
- Chain-of-thought data analysis that **runs Python with the code visible in real time**; built on
  OpenAI o3-mini at GA (model may have been upgraded since — flag, don't assert). GA 2025-06-02.
- **Inputs:** XLSX, CSV, and common data formats — **multiple files at once**, attached or from Graph.
- **vs Copilot in Excel:** Excel Copilot edits *one open workbook* natively (with change
  attribution); Analyst is a *chat-side agent* reasoning across multiple files, doing
  forecasting/statistics via Python, outputting analysis + visuals, not workbook edits.
- **Best practice:** name the metric, dimension, and time grain; supply clean tabular data; watch
  the live Python pane to verify method. Shares the 25-query pool with Researcher.

### Agent ecosystem (situate, one line each)
- **Agent Store** (in-app marketplace, admin-curated); **Copilot Studio** (low-code agent building,
  credit-billed); **Facilitator**, **Interpreter**, Planner/Channel agents, coach agents; role-based
  **Finance agent** — "Finance in Microsoft 365 Copilot", GA 2025-10-20: Excel-based
  **reconciliation** and **variance analysis** with AI summaries — worth a demo mention for this
  audience; **Agent 365** = org-wide agent registry (E7/Frontier); **Work IQ** = the work-context
  layer under it all.

### Governance facts to state in-room
- Prompts, responses, and Graph data are **not used to train** foundation models (incl. OpenAI and
  Anthropic as subprocessors). Copilot sees **only what the user already has permission to see**
  (Semantic Index honors identity; Purview sensitivity labels honored).
- Copilot interaction history is Purview **eDiscovery-searchable** — **but Researcher/Analyst
  session content is not e-discoverable by default** (admins see usage counts, not content). Big
  nuance for finance compliance; say it out loud.
- **Copilot Control System** = the admin framework (agent lifecycle, connector management, DLP for
  agents); jailbreak/XPIA classifiers built in.

## 4. Researched facts — Brown & Brown (verified 2026-07-31)

### Company snapshot
- **#5 largest insurance broker globally** (Business Insurance 2026, up two places post-Accession).
  HQ **Daytona Beach, FL**; founded 1939; **~22,900 teammates** (Dec 2025). CEO **J. Powell Brown**;
  CFO **R. Andrew (Andy) Watts**; Chairman J. Hyatt Brown. S&P 500; **Dividend Aristocrat**
  (25+ years of increases). Culture marks: **"teammates"**, "A Forever Company", "The Power of WE",
  "Culture of Caring", Brown & Brown University. (Checkerboard-logo lore is unverified — don't use.)
- **FY2025 revenue $5.9B** (+22.8%); Q2 2026 ~$1.7B (+30.4% total, organic −0.7% / +0.7% with
  contingents). Market cap ~$20–25B during 2026 (quote a range).

### How the money is earned (four streams — teach these; they drive the use cases)
1. **Base commissions** (% of premium placed), 2. **Fees**, 3. **Supplemental commissions** (set
  rate on volume, known in advance), 4. **Profit-sharing contingent commissions** — contingent
  primarily on carrier *underwriting results*; estimate-driven; FY2025 **$255M**, Q1 2026 $97M
  (2× prior year) — big enough that B&B now headlines **"Organic Revenue with Contingents"**.
  Plus **investment income on fiduciary cash** (the float): $139M FY2025.

### Structure & metrics the finance org lives in
- **Two segments effective Q3 2025** (3→2 realignment alongside Accession): **Retail** (~59% of
  FY2025 C&F) and **Specialty Distribution** (programs + wholesale, ~41%). Prior periods recast.
- **Organic Revenue** = core C&F excluding first-12-months acquisition revenue, divestitures, FX —
  the headline metric, with hand-built exclusion schedules each quarter.
- **EBITDAC — Adjusted** = income before Interest, Taxes, Depreciation, Amortization, and the
  **Change in acquisition earn-out payables**, adjusted for one-timers. FY2025 margin **35.9%**;
  Q2 2026 35.7% (−100 bps, integration costs).
- **Decentralized operating model** (since 1980): hundreds of local profit centers with local P&L
  ownership → consolidation, allocations, and budget-vs-actuals commentary at profit-center grain.
- **Fiduciary cash**: $2.387B held in trust against $3.961B fiduciary liabilities (Mar 2026) —
  daily reconciliation and segregation is core controllership work.

### The M&A engine (why finance is busy)
- Serial acquirer: **43 deals closed in 2025** (~$1.8B annualized revenue added).
- **Accession Risk Management Group** — largest deal in company history: **$9.825B**, closed
  **2025-08-01**; brought **Risk Strategies** + **One80 Intermediaries** (~$1.7B revenue, ~5,500
  teammates). Financed by a $4.0B equity follow-on + ~$4.2B senior notes → total debt $7.8B,
  goodwill $15.1B, ~$99M/quarter interest. Integration is the story analysts watch.
- Finance impact per deal: purchase accounting (Level-3 earn-out fair values, remeasured through
  the P&L quarterly — $353M capped + uncapped earn-outs outstanding Sep 2025), acquired-agency GL
  onboarding into consolidation, organic-revenue baseline recasting, integration-cost isolation
  (~$26M/quarter scale).
- B&B's Q2 2026 call referenced partnerships with McKinsey, Accenture, **and Anthropic** — verify
  wording before quoting, but it makes the AI-enablement conversation timely.

### The 15 grounded finance use cases (seed lessons and labs from these)
1. Monthly close **variance narratives** across decentralized profit centers
2. **Contingent commission** estimation & tracking (drives "with Contingents" headline)
3. **Earn-out liability** tracking — quarterly Level-3 remeasurement memos
4. **Acquisition data-room review** — summarize target financials, commission schedules, carrier contracts
5. **Purchase-accounting support** — opening balance sheet, intangible/goodwill schedules
6. **Acquired-agency GL integration** — chart-of-accounts mapping, policy-difference flags
7. **Fiduciary cash reconciliation** — exception summaries on premium-trust recs
8. **Organic-revenue calc documentation** — acquisition/FX exclusion schedules
9. **10-Q/10-K drafting support** — MD&A first drafts, segment tie-outs
10. **Board/investor deck prep** — EBITDAC bridges, organic walks, synergy tracking
11. **Budget vs actuals by profit center** — commentary packs at scale
12. **Cash-flow & interest forecasting** — $7.8B debt service + dividend planning
13. **Expense & synergy analysis** — isolating integration costs, margin recovery
14. **Audit PBC prep** — support schedules for judgment areas (earn-outs, contingents, fiduciary)
15. **Investment-income (float) analysis** — rate sensitivity on fiduciary cash

**Tool mapping intuition:** rows 1, 11, 13 → Analyst + Excel Copilot; 2, 3, 5, 12, 15 → Analyst;
4, 6, 9, 10 → Researcher + Word/PowerPoint Copilot; 7, 14 → Excel Copilot + Finance agent
reconciliation; 8 → Excel Copilot; recurring digests → scheduled prompts.

## 5. Authoring notes
- Lessons in `pages/training/` as `NN-slug.html`; the last lesson of each module is the lab/capstone.
- Use the shared card classes so slides auto-generate — see DESIGN-SYSTEM.md "How slides are generated".
- Every lab = a real, hands-on run producing a deliverable, on the **synthetic B&B-shaped datasets**
  in `assets/` — never real client/deal data. Give each lab a licensed path; exercises assume the
  full M365 Copilot license (confirmed: all attendees licensed).
- Timing discipline: each module's in-room block is ~25 min. Depth lives on the lesson pages
  (pre-read / take-home); the in-room beats are on the hub agendas and the facilitator guide.
- `SCAFFOLD` / `TODO` markers flag where NG IP or B&B-tenant-specifics drop in (e.g., whether
  Anthropic models / Frontier features are enabled in B&B's tenant — confirm with IT before delivery).
- Re-verify date-sensitive facts (§6) before each delivery; mark provisional items as such.

## 6. Sources & re-verify list
**Microsoft (first-party):**
- Prompting: support.microsoft.com "Get better results with Copilot prompting" (Goal/Context/Expectations/Source)
- Researcher: learn.microsoft.com/microsoft-365/copilot/researcher-agent · faq-researcher (25-query cap, updated 2026-03-26) · model-choice support article
- Analyst: techcommunity "Analyst agent in Microsoft 365 Copilot" · support "Get started with Analyst"
- Excel finance: microsoft.com/microsoft-365/blog "Copilot in Excel: Built for the era of Frontier Finance" (2026-06-25)
- Agentic apps GA: blog 2026-04-22 · Ignite 2025 blog (2025-11-18) · June 2026 What's New (techcommunity)
- Privacy/governance: learn.microsoft.com/microsoft-365/copilot/microsoft-365-copilot-privacy (updated 2026-07-09) · copilot-control-system docs · pay-as-you-go/overview (Copilot Credits)
- Scenario library: adoption.microsoft.com/copilot-scenario-library/finance · Finance agent GA post (2025-10-20)

**Brown & Brown (primary):**
- investor.bbrown.com — Q4 2025, Q1 2026, Q2 2026 (2026-07-27) releases; FY2025 10-K (SEC EDGAR, bro-20251231); Q1/Q3 10-Qs
- Accession deal: B&B IR announcement (2025-06-10) · Business Insurance / Insurance Journal coverage
- Ranking: Business Insurance "Top insurance brokers, No. 5" (2026) · us.bbrown.com/about

**Re-verify before each delivery:** 25-query Researcher/Analyst cap · exact model names in pickers
(GPT-5.5 / Claude Opus 4.7 claims are secondary-sourced) · Analyst's underlying model · Excel custom
skills GA status · current Copilot list prices post-2026-07-01 · Researcher PPT/PDF export ·
B&B latest quarter figures · the B&B–Anthropic partnership wording · what's enabled in B&B's tenant
(Anthropic models, Frontier, Finance agent, scheduled prompts).
