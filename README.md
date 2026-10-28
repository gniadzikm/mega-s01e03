# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

## S01E03 review (28 October 2026)

- [Signed source page](src/routes/kb/incidents/4471-review/+page.svx)
- [Browser screenshot of the complete page](rendered/4471-review.png)
- [Prerendered HTML](rendered/4471-review.html)
- [Complete static site, with CSS and client components](rendered/site/)
- [Parser: 379 unique reports](https://github.com/gniadzikm/mega-s01e03/issues/1)
- [Form hint: 33 unique reports](https://github.com/gniadzikm/mega-s01e03/issues/2)
- [Reproducible report-ID partition](evidence/report-partition.json)
- [New decision 0002](src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx)

The first commit preserves the original export unchanged. The accepted historical decision 0001
is still unchanged. New source text supersedes the old single-cause summary and subject-only triage.
The supplied cause logic, tenant directory, desk notes and reports are unchanged.

### Run and verify

Use Node 24 or newer (the analysis scripts use Node's TypeScript stripping):

```sh
npm ci
npm test
npm run analyze
npm run build
python3 -m http.server 4173 --bind 127.0.0.1 --directory build
# Open http://127.0.0.1:4173/kb/incidents/4471-review/
```

To view the committed static output without installing anything:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory rendered/site
```

Serve the site at the HTTP root so its absolute asset links resolve. Opening the standalone HTML
through GitHub's source viewer will show code, not execute the components. The screenshot records
Chrome's actual rendered page, including the component-generated desk reference DR-P8J3-Q8CX.
No hand-written substitute for the Svelte output was used.

The 4 October export has 427 rows, 412 unique IDs, two classifier groups (379 and 33), and five
one-day narratives within the parser group that still need investigation. No third cause is proven.
Receipt dates begin 1 April; merges begin 2 July. A merge spike is not the incident's start.
These are export observations, not today's live desk state or evidence of a deployed fix.

The local build and three evidence tests passed. Dependencies are pinned and locked. The final
install audit reported six low-severity advisories, no moderate/high/critical advisories; this is
not a claim that dependencies are risk-free. The only server used here is loopback static HTTP.

### GitHub routine used

The pre-existing `gh` CLI was authenticated to `gniadzikm`. Its flags were checked with `--help`.
The course work used `gh repo create ... --public --source=. --remote=origin`, then
`gh issue create --repo gniadzikm/mega-s01e03 --title ... --body-file tickets/....md`.
Verify with `gh issue list --repo gniadzikm/mega-s01e03 --state all` and `gh issue view`.
Keep the desk's later updates separate from this immutable export evidence; re-read before acting.
