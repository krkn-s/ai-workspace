---
description: Ensure the project's shared AGENTS.md contains the multi-agent coordination section (.agents-sync, worktree-first, state.json and messages.jsonl protocol) — append it when missing, no-op when already present, repair when truncated. Déclenche aussi en français — vérifier que l'AGENTS.md du projet contient la section coordination multi-agents et l'ajouter si absente.
argument-hint: "[instructions]"
---
Ensure this project's **shared, versioned `AGENTS.md`** contains the canonical multi-agent coordination section (bottom of this template). This is an idempotent maintenance task — the section must exist exactly once; never rewrite what is already there. Arguments may add instructions or override the target path.

Request:
<user_input>

$@

</user_input>

## Step 1 — Inspect

- Target the shared `AGENTS.md` at the repo root — never `AGENTS.override.md` (the rules must reach every agent through the versioned file) and never a global `~/.pi` file.
- File missing → go to **Step 3** (create).
- File present → read it and search for an existing coordination section — any heading whose text contains `Coordination multi-agents`, or the `.agents-sync/` marker.
- If `git status --porcelain` shows `AGENTS.md` already modified, say so before touching it — parallel agents may share this tree.

## Step 2 — Decide

- **Absent** → **Step 3**.
- **Present** — compare the existing section against the canonical block, ignoring heading-level shifts (a demoted append is still a match).
  - **Identical** → report no-op and stop. Do not rewrite, translate, or realign anything.
  - **Different** (rules changed, added, removed, or sections missing/truncated) → expose the differences and ask which version to keep, as described below. Never decide this replacement unilaterally.

### When the section differs

Before touching anything:

- Walk the seven numbered sections one by one; for each divergence, quote the existing wording next to the canonical wording — enough context to judge, no full-file dump.
- Separate cosmetic-only divergences (heading levels, punctuation, typo fixes) from substantive ones (rules added, removed, or changed) so the choice is informed.
- Then ask one question — which version to keep:
  - **Existing** — keep the current section exactly as-is; no modification.
  - **Canonical** — replace the whole section with the canonical block, verbatim, same heading-level rule as **Step 3**.
- Apply only after the answer, and swap the section in one edit — never leave a mix of both versions.

## Step 3 — Apply

Append the canonical block to the end of the file, preceded by one blank line — or, when replacing a divergent section the user chose to overwrite, remove the old section entirely and put the block in its place. Never append a duplicate:

- Keep the block **verbatim** — French wording, structure, code fences — nothing translated, rephrased, or reordered.
- Single exception — if the file already has a level-1 heading, demote the block's headings one level (`#`→`##`, `##`→`###`, `###`→`####`) so the file keeps a single H1. Detection still matches the `Coordination multi-agents` text.
- File created from scratch → write just the block; its own H1 serves as the title.

Then re-read the file to confirm the section appears exactly once, and report — action taken (`created` / `appended` / `replaced` / `no-op`), `git diff --stat`, and a reminder to commit and push so other agents pick the section up. Do not commit unless asked.

## Canonical block

`````markdown
# AGENTS.md — Coordination multi-agents

Plusieurs agents travaillent ce dépôt en parallèle. Règles obligatoires, deux fichiers de coordination, zéro outil externe.

## 1. Worktree-first

Le checkout principal est partagé et sera écrasé sous toi. Avant toute édition de fichier :

```bash
git worktree add ../<repo>-<ta-tache> -b agent/<ta-tache> main
cd ../<repo>-<ta-tache>
```

Toute modification se fait dans ce worktree, jamais ailleurs.

## 2. Coordination `.agents-sync/`

Deux fichiers versionnés :

```text
.agents-sync/
├── state.json       # qui fait quoi : agents actifs, verrous, tâches
└── messages.jsonl   # messagerie unique, append-only
```

`state.json` absent ? Crée-le :

```json
{
  "version": 1,
  "agents": {},
  "locks": {},
  "tasks": []
}
```

### Écriture de `state.json`

Toujours atomique — lis, modifie en mémoire, écris `state.json.tmp`, puis :

```bash
mv state.json.tmp state.json
git add .agents-sync/state.json
git commit -m "agents: <action> (<ton-id>)"
git push origin agent/<ta-tache>
```

**Push rejeté** : un autre agent a modifié l'état en même temps. `git fetch && git rebase origin/main`, ré-applique ta modification, re-teste, re-push. Le premier push gagne, tu t'adaptes.

### Messagerie `messages.jsonl`

Un seul fichier, append-only : on ajoute des lignes, on n'en supprime jamais.

```jsonl
{"from":"agent-1","to":"agent-2","ts":"2026-01-01T10:00:00Z","type":"info","msg":"Je modifie src/auth/types.ts, ne pas y toucher.","context":{"file":"src/auth/types.ts"}}
```

- `type` : `info` | `request` | `ack` ; diffusion : `"to":"all"`.
- Lire : `jq -c 'select(.to=="<ton-id>" or .to=="all")' .agents-sync/messages.jsonl | tail -20`
- Push rejeté : même arbitrage que `state.json` (rebase, ré-append, re-push).

## 3. Protocole de session

**Démarrage**

1. Synchronise-toi sur `main`, crée ton worktree (règle 1).
2. Lis `state.json`, nettoie les verrous expirés, lis tes messages.
3. Enregistre-toi dans `agents` : id, branche, worktree, tâche, `touches` (fichiers prévus).

**Pendant**

- Fichier dans le `touches` d'un autre agent ou verrouillé : n'y touche pas, coordonne par message.
- Verrou : entrée dans `locks` (`agent`, `acquired`, `expires` max 2 h), libérée dès que fini.

**Fin — tâche fusionnée**

1. Retire ton entrée `agents`, tes verrous, tes tâches terminées ; commit + push.
2. `git worktree remove ../<repo>-<ta-tache>` ; supprime ta branche.

## 4. Specs d'abord

Décisions d'architecture et contrats (types, routes, interfaces) vivent dans `specs/`. Ta tâche touche un contrat partagé : lis la spec avant de coder ; la changer : modifie et valide la spec **avant** le travail parallèle. La spec est la source de vérité — pas les messages, pas le code.

## 5. Validation avant fusion

Détecte l'outillage du projet (manifest, scripts, Makefile, CI) et utilise ses commandes natives de test et lint. Rien détecté : signale-le, valide par revue manuelle.

Tests et lint verts avant toute fusion, sans exception — et re-teste après un rebase.

## 6. Workflow Git

1. Une branche par tâche, `agent/<ta-tache>` depuis `main`.
2. Commits fréquents et atomiques ; ne stage que tes fichiers.
3. Fusion séquentielle, une par une :

```bash
git push origin agent/<ta-tache>
git fetch origin
git rebase origin/main        # conflits → résous, re-teste
git checkout main && git merge --no-ff agent/<ta-tache>
git push origin main
```

## 7. Interdictions

- `git stash` — pile partagée entre worktrees ; utilise commits ou patches.
- Écriture non atomique de `state.json`.
- Suppression d'une ligne de `messages.jsonl`.
- Fichier verrouillé ou pris par un autre agent, sans coordination.
- Fusion sans tests et lint verts.
`````
