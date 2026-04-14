---
name: gsd:extract-learnings
description: Extract decisions, lessons, patterns, and surprises from completed phase artifacts
argument-hint: <phase-number>
allowed-tools:
  - Read
  - Write
  - Bash
  - Grep
  - Glob
  - Agent
type: prompt
---
<objective>
Extract structured learnings from completed phase artifacts (PLAN.md, SUMMARY.md, VERIFICATION.md, UAT.md, STATE.md) into a LEARNINGS.md file that captures decisions, lessons learned, patterns discovered, and surprises encountered.
</objective>

<execution_context>
@/home/codeslayer_x86/codeslayer/projects/x86-kit/.claude/get-shit-done/workflows/extract_learnings.md
</execution_context>

Execute the extract-learnings workflow from @/home/codeslayer_x86/codeslayer/projects/x86-kit/.claude/get-shit-done/workflows/extract_learnings.md end-to-end.
