import assert from 'node:assert/strict';
import test from 'node:test';
import { groups, notes, reports, rows, tenantOf } from './evidence.mjs';
import { causeOf, sameCause } from '../src/lib/kb/causes.ts';

test('export overlap does not inflate the partition of ticket 4471', () => {
  assert.equal(rows.length, 427);
  assert.equal(reports.length, 412);
  assert.deepEqual(Object.fromEntries(groups.map((g) => [g.cause, g.reports.length])),
    { parser: 379, hint: 33 });
  assert.equal(new Set(groups.flatMap((g) => g.reports.map((r) => r.id))).size, 412);
});

test('tenant and channel override misleading intake tags', () => {
  const r = reports.find((r) => r.id === 'R-41230');
  assert.equal(r.meta.intakeTag, 'parser');
  assert.equal(causeOf(r, tenantOf(r)), 'hint');
  const app = { ...r, channel: 'app' };
  assert.equal(causeOf(app, tenantOf(app)), 'parser');
  assert.equal(sameCause(r, tenantOf(r), app, tenantOf(app)), false);
  assert.equal(causeOf(r, undefined), null);
});

test('one-day narratives stay visible without inventing a proven third cause', () => {
  const flagged = reports.filter((r) => notes.oneDayMove.includes(r.id));
  assert.equal(flagged.length, 5);
  assert.ok(flagged.every((r) => causeOf(r, tenantOf(r)) === 'parser'));
  assert.equal(reports.map((r) => r.receivedAt.slice(0, 10)).sort()[0], '2026-04-01');
  assert.equal(reports.map((r) => r.mergedAt.slice(0, 10)).sort()[0], '2026-07-02');
});
