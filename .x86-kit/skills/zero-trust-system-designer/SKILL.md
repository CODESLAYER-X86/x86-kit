---
name: zero-trust-system-designer
description: >
  Design and document Zero Trust security architecture for small businesses, clubs,
  NGOs, and hobby/side projects hosted on free or low-cost platforms (Vercel, Neon,
  Railway, Supabase, Cloudflare, PlanetScale, etc.). Use this skill whenever the
  user mentions: designing a system, setting up auth, protecting an API, securing a
  database, structuring roles/permissions, building a multi-tenant app, or phrases
  like "zero trust", "least privilege", "who can access what", "secure my app",
  "role-based access", "auth architecture", "API security", or "how should I
  structure my project security". Also trigger when the user describes a specific
  org type (business, club, school group, nonprofit, startup, side project) and
  wants to build something on Vercel, Neon, Supabase, Railway, or similar free-tier
  stacks. Always use this skill proactively — if the user is designing any kind of
  web app with users, roles, or data, this skill almost certainly applies.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Zero Trust System Designer — Small Org & Free-Tier Stack Edition

> "Never trust, always verify." Access is granted per-request, per-resource, per-role — never by network location.

## 📋 Reference Files

| File | When to Read |
|------|-------------|
| `references/platform-configs.md` | Detailed Vercel/Neon/Clerk/Supabase setup per tier |
| `references/auth-patterns.md` | Code snippets: middleware, RLS, JWT, RBAC helpers |
| `references/security-checklist.md` | Pre-launch and post-launch security checklist |

Read the relevant reference file(s) **before** generating implementation artifacts.

---

## What This Skill Does

Guides the AI to produce a **complete, opinionated Zero Trust architecture** tailored to:
- **Org types**: small business, club, NGO, school group, sports team, side project, startup MVP
- **Hosting**: Vercel (frontend + serverless API), Neon / Supabase / PlanetScale (DB), Cloudflare (DNS/edge), Railway / Render (backend services)
- **Budget**: $0–$30/month free-tier constraint

---

## Step 1 — Intake Interview

Before designing anything, gather this information. Ask only what isn't already clear from context:

```
1. Org type? (business / club / NGO / side-project / other)
2. What does the app do in one sentence?
3. Who are the user types? (e.g., admin, member, guest, staff, moderator)
4. What sensitive data exists? (payments, PII, medical, financial, none)
5. Stack preference? (Next.js / plain React / SvelteKit / other)
6. Auth preference? (Clerk / NextAuth / Supabase Auth / custom JWT / unsure)
7. Database? (Neon / Supabase / PlanetScale / SQLite / unsure)
8. Any existing code or is this greenfield?
```

If the user seems non-technical, simplify: ask about "who uses it" and "what's private" — skip stack questions and recommend defaults.

---

## Step 2 — Architecture Selection

Based on intake, select one of three tiers:

### Tier A — Micro (side project, personal tool, <50 users)
- Auth: Clerk free tier OR NextAuth with JWT
- DB: Neon free tier (PostgreSQL)
- Hosting: Vercel hobby
- Zero Trust scope: API route protection + row-level DB policy
- See: `references/platform-configs.md#tier-a`

### Tier B — Small Org (club, small business, NGO, 50–500 users)
- Auth: Clerk + organizations, OR Supabase Auth with RLS
- DB: Neon + connection pooling (PgBouncer), OR Supabase
- Hosting: Vercel pro (or hobby + edge functions)
- Zero Trust scope: Full RBAC + API middleware + DB row-level security + audit log
- See: `references/platform-configs.md#tier-b`

### Tier C — Multi-Tenant / Multi-Branch (franchise, chapter-based org, 500+ users)
- Auth: Clerk Organizations OR Auth0 free tier
- DB: Neon with tenant-scoped schemas OR Supabase multi-project
- Hosting: Vercel + Cloudflare proxy
- Zero Trust scope: Tenant isolation + RBAC + signed tokens + webhook verification
- See: `references/platform-configs.md#tier-c`

---

## Step 3 — Produce the Architecture Document

Generate a structured document with these sections:

### 3.1 System Overview
- One-paragraph description
- Architecture diagram (Mermaid preferred)
- Data flow narrative (user → edge → API → DB)

### 3.2 Identity & Authentication Layer
- Who authenticates (users, services, webhooks)
- Auth provider setup with free-tier limits noted
- Token strategy (JWT vs session, expiry, refresh)
- MFA recommendation (required for admin roles)
- See `references/auth-patterns.md` for provider-specific snippets

### 3.3 Authorization Layer (Zero Trust Core)
Define the permission matrix:

```
Role        | Resource          | Action     | Condition
------------|-------------------|------------|------------------
admin       | all               | CRUD       | org_id match
member      | own_data          | read/write | user_id match
guest       | public_data       | read       | none
webhook_svc | event_table       | insert     | HMAC verified
```

Map this to:
- **API**: middleware checks (see `references/auth-patterns.md#middleware`)
- **DB**: Row Level Security policies (see `references/auth-patterns.md#rls`)
- **Frontend**: conditional rendering (never trust client-side gating alone)

### 3.4 Network & Edge Layer
- Vercel Edge Config / Middleware for route protection
- Cloudflare rules (if applicable): rate limiting, bot protection, geo-block
- CORS policy: explicit allowlist only, never `*` for authenticated routes
- Environment variable handling: never expose secrets to client bundle
- Content Security Policy headers

### 3.5 Data Layer Security
- Neon / Supabase connection: pooled, SSL required, connection string in env var only
- Row Level Security (RLS) policies — always on, even in dev
- Principle of least privilege for DB roles:
  - `app_user` role: SELECT/INSERT/UPDATE on own rows only
  - `service_role` (server-side only): broader access, never in browser
- Backup strategy (free-tier options)

### 3.6 Secrets & Configuration Management
- What goes in `.env.local` vs Vercel environment variables vs secrets manager
- Never commit secrets; `.gitignore` checklist
- API key rotation plan
- Vercel Preview vs Production environment separation

### 3.7 Audit & Observability
- What to log: auth events, permission denials, data mutations
- Free options: Vercel logs, Neon query stats, Axiom free tier, Logtail
- Incident response runbook (simplified 3-step version for small orgs)

### 3.8 Threat Model (simplified)
For each org tier, call out the top 5 realistic threats:
- Unauthorized data access (wrong role)
- Leaked API keys / env vars
- Session hijacking
- Insecure direct object reference (IDOR)
- Supply chain / dependency attack

For each threat: **likelihood** (L/M/H), **mitigation already covered**, **gaps remaining**.

---

## Step 4 — Produce Implementation Artifacts

After the document, offer to generate any of the following:

- [ ] **Middleware snippet** — Next.js `middleware.ts` with JWT/Clerk auth guard
- [ ] **RLS SQL policies** — Neon/Supabase PostgreSQL policies for the permission matrix
- [ ] **RBAC helper** — TypeScript `hasPermission(user, action, resource)` utility
- [ ] **Environment variable template** — `.env.example` with documentation
- [ ] **CSP headers config** — `next.config.js` or `vercel.json` security headers
- [ ] **Audit log schema** — SQL table for logging auth events
- [ ] **README security section** — Markdown block for the project README

Ask the user which artifacts they want before generating.

---

## Step 5 — Free-Tier Constraint Review

Always end with a **Free Tier Sustainability Check**:

| Service    | Free Limit           | Risk if exceeded     | Mitigation              |
|------------|----------------------|----------------------|-------------------------|
| Vercel     | 100GB bandwidth/mo   | Throttled            | CDN caching, lazy load  |
| Neon       | 0.5GB storage, 1 CPU | Compute paused       | Connection pool, indexes |
| Clerk      | 10k MAU              | Billing starts       | Guest checkout fallback  |
| Supabase   | 500MB DB, 2GB egress | Project paused       | Supabase branching       |

---

## Output Format Rules

- **Always** produce a Mermaid diagram for the architecture overview
- **Always** include a copy-paste-ready permission matrix table
- **Always** note free-tier limits inline where relevant
- **Never** recommend paid services without a free-tier alternative
- **Never** suggest `disable RLS` as a shortcut
- Use code blocks with language tags for all code snippets
- Keep the full document under 800 lines; link to reference files for deep dives
