# The Variance Vault — Player Briefing

**Module 2 take-home challenge · M365 Copilot Advanced Workshop · 40 minutes · teams or solo**

## The situation

It's month-end. Four sealed findings are buried in the June data — a windfall, a lease,
an overrun, and a slide. Each room of the vault describes one finding; the data holds the
answer. Use Copilot — **Copilot Chat**, **Copilot in Excel**, or the **Analyst agent** —
to dig each one out. The answer, formatted per the rules below, is the unlock code.

Work in a team or solo. The clock runs 40 minutes; the second hint in any room costs a
2-minute penalty. Frame every prompt with the four elements: **Goal · Context ·
Expectations · Source**.

## Get the data

Download these three files from the lab-data folder (`../assets/lab-data/` on the
microsite, or wherever your facilitator shared them):

1. `profit-center-pnl.csv` — budget vs actuals by profit center × month × account, Jan–Jun 2026
2. `carrier-commission-statements.csv` — monthly carrier production and contingent accruals
3. `flash-comments.csv` — June revenue/expense commentary by profit center, useful to
   corroborate a finding once you have one

(The vault's four rooms all run on the P&L file; the carrier statements and flash comments
are your warm-up and cross-reference data.)

## Setup

- Copy both files into your **own OneDrive** so Copilot can reference them from the Work
  scope, and/or open `profit-center-pnl.csv` directly in **Excel** for Copilot in-app.
- The Analyst agent accepts the CSV as an upload if you prefer to work in Chat.
- Have the vault open in a browser tab; enter a team name to start the clock.

## Code-entry format rules

The vault normalizes codes (case and spaces don't matter), but format does:

- **Dollar amounts** are entered in **$ thousands**, digits only — no commas, no `$`,
  no decimals. ($425,000 → `425`)
- **Profit-center ids** are entered exactly as they appear in the file, **hyphen
  included** (e.g. `PC-999`).
- **Counts** are entered as the number **immediately followed by the word UNDER**,
  no space (e.g. `7UNDER`).

## Ground rules

- All data is **synthetic** — generated for this workshop, no real Brown & Brown
  clients, carriers, teammates, or figures. It is safe to upload to Copilot, Chat,
  and Analyst.
- Verify before you enter: a wrong code costs an attempt, and the data always contains
  the check you need.
