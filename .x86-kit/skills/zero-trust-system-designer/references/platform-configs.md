# Platform Configurations by Tier

## Tier A — Micro (<50 users) {#tier-a}

### Vercel (Hobby)
- Free limits: 100GB bandwidth/mo, 100 serverless functions, 6000 min build/mo
- Environment variables: Set per-environment (dev/preview/prod)
- Edge Middleware: Supported on free tier

```bash
# .env.local (never commit)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
NEXTAUTH_SECRET="your-32-char-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Neon (Free Tier)
- Limits: 0.5GB storage, 1 shared CPU, auto-suspend after 5min idle
- Connection: Always use pooled endpoint for serverless

```
# Pooled (use for serverless API routes)
postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/dbname?pgbouncer=true&connection_limit=1

# Direct (use for migrations only)
postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname
```

### Clerk (Free Tier)
- Limits: 10,000 MAU, unlimited orgs on development
- Setup: Add `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

---

## Tier B — Small Org (50–500 users) {#tier-b}

### Vercel + Edge Functions
- Use `middleware.ts` at root for auth guard on all `/api/*` and `/dashboard/*` routes
- Enable Vercel Analytics (free) for performance monitoring

```typescript
// middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up", "/api/webhooks(.*)"],
  ignoredRoutes: ["/api/public(.*)"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### Neon + PgBouncer (Connection Pooling)
- Enable Neon's built-in pooler (PgBouncer mode)
- Set `connection_limit=1` in connection string for serverless
- Use `?sslmode=require` always

### Supabase Auth + RLS (Alternative)
- Free: 500MB DB, 2GB egress, 50,000 MAU
- Enable RLS on ALL tables before any data is inserted

```sql
-- Always enable RLS first
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- Never leave tables without at least one policy
CREATE POLICY "deny_all_by_default" ON your_table
  FOR ALL USING (false);
```

---

## Tier C — Multi-Tenant (500+ users) {#tier-c}

### Clerk Organizations
- Free: Unlimited orgs in development; production billing based on MAU
- Use `auth().orgId` for tenant isolation in every API route

```typescript
import { auth } from "@clerk/nextjs";

export async function GET() {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return new Response("Unauthorized", { status: 401 });

  // Always scope queries to orgId
  const data = await db.query(
    "SELECT * FROM resources WHERE org_id = $1",
    [orgId]
  );
  return Response.json(data);
}
```

### Neon Tenant-Scoped Schemas
- Create one schema per tenant for strong isolation
- Use `search_path` to scope queries

```sql
-- Per-tenant schema creation
CREATE SCHEMA tenant_abc123;
CREATE TABLE tenant_abc123.members (...);

-- Set search path in connection
SET search_path TO tenant_abc123, public;
```

### Cloudflare (Free Plan)
- Rate limiting: 10 rules on free plan (use wisely)
- Bot protection: Managed challenge on login/signup routes
- Cache rules: Never cache authenticated responses (`Cache-Control: private, no-store`)

```
# Cloudflare Page Rule (free: 3 rules)
/api/auth/*  → Cache Level: Bypass
/dashboard/* → Cache Level: Bypass
/*           → Cache Level: Standard
```
