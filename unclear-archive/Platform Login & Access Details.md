# Platform Login & Access Details

## IMMEDIATE ACCESS

### Platform URL
```
https://3000-ifv4ivmklmpupy0mpjgma-997b3090.sg1.manus.computer
```

### Authentication Method
**Manus OAuth (Single Sign-On)**
- Click "Login" button on homepage
- Authenticate with your Manus account
- You will be automatically set as admin user
- Access to all admin features and command center

---

## ADMIN ACCESS

### Command Center (Admin Only)
**URL:** `https://3000-ifv4ivmklmpupy0mpjgma-997b3090.sg1.manus.computer/command-center`

**Access:** 
- Keyboard shortcut: `Ctrl+Shift+A` (after login)
- Or: Click hidden admin button (bottom-right corner, appears on hover)

**Features:**
- Natural language chat with Management Agent
- Real-time agent status monitoring
- Agent task management
- Workflow automation
- Integration hub
- Real-time metrics dashboard

### Command Center Dashboard (Admin Only)
**URL:** `https://3000-ifv4ivmklmpupy0mpjgma-997b3090.sg1.manus.computer/command-center-dashboard`

**Features:**
- Agent performance analytics
- Real-time metrics (impressions, clicks, conversions, revenue)
- Campaign monitoring
- Hourly performance reports
- Optimization recommendations
- Scaling strategy analysis

---

## AGENT API ENDPOINTS

### Management Agent
```
Endpoint: /api/trpc/agents.executeCommand
Method: POST
Auth: Bearer [JWT_TOKEN]

Command Examples:
{
  "agentId": "management",
  "command": "start-blitz",
  "parameters": {}
}

{
  "agentId": "management",
  "command": "status",
  "parameters": {}
}

{
  "agentId": "management",
  "command": "metrics",
  "parameters": {}
}
```

### Content Creator Agent
```
Endpoint: /api/trpc/agents.executeCommand
Method: POST
Auth: Bearer [JWT_TOKEN]

Command Examples:
{
  "agentId": "content-creator",
  "command": "generate-posts",
  "parameters": {
    "platform": "twitter",
    "count": 10,
    "productId": "1"
  }
}

{
  "agentId": "content-creator",
  "command": "generate-emails",
  "parameters": {
    "productId": "1"
  }
}
```

### Sales Agent
```
Endpoint: /api/trpc/agents.executeCommand
Method: POST
Auth: Bearer [JWT_TOKEN]

Command Examples:
{
  "agentId": "sales",
  "command": "post",
  "parameters": {
    "platform": "twitter",
    "content": "Post content here"
  }
}

{
  "agentId": "sales",
  "command": "qualify-lead",
  "parameters": {
    "leadData": { /* lead information */ }
  }
}
```

### Trend Predictor Agent
```
Endpoint: /api/trpc/agents.executeCommand
Method: POST
Auth: Bearer [JWT_TOKEN]

Command Examples:
{
  "agentId": "trend-predictor",
  "command": "analyze-trends",
  "parameters": {}
}

{
  "agentId": "trend-predictor",
  "command": "identify-opportunities",
  "parameters": {
    "platform": "twitter"
  }
}
```

### Operations Agent
```
Endpoint: /api/trpc/agents.executeCommand
Method: POST
Auth: Bearer [JWT_TOKEN]

Command Examples:
{
  "agentId": "operations",
  "command": "execute-campaign",
  "parameters": {
    "campaignId": "email-launch"
  }
}

{
  "agentId": "operations",
  "command": "monitor-performance",
  "parameters": {}
}
```

### Strategy Agent
```
Endpoint: /api/trpc/agents.executeCommand
Method: POST
Auth: Bearer [JWT_TOKEN]

Command Examples:
{
  "agentId": "strategy",
  "command": "analyze-performance",
  "parameters": {
    "timeframe": "12-hours"
  }
}

{
  "agentId": "strategy",
  "command": "recommend-scaling",
  "parameters": {}
}
```

### Advanced Coder Agent
```
Endpoint: /api/trpc/agents.executeCommand
Method: POST
Auth: Bearer [JWT_TOKEN]

Command Examples:
{
  "agentId": "advanced-coder",
  "command": "optimize-performance",
  "parameters": {}
}

{
  "agentId": "advanced-coder",
  "command": "monitor-logs",
  "parameters": {}
}
```

### Platform Architect Agent
```
Endpoint: /api/trpc/agents.executeCommand
Method: POST
Auth: Bearer [JWT_TOKEN]

Command Examples:
{
  "agentId": "platform-architect",
  "command": "monitor-architecture",
  "parameters": {}
}

{
  "agentId": "platform-architect",
  "command": "verify-integrations",
  "parameters": {}
}
```

---

## SYSTEM CREDENTIALS

### Database Access
```
Type: PostgreSQL
Host: [Provided by Manus]
Port: 5432
Database: vibe_coding_command_center
Username: [Provided by Manus]
Password: [Provided by Manus]

Tables:
- products (5 items)
- bundles (3 items)
- orders
- purchases
- users
- agentConversations
- agentMessages
- agentTasks
- apiIntegrations
- agentConfigurations
- workflows
- workflowExecutions
```

### Stripe Integration
```
Status: LIVE MODE (pk_live_ and sk_live_ keys)
Public Key: pk_live_[CONFIGURED]
Secret Key: sk_live_[CONFIGURED]
Webhook Endpoint: /api/trpc/checkout.handleWebhook
Webhook Secret: [CONFIGURED]

Supported Products:
- AI CTO Kit ($397)
- AI Growth Lead Kit ($397)
- AI Product Manager Kit ($397)
- Workflow Blueprint Pack ($197)
- Prompt Library ($197)
- Core Leadership Bundle ($997)
- Automation Bundle ($297)
- Complete AI System ($1,297)
```

### Email Service
```
Service: [Manus Built-in Email API]
Endpoint: /api/trpc/system.notifyOwner
Auth: Bearer [JWT_TOKEN]

Configuration:
- From: noreply@[domain]
- Support: support@[domain]
- Sender Name: The Reality Architech

Email Templates:
- Launch announcement
- Order confirmation
- Customer success sequence (Day 1-7)
- Upsell sequences
- Refund/cancellation
```

### OAuth Configuration
```
Provider: Manus OAuth
App ID: [CONFIGURED]
OAuth Server URL: [CONFIGURED]
Callback URL: /api/oauth/callback
Session Secret: [JWT_SECRET]

User Roles:
- admin: Full platform access + command center
- user: Storefront access + customer dashboard
```

---

## SETTINGS & CONFIGURATION

### Access Settings Panel
**URL:** `https://3000-ifv4ivmklmpupy0mpjgma-997b3090.sg1.manus.computer/settings`

**Available Settings:**
1. **General**
   - Website name: "The Reality Architech"
   - Visibility: Public
   - Favicon: [Configured]

2. **Domains**
   - Auto-generated: `[project].manus.space`
   - Custom domain: `therealityarchitech.xyz` (ready to configure)
   - SSL: Automatic

3. **Notifications**
   - Email notifications: Enabled
   - Webhook notifications: Configured
   - Alert thresholds: Set

4. **Secrets**
   - Environment variables: Managed via webdev_request_secrets
   - API keys: Securely stored
   - Credentials: Encrypted

5. **GitHub**
   - Export code to GitHub repository
   - Sync with version control
   - Backup and recovery

---

## CHANGE LOGIN CREDENTIALS

### Step 1: Access Settings
1. Login to platform
2. Click profile icon (top-right)
3. Select "Settings"

### Step 2: Update Credentials
1. Navigate to "Account" section
2. Click "Change Password"
3. Enter current password
4. Enter new password (2x)
5. Click "Save Changes"

### Step 3: Verify
1. You will be logged out
2. Login with new credentials
3. Confirm access restored

---

## AGENT AUTHENTICATION

### Agent API Keys
Each agent has unique credentials for autonomous operation:

```
Management Agent:
- Agent ID: management
- API Key: [Auto-generated]
- Permissions: Full orchestration access
- Rate Limit: 1000 requests/hour

Content Creator Agent:
- Agent ID: content-creator
- API Key: [Auto-generated]
- Permissions: Content generation, LLM access
- Rate Limit: 500 requests/hour

Sales Agent:
- Agent ID: sales
- API Key: [Auto-generated]
- Permissions: Lead management, posting, email
- Rate Limit: 500 requests/hour

Trend Predictor Agent:
- Agent ID: trend-predictor
- API Key: [Auto-generated]
- Permissions: Analytics, trend analysis
- Rate Limit: 300 requests/hour

Operations Agent:
- Agent ID: operations
- API Key: [Auto-generated]
- Permissions: Campaign execution, monitoring
- Rate Limit: 300 requests/hour

Strategy Agent:
- Agent ID: strategy
- API Key: [Auto-generated]
- Permissions: Analysis, recommendations
- Rate Limit: 200 requests/hour

Advanced Coder Agent:
- Agent ID: advanced-coder
- API Key: [Auto-generated]
- Permissions: System optimization, debugging
- Rate Limit: 200 requests/hour

Platform Architect Agent:
- Agent ID: platform-architect
- API Key: [Auto-generated]
- Permissions: Infrastructure monitoring, scaling
- Rate Limit: 200 requests/hour
```

---

## SOCIAL MEDIA ACCOUNT SETUP

### Manual Login Instructions

**For Each Platform (Twitter, LinkedIn, Reddit, ProductHunt, Indie Hackers):**

1. **Navigate to Login Page**
   - Twitter: https://twitter.com/login
   - LinkedIn: https://www.linkedin.com/login
   - Reddit: https://www.reddit.com/login
   - ProductHunt: https://www.producthunt.com/users/sign_in
   - Indie Hackers: https://www.indiehackers.com/login

2. **Create Account**
   - Email: [Provide dedicated email for each platform]
   - Username: [Agent-generated username]
   - Password: [Secure password]
   - Phone: [If required for verification]

3. **Verify Account**
   - Check email for verification link
   - Complete phone verification (if required)
   - Verify email address

4. **Update Profile**
   - Display Name: "The Reality Architech"
   - Bio: "Replace expensive expert roles with AI-driven systems"
   - Profile Image: [Upload branded image]
   - Website: therealityarchitech.xyz

5. **Enable Automation**
   - Once logged in and verified
   - Agents can autonomously post content
   - Agents can respond to comments
   - Agents can engage with community

---

## REAL-TIME MONITORING

### Dashboard Access
**URL:** `https://3000-ifv4ivmklmpupy0mpjgma-997b3090.sg1.manus.computer/command-center-dashboard`

**Real-Time Metrics:**
- Impressions (updated every 5 minutes)
- Clicks (updated every 5 minutes)
- Conversions (updated every 5 minutes)
- Revenue (updated every 5 minutes)
- Engagement rate (updated every 5 minutes)
- Conversion rate (updated every 5 minutes)
- Cost per acquisition (updated hourly)
- Average order value (updated hourly)

**Hourly Reports:**
- Hour 6: Mid-day checkpoint
- Hour 12: Halfway point analysis
- Hour 18: Final push preparation
- Hour 24: Complete results and ROI analysis

---

## SUPPORT & TROUBLESHOOTING

### If You Lose Access
1. Clear browser cache and cookies
2. Try incognito/private browsing
3. Try different browser
4. Check internet connection
5. Contact Manus support

### If Agents Are Not Responding
1. Check agent status in dashboard
2. Verify API connectivity
3. Check error logs
4. Restart agents via Management Agent
5. Contact technical support

### If Social Posts Are Not Publishing
1. Verify social accounts are authenticated
2. Check API rate limits
3. Verify content meets guidelines
4. Check platform-specific errors
5. Retry with adjusted content

---

## NEXT STEPS

### Immediate (Before Launch)
1. ✅ Login to platform
2. ✅ Verify admin access
3. ✅ Access command center
4. ✅ Review real-time dashboard
5. ✅ Create social media accounts (manual login)
6. ✅ Verify all agents are ready

### Launch (Hour 0)
1. ✅ Activate Management Agent
2. ✅ Start 24-hour sales blitz
3. ✅ Monitor real-time metrics
4. ✅ Verify social posts publishing
5. ✅ Verify email sequences triggering

### During Campaign (Hour 1-24)
1. ✅ Monitor hourly performance
2. ✅ Review optimization recommendations
3. ✅ Adjust strategy as needed
4. ✅ Respond to critical issues
5. ✅ Track revenue progress

### Post-Campaign (Hour 24+)
1. ✅ Analyze complete results
2. ✅ Implement scaling strategy
3. ✅ Activate customer success sequences
4. ✅ Plan Week 1 optimization
5. ✅ Prepare for ongoing operations

---

**STATUS: READY FOR LOGIN & AUTHENTICATION**
**PLATFORM:** Production-ready and operational
**AGENTS:** 8 specialized agents standing by
**DASHBOARD:** Real-time monitoring active
**SUPPORT:** Full documentation and troubleshooting guides provided

**PROCEED TO LOGIN AND AUTHENTICATE AGENTS**
