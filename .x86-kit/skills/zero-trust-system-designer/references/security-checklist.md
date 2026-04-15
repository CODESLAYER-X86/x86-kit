# Security Checklist — Zero Trust

## Pre-Launch Checklist

### Authentication
- [ ] All routes require auth unless explicitly public
- [ ] Admin routes have role check beyond just `isAuthenticated`
- [ ] JWT expiry set (max 24h for access tokens, 7d for refresh)
- [ ] MFA enabled for admin accounts
- [ ] Sign-out invalidates server-side session/token

### Authorization
- [ ] Permission matrix documented and implemented
- [ ] Server-side role checks on every mutation (not just UI)
- [ ] No client-trust: never read `role` from req.body or query params
- [ ] IDOR protected: all DB queries scoped to `user_id` or `org_id`

### Database
- [ ] RLS enabled on ALL tables (no exceptions)
- [ ] `service_role` key never in client bundle
- [ ] DB connection uses SSL (`sslmode=require`)
- [ ] Pooled endpoint used for serverless functions
- [ ] No raw SQL with user input (use parameterized queries / ORM)

### Secrets & Config
- [ ] `.env.local` in `.gitignore`
- [ ] No secrets in client-side env vars (`NEXT_PUBLIC_*`)
- [ ] Vercel env vars set per-environment (dev ≠ prod)
- [ ] API keys rotated if ever exposed in git history
- [ ] `npm audit` shows 0 critical/high vulnerabilities

### Network & Headers
- [ ] CSP headers configured and tested
- [ ] CORS allows only known origins for API routes
- [ ] `X-Frame-Options: DENY` set
- [ ] HTTPS enforced (Vercel does this automatically)
- [ ] Rate limiting on auth endpoints (Clerk handles, or custom middleware)

### Webhooks
- [ ] HMAC signature verified before processing
- [ ] Timing-safe comparison used (`timingSafeEqual`)
- [ ] Webhook endpoint not publicly listed

### Observability
- [ ] Auth failures logged (with user ID, IP, timestamp)
- [ ] Permission denials logged
- [ ] No PII in logs (mask emails, credit cards)
- [ ] Alert configured for repeated auth failures

---

## Post-Launch Checklist (Monthly)

- [ ] Review Vercel logs for unexpected 401/403 spikes
- [ ] `npm audit` — check for new vulnerabilities
- [ ] Review active sessions — any anomalies?
- [ ] Check Neon query stats — any unexpected patterns?
- [ ] Rotate any API keys older than 90 days
- [ ] Review RLS policies — any changes needed for new features?

---

## Incident Response Runbook (3-Step for Small Orgs)

### Step 1 — Contain
1. Identify affected account/org
2. Force sign-out all sessions: `clerk.users.revokeSession()` or NextAuth session invalidation
3. If DB breach suspected: rotate `DATABASE_URL` in Vercel env vars immediately

### Step 2 — Investigate
1. Export Vercel logs for the incident window
2. Check Neon query history for unusual patterns
3. Review Clerk/auth provider event logs
4. Identify: what data was accessed? by whom? when?

### Step 3 — Remediate
1. Patch the vulnerability
2. Notify affected users (required by GDPR/CCPA if PII exposed)
3. Document the incident (what happened, timeline, fix)
4. Update threat model with new finding
5. Add test case to prevent regression
