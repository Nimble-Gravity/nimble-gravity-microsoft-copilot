# The Variance Vault — Virtual Escape Room (Module 2 Challenge)

A web-based escape room that gates the Module 2 take-home challenge for the
M365 Copilot Advanced Workshop (Brown & Brown finance). Teams dig four planted
findings out of the synthetic June finance data using Copilot — Chat, Excel, or
the Analyst agent; each finding, formatted per the briefing's rules, is the
unlock code for the next room. Four rooms, one 40-minute timer, a live
leaderboard, and a facilitator view.

No build step, no framework: vanilla ES modules + Three.js from a CDN.

## Quick start

Serve the folder from any static server (ES modules and `fetch` don't work
over `file://`, and code hashing needs `https://` or `localhost`):

```bash
# from the repo root (this repo's dev server, with live reload)
./serve
# game:        http://localhost:8000/escape-room/
# facilitator: http://localhost:8000/escape-room/admin.html
```

or standalone: `cd escape-room && python3 -m http.server 8000`.

## Project structure

```
index.html            game shell (static skeleton — all content injected from config)
admin.html            facilitator view
config/
  rooms.source.json   EDIT THIS — room content incl. plaintext codes (answers!)
  rooms.json          generated, deployed — hashes only, never edit by hand
  app-config.js       per-deployment settings: backend, admin key
css/game.css          war-room theme for the game
css/admin.css         facilitator table theme
js/
  main.js             boot, game flow, persistence wiring, heartbeat
  state.js            localStorage-backed game state (survives refresh)
  rooms.js            fetches + validates rooms.json
  crypto.js           input normalization + SHA-256
  timer.js            countdown display (wall-clock based)
  ui.js               all DOM rendering for the game page
  leaderboard.js      backend adapters: Supabase (shared) / localStorage (fallback)
  admin.js            facilitator view logic
  scene/              Three.js vault: textures.js (procedural), scene.js (geometry+loop)
lab-files/            variance-vault-briefing.md — the player briefing handout
tools/generate-hashes.mjs   turns rooms.source.json into rooms.json
```

## The four rooms — answer key (facilitators only)

All codes are **derived from `../assets/lab-data/profit-center-pnl.csv`** (the
seeded synthetic dataset). If that file is regenerated or edited, re-derive
every code below before a session, then re-run the hash generator.

| # | Room | Code | Derivation |
|---|---|---|---|
| 1 | The Windfall | `336` | PC-103 "Tampa Bay Retail", March 2026 contingent commissions: actual $336,000 vs $94,500 budget. Code = actual in $ thousands. |
| 2 | The Lease | `180` | PC-204 "Denver Retail", May 2026 occupancy: actual $234,000 vs $54,000 budget = exactly $180,000 over. Code = the overage in $ thousands. |
| 3 | The Overrun | `PC-402` | PC-402 "Manhattan Retail" compensation runs ~9% over budget in **every** month Jan–Jun (~$651k over for H1). Code = the profit-center id. |
| 4 | The Slide | `11UNDER` | Exactly 11 profit centers have June actual core commissions below June budget, counting **only rows where a June budget exists** (the mid-period acquisition has no budget and is excluded). Code = count + `UNDER`. |

Codes are case- and whitespace-insensitive (normalized to `UPPERCASE`,
whitespace stripped) on both sides of the comparison — hyphens are preserved,
so `pc-402` works but `PC402` does not.

## How rooms work / adding or editing rooms

All room content lives in `config/rooms.source.json`. Each room:

```jsonc
{
  "id": "room-1",                 // stable id
  "title": "The Windfall",
  "narrative": "2–3 sentence scenario",
  "labSteps": ["step 1", "step 2"],   // numbered, collapsible in the UI
  "codePlaintext": "336",             // the answer — stripped at generate time
  "codeHash": "GENERATE_WITH_SCRIPT", // filled in by the tool
  "hints": ["free hint", "penalty hint"],  // max 2; #2 costs hintPenaltySeconds
  "skillsTaught": ["shown on the escape recap"]
}
```

Top-level: `workshopTitle`, `scenario` (start screen), `timeLimitMinutes`,
`hintPenaltySeconds`. Rooms are linear in array order; 3–6 rooms render fine
in the 3D corridor. Then regenerate:

```bash
node tools/generate-hashes.mjs        # rooms.source.json -> rooms.json
```

**Never put the code's literal text in a hint or lab step** — `rooms.json` is
fetched by the browser, so players can read it in devtools. The generator
warns loudly if a hint/step contains the code. Hints should point at *where*
the answer is, not *what* it is.

### Generating a hash for a single code

```bash
node tools/generate-hashes.mjs --code "PC-402"
```

## Security model (know the tradeoff)

- Codes ship only as SHA-256 hashes; input is hashed client-side and compared.
  Nothing in view-source reveals a code. Determined players could brute-force
  short codes offline — fine for a workshop, don't reuse for anything real.
- `config/rooms.source.json` **contains all the answers.** If this repo is
  public (or the folder is deployed as-is to public Pages), that file is
  fetchable at a guessable URL. For public deployments, move it out of the
  web root / gitignore it and keep it in the facilitator's drive.
- `adminKey` on admin.html is a deterrent (URL param check), not auth. There
  is deliberately no login system.

## State, refresh, and skip-ahead

- Game state persists to `localStorage` on every mutation. Refreshing
  mid-game restores the current room, unlocked doors, hints, attempts, and the
  timer (elapsed time is derived from the wall-clock start timestamp, so the
  clock keeps running through a refresh — no pausing by closing the tab).
- Progress is only readable from validated stored state; there are no
  per-room URLs and any `?room=` query param is ignored, so skipping ahead
  via URL does nothing.
- "Reset & run again" on the escape screen clears state for a fresh run.

## Leaderboard backend (Supabase) — optional but recommended

Without a backend the game still works: codes validate client-side, but the
leaderboard is **final-submission only and per-device**, and the facilitator
view only sees teams that played in the same browser. The UI states this.

With Supabase (free tier) you get a live shared leaderboard, a cross-device
facilitator view, and remote team reset. Chosen over Firebase because it needs
no SDK — plain REST `fetch` keeps the app dependency-free.

1. Create a project at supabase.com, then run in the SQL editor
   (the table name is historical — it is wired into `js/leaderboard.js`, so
   keep it as-is):

```sql
create table if not exists public.skill_vault_teams (
  id uuid primary key,
  team_name text not null,
  current_room int not null default 0,
  escaped boolean not null default false,
  attempts int not null default 0,
  hints_used jsonb not null default '[]',
  penalty_seconds int not null default 0,
  started_at timestamptz,
  finished_at timestamptz,
  total_seconds int,
  reset_requested boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.skill_vault_teams enable row level security;

-- Workshop-grade policy: the publishable anon key may read/write this table.
-- Use a dedicated Supabase project for the event; wipe the table after.
create policy "workshop anon access" on public.skill_vault_teams
  for all to anon using (true) with check (true);
```

2. In `config/app-config.js`, set `supabaseUrl` and `supabaseAnonKey`
   (Project Settings → API → Project URL / anon public key).

Between cohorts, clear the board: `delete from skill_vault_teams;`

## Facilitator view (`admin.html`)

- Shows every team: current room, live elapsed time (penalties included),
  hints used, attempts, and "last seen" (clients heartbeat every 25 s).
- **Reset** flags the team's row; the team's browser polls the flag every
  10 s, wipes its local state, and reloads to the start screen.
- **Remove** deletes the row from the board.
- Optionally set `adminKey` in `app-config.js`, then open
  `admin.html?key=<yourkey>`.
- In local (no-backend) mode the view only sees this browser's teams — the
  badge at the top tells you which mode you're in.

## Deploying to GitHub Pages

This folder is static — it deploys with the rest of this repo (already wired
via `.github/workflows/deploy.yml`); the game lands at
`https://<user>.github.io/<repo>/escape-room/`.

Standalone repo instead: push the `escape-room/` contents to a repo, then
Settings → Pages → deploy from branch. All asset paths are relative, so it
works at any subpath. Remember the note above about `rooms.source.json` on
public repos.

## Facilitation setup checklist

1. Confirm the codes in `config/rooms.source.json` still match the data in
   `../assets/lab-data/` (see the answer key above); run
   `node tools/generate-hashes.mjs`.
2. Distribute `lab-files/variance-vault-briefing.md` plus the two datasets it
   names (`profit-center-pnl.csv`, `carrier-commission-statements.csv` from
   `../assets/lab-data/`) via your usual channel — attendees copy them into
   their own OneDrive so Copilot can reach them. All data is synthetic; no
   real Brown & Brown clients, carriers, or figures.
3. Configure (or skip) Supabase in `config/app-config.js`; set `adminKey`.
4. Deploy; open `admin.html` on the facilitator machine; teams open the root
   URL, enter a team name, and the clock starts.
