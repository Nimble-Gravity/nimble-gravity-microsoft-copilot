# The Close Room — Module 4 capstone

A browser-based month-end close simulation for the M365 Copilot Advanced Workshop
(Brown & Brown finance). Teams run a close-night fire drill against a 40-minute clock: a
variance triage, the contingents desk, a fiduciary trust reconciliation, and a deal-desk
diligence read. Each station's answer — dug out of the synthetic finance data with the
right Copilot surface — is the sign-off code that clears the next station.

Four stations, one master status board, a leaderboard, and a facilitator view.
Vanilla ES modules + Three.js from a CDN, no build step.

## The premise

It's close night, mid-integration. The flux review has an open item in Specialty
Distribution, a carrier's loss ratio is threatening the contingent accrual, the June
trust rec doesn't tie, and corp dev needs two answers on Project Lighthouse before the
partner call. The floor opens with **four open exceptions** on the board. Teams work
them down to zero using Copilot Chat, Copilot in Excel, the Analyst agent, and
Researcher-style briefing — verifying like reviewers before every sign-off.

The 3D scene is an operations floor: four review consoles facing a master status board
that counts open exceptions. A station's monitors read `NO SIGNAL` and its desk rail
glows amber while its exception is open; on sign-off the beacon above it dissolves, the
feeds come online, the rail turns teal, and the board decrements. Clear all four and the
floor stands down from alert.

## Quick start

```bash
# from the repo root (this repo's dev server, with live reload)
./serve
# game:        http://localhost:8000/control-room/
# facilitator: http://localhost:8000/control-room/admin.html
```

or standalone: `cd control-room && python3 -m http.server 8000`.

ES modules and `fetch` don't work over `file://`, and code hashing needs `https://` or `localhost`.

## ⚠️ Two deployment notes

1. **Storage keys are namespaced.** This app shares an origin with the Module 2 lab
   (the Variance Vault), so it uses `controlRoom.state.v1`, `controlRoom.teams.v1`, and
   `controlRoom.resetFlags.v1` (`js/state.js`, `js/leaderboard.js`), and its own
   `CONTROL_ROOM_CONFIG` global. (The key names are historical — they are wired into the
   JS and must not change.) **Never point both apps at the same keys** — a Variance
   Vault run in progress would bleed into this one.
2. **Running local-only this cohort.** `supabaseUrl` / `supabaseAnonKey` are deliberately blank in
   `config/app-config.js`. Codes still validate and the game is fully playable, but the leaderboard is
   final-submission-only and per-device, and `admin.html` sees only teams that played in the same
   browser. The UI states this. To switch on a shared board, see *Leaderboard backend* below.

## The four stations — answer key (facilitators only)

| # | Station | Discipline | Files | Code |
|---|---|---|---|---|
| 1 | Variance Triage | Trend analysis with Analyst / Excel Copilot | `profit-center-pnl.csv` | `PC-501` |
| 2 | Contingents Desk | Threshold analysis, corroboration | `carrier-commission-statements.csv` | `GULFSTREAM` |
| 3 | Trust Rec | Two-file reconciliation on a rubric | `premium-trust-ledger.csv` + `trust-bank-statement.csv` + `close-room-rubric.md` | `6TALLGRASS` |
| 4 | Deal Desk | Data-room extraction, term-sheet review | `../assets/lab-data/data-room/` | `38UNCAPPED` |

### How each code is derived (re-derive if the data changes)

Every code comes from the seeded synthetic data in `../assets/lab-data/`. **If those
CSVs or data-room files are regenerated or edited, re-derive the codes below before a
session**, update `config/rooms.source.json`, and re-run the hash generator.

- **Station 1 — `PC-501`:** in `profit-center-pnl.csv`, PC-501 "Coastal Programs"
  (Specialty Distribution) is the only profit center whose core-commission variance to
  budget deteriorates every month April→June: −5% (Apr) → −9% (May) → −13% (Jun).
- **Station 2 — `GULFSTREAM`:** in `carrier-commission-statements.csv`, "Gulfstream
  Property & Cas." is the only carrier whose YTD loss ratio ends June above its
  contingent threshold (0.48 → 0.83 vs 0.60), and its June contingent accrual is $0.
  (Contrast book: Old Colony Specialty at 0.45.) Code = first word of the name.
- **Station 3 — `6TALLGRASS`:** per `lab-files/close-room-rubric.md`, the June trust rec
  yields 3 premiums collected but never remitted (POL-2026-1009/1010/1011) + 1 duplicate
  wire (Sable River Re, POL-2026-1003, "(DUP)" in the bank description) + 1 unidentified
  receipt ("ACH IN TALLGRASS ENERGY NO POLICY REF", $46,750) + 1 stale May item in the
  ledger only (Driftwood Marina, POL-2026-0871) = **6 exceptions**; unidentified payer =
  **TALLGRASS**. Each row counts once.
- **Station 4 — `38UNCAPPED`:** `data-room/carrier-contract-summary.md` states the top
  carrier (Gulfstream) at **38%** of the target's core commissions;
  `data-room/earnout-term-sheet.md`'s structural flaw is that the earn-out (including
  contingents) is **UNCAPPED**.

The player-facing handouts are `lab-files/close-room-briefing.md` (scenario, downloads,
surfaces, code formats) and `lab-files/close-room-rubric.md` (the Trust Rec exception
definition + verification standards; it contains no codes). Everything is **synthetic**
— no real Brown & Brown data.

## Editing stations

Station content lives in `config/rooms.source.json`. (The config key is `rooms[]` — the engine's
generic term for a stage; the UI presents each one as a station.) Edit it, then regenerate:

```bash
node tools/generate-hashes.mjs                     # rooms.source.json -> rooms.json
node tools/generate-hashes.mjs --code "PC-501"     # hash a single code
```

Each station's `title` also becomes its on-screen console nameplate, so keep titles short — anything
past ~22 characters is truncated on the 3D sign.

Codes are case- and whitespace-insensitive (normalized to `UPPERCASE`, whitespace stripped) on both
sides of the comparison. Hyphens survive normalization, so `pc-501` works but `PC501` does not.

**Never put a code's literal text in a hint or lab step** — `rooms.json` is fetched by the browser, so
players can read it in devtools. The generator warns loudly if a hint/step contains its code. Hints
should point at *where* the answer is, not *what* it is.

## Security model (know the tradeoff)

- Codes ship only as SHA-256 hashes; input is hashed client-side and compared. Nothing in view-source
  reveals a code. Short codes could be brute-forced offline — fine for a workshop, not for anything real.
- **`config/rooms.source.json` contains all the answers, and it is served as a static file.** On a
  public deployment it is fetchable at a guessable URL. For public Pages deployments, move it out of
  the web root (or gitignore it) and keep it in the facilitator's drive. The generated `rooms.json` is
  the only file the game needs at runtime.
- `adminKey` on `admin.html` is a URL-param deterrent, not auth. There is deliberately no login.

## State, refresh, and skip-ahead

Game state persists to `localStorage` on every mutation, so a refresh restores the current station,
cleared stations, hints, attempts, and the timer (elapsed time derives from the wall-clock start, so
the clock keeps running through a refresh). There are no per-station URLs and `?room=` is ignored, so
skipping ahead via URL does nothing. "Reset & run again" clears state for a fresh run.

Without WebGL the 3D floor is skipped and the side panel carries the whole game — the lab is fully
playable on locked-down laptops and remote desktops.

## Leaderboard backend (optional)

To turn on a live shared board and a cross-device facilitator view, create a Supabase project and run:

```sql
create table if not exists public.control_room_teams (
  id uuid primary key,
  team_name text not null,
  current_room int not null default 0,
  cleared boolean not null default false,
  attempts int not null default 0,
  hints_used jsonb not null default '[]',
  penalty_seconds int not null default 0,
  started_at timestamptz,
  finished_at timestamptz,
  total_seconds int,
  reset_requested boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.control_room_teams enable row level security;

-- Workshop-grade policy: the publishable anon key may read/write this table.
-- Use a dedicated Supabase project for the event; wipe the table after.
create policy "workshop anon access" on public.control_room_teams
  for all to anon using (true) with check (true);
```

Then set `supabaseUrl` and `supabaseAnonKey` in `config/app-config.js`. The table name (historical,
wired into `js/leaderboard.js`) is distinct from the Module 2 lab's, so the two boards stay separate.

Between cohorts: `delete from control_room_teams;`

## Facilitator view (`admin.html`)

Shows every team's current station, live elapsed time (penalties included), hints used, attempts, and
last seen (clients heartbeat every 25 s). **Reset** flags a team's row; their browser polls every 10 s,
wipes local state, and reloads. **Remove** deletes the row. In local-only mode the view sees only this
browser's teams — the badge at the top tells you which mode you're in.

## Facilitation checklist

1. Confirm the four codes still match the data in `../assets/lab-data/` (see the answer key above);
   if anything changed, update `config/rooms.source.json` and run `node tools/generate-hashes.mjs`.
2. Distribute `lab-files/close-room-briefing.md`, `lab-files/close-room-rubric.md`, the four CSVs,
   and the `data-room/` folder before the session — attendees copy them into their own OneDrive.
3. Confirm local-only vs Supabase in `config/app-config.js`; set `adminKey` if you want one.
4. Open `admin.html` on the facilitator machine; teams open the root URL and enter a team name to start.
5. Keep this README's answer key open but not screen-shared.
