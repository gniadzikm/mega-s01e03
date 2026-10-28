import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { groupByCause, uniqueById } from '../src/lib/kb/causes.ts';

const data = fileURLToPath(new URL('../src/lib/data/', import.meta.url));
export const rows = JSON.parse(fs.readFileSync(`${data}reports-4471.json`));
export const notes = JSON.parse(fs.readFileSync(`${data}desk-notes.json`));
export const tenants = fs.readdirSync(`${data}tenants`).map((name) =>
  JSON.parse(fs.readFileSync(`${data}tenants/${name}`))
);
export const tenantOf = (r) => tenants.find((t) => t.handle === r.tenant);
export const reports = uniqueById(rows).filter((r) => r.mergedInto === 4471);
export const groups = groupByCause(reports, tenantOf);
