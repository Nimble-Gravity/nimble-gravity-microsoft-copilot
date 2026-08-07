# Lab Data — Synthetic Finance Files

Workshop datasets for the Nimble Gravity × Brown & Brown **M365 Copilot Advanced Workshop**
(finance). **Everything here is synthetic** — generated for training, shaped like a national
insurance brokerage's finance data, but entirely fictional. No real clients, carriers,
teammates, deals, or figures. Safe to upload to Copilot, Researcher, and Analyst in the labs.

| File | Shape | Used in |
|---|---|---|
| `profit-center-pnl.csv` | Budget vs actuals by profit center × month (Jan–Jun 2026) × account, across Retail and Specialty Distribution, including an agency acquired mid-period. Each row also carries `division`/`platform`/`slt`/`pc_number` — an org hierarchy shaped like the client's real flash-reporting structure. | Chat sprint (M1) · Excel/Analyst labs (M2, M4) · The Close Room |
| `flash-comments.csv` | One row per profit center, June 2026: `division/platform/region/pc_name/slt/pc_number` plus `revenue_comments`/`expense_comments` narrative — generated from (and traceable to) the June rows in `profit-center-pnl.csv`. Shaped like a real monthly flash-close commentary export. | Chat sprint draft-prompt worked example (M1) · Close-Package lab (M2) · The Close Room |
| `carrier-commission-statements.csv` | Monthly carrier production: written premium, base/supplemental commissions, contingent accruals, YTD loss ratios vs profit-share thresholds, plus a `business_type` transaction code | Analyst lab (M4) · The Close Room |
| `business-type-key.csv` | Reference lookup for the `business_type` codes (C/D/M/N/O/R/S/X/Y — cancellation, reinstatement, endorsement, new bind, other, renewal) | Excel Copilot lookup demo (M2) |
| `premium-trust-ledger.csv` + `trust-bank-statement.csv` | A June fiduciary-cash reconciliation pair (premium trust ledger vs trust bank statement) with realistic exceptions | Excel Copilot rec exercise (M2) · The Close Room |
| `data-room/` | Project Lighthouse — a mini acquisition data room: CIM extract, 3-year financials, carrier contract summary, seller's earn-out term sheet | Researcher mission (M3) · Word/deck exercises |

Notes for facilitators:

- Data is **deterministic** (seeded generator) and several findings are planted deliberately.
  The answer key lives in the facilitator guide — not in this folder, which attendees download.
- If you regenerate or edit the CSVs, **re-derive the escape-room / Close Room codes** before
  a session (see those apps' READMEs) if any `codePlaintext` values change — unlock codes are
  authored directly in `rooms.source.json`, chosen to match specific numbers in this data.
- Attendees copy these files into their **own OneDrive** during pre-work so Copilot can
  reference them.
- **The column names and org-hierarchy shape (`division`/`platform`/`slt`/`pc_number`,
  `flash-comments.csv`, `business_type`) intentionally mirror the structure of real Brown & Brown
  production/flash-commentary exports the client shared under NDA for this engagement.** The
  *rows* here are 100% fictional — no real client data (names, dollar figures, or the client's
  actual files) has ever been committed to this repo, which is public. Keep it that way.
