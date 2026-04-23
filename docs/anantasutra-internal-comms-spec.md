# AnantaSutra Internal Communication System — Full Build Prompt

## Prompt

Build a production-grade **internal communication and employee management platform** for AnantaSutra called **"SutraNet"** — an intranet portal where all staff can collaborate, communicate, access company resources, and manage their work lifecycle. The system must be **role-based**, **real-time**, and **mobile-responsive**.

---

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Shadcn/UI
- **Backend/Auth/DB/Storage**: Supabase (PostgreSQL, Row Level Security, Realtime, Auth, Storage)
- **Real-time**: Supabase Realtime (presence + broadcast for chat/status)
- **File Storage**: Supabase Storage (documents, profile photos, attachments)
- **Deployment**: Vercel (frontend) + Supabase (backend)
- **Domain**: internal.anantasutra.com (or portal.anantasutra.com)

---

## Role-Based Access Control (RBAC)

### Roles (hierarchical, each inherits permissions from below)

| Role | Level | Description |
|------|-------|-------------|
| `super_admin` | 5 | Platform owner (Bhavya). Full system control. Can create/delete any entity |
| `admin` | 4 | HR/Ops heads. Manage employees, channels, policies, workflows |
| `manager` | 3 | Team leads. Manage their team, approve leaves/requests, view team reports |
| `employee` | 2 | Regular staff. Access assigned channels, submit applications, view policies |
| `intern` | 1 | Limited access. View-only on policies, restricted channel access, can submit applications |
| `contractor` | 1 | External contractors. Access only to assigned project channels and relevant docs |

### Permission Matrix

| Feature | Super Admin | Admin | Manager | Employee | Intern | Contractor |
|---------|:-----------:|:-----:|:-------:|:--------:|:------:|:----------:|
| Manage all users | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create channels | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| View all channels | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Send messages | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Delete any message | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create/edit policies | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View policies | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Approve applications | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Submit applications | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| View team reports | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage workflows | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View calendar | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create calendar events | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Access employee directory | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| View own profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit own profile | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Export data | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## Database Schema (Supabase PostgreSQL)

### Core Tables

```sql
-- ==========================================
-- 1. USERS / EMPLOYEES
-- ==========================================
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Personal Info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  
  -- Employment Info
  employee_id TEXT UNIQUE NOT NULL, -- e.g., AS-001, AS-002
  designation TEXT NOT NULL,
  department TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('super_admin', 'admin', 'manager', 'employee', 'intern', 'contractor')),
  employment_type TEXT DEFAULT 'full_time' CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'intern', 'freelance')),
  joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
  probation_end_date DATE,
  exit_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'suspended', 'exited', 'probation')),
  
  -- Reporting
  reports_to UUID REFERENCES employees(id),
  team_id UUID REFERENCES teams(id),
  
  -- Compensation (visible only to super_admin/admin)
  salary_band TEXT,
  
  -- Emergency Contact
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relation TEXT,
  
  -- Address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  
  -- System
  last_seen_at TIMESTAMPTZ,
  is_online BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 2. TEAMS / DEPARTMENTS
-- ==========================================
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  department TEXT NOT NULL,
  lead_id UUID REFERENCES employees(id),
  parent_team_id UUID REFERENCES teams(id), -- for nested teams
  color TEXT DEFAULT '#E8A317',
  icon TEXT DEFAULT 'users',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 3. COMMUNICATION CHANNELS
-- ==========================================
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('public', 'private', 'direct', 'announcement')),
  -- public: anyone can join
  -- private: invite-only
  -- direct: 1:1 or group DM
  -- announcement: only admins/managers can post, everyone reads
  
  team_id UUID REFERENCES teams(id), -- optional: auto-created for teams
  created_by UUID REFERENCES employees(id),
  is_archived BOOLEAN DEFAULT false,
  
  -- Settings
  allow_threads BOOLEAN DEFAULT true,
  allow_reactions BOOLEAN DEFAULT true,
  allow_file_uploads BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE channel_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  muted BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(channel_id, employee_id)
);

-- ==========================================
-- 4. MESSAGES
-- ==========================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES employees(id),
  
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'file', 'image', 'system', 'poll')),
  
  -- Threading
  parent_message_id UUID REFERENCES messages(id), -- for thread replies
  thread_count INT DEFAULT 0,
  
  -- Attachments
  attachments JSONB DEFAULT '[]',
  -- Format: [{ "name": "file.pdf", "url": "...", "size": 1234, "type": "application/pdf" }]
  
  -- Reactions
  reactions JSONB DEFAULT '{}',
  -- Format: { "👍": ["user_id1", "user_id2"], "❤️": ["user_id3"] }
  
  -- Status
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  
  -- Mentions
  mentions UUID[] DEFAULT '{}', -- array of employee IDs mentioned
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Read receipts
CREATE TABLE message_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  last_read_message_id UUID REFERENCES messages(id),
  last_read_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(channel_id, employee_id)
);

-- ==========================================
-- 5. CALENDAR / EVENTS
-- ==========================================
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'meeting', 'holiday', 'birthday', 'work_anniversary',
    'deadline', 'review', 'training', 'town_hall', 'custom'
  )),
  
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_all_day BOOLEAN DEFAULT false,
  
  -- Recurrence
  recurrence TEXT CHECK (recurrence IN ('none', 'daily', 'weekly', 'monthly', 'yearly')),
  recurrence_end DATE,
  
  -- Location
  location TEXT,
  meeting_link TEXT, -- Google Meet / Zoom link
  
  -- Visibility
  visibility TEXT DEFAULT 'team' CHECK (visibility IN ('personal', 'team', 'department', 'company')),
  
  -- Creator
  created_by UUID REFERENCES employees(id),
  team_id UUID REFERENCES teams(id),
  
  -- Color coding
  color TEXT DEFAULT '#E8A317',
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES calendar_events(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  rsvp TEXT DEFAULT 'pending' CHECK (rsvp IN ('accepted', 'declined', 'tentative', 'pending')),
  UNIQUE(event_id, employee_id)
);

-- ==========================================
-- 6. DOCUMENTS / POLICIES / RULEBOOKS
-- ==========================================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL, -- Rich text / Markdown
  excerpt TEXT,
  
  category TEXT NOT NULL CHECK (category IN (
    'policy', 'rulebook', 'privacy', 'employee_rights',
    'handbook', 'sop', 'guideline', 'template', 'announcement'
  )),
  
  -- Versioning
  version INT DEFAULT 1,
  previous_version_id UUID REFERENCES documents(id),
  
  -- Access
  visibility TEXT DEFAULT 'all_employees' CHECK (visibility IN (
    'all_employees', 'managers_above', 'admins_only', 'specific_teams'
  )),
  visible_to_teams UUID[] DEFAULT '{}', -- if visibility = 'specific_teams'
  
  -- Acknowledgement required?
  requires_acknowledgement BOOLEAN DEFAULT false,
  acknowledgement_deadline DATE,
  
  -- Metadata
  created_by UUID REFERENCES employees(id),
  approved_by UUID REFERENCES employees(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'under_review')),
  published_at TIMESTAMPTZ,
  
  -- Attachments
  attachments JSONB DEFAULT '[]',
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Track who has read/acknowledged policies
CREATE TABLE document_acknowledgements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  acknowledged_at TIMESTAMPTZ DEFAULT now(),
  ip_address TEXT,
  UNIQUE(document_id, employee_id)
);

-- ==========================================
-- 7. APPLICATIONS / REQUESTS
-- ==========================================
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Applicant
  submitted_by UUID REFERENCES employees(id),
  
  -- Type
  application_type TEXT NOT NULL CHECK (application_type IN (
    'leave', 'wfh', 'expense', 'asset_request', 'training',
    'grievance', 'resignation', 'salary_advance', 'overtime',
    'shift_change', 'travel', 'reimbursement', 'general'
  )),
  
  -- Details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- For leave applications
  leave_type TEXT CHECK (leave_type IN ('casual', 'sick', 'earned', 'unpaid', 'maternity', 'paternity', 'bereavement')),
  start_date DATE,
  end_date DATE,
  
  -- For expense/reimbursement
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'INR',
  receipt_urls TEXT[] DEFAULT '{}',
  
  -- Approval chain
  current_approver UUID REFERENCES employees(id),
  approval_chain JSONB DEFAULT '[]',
  -- Format: [{ "approver_id": "...", "status": "approved", "comment": "...", "at": "..." }]
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'draft', 'pending', 'approved', 'rejected', 'cancelled',
    'escalated', 'on_hold', 'completed'
  )),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- Attachments
  attachments JSONB DEFAULT '[]',
  
  -- Comments
  comments JSONB DEFAULT '[]',
  -- Format: [{ "by": "user_id", "text": "...", "at": "..." }]
  
  -- Resolution
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES employees(id),
  resolution_note TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 8. WORKFLOWS
-- ==========================================
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  
  -- What triggers this workflow
  trigger_type TEXT NOT NULL CHECK (trigger_type IN (
    'new_employee', 'leave_request', 'expense_claim',
    'resignation', 'promotion', 'department_change',
    'probation_end', 'manual'
  )),
  
  -- Steps
  steps JSONB NOT NULL DEFAULT '[]',
  -- Format: [
  --   { "order": 1, "name": "HR Review", "assignee_role": "admin", "action": "approve", "sla_hours": 24 },
  --   { "order": 2, "name": "Manager Approval", "assignee_role": "manager", "action": "approve", "sla_hours": 48 },
  --   { "order": 3, "name": "IT Setup", "assignee_role": "admin", "action": "task", "sla_hours": 72 }
  -- ]
  
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES employees(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE workflow_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES workflows(id),
  triggered_by UUID REFERENCES employees(id),
  related_entity_type TEXT, -- 'application', 'employee', etc.
  related_entity_id UUID,
  
  current_step INT DEFAULT 1,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'cancelled', 'stuck')),
  
  step_history JSONB DEFAULT '[]',
  -- Format: [{ "step": 1, "completed_by": "...", "action": "approved", "at": "...", "comment": "..." }]
  
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 9. NOTIFICATIONS
-- ==========================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL CHECK (type IN (
    'message', 'mention', 'channel_invite', 'application_update',
    'event_invite', 'document_published', 'workflow_action',
    'birthday', 'anniversary', 'system'
  )),
  
  title TEXT NOT NULL,
  body TEXT,
  link TEXT, -- in-app navigation link
  
  -- Source reference
  source_type TEXT, -- 'message', 'application', 'event', 'document'
  source_id UUID,
  
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 10. AUDIT LOG
-- ==========================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES employees(id),
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout', 'export', 'acknowledge'
  entity_type TEXT NOT NULL, -- 'employee', 'channel', 'message', 'document', 'application'
  entity_id UUID,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 11. LEAVE BALANCES
-- ==========================================
CREATE TABLE leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  leave_type TEXT NOT NULL,
  year INT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  total_days DECIMAL(4,1) NOT NULL,
  used_days DECIMAL(4,1) DEFAULT 0,
  pending_days DECIMAL(4,1) DEFAULT 0,
  UNIQUE(employee_id, leave_type, year)
);

-- ==========================================
-- INDEXES
-- ==========================================
CREATE INDEX idx_employees_team ON employees(team_id);
CREATE INDEX idx_employees_reports_to ON employees(reports_to);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_messages_channel ON messages(channel_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_parent ON messages(parent_message_id);
CREATE INDEX idx_channel_members_employee ON channel_members(employee_id);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, is_read, created_at DESC);
CREATE INDEX idx_applications_submitted_by ON applications(submitted_by, status);
CREATE INDEX idx_applications_approver ON applications(current_approver, status);
CREATE INDEX idx_calendar_events_time ON calendar_events(start_time, end_time);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id, created_at DESC);
CREATE INDEX idx_documents_category ON documents(category, status);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (implement for each table):

-- Employees can see other active employees
CREATE POLICY "employees_select" ON employees
  FOR SELECT USING (
    status != 'exited' OR
    auth.uid() IN (SELECT auth_id FROM employees WHERE role IN ('super_admin', 'admin'))
  );

-- Only admins can insert employees
CREATE POLICY "employees_insert" ON employees
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT auth_id FROM employees WHERE role IN ('super_admin', 'admin'))
  );

-- Users can see messages in channels they belong to
CREATE POLICY "messages_select" ON messages
  FOR SELECT USING (
    channel_id IN (
      SELECT channel_id FROM channel_members
      WHERE employee_id = (SELECT id FROM employees WHERE auth_id = auth.uid())
    )
  );

-- Notifications: users see only their own
CREATE POLICY "notifications_own" ON notifications
  FOR SELECT USING (
    recipient_id = (SELECT id FROM employees WHERE auth_id = auth.uid())
  );
```

---

## Application Architecture

### Pages / Routes

```
/login                          — Auth page (email + password, Supabase Auth)
/                               — Dashboard (overview, quick stats, recent activity)
/profile                        — Own profile view/edit
/profile/[employee_id]          — View other employee's profile (filtered by role)
/directory                      — Employee directory (search, filter by team/department)
/directory/org-chart            — Org chart visualization (reporting hierarchy)

/chat                           — Channel list + active chat
/chat/[channel_slug]            — Channel messages view
/chat/dm/[employee_id]          — Direct message

/calendar                       — Calendar view (month/week/day)
/calendar/[event_id]            — Event detail

/documents                      — Document library (policies, rulebooks, etc.)
/documents/[slug]               — Document viewer
/documents/acknowledge/[id]     — Acknowledgement page

/applications                   — My applications list
/applications/new               — Submit new application
/applications/[id]              — Application detail + approval actions
/applications/approvals         — Pending approvals (for managers/admins)

/workflows                      — Workflow templates (admin only)
/workflows/[id]                 — Workflow detail + active instances

/notifications                  — All notifications

/admin                          — Admin dashboard
/admin/employees                — Employee management (CRUD)
/admin/employees/onboard        — New employee onboarding wizard
/admin/teams                    — Team management
/admin/channels                 — Channel management
/admin/documents                — Document management (CRUD + publish)
/admin/workflows                — Workflow builder
/admin/reports                  — Analytics & reports
/admin/audit-log                — Audit trail viewer
/admin/settings                 — System settings
```

### Sidebar Navigation Structure

```
📊 Dashboard
👤 My Profile
📁 Directory
   ├── People
   └── Org Chart
💬 Chat
   ├── Channels
   ├── Direct Messages
   └── Threads
📅 Calendar
📄 Documents
   ├── Policies
   ├── Rulebooks
   ├── Employee Rights
   ├── Privacy Policy
   ├── SOPs
   └── Templates
📝 Applications
   ├── My Requests
   ├── Submit New
   └── Approvals (badge count)
🔔 Notifications
⚙️ Admin (role-gated)
   ├── Employees
   ├── Teams
   ├── Channels
   ├── Documents
   ├── Workflows
   ├── Reports
   └── Audit Log
```

---

## Feature Specifications

### 1. Authentication & Onboarding

- **Login**: Email + password via Supabase Auth (no self-registration — admin creates accounts)
- **First login**: Force password change + profile completion wizard
- **Onboarding flow** (triggered by `new_employee` workflow):
  1. Admin creates employee record → auto-generates `employee_id` (AS-001, AS-002...)
  2. System sends invite email with temporary password
  3. Employee logs in → forced to: change password → upload avatar → fill emergency contact
  4. Auto-added to: `#general`, `#announcements`, team channel
  5. Auto-assigned: reporting manager, team, department
  6. Notification sent to manager: "New team member joined"
  7. Mandatory documents queued for acknowledgement

### 2. Employee Profile

- **Public fields**: Name, avatar, designation, department, team, email, phone, joining date
- **Private fields** (self + admin): DOB, address, emergency contact, salary band
- **Status indicator**: Online (green), Away (yellow), Offline (gray), On Leave (red badge)
- **Profile card** shows: reporting chain (who they report to → who reports to them)
- **Activity**: Last seen, join date, team history

### 3. Communication (Chat)

- **Channel types**: Public, Private, Direct, Announcement
- **Features**:
  - Real-time messaging via Supabase Realtime
  - Threaded replies (click on message → reply in thread)
  - File uploads (images, PDFs, docs — stored in Supabase Storage)
  - @mentions with autocomplete
  - Reactions (emoji picker)
  - Pin important messages
  - Search messages (full-text across channels user has access to)
  - Unread count badges per channel
  - Message editing + deletion (with "edited" / "deleted" indicator)
  - Typing indicators
  - Online presence
- **Auto-created channels**:
  - `#general` — everyone
  - `#announcements` — admin-only posting
  - `#[team-slug]` — auto-created per team
- **Notification rules**: @mention → push notification. Channel message → badge only (unless muted)

### 4. Calendar

- **Views**: Month, Week, Day, Agenda
- **Event types**: Meeting, Holiday, Birthday, Work Anniversary, Deadline, Training, Town Hall
- **Features**:
  - Color-coded by event type
  - RSVP (Accept/Decline/Tentative)
  - Meeting link integration (Google Meet/Zoom)
  - Recurring events
  - Auto-populated: birthdays + work anniversaries from employee data
  - Public holidays (Indian calendar)
  - Team calendar overlay
  - iCal export

### 5. Documents & Policies

- **Categories**: Policy, Rulebook, Privacy Policy, Employee Rights, Handbook, SOP, Guideline, Template
- **Features**:
  - Rich text editor (Tiptap or similar) for creating/editing
  - Version history (see what changed between versions)
  - PDF export
  - Acknowledgement tracking: "I have read and understood this document" with timestamp + IP
  - Deadline for acknowledgement (admin sets)
  - Dashboard widget: "X pending acknowledgements"
  - Search across all documents
  - Access control per document (all employees, managers+, admins, specific teams)

### 6. Applications & Approvals

- **Application types**: Leave, WFH, Expense, Asset Request, Training, Grievance, Resignation, etc.
- **Submission flow**:
  1. Employee fills form (type-specific fields)
  2. Attaches supporting documents
  3. Auto-routes to reporting manager (or custom approval chain from workflow)
  4. Approver gets notification
  5. Approve/Reject/Escalate with comment
  6. Multi-level approval for high-value requests
  7. Employee gets notification on status change
- **Leave management**:
  - Leave balance dashboard (casual, sick, earned, etc.)
  - Calendar integration (approved leaves show on team calendar)
  - Conflict detection (multiple team members on leave same day → warning)
- **Expense management**:
  - Amount + receipt upload
  - Currency support (INR default)
  - Category tagging

### 7. Workflows

- **Admin-configurable** approval/task chains
- **Trigger types**: New employee, Leave request, Expense claim, Resignation, etc.
- **Step types**: Approve/Reject, Complete Task, Send Notification, Auto-assign
- **SLA tracking**: Each step has a deadline (e.g., "Manager must approve within 48 hours")
- **Escalation**: If SLA breached → auto-escalate to next level
- **Visual builder** (drag-and-drop steps) — stretch goal, can start with JSON config

### 8. Notifications

- **In-app**: Bell icon with badge count, notification panel
- **Types**: New message mention, Application status update, Event invite, Document published, Workflow action needed, Birthday/Anniversary
- **Mark as read** individually or bulk
- **Notification preferences**: Each user can toggle notification types on/off

### 9. Admin Panel

- **Employee management**: Add/edit/deactivate employees, bulk import via CSV
- **Team management**: Create teams, assign leads, nest teams
- **Channel management**: Create/archive channels, manage members
- **Document management**: CRUD + publish/unpublish
- **Workflow builder**: Create/edit workflow templates
- **Reports**:
  - Head count by department/team
  - Leave utilization
  - Application statistics
  - Channel activity
  - Login frequency
- **Audit log**: Searchable log of all actions (who did what, when)

### 10. Dashboard

- **Widgets** (role-dependent):
  - Quick stats: Total employees, Active today, On leave, Pending approvals
  - Upcoming events (next 7 days)
  - Recent announcements
  - Pending acknowledgements
  - My pending applications
  - Team members on leave today
  - Birthday/anniversary today
  - Quick links: Submit leave, View policies, Open chat

---

## UI/UX Requirements

- **Theme**: Dark mode (matching AnantaSutra brand — `#0A0A1E` background, `#E8A317` saffron accent, `#6A3DE8` violet secondary)
- **Light mode** toggle available
- **Responsive**: Must work on mobile (especially chat + applications)
- **Sidebar**: Collapsible on mobile, always visible on desktop
- **Loading states**: Skeleton loaders, not spinners
- **Animations**: Subtle, no excessive motion
- **Accessibility**: WCAG 2.1 AA compliant
- **Search**: Global search bar (Cmd+K / Ctrl+K) — searches employees, channels, documents, messages

---

## Real-time Features (Supabase Realtime)

1. **Chat messages**: Subscribe to channel → new messages appear instantly
2. **Typing indicator**: Broadcast via Supabase Realtime Broadcast
3. **Presence**: Track who's online via Supabase Realtime Presence
4. **Notifications**: Push via Supabase Realtime → show toast + badge
5. **Application status**: Real-time status update when approver acts

---

## Security Requirements

- All API calls through Supabase RLS (no direct DB access from client)
- Passwords: Supabase Auth handles hashing (bcrypt)
- Session management: JWT with refresh tokens (Supabase default)
- File uploads: Authenticated access only (Supabase Storage policies)
- Audit logging: Every create/update/delete action logged
- CORS: Lock to internal.anantasutra.com only
- Rate limiting: On auth endpoints
- Data export: Only super_admin + admin can export employee data
- GDPR/Indian data protection: Employee data deletion on exit (configurable retention period)

---

## Deployment & DevOps

- **Staging**: Deploy to Vercel preview branches
- **Production**: Vercel (frontend) + Supabase (backend)
- **Environment variables**: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
- **CI/CD**: GitHub Actions → lint → type-check → build → deploy
- **Monitoring**: Vercel Analytics + Supabase Dashboard

---

## Phase-wise Implementation

### Phase 1 — Foundation (Week 1-2)
- [x] Supabase project setup + all tables + RLS policies
- [x] Auth (login, session, password change)
- [x] Employee CRUD (admin panel)
- [x] Role-based routing + middleware
- [x] Dashboard skeleton
- [x] Sidebar navigation

### Phase 2 — Communication (Week 3-4)
- [ ] Channel CRUD + membership
- [ ] Real-time chat with Supabase Realtime
- [ ] Direct messages
- [ ] File uploads in chat
- [ ] @mentions + reactions
- [ ] Threading
- [ ] Typing indicators + presence

### Phase 3 — Documents & Calendar (Week 5-6)
- [ ] Document CRUD + rich text editor
- [ ] Acknowledgement tracking
- [ ] Calendar with event CRUD
- [ ] RSVP + recurring events
- [ ] Auto-populate birthdays/anniversaries

### Phase 4 — Applications & Workflows (Week 7-8)
- [ ] Application submission forms
- [ ] Leave balance management
- [ ] Approval flow
- [ ] Workflow engine
- [ ] Notifications (in-app)
- [ ] SLA tracking

### Phase 5 — Polish & Launch (Week 9-10)
- [ ] Global search (Cmd+K)
- [ ] Org chart visualization
- [ ] Reports & analytics
- [ ] Audit log viewer
- [ ] Mobile responsiveness pass
- [ ] Performance optimization
- [ ] Security audit
- [ ] User acceptance testing

---

## Non-Functional Requirements

- **Page load**: < 2 seconds (Lighthouse performance > 85)
- **Chat latency**: < 200ms message delivery
- **Uptime**: 99.9% (Supabase + Vercel SLA)
- **Scalability**: Support 50-500 employees without architecture changes
- **Browser support**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Data backup**: Supabase automated backups (daily)
