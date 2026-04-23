# SNS Chat by AnantaSutra — High Level Design (HLD)

**Platform:** sns.chat.anantasutra.com
**Version:** 1.0
**Date:** 2026-03-30
**Author:** AnantaSutra Engineering

---

## Table of Contents

1. [Executive Summary and System Vision](#1-executive-summary-and-system-vision)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Core Subsystems](#3-core-subsystems)
   - 3.1 Identity and Multi-Tenancy
   - 3.2 Meta WhatsApp Integration Layer
   - 3.3 Messaging Engine
   - 3.4 Contact Management System
   - 3.5 Automation Engine
   - 3.6 Analytics and Reporting
   - 3.7 Billing and Subscription System
   - 3.8 Admin and Dashboard
4. [Data Architecture](#4-data-architecture)
5. [Integration Architecture](#5-integration-architecture)
6. [Security Architecture](#6-security-architecture)
7. [Scalability and Performance](#7-scalability-and-performance)
8. [Deployment Architecture](#8-deployment-architecture)
9. [Key Technical Decisions and Trade-offs](#9-key-technical-decisions-and-trade-offs)
10. [System Constraints and Limitations](#10-system-constraints-and-limitations)

---

## 1. Executive Summary and System Vision

### 1.1 What the System Does

SNS Chat is a multi-tenant Software-as-a-Service (SaaS) platform that enables businesses of all sizes to automate and manage their WhatsApp communications through the Meta WhatsApp Business Cloud API. Businesses — from solo consultants to mid-market enterprises — register on the platform, connect their own Meta WhatsApp Business credentials via an embedded signup flow, and gain access to a full suite of messaging capabilities: broadcast campaigns, chatbot automation flows, appointment reminders, meeting confirmations, and a live team inbox.

The platform is built and operated by AnantaSutra. Each customer of AnantaSutra is a "tenant" — a separate, isolated business workspace on the shared infrastructure. AnantaSutra charges tenants a monthly subscription fee based on usage tiers, plus overage charges for messages beyond plan quotas.

At its core, SNS Chat solves three problems that businesses face with WhatsApp:

1. **Manual overhead**: Businesses manually send appointment reminders, follow-ups, and broadcasts one by one. SNS Chat automates these workflows.
2. **Team collaboration**: WhatsApp is a single-user experience. SNS Chat provides a shared team inbox where multiple agents can collaborate on conversations.
3. **Programmable messaging**: Businesses need event-driven automation — when a meeting is booked, a confirmation goes out; three hours before, a reminder fires; after the meeting, a follow-up is sent. SNS Chat provides these trigger-based flows without requiring any code from the end customer.

### 1.2 Core Value Proposition

| Stakeholder | Value Delivered |
|---|---|
| Small businesses | Zero-code WhatsApp automation with a simple dashboard |
| Mid-market teams | Shared inbox, role-based access, and campaign analytics |
| Enterprises | API access, webhooks, custom automation flows, and dedicated support |
| AnantaSutra | Recurring subscription revenue with low marginal cost per tenant |

The platform differentiates itself in the Indian market specifically through:

- Native Razorpay integration for INR billing, UPI, and Indian payment methods
- Compliance with TRAI DLT regulations for bulk messaging
- Localized onboarding in Indian business contexts (GST invoice generation, INR pricing)
- WhatsApp-first market focus, as WhatsApp has over 500 million users in India

### 1.3 Scale Targets

The system is designed to achieve the following targets at steady-state and peak load:

| Metric | Target |
|---|---|
| Active tenants | 1,000 |
| Messages per month | 10,000,000 (10M) |
| Average messages per tenant per month | 10,000 |
| Peak messages per second (burst) | 500 msg/s |
| Webhook events per second (inbound from Meta) | 300 events/s |
| Dashboard concurrent active users | 2,000 |
| Uptime SLA | 99.9% (8.7 hours downtime/year) |
| Message delivery latency (P99) | Under 5 seconds from trigger to Meta API call |
| Webhook processing latency (P99) | Under 2 seconds from receipt to database write |

These targets are achievable on the proposed stack (Vercel + Supabase) with careful architecture choices around async processing, database indexing, and connection pooling.

---

## 2. System Architecture Overview

### 2.1 Multi-Tenant SaaS Architecture Pattern

SNS Chat follows the **Shared Infrastructure, Isolated Data** multi-tenancy pattern. All tenants share the same application codebase, the same Vercel deployment, and the same Supabase project. Tenant isolation is enforced entirely at the database level using PostgreSQL Row Level Security (RLS) policies, not at the infrastructure level.

This is the correct choice for a bootstrapped SaaS at this scale because:

- Infrastructure cost remains low — no per-tenant database provisioning
- Deployments and upgrades happen once for all tenants
- Operational complexity is minimal compared to a per-tenant silo model
- RLS in PostgreSQL is a proven, battle-tested isolation mechanism used by every major Supabase-based SaaS

The trade-off is that a single noisy tenant (e.g., a tenant running a massive broadcast) can affect shared database resources. This is mitigated via application-level rate limiting and Supabase's built-in connection pooling.

### 2.2 Shared vs Dedicated Resources

| Resource | Shared or Dedicated | Notes |
|---|---|---|
| Next.js application | Shared | Single Vercel deployment for all tenants |
| PostgreSQL database | Shared | RLS enforces row-level tenant isolation |
| Supabase Auth | Shared | JWT claims carry tenant_id |
| Supabase Storage | Shared with prefix isolation | Media stored under `/{tenant_id}/...` path prefix |
| Meta WhatsApp credentials | Dedicated per tenant | Each tenant brings their own WABA credentials |
| Razorpay subscription | Dedicated per tenant | Each tenant has their own Razorpay subscription object |
| Vercel Edge Network | Shared | CDN and routing shared across all tenants |

### 2.3 Request Flow: User Action to WhatsApp Delivery

The following describes the end-to-end flow for a typical outbound message trigger (e.g., an automation fires a meeting reminder):

```
1. Trigger Event
   [Automation Scheduler / User Dashboard / External API]
            |
            v
2. Next.js API Route (Vercel Serverless Function)
   - Authenticate request (Supabase JWT or API Key)
   - Validate tenant quota (check message credits)
   - Validate message payload
            |
            v
3. Message Queue (Supabase PostgreSQL + pg_cron or external BullMQ)
   - Insert message record with status: 'queued'
   - Return 202 Accepted to caller
            |
            v
4. Queue Processor (Vercel Cron Job or Background Worker)
   - Dequeue pending messages
   - Load tenant's WhatsApp credentials (decrypted from vault)
   - Enforce per-tenant rate limiting
            |
            v
5. Meta WhatsApp Cloud API
   POST /v18.0/{phone-number-id}/messages
   - Receives message
   - Returns 200 with wamid (WhatsApp message ID)
            |
            v
6. Status Update
   - Update message record: status: 'sent', wamid stored
            |
            v
7. Meta Delivery Webhook (async, minutes later)
   POST /api/webhooks/meta → Vercel Function
   - Parse delivery/read status update
   - Update message record: status: 'delivered' or 'read'
   - Trigger Supabase Realtime broadcast to dashboard
            |
            v
8. Dashboard Live Update
   - Supabase Realtime channel pushes status change
   - Tenant's browser inbox updates in real time
```

### 2.4 System Architecture Diagram

```
+------------------------------------------------------------------+
|                        CLIENT LAYER                              |
|  +------------------+  +------------------+  +--------------+   |
|  | Tenant Dashboard |  |  Admin Portal    |  | External API |   |
|  | (Next.js App     |  |  (AnantaSutra    |  | Consumers    |   |
|  |  Router)         |  |   Staff)         |  | (3rd party)  |   |
|  +--------+---------+  +--------+---------+  +------+-------+   |
+-----------|-------------------------|----------------|----------+
            |                         |                |
            v                         v                v
+------------------------------------------------------------------+
|                      VERCEL EDGE LAYER                           |
|   CDN / Edge Middleware / Route Protection / Rate Limiting       |
+---------------------------+--------------------------------------+
                            |
            +---------------+----------------+
            |                                |
            v                                v
+-------------------+            +-------------------+
|  Next.js App      |            |  API Routes       |
|  (Server/Client   |            |  /api/...         |
|   Components)     |            |  Serverless Fns   |
+-------------------+            +--------+----------+
                                          |
             +----------------------------+----------------------------+
             |                            |                            |
             v                            v                            v
+---------------------+   +------------------------------+  +-------------------+
| Supabase Auth       |   | Supabase PostgreSQL          |  | Supabase Storage  |
| - JWT issuance      |   | - Tenants / Workspaces       |  | - Media files     |
| - Session mgmt      |   | - Contacts / Messages        |  | - Template media  |
| - OAuth providers   |   | - Campaigns / Templates      |  | - Exports (CSV)   |
+---------------------+   | - Billing / Subscriptions    |  +-------------------+
                          | - Automation Flows           |
                          | - Audit Logs                 |
                          | RLS: tenant_id isolation     |
                          +------------------------------+
                                          |
                          +---------------+---------------+
                          |                               |
                          v                               v
             +------------------------+     +------------------------+
             | Supabase Realtime      |     | pg_cron / Cron Jobs    |
             | - Live inbox updates   |     | - Scheduled messages   |
             | - Delivery status push |     | - Reminder triggers    |
             | - Typing indicators    |     | - Subscription checks  |
             +------------------------+     +------------------------+
                                                         |
                                                         v
+------------------------------------------------------------------+
|                    EXTERNAL SERVICES LAYER                       |
|                                                                  |
|   +---------------------------+   +--------------------------+   |
|   | Meta WhatsApp Cloud API   |   | Razorpay Payment Gateway |   |
|   | - Send messages           |   | - Subscription billing   |   |
|   | - Template management     |   | - Webhooks (payment evts)|   |
|   | - Webhook delivery status |   | - INR / UPI support      |   |
|   | - Embedded Signup OAuth   |   +--------------------------+   |
|   +---------------------------+                                  |
+------------------------------------------------------------------+
```

---

## 3. Core Subsystems

### 3.1 Identity and Multi-Tenancy

#### Tenant Isolation Model

Every entity in the system — contacts, messages, templates, campaigns, automation flows — is tagged with a `tenant_id` UUID. PostgreSQL Row Level Security (RLS) policies on every table ensure that a database query can only return rows matching the authenticated user's tenant context. Even if application-level code had a bug that omitted a WHERE clause, the database itself would block cross-tenant data access.

The tenant isolation contract:

```
Table: messages
RLS Policy: tenant_id = auth.jwt()->>'tenant_id'

No application query can return another tenant's message rows,
regardless of what SQL the application generates.
```

This RLS-first approach means tenant isolation is not a feature that can accidentally be broken by a developer forgetting to add a filter — it is enforced at the database engine level.

#### Auth Flow

SNS Chat uses Supabase Auth for all authentication operations. The flow is as follows:

1. User visits sns.chat.anantasutra.com and signs up with email + password (or Google OAuth).
2. Supabase Auth creates a `auth.users` record and issues a JWT.
3. During signup, a `tenants` record is created in the application schema and the user's `auth.users` record is updated with a custom claim: `tenant_id`.
4. Every subsequent API call includes the JWT in the Authorization header. The Next.js middleware validates the JWT using Supabase's server-side client.
5. The `tenant_id` extracted from the JWT is used to scope all database operations.

Custom JWT claims are injected via a Supabase Auth hook (a PostgreSQL function triggered after user creation) that reads the tenant membership and injects it into the token payload.

```
JWT Payload (decoded):
{
  "sub": "user-uuid",
  "email": "owner@business.com",
  "role": "authenticated",
  "tenant_id": "tenant-uuid",
  "workspace_role": "owner",
  "exp": 1234567890
}
```

#### Role-Based Access Control

Each workspace supports three roles:

| Role | Permissions |
|---|---|
| Owner | Full control: billing, settings, API keys, user management, all messaging |
| Admin | All messaging + team management, cannot modify billing or delete workspace |
| Agent | Read conversations + reply to assigned conversations only |

Role is stored in the `workspace_members` table, not in the JWT (to allow role changes without forcing token refresh). Each API route checks the user's role from the database after verifying the JWT.

#### Workspace Concept

A tenant maps to a single workspace by default. In future phases, a single business account could have multiple workspaces (e.g., different brands or regional operations). The workspace is the unit of WhatsApp Business Account (WABA) binding — each workspace connects to exactly one WABA and one phone number.

### 3.2 Meta WhatsApp Integration Layer

#### Embedded Signup Flow

Rather than requiring tenants to navigate Meta's developer portal independently, SNS Chat implements Meta's Embedded Signup flow. This is a JavaScript SDK-based OAuth flow that appears as a modal inside the SNS Chat dashboard. The tenant authorizes SNS Chat to access their WhatsApp Business Account without ever leaving the platform.

The flow:

1. Tenant clicks "Connect WhatsApp" in the dashboard.
2. Meta JavaScript SDK opens an embedded OAuth modal.
3. Tenant logs in to their Facebook Business account and selects (or creates) a WhatsApp Business Account.
4. Meta returns an authorization code to the SNS Chat callback URL.
5. The Next.js API route exchanges the code for a System User Access Token via Meta's Graph API.
6. The access token, WABA ID, and phone number ID are encrypted and stored per workspace.

#### Credential Storage and Encryption

WhatsApp credentials (access tokens) are sensitive. They are never stored in plaintext.

Encryption strategy:
- The raw access token is encrypted using AES-256-GCM before database insertion.
- The encryption key is stored in Vercel environment variables, not in the database.
- Decryption occurs only inside server-side API routes, never on the client.
- The encrypted token is stored in a dedicated `workspace_credentials` table with strict RLS.

```
workspace_credentials table:
- workspace_id (FK)
- waba_id (plaintext, non-sensitive)
- phone_number_id (plaintext, non-sensitive)
- access_token_encrypted (AES-256-GCM ciphertext)
- access_token_iv (initialization vector)
- token_expires_at
- created_at / updated_at
```

#### Webhook Receiver

Meta sends inbound messages and delivery status updates to a pre-registered webhook URL:
`https://sns.chat.anantasutra.com/api/webhooks/meta`

This is a shared webhook endpoint. All tenants' events arrive at the same URL. Meta identifies which phone number (and therefore which tenant) the event belongs to by including the phone_number_id in the payload.

Webhook processing:

1. Vercel serverless function receives the POST request.
2. Verify the X-Hub-Signature-256 HMAC header against the registered app secret.
3. Parse the payload and extract the phone_number_id.
4. Look up the workspace associated with that phone_number_id.
5. Route the event to the appropriate handler (inbound message, delivery status, read receipt).
6. Write to the database and trigger Supabase Realtime broadcast.
7. Respond with HTTP 200 immediately (Meta requires sub-5 second webhook acknowledgment).

The signature verification step is critical — without it, any actor could forge delivery status updates or inject fake inbound messages.

#### Message Sending Service

The message sending service is a server-side module that wraps all calls to the Meta Cloud API. It handles:

- Authentication header injection (Bearer token from decrypted credentials)
- Payload construction for each message type (text, template, interactive, media)
- Error handling and error code mapping (Meta returns detailed error codes)
- Rate limiting enforcement (see below)
- wamid capture and storage for status tracking

#### Template Management and Approval Workflow

WhatsApp templates must be approved by Meta before they can be sent to users outside of a 24-hour conversation window. SNS Chat provides a template management UI within each workspace.

Template workflow:

1. Tenant creates a template in the SNS Chat dashboard (body text, header, footer, buttons, variables).
2. SNS Chat calls the Meta Graph API to submit the template for approval: `POST /{waba-id}/message_templates`.
3. Meta asynchronously reviews and approves/rejects the template (typically minutes to hours).
4. Meta sends a webhook update with the approval status, which SNS Chat captures and updates in the `message_templates` table.
5. Approved templates become available for use in campaigns and automation flows.

Template statuses: `pending`, `approved`, `rejected`, `disabled`, `paused`.

#### Rate Limiting and Meta API Quotas

Meta enforces per-phone-number rate limits. The key limits are:

| Limit Type | Value |
|---|---|
| Business-initiated conversations (standard) | Tiered by phone quality rating (500/1000/unlimited/day) |
| Marketing message limit | Separate per-phone daily cap |
| API calls per second | ~80 messages/second per phone number |
| Template messages per WABA | Up to 250 unique templates |

SNS Chat enforces application-level pre-checks before dispatching messages:

- A per-workspace daily message counter is maintained in Supabase.
- A Redis-compatible rate limiter (Upstash Redis, if needed) tracks per-second throughput.
- If a tenant would exceed their Meta quota or their subscription plan quota, messages are queued and deferred, not dropped.

### 3.3 Messaging Engine

#### Message Types

| Type | When Used | API Approach |
|---|---|---|
| Template message | First contact or outside 24hr window | Uses pre-approved template, variables injected at send time |
| Session message (free-form) | Within 24hr window after user sends a message | Free text, any format |
| Interactive message | Buttons, list pickers for chatbot flows | Uses `interactive` type in Meta API |
| Media message | Images, documents, audio | Upload to Supabase Storage → send media_id to Meta |

#### Outbound Message Queue

The message queue is implemented using a PostgreSQL table (`message_queue`) with status-based state machine processing. This avoids the need for a separate message broker (Redis/RabbitMQ) for the initial scale target.

```
message_queue table:
- id (UUID)
- workspace_id
- contact_id
- message_type
- payload (JSONB)
- status: 'pending' | 'processing' | 'sent' | 'failed' | 'cancelled'
- scheduled_at (for future messages)
- attempt_count
- last_error
- created_at
- updated_at
- wamid (populated after successful send)
```

A Vercel Cron Job runs every 30 seconds and processes pending messages in batches. The job:

1. Selects the oldest N pending messages (where scheduled_at <= NOW()) using SELECT FOR UPDATE SKIP LOCKED to prevent double-processing.
2. Groups messages by workspace to apply per-workspace rate limits.
3. Sends each message to the Meta API.
4. Updates status to `sent` or `failed` accordingly.

#### Retry Logic and Failure Handling

Transient failures (network errors, Meta API 5xx responses) are retried with exponential backoff:

| Attempt | Delay |
|---|---|
| 1st retry | 30 seconds |
| 2nd retry | 5 minutes |
| 3rd retry | 30 minutes |
| 4th+ retry | Message marked failed, tenant notified |

Permanent failures (invalid phone number, opted-out contact, template rejected) are immediately marked as `failed` without retrying.

#### Delivery Status Webhooks

After a message is sent, Meta asynchronously delivers status updates via webhook:

- `sent`: Meta's API accepted the message
- `delivered`: Message delivered to the recipient's device
- `read`: Recipient opened the message
- `failed`: Delivery failed (device unreachable, number blocked)

Each webhook event is processed by the webhook receiver, matched to the original message by `wamid`, and the message record is updated. The status update is simultaneously broadcast via Supabase Realtime so the dashboard inbox updates live.

#### Message Deduplication

To prevent duplicate messages (e.g., if a webhook arrives twice), each outbound message carries an idempotency key derived from the sending context. The `wamid` returned by Meta is a globally unique identifier — if a duplicate send is attempted for the same logical message, the system checks for an existing record with the same idempotency key and skips re-sending.

### 3.4 Contact Management System

#### Contact Import Methods

Tenants can populate their contact list through three methods:

1. **CSV Upload**: Tenant uploads a CSV file. The server-side import pipeline validates phone numbers (E.164 format normalization), deduplicates against existing contacts, and bulk-inserts into the `contacts` table. Large imports (100k+ rows) are processed asynchronously with progress tracking.

2. **Manual Entry**: Single contact form in the dashboard for adding individual contacts with name, phone number, custom attributes.

3. **API Ingestion**: Authenticated REST API endpoint that third-party systems (CRMs, booking platforms) can call to create/update contacts. This is the primary integration path for automated pipelines like meeting-booking-to-WhatsApp workflows.

#### Contact Segmentation and Tagging

Contacts support a flexible tagging system. Tags are free-form strings stored as a PostgreSQL array on the `contacts` record. Common use cases:

- Source tags: `imported`, `api`, `manual`, `form-lead`
- Lifecycle tags: `new-lead`, `customer`, `churned`
- Campaign tags: `campaign-jan-2026`, `webinar-attendee`
- Custom business tags: `premium`, `bangalore`, `enterprise`

Contacts can be segmented by combining tag filters, custom attribute filters (e.g., industry = "healthcare"), and activity filters (e.g., "last messaged more than 30 days ago"). Segments are used as campaign audience selectors.

#### Opt-In / Opt-Out Compliance

WhatsApp's terms of service require that businesses only message users who have explicitly opted in. SNS Chat enforces:

- **Opt-in capture**: Contacts have an `opted_in` boolean and `opted_in_at` timestamp. Messages cannot be sent to contacts where `opted_in = false`.
- **Opt-out handling**: If a contact replies with a standard opt-out keyword (STOP, UNSUBSCRIBE) or if Meta returns an opt-out error code, the contact is immediately marked `opted_in = false`. No further messages are sent.
- **GDPR compliance**: Contact records include a `data_source` field (where the contact data came from) and support right-to-erasure via a delete API. Deleted contacts are fully purged, not soft-deleted, to comply with GDPR Article 17.
- **TRAI DLT**: For the Indian market, DLT-registered sender IDs and template IDs can be stored per workspace for regulatory compliance.

#### Contact Enrichment

The contacts table supports a `custom_attributes` JSONB column that tenants can use to store domain-specific data (meeting time, booking reference, subscription tier, etc.). This data is available as template variables when sending personalized messages. The API allows PATCH updates to custom_attributes, enabling CRM systems to keep SNS Chat contact records in sync.

### 3.5 Automation Engine

#### Trigger Types

The automation engine supports three categories of triggers:

| Trigger Category | Examples |
|---|---|
| Time-based | "Send a reminder 3 hours before the meeting" |
| Event-based | "When a new contact is created via API, send a welcome message" |
| Reply-based | "When a contact replies with 'YES', mark as confirmed and add tag 'confirmed'" |

**Time-based triggers** are implemented using Supabase's `pg_cron` extension or Vercel Cron Jobs that query the `scheduled_messages` table for jobs due within the next processing window.

**Event-based triggers** are implemented using PostgreSQL triggers and Supabase database webhooks. When a row is inserted into the `contacts` table (for example), a database function fires and evaluates all active automation flows for that workspace against the new contact's attributes.

**Reply-based triggers** are evaluated in the webhook receiver. When an inbound message arrives, the system checks if any active automation flow has a reply-based trigger matching the message content (keyword match or regex). If matched, the flow continues to the next step.

#### Flow Builder Logic

Automation flows are stored as a directed acyclic graph (DAG) in JSONB format. Each flow consists of nodes and edges:

```json
{
  "flow_id": "uuid",
  "workspace_id": "uuid",
  "name": "Meeting Confirmation Flow",
  "trigger": {
    "type": "event",
    "event": "contact.created",
    "conditions": [{"field": "tag", "operator": "contains", "value": "meeting-booked"}]
  },
  "nodes": [
    {"id": "n1", "type": "send_template", "template_id": "uuid", "variables": {"1": "{{contact.name}}", "2": "{{contact.meeting_time}}"}},
    {"id": "n2", "type": "wait", "duration": "3h"},
    {"id": "n3", "type": "condition", "condition": {"field": "last_reply_keyword", "operator": "equals", "value": "YES"}},
    {"id": "n4", "type": "send_template", "template_id": "uuid"},
    {"id": "n5", "type": "tag_contact", "tag": "confirmed"},
    {"id": "n6", "type": "send_template", "template_id": "uuid"}
  ],
  "edges": [
    {"from": "n1", "to": "n2"},
    {"from": "n2", "to": "n3"},
    {"from": "n3", "to": "n4", "condition": "true"},
    {"from": "n3", "to": "n6", "condition": "false"},
    {"from": "n4", "to": "n5"}
  ]
}
```

The flow executor reads this JSON, maintains a per-contact execution state record, and advances the state machine as conditions are met.

#### Meeting Confirmation Flow (Canonical Example)

This is the primary use case for SNS Chat and warrants explicit documentation:

```
Step 1: Contact is created via API with tag "meeting-booked" and custom attributes
        {meeting_time: "2026-04-01T10:00:00+05:30", meeting_link: "https://..."}

Step 2: Automation trigger fires → send confirmation template
        "Hi {{name}}, your meeting is confirmed for {{meeting_time}}.
         Join here: {{meeting_link}}. Reply YES to confirm."

Step 3: Wait for reply (up to 24 hours)
        - If reply = "YES": Tag contact "confirmed", send "Great! See you then."
        - If reply = "CANCEL": Tag contact "cancelled", send cancel confirmation
        - If no reply in 24h: Send reminder nudge

Step 4: 3 hours before meeting_time: Send reminder
        "Reminder: Your meeting starts in 3 hours. {{meeting_link}}"

Step 5: 30 minutes before meeting_time: Send final reminder
        "Your meeting starts in 30 minutes. Click to join: {{meeting_link}}"

Step 6: 1 hour after meeting_time: Send follow-up
        "Thanks for meeting with us! Here's what we discussed..."
```

All timing calculations use the meeting_time stored in contact custom_attributes, with timezone handling to ensure correct scheduling in IST.

#### Broadcast Campaigns

A broadcast campaign sends a template message to a filtered segment of contacts at a scheduled time. Campaign execution:

1. Tenant creates a campaign: selects template, audience segment, scheduled time.
2. At scheduled time, the campaign runner queries matching contacts.
3. It creates message_queue entries for each contact in batches of 500.
4. The message queue processor dispatches messages, respecting per-workspace rate limits.
5. Campaign analytics are updated in real time as delivery statuses arrive.

### 3.6 Analytics and Reporting

#### Message Delivery Rates

For every campaign and automation flow, the system tracks:

| Metric | Definition |
|---|---|
| Sent | Message accepted by Meta API (wamid assigned) |
| Delivered | Delivery webhook received from Meta |
| Read | Read receipt webhook received |
| Failed | Permanent failure (invalid number, opt-out, blocked) |
| Pending | In queue, not yet sent |

Delivery rate = Delivered / Sent. Read rate = Read / Delivered. These are the primary engagement metrics surfaced in the dashboard.

#### Campaign Performance Dashboard

Per-campaign analytics are pre-aggregated by a periodic background job (not computed on every query) to avoid expensive COUNT queries on large message tables. Aggregated stats are stored in a `campaign_stats` table updated every 5 minutes.

#### Tenant Usage Metrics for Billing

Usage tracking is critical for billing accuracy. The platform records:

- Messages sent per workspace per day (rolling 30-day counter)
- Active contacts count (contacts messaged at least once in the last 30 days)
- Campaign count per billing period
- API calls per day per workspace

These counters are maintained as separate aggregate tables, updated on each message send event. They are the authoritative source for billing cycle calculations.

### 3.7 Billing and Subscription System

#### Subscription Plans

| Plan | Price (INR/month) | Message Credits | Team Members | Contacts |
|---|---|---|---|---|
| Starter | 999 | 3,000 | 2 | 5,000 |
| Growth | 2,999 | 15,000 | 10 | 50,000 |
| Scale | 7,999 | 60,000 | Unlimited | Unlimited |
| Enterprise | Custom | Custom | Unlimited | Unlimited |

Message credits are consumed per message sent. Credits over the plan limit incur overage billing at INR 0.30 per additional message (subject to plan tier).

#### Razorpay Integration

Razorpay is used for all payment processing. The integration covers:

1. **Subscription creation**: When a tenant selects a plan, a Razorpay subscription object is created with the appropriate plan ID. Razorpay handles recurring billing via auto-debit from saved payment method.

2. **Checkout flow**: Razorpay's hosted checkout is embedded in the SNS Chat billing page. On successful payment, Razorpay calls the SNS Chat webhook with the subscription activation event.

3. **Webhook processing**: `POST /api/webhooks/razorpay` receives payment events (subscription.activated, subscription.charged, subscription.cancelled, payment.failed). Each event is verified using Razorpay's HMAC signature. The workspace subscription status in the database is updated accordingly.

4. **Invoice generation**: Razorpay generates GST-compliant invoices automatically for Indian businesses. SNS Chat stores invoice links per billing period and makes them accessible to the Owner role in the billing settings page.

5. **Failed payment handling**: If a payment fails, Razorpay retries automatically. SNS Chat receives a `payment.failed` webhook and sends the workspace owner an email notification. After 3 failed attempts, the workspace is downgraded to a restricted state (read-only) pending payment resolution.

#### Plan Enforcement and Quota Checks

Before every outbound message is queued, the application performs:

1. Workspace subscription status check: Must be `active`.
2. Message credit balance check: Current month usage < plan limit + purchased overage.
3. Contact limit check: Active contact count < plan contact limit.

If any check fails, the message is rejected with a 402 Payment Required error. This prevents surprises on the billing statement and ensures tenants cannot accidentally overspend.

#### Usage-Based Billing for Overage

Overage is tracked at the per-workspace level. At the end of each billing cycle, if a workspace has consumed more messages than their plan includes, Razorpay is used to create an add-on charge for the overage amount. This is handled via Razorpay's addon API on the subscription object.

### 3.8 Admin and Dashboard

#### Tenant Onboarding Flow

New tenant registration follows this sequence:

1. Sign up at sns.chat.anantasutra.com (email + password).
2. Email verification (Supabase Auth built-in).
3. Business profile setup: company name, industry, timezone, GST number (optional).
4. Plan selection and first payment via Razorpay.
5. WhatsApp connection: Embedded Signup flow to connect WABA.
6. Template creation or import from Meta.
7. First message send (onboarding guided flow).

An onboarding checklist is shown in the dashboard until all steps are complete, tracking completion percentage per workspace.

#### Conversation Inbox

The shared team inbox is a central view of all ongoing WhatsApp conversations for a workspace. Key features:

- **All conversations** view: All contacts who have sent or received messages, sorted by last activity.
- **Assigned conversations**: Filter by assigned agent.
- **Unread filter**: Conversations with unread inbound messages.
- **Search**: Full-text search across contact names and message content.
- **Real-time updates**: Supabase Realtime broadcasts new messages and status changes to all connected dashboard sessions for the workspace.
- **Reply panel**: Agents can type and send session replies directly from the inbox within the 24-hour window.
- **Notes**: Internal notes on a conversation thread (not sent to the contact).

#### Team Management

The Owner can invite team members by email. Invited users receive a magic link (Supabase Auth invite flow). Once accepted, they are added to the `workspace_members` table with the assigned role. Role changes and member removal are instant.

#### API Key Management

Each workspace can generate named API keys for external integrations. API keys are hashed (SHA-256) before storage — the plaintext key is shown only once at creation time. External systems use the API key in the `X-API-Key` header to authenticate API calls for that workspace, bypassing the user JWT flow.

---

## 4. Data Architecture

### 4.1 High-Level Data Model

The following describes the primary tables and their relationships:

```
tenants
  id, name, slug, created_at, settings (JSONB), status

workspace_members
  id, workspace_id (FK: tenants), user_id (FK: auth.users), role, invited_at, joined_at

workspace_credentials
  id, workspace_id, waba_id, phone_number_id, access_token_encrypted, access_token_iv, token_expires_at

contacts
  id, workspace_id, phone_number (E.164), name, email, tags (text[]),
  custom_attributes (JSONB), opted_in, opted_in_at, opted_out_at, created_at

contact_import_jobs
  id, workspace_id, filename, status, total_rows, processed_rows, error_count, created_at

message_templates
  id, workspace_id, name, category, language, components (JSONB), status, meta_template_id, created_at

conversations
  id, workspace_id, contact_id, status (open/closed/snoozed), assigned_agent_id, last_message_at

messages
  id, workspace_id, conversation_id, contact_id, direction (inbound/outbound),
  message_type, content (JSONB), status, wamid, scheduled_at, sent_at, delivered_at, read_at,
  error_code, error_message, campaign_id, flow_execution_id, created_at

message_queue
  id, workspace_id, contact_id, message_type, payload (JSONB),
  status, scheduled_at, attempt_count, last_error, idempotency_key, created_at

campaigns
  id, workspace_id, name, template_id, segment_definition (JSONB), scheduled_at,
  status, total_contacts, messages_sent, created_at

campaign_stats
  id, campaign_id, sent, delivered, read, failed, last_updated_at

automation_flows
  id, workspace_id, name, trigger (JSONB), nodes (JSONB), edges (JSONB), status, created_at

flow_executions
  id, flow_id, workspace_id, contact_id, current_node_id, state (JSONB), status, started_at, completed_at

subscriptions
  id, workspace_id, plan (starter/growth/scale/enterprise), status,
  razorpay_subscription_id, current_period_start, current_period_end, message_credits_used

invoices
  id, workspace_id, razorpay_invoice_id, amount_inr, gst_amount, total_inr,
  status, billing_period_start, billing_period_end, razorpay_invoice_url, created_at

api_keys
  id, workspace_id, name, key_hash, last_used_at, created_by, created_at

audit_logs
  id, workspace_id, user_id, action, resource_type, resource_id, metadata (JSONB), ip_address, created_at

webhook_events
  id, workspace_id, source (meta/razorpay), event_type, payload (JSONB),
  processed, processing_error, received_at, processed_at
```

### 4.2 Data Isolation Strategy

Every application table includes a `workspace_id` column. RLS policies are defined as:

```sql
CREATE POLICY "workspace_isolation" ON messages
  USING (workspace_id = (auth.jwt()->>'tenant_id')::uuid);
```

This policy applies to SELECT, INSERT, UPDATE, and DELETE operations. Service-role access (used only in server-side worker processes) bypasses RLS — this is acceptable because workers run in a trusted server environment, not in user-facing request handlers.

For additional safety, all foreign key relationships are validated at the database level, preventing orphaned rows that could bypass tenant context.

### 4.3 Data Retention Policies

| Data Category | Retention Period | Deletion Method |
|---|---|---|
| Messages (content) | 12 months | Rolling delete job via pg_cron |
| Delivery status events | 12 months | Same rolling delete |
| Audit logs | 24 months | Archival to cold storage (Supabase S3-compatible) |
| Webhook events (raw) | 30 days | Rolling delete |
| Contact records | Until tenant requests deletion (GDPR) | Hard delete on request |
| Campaign stats (aggregated) | Unlimited | Never deleted (no PII) |
| Billing records / Invoices | 7 years | Legal retention requirement (India GST) |

Tenants can configure custom retention periods on paid plans (Growth and above) to comply with their own data governance policies.

---

## 5. Integration Architecture

### 5.1 Meta WhatsApp Cloud API Integration Patterns

SNS Chat interacts with Meta's Graph API across four primary flows:

**Pattern 1: Outbound Message Send**
```
Server → POST https://graph.facebook.com/v18.0/{phone-number-id}/messages
Headers: Authorization: Bearer {system_user_token}
Body: {messaging_product: "whatsapp", to: "+919XXXXXXXXXX", type: "template", ...}
Response: {messages: [{id: "wamid.XXX"}]}
```

**Pattern 2: Template Submission**
```
Server → POST https://graph.facebook.com/v18.0/{waba-id}/message_templates
Body: {name, category, language, components: [...]}
Response: {id, status: "PENDING"}
```

**Pattern 3: Inbound Webhook**
```
Meta → POST https://sns.chat.anantasutra.com/api/webhooks/meta
Headers: X-Hub-Signature-256: sha256=HMAC_VALUE
Body: {object: "whatsapp_business_account", entry: [...]}
```

**Pattern 4: Token Exchange (Embedded Signup)**
```
Server → GET https://graph.facebook.com/v18.0/oauth/access_token
         ?client_id=APP_ID&client_secret=APP_SECRET&code=AUTH_CODE
Response: {access_token, token_type: "bearer"}
```

All outbound calls to Meta use the system user token (not user tokens), ensuring the integration remains active even if an individual Facebook user's login session expires.

### 5.2 Webhook Handling Architecture

The webhook receiver at `/api/webhooks/meta` must be highly reliable. Its design prioritizes:

1. **Fast acknowledgment**: Respond HTTP 200 within 5 seconds (Meta's SLA requirement). Processing happens after the response.
2. **Idempotent processing**: If Meta delivers the same webhook event twice, processing it twice should not cause double-delivery or duplicate records. Each webhook event is stored in the `webhook_events` table with the event ID from Meta. Before processing, the system checks if the event ID has already been processed.
3. **Failure isolation**: If database writes fail, the raw webhook payload is stored first, then processing is retried asynchronously. No webhook event is lost.
4. **Signature verification**: HMAC-SHA256 verification is the first step, before any database operations. Malformed or unsigned requests are rejected immediately with 401.

### 5.3 Razorpay Payment Webhooks

Razorpay sends events to `https://sns.chat.anantasutra.com/api/webhooks/razorpay`.

Relevant event types:

| Event | Action |
|---|---|
| subscription.activated | Set workspace subscription status to `active`, provision message credits |
| subscription.charged | Record invoice, reset monthly usage counters |
| subscription.cancelled | Mark subscription as `cancelled`, schedule workspace deactivation |
| subscription.completed | End of subscription term |
| payment.failed | Notify workspace owner, increment failed payment counter |
| refund.created | Record refund, update invoice record |

All Razorpay webhook events are HMAC-SHA256 verified using the Razorpay webhook secret. The raw payload and signature are stored in `webhook_events` before processing. Processing is idempotent — each Razorpay event ID is recorded, and duplicate events are silently ignored.

### 5.4 Supabase Realtime for Live Inbox

The conversation inbox uses Supabase Realtime to push live updates to connected browser sessions without polling.

Implementation approach:

- The database webhook (Supabase logical replication) emits changes on the `messages` and `conversations` tables.
- Supabase Realtime broadcasts these changes to all subscribing clients.
- The Next.js client subscribes to the Realtime channel for the workspace when the inbox page mounts.
- New messages, status updates (delivered, read), and conversation state changes update the UI in real time.

```javascript
// Client-side Realtime subscription
supabase
  .channel(`workspace:${workspaceId}:messages`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `workspace_id=eq.${workspaceId}`
  }, handleNewMessage)
  .subscribe();
```

Security note: Supabase Realtime channels are protected by the same RLS policies. A user can only subscribe to channels for their own workspace — attempting to subscribe to another workspace's channel returns no data, not an error (RLS silently filters).

---

## 6. Security Architecture

### 6.1 Tenant Data Isolation

The primary isolation mechanism is PostgreSQL RLS (documented in Section 4.2). Beyond RLS, additional layers are:

- **Middleware validation**: Next.js middleware validates the JWT on every protected route. Expired or tampered JWTs are rejected before any database operation.
- **Workspace membership check**: Even with a valid JWT, users must be members of the target workspace. A user who was removed from a workspace cannot access it even with an existing JWT, because the workspace_members lookup will return no record.
- **API key scoping**: API keys are scoped to a single workspace. They cannot be used to access another workspace's data even if obtained.

### 6.2 Credential Encryption

WhatsApp access tokens (stored in `workspace_credentials`) are encrypted using AES-256-GCM:

- **At rest**: Encrypted ciphertext stored in the database. The database administrator cannot read the plaintext token.
- **In transit**: All traffic is HTTPS/TLS 1.3. Supabase enforces TLS. Vercel enforces TLS. Meta Graph API requires HTTPS.
- **Key management**: The AES key is stored as a Vercel environment variable, never in the codebase or database. Key rotation is supported by re-encrypting all credentials with the new key.

### 6.3 API Authentication

External API consumers authenticate using workspace-scoped API keys:

1. API key is created by the workspace Owner.
2. The plaintext key (a random 32-byte hex string) is shown once and never again.
3. The key is SHA-256 hashed before storage. The stored hash cannot be reversed to the plaintext key.
4. On each API request, the `X-API-Key` header is hashed and compared to stored hashes.
5. Matched hash identifies the workspace. The request is authorized with service-role access scoped to that workspace.
6. Failed authentication attempts are rate-limited to prevent brute-force.

### 6.4 Rate Limiting

Rate limiting is applied at multiple layers:

| Layer | Mechanism | Limit |
|---|---|---|
| Vercel Edge Middleware | IP-based rate limiter | 100 requests/min per IP for auth endpoints |
| API routes | Workspace-based rate limiter | 600 API calls/min per workspace |
| Message sending | Per-workspace daily message quota (plan-based) | Plan-defined credit limit |
| Meta API calls | Application-level tokens bucket | ~80 msg/s per phone number |

### 6.5 Audit Logging

All sensitive operations are recorded in the `audit_logs` table:

- Authentication events (login, logout, failed login)
- Workspace settings changes
- API key creation and deletion
- Team member role changes
- Contact data exports
- WhatsApp credential connection and disconnection
- Billing plan changes

Audit logs are append-only at the database level (no UPDATE or DELETE policy for the `audit_logs` table, even via service role). Logs are retained for 24 months per the data retention policy.

### 6.6 Input Validation and Sanitization

All external inputs are validated at the API boundary:

- Phone numbers are validated and normalized to E.164 format using a phone number parsing library.
- Template variable values are sanitized to prevent WhatsApp formatting injection.
- File uploads (CSV imports) are scanned for file type and size limits before processing.
- SQL injection is inherently prevented by using Supabase's parameterized query client.
- File path traversal is prevented by validating storage paths against a workspace prefix whitelist.

---

## 7. Scalability and Performance

### 7.1 Horizontal Scaling Strategy

The architecture is designed to scale horizontally on each tier independently:

**Application tier (Vercel)**: Vercel automatically scales serverless functions. Individual functions are stateless — each invocation is independent. No manual scaling configuration is needed. The system can handle thousands of concurrent requests without any intervention.

**Database tier (Supabase)**: Supabase managed PostgreSQL scales vertically (larger instance) and supports read replicas for read-heavy workloads. The primary bottleneck at 1,000 tenants / 10M messages is the write throughput of the message_queue table. This is mitigated by:

- Using `pg_partitioning` on the messages table by month, reducing index sizes and improving query performance.
- Connection pooling via PgBouncer (Supabase's built-in pooler) ensures Vercel's serverless functions (which create many short-lived connections) do not exhaust PostgreSQL connection limits.

**Messaging throughput**: At 10M messages per month, average throughput is ~3.9 messages/second. Peak throughput (during broadcast campaigns) could spike to 500 messages/second. This requires:

- Parallel message queue processors: Multiple concurrent Vercel Cron invocations, each processing a shard of the queue (partitioned by workspace_id modulo N).
- If throughput requirements exceed what PostgreSQL-as-queue can handle, a dedicated queue service (Upstash QStash or AWS SQS) can be introduced as an upgrade path.

### 7.2 Database Indexing Strategy

Critical indexes for query performance:

```sql
-- Message queue: polling for pending messages
CREATE INDEX idx_message_queue_status_scheduled ON message_queue(status, scheduled_at)
  WHERE status = 'pending';

-- Messages: conversation view (most common query)
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id, created_at DESC);

-- Contacts: workspace contact list with tag filter
CREATE INDEX idx_contacts_workspace_tags ON contacts USING GIN(workspace_id, tags);

-- Contacts: phone number lookup (deduplication on import)
CREATE UNIQUE INDEX idx_contacts_workspace_phone ON contacts(workspace_id, phone_number);

-- Flow executions: find active executions for a contact
CREATE INDEX idx_flow_executions_contact ON flow_executions(workspace_id, contact_id, status)
  WHERE status = 'active';

-- Audit logs: time-range queries per workspace
CREATE INDEX idx_audit_logs_workspace_time ON audit_logs(workspace_id, created_at DESC);
```

### 7.3 CDN for Media Messages

When tenants send media messages (images, documents), the media is stored in Supabase Storage and served via a CDN-backed URL. The flow:

1. Tenant uploads media to the SNS Chat dashboard.
2. File is stored in Supabase Storage under `/{workspace_id}/media/{filename}`.
3. Supabase Storage generates a signed CDN URL.
4. The CDN URL is passed to the Meta WhatsApp API as the `link` parameter.
5. Meta fetches the media from the CDN URL (not from the origin storage directly), distributing load.

This ensures media delivery is fast globally and does not create load on the Supabase origin.

### 7.4 Caching Strategy

| Data | Cache Layer | TTL |
|---|---|---|
| Workspace subscription status | In-memory (per-request context) | Per request |
| Message template list | Next.js server-side cache | 5 minutes |
| Campaign stats aggregates | Materialized view (PostgreSQL) | Refreshed every 5 minutes |
| Contact segment counts | Pre-computed on contact change | Invalidated on contact update |
| Static assets (JS, CSS) | Vercel Edge CDN | Immutable (content hash URLs) |

---

## 8. Deployment Architecture

### 8.1 Vercel for Next.js

The Next.js application is deployed to Vercel with the following configuration:

- **Production**: `sns.chat.anantasutra.com` — mapped to Vercel project's production branch (main).
- **Preview**: `preview-*.vercel.app` — auto-deployed on every pull request for QA review.
- **Framework**: Next.js 14 App Router with Partial Prerendering (PPR) enabled for marketing pages.
- **Serverless functions**: API routes compile to individual serverless functions with a 60-second timeout (Vercel Pro). Long-running processes (CSV imports, campaign dispatch) use streaming responses or queue delegation to stay within limits.
- **Edge middleware**: Rate limiting and JWT pre-validation run as Edge Middleware (Vercel Edge Runtime) at the CDN level, before requests reach serverless functions.
- **Cron jobs**: Vercel Cron Jobs (defined in vercel.json) trigger the message queue processor and scheduled reminders every 30 seconds.

### 8.2 Supabase Managed Infrastructure

Supabase handles the following infrastructure components:

- **PostgreSQL**: Managed PostgreSQL instance with automated backups (daily, 7-day retention), point-in-time recovery (PITR) enabled on Pro plan.
- **Auth**: Supabase Auth service, handles JWT issuance, magic links, and OAuth providers (Google).
- **Storage**: S3-compatible object storage backed by a CDN.
- **Realtime**: WebSocket-based change data capture (CDC) for live updates.
- **Edge Functions**: Supabase Edge Functions can be used for custom webhook processing if Vercel cold-start latency is unacceptable for the 5-second Meta webhook acknowledgment window.

### 8.3 Environment Management

| Environment | Purpose | URL | Branch |
|---|---|---|---|
| Development | Local developer machines | localhost:3000 | feature/* |
| Staging | Pre-production testing | staging.sns.chat.anantasutra.com | staging |
| Production | Live customer traffic | sns.chat.anantasutra.com | main |

Each environment has separate:
- Supabase project (separate PostgreSQL instance, separate JWT secrets)
- Razorpay credentials (Razorpay test mode for dev/staging, live mode for production)
- Meta App credentials (Meta test app for dev/staging, production app for production)
- Vercel environment variables per environment scope

This separation ensures no test data pollutes production and no test payments affect billing.

### 8.4 CI/CD Pipeline

```
Developer Push
      |
      v
GitHub Actions Workflow
      |
      +-- Lint (ESLint + TypeScript check)
      +-- Unit Tests (Jest)
      +-- Integration Tests (Supabase local emulator)
      |
      v (on success)
Vercel Preview Deployment
      |
      v
QA Review on Preview URL
      |
      v (PR approved + merged to main)
Vercel Production Deployment
      |
      +-- Supabase migration run (npx supabase db push)
      +-- Smoke tests against production
      |
      v
Production Live
```

Database migrations are managed using Supabase CLI (`supabase/migrations/` directory). Migrations are run as part of the deployment pipeline using the service role key. All migrations are forward-only (no rollback scripts) to avoid accidental data loss in production.

---

## 9. Key Technical Decisions and Trade-offs

### 9.1 Next.js App Router vs Separate Backend

**Decision**: Use Next.js App Router API routes as the backend, not a separate Express/NestJS/FastAPI service.

**Rationale**:
- Eliminates the need to deploy, maintain, and scale a separate backend service.
- Vercel handles deployment, scaling, and SSL for both frontend and API in one unit.
- Next.js Server Components allow data fetching close to the database without a separate API hop.
- The TypeScript type system is shared between frontend components and API handlers, reducing interface drift bugs.

**Trade-offs**:
- Vercel serverless function cold starts (typically 200-800ms) can add latency on the first request. Mitigated by keeping functions small and using edge middleware.
- 60-second function timeout limits suitability for long-running jobs. Mitigated by offloading long work to the message queue.
- Monorepo deployment — if the backend needs to scale independently of the frontend (e.g., separate compute for queue processing), the architecture would need to be split. Not a concern at the current scale target.

### 9.2 Supabase vs Firebase

**Decision**: Supabase (PostgreSQL) over Firebase (Firestore).

**Rationale**:
- Relational data model fits the domain naturally. Messages, contacts, campaigns, and billing have strong relational requirements (foreign keys, joins, transactions). Firestore is a document database that does not support joins natively.
- Row Level Security in PostgreSQL is a superior multi-tenant isolation mechanism compared to Firestore's security rules, which operate at the collection/document level and are harder to reason about for complex access patterns.
- SQL aggregations for analytics (campaign stats, usage metrics) are straightforward in PostgreSQL. Equivalent queries in Firestore require client-side aggregation or expensive Cloud Functions.
- Supabase's open-source nature means no vendor lock-in — the stack can be migrated to a self-hosted PostgreSQL instance if needed.

**Trade-offs**:
- Supabase has less mature mobile SDK support compared to Firebase. Not relevant for SNS Chat (no mobile app).
- Supabase Realtime, while functional, has fewer features than Firebase's real-time database for complex sync scenarios. Sufficient for the inbox use case.

### 9.3 Razorpay vs Stripe

**Decision**: Razorpay for payment processing.

**Rationale**:
- Razorpay is India's dominant payment gateway with native support for UPI, NetBanking, IMPS, and all Indian payment instruments. Stripe's UPI support is limited in India.
- Razorpay provides GST-compliant invoice generation, which is a legal requirement for business-to-business transactions in India.
- Razorpay's subscription billing API handles Indian payment methods natively, including auto-debit via NACH mandate.
- Lower transaction fees for Indian merchants on Razorpay (approximately 2%) vs Stripe (approximately 3% + currency conversion).

**Trade-offs**:
- If AnantaSutra expands globally, Razorpay's international payment support is limited. Stripe or Paddle would be required for non-Indian markets. The billing abstraction layer in SNS Chat is designed to support swapping payment gateways per region.

### 9.4 Shared DB vs Per-Tenant DB

**Decision**: Shared database with RLS, not per-tenant databases.

**Rationale**:
- A per-tenant database approach (one PostgreSQL instance per customer) would require provisioning infrastructure for each of the 1,000 tenants — operationally complex and expensive at this scale.
- Supabase does not natively support per-tenant database provisioning.
- RLS-based isolation is the industry-standard approach for multi-tenant SaaS at this scale (used by Vercel, Supabase itself, Linear, Notion, and most SaaS products under 10,000 tenants).
- Cross-tenant analytics (for AnantaSutra's own business intelligence) are trivially possible with a shared database by using service-role queries.

**Trade-offs**:
- A compromised service-role key could access all tenants' data. Mitigated by strict key management, audit logging, and limiting service-role usage to server-side workers only.
- A "noisy neighbor" tenant (e.g., running a 1M-contact broadcast) could affect other tenants' query performance. Mitigated by application-level rate limiting and PostgreSQL's `work_mem` and connection pooling settings.
- GDPR erasure requests require row deletion across all tables for a specific tenant, rather than dropping a database. This is handled by a cascading delete operation triggered by tenant account closure.

### 9.5 Sync vs Async Message Sending

**Decision**: Async message sending via a queue (not synchronous API calls to Meta).

**Rationale**:
- Meta's API has variable latency (typically 100ms to 2s). Synchronous sending would block the user-facing API for that duration on every message.
- For broadcast campaigns (10,000+ messages), synchronous sending would require a request that runs for hours — impossible within any serverless function timeout.
- A queue provides natural rate limiting (the processor controls the throughput) and retry logic without complicating the sending path.
- The 202 Accepted pattern (enqueue and return immediately) provides a better developer experience for API consumers.

**Trade-offs**:
- Messages are not sent instantly — there is a processing delay (up to 30 seconds based on cron interval). For most use cases (reminders, confirmations) this is acceptable. For time-critical messages, the cron interval can be reduced to 10 seconds.
- Monitoring queue depth and processing lag requires additional observability tooling (dashboards on the message_queue table).

---

## 10. System Constraints and Limitations

### 10.1 Meta API Rate Limits

Meta WhatsApp Cloud API imposes hard limits that no amount of engineering can bypass:

| Constraint | Value | Impact |
|---|---|---|
| Business-initiated messages per day | 1,000 (Tier 1), scaling to unlimited | New WhatsApp Business Accounts start at 1,000/day. Tier increases automatically as volume grows without issues. |
| Marketing message daily cap | Variable (Meta algorithm determines based on engagement) | Tenants with poor message quality may face unexpected caps |
| API throughput | ~80 messages/second per phone number | Cannot burst higher; excess requests get rate-limited with error code 131056 |
| Template categories | Utility, Marketing, Authentication | Each has different conversation pricing |
| Maximum template components | 10 components per template | Limits template complexity |

SNS Chat handles Meta rate limit errors (error code 131056) by requeueing the message with a backoff delay. The tenant's dashboard shows real-time queue depth and estimated delivery time when rate limiting is in effect.

### 10.2 Vercel Function Timeout Limits

Vercel serverless functions have a maximum execution time:

| Plan | Timeout |
|---|---|
| Vercel Hobby | 10 seconds |
| Vercel Pro | 60 seconds |
| Vercel Enterprise | 300 seconds |

SNS Chat requires Vercel Pro at minimum. Operations that could exceed 60 seconds (large CSV imports, campaign audience calculation for 50,000+ contacts) are decomposed into smaller async tasks:

- CSV import: File is uploaded to Supabase Storage, then processed in batches by a cron job (not a single function call).
- Campaign launch: Audience query + queue insertion is paginated in batches of 1,000 contacts per function invocation, with a job status record tracking overall progress.

### 10.3 Supabase Limits

| Limit | Supabase Pro Plan Value | Notes |
|---|---|---|
| Database size | 8GB (extendable) | At 1,000 tenants with 12-month message retention, estimated 4-6GB |
| Realtime concurrent connections | 500 | At 2,000 concurrent dashboard users, this is a bottleneck. Mitigation: upgrade to Supabase Team plan (unlimited Realtime connections) |
| Storage | 100GB | Sufficient for media files at current scale |
| Edge Function invocations | 2M/month | Sufficient |
| Auth users | Unlimited on Pro | No constraint |

The most likely constraint to be hit first is Realtime concurrent connections. The mitigation is to use a more targeted Realtime subscription strategy (subscribe only to the active conversation's channel, not the entire workspace) to reduce the number of simultaneous Realtime connections per browser tab.

### 10.4 Known Bottlenecks and Mitigation Plan

| Bottleneck | Risk Level | Mitigation |
|---|---|---|
| PostgreSQL as message queue | Medium | At >5,000 tenants or >50M messages/month, migrate to Upstash QStash or AWS SQS |
| Shared database noisy neighbor | Low | Application-level quotas prevent any single tenant from dominating |
| Vercel cold start latency for webhooks | Medium | Use Supabase Edge Functions (always warm) for the Meta webhook endpoint |
| Single Meta webhook endpoint for all tenants | Low | The endpoint is stateless and fast (writes to DB, returns 200). Scales linearly with Vercel function instances |
| Supabase Realtime connection limit | Medium | Upgrade plan, or implement WebSocket proxy layer |
| Large CSV imports (500k+ contacts) | Low | Chunked async processing with progress polling |

### 10.5 Compliance and Regulatory Constraints

| Regulation | Requirement | Implementation |
|---|---|---|
| WhatsApp Business Policy | Opt-in required; no spam | Opt-in enforcement at contact level; opt-out auto-detection |
| GDPR (if EU customers) | Right to erasure, data portability | Contact delete API, data export API |
| TRAI DLT (India bulk SMS adjacent) | DLT registration for bulk WhatsApp | DLT template ID storage per workspace; compliance is tenant's responsibility |
| India GST | GST-compliant invoices | Razorpay invoice generation with GSTIN |
| Data localisation (India) | Financial data must remain in India | Razorpay stores payment data in India; Supabase region selection: ap-south-1 (Mumbai) |

---

## Appendix: Technology Stack Summary

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Frontend | Next.js | 14 (App Router) | UI and server-side rendering |
| Language | TypeScript | 5.x | Type safety across full stack |
| Database | PostgreSQL (via Supabase) | 15 | Primary data store |
| Auth | Supabase Auth | Latest | JWT-based authentication |
| Storage | Supabase Storage | Latest | Media and export files |
| Realtime | Supabase Realtime | Latest | Live inbox updates |
| Hosting | Vercel | Pro | Deployment and edge network |
| Payments | Razorpay | Latest | INR subscriptions and billing |
| Messaging API | Meta WhatsApp Cloud API | v18.0 | WhatsApp message sending |
| Encryption | AES-256-GCM (Node.js crypto) | Built-in | Credential encryption |
| Scheduling | Vercel Cron / pg_cron | - | Background job scheduling |

---

*This document reflects the initial design for SNS Chat v1.0. Architecture decisions should be reviewed and updated as the platform scales beyond 1,000 tenants or 10M messages per month.*
