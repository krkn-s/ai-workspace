# Query Cookbook

Plain `rg`/`fd` answer "what is the state of X" in seconds — no index file, no database. (`grep`/`find` work as slower fallbacks; the naming keeps them correct.)

```bash
# dashboard — the outline IS the index
rg -n '^#' -g '*.md' specs/                     # whole tree
rg -n '^#' -g '*.md' specs/changes/1-wip/       # in flight right now

# listings by state (status is the folder)
ls specs/changes/{0-draft,1-wip,2-archive}/

# by type — double extensions and frontmatter
fd 'spec\.md$'  specs/current                   # the source of truth
fd 'delta\.md$' specs/changes                   # proposed changes
fd . specs/decisions -e md                      # ADRs

# cross-reference by ID (never by path)
rg '2025-12-01-add-oauth' specs/                # change + every reference, any state
rg '^depends_on:' -A4 specs/changes             # stacking map

# content signals — identical headings in specs and deltas
rg '^### Requirement:' specs/                   # every requirement
rg '^#### Scenario:'   specs/                   # every scenario
rg '^- \[ \]'          specs/changes            # open tasks

# per domain / provenance / gaps
rg '^domain: auth' specs/                       # a capability's whole surface
rg '^origin: vibe' specs/changes                # reverse-path changes
rg 'Open question' specs/changes                # undecided items

# drift audit — code without spec / stale spec / orphaned accepted ADRs
rg -n 'def |func |router\.|@app\.|export ' src/ # check hits against specs/current/
rg '^### Requirement:' specs/current/
rg -l '^status: accepted' specs/decisions
```
