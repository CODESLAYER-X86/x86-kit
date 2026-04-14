---
name: systematic-debugging
description: 4-phase systematic debugging methodology with root cause analysis, evidence-based verification, and multi-component tracing. DO NOT fix bugs without using this.
allowed-tools: Read, Glob, Grep
---

# Systematic Debugging Protocol

> **Core principle:** ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

## 🛑 The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed Phase 1 (Root Cause Analysis), you absolutely *cannot* propose fixes. Random fixes waste time and create new bugs.

---

## The 4-Phase Debugging Process

You MUST complete each phase in order before proceeding to the next.

### Phase 1: Investigate (Reproduce & Isolate)

Before you fix anything:
1. **Read Errors Carefully:** Read the entire stack trace. Note line numbers, codes, and paths.
2. **Reproduce:** Can we trigger it reliably? What are the exact steps?
3. **Isolate:** Check recent git commits to find what changed. What is the smallest change that triggers the issue?

```markdown
## Phase 1 Checklist
- [ ] Error message fully read and parsed
- [ ] Reproducible consistently
- [ ] Recent commits/changes checked
- [ ] Minimal reproduction case found
```

### Phase 2: Data-Flow & Multi-Component Tracing

If the system has multiple components (e.g. CI → build → script, or Frontend → API → DB):
- **Add Diagnostic Hooks First:** Before proposing fixes, add logging at component boundaries and verify what data enters and exits.
- **Trace Backwards:** Where does the bad value originate? Keep tracing up until you find the source.
*(See `root-cause-tracing.md` for the complete backward tracing technique).*

### Phase 3: Understand (Root Cause)

Use the "5 Whys" methodology to find the actual root, not the symptom. Form a specific hypothesis.

```markdown
## Root Cause Analysis
1. Why did this happen? [First observation]
2. Why did THAT happen? [Deeper reason]
3. Why did THAT happen? [Root cause found]

**Hypthesis:** "I think [root cause] is the issue because [evidence]."
```

### Phase 4: Implement & Verify

Fix the root cause and ensure it does not break anything else. Make the **smallest** possible change to test the hypothesis.

```markdown
## Phase 4 Checklist
- [ ] One single variable changed at a time
- [ ] Bug is permanently resolved
- [ ] No regression introduced
- [ ] **If fix fails 3 times, triggger Architectural Review!**
```

---

## ⚠️ The 3-Strike Rule (Questioning Architecture)

If your proposed fix fails 3 times in a row, **STOP.**
Do NOT attempt a 4th fix.

Count your attempts. If ≥ 3, this is indicative of an underlying **architectural problem** (e.g., tight coupling, shared state), not a simple bug. 
- Ask the user to reconsider the architectural pattern. 
- Discuss refactoring vs treating symptoms.

---

## Common Debugging Commands

Use these exact commands when you need quick insight:

```bash
# Check recent changes
git log --oneline -20
git diff HEAD~5

# Search for pattern across codebase
grep -r "errorPattern" --include="*.ts"

# Monitor live logs for errors
pm2 logs app-name --err --lines 100
```

---

## 🚫 Anti-Patterns

❌ **"Maybe if I change this..."** - Random guessing.
❌ **"I'll write test after fixing"** - Untested fixes do not stick.
❌ **"Multiple fixes at once"** - You can't isolate what worked.
❌ **"Let me just add one more patch"** - Violating the 3-Strike Rule.
❌ **"Quick fix for now"** - First fix establishes the pattern. Do it right.
