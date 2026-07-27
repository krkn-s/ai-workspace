# Unix Query Cookbook

The `specs/` tree is designed to be queried with plain `rg` and `fd` — no index file, no database, no CLI. This is the cookbook. Use it to answer "what is the state of X" in seconds.

These commands assume `rg` (ripgrep) and `fd` are available. `grep` and `find` work as fallbacks (slower).

## The dashboard

There is no `INDEX.md` to maintain. The outline of the whole tree **is** the dashboard:

```bash
# every heading, every file, with file:line
rg -n '^#' -g '*.md' specs/

# what is in progress right now
rg -n '^#' -g '*.md' specs/changes/1-wip/

# what is waiting to be archived
rg -n '^#' -g '*.md' specs/changes/2-done/
```

Because the heading taxonomy is strict (see `artifacts.md`), this reads as a clean table of contents across the entire project. Loose headings break this for everyone — keep them predictable.

## Listings by state

Status is the folder, so listings need no parsing:

```bash
ls specs/changes/0-draft/      # being specified
ls specs/changes/1-wip/        # in progress
ls specs/changes/2-done/       # pending archive
ls specs/changes/3-archive/    # history (chronological, date-prefixed)

# count changes per state
for d in 0-draft 1-wip 2-done 3-archive; do
  printf '%s: %s\n' "$d" "$(fd -t d . specs/changes/$d | wc -l | tr -d ' ')"
done
```

## Find files by type

The double extensions make this trivial and unambiguous:

```bash
fd 'spec\.md$'  specs/current     # all current specs (the source of truth)
fd 'delta\.md$' specs/changes     # all deltas (proposed changes)
fd .             specs/decisions -e md   # all ADRs
rg -l '^type: adr'  specs/        # all ADRs by frontmatter
rg -l '^type: spec' specs/current # all current specs by frontmatter
```

## Cross-reference by ID

Reference by ID, never by path. Find a change and everything that mentions it, regardless of which state folder it is in:

```bash
rg '2025-12-01-add-oauth' specs/        # the change + every reference to it
rg '^depends_on:' -A4 specs/changes     # who depends on what (stacking map)
rg '^provides:' -A2 specs/changes       # capability markers exposed
rg '^requires:' -A2 specs/changes       # capability markers needed
```

## Requirements, scenarios, decisions, tasks

Shared content signals work across current specs and deltas because the headings are identical:

```bash
rg '^### Requirement:' specs/           # every requirement in the project
rg '^#### Scenario:'    specs/          # every scenario
rg '^### Decision:'     specs/changes   # every design decision
rg '^- \[ \]'           specs/changes   # every open task (checkboxes)
rg '^- \[x\]'           specs/changes   # every completed task
```

## Per domain

The `domain:` frontmatter field aggregates a capability's whole surface:

```bash
rg '^domain: auth' specs/                       # spec + deltas + ADRs for auth
rg '^### Requirement:' specs/current/auth.spec.md   # auth's current behavior
fd 'auth.delta.md$' specs/changes               # every change touching auth
```

## Provenance (forward vs reverse)

```bash
rg '^origin: vibe' specs/changes        # changes that were vibe-coded then spec'd
rg '^origin: spec-driven' specs/changes # changes that were spec'd first
```

## Open questions & gaps

```bash
rg 'Open question' specs/changes        # undecided items in any change
rg -i 'TODO|FIXME|XXX' specs/           # leftover markers
```

## The reverse-path audit

Spot code that has no spec, fast:

```bash
# behavior surfaces in code with no matching current spec
rg -n 'def |func |router\.|@app\.|export ' src/ \
  | head -50        # then check each against specs/current/

# requirements in the spec with no matching code (stale spec)
rg '^### Requirement:' specs/current/

# accepted ADRs that nothing references
rg -l '^status: accepted' specs/decisions
```

For a structured audit, use `/spec-audit` — it walks these queries and produces a drift report rather than a wall of output.

## Grep and find fallbacks

If `rg`/`fd` are not installed:

```bash
grep -rn '^### Requirement:' specs/
find specs/changes/1-wip -name '*.md'
find specs -name '*.spec.md'
find specs -name '*.delta.md'
```

Slower, but correct. The tree's naming and frontmatter are designed so the fallbacks still work — that is the point of keeping everything plain Markdown.
