# SNS Chat by AnantaSutra — Low Level Design (LLD)

**Product**: SNS Chat
**Company**: AnantaSutra
**Hosted at**: sns.chat.anantasutra.com
**Document Type**: Low Level Design
**Version**: 1.0
**Date**: 2026-03-30

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (JWT) |
| Realtime | Supabase Realtime |
| File Storage | Supabase Storage |
| Payments | Razorpay |
| Messaging API | Meta WhatsApp Cloud API |
| Hosting | Vercel |
| Email | Nodemailer |
| Styling | Tailwind CSS |

---

## Table of Contents

1. Complete Database Schema
2. API Route Design
3. TypeScript Interface Definitions
4. Core Service Classes
5. Frontend Page and Component Architecture
6. Meta Webhook Implementation
7. Razorpay Billing Implementation
8. Security Implementation
9. Deployment and Environment Configuration
10. Development Phases and Sprint Plan

---

## 1. Complete Database Schema

### 1.1 tenants

The root entity. Every resource in the system belongs to a tenant (workspace).

```sql
CREATE TABLE tenants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  logo_url        TEXT,
  plan_id         TEXT NOT NULL DEFAULT 'starter',
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
  owner_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tenants_owner_id ON tenants(owner_id);
CREATE INDEX idx_tenants_slug ON tenants(slug);

-- RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_select_own" ON tenants
  FOR SELECT USING (
    id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "tenant_update_owner" ON tenants
  FOR UPDATE USING (owner_id = auth.uid());
```

### 1.2 tenant_members

Maps auth users to tenants with a role.

```sql
CREATE TYPE tenant_role AS ENUM ('owner', 'admin', 'agent', 'viewer');

CREATE TABLE tenant_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        tenant_role NOT NULL DEFAULT 'agent',
  invited_by  UUID REFERENCES auth.users(id),
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, user_id)
);

CREATE INDEX idx_tenant_members_user_id ON tenant_members(user_id);
CREATE INDEX idx_tenant_members_tenant_id ON tenant_members(tenant_id);

ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members_select_own_tenant" ON tenant_members
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "members_insert_admin" ON tenant_members
  FOR INSERT WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "members_delete_admin" ON tenant_members
  FOR DELETE USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );
```

### 1.3 whatsapp_accounts

Stores Meta WhatsApp Business Account credentials per tenant. Sensitive fields are stored encrypted.

```sql
CREATE TABLE whatsapp_accounts (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id               UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  display_name            TEXT NOT NULL,
  phone_number_id         TEXT NOT NULL,
  whatsapp_business_id    TEXT NOT NULL,
  access_token_encrypted  TEXT NOT NULL,
  verify_token            TEXT NOT NULL,
  webhook_secret          TEXT,
  is_active               BOOLEAN NOT NULL DEFAULT false,
  quality_rating          TEXT DEFAULT 'GREEN' CHECK (quality_rating IN ('GREEN', 'YELLOW', 'RED')),
  verified_at             TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id)
);

CREATE INDEX idx_wa_accounts_tenant_id ON whatsapp_accounts(tenant_id);
CREATE INDEX idx_wa_accounts_phone_number_id ON whatsapp_accounts(phone_number_id);

ALTER TABLE whatsapp_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wa_accounts_tenant_select" ON whatsapp_accounts
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "wa_accounts_tenant_modify" ON whatsapp_accounts
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );
```

### 1.4 contacts

WhatsApp contacts belonging to a tenant.

```sql
CREATE TABLE contacts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  phone_number    TEXT NOT NULL,
  name            TEXT,
  email           TEXT,
  avatar_url      TEXT,
  metadata        JSONB DEFAULT '{}',
  opted_in        BOOLEAN NOT NULL DEFAULT true,
  opted_in_at     TIMESTAMPTZ,
  opted_out_at    TIMESTAMPTZ,
  last_seen_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, phone_number)
);

CREATE INDEX idx_contacts_tenant_id ON contacts(tenant_id);
CREATE INDEX idx_contacts_phone_number ON contacts(phone_number);
CREATE INDEX idx_contacts_opted_in ON contacts(tenant_id, opted_in);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contacts_tenant_access" ON contacts
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
    )
  );
```

### 1.5 contact_tags

Tags for organizing contacts.

```sql
CREATE TABLE contact_tags (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  contact_id  UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  tag         TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, contact_id, tag)
);

CREATE INDEX idx_contact_tags_contact_id ON contact_tags(contact_id);
CREATE INDEX idx_contact_tags_tenant_tag ON contact_tags(tenant_id, tag);

ALTER TABLE contact_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_tags_tenant_access" ON contact_tags
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
    )
  );
```

### 1.6 conversations

A conversation thread between the tenant's WhatsApp number and a contact.

```sql
CREATE TYPE conversation_status AS ENUM ('open', 'resolved', 'snoozed');

CREATE TABLE conversations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  contact_id          UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  whatsapp_account_id UUID NOT NULL REFERENCES whatsapp_accounts(id),
  status              conversation_status NOT NULL DEFAULT 'open',
  assigned_to         UUID REFERENCES auth.users(id),
  last_message_at     TIMESTAMPTZ,
  unread_count        INTEGER NOT NULL DEFAULT 0,
  meta_conversation_id TEXT,
  snoozed_until       TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, contact_id, whatsapp_account_id)
);

CREATE INDEX idx_conversations_tenant_id ON conversations(tenant_id);
CREATE INDEX idx_conversations_contact_id ON conversations(contact_id);
CREATE INDEX idx_conversations_status ON conversations(tenant_id, status);
CREATE INDEX idx_conversations_last_message_at ON conversations(tenant_id, last_message_at DESC);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "conversations_tenant_access" ON conversations
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
    )
  );
```

### 1.7 messages

Individual messages within a conversation.

```sql
CREATE TYPE message_direction AS ENUM ('inbound', 'outbound');
CREATE TYPE message_status AS ENUM ('pending', 'sent', 'delivered', 'read', 'failed');
CREATE TYPE message_type AS ENUM ('text', 'image', 'audio', 'video', 'document', 'template', 'interactive', 'sticker', 'location', 'contacts', 'reaction', 'unsupported');

CREATE TABLE messages (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  conversation_id     UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  contact_id          UUID NOT NULL REFERENCES contacts(id),
  whatsapp_message_id TEXT,
  direction           message_direction NOT NULL,
  type                message_type NOT NULL DEFAULT 'text',
  status              message_status NOT NULL DEFAULT 'pending',
  body                TEXT,
  media_url           TEXT,
  media_mime_type     TEXT,
  media_caption       TEXT,
  template_name       TEXT,
  template_params     JSONB,
  interactive_payload JSONB,
  error_code          TEXT,
  error_message       TEXT,
  sent_at             TIMESTAMPTZ,
  delivered_at        TIMESTAMPTZ,
  read_at             TIMESTAMPTZ,
  failed_at           TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_tenant_id ON messages(tenant_id);
CREATE INDEX idx_messages_whatsapp_message_id ON messages(whatsapp_message_id);
CREATE INDEX idx_messages_created_at ON messages(conversation_id, created_at DESC);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_tenant_access" ON messages
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
    )
  );
```

### 1.8 message_templates

WhatsApp approved message templates.

```sql
CREATE TYPE template_status AS ENUM ('pending', 'approved', 'rejected', 'paused');
CREATE TYPE template_category AS ENUM ('AUTHENTICATION', 'MARKETING', 'UTILITY');

CREATE TABLE message_templates (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  whatsapp_account_id UUID NOT NULL REFERENCES whatsapp_accounts(id),
  name                TEXT NOT NULL,
  language            TEXT NOT NULL DEFAULT 'en_US',
  category            template_category NOT NULL,
  status              template_status NOT NULL DEFAULT 'pending',
  components          JSONB NOT NULL DEFAULT '[]',
  meta_template_id    TEXT,
  rejection_reason    TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, name, language)
);

CREATE INDEX idx_templates_tenant_id ON message_templates(tenant_id);
CREATE INDEX idx_templates_status ON message_templates(tenant_id, status);

ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "templates_tenant_access" ON message_templates
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
    )
  );
```

### 1.9 campaigns

Broadcast message campaigns targeting a segment of contacts.

```sql
CREATE TYPE campaign_status AS ENUM ('draft', 'scheduled', 'running', 'paused', 'completed', 'failed');

CREATE TABLE campaigns (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  whatsapp_account_id UUID NOT NULL REFERENCES whatsapp_accounts(id),
  name                TEXT NOT NULL,
  description         TEXT,
  template_id         UUID REFERENCES message_templates(id),
  template_params     JSONB DEFAULT '{}',
  status              campaign_status NOT NULL DEFAULT 'draft',
  scheduled_at        TIMESTAMPTZ,
  started_at          TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  total_contacts      INTEGER NOT NULL DEFAULT 0,
  sent_count          INTEGER NOT NULL DEFAULT 0,
  delivered_count     INTEGER NOT NULL DEFAULT 0,
  read_count          INTEGER NOT NULL DEFAULT 0,
  failed_count        INTEGER NOT NULL DEFAULT 0,
  created_by          UUID NOT NULL REFERENCES auth.users(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_campaigns_tenant_id ON campaigns(tenant_id);
CREATE INDEX idx_campaigns_status ON campaigns(tenant_id, status);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaigns_tenant_access" ON campaigns
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
    )
  );
```

### 1.10 campaign_contacts

Many-to-many between campaigns and contacts.

```sql
CREATE TABLE campaign_contacts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id     UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id      UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  message_id      UUID REFERENCES messages(id),
  status          message_status NOT NULL DEFAULT 'pending',
  sent_at         TIMESTAMPTZ,
  UNIQUE (campaign_id, contact_id)
);

CREATE INDEX idx_campaign_contacts_campaign_id ON campaign_contacts(campaign_id);
CREATE INDEX idx_campaign_contacts_contact_id ON campaign_contacts(contact_id);
CREATE INDEX idx_campaign_contacts_status ON campaign_contacts(campaign_id, status);

ALTER TABLE campaign_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaign_contacts_tenant_access" ON campaign_contacts
  FOR ALL USING (
    campaign_id IN (
      SELECT id FROM campaigns WHERE tenant_id IN (
        SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
      )
    )
  );
```

### 1.11 automations

Automation rules that trigger actions based on events.

```sql
CREATE TYPE automation_trigger AS ENUM (
  'message_received',
  'keyword_match',
  'contact_created',
  'opt_in',
  'campaign_sent',
  'schedule_cron'
);

CREATE TABLE automations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  trigger_type    automation_trigger NOT NULL,
  trigger_config  JSONB NOT NULL DEFAULT '{}',
  is_active       BOOLEAN NOT NULL DEFAULT false,
  run_count       INTEGER NOT NULL DEFAULT 0,
  last_run_at     TIMESTAMPTZ,
  created_by      UUID NOT NULL REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_automations_tenant_id ON automations(tenant_id);
CREATE INDEX idx_automations_trigger_type ON automations(trigger_type, is_active);

ALTER TABLE automations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "automations_tenant_access" ON automations
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
    )
  );
```

### 1.12 automation_steps

Ordered steps within an automation.

```sql
CREATE TYPE step_type AS ENUM (
  'send_template',
  'send_text',
  'add_tag',
  'remove_tag',
  'assign_agent',
  'wait_duration',
  'condition',
  'webhook_call',
  'update_contact'
);

CREATE TABLE automation_steps (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id   UUID NOT NULL REFERENCES automations(id) ON DELETE CASCADE,
  step_order      INTEGER NOT NULL,
  step_type       step_type NOT NULL,
  config          JSONB NOT NULL DEFAULT '{}',
  next_step_id    UUID REFERENCES automation_steps(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (automation_id, step_order)
);

CREATE INDEX idx_automation_steps_automation_id ON automation_steps(automation_id);

ALTER TABLE automation_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "automation_steps_tenant_access" ON automation_steps
  FOR ALL USING (
    automation_id IN (
      SELECT id FROM automations WHERE tenant_id IN (
        SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
      )
    )
  );
```

### 1.13 subscriptions

Razorpay subscription records per tenant.

```sql
CREATE TYPE subscription_status AS ENUM (
  'created', 'authenticated', 'active', 'pending', 'halted', 'cancelled', 'completed', 'expired'
);

CREATE TABLE subscriptions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id               UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  razorpay_subscription_id TEXT NOT NULL UNIQUE,
  razorpay_plan_id        TEXT NOT NULL,
  plan_name               TEXT NOT NULL,
  status                  subscription_status NOT NULL DEFAULT 'created',
  current_start           TIMESTAMPTZ,
  current_end             TIMESTAMPTZ,
  charge_at               TIMESTAMPTZ,
  message_limit           INTEGER NOT NULL DEFAULT 1000,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscriptions_tenant_id ON subscriptions(tenant_id);
CREATE INDEX idx_subscriptions_razorpay_id ON subscriptions(razorpay_subscription_id);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_tenant_access" ON subscriptions
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
    )
  );
```

### 1.14 usage_logs

Tracks monthly message usage per tenant.

```sql
CREATE TABLE usage_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  year_month      TEXT NOT NULL,
  messages_sent   INTEGER NOT NULL DEFAULT 0,
  messages_limit  INTEGER NOT NULL DEFAULT 1000,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, year_month)
);

CREATE INDEX idx_usage_logs_tenant_id ON usage_logs(tenant_id);
CREATE INDEX idx_usage_logs_year_month ON usage_logs(tenant_id, year_month);

ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usage_logs_tenant_access" ON usage_logs
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
    )
  );
```

### 1.15 webhook_events

Raw webhook payloads stored for auditing and replay.

```sql
CREATE TABLE webhook_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID REFERENCES tenants(id),
  source          TEXT NOT NULL CHECK (source IN ('meta', 'razorpay')),
  event_type      TEXT NOT NULL,
  payload         JSONB NOT NULL,
  processed       BOOLEAN NOT NULL DEFAULT false,
  processed_at    TIMESTAMPTZ,
  error           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_webhook_events_tenant_id ON webhook_events(tenant_id);
CREATE INDEX idx_webhook_events_processed ON webhook_events(processed, created_at);
CREATE INDEX idx_webhook_events_source ON webhook_events(source, event_type);

ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "webhook_events_tenant_access" ON webhook_events
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
    )
  );
```

### 1.16 api_keys

Tenant-issued API keys for external integrations.

```sql
CREATE TABLE api_keys (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  key_hash        TEXT NOT NULL UNIQUE,
  key_prefix      TEXT NOT NULL,
  last_used_at    TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_by      UUID NOT NULL REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_api_keys_tenant_id ON api_keys(tenant_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "api_keys_tenant_access" ON api_keys
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );
```

### 1.17 audit_logs

Security and compliance audit trail.

```sql
CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID REFERENCES tenants(id),
  user_id     UUID REFERENCES auth.users(id),
  action      TEXT NOT NULL,
  resource    TEXT NOT NULL,
  resource_id TEXT,
  ip_address  INET,
  user_agent  TEXT,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id, created_at DESC);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource, resource_id);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs_admin_access" ON audit_logs
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );
```

---

## 2. API Route Design (Next.js App Router)

All API routes live under `app/api/`. Every protected route validates the session JWT and resolves the tenant context before execution.

### 2.1 Auth Routes

#### POST /api/auth/register

Creates a Supabase auth user and a tenant in one transaction.

**Request Body**
```json
{
  "email": "founder@company.com",
  "password": "SecurePass123!",
  "full_name": "Rahul Sharma",
  "company_name": "Acme Corp"
}
```

**Response 200**
```json
{
  "user_id": "uuid",
  "tenant_id": "uuid",
  "tenant_slug": "acme-corp"
}
```

**Error Cases**
- 400: Invalid email/password format
- 409: Email already registered
- 500: Database transaction failure

#### POST /api/auth/login

Delegates to Supabase Auth signInWithPassword.

**Request Body**
```json
{ "email": "founder@company.com", "password": "SecurePass123!" }
```

**Response 200**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "...",
  "tenant_id": "uuid",
  "role": "owner"
}
```

#### POST /api/auth/logout

Invalidates the current session.

**Auth Required**: Yes
**Response**: 204 No Content

---

### 2.2 Onboarding Routes

#### POST /api/onboarding/meta-connect

Receives the short-lived code from Meta Embedded Signup, exchanges it for a long-lived access token, fetches the WhatsApp Business Account details, and stores them encrypted.

**Request Body**
```json
{
  "code": "meta_embedded_signup_code",
  "redirect_uri": "https://sns.chat.anantasutra.com/settings/whatsapp/callback"
}
```

**Response 200**
```json
{
  "whatsapp_account_id": "uuid",
  "phone_number_id": "string",
  "display_name": "string",
  "is_active": true
}
```

**Error Cases**
- 400: Missing or invalid code
- 422: Meta token exchange failed
- 409: Account already connected to another tenant

#### GET /api/onboarding/verify-account

Pings Meta Graph API to confirm the account is live and returns current quality rating.

**Auth Required**: Yes
**Response 200**
```json
{
  "verified": true,
  "quality_rating": "GREEN",
  "phone_number": "+919876543210"
}
```

---

### 2.3 WhatsApp Messaging Routes

#### POST /api/whatsapp/send

Sends an outbound message (template or session) to a contact.

**Auth Required**: Yes (agent or above)

**Request Body**
```json
{
  "to": "+919876543210",
  "type": "template",
  "template_name": "order_confirmation",
  "language_code": "en_US",
  "components": [
    { "type": "body", "parameters": [{ "type": "text", "text": "ORD-12345" }] }
  ]
}
```

**Response 200**
```json
{
  "message_id": "uuid",
  "whatsapp_message_id": "wamid.xxx",
  "status": "sent"
}
```

**Error Cases**
- 402: Monthly quota exceeded
- 422: Template not found or not approved
- 503: Meta API unavailable

#### GET /api/whatsapp/webhook (Meta Verification)

Meta calls this endpoint with a GET request to verify the webhook. The handler compares `hub.verify_token` against the tenant's stored verify token and echoes back `hub.challenge`.

**Query Params**: `hub.mode`, `hub.verify_token`, `hub.challenge`

#### POST /api/whatsapp/webhook (Incoming Messages)

Receives all incoming events from Meta: new messages, delivery receipts, read receipts, and status changes.

**No Auth Required** (Verified by X-Hub-Signature-256 HMAC)

**Meta Payload Shape**
```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "WABA_ID",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "statuses": [...],
            "messages": [...]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

#### GET /api/whatsapp/templates

Returns all templates for the tenant's WhatsApp account.

**Auth Required**: Yes
**Response**: Array of `MessageTemplate`

#### POST /api/whatsapp/templates/create

Submits a new template to Meta for approval.

**Request Body**
```json
{
  "name": "payment_reminder",
  "language": "en_US",
  "category": "UTILITY",
  "components": [
    { "type": "HEADER", "format": "TEXT", "text": "Payment Reminder" },
    { "type": "BODY", "text": "Hi {{1}}, your invoice of ₹{{2}} is due on {{3}}." },
    { "type": "FOOTER", "text": "Reply STOP to opt out" }
  ]
}
```

#### DELETE /api/whatsapp/templates/[id]

Deletes a template from Meta and removes from the local database.

---

### 2.4 Contact Routes

#### GET /api/contacts

Paginated contacts list with optional filters.

**Query Params**: `page`, `limit`, `search`, `tag`, `opted_in`
**Auth Required**: Yes

#### POST /api/contacts

Creates a single contact.

**Request Body**
```json
{
  "phone_number": "+919876543210",
  "name": "Priya Patel",
  "email": "priya@example.com",
  "tags": ["vip", "mumbai"]
}
```

#### POST /api/contacts/import

Accepts a CSV multipart/form-data upload. Parses, deduplicates, and bulk upserts contacts. Returns a job ID for progress polling.

**Request**: `multipart/form-data` with `file` field
**Response 202**
```json
{
  "import_job_id": "uuid",
  "total_rows": 250,
  "status": "processing"
}
```

#### DELETE /api/contacts/[id]

Soft-deletes a contact and marks them as opted out.

#### PATCH /api/contacts/[id]

Updates contact fields or tags.

---

### 2.5 Campaign Routes

#### GET /api/campaigns

Returns all campaigns for the tenant with summary stats.

#### POST /api/campaigns/create

Creates a draft campaign.

**Request Body**
```json
{
  "name": "Diwali Sale 2026",
  "template_id": "uuid",
  "template_params": { "sale_percentage": "30" },
  "contact_ids": ["uuid1", "uuid2"],
  "tag_filter": ["vip"],
  "scheduled_at": "2026-10-20T09:00:00Z"
}
```

#### POST /api/campaigns/[id]/launch

Transitions a draft campaign to `running` status. Checks quota first. Enqueues a Vercel Cron or Edge Function to process the batch.

**Response 200**
```json
{
  "campaign_id": "uuid",
  "status": "running",
  "estimated_completion_minutes": 12
}
```

#### GET /api/campaigns/[id]/stats

Returns live delivery metrics for a campaign.

```json
{
  "total": 500,
  "sent": 480,
  "delivered": 460,
  "read": 210,
  "failed": 20,
  "delivery_rate": 95.8,
  "read_rate": 43.75
}
```

---

### 2.6 Automation Routes

#### GET /api/automations

Returns all automations for the tenant.

#### POST /api/automations/create

Creates an automation with its steps.

**Request Body**
```json
{
  "name": "Welcome Message",
  "trigger_type": "contact_created",
  "trigger_config": {},
  "steps": [
    { "step_order": 1, "step_type": "wait_duration", "config": { "seconds": 30 } },
    { "step_order": 2, "step_type": "send_template", "config": { "template_id": "uuid" } }
  ]
}
```

#### PATCH /api/automations/[id]

Updates an automation or toggles active status.

#### DELETE /api/automations/[id]

Deletes an automation and all its steps.

---

### 2.7 Billing Routes

#### POST /api/billing/create-subscription

Creates a Razorpay subscription for the tenant.

**Request Body**
```json
{ "plan_id": "growth" }
```

**Response 200**
```json
{
  "razorpay_subscription_id": "sub_xxx",
  "short_url": "https://rzp.io/...",
  "plan_name": "Growth",
  "message_limit": 5000
}
```

#### POST /api/billing/webhook

Receives Razorpay subscription events. Validates HMAC signature before processing.

**No Auth Required** (verified by Razorpay signature header)

#### GET /api/billing/usage

Returns current month usage for the tenant.

```json
{
  "messages_sent": 1240,
  "messages_limit": 5000,
  "percentage_used": 24.8,
  "year_month": "2026-03",
  "days_remaining": 1
}
```

#### POST /api/billing/cancel

Cancels the active Razorpay subscription at period end.

---

### 2.8 Admin Routes (Super Admin Only)

#### GET /api/admin/tenants

Returns all tenants with plan and usage data. Protected by a super-admin claim in the JWT.

**Query Params**: `page`, `limit`, `status`, `plan`

#### GET /api/admin/metrics

Returns platform-wide metrics.

```json
{
  "total_tenants": 120,
  "active_tenants_30d": 85,
  "total_messages_this_month": 420000,
  "mrr_inr": 124975,
  "top_tenants_by_usage": [...]
}
```

---

## 3. TypeScript Interface Definitions

```typescript
// ============================================================
// Tenant
// ============================================================

export type TenantRole = 'owner' | 'admin' | 'agent' | 'viewer';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  plan_id: string;
  status: 'active' | 'suspended' | 'cancelled';
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface TenantMember {
  id: string;
  tenant_id: string;
  user_id: string;
  role: TenantRole;
  invited_by: string | null;
  joined_at: string;
}

// ============================================================
// WhatsApp Account
// ============================================================

export interface WhatsAppCredentials {
  access_token: string;
  phone_number_id: string;
  whatsapp_business_id: string;
}

export interface WhatsAppAccount {
  id: string;
  tenant_id: string;
  display_name: string;
  phone_number_id: string;
  whatsapp_business_id: string;
  access_token_encrypted: string;
  verify_token: string;
  webhook_secret: string | null;
  is_active: boolean;
  quality_rating: 'GREEN' | 'YELLOW' | 'RED';
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Contact
// ============================================================

export interface Contact {
  id: string;
  tenant_id: string;
  phone_number: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  metadata: Record<string, unknown>;
  opted_in: boolean;
  opted_in_at: string | null;
  opted_out_at: string | null;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactTag {
  id: string;
  tenant_id: string;
  contact_id: string;
  tag: string;
  created_at: string;
}

// ============================================================
// Conversation & Message
// ============================================================

export type ConversationStatus = 'open' | 'resolved' | 'snoozed';
export type MessageDirection = 'inbound' | 'outbound';
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
export type MessageType =
  | 'text' | 'image' | 'audio' | 'video' | 'document'
  | 'template' | 'interactive' | 'sticker' | 'location'
  | 'contacts' | 'reaction' | 'unsupported';

export interface Conversation {
  id: string;
  tenant_id: string;
  contact_id: string;
  whatsapp_account_id: string;
  status: ConversationStatus;
  assigned_to: string | null;
  last_message_at: string | null;
  unread_count: number;
  meta_conversation_id: string | null;
  snoozed_until: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  contact?: Contact;
}

export interface Message {
  id: string;
  tenant_id: string;
  conversation_id: string;
  contact_id: string;
  whatsapp_message_id: string | null;
  direction: MessageDirection;
  type: MessageType;
  status: MessageStatus;
  body: string | null;
  media_url: string | null;
  media_mime_type: string | null;
  media_caption: string | null;
  template_name: string | null;
  template_params: Record<string, unknown> | null;
  interactive_payload: Record<string, unknown> | null;
  error_code: string | null;
  error_message: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  read_at: string | null;
  failed_at: string | null;
  created_at: string;
}

// ============================================================
// Message Template
// ============================================================

export type TemplateStatus = 'pending' | 'approved' | 'rejected' | 'paused';
export type TemplateCategory = 'AUTHENTICATION' | 'MARKETING' | 'UTILITY';
export type TemplateComponentType = 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';

export interface TemplateComponent {
  type: TemplateComponentType;
  format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  text?: string;
  buttons?: Array<{
    type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
    text: string;
    url?: string;
    phone_number?: string;
  }>;
  example?: {
    header_text?: string[];
    body_text?: string[][];
  };
}

export interface MessageTemplate {
  id: string;
  tenant_id: string;
  whatsapp_account_id: string;
  name: string;
  language: string;
  category: TemplateCategory;
  status: TemplateStatus;
  components: TemplateComponent[];
  meta_template_id: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Campaign
// ============================================================

export type CampaignStatus =
  | 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'failed';

export interface Campaign {
  id: string;
  tenant_id: string;
  whatsapp_account_id: string;
  name: string;
  description: string | null;
  template_id: string | null;
  template_params: Record<string, string>;
  status: CampaignStatus;
  scheduled_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  total_contacts: number;
  sent_count: number;
  delivered_count: number;
  read_count: number;
  failed_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Automation
// ============================================================

export type AutomationTriggerType =
  | 'message_received'
  | 'keyword_match'
  | 'contact_created'
  | 'opt_in'
  | 'campaign_sent'
  | 'schedule_cron';

export type AutomationStepType =
  | 'send_template'
  | 'send_text'
  | 'add_tag'
  | 'remove_tag'
  | 'assign_agent'
  | 'wait_duration'
  | 'condition'
  | 'webhook_call'
  | 'update_contact';

export interface AutomationTrigger {
  type: AutomationTriggerType;
  config: {
    keywords?: string[];
    cron_expression?: string;
    tag?: string;
  };
}

export interface AutomationStep {
  id: string;
  automation_id: string;
  step_order: number;
  step_type: AutomationStepType;
  config: Record<string, unknown>;
  next_step_id: string | null;
  created_at: string;
}

export interface Automation {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  trigger_type: AutomationTriggerType;
  trigger_config: Record<string, unknown>;
  is_active: boolean;
  run_count: number;
  last_run_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  steps?: AutomationStep[];
}

// ============================================================
// Billing
// ============================================================

export type SubscriptionStatus =
  | 'created' | 'authenticated' | 'active' | 'pending'
  | 'halted' | 'cancelled' | 'completed' | 'expired';

export interface Plan {
  id: 'starter' | 'growth' | 'scale';
  name: string;
  price_inr: number;
  message_limit: number;
  razorpay_plan_id: string;
  features: string[];
}

export interface Subscription {
  id: string;
  tenant_id: string;
  razorpay_subscription_id: string;
  razorpay_plan_id: string;
  plan_name: string;
  status: SubscriptionStatus;
  current_start: string | null;
  current_end: string | null;
  charge_at: string | null;
  message_limit: number;
  created_at: string;
  updated_at: string;
}

export interface UsageLog {
  id: string;
  tenant_id: string;
  year_month: string;
  messages_sent: number;
  messages_limit: number;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Meta Webhook Event
// ============================================================

export interface MetaWebhookEntry {
  id: string;
  changes: Array<{
    value: MetaWebhookValue;
    field: string;
  }>;
}

export interface MetaWebhookValue {
  messaging_product: 'whatsapp';
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
  contacts?: Array<{
    profile: { name: string };
    wa_id: string;
  }>;
  messages?: MetaIncomingMessage[];
  statuses?: MetaMessageStatus[];
  errors?: MetaError[];
}

export interface MetaIncomingMessage {
  id: string;
  from: string;
  timestamp: string;
  type: MessageType;
  text?: { body: string };
  image?: { id: string; mime_type: string; sha256: string; caption?: string };
  audio?: { id: string; mime_type: string };
  video?: { id: string; mime_type: string; caption?: string };
  document?: { id: string; mime_type: string; filename?: string; caption?: string };
  button?: { payload: string; text: string };
  interactive?: {
    type: 'button_reply' | 'list_reply';
    button_reply?: { id: string; title: string };
    list_reply?: { id: string; title: string; description?: string };
  };
  location?: { latitude: number; longitude: number; name?: string; address?: string };
  sticker?: { id: string; mime_type: string; animated: boolean };
  reaction?: { message_id: string; emoji: string };
}

export interface MetaMessageStatus {
  id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  recipient_id: string;
  errors?: MetaError[];
}

export interface MetaError {
  code: number;
  title: string;
  message: string;
  error_data?: { details: string };
}

export interface MetaWebhookPayload {
  object: 'whatsapp_business_account';
  entry: MetaWebhookEntry[];
}
```

---

## 4. Core Service Classes

### 4.1 WhatsAppService

```typescript
// src/services/whatsapp.service.ts

import { createClient } from '@supabase/supabase-js';
import { CredentialManager } from './credential-manager.service';

export class WhatsAppService {

  private static META_API_BASE = 'https://graph.facebook.com/v19.0';

  /**
   * Send a template message to a WhatsApp number.
   * Checks quota, posts to Meta Graph API, stores the message record.
   */
  static async sendTemplateMessage(
    tenantId: string,
    to: string,
    templateName: string,
    languageCode: string,
    components: TemplateComponent[],
  ): Promise<Message> {
    // 1. Verify quota has not been exceeded
    const allowed = await BillingService.checkQuota(tenantId);
    if (!allowed) throw new QuotaExceededError();

    // 2. Fetch and decrypt credentials
    const account = await this.getActiveAccount(tenantId);
    const token = await CredentialManager.decryptToken(account.access_token_encrypted);

    // 3. Resolve or create contact + conversation
    const contact = await this.resolveContact(tenantId, to);
    const conversation = await this.resolveConversation(tenantId, contact.id, account.id);

    // 4. POST to Meta
    const metaResponse = await fetch(
      `${this.META_API_BASE}/${account.phone_number_id}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'template',
          template: { name: templateName, language: { code: languageCode }, components },
        }),
      }
    );

    if (!metaResponse.ok) {
      const err = await metaResponse.json();
      // Store failed message then throw
      await this.storeMessage(tenantId, conversation.id, contact.id, {
        direction: 'outbound',
        type: 'template',
        status: 'failed',
        template_name: templateName,
        error_code: String(err.error?.code),
        error_message: err.error?.message,
      });
      throw new MetaApiError(err.error?.message);
    }

    const data = await metaResponse.json();

    // 5. Store message record
    const message = await this.storeMessage(tenantId, conversation.id, contact.id, {
      direction: 'outbound',
      type: 'template',
      status: 'sent',
      whatsapp_message_id: data.messages[0].id,
      template_name: templateName,
      sent_at: new Date().toISOString(),
    });

    // 6. Increment usage
    await BillingService.incrementUsage(tenantId, 1);

    return message;
  }

  /**
   * Send a free-form session message (only valid within 24-hour window).
   */
  static async sendSessionMessage(
    tenantId: string,
    to: string,
    text: string,
  ): Promise<Message> {
    const allowed = await BillingService.checkQuota(tenantId);
    if (!allowed) throw new QuotaExceededError();

    const account = await this.getActiveAccount(tenantId);
    const token = await CredentialManager.decryptToken(account.access_token_encrypted);
    const contact = await this.resolveContact(tenantId, to);
    const conversation = await this.resolveConversation(tenantId, contact.id, account.id);

    const metaResponse = await fetch(
      `${this.META_API_BASE}/${account.phone_number_id}/messages`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: text },
        }),
      }
    );

    const data = await metaResponse.json();

    const message = await this.storeMessage(tenantId, conversation.id, contact.id, {
      direction: 'outbound',
      type: 'text',
      status: 'sent',
      body: text,
      whatsapp_message_id: data.messages[0].id,
      sent_at: new Date().toISOString(),
    });

    await BillingService.incrementUsage(tenantId, 1);
    return message;
  }

  /**
   * Process an incoming webhook message from Meta.
   * Resolves contact and conversation, stores the message,
   * triggers automation evaluation, broadcasts via Supabase Realtime.
   */
  static async handleIncomingMessage(
    phoneNumberId: string,
    incomingMsg: MetaIncomingMessage,
    senderProfile: { name: string },
  ): Promise<void> {
    // 1. Find the tenant by phone_number_id
    const account = await this.getAccountByPhoneNumberId(phoneNumberId);
    if (!account) return; // Unknown number, ignore

    const tenantId = account.tenant_id;

    // 2. Upsert contact
    const contact = await this.upsertContact(tenantId, incomingMsg.from, senderProfile.name);

    // 3. Upsert conversation (or increment unread)
    const conversation = await this.upsertConversation(tenantId, contact.id, account.id);

    // 4. Store message
    await this.storeInboundMessage(tenantId, conversation.id, contact.id, incomingMsg);

    // 5. Update conversation last_message_at and unread_count
    await this.touchConversation(conversation.id);

    // 6. Update contact last_seen_at
    await this.touchContact(contact.id);

    // 7. Evaluate automation triggers
    await AutomationEngine.evaluateTriggers({
      type: 'message_received',
      tenantId,
      contactId: contact.id,
      conversationId: conversation.id,
      message: incomingMsg,
    });
  }

  /**
   * Sync delivery status updates from Meta webhooks.
   */
  static async syncDeliveryStatus(status: MetaMessageStatus): Promise<void> {
    if (!status.id) return;

    const updateFields: Partial<Message> = { status: status.status };

    if (status.status === 'delivered') updateFields.delivered_at = new Date(Number(status.timestamp) * 1000).toISOString();
    if (status.status === 'read') updateFields.read_at = new Date(Number(status.timestamp) * 1000).toISOString();
    if (status.status === 'failed') {
      updateFields.failed_at = new Date(Number(status.timestamp) * 1000).toISOString();
      updateFields.error_code = String(status.errors?.[0]?.code);
      updateFields.error_message = status.errors?.[0]?.message;
    }

    // Update by whatsapp_message_id (indexed)
    await supabase
      .from('messages')
      .update(updateFields)
      .eq('whatsapp_message_id', status.id);

    // Update campaign_contacts if this is a campaign message
    await this.updateCampaignContactStatus(status.id, status.status);
  }
}
```

### 4.2 BillingService

```typescript
// src/services/billing.service.ts

export const PLANS: Record<string, Plan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price_inr: 999,
    message_limit: 1000,
    razorpay_plan_id: process.env.RAZORPAY_PLAN_STARTER!,
    features: ['1 WhatsApp number', '1,000 messages/month', 'Basic inbox', 'Email support'],
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    price_inr: 2499,
    message_limit: 5000,
    razorpay_plan_id: process.env.RAZORPAY_PLAN_GROWTH!,
    features: ['1 WhatsApp number', '5,000 messages/month', 'Campaigns', 'Automations', 'Priority support'],
  },
  scale: {
    id: 'scale',
    name: 'Scale',
    price_inr: 4999,
    message_limit: 20000,
    razorpay_plan_id: process.env.RAZORPAY_PLAN_SCALE!,
    features: ['3 WhatsApp numbers', '20,000 messages/month', 'API access', 'Dedicated support', 'Custom automations'],
  },
};

export class BillingService {

  /**
   * Creates a Razorpay subscription. Stores the subscription record locally.
   */
  static async createSubscription(tenantId: string, planId: string): Promise<Subscription> {
    const plan = PLANS[planId];
    if (!plan) throw new InvalidPlanError();

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const rzpSub = await razorpay.subscriptions.create({
      plan_id: plan.razorpay_plan_id,
      total_count: 12,
      quantity: 1,
      customer_notify: 1,
    });

    const { data, error } = await supabase
      .from('subscriptions')
      .upsert({
        tenant_id: tenantId,
        razorpay_subscription_id: rzpSub.id,
        razorpay_plan_id: plan.razorpay_plan_id,
        plan_name: plan.name,
        status: 'created',
        message_limit: plan.message_limit,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Returns true if the tenant has messages remaining in the current billing period.
   */
  static async checkQuota(tenantId: string): Promise<boolean> {
    const yearMonth = new Date().toISOString().slice(0, 7);

    const { data } = await supabase
      .from('usage_logs')
      .select('messages_sent, messages_limit')
      .eq('tenant_id', tenantId)
      .eq('year_month', yearMonth)
      .single();

    if (!data) {
      // No usage record this month means quota not hit yet
      return true;
    }

    return data.messages_sent < data.messages_limit;
  }

  /**
   * Atomically increments the usage counter. Creates the record if it does not exist.
   */
  static async incrementUsage(tenantId: string, count: number): Promise<void> {
    const yearMonth = new Date().toISOString().slice(0, 7);

    // Upsert with increment using Supabase RPC
    await supabase.rpc('increment_usage', {
      p_tenant_id: tenantId,
      p_year_month: yearMonth,
      p_count: count,
    });
  }

  /**
   * Handles Razorpay webhook events.
   * Verifies HMAC signature, updates subscription status.
   */
  static async handleWebhook(
    rawBody: string,
    signature: string,
  ): Promise<void> {
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest('hex');

    if (expectedSig !== signature) {
      throw new InvalidSignatureError('Razorpay signature mismatch');
    }

    const event = JSON.parse(rawBody);
    const subscriptionId = event.payload?.subscription?.entity?.id;
    if (!subscriptionId) return;

    const statusMap: Record<string, SubscriptionStatus> = {
      'subscription.activated': 'active',
      'subscription.charged': 'active',
      'subscription.cancelled': 'cancelled',
      'subscription.halted': 'halted',
      'subscription.completed': 'completed',
    };

    const newStatus = statusMap[event.event];
    if (newStatus) {
      await supabase
        .from('subscriptions')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('razorpay_subscription_id', subscriptionId);
    }
  }
}
```

### 4.3 AutomationEngine

```typescript
// src/services/automation-engine.service.ts

interface AutomationEvent {
  type: AutomationTriggerType;
  tenantId: string;
  contactId: string;
  conversationId?: string;
  message?: MetaIncomingMessage;
  data?: Record<string, unknown>;
}

export class AutomationEngine {

  /**
   * Finds matching active automations for the event and executes them.
   */
  static async evaluateTriggers(event: AutomationEvent): Promise<void> {
    const { data: automations } = await supabase
      .from('automations')
      .select('*, automation_steps(*)')
      .eq('tenant_id', event.tenantId)
      .eq('trigger_type', event.type)
      .eq('is_active', true)
      .order('step_order', { referencedTable: 'automation_steps', ascending: true });

    if (!automations?.length) return;

    for (const automation of automations) {
      const matches = await this.matchesTrigger(automation, event);
      if (matches) {
        // Run asynchronously — do not block the webhook response
        this.executeAutomation(automation, event).catch(console.error);
      }
    }
  }

  private static async matchesTrigger(
    automation: Automation,
    event: AutomationEvent,
  ): Promise<boolean> {
    if (automation.trigger_type === 'keyword_match' && event.message?.text) {
      const keywords: string[] = automation.trigger_config.keywords ?? [];
      const body = event.message.text.body.toLowerCase();
      return keywords.some(kw => body.includes(kw.toLowerCase()));
    }
    // All other trigger types match by type alone
    return true;
  }

  private static async executeAutomation(
    automation: Automation,
    event: AutomationEvent,
  ): Promise<void> {
    const steps = automation.steps ?? [];
    const context = { tenantId: event.tenantId, contactId: event.contactId, event };

    for (const step of steps) {
      await this.executeStep(step, context);
    }

    // Update run count
    await supabase
      .from('automations')
      .update({ run_count: automation.run_count + 1, last_run_at: new Date().toISOString() })
      .eq('id', automation.id);
  }

  /**
   * Executes a single automation step.
   */
  static async executeStep(
    step: AutomationStep,
    context: { tenantId: string; contactId: string; event: AutomationEvent },
  ): Promise<void> {
    switch (step.step_type) {
      case 'send_template': {
        const contact = await getContact(context.contactId);
        await WhatsAppService.sendTemplateMessage(
          context.tenantId,
          contact.phone_number,
          step.config.template_name as string,
          step.config.language_code as string,
          step.config.components as TemplateComponent[],
        );
        break;
      }
      case 'send_text': {
        const contact = await getContact(context.contactId);
        await WhatsAppService.sendSessionMessage(
          context.tenantId,
          contact.phone_number,
          step.config.text as string,
        );
        break;
      }
      case 'add_tag': {
        await supabase.from('contact_tags').upsert({
          tenant_id: context.tenantId,
          contact_id: context.contactId,
          tag: step.config.tag as string,
        });
        break;
      }
      case 'remove_tag': {
        await supabase.from('contact_tags').delete()
          .eq('contact_id', context.contactId)
          .eq('tag', step.config.tag as string);
        break;
      }
      case 'wait_duration': {
        // In production this would use a queue (Vercel Cron or pg_cron)
        await new Promise(resolve => setTimeout(resolve, (step.config.seconds as number) * 1000));
        break;
      }
      case 'assign_agent': {
        await supabase.from('conversations').update({
          assigned_to: step.config.agent_id as string,
        }).eq('id', context.event.conversationId);
        break;
      }
      case 'webhook_call': {
        await fetch(step.config.url as string, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contact_id: context.contactId, tenant_id: context.tenantId }),
        });
        break;
      }
    }
  }
}
```

### 4.4 CredentialManager

```typescript
// src/services/credential-manager.service.ts

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const SALT = process.env.CREDENTIAL_ENCRYPTION_SALT!;

export class CredentialManager {

  private static deriveKey(): Buffer {
    return scryptSync(process.env.CREDENTIAL_ENCRYPTION_KEY!, SALT, 32);
  }

  /**
   * AES-256-GCM encrypt. Returns iv:authTag:encrypted all base64.
   */
  static encryptCredentials(plaintext: string): string {
    const key = this.deriveKey();
    const iv = randomBytes(16);
    const cipher = createCipheriv(ALGORITHM, key, iv);

    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    return [
      iv.toString('base64'),
      authTag.toString('base64'),
      encrypted.toString('base64'),
    ].join(':');
  }

  /**
   * AES-256-GCM decrypt.
   */
  static decryptCredentials(encryptedStr: string): string {
    const [ivB64, authTagB64, encryptedB64] = encryptedStr.split(':');
    const key = this.deriveKey();
    const iv = Buffer.from(ivB64, 'base64');
    const authTag = Buffer.from(authTagB64, 'base64');
    const encrypted = Buffer.from(encryptedB64, 'base64');

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    return decipher.update(encrypted) + decipher.final('utf8');
  }

  static decryptToken(encryptedStr: string): string {
    return this.decryptCredentials(encryptedStr);
  }

  /**
   * Fetches a fresh long-lived token from Meta and rotates the stored encrypted value.
   */
  static async rotateToken(tenantId: string): Promise<void> {
    const { data: account } = await supabase
      .from('whatsapp_accounts')
      .select('*')
      .eq('tenant_id', tenantId)
      .single();

    const currentToken = this.decryptToken(account.access_token_encrypted);

    // Exchange via Meta Debug Token API
    const response = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${currentToken}`
    );
    const data = await response.json();
    const newToken: string = data.access_token;

    const newEncrypted = this.encryptCredentials(newToken);

    await supabase
      .from('whatsapp_accounts')
      .update({ access_token_encrypted: newEncrypted, updated_at: new Date().toISOString() })
      .eq('tenant_id', tenantId);
  }
}
```

---

## 5. Frontend Page and Component Architecture

### 5.1 App Router Directory Structure

```
app/
  layout.tsx                        (root layout, fonts, providers)
  (auth)/
    layout.tsx                      (centered card layout, no sidebar)
    login/
      page.tsx
    register/
      page.tsx
  (dashboard)/
    layout.tsx                      (sidebar nav + auth guard + tenant context)
    dashboard/
      page.tsx                      (summary cards: messages, contacts, open conversations)
    inbox/
      page.tsx                      (left panel: conversation list, right panel: chat)
      [conversationId]/
        page.tsx                    (deep-linked conversation)
    contacts/
      page.tsx                      (paginated table with filters)
      import/
        page.tsx                    (CSV drag-drop uploader)
      [contactId]/
        page.tsx                    (contact detail + conversation history)
    campaigns/
      page.tsx                      (campaign list with status badges)
      create/
        page.tsx                    (multi-step campaign builder)
      [campaignId]/
        page.tsx                    (campaign detail + live stats)
    automations/
      page.tsx                      (automation list)
      create/
        page.tsx                    (flow builder canvas)
      [automationId]/
        page.tsx                    (edit automation)
    templates/
      page.tsx                      (template library)
      create/
        page.tsx                    (template composer with preview)
    settings/
      layout.tsx                    (settings tabs nav)
      account/
        page.tsx                    (tenant name, logo, slug)
      whatsapp/
        page.tsx                    (Meta Embedded Signup button + account status)
      billing/
        page.tsx                    (plan selector, usage meter, invoice history)
      team/
        page.tsx                    (member list, invite form, role editor)
  (admin)/
    layout.tsx                      (super-admin guard)
    admin/
      tenants/
        page.tsx
      metrics/
        page.tsx
```

### 5.2 Key Component Specifications

#### ConversationInbox

The live inbox is the most complex UI component. It subscribes to Supabase Realtime channels for the tenant's conversations table and messages table.

```typescript
// components/inbox/ConversationInbox.tsx

'use client';

// Left panel shows conversation list sorted by last_message_at.
// Right panel shows message thread for the selected conversation.
// Supabase Realtime subscription updates both panels in real time.

// State:
//   conversations: Conversation[]
//   selectedConversationId: string | null
//   messages: Message[]
//   isLoadingMessages: boolean

// Realtime channel:
//   supabase.channel('inbox-{tenantId}')
//     .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations', filter: `tenant_id=eq.{tenantId}` }, handler)
//     .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `tenant_id=eq.{tenantId}` }, handler)
//     .subscribe()

// On new message INSERT: append to messages if conversation is open, bump conversation to top of list
// On conversation UPDATE: update status badge, unread count
```

#### MessageComposer

Handles composing and sending messages. Shows a template picker when outside the 24-hour session window, and a free-text input within the window.

```typescript
// components/inbox/MessageComposer.tsx

// Props:
//   conversationId: string
//   contactPhone: string
//   lastInboundAt: string | null

// Logic:
//   isWithinSessionWindow = lastInboundAt && (now - lastInboundAt) < 24 * 60 * 60 * 1000
//   If within window: show textarea + send button
//   If outside window: show TemplateSelector + send button
//   On send: POST /api/whatsapp/send, optimistically append message, handle error
```

#### ContactImporter

```typescript
// components/contacts/ContactImporter.tsx

// Steps: 1. Upload CSV  2. Map columns  3. Preview rows  4. Confirm import
// Uses react-dropzone for file input
// Parses CSV client-side using papaparse
// Shows column mapping UI: CSV column → contact field
// Sends POST /api/contacts/import with mapped data
// Polls /api/contacts/import/{jobId}/status for progress
```

#### CampaignBuilder

Multi-step form for creating a campaign:
1. Select template
2. Configure template parameters
3. Select contacts (by tag, individual, or all opted-in)
4. Schedule or send immediately
5. Review and confirm

#### AutomationFlowBuilder

Visual drag-and-drop canvas showing trigger node connected to action steps. Built using ReactFlow. Each node represents an `AutomationStep`. Saving serializes the graph into the `automation_steps` table row format.

#### PlanSelector

Displays three plan cards (Starter, Growth, Scale) with feature comparison. On selection, calls `POST /api/billing/create-subscription` and redirects to Razorpay's hosted subscription page.

#### UsageMeter

Displays a progress bar of `messages_sent / messages_limit` for the current month. Color transitions: green (0-70%), amber (70-90%), red (90-100%). Includes a prominent "Upgrade Plan" CTA when usage exceeds 80%.

---

## 6. Meta Webhook Implementation Detail

### 6.1 Webhook Route: app/api/whatsapp/webhook/route.ts

```typescript
// app/api/whatsapp/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// GET: Meta sends a challenge to verify the webhook endpoint
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode      = searchParams.get('hub.mode');
  const token     = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode !== 'subscribe') {
    return new NextResponse('Bad Request', { status: 400 });
  }

  // Look up the whatsapp_accounts record where verify_token matches.
  // This allows one webhook URL to serve all tenants.
  const { data: account } = await supabase
    .from('whatsapp_accounts')
    .select('id')
    .eq('verify_token', token)
    .single();

  if (!account) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Echo the challenge — Meta accepts the webhook
  return new NextResponse(challenge, { status: 200 });
}

// POST: All incoming message events
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-hub-signature-256') ?? '';

  // Verify HMAC-SHA256 signature
  const expectedSig = 'sha256=' + crypto
    .createHmac('sha256', process.env.META_APP_SECRET!)
    .update(rawBody)
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(expectedSig), Buffer.from(signature))) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const payload: MetaWebhookPayload = JSON.parse(rawBody);

  if (payload.object !== 'whatsapp_business_account') {
    return new NextResponse('OK', { status: 200 });
  }

  // Store raw event for audit/replay
  await supabase.from('webhook_events').insert({
    source: 'meta',
    event_type: 'messages',
    payload,
  });

  // Process each entry and change concurrently
  const promises: Promise<void>[] = [];

  for (const entry of payload.entry) {
    for (const change of entry.changes) {
      if (change.field !== 'messages') continue;
      const value = change.value;
      const phoneNumberId = value.metadata.phone_number_id;

      // Handle delivery statuses
      for (const status of value.statuses ?? []) {
        promises.push(WhatsAppService.syncDeliveryStatus(status));
      }

      // Handle incoming messages
      for (const message of value.messages ?? []) {
        const senderProfile = value.contacts?.find(c => c.wa_id === message.from);
        promises.push(
          WhatsAppService.handleIncomingMessage(
            phoneNumberId,
            message,
            senderProfile?.profile ?? { name: message.from },
          )
        );
      }
    }
  }

  await Promise.allSettled(promises);

  // Meta requires a 200 response quickly — always return OK
  return new NextResponse('OK', { status: 200 });
}
```

### 6.2 Message Type Handling

Each inbound message type is normalized into the `messages` table:

| Meta type | Stored type | body field | media_url |
|---|---|---|---|
| text | text | message.text.body | null |
| image | image | caption if any | Supabase Storage URL after download |
| audio | audio | null | Supabase Storage URL |
| video | video | caption if any | Supabase Storage URL |
| document | document | caption/filename | Supabase Storage URL |
| button | interactive | button.text | null |
| interactive | interactive | null | null — payload in interactive_payload |
| location | location | lat,lng as text | null |
| sticker | sticker | null | Supabase Storage URL |
| reaction | reaction | emoji | null |

For media messages, the service downloads the media from Meta's temporary URL using the access token, uploads it to Supabase Storage at `{tenantId}/media/{messageId}/{filename}`, and stores the public Supabase URL.

### 6.3 Supabase Realtime Broadcast

After inserting a message, the webhook handler does not need to explicitly broadcast. Because the `messages` table has Realtime enabled, Supabase automatically pushes the INSERT event to all clients subscribed to the relevant channel. The frontend inbox subscribes with:

```typescript
supabase
  .channel(`messages:tenant:${tenantId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `tenant_id=eq.${tenantId}`,
  }, (payload) => {
    dispatch({ type: 'NEW_MESSAGE', message: payload.new as Message });
  })
  .subscribe();
```

---

## 7. Razorpay Billing Implementation

### 7.1 Plan Definitions

| Plan | Price (INR/month) | Message Limit | WhatsApp Numbers | Razorpay Plan ID Env |
|---|---|---|---|---|
| Starter | ₹999 | 1,000 | 1 | RAZORPAY_PLAN_STARTER |
| Growth | ₹2,499 | 5,000 | 1 | RAZORPAY_PLAN_GROWTH |
| Scale | ₹4,999 | 20,000 | 3 | RAZORPAY_PLAN_SCALE |

### 7.2 Subscription Creation Flow

1. User selects a plan on `/settings/billing`.
2. Frontend calls `POST /api/billing/create-subscription` with `{ plan_id: 'growth' }`.
3. The API creates a Razorpay subscription using `razorpay.subscriptions.create()`.
4. Razorpay returns a `short_url` for the hosted payment page.
5. The API stores the subscription record locally with `status: 'created'`.
6. The API returns the `short_url` to the frontend.
7. The frontend redirects the user to Razorpay's hosted page.
8. After payment, Razorpay redirects back to `sns.chat.anantasutra.com/settings/billing?status=success`.
9. Razorpay sends a `subscription.activated` webhook to `POST /api/billing/webhook`.
10. The webhook handler verifies the HMAC signature, updates the subscription status to `active`, and updates `usage_logs.messages_limit`.

### 7.3 Usage Enforcement Middleware

A middleware function `checkQuotaMiddleware` is called before any `send` operation in both `WhatsAppService.sendTemplateMessage` and `sendSessionMessage`. It queries the current month's `usage_logs` record.

For the REST API layer, an additional Next.js middleware can gate all `/api/whatsapp/send` calls:

```typescript
// middleware.ts (Next.js edge middleware)

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/api/whatsapp/send') {
    const tenantId = request.headers.get('x-tenant-id');
    if (!tenantId) return NextResponse.json({ error: 'No tenant' }, { status: 401 });

    // Call a lightweight edge-compatible quota check
    const allowed = await checkQuotaEdge(tenantId);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Monthly message quota exceeded. Please upgrade your plan.' },
        { status: 402 }
      );
    }
  }
  return NextResponse.next();
}
```

### 7.4 Credit Top-Up Flow

Tenants on any plan can purchase additional message credits without upgrading. The top-up uses Razorpay Orders (one-time payment) rather than subscriptions.

1. User selects a top-up pack (e.g., 500 messages for ₹299).
2. Frontend calls `POST /api/billing/topup` with `{ pack: '500' }`.
3. API creates a Razorpay Order.
4. Frontend uses Razorpay Checkout SDK to process payment.
5. On successful payment, Razorpay sends `payment.captured` webhook.
6. Webhook handler increments `usage_logs.messages_limit` by the purchased amount.

### 7.5 Supabase RPC for Atomic Usage Increment

```sql
CREATE OR REPLACE FUNCTION increment_usage(
  p_tenant_id UUID,
  p_year_month TEXT,
  p_count INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO usage_logs (tenant_id, year_month, messages_sent, messages_limit)
  VALUES (p_tenant_id, p_year_month, p_count, 1000)
  ON CONFLICT (tenant_id, year_month)
  DO UPDATE SET
    messages_sent = usage_logs.messages_sent + p_count,
    updated_at = now();
END;
$$;
```

---

## 8. Security Implementation Details

### 8.1 Tenant Isolation Middleware

Every API route resolves the tenant context from the authenticated JWT before running any database query. This is enforced in a shared `withTenantAuth` higher-order function:

```typescript
// src/lib/with-tenant-auth.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export function withTenantAuth(
  handler: (req: NextRequest, ctx: { tenantId: string; userId: string; role: TenantRole }) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = request.headers.get('x-tenant-id')
      ?? request.nextUrl.searchParams.get('tenant_id');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
    }

    // Verify user is a member of this tenant
    const { data: member } = await supabase
      .from('tenant_members')
      .select('role')
      .eq('tenant_id', tenantId)
      .eq('user_id', session.user.id)
      .single();

    if (!member) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Log access for audit trail
    await supabase.from('audit_logs').insert({
      tenant_id: tenantId,
      user_id: session.user.id,
      action: 'api_access',
      resource: request.nextUrl.pathname,
      ip_address: request.ip,
      user_agent: request.headers.get('user-agent'),
    });

    return handler(request, { tenantId, userId: session.user.id, role: member.role });
  };
}
```

### 8.2 API Key Authentication

For external integrations, tenants can generate API keys. Keys are displayed only once at creation time. Only a bcrypt hash is stored.

```typescript
// src/lib/api-keys.ts

import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';

const PREFIX = 'snsc_';

export async function generateApiKey(tenantId: string, name: string, createdBy: string) {
  const raw = PREFIX + randomBytes(32).toString('hex');
  const hash = await bcrypt.hash(raw, 12);
  const prefix = raw.slice(0, 12);

  await supabase.from('api_keys').insert({
    tenant_id: tenantId,
    name,
    key_hash: hash,
    key_prefix: prefix,
    created_by: createdBy,
  });

  // Return the raw key — shown only once
  return raw;
}

export async function verifyApiKey(rawKey: string): Promise<{ tenantId: string } | null> {
  if (!rawKey.startsWith(PREFIX)) return null;

  // Efficient: filter by prefix to narrow candidates before bcrypt compare
  const { data: candidates } = await supabase
    .from('api_keys')
    .select('*')
    .eq('key_prefix', rawKey.slice(0, 12))
    .eq('is_active', true);

  for (const candidate of candidates ?? []) {
    const match = await bcrypt.compare(rawKey, candidate.key_hash);
    if (match) {
      // Update last_used_at
      await supabase.from('api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', candidate.id);
      return { tenantId: candidate.tenant_id };
    }
  }
  return null;
}
```

### 8.3 Meta Webhook Signature Verification

```typescript
// src/lib/verify-meta-signature.ts

import crypto from 'crypto';

export function verifyMetaSignature(rawBody: string, signatureHeader: string): boolean {
  const expected = 'sha256=' + crypto
    .createHmac('sha256', process.env.META_APP_SECRET!)
    .update(rawBody)
    .digest('hex');

  if (signatureHeader.length !== expected.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(signatureHeader, 'utf8'),
    Buffer.from(expected, 'utf8'),
  );
}
```

Note: `crypto.timingSafeEqual` is required to prevent timing attacks on the HMAC comparison.

### 8.4 PII Data Handling

The `contacts` table stores `phone_number`, `name`, and `email`. These fields are:

1. Protected by RLS — only tenant members can query their own tenant's contacts.
2. Never logged in plaintext in `audit_logs` or `webhook_events`.
3. Soft-deleted (opted-out flag set, but record retained for conversation history integrity). Hard delete available via admin.
4. Exported only via authenticated API endpoints that log the export action.

For GDPR compliance, a `DELETE /api/contacts/[id]/gdpr-erase` endpoint should be implemented to null out all PII fields while retaining message records for billing audit purposes.

### 8.5 Additional RLS Policies

Super-admin access is controlled by a custom claim in the JWT. When a user is designated as super-admin in the Supabase auth metadata, the following policies apply:

```sql
-- Super admin bypass (only set this claim in Auth server, never from client)
CREATE POLICY "super_admin_all_tenants" ON tenants
  FOR ALL USING (
    (auth.jwt() ->> 'is_super_admin')::boolean = true
  );

CREATE POLICY "super_admin_all_usage_logs" ON usage_logs
  FOR ALL USING (
    (auth.jwt() ->> 'is_super_admin')::boolean = true
  );
```

The `is_super_admin` claim is set exclusively via the Supabase service role key from a secured admin script, never from the client application.

---

## 9. Deployment and Environment Configuration

### 9.1 Required Environment Variables

```bash
# =====================
# Supabase
# =====================
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# =====================
# Meta WhatsApp Cloud API
# =====================
META_APP_ID=<meta-app-id>
META_APP_SECRET=<meta-app-secret>
META_WEBHOOK_VERIFY_TOKEN=<random-string-used-as-default-verify-token>

# =====================
# Razorpay
# =====================
RAZORPAY_KEY_ID=rzp_live_xxxxxx
RAZORPAY_KEY_SECRET=<razorpay-secret>
RAZORPAY_WEBHOOK_SECRET=<razorpay-webhook-secret>
RAZORPAY_PLAN_STARTER=plan_xxxStarter
RAZORPAY_PLAN_GROWTH=plan_xxxGrowth
RAZORPAY_PLAN_SCALE=plan_xxxScale

# =====================
# Credential Encryption
# =====================
CREDENTIAL_ENCRYPTION_KEY=<32-char-random-string>
CREDENTIAL_ENCRYPTION_SALT=<16-char-random-string>

# =====================
# Nodemailer
# =====================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@anantasutra.com
SMTP_PASS=<app-password>
SMTP_FROM="SNS Chat <noreply@anantasutra.com>"

# =====================
# App
# =====================
NEXT_PUBLIC_APP_URL=https://sns.chat.anantasutra.com
NEXT_PUBLIC_APP_NAME=SNS Chat
NODE_ENV=production
```

### 9.2 Vercel Project Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "regions": ["bom1"],
  "crons": [
    {
      "path": "/api/cron/process-scheduled-campaigns",
      "schedule": "*/5 * * * *"
    },
    {
      "path": "/api/cron/rotate-tokens",
      "schedule": "0 2 * * 0"
    }
  ]
}
```

Key settings:
- Deploy region `bom1` (Mumbai) for low latency to Indian Meta servers.
- Cron job every 5 minutes to process campaigns that have reached their `scheduled_at` time.
- Weekly token rotation job (Sundays at 2 AM IST) to refresh Meta long-lived tokens.

### 9.3 Supabase Project Setup

1. Create a new Supabase project in the Asia South (Mumbai) region.
2. Run the full schema SQL in the Supabase SQL Editor.
3. Enable Realtime for the `messages` and `conversations` tables via the Supabase Dashboard under Database > Replication.
4. Create a Supabase Storage bucket named `media` with the following policy:
   ```sql
   CREATE POLICY "tenant_media_access" ON storage.objects
     FOR ALL USING (
       bucket_id = 'media'
       AND (storage.foldername(name))[1] IN (
         SELECT tenant_id::text FROM tenant_members WHERE user_id = auth.uid()
       )
     );
   ```
5. Set `Auth > Email > Confirm Email` to enabled.
6. Set `Auth > Redirect URLs` to include `https://sns.chat.anantasutra.com/auth/callback`.

### 9.4 Meta App Setup

1. Create a Meta Business App at developers.facebook.com.
2. Add the WhatsApp product to the app.
3. Under WhatsApp > Configuration, set the Webhook URL to `https://sns.chat.anantasutra.com/api/whatsapp/webhook`.
4. Subscribe to the `messages` webhook field.
5. Generate a System User with the `whatsapp_business_messaging` and `whatsapp_business_management` permissions.
6. Implement Embedded Signup using Meta's JavaScript SDK on the `/settings/whatsapp` page.
7. The Embedded Signup callback URL must be added to the Meta App's list of valid OAuth Redirect URIs.

### 9.5 Razorpay Setup

1. Create a Razorpay account and complete KYC.
2. Under Plans, create three monthly subscription plans matching the plan IDs in environment variables.
3. Under Webhook Settings, add `https://sns.chat.anantasutra.com/api/billing/webhook` and subscribe to events: `subscription.activated`, `subscription.charged`, `subscription.cancelled`, `subscription.halted`, `payment.captured`.
4. Copy the webhook secret to the `RAZORPAY_WEBHOOK_SECRET` environment variable.

---

## 10. Development Phases and Sprint Plan

### Phase 1: MVP — Auth, Connect, Inbox (Weeks 1–4)

| Week | Deliverables |
|---|---|
| 1 | Supabase project init, full schema migration, environment setup. Auth routes (register, login, logout). Basic dashboard layout and sidebar. |
| 2 | Meta Embedded Signup integration on `/settings/whatsapp`. WhatsApp account connection and storage. Webhook GET verification endpoint. |
| 3 | Webhook POST handler for incoming text messages. Conversation and message storage. Supabase Realtime setup. |
| 4 | ConversationInbox UI with Realtime updates. MessageComposer for text and template messages. Basic template listing. |

**Phase 1 Definition of Done**: A team member can register a tenant, connect a WhatsApp number, receive incoming messages in the live inbox, and reply with a text or template message.

### Phase 2: Contacts, Templates, Campaigns (Weeks 5–8)

| Week | Deliverables |
|---|---|
| 5 | Contact CRUD APIs and UI. Tag system. Contact detail page with conversation history. |
| 6 | CSV contact importer with column mapping. Bulk upsert logic and import job status tracking. |
| 7 | Template management: create, list, delete. Meta template submission and status sync. Template preview component. |
| 8 | Campaign builder UI. Campaign launch with quota check. Campaign detail page with live delivery metrics. |

**Phase 2 Definition of Done**: Tenant can import 1,000 contacts via CSV, create an approved template, build a campaign targeting a contact segment, schedule it, and see delivered/read counts update in real time.

### Phase 3: Automations, Billing, Analytics (Weeks 9–12)

| Week | Deliverables |
|---|---|
| 9 | AutomationEngine core: trigger evaluation and step execution. Welcome message automation (on contact_created). |
| 10 | Automation flow builder UI with ReactFlow. Keyword match trigger. Wait duration step and webhook_call step. |
| 11 | Razorpay billing: plan selector, subscription creation flow, webhook handler, usage enforcement middleware. UsageMeter component. |
| 12 | Analytics dashboard: message volume chart, campaign performance, contact growth. Export contacts to CSV endpoint. |

**Phase 3 Definition of Done**: Tenant is on a paid Growth plan with quota enforcement, has an active welcome automation, and can view a dashboard with 30-day message volume trends.

### Phase 4: Admin Panel, Polish, Launch (Weeks 13–14)

| Week | Deliverables |
|---|---|
| 13 | Super-admin panel: tenant list, usage overview, plan management, tenant suspension. Platform metrics dashboard. API key management. |
| 14 | Notification emails (Nodemailer): quota warning at 80%, welcome email on register, invoice emails. Final QA, performance testing, security review, Vercel production deployment. |

**Phase 4 Definition of Done**: Public launch with documentation site, all critical paths tested (webhook delivery, payment flow, automation execution), error monitoring (Sentry) integrated, and runbook documented.

---

## Appendix: Database Diagram (Entity Relationships)

```
tenants
  |
  +--< tenant_members >-- auth.users
  |
  +--< whatsapp_accounts
  |
  +--< contacts
  |       |
  |       +--< contact_tags
  |       |
  |       +--< conversations >-- whatsapp_accounts
  |               |
  |               +--< messages
  |
  +--< message_templates >-- whatsapp_accounts
  |
  +--< campaigns >-- whatsapp_accounts
  |       |
  |       +--< campaign_contacts >-- contacts
  |                               |
  |                               +-- messages
  |
  +--< automations
  |       |
  |       +--< automation_steps
  |
  +--< subscriptions
  |
  +--< usage_logs
  |
  +--< api_keys
  |
  +--< audit_logs
  |
  +--< webhook_events
```

---

## Appendix: API Error Code Reference

| HTTP Status | Error Code | Meaning |
|---|---|---|
| 400 | INVALID_INPUT | Request body failed schema validation |
| 401 | UNAUTHORIZED | Missing or expired JWT / API key |
| 402 | QUOTA_EXCEEDED | Monthly message limit reached |
| 403 | FORBIDDEN | User lacks required role for this action |
| 404 | NOT_FOUND | Resource does not exist in tenant scope |
| 409 | CONFLICT | Duplicate record (e.g. account already connected) |
| 422 | META_API_ERROR | Meta Graph API returned an error |
| 429 | RATE_LIMITED | Too many requests in a short window |
| 500 | INTERNAL_ERROR | Unexpected server error |
| 503 | SERVICE_UNAVAILABLE | Meta or Razorpay API temporarily unavailable |

---

*Document End — SNS Chat LLD v1.0 — AnantaSutra — 2026-03-30*
