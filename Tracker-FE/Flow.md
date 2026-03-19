# CSM Ticketing Tool — Full Product Prompt

You are building a B2B customer success management (CSM) ticketing tool. Below is the complete product specification covering authentication, onboarding, app structure, ticket lifecycle, team management, and integrations. Follow this spec precisely.

---

## 1. Authentication & Onboarding

### Path A — New workspace (admin / founder)

1. **Sign up form** — collect: full name, work email, password. No other fields at this stage.
2. **OTP verification** — send a 6-digit one-time code to the provided email. 10-minute expiry. Resend option available. User enters the OTP inline without leaving the app. Auto-submit on the 6th digit.
3. **Workspace setup** — single field: organisation name. Nothing else. No org size, no logo, no industry.
4. **Enter dashboard** — admin lands on dashboard with a guided onboarding checklist (dismissible).

### Path B — Invited teammate

1. **Invite link** — admin sends invite via email. Link contains a pre-assigned role. Expires in 7 days.
2. **Pre-filled form** — email is locked/pre-filled. User enters name and password only.
3. **Email auto-verified** — no OTP required. Invite link click proves email ownership.
4. **Role pre-assigned** — role is set by the admin at invite time. No decision screen for the invitee.
5. **Enter dashboard** — teammate lands on the same dashboard with context appropriate to their role.

### Error states to handle
- Email already exists → show "Sign in instead" prompt
- OTP expired → show resend button, do not redirect
- Invite link expired → show "Request a new invite" message
- Wrong OTP → show attempt count, lock after 5 failures for 15 minutes

### Deferred to settings (never shown at signup)
Org size, logo, industry, SSO config, custom domain, billing details. Surface these progressively via a "Complete your profile" nudge in the dashboard header after signup.

---

## 2. App Structure & Navigation

### Sidebar (all users)
- Dashboard
- Tickets
- Contacts
- Integrations
- Settings (profile, notifications)

### Sidebar (admin only — hidden entirely for non-admins, not greyed out)
- Team

### Global UI behaviour
- "Create ticket" button is accessible from anywhere (global header or keyboard shortcut)
- Ticket detail opens as a side drawer, not a new page, so agents keep list context
- Notifications bell in header — in-app alerts for assignments, replies, SLA warnings

---

## 3. Dashboard

Stats shown on load:
- Total open tickets
- Tickets assigned to me
- Average first response time
- SLA breach count (today)
- Tickets by status (bar or donut chart)
- Recent activity feed (last 10 events across the workspace)

Empty state (new workspace): show the onboarding checklist with three actions:
1. Create your first ticket
2. Invite a teammate
3. Add the integration widget to your site

---

## 4. Tickets

### Views
- **Kanban view** — columns: Open, In Progress, Waiting, Resolved. Drag-and-drop between columns.
- **List view** — sortable table with columns: ID, title, contact, assignee, priority, status, created date, SLA timer.

### Filters & search
- Filter by: status, priority, assignee, tag, date range, source (manual vs widget)
- Full-text search across title and thread content
- Saved filter views per user

### Ticket fields (on creation)
- Title (required)
- Description
- Contact (link to contact record)
- Assignee (agent or team)
- Priority: Urgent / High / Medium / Low
- Tags (free-form, multi-select)
- Source: auto-set to "manual" or "widget"

### Ticket status flow
```
Open → In Progress → Waiting → Resolved
```
- Tickets auto-reopen if a client replies after Resolved status
- SLA timers pause when status = Waiting
- Status changes are logged in the activity log with timestamp and actor

### Ticket detail panel (side drawer)
- Reply thread (internal notes vs client-facing replies — visually distinct)
- Editable metadata: priority, status, assignee, tags
- Linked contact record
- Activity log: every change with who did it and when
- Attachments support

### SLA rules (default, configurable in settings)
| Priority | Default SLA |
|----------|-------------|
| Urgent   | 1 hour      |
| High     | 4 hours     |
| Medium   | 24 hours    |
| Low      | 72 hours    |

- SLA timer is visible on every ticket card and in list view
- SLA breach triggers escalation notification to the assignee's manager
- SLA timers pause when status = Waiting, resume when status changes back

### Bulk actions (list view)
- Assign to agent
- Change status
- Change priority
- Add tag
- Delete

---

## 5. Contacts

- Contact list with search and filter
- Contact profile page contains:
  - Name, email, company, phone
  - All linked tickets (open and historical)
  - Notes (internal, agent-only)
  - Activity timeline (ticket events related to this contact)
- Contacts are created automatically when a ticket is created via the embed widget
- Contacts can be created manually by agents and admins

---

## 6. Team (admin only)

### Member management
- List of all workspace members with name, email, role, team, last active
- Invite new member: enter email, select role, optionally assign to a team
- Remove member: removes access immediately, reassigns their open tickets to a queue
- View member performance: tickets resolved, avg response time, open ticket count

### Roles
Three default roles. Admins can create custom roles.

| Permission                  | Agent      | Manager       | Admin |
|-----------------------------|------------|---------------|-------|
| View & reply tickets        | yes        | yes           | yes   |
| Create tickets              | yes        | yes           | yes   |
| Assign tickets              | own only   | yes           | yes   |
| View contacts               | yes        | yes           | yes   |
| Edit contacts               | no         | yes           | yes   |
| View team section           | no         | yes           | yes   |
| Invite members              | no         | yes           | yes   |
| Remove members / set roles  | no         | no            | yes   |
| Billing & plan              | no         | no            | yes   |
| Integrations & API keys     | no         | no            | yes   |

### Teams
- Admins can create named teams (e.g. "Support", "Enterprise", "Onboarding")
- Members can belong to multiple teams
- Tickets can be assigned to a team (round-robin or manually picked up)

---

## 7. Integrations

### Embed widget
- Admin copies a `<script>` tag from the Integrations page
- Script renders a contact form widget on their website
- Widget fields: name, email, subject, message
- On submission, a ticket is auto-created in the CSM tool with source = "widget"
- Contact record is auto-created or matched by email
- Domain whitelist: only whitelisted domains can fire the widget script
- Auto-assignment: configure round-robin or assign to a specific team/agent

### Webhooks
- Events: ticket.created, ticket.updated, ticket.resolved, ticket.assigned
- Admin configures endpoint URL and secret key
- Retry logic: 3 attempts with exponential backoff on failure

### API
- REST API with key-based authentication
- Admin generates and revokes API keys from Integrations page
- Key scopes: read-only, read-write

---

## 8. Settings

### User-level (all roles)
- Profile: name, avatar, timezone, language
- Notifications: configure which events trigger email vs in-app alerts
- Password change

### Workspace-level (admin only)
- Organisation name, logo, industry, org size
- Custom ticket fields (text, dropdown, date, checkbox)
- SLA rules per priority level
- Canned responses (reusable reply templates)
- Auto-assignment rules
- Audit log (all admin-level actions, 90-day retention)
- Billing & plan
- Custom domain (future)
- SSO / SAML config (future)

---

## 9. Notifications

### In-app (bell icon, header)
- Ticket assigned to me
- Reply received on my ticket
- SLA warning (30 min before breach)
- SLA breached
- Ticket status changed by teammate
- New member joined workspace (admin only)

### Email notifications
- Same events as above, configurable per user in Settings > Notifications
- Client receives email confirmation when their widget submission is received
- Client receives email when an agent replies to their ticket (optional, configurable)

---

## 10. Technical & UX constraints

- All role-based UI sections are hidden entirely for unauthorised roles — never just greyed out
- Ticket detail is always a side drawer — never a full page navigation
- OTP is the only email verification method — no magic links
- Org size, logo, and advanced settings are never shown during onboarding
- SLA timers must pause when ticket status = Waiting
- Embed widget requires domain whitelisting to prevent abuse
- Invite links expire after 7 days and are single-use
- All admin actions are recorded in the audit log
- Ticket source (manual vs widget) is always stored and filterable