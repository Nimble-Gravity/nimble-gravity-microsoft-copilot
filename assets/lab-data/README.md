# Lab Data — Synthetic Finance Files

Workshop datasets for the Nimble Gravity × Brown & Brown **M365 Copilot Advanced Workshop**
(finance). **Everything here is synthetic** — generated for training, shaped like a national
insurance brokerage's finance data, but entirely fictional. No real clients, carriers,
teammates, deals, or figures. Safe to upload to Copilot, Researcher, and Analyst in the labs.

| File | Shape | Used in |
|---|---|---|
| `profit-center-pnl.csv` | Budget vs actuals by profit center × month (Jan–Jun 2026) × account, across Retail and Specialty Distribution, including an agency acquired mid-period | Chat sprint (M1) · Excel/Analyst labs (M2, M4) · The Close Room |
| `carrier-commission-statements.csv` | Monthly carrier production: written premium, base/supplemental commissions, contingent accruals, YTD loss ratios vs profit-share thresholds | Analyst lab (M4) · The Close Room |
| `premium-trust-ledger.csv` + `trust-bank-statement.csv` | A June fiduciary-cash reconciliation pair (premium trust ledger vs trust bank statement) with realistic exceptions | Excel Copilot rec exercise (M2) · The Close Room |
| `data-room/` | Project Lighthouse — a mini acquisition data room: CIM extract, 3-year financials, carrier contract summary, seller's earn-out term sheet | Researcher mission (M3) · Word/deck exercises |

Notes for facilitators:

- Data is **deterministic** (seeded generator) and several findings are planted deliberately.
  The answer key lives in the facilitator guide — not in this folder, which attendees download.
- If you regenerate or edit the CSVs, **re-derive the escape-room / Close Room codes** before
  a session (see those apps' READMEs) — the unlock codes are computed from this data.
- Attendees copy these files into their **own OneDrive** during pre-work so Copilot can
  reference them from the Work scope.
