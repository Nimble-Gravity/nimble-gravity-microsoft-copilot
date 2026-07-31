# The Close Room — Reviewer's Rubric

This rubric defines the reconciliation standard for **Station 3 (Trust Rec)** and what
good verification looks like at the other stations. It defines *method*, not answers.

## Station 3 — Trust Rec: what counts as an exception

Reconcile `premium-trust-ledger.csv` (the broker's premium trust ledger) against
`trust-bank-statement.csv` (the trust account's June bank statement). Match on the
policy id embedded in each bank description.

An **exception** is any of the following:

- **(a) Unremitted premium** — a premium collected from the client (received in the
  ledger, credit in the bank) but **never remitted to the carrier**: no remittance in
  the ledger and no corresponding bank debit.
- **(b) Duplicate remittance** — the same carrier remittance appearing **more than
  once** in the bank statement.
- **(c) Unidentified receipt** — a bank credit with **no matching policy in the
  ledger** (no policy reference, or a reference the ledger doesn't contain).
- **(d) Unbanked remittance** — a remittance recorded in the ledger that **never
  appears in the bank statement**.

**Counting rule: count each exception ROW once**, regardless of how many things are
wrong with it or how many rubric categories it touches. Three separate unremitted
policies are three exceptions; one wire that is both late and duplicated is one.

**Sign-off code** = the total exception count, immediately followed by the **ALL-CAPS
first word of the unidentified receipt's payer** (read it from the bank description),
no space.

## What good verification looks like — Stations 1, 2, 4

### Station 1 — Variance Triage

- A trend finding needs **all three months**, not the worst one: show the April, May,
  and June variance percentages for your candidate and confirm each is worse than the
  last.
- Re-derive at least one month's percentage by hand from `budget_usd` and `actual_usd`
  in the raw rows. If your hand math doesn't match Copilot's table, the table loses.
- Confirm the peer group: the finding is only a finding if the other Specialty
  Distribution profit centers are *not* doing the same thing.

### Station 2 — Contingents Desk

- The test is the carrier's YTD loss ratio **against its own threshold column**, not
  against the other carriers'. Thresholds differ by agreement.
- A threshold breach should be corroborated by a second signal in the same file —
  check what happened to that carrier's contingent accrual in June.
- State the range: note the best-performing book too, so the flag reads as analysis
  rather than alarm.

### Station 4 — Deal Desk

- Both answers are **stated in the documents** — extraction, not estimation. If
  Copilot gives you a computed or hedged figure, ask it to quote the sentence that
  states the number outright.
- For the term sheet, review the payout mechanics against what a buyer's checklist
  expects to see (caps, floors, offsets, measurement basis). The defect is something
  **missing**, and the code word is the standard deal-desk adjective for it.
- Quote your source sentence for both answers before signing off. If you can't quote
  it, you haven't found it.
