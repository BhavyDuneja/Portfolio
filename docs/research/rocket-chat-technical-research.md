# Rocket.Chat Technical Research

**Research Date:** April 14, 2026
**Subject:** Rocket.Chat -- Open-Source Messaging Platform
**Repository:** https://github.com/RocketChat/Rocket.Chat
**Current Version:** 8.3.2 (as of April 2026)
**GitHub Stars:** 45,142 | **Forks:** 13,517 | **Open Issues:** 3,717
**Primary Language:** TypeScript | **Created:** May 19, 2015

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Core Technologies](#2-core-technologies)
3. [Key Features and Modules](#3-key-features-and-modules)
4. [Deployment and Infrastructure](#4-deployment-and-infrastructure)
5. [API and Integration](#5-api-and-integration)
6. [Security](#6-security)
7. [Performance and Scalability](#7-performance-and-scalability)
8. [Community and Ecosystem](#8-community-and-ecosystem)
9. [Recent Changes and Roadmap](#9-recent-changes-and-roadmap)
10. [Comparison Points](#10-comparison-points)

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

Rocket.Chat follows a **hybrid architecture** combining a monolithic core with distributed microservices. The system can be deployed in two modes:

- **Monolith Mode (Community/Default):** A single Meteor-based process manages application logic, user accounts, message storage, and real-time communication. Multiple monolith nodes can run behind a load balancer for horizontal scaling.
- **Microservices Mode (Enterprise/Premium):** The monolithic core delegates specialized functions to independently deployable microservices, enabling granular scaling and fault isolation.

### 1.2 Monorepo Structure

The codebase is organized as a **monorepo** managed with **Yarn 4.12.0 workspaces** and **Turbo ~2.7.6** for build orchestration.

```
rocket.chat/
├── apps/
│   └── meteor/                  # Main Meteor application
│       ├── app/                 # Feature modules (client + server)
│       ├── client/              # Frontend-only code (React + Fuselage)
│       ├── server/              # Server-side code, Meteor methods
│       ├── lib/                 # Shared helper functions and classes
│       ├── packages/            # Customized Meteor packages
│       ├── public/              # Publicly served static files
│       ├── private/             # Private server-side assets
│       ├── tests/               # Test files
│       ├── definition/          # Type definitions
│       └── imports/             # Imported modules
├── packages/                    # Shared reusable packages
│   ├── core-typings/            # Core type definitions
│   ├── rest-typings/            # REST endpoint signatures
│   ├── models/                  # MongoDB data model abstractions
│   ├── api-client/              # API client utilities
│   ├── livechat/                # Livechat widget
│   ├── ui-client/               # UI client utilities
│   ├── ui-contexts/             # React contexts for UI
│   ├── ui-video-conf/           # Video conferencing UI
│   ├── eslint-config/           # Linting configuration
│   ├── cas-validate/            # CAS validation
│   └── agenda/                  # Job scheduling
├── ee/                          # Enterprise Edition code
│   ├── apps/                    # Enterprise microservices
│   │   ├── authorization-service/
│   │   ├── account-service/
│   │   ├── presence-service/
│   │   ├── ddp-streamer/
│   │   ├── queue-worker/
│   │   └── omnichannel-transcript/
│   └── packages/                # Enterprise shared packages
└── package.json                 # Root workspace configuration
```

### 1.3 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js 22.16.0 |
| **Framework** | Meteor 3.0 |
| **Language** | TypeScript ~5.9.3 (migrating from JavaScript) |
| **Database** | MongoDB 5.0, 6.0, 7.0, 8.0 (replica set required) |
| **Frontend** | React with Fuselage design system |
| **Build** | Webpack ~5.99.9, Babel ~7.28.6, Turbo ~2.7.6 |
| **Package Manager** | Yarn 4.12.0 (workspaces) |
| **Service Broker** | Moleculer v0.14.35 |
| **Message Bus** | NATS v2.28.2 |
| **Logging** | Pino v8.21.0 (structured JSON logging) |
| **WebSocket** | ws v8.18.3 |
| **Reverse Proxy** | Traefik (recommended) |

---

## 2. Core Technologies

### 2.1 Node.js and Meteor.js

Rocket.Chat is built on **Meteor 3.0**, a full-stack JavaScript/TypeScript framework that provides:

- **Isomorphic code execution** -- shared code between client and server
- **DDP (Distributed Data Protocol)** -- Meteor's real-time data synchronization protocol over WebSockets
- **Accounts system** -- built-in user authentication infrastructure
- **Build system** -- integrated bundling and hot code push

With the v7.0 release, Rocket.Chat upgraded from Meteor 2.x to **Meteor 3.0** and from Node.js 14 to **Node.js 20** (now 22.16.0 in the latest develop branch). This brought async/await throughout the server codebase, improved performance, and modern Node.js security features.

**Meteor Deprecation Status:** While Rocket.Chat has discussed moving away from Meteor, as of 2026 it remains the core framework. The strategy is incremental decoupling -- extracting functionality into standalone microservices and shared packages rather than a full rewrite. DDP methods are deprecated in favor of REST APIs for new development, but the Meteor runtime persists as the monolith core.

### 2.2 MongoDB

MongoDB serves as the sole database, storing:

- Chat messages and message history
- User profiles and authentication data
- Room/channel metadata and membership
- System configuration and settings
- File metadata (files themselves can be stored externally)
- Subscription data and notification preferences

**Data access** is abstracted through the `@rocket.chat/models` package with TypeScript typings provided by `@rocket.chat/core-typings` (v8.2.0-develop) and `@rocket.chat/rest-typings`.

**Supported versions:** MongoDB 5.0, 6.0, 7.0, 8.0. As of v8.0, MongoDB 5.0 and 6.0 support has been dropped, with 8.2 becoming the recommended version.

**Replica set is mandatory** -- even for single-node deployments -- to enable MongoDB Change Streams, which power Rocket.Chat's real-time reactivity layer.

### 2.3 Real-Time Protocols

#### WebSockets
The primary real-time transport. The `ws` library (v8.18.3) handles raw WebSocket connections, particularly in the DDP Streamer microservice.

#### DDP (Distributed Data Protocol)
Meteor's native real-time protocol that provides:
- **Method Calls** -- RPC-style function invocations
- **Subscriptions** -- reactive data streams that push updates to clients

**Deprecation notice:** DDP methods are no longer actively tested or maintained. REST APIs are the recommended path for new integrations. However, DDP remains operational for existing clients and the mobile/desktop apps.

#### Change Streams
MongoDB Change Streams replace the older oplog-tailing approach for detecting database mutations and pushing real-time updates to connected clients.

### 2.4 REST API

The REST API is the primary integration surface, accessible at `/api/v1/`. It covers:

- Authentication and user management
- Channel/room CRUD operations
- Message sending, editing, deletion
- File uploads and downloads
- Administration and configuration
- Omnichannel/Livechat operations
- Custom fields and roles

Rate limiting is configurable per endpoint with calls-per-time-window controls.

### 2.5 GraphQL

GraphQL support exists but is not the primary API. It was introduced via the `js-accounts` stack and integrates with the existing accounts system. The REST API remains the recommended and most complete interface.

### 2.6 Federation Protocol (Matrix)

Rocket.Chat supports federation through the **Matrix protocol**:

- **Legacy approach (pre-7.11):** Rocket.Chat operates as a Matrix Application Service (AppService/Bridge) connecting to an external Matrix homeserver (Synapse, Dendrite). The AppService registers with the homeserver using auto-generated tokens (AppService ID, Homeserver Token, App Service Token).

- **Native Federation (v7.11+):** A fully native implementation of the Matrix protocol built directly into Rocket.Chat, eliminating the need for external homeservers, bridges, or additional databases.

**Supported federation capabilities:**
- Send, receive, edit, and delete messages across servers
- Reactions, mentions, quotes, and threads
- File sharing between federated users
- Room participation and direct messaging
- Federated room renaming (added in v8.3.0)

---

## 3. Key Features and Modules

### 3.1 Messaging

| Feature | Details |
|---------|---------|
| **Channels** | Public channels, private groups, read-only channels |
| **Direct Messages** | 1:1 and multi-party DMs |
| **Threads** | In-message thread replies for organized discussions |
| **Discussions** | Dedicated sub-rooms linked from a parent channel |
| **Message Actions** | Edit, delete, pin, star, react, quote, reply |
| **Rich Text** | Markdown support, code blocks, emoji (custom + Unicode) |
| **Search** | Full-text message search with filters |
| **Read Receipts** | Per-message delivery/read tracking |
| **Mentions** | @user, @all, @here mentions with notifications |
| **Auto-translate** | Real-time message translation (via provider integration) |

### 3.2 Video and Audio Conferencing

Rocket.Chat does not include a native video conferencing engine. Instead, it integrates with external providers through marketplace apps:

| Provider | Protocol | Notes |
|----------|----------|-------|
| **Jitsi Meet** | WebRTC (SFU-based) | Fully encrypted, open-source, browser-based |
| **BigBlueButton** | WebRTC | Optimized for education/webinars |
| **Pexip** | SIP/WebRTC | Enterprise-grade, interoperability focus |
| **Google Meet** | Proprietary | Calendar integration |

**VoIP:** SIP-based voice calling was introduced in v7.0 (beta), with a generic SIP integration replacing the earlier FreeSwitch-specific implementation in v8.0.

### 3.3 File Sharing

- Upload files to channels, DMs, and threads
- Storage backends: local filesystem, Amazon S3, Google Cloud Storage, WebDAV, GridFS (MongoDB)
- File preview for images, videos, and audio
- E2E encrypted file sharing when E2EE is enabled
- Configurable file size limits and allowed MIME types

### 3.4 End-to-End Encryption (E2EE)

Detailed in [Section 6.1](#61-end-to-end-encryption-e2ee).

### 3.5 Omnichannel (Livechat)

The Omnichannel module transforms Rocket.Chat into a customer engagement platform:

- **Livechat widget** -- embeddable JavaScript widget for websites
- **Channel integrations** -- WhatsApp, Instagram, SMS (Twilio), Email
- **Agent management** -- routing, queuing, department assignment
- **Conversation management** -- tags, priorities, SLA, canned responses
- **Contact Center** -- unified view replacing the legacy "Current Chats" page (deprecated in v8.0)
- **AI summarization** -- conversation summaries via the Rocket.Chat AI App
- **Transcript generation** -- PDF transcripts via the omnichannel-transcript microservice (uses `@react-pdf/renderer` v3.4.5)
- **VoIP integration** -- SIP-based voice as part of Omnichannel offering

### 3.6 Marketplace and Apps Engine

The **Apps-Engine** (`@rocket.chat/apps-engine`) is the extensibility framework:

**Architecture:**
- Apps run within the same infrastructure as Rocket.Chat, maintaining data privacy
- Apps-Engine provides sandboxed execution with configurable permissions
- Apps interact through event interfaces, slash commands, and API endpoints

**Developer capabilities:**
- Custom slash commands
- Event listeners (message sent, room created, user joined, etc.)
- UI extensions via UIKit block system
- Persistent data storage (Apps persistence API)
- OAuth2 client implementation
- Scheduled jobs (cron-like)
- Custom REST API endpoints
- HTTP request capabilities
- Email sending

**Distribution:**
- Public apps via the Rocket.Chat Marketplace
- Private apps for workspace-specific use (premium plans only as of v7.0)
- Versioned with the main platform (current: Apps-Engine 1.61.1 with RC 8.3.2)

### 3.7 Bots Framework

**Status: Deprecated.** Bots integration has been officially deprecated in favor of the Apps-Engine.

**Legacy architecture (still functional):**
- Bots connected via the `@rocket.chat/sdk` using WebSocket/DDP
- Three-layer structure: SDK -> Adapter -> Framework
- Supported frameworks: Hubot (Node.js), Botkit, Rasa, Botpress
- Bot accounts require the `bot` role, created by administrators

### 3.8 Authentication

| Method | Protocol | Details |
|--------|----------|---------|
| **Form Login** | Username/Password | Configurable password policies (length, complexity, expiry) |
| **LDAP** | LDAP/Active Directory | Attribute sync, auto-provisioning, group mapping, ABAC integration |
| **SAML** | SAML 2.0 | Enterprise SSO, configurable assertion mapping |
| **OAuth 2.0** | OAuth 2.0 | 10+ built-in providers, custom OAuth with scope/token/identity configuration |
| **CAS** | CAS 1.0/2.0 | Attribute synchronization |
| **2FA (TOTP)** | RFC 6238 | Google Authenticator, Authy, Duo compatible |
| **2FA (Email)** | Email OTP | Configurable expiration, auto opt-in |
| **Personal Access Tokens** | Token-based | For programmatic REST API access |

Cross-service user merging is supported -- accounts from different OAuth providers can be merged based on matching key fields (typically email).

---

## 4. Deployment and Infrastructure

### 4.1 Deployment Methods

| Method | Support Level | Notes |
|--------|--------------|-------|
| **Docker + Docker Compose** | Official | Most popular method; simplest setup |
| **Kubernetes + Helm** | Official | Recommended for production/enterprise; official Helm chart |
| **Snap** | Official | Single-command install for Ubuntu; auto-updates |
| **Manual (Node.js)** | Community | Direct Node.js installation |

### 4.2 Docker Deployment

Minimal `docker-compose.yml` requires two services:
- `rocketchat` -- the application container
- `mongo` -- MongoDB with replica set initialization

Key environment variables:
- `ROOT_URL` -- public-facing URL
- `MONGO_URL` -- MongoDB connection string (must include `replicaSet`)
- `MONGO_OPLOG_URL` -- oplog connection for real-time reactivity
- `PORT` -- application port (default: 3000)

### 4.3 Kubernetes Deployment

The official Helm chart provisions:
- Rocket.Chat application pods (configurable replicas)
- MongoDB (via subchart or external connection)
- Ingress configuration
- Resource limits and requests
- PersistentVolumeClaims for file storage

Configuration is managed through `values.yaml` with support for:
- Global replica counts or per-service granular scaling
- Service-specific resource allocation
- External MongoDB connection strings
- TLS/Ingress configuration

### 4.4 Microservices Deployment (Enterprise)

In microservices mode, these services run as independent containers/pods:

| Service | Function | Scaling Guide |
|---------|----------|---------------|
| **Monolith Core** | Business logic coordinator | 1+ pods |
| **DDP Streamer** | WebSocket connection handler | 1 pod per 500 concurrent users |
| **Authorization** | RBAC/ABAC permission evaluation | Scale with auth request volume |
| **Account** | User CRUD, bcrypt authentication | Scale with login volume |
| **Presence** | Online/offline status tracking | Scale with user count |
| **Queue Worker** | Background job processing | Scale with job volume |
| **Omnichannel Transcript** | PDF generation | Scale with transcript demand |

All services require:
- `MONGO_URL` environment variable pointing to the shared MongoDB replica set
- `TRANSPORTER` environment variable pointing to the NATS gateway (e.g., `nats://nats:4222`)

### 4.5 High Availability

- **Application layer:** Multiple Rocket.Chat nodes behind Traefik or another reverse proxy with sticky sessions
- **Database layer:** MongoDB replica set with minimum 3 members; supports MongoDB Community Operator for Kubernetes
- **Message bus:** NATS cluster for inter-service communication redundancy
- **Storage:** Shared storage backend (S3, NFS) for file uploads across nodes

### 4.6 Reverse Proxy

Traefik is the recommended reverse proxy, providing:
- Load balancing across application instances
- WebSocket upgrade handling
- TLS termination
- Request filtering and rate limiting
- Health check routing

---

## 5. API and Integration

### 5.1 REST API (`/api/v1/`)

The REST API is organized into endpoint groups:

| Group | Examples | Auth Required |
|-------|----------|---------------|
| **Authentication** | `/login`, `/logout`, `/me` | Varies |
| **Channels** | `/channels.create`, `/channels.info`, `/channels.history` | Yes |
| **Groups** | `/groups.create`, `/groups.invite` | Yes |
| **DM** | `/dm.create`, `/dm.history` | Yes |
| **Chat** | `/chat.sendMessage`, `/chat.update`, `/chat.delete` | Yes |
| **Users** | `/users.create`, `/users.info`, `/users.list` | Yes |
| **Rooms** | `/rooms.get`, `/rooms.adminRooms` | Yes |
| **Subscriptions** | `/subscriptions.get`, `/subscriptions.read` | Yes |
| **Livechat** | `/livechat/rooms`, `/livechat/visitor` | Yes |
| **Roles** | `/roles.list`, `/roles.addUserToRole` | Admin |
| **Settings** | `/settings`, `/settings.public` | Admin |

**Authentication methods for API:**
- Login token (from `/api/v1/login`)
- Personal Access Tokens (`X-Auth-Token` + `X-User-Id` headers)

**Rate limiting:** Configurable per-endpoint with calls/time-window. Development environment overrides available.

**CORS:** Whitelist-based origin control via `API_CORS_Origin` setting.

**Pagination:** Controlled via `API_Default_Count` and `API_Upper_Count_Limit` settings.

**OpenAPI:** Expanding OpenAPI specification support (introduced in v8.3.0 for multiple endpoints).

### 5.2 Realtime API (WebSocket)

Connects via WebSocket at `ws(s)://your-server/websocket`. Two primary interaction patterns:

- **Method Calls:** RPC-style invocations (e.g., `sendMessage`, `createChannel`)
- **Subscriptions:** Reactive data streams (e.g., `stream-room-messages`, `stream-notify-user`)

**Protocol:** DDP (Distributed Data Protocol) with EJSON serialization.

**Note:** DDP methods are deprecated for new development. Existing functionality remains operational but REST is preferred.

### 5.3 Webhooks

Two webhook types:

- **Incoming Webhooks:** External services POST data to Rocket.Chat, creating messages in channels. Configurable with custom scripts for payload transformation.
- **Outgoing Webhooks:** Rocket.Chat POSTs message data to external URLs when messages match configured triggers (keywords, channels).

Scripts run in a **Secure Sandbox** environment (the legacy vm2 Compatible Sandbox was removed in v7.0 due to security vulnerabilities).

### 5.4 Apps Engine SDK

The `@rocket.chat/apps-engine` npm package provides:

```typescript
// Core app structure
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';

export class MyApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }
}
```

**Key interfaces:**
- `IPreMessageSentPrevent`, `IPostMessageSent` -- message lifecycle hooks
- `ISlashCommand` -- custom slash command registration
- `IUIKitInteractionHandler` -- UI interaction handling
- `IConfigurationExtend` -- settings and API endpoint registration
- `IHttp` -- outbound HTTP requests
- `IPersistence` -- app-specific data storage
- `ISchedulerExtend` -- cron-like job scheduling

### 5.5 External Integrations

- **Email:** SMTP configuration for notifications and email-to-channel ingestion
- **Push Notifications:** Cloud gateway (Rocket.Chat hosted) or custom gateway (APNS/FCM)
- **Calendar:** Integration with Google Calendar and other providers
- **CRM/Helpdesk:** Omnichannel APIs for CRM integration
- **CI/CD:** Webhook-based integration with GitHub, GitLab, Jenkins, etc.

---

## 6. Security

### 6.1 End-to-End Encryption (E2EE)

Rocket.Chat implements client-side E2EE using the **Web Crypto API**:

**Key Generation:**

| Key | Algorithm | Details |
|-----|-----------|---------|
| **RSA Key Pair (Ku/Kr)** | RSA-OAEP, 2048-bit, SHA-256 | Generated client-side; public key stored on server; private key encrypted locally |
| **Master Key** | AES-GCM, 256-bit | Derived from mnemonic recovery phrase via PBKDF2 (100,000 iterations, random salt) |
| **Session Key (Ks)** | AES-GCM, 256-bit | Generated per room; encrypted with each participant's public key (RSA-OAEP) |

**Encryption flow:**
1. On first login, client generates a mnemonic recovery phrase
2. Recovery phrase derives the Master Key (PBKDF2, 100k iterations)
3. Client generates RSA-OAEP 2048-bit key pair
4. Private key encrypted with Master Key, stored on server
5. Per-room: AES-GCM 256-bit session key generated
6. Session key encrypted with each user's RSA public key, stored in Subscription model
7. Messages encrypted with session key, tagged with type `"e2e"`
8. Files use identical encryption with keyID matching against current and historical room keys

**Key distribution APIs:**
- `e2e.setUserPublicAndPrivateKeys`
- `e2e.updateGroupKey`
- `e2e.acceptSuggestedGroupKey`
- `e2e.provideUsersWithSuggestedGroupKeys`

**OTR (Off-The-Record):** Removed in v8.0 due to low adoption. E2EE is the sole supported encryption method.

### 6.2 Two-Factor Authentication

- **TOTP:** RFC 6238 compliant; compatible with Google Authenticator, Authy, Duo. Configurable token window via `Accounts_TwoFactorAuthentication_MaxDelta`.
- **Email-based:** Temporary codes with configurable expiration and auto opt-in.
- **Trusted devices:** Configurable remember period via `Accounts_TwoFactorAuthentication_RememberFor`.
- Both methods can be enabled simultaneously.

### 6.3 Permissions Model

**RBAC (Role-Based Access Control):**
- 400+ granular permissions
- Default roles: admin, moderator, user, bot, guest, livechat-agent, livechat-manager
- Permissions cover: room management, message operations, administration, integrations, file operations
- Role assignment configurable per registration source (manual, OAuth, SAML, LDAP)
- API endpoint-level permission enforcement

**ABAC (Attribute-Based Access Control) -- Enterprise:**
- Dynamic room access based on user and room attributes
- Integrates with LDAP attribute synchronization
- Cached access decisions (configurable TTL via `Abac_Cache_Decision_Time_Seconds`)
- Automatic access revocation when attributes change
- Full audit trail: creation, updates, deletions, room assignments

### 6.4 Data Retention

- Configurable message pruning by age
- Channel-level retention policies
- File retention policies (separate from message retention)
- Audit log for administrative actions

### 6.5 Compliance

| Standard | Status | Details |
|----------|--------|---------|
| **ISO 27001** | Certified | Annually validated by independent third-party auditor |
| **GDPR** | Compliant | DPA with Standard Contractual Clauses; data sovereignty via self-hosting |
| **HIPAA** | Eligible | All pricing plans; self-managed deployment ensures PHI isolation |
| **FINRA** | Supported | Message archival and retention capabilities |
| **FedRAMP** | Supported | Government-grade deployment configurations |
| **SOC 2** | Available | Enterprise compliance documentation |

### 6.6 Additional Security Features

- **Password policies:** Configurable min/max length, character requirements, no repeating characters
- **Session management:** Configurable expiration, close-on-window-close behavior
- **Rate limiting:** Per-endpoint and per-method with DDoS protection
- **CORS:** Whitelist-based origin control
- **Content Security Policy:** Configurable CSP headers
- **Secure Sandbox:** All integration scripts execute in a secure sandbox (vm2 removed in v7.0)
- **Email verification:** Required before login when enabled; auto-verified for external auth providers

---

## 7. Performance and Scalability

### 7.1 Scaling Strategies

**Horizontal scaling (monolith mode):**
- Multiple Rocket.Chat instances behind a load balancer (Traefik recommended)
- Shared MongoDB replica set for data consistency
- NATS for inter-instance pub/sub communication
- Sticky sessions required for WebSocket connections

**Horizontal scaling (microservices mode):**
- Independent scaling of each service based on bottleneck identification
- DDP Streamer: 1 pod per 500 concurrent users
- Authorization, Accounts, Presence: scale based on request patterns
- Queue Worker: scale based on background job volume

**Scaling thresholds:**
- Monolith mode: suitable for up to ~1,000 concurrent users per instance
- Microservices recommended for deployments exceeding 1,000 concurrent users
- Multiple monolith nodes recommended before moving to microservices

### 7.2 Known Performance Characteristics

- **Single-threaded limitation:** Node.js single-threaded nature means a single process cannot utilize multiple CPU cores effectively. This is mitigated by running multiple instances.
- **CPU bottleneck indicator:** Node process approaching 100% CPU usage signals need for horizontal scaling.
- **MongoDB as the typical bottleneck:** At scale, MongoDB read/write performance becomes the primary constraint.

### 7.3 Caching

- **ABAC decision caching:** Configurable TTL for permission evaluation results
- **MongoDB connection pooling:** Configured via connection string parameters
- **CDN support:** Static assets can be served via CDN
- **Reverse proxy caching:** Traefik or Nginx caching for static resources
- **Client-side caching:** React app with service worker support

### 7.4 Database Optimization

- **Indexes:** MongoDB indexes on message timestamps, room IDs, user lookups
- **Replica set read preferences:** Configurable read distribution across replica members
- **Change Streams:** Replace oplog tailing for more efficient real-time change detection
- **Connection string tuning:** `directConnection`, `readPreference`, `w` parameters

### 7.5 Message Bus (NATS)

NATS acts as the decoupled message distributor:
- Routes requests between microservices without direct service-to-service coupling
- Prevents bottleneck cascading across the system
- Configured via the `TRANSPORTER` environment variable (e.g., `nats://nats:4222`)
- Supports TCP fallback when NATS is unavailable (monolith mode)

### 7.6 Service Orchestration (Moleculer)

**Moleculer v0.14.35** provides:
- Service discovery and registration
- Request-response and event-driven communication patterns
- Load balancing across service instances
- Circuit breaker for fault tolerance
- Serialization (EJSON)

---

## 8. Community and Ecosystem

### 8.1 Licensing

| Edition | License | Features |
|---------|---------|----------|
| **Community** | MIT License | Core messaging, channels, DMs, threads, basic auth, REST API, webhooks, Apps Engine |
| **Starter** | Proprietary | Community + limited omnichannel, basic marketplace apps |
| **Pro** | Proprietary | Starter + advanced omnichannel, priority support |
| **Enterprise** | Proprietary | Pro + microservices, ABAC, SAML, advanced compliance, SLA, custom branding |

The core platform is MIT-licensed, allowing modification and redistribution. Enterprise features (microservices, ABAC, advanced federation, VoIP) require paid plans.

### 8.2 Community

- **Contributors:** 30,000+ contributors (per Rocket.Chat claims)
- **GitHub activity:** Active development on the `develop` branch with frequent releases
- **Forums:** https://forums.rocket.chat/ for community support and discussions
- **Hacktoberfest:** Active participant (tagged in GitHub topics)

### 8.3 Marketplace

- Public apps available through the Rocket.Chat Marketplace
- Categories: productivity, communication, automation, security, AI
- Notable apps: Jitsi Meet, BigBlueButton, Pexip, Google Meet, Rocket.Chat AI, GIPHY, Polls
- Private app uploads restricted to premium plans (as of v7.0)

### 8.4 Release Cadence

- **Minor releases:** Approximately monthly (7.10, 7.11, 7.12, 7.13, 8.0, 8.1, 8.2, 8.3)
- **Patch releases:** As needed for security and bug fixes (frequently batched)
- **Release candidates:** Published as `-rc.N` versions before stable releases
- **Version durability:** Documented policy for supported version ranges and EOL dates

### 8.5 Related Repositories

| Repository | Purpose |
|-----------|---------|
| `RocketChat/Rocket.Chat` | Core platform |
| `RocketChat/Rocket.Chat.Apps-engine` | Apps extensibility framework |
| `RocketChat/Rocket.Chat.Fuselage` | UI component library and design system |
| `RocketChat/Rocket.Chat.js.SDK` | JavaScript SDK for bots and integrations (deprecated) |
| `RocketChat/Rocket.Chat.ReactNative` | Mobile app (React Native) |
| `RocketChat/Rocket.Chat.Electron` | Desktop app (Electron) |
| `RocketChat/EmbeddedChat` | Embeddable chat component (React) |
| `RocketChat/Rocket.Chat.AI.Preview` | AI/LLM integration preview |
| `RocketChat/docs` | Official documentation |

---

## 9. Recent Changes and Roadmap

### 9.1 Version History (Major Milestones)

| Version | Key Changes |
|---------|-------------|
| **7.0** | Meteor 3.0 upgrade; Node.js 20; MongoDB 4.4 dropped; vm2 sandbox removed; VoIP beta; private apps restricted to premium |
| **7.2** | Granular VoIP permissions |
| **7.11** | Native Matrix Federation (no external homeserver required) |
| **7.13** | Last 7.x release; Apps-Engine 1.58.1 |
| **8.0** | MongoDB 5.0/6.0 dropped (8.2 recommended); StreamHub removed; OTR removed; VoIP FreeSwitch replaced with generic SIP; WebRTC admin settings removed; 40+ deprecated API endpoints removed |
| **8.3.0** | Federated room renaming; screen sharing for calls; ban management; expanded OpenAPI |
| **8.3.2** | Latest stable (April 2026); security patches; Apps-Engine 1.61.1 |

### 9.2 Deprecated and Removed Features (v7.0--v9.0 planned)

| Feature | Deprecated | Removed | Replacement |
|---------|-----------|---------|-------------|
| DDP methods | v7.0+ | Ongoing | REST API |
| vm2 sandbox | v7.0 | v7.0 | Secure Sandbox |
| OTR messaging | v7.x | v8.0 | E2E Encryption |
| StreamHub service | v7.x | v8.0 | Change Streams (built-in) |
| WebRTC admin settings | v7.x | v8.0 | Apps-Engine video conferencing |
| FreeSwitch VoIP | v7.x | v8.0 | Generic SIP integration |
| MongoDB 5.0/6.0 | v8.0 | v8.0 | MongoDB 8.2 |
| `fields`/`query` API params | v5.0 | v9.0 (planned) | Purpose-built endpoints |
| Anonymous write | v8.3 | v9.0 (planned) | -- |
| Bots integration | v7.x | Deprecated | Apps-Engine |

### 9.3 AI and LLM Integration

The **Rocket.Chat AI App** (beta) provides:

- **Self-hosted LLM support:** Deploy open-source models (Llama 3.1, etc.) on-premise
- **RAG (Retrieval Augmented Generation):** Augment LLMs with organizational knowledge bases
- **Thread summarization:** AI-generated summaries of lengthy thread discussions
- **Omnichannel summarization:** Automatic customer conversation summaries for agents
- **Data sovereignty:** All AI processing runs on-premise; no data leaves the organization

**Architecture:** The AI App connects to self-hosted LLM endpoints (Ollama, vLLM, etc.) and uses vector databases for RAG pipelines, all within the Apps-Engine framework.

### 9.4 Architectural Direction

- **Incremental Meteor decoupling:** Extracting functionality into standalone packages and microservices
- **TypeScript migration:** Ongoing conversion from JavaScript to TypeScript across the codebase
- **REST-first API strategy:** DDP deprecated; REST and OpenAPI as the primary integration surface
- **Native federation:** Matrix protocol built directly into the core, removing bridge dependencies
- **Microservices expansion:** Moving more functionality from the monolith into independently scalable services

---

## 10. Comparison Points

### 10.1 Feature Matrix

| Feature | Rocket.Chat | Slack | Mattermost | Matrix/Element | Zulip |
|---------|------------|-------|------------|----------------|-------|
| **License** | MIT + Enterprise | Proprietary | MIT + Enterprise | Apache 2.0 | Apache 2.0 |
| **Self-hosted** | Yes | No (Enterprise Grid) | Yes | Yes | Yes |
| **Cloud hosted** | Yes | Yes | Yes | Yes (Element) | Yes |
| **Language** | TypeScript/JS | Java/PHP | Go | Python (Synapse) | Python/Django |
| **Database** | MongoDB | Proprietary | PostgreSQL | PostgreSQL | PostgreSQL |
| **Real-time** | WebSocket/DDP | WebSocket | WebSocket | Matrix protocol | WebSocket |
| **Federation** | Matrix (native) | No | No (planned) | Native (core) | No |
| **E2E Encryption** | Yes (AES-GCM) | Enterprise only | Enterprise only | Yes (Olm/Megolm) | No |
| **Omnichannel** | Yes (built-in) | No | No | No | No |
| **Apps/Plugins** | Apps Engine | App Directory | Plugin system | Widgets/Bots | Integrations |
| **Video Calls** | Via marketplace | Native Huddles | Via plugins | Via Jitsi/native | Via Jitsi |
| **Threads** | Yes | Yes | Yes | Yes (MSC) | Topic-based |
| **Bot Framework** | Apps-Engine | Bot Users API | Bot framework | Matrix bots | Bot API |
| **Mobile Apps** | React Native | Native | React Native | Native/RN | React Native |

### 10.2 Architectural Comparison

| Aspect | Rocket.Chat | Mattermost | Matrix/Element | Zulip |
|--------|------------|------------|----------------|-------|
| **Architecture** | Hybrid monolith + microservices | Monolith (Go binary) | Decentralized servers | Monolith (Django) |
| **Scaling** | Horizontal + microservices | Horizontal (multi-node) | Federation | Horizontal (multi-server) |
| **Database** | MongoDB (document store) | PostgreSQL (relational) | PostgreSQL (relational) | PostgreSQL (relational) |
| **Protocol** | WebSocket + REST | WebSocket + REST | Matrix (federated) | WebSocket + REST |
| **Data model** | Document-oriented (flexible schema) | Relational (strict schema) | Event DAG (decentralized) | Relational (strict schema) |

### 10.3 Key Differentiators

**Rocket.Chat strengths:**
- Omnichannel/livechat as a first-class feature (unique among open-source competitors)
- Matrix federation built natively (not just bridging)
- Extensive marketplace with Apps-Engine extensibility
- Self-hosted AI/LLM with data sovereignty
- HIPAA, GDPR, ISO 27001 compliance out of the box
- Flexible deployment (Docker, Kubernetes, Snap)

**Rocket.Chat weaknesses:**
- MongoDB-only database (no PostgreSQL option); MongoDB requires replica set even for single-node
- Meteor.js dependency creates architectural constraints and migration friction
- Single-threaded Node.js limits per-instance throughput vs Go-based alternatives (Mattermost)
- Complex microservices deployment locked behind Enterprise license
- TypeScript migration still in progress (mixed JS/TS codebase)

**When to choose Rocket.Chat over alternatives:**
- Need omnichannel customer engagement (livechat, WhatsApp, SMS)
- Require federation with Matrix ecosystem
- Need HIPAA/GDPR compliance with full self-hosting
- Want an extensible apps marketplace
- Need self-hosted AI/LLM integration
- Government/defense deployments requiring data sovereignty

**When to choose alternatives:**
- **Mattermost:** When PostgreSQL is required; when Go performance matters; DevOps-centric teams
- **Matrix/Element:** When decentralized federation is the primary requirement; maximum encryption guarantees
- **Zulip:** When topic-based threading is critical for async-first teams; simpler deployment
- **Slack:** When SaaS convenience and ecosystem breadth outweigh self-hosting needs

---

## Sources

- [Rocket.Chat Architecture and Components](https://developer.rocket.chat/docs/architecture-and-components)
- [Rocket.Chat Server Architecture](https://developer.rocket.chat/docs/server-architecture)
- [Rocket.Chat Repository Structure](https://developer.rocket.chat/docs/repository-structure)
- [Rocket.Chat Monorepo Guide](https://developer.rocket.chat/docs/monorepo)
- [System Architecture (DeepWiki)](https://deepwiki.com/RocketChat/Rocket.Chat/2-system-architecture)
- [Authentication and Authorization (DeepWiki)](https://deepwiki.com/RocketChat/Rocket.Chat/3.2-authentication-and-authorization)
- [Scaling Rocket.Chat with Microservices](https://docs.rocket.chat/docs/microservices)
- [Deploy with Kubernetes](https://docs.rocket.chat/docs/deploy-with-kubernetes)
- [Rocket.Chat Realtime API](https://developer.rocket.chat/apidocs/realtimeapi)
- [Rocket.Chat REST API](https://developer.rocket.chat/apidocs)
- [Apps-Engine Overview](https://developer.rocket.chat/apps-engine/rocket.chat-apps-engine)
- [Bots Architecture](https://developer.rocket.chat/docs/bots-architecture)
- [E2E Encryption Specifications](https://docs.rocket.chat/docs/end-to-end-encryption-specifications)
- [Security Overview](https://docs.rocket.chat/docs/security-overview)
- [Authentication](https://docs.rocket.chat/docs/authentication)
- [Deprecated Features](https://docs.rocket.chat/docs/deprecated-and-phasing-out-features)
- [Rocket.Chat AI App](https://docs.rocket.chat/docs/rocketchat-ai-app)
- [Rocket.Chat 7.0 Release](https://www.rocket.chat/blog/introducing-rocket-chat-7-0)
- [Rocket.Chat Releases (GitHub)](https://github.com/RocketChat/Rocket.Chat/releases)
- [Rocket.Chat Native Federation](https://docs.rocket.chat/docs/rocketchat-native-federation)
- [Matrix.org -- Welcoming Rocket.Chat](https://matrix.org/blog/2022/05/30/welcoming-rocket-chat-to-matrix/)
- [DDP Deprecation Discussion](https://forums.rocket.chat/t/what-does-the-deprecation-of-ddp-mean-for-the-apis/22598)
- [GDPR Compliance](https://www.rocket.chat/blog/rocket-chats-gdpr-compliance)
- [HIPAA Compliance](https://www.rocket.chat/hipaa-compliant-messaging)
- [Jitsi App](https://docs.rocket.chat/docs/jitsi-app)
- [Rocket.Chat GitHub Repository](https://github.com/RocketChat/Rocket.Chat)
- [Top 3 Slack Alternatives Comparison](https://wz-it.com/en/blog/slack-alternatives-mattermost-rocketchat-zulip/)
- [Open Source Messaging Comparison (Slashdot)](https://slashdot.org/software/comparison/Matrix-vs-Mattermost-vs-Rocket.Chat-vs-Zulip/)
