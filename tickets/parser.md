## Problem: shared parser reads dates month first for day-first tenants

**379 unique reports** in merged ticket #4471, from **2026-04-01 through 2026-10-04**. This is a count from the 4 October export, not today's live queue. Distinct problem from the booking-v3 hint defect in #2.

### Evidence and mechanism

The exported `src/lib/kb/causes.ts` asks `Intl.DateTimeFormat` for the **tenant locale's** day/month order. With the directory in `src/lib/data/tenants/`, day-first tenants route here except reports through booking-v3's form (which route to hint). App/email reports still route to parser even if that tenant uses booking-v3.

`R-41200`: Harbour Dental (`en-GB`, booking-v2), app. The reporter says 7 April became 4 July. The shared parser reads month first rather than respecting the tenant's day-first order. Expected: preserve the tenant's intended day and month; actual: ambiguous dates can swap.

### Count audit

- Deduplicate export rows by report ID, then filter `mergedInto === 4471`.
- Use `groupByCause(..., tenantOf)` from the exported implementation, not subjects, browser locale or intake tags.
- This group has 356 `parser` intake tags and 23 misleading `hint` tags.
- Full report-ID membership: [evidence/report-partition.json](https://github.com/gniadzikm/mega-s01e03/blob/main/evidence/report-partition.json).
- The 427 exported rows represent 412 unique reports; the other issue covers 33. The sets are disjoint.

### Unresolved narratives, not a proven third defect

Five reports are routed here by tenant/channel but were read by the desk as one-day moves: `R-41202`, `R-41209`, `R-41236`, `R-41344`, `R-41620`. Their bodies do not establish that a month/day parser defect explains them. Preserve them for reproduction and investigate a separate cause; do not claim a timezone diagnosis or silently remove them from the exported count.

### Acceptance / investigation

Reproduce day-first ambiguous dates across app/email and booking-v2 input; make date order explicit and consistent. Confirm booking-v3 hint work does not accidentally get treated as the same fix. Reproduce the five anomalous reports separately before deciding whether they need another cause/ticket. No production fix or deployment is claimed.

Signed kb review: `src/routes/kb/incidents/4471-review/+page.svx`; rendered HTML and browser evidence are under `rendered/`.
