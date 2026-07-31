# The Close Room — Team Briefing

**Module 4 capstone simulation · M365 Copilot Advanced Workshop · 40 minutes**

## The situation

It's close night, mid-integration. Four stations stand between the finance team and
sign-off:

1. **Variance Triage** — the flux review's open item in Specialty Distribution
2. **Contingents Desk** — a carrier loss ratio threatening the contingent accrual
3. **Trust Rec** — the June fiduciary-cash reconciliation that doesn't tie
4. **Deal Desk** — two diligence answers on Project Lighthouse before the partner call

Each station names its files and recommends a Copilot surface. Work the data, verify
like a reviewer, and sign off with the code the data yields. The clock runs 40 minutes;
the second hint at any station costs a 2-minute penalty.

## Team setup

Play as a team on one machine driving the Close Room, with teammates working the data
in parallel on their own laptops. Enter a team name to start the clock. Split the
stations if you like — they unlock in order, so keep the driver on the current one.

## Get the data — six downloads

From the workshop lab-data folder (`../assets/lab-data/` on the microsite, or wherever
your facilitator shared them):

- `profit-center-pnl.csv` — Station 1
- `carrier-commission-statements.csv` — Station 2
- `premium-trust-ledger.csv` — Station 3
- `trust-bank-statement.csv` — Station 3
- the **`data-room/` folder** (Project Lighthouse: target overview, 3-year financials,
  carrier contract summary, earn-out term sheet) — Station 4

Plus, from this app's `lab-files/`: **`close-room-rubric.md`** — the Trust Rec exception
definition and the verification standard for the other stations. Read it before you
touch Station 3.

Copy everything into your **own OneDrive** so Copilot can reference it from the Work
scope; CSVs can also be opened directly in Excel or uploaded to the Analyst agent.

## Surfaces allowed

Any Copilot surface you've learned: **Copilot Chat** (Work or upload), **Copilot in
Excel**, the **Analyst agent**, and **Researcher-style briefing** over the data room.
Part of the capstone is choosing the right one per station.

## Sign-off code format rules

Codes are case- and space-insensitive, but format matters:

- **Profit-center ids**: exactly as they appear in the file, **hyphen included**
  (e.g. `PC-999`).
- **Carrier**: the **first word** of the carrier's name only, all caps
  (e.g. `RIDGELINE`).
- **Trust Rec**: the exception **count immediately followed by** the unidentified
  payer's first word, all caps, no space (e.g. `4PELICAN`).
- **Deal Desk**: the whole-number **percentage immediately followed by** the one-word
  defect, all caps, no space, no `%` (e.g. `55CLAWBACK`).

## Ground rules

- All data is **synthetic** — built for this workshop, shaped like a national insurance
  brokerage's finance data, but entirely fictional. No real Brown & Brown clients,
  carriers, teammates, or deals. Safe to upload to Copilot.
- Verification is part of the exercise: every station expects you to re-derive or quote
  the answer from the source before entering it. Wrong codes cost attempts.
