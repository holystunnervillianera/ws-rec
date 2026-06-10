# Agent Deployment Tasks - Railway Configuration & Integration Setup

## Project Details
- **Railway Project ID:** 0fb346c2-b580-4b6b-bf54-5267fc265039
- **GitHub Repo:** godsentaigod/expert-disco
- **Status:** Deployed to Railway, awaiting configuration

---

## TASK 1: Operations Agent - Configure Railway Environment Variables

**Objective:** Add all environment variables to Railway project

**Variables to Configure:**
```
DATABASE_URL=mysql://2E4sbJaQBNvkfVU.root:C2L0CZRV807YhOgwiQt8@gateway02.us-east-1.prod.aws.tidbcloud.com:4000/k34vdRSuTTg6LH2qk6Hd2c?ssl={"rejectUnauthorized":true}
JWT_SECRET=CfaZ3XfEK3EugSnv6obpd4
VITE_APP_ID=k34vdRSuTTg6LH2qk6Hd2c
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im
OWNER_OPEN_ID=aARmmq48cGFBRYbjCmVXcL
OWNER_NAME=K Williamson
BUILT_IN_FORGE_API_URL=https://forge.manus.ai
BUILT_IN_FORGE_API_KEY=oTyaxgsJa4xV3UxFkVfH5K
VITE_FRONTEND_FORGE_API_KEY=PK3a3yPpNYV2qGbftsVhBh
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.ai
STRIPE_SECRET_KEY=[VERIFY IN RAILWAY]
VITE_STRIPE_PUBLIC_KEY=[VERIFY IN RAILWAY]
VITE_ANALYTICS_ENDPOINT=https://manus-analytics.com
VITE_ANALYTICS_WEBSITE_ID=31e6cead-ab40-45d0-8222-e0f9dde33d08
VITE_APP_TITLE=The Reality Architech
VITE_APP_LOGO=https://files.manuscdn.com/user_upload_by_module/web_dev_logo/310519663311308236/ytYmGIIJBNeDGXWL.png
NODE_ENV=production
```

**Steps:**
1. Go to: https://railway.app/project/0fb346c2-b580-4b6b-bf54-5267fc265039
2. Click "Variables" tab
3. Add each variable above
4. Click "Deploy" to apply
5. Report completion status

**Success Criteria:** All 20 variables added and deployment triggered

---

## TASK 2: Platform Architect - Build Proton Email Forwarding Integration

**Objective:** Set up email forwarding from Proton account to agents

**Requirements:**
1. Create Proton account (or use existing)
2. Set up email forwarding rules to agent inbox
3. Build integration module in platform:
   - Agents can query forwarded emails
   - Emails appear in Command Center
   - Agents can use email for account verification
   - Support for multiple social platform verification emails

**Implementation:**
- Create `server/integrations/proton-email.ts`
- Add tRPC procedure: `email.getForwardedMessages()`
- Add email parsing for verification codes
- Store verification codes in database for agent access

**Success Criteria:** 
- Agents can access forwarded emails via Command Center
- Verification codes automatically extracted
- Integration tested with at least one account creation

---

## TASK 3: Platform Architect - Build SMS Phone Forwarding Integration

**Objective:** Set up SMS forwarding from phone number to agents

**Requirements:**
1. Configure phone number forwarding service (Twilio, etc.)
2. Build integration module in platform:
   - Agents receive SMS messages instantly
   - SMS appears in Command Center
   - Agents can use SMS for verification codes
   - Support for multiple verification services

**Implementation:**
- Create `server/integrations/sms-forwarding.ts`
- Add tRPC procedure: `sms.getForwardedMessages()`
- Add SMS parsing for verification codes
- Store SMS messages in database for agent access
- Build UI component for SMS inbox in Command Center

**Success Criteria:**
- Agents can access forwarded SMS via Command Center
- Verification codes automatically extracted
- Integration tested with at least one account creation

---

## TASK 4: Management Agent - Verify All Systems

**Objective:** Test all integrations and confirm deployment is live

**Verification Checklist:**
- [ ] Railway variables all configured
- [ ] Application deployed and accessible
- [ ] Homepage loads correctly
- [ ] Products display with pricing
- [ ] Stripe integration functional
- [ ] Proton email forwarding working
- [ ] SMS forwarding working
- [ ] All agents can access email/SMS in Command Center
- [ ] Database connected and operational
- [ ] Command Center responsive

**Report:** Provide status report on all items above

---

## TASK 5: Advanced Coder - Test Agent Account Creation

**Objective:** Test if agents can create social media accounts using email/SMS integrations

**Test Scenarios:**
1. Agent creates Twitter account using forwarded email
2. Agent creates LinkedIn account using forwarded email
3. Agent creates Reddit account using forwarded SMS
4. Agent creates ProductHunt account using forwarded email
5. Agent creates Indie Hackers account using forwarded email

**Success Criteria:** At least 3 social accounts successfully created by agents

---

## Timeline
- **Phase 1 (Now):** Operations Agent configures Railway variables
- **Phase 2 (Parallel):** Platform Architect builds email/SMS integrations
- **Phase 3 (After Phase 1):** Management Agent verifies all systems
- **Phase 4 (After Phase 2):** Advanced Coder tests account creation
- **Phase 5 (After All):** Launch 24-hour sales blitz

---

## Notes
- All agents work independently and report status
- Management Agent coordinates overall progress
- Report any blockers immediately
- Test thoroughly before marking complete
- This is a real test of agent capabilities - perform at highest standard
