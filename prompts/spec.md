---
description: Spec-driven workflow over specs/ — plan a change, audit drift, verify or archive it
argument-hint: "<plan|audit|verify|archive> [args]"
---
Load the `spec-vibe` skill and route on the first argument — plan → forward path, audit → drift report, verify → verify gate, archive → merge + move. With no subcommand, default to plan.

Request:<user_input>
$@
</user_input>

End with the skill's output contract for the routed task, plus the cold-agent gap list.
