## Problem: booking-v3 prints a month-first hint to day-first tenants

**33 unique reports** in merged ticket #4471, from **2026-04-17 through 2026-09-22**. These are separate from the shared parser's 379 reports in #1. Counts describe the 4 October export, not the live support queue.

### Evidence and mechanism

`DATE_HINT['booking-v3']` in `src/lib/kb/causes.ts` is `MM/DD/YYYY`. A day-first tenant's user follows that hint, but the form reads the input in the tenant's day-first order. This form-specific mismatch needs its own fix, not merely the shared parser change.

Affected route: `channel === 'form'`, `form === 'booking-v3'`, day-first tenant locale. The directory identifies Alder Physio (`de-DE`), Copper Studio (`es-ES`) and Pale Harbour (`pt-PT`). The same tenants' app/email reports do not belong to this cause.

`R-41230`: Copper Studio, form; 6 January became 1 June. Intake tagged it `parser`, but the tenant/form/channel classifier says `hint`. Expected: the displayed date hint and date interpretation agree; actual: the hint instructs the opposite order.

### Count audit

Deduplicate by report ID, filter `mergedInto === 4471`, and run the exported `groupByCause` with the tenant directory. This yields **33**, comprising 18 `hint` intake tags and 15 misleading `parser` tags. Browser locale, tag totals and subject matching cannot establish cause counts.

Full report-ID membership: [evidence/report-partition.json](https://github.com/gniadzikm/mega-s01e03/blob/main/evidence/report-partition.json). Together with #1 the disjoint groups cover all 412 unique reports, not 427 overlapping export rows.

### Acceptance / investigation

For each affected tenant, render the booking-v3 date hint and enter an ambiguous date following it. Ensure hint and interpretation use the same locale order. Check that app/email and booking-v2 remain separately classified. No product fix or deployment is claimed.

Signed kb review: `src/routes/kb/incidents/4471-review/+page.svx`; rendered HTML and browser evidence are under `rendered/`.
