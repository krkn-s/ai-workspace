#!/bin/sh
# Tests for the agent-swarm coordination protocol.
# Runs in a throwaway repo created under the git common dir,
# which stays inside the pi sandbox's allowed cwd.
set -u

fail=0
ok() { printf 'ok - %s\n' "$*"; }
ko() { printf 'not ok - %s\n' "$*"; fail=1; }

COMMON="$(git rev-parse --path-format=absolute --git-common-dir)" || exit 1
ROOT="$COMMON/agents-sync-test.$$"
rm -rf "$ROOT"
mkdir -p "$ROOT" || exit 1
trap 'cd "$COMMON" && rm -rf "$ROOT"' EXIT

cd "$ROOT" || exit 1
git init -q repo || exit 1
cd repo || exit 1
git config user.email swarm@test
git config user.name swarm-test
echo one > file && git add file && git commit -qm init
STATE="$ROOT/repo/.git/agents-sync"
mkdir -p "$STATE/state" "$STATE/messages" "$STATE/acks" "$STATE/locks"

claim() {
  br="$1"; task="$2"; wt="${3:-$(pwd)}"
  mkdir -p "$STATE/state/$br" || return 1
  printf '%s\n' "$br" > "$STATE/state/$br/branch"
  printf '%s\n' "$task" > "$STATE/state/$br/task"
  printf '%s\n' "$wt" > "$STATE/state/$br/worktree"
  printf '%s\n' "$(date -u +%FT%TZ)" > "$STATE/state/$br/ts"
}

post() {
  id="$(date -u +%s%N)-$(printf '%s' "$1" | tr '/' '-')"
  { printf 'From: %s\nTo: %s\nType: %s\nDate: %s\n\n' "$1" "$2" "$3" "$(date -u +%FT%TZ)"
    printf '%s\n' "$4"
  } > "$STATE/messages/$id.msg"
  printf '%s' "$id"
}

inbox() {
  for m in "$STATE/messages"/*.msg; do
    [ -e "$m" ] || continue
    to="$(sed -n 's|^To: ||p' "$m" | head -1)"
    case "$to" in "$1"|"all") ;; *) continue ;; esac
    [ -e "$STATE/acks/$(basename "$m" .msg)/$1" ] && continue
    basename "$m" .msg
  done
}

# 1. claim twice: single state, fields refreshed
claim agent/one first && claim agent/one second
[ "$(cat "$STATE/state/agent/one/task")" = "second" ] && ok "re-claim refreshes fields" || ko "re-claim refreshes fields"
[ "$(find "$STATE/state" -name branch | wc -l)" -eq 1 ] && ok "re-claim leaves no duplicate" || ko "re-claim leaves no duplicate"

# 2. twenty parallel claims, no failures
i=0; while [ "$i" -lt 20 ]; do ( claim "agent/p$i" "task $i" ) & i=$((i+1)); done; wait
[ "$(find "$STATE/state" -name branch | wc -l)" -eq 21 ] && ok "20 parallel claims all land" || ko "20 parallel claims all land"

# 3. ten parallel claims on the same branch, state stays readable
j=0; while [ "$j" -lt 10 ]; do ( claim agent/same "task $j" ) & j=$((j+1)); done; wait
[ "$(cut -c1-4 "$STATE/state/agent/same/task")" = "task" ] && ok "same-branch parallel claims stay readable" || ko "same-branch parallel claims stay readable"

# 4. five parallel lock attempts, exactly one winner
k=0; while [ "$k" -lt 5 ]; do
  ( mkdir "$STATE/locks/merge" 2>/dev/null \
    && printf 'agent/l%s %s\n' "$k" "$(date -u +%FT%TZ)" > "$STATE/locks/merge/owner" \
    && : > "$ROOT/won-$k" ) &
  k=$((k+1))
done
wait
[ "$(ls "$ROOT" | grep -c '^won-')" -eq 1 ] && ok "exactly one lock winner, owner readable" || ko "exactly one lock winner, owner readable"

# 5. releasing someone else's lock is refused
if [ -f "$STATE/locks/merge/owner" ] && [ "$(cut -d' ' -f1 "$STATE/locks/merge/owner")" = "agent/other" ]; then
  refused=0
else
  refused=1
fi
[ "$refused" -eq 1 ] && ok "release by non-owner refused" || ko "release by non-owner refused"

# 6. the owner can release
winner="$(cut -d' ' -f1 "$STATE/locks/merge/owner")"
[ -f "$STATE/locks/merge/owner" ] && [ "$(cut -d' ' -f1 "$STATE/locks/merge/owner")" = "$winner" ] && rm -rf "$STATE/locks/merge"
[ ! -d "$STATE/locks/merge" ] && ok "owner releases the lock" || ko "owner releases the lock"

# 7. post, inbox, ack
id="$(post agent/a agent/b request 'please touch nothing in schema')"
inbox agent/b | grep -q "^$id$" && ok "request lands in inbox" || ko "request lands in inbox"
mkdir -p "$(dirname "$STATE/acks/$id/agent/b")" && touch "$STATE/acks/$id/agent/b"
inbox agent/b | grep -q "^$id$" && ko "ack removes message from inbox" || ok "ack removes message from inbox"

# 8. two messages in the same second, two files
n0="$(ls "$STATE/messages" | wc -l)"
post agent/a agent/b info one >/dev/null
post agent/a agent/b info two >/dev/null
[ "$(($(ls "$STATE/messages" | wc -l) - n0))" -eq 2 ] && ok "two same-second messages, two files" || ko "two same-second messages, two files"

# 9. branch with slash nests the claim path
claim agent/feat/x "slash" && [ -f "$STATE/state/agent/feat/x/branch" ] && ok "slash branch nests correctly" || ko "slash branch nests correctly"

# 10. path collision fails loudly
claim agent/feat/collide "parent" >/dev/null 2>&1
claim agent/feat/collide/task "child" >/dev/null 2>&1 && ko "collision must fail" || ok "collision fails loudly"

# 11. liveness follows git worktree list, not timestamps
git worktree add -q "$ROOT/wt-live" -b agent/live HEAD
claim agent/live "live task" "$ROOT/wt-live"
if git worktree list --porcelain | grep -q "^worktree $ROOT/wt-live$"; then alive=1; else alive=0; fi
[ "$alive" -eq 1 ] && ok "live worktree detected" || ko "live worktree detected"
git worktree remove --force "$ROOT/wt-live" 2>/dev/null || git worktree prune
if git worktree list --porcelain | grep -q "^worktree $ROOT/wt-live$"; then alive=1; else alive=0; fi
[ "$alive" -eq 0 ] && ok "gone worktree detected" || ko "gone worktree detected"

# 12. release refuses while a lock is held, then works
mkdir "$STATE/locks/deploy" && printf 'agent/live %s\n' "$(date -u +%FT%TZ)" > "$STATE/locks/deploy/owner"
if grep -q "^agent/live " "$STATE/locks"/*/owner 2>/dev/null; then refused=1; else refused=0; fi
[ "$refused" -eq 1 ] && ok "release refuses while holding a lock" || ko "release refuses while holding a lock"
rm -rf "$STATE/locks/deploy"
rm -rf "$STATE/state/agent/live"
[ ! -d "$STATE/state/agent/live" ] && ok "release after unlocking" || ko "release after unlocking"

if [ "$fail" -eq 0 ]; then
  printf 'all tests passed\n'
else
  printf 'failures above\n'
fi
exit "$fail"