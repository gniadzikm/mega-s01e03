<script lang="ts">
  import rows from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const reports = uniqueById(rows as Report[]).filter((r) => r.mergedInto === 4471);
  const groups = groupByCause(reports, tenantOf);
  const earliest = (values: string[]) => [...values].sort()[0]?.slice(0, 10);
  const flagged = reports.filter((r) => notes.oneDayMove.includes(r.id));
  const months = [...new Set(reports.map((r) => r.receivedAt.slice(0, 7)))].sort();
</script>

<p>
  The export has <strong>{rows.length}</strong> rows but <strong>{reports.length}</strong> unique
  report IDs: <strong>{rows.length - reports.length}</strong> overlapping export rows are not new reports.
  The tenant/channel classifier partitions them into <strong>{groups.length}</strong> causes.
</p>

<h2>Tickets to work separately</h2>
<table>
  <thead><tr><th>Cause</th><th>Reports</th><th>Issue</th></tr></thead>
  <tbody>
    {#each groups as g (g.cause)}
      <tr>
        <td>{g.cause}</td><td>{g.reports.length}</td>
        <td><a href={`https://github.com/gniadzikm/mega-s01e03/issues/${g.cause === 'parser' ? 1 : 2}`}>
          {g.cause === 'parser' ? '#1 · shared month-first parser' : '#2 · booking-v3 date hint'}
        </a></td>
      </tr>
    {/each}
  </tbody>
</table>

<h2>Read the two clocks</h2>
<p>
  Reports start on <strong>{earliest(reports.map((r) => r.receivedAt))}</strong>.
  Merges into #4471 start on <strong>{earliest(reports.flatMap((r) => r.mergedAt ? [r.mergedAt] : []))}</strong>.
  A merge spike is desk activity, not the onset of the defect. Reports continue through
  <strong>{[...reports].map((r) => r.receivedAt.slice(0, 10)).sort().at(-1)}</strong>.
</p>
<table>
  <thead><tr><th>Month</th><th>Received</th><th>Merged</th></tr></thead>
  <tbody>
    {#each months as month}
      <tr>
        <td>{month}</td>
        <td>{reports.filter((r) => r.receivedAt.startsWith(month)).length}</td>
        <td>{reports.filter((r) => r.mergedAt?.startsWith(month)).length}</td>
      </tr>
    {/each}
  </tbody>
</table>

<h2>Do not hide the reports that do not fit</h2>
<p>
  The desk marked <strong>{flagged.length}</strong> reports as a one-day move. The current
  classifier puts all of them under parser by tenant/channel. That routing is not proof that a
  month/day swap explains their bodies. Keep them in the parser count for this export, but
  investigate before deciding whether a third cause exists. A timezone cause is not established.
</p>
<table>
  <thead><tr><th>Report</th><th>What the reporter said</th></tr></thead>
  <tbody>
    {#each flagged as r (r.id)}
      <tr><td><code>{r.id}</code></td><td>{r.body}</td></tr>
    {/each}
  </tbody>
</table>
