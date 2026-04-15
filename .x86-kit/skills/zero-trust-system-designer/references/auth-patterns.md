# Auth Patterns — Code Snippets

## Middleware (Next.js) {#middleware}

### Clerk Auth Guard
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### NextAuth JWT Guard
```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      // Admin-only routes
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "admin";
      }
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/api/protected/:path*"],
};
```

---

## Row Level Security (RLS) {#rls}

### Basic User Isolation
```sql
-- Enable RLS (do this BEFORE inserting any data)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Users can only read their own rows
CREATE POLICY "users_own_rows" ON posts
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

### Org-Scoped (Multi-Tenant)
```sql
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Members can read resources in their org
CREATE POLICY "org_members_read" ON resources
  FOR SELECT
  USING (org_id = (SELECT org_id FROM memberships WHERE user_id = auth.uid()));

-- Admins can write
CREATE POLICY "org_admins_write" ON resources
  FOR INSERT UPDATE DELETE
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE user_id = auth.uid()
        AND org_id = resources.org_id
        AND role = 'admin'
    )
  );
```

### Webhook Service Role
```sql
-- Service role bypasses RLS (use only server-side with service key)
-- Never pass SUPABASE_SERVICE_KEY to the browser

-- For webhooks: use a specific DB role
CREATE ROLE webhook_service;
GRANT INSERT ON event_log TO webhook_service;

-- Verify webhook HMAC before inserting
-- (Handle in API route, not DB policy)
```

---

## RBAC Helper {#rbac}

```typescript
// lib/permissions.ts

type Role = "admin" | "member" | "guest" | "moderator";
type Action = "create" | "read" | "update" | "delete";
type Resource = "posts" | "members" | "settings" | "reports" | "all";

const PERMISSION_MATRIX: Record<Role, Partial<Record<Resource, Action[]>>> = {
  admin: {
    all: ["create", "read", "update", "delete"],
  },
  moderator: {
    posts: ["read", "update", "delete"],
    members: ["read"],
    reports: ["read", "update"],
  },
  member: {
    posts: ["create", "read", "update"], // own posts only — enforce in query
    members: ["read"],
  },
  guest: {
    posts: ["read"],
  },
};

export function hasPermission(
  role: Role,
  action: Action,
  resource: Resource
): boolean {
  const perms = PERMISSION_MATRIX[role];
  if (!perms) return false;

  // Admin wildcard
  if (perms.all?.includes(action)) return true;

  return perms[resource]?.includes(action) ?? false;
}

// Usage in API route:
// const { role } = await getCurrentUser();
// if (!hasPermission(role, "delete", "posts")) {
//   return new Response("Forbidden", { status: 403 });
// }
```

---

## JWT Strategy

```typescript
// lib/auth.ts — NextAuth configuration
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.orgId = user.orgId;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.role = token.role as string;
        session.user.orgId = token.orgId as string;
      }
      return session;
    },
  },
};
```

---

## Webhook HMAC Verification

```typescript
// app/api/webhooks/route.ts
import { headers } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("x-webhook-signature") ?? "";
  const secret = process.env.WEBHOOK_SECRET!;

  const expected = createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  const isValid = timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(`sha256=${expected}`)
  );

  if (!isValid) {
    return new Response("Invalid signature", { status: 401 });
  }

  // Process webhook...
  return Response.json({ received: true });
}
```

---

## CSP Headers

```typescript
// next.config.js
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' blob: data: https:",
      "font-src 'self'",
      "connect-src 'self' https://api.clerk.com https://*.neon.tech",
      "frame-ancestors 'none'",
    ].join("; "),
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

module.exports = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};
```
