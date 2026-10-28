import { groups, notes, reports, rows } from './evidence.mjs';

console.log(JSON.stringify({
  exportedRows: rows.length,
  uniqueReports: reports.length,
  overlapRows: rows.length - reports.length,
  groups: groups.map((g) => ({
    cause: g.cause,
    count: g.reports.length,
    tenants: g.tenants,
    firstSeen: g.firstSeen,
    lastSeen: g.lastSeen,
    intakeTags: g.taggedAs,
    oneDayMove: g.reports.filter((r) => notes.oneDayMove.includes(r.id)).map((r) => r.id),
    reportIds: g.reports.map((r) => r.id)
  }))
}, null, 2));
