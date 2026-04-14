---
name: brainstorming
description: "You MUST use this before any creative work - creating features, components, or modifying behavior. Explores user intent, requirements and design through Socratic questioning before implementation."
allowed-tools: Read, Glob, Grep
---

# Brainstorming & Design Specification Protocol

> **MANDATORY:** Use for complex/vague requests, new features, and updates. Do NOT invoke any implementation skill or write any code until you have presented a design and the user has approved it. This applies to EVERY project regardless of perceived simplicity.

---

## 🛑 SOCRATIC GATE (ENFORCEMENT)

Before asking detailed questions or performing visual work, you **must** pass through the Socratic Gate.

### When to Trigger

| Pattern | Action |
|---------|--------|
| "Build/Create/Make [thing]" without details | 🛑 ASK 3 questions |
| Complex feature or architecture | 🛑 Clarify before implementing |
| Update/change request | 🛑 Confirm scope |
| Vague requirements | 🛑 Ask purpose, users, constraints |

### 🚫 MANDATORY Check: 3 Questions Before Implementation
1. **STOP** - Do NOT start coding
2. **ASK** - Minimum 3 questions if not inherently provided:
   - 🎯 Purpose: What problem are you solving?
   - 👥 Users: Who will use this?
   - 📦 Scope: Must-have vs nice-to-have?
3. **WAIT** - Get response before proceeding

---

## 🎯 The Brainstorming Process Flow

You MUST complete these steps logically in order:

1. **Explore project context** — check files, docs, recent commits
2. **Offer visual companion** (if topic will involve visual questions)
3. **Ask dynamic clarifying questions** — one at a time, revealing consequences.
4. **Propose 2-3 approaches** — with trade-offs and your recommendation.
5. **Present design sections** — scale exactly to complexity, get approval!
6. **Write design doc** — save to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` and commit.
7. **Spec self-review** — check for placeholders/ambiguity.
8. **User reviews written spec** — wait for user approval.
9. **Transition to implementation** — invoke `writing-plans` skill.

---

## 🧠 Dynamic Questioning Generation

**⛔ NEVER use static templates.** Each question you ask MUST connect to an architectural decision and eliminate an implementation path.

```markdown
### [PRIORITY] **[DECISION POINT]**

**Question:** [Clear question]

**Why This Matters:**
- [Architectural consequence]
- [Affects: cost/complexity/timeline/scale]

**Options:**
| Option | Pros | Cons | Best For |
|--------|------|------|----------|
| A | [+] | [-] | [Use case] |

**If Not Specified:** [Default + rationale]
```

*Ask questions one at a time.* Don't overwhelm the user. Focus on understanding purpose and boundaries.

---

## 🎨 Visual Companion (Optional Browser Mode)

A browser-based companion is available as a tool for showing mockups, diagrams, and layout options. 

**Offering the companion:** If upcoming questions will involve visual layouts, architecture maps, or mockups, offer it BEFORE questioning:
> "Some of what we're working on might be easier to explain visually. I can put together mockups and diagrams as we go in a web browser. Want to try it? (Requires opening a local URL)"

*This offer MUST be its own isolated message.* If they accept, read `skills/brainstorming/visual-companion.md` and use the browser for layout decisions, keeping terminal for conceptual/text questions.

---

## 🏗️ Presenting the Design & Spec Documentation

Once you understand what you're building:
1. **Present the Design**: Break the system into smaller, isolated units. For each unit define: what it does, how to use it, and dependencies.
2. **Write the Document**: Write the validated spec to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`. 
3. **Self-Review**: Look for "TBD"s, "TODO"s, or contradictory requirements. Fix them inline!
4. **User Review Gate**: Ask the user: 
> "Spec written and committed to `<path>`. Please review it and let me know if you want to make any changes before we start writing out the implementation plan."

**The terminal state of Brainstorming is invoking the `writing-plans` skill.** Do NOT invoke frontend-design, mcp-builder, or any implementation skill yet.

---

## 📊 Progress Reporting & Communication Principles

Transparency builds trust. Follow the standard status board format during your iterations.

### Status Board Format
| Agent | Status | Current Task | Progress |
|-------|--------|--------------|----------|
| [Agent Name] | ✅🔄⏳❌⚠️ | [Task description] | [% or count] |

### Error Reporting Pattern
1. Acknowledge the error.
2. Explain what happened clearly.
3. Offer specific solutions with trade-offs.
4. Ask user to choose or provide alternative.

### Core Principles
- **Concise:** No unnecessary details.
- **Visual:** Use emojis (✅🔄⏳❌) for quick scanning.
- **Proactive:** Suggest the next step clearly.
- **Flexible:** Willing to go back to the drawing board if a design element isn't right.

---
