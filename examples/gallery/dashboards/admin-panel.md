# Admin Panel

> **Use Case:** Application administration dashboard for managing users, content, and system settings.
>
> **Key Features:** User management, CRUD operations, permissions, system stats, activity logs

[[ :logo: AdminHub | *Dashboard* | Users | Content | Settings | :bell: (3) | :user: John Doe ]]

::: sidebar
### Main Menu
- :home: **Dashboard**
- :users: Users
- :content: Content
- :shopping: Orders
- :chart: Analytics
- :settings: Settings
- :help: Help & Support

### Quick Actions
[+ New User]
[+ New Post]
[+ New Order]

### System Status
- ✅ All systems operational
- 🟢 API: Healthy
- 🟢 Database: Healthy
- 🟢 Storage: 67% used
:::

---

## Dashboard Overview

[[ Dashboard > Admin Panel ]]

---

::: alert warning
⚠️ **Scheduled Maintenance:** System will be down for 30 minutes on Sunday 3am EST. [View Details →]
:::

---

## System Stats {.grid-5}

### Total Users
**24,567**
+234 this week

### Active Sessions
**1,234**
Current online

### Total Revenue
**$458,234**
+12% this month

### Support Tickets
**89**
23 pending

### Server Load
**67%**
Normal

##

---

## Recent Activity {.grid-2}

### Latest Users

| User | Email | Role | Status | Joined |
|------|-------|------|--------|--------|
| ![👤] John Smith | [email protected] | Admin | Active | 2h ago |
| ![👤] Sarah Lee | [email protected] | Editor | Active | 5h ago |
| ![👤] Mike Chen | [email protected] | User | Pending | 1d ago |
| ![👤] Emma Davis | [email protected] | User | Active | 2d ago |
| ![👤] Alex Johnson | [email protected] | Moderator | Active | 3d ago |

[Manage Users →]

### Recent Orders

| Order | Customer | Amount | Status | Date |
|-------|----------|--------|--------|------|
| #12345 | John Doe | $129.99 | Completed | 10m ago |
| #12344 | Jane Smith | $89.50 | Processing | 1h ago |
| #12343 | Bob Wilson | $234.99 | Shipped | 3h ago |
| #12342 | Alice Brown | $45.00 | Pending | 5h ago |
| #12341 | Charlie Kim | $178.50 | Completed | 8h ago |

[View All Orders →]

##

---

## User Management

::: card

### User Actions

Search Users
[Search by name, email, or ID...___________] {type:search}

[Search] [Advanced Filters ▼]

**Bulk Actions:**
[Select action...v] [Apply to Selected]

- [ ] Select All (50 users on this page)

**Filters:**
Role: [All Roles...v] | Status: [All...v] | Date: [Last 30 days...v]

:::

---

## User List

| Select | User | Email | Role | Status | Last Login | Actions |
|--------|------|-------|------|--------|------------|---------|
| [ ] | ![👤] John Smith | [email protected] | Admin | Active | 2h ago | [Edit] [Delete] [•••] |
| [ ] | ![👤] Sarah Lee | [email protected] | Editor | Active | 5h ago | [Edit] [Delete] [•••] |
| [ ] | ![👤] Mike Chen | [email protected] | User | Pending | Never | [Edit] [Delete] [•••] |
| [ ] | ![👤] Emma Davis | [email protected] | User | Active | 1d ago | [Edit] [Delete] [•••] |
| [ ] | ![👤] Alex Johnson | [email protected] | Moderator | Active | 2d ago | [Edit] [Delete] [•••] |

Showing 1-5 of 24,567 users

[← Previous] [1] [2] [3] ... [4913] [Next →]

---

## Content Management {.grid-2}

### Published Content

| Type | Count | This Week |
|------|-------|-----------|
| Blog Posts | 1,234 | +23 |
| Pages | 456 | +5 |
| Products | 789 | +12 |
| Media Files | 5,678 | +156 |

[Manage Content →]

### Draft Content

**Pending Review:** 45
**Scheduled:** 12
**Auto-saved:** 8

[Review Drafts →]

##

---

## System Settings

::: card

### General Settings

Site Name
[AdminHub___________]

Site URL
[https://adminhub.com___________] {type:url}

Admin Email
[[email protected]___________] {type:email}

Timezone
[UTC-8 Pacific Time...v]

Language
[English...v]
- English
- Spanish
- French
- German

Date Format
- (*) MM/DD/YYYY
- ( ) DD/MM/YYYY
- ( ) YYYY-MM-DD

---

### Security Settings

Two-Factor Authentication
- [x] Enable 2FA for all admins
- [ ] Require 2FA for all users

Session Timeout
[30___] minutes

Password Policy
- [x] Minimum 8 characters
- [x] Require uppercase letter
- [x] Require number
- [x] Require special character

Failed Login Attempts
[5___] attempts before lockout

---

### Email Settings

SMTP Host
[smtp.example.com___________]

SMTP Port
[587___] {type:number}

Encryption
- (*) TLS
- ( ) SSL
- ( ) None

From Name
[AdminHub___________]

From Email
[[email protected]___________] {type:email}

[Test Connection] [Save Settings]*

:::

---

## Activity Log

::: card

### Recent System Events

Filter by:
Event Type: [All Events...v] | User: [All Users...v] | Date: [Today...v]

| Time | Event | User | IP Address | Details |
|------|-------|------|------------|---------|
| 2m ago | User Login | john@example.com | 192.168.1.1 | Successful |
| 5m ago | Content Published | sarah@example.com | 192.168.1.2 | Blog Post #1234 |
| 12m ago | User Created | admin@example.com | 192.168.1.3 | New user: mike@example.com |
| 18m ago | Settings Changed | admin@example.com | 192.168.1.3 | Updated SMTP settings |
| 25m ago | Order Completed | system | - | Order #12345 |
| 30m ago | Failed Login | unknown | 192.168.1.100 | Invalid credentials |

[Export Log] [Clear Old Logs]

:::

---

## Database & Storage {.grid-2}

### Database Stats

**Total Records:** 1,234,567
**Size:** 2.4 GB
**Last Backup:** 2 hours ago

**Tables:**
- Users: 24,567 rows
- Orders: 189,234 rows
- Products: 789 rows
- Content: 1,234 rows

[Backup Now] [Optimize Database]

### Storage Usage

**Total Storage:** 100 GB
**Used:** 67 GB (67%)
**Available:** 33 GB

[###########################_____] 67%

**Breakdown:**
- Media Files: 45 GB (67%)
- Backups: 15 GB (22%)
- Logs: 5 GB (7%)
- Other: 2 GB (3%)

[Cleanup Storage]

##

---

## Support Tickets {.grid-3}

### Open Tickets
**23** new

Priority breakdown:
- 🔴 High: 5
- 🟡 Medium: 12
- 🟢 Low: 6

[View Tickets →]

### In Progress
**45** active

Average response time:
**2.5 hours**

[Assign Tickets →]

### Resolved Today
**89** closed

Customer satisfaction:
**4.8** / 5.0

[View Reports →]

##

---

## Quick Actions

## Administrative Tools {.grid-4}

### :user: Create User
Add new user account

[+ New User]*

### :content: Add Content
Create new post/page

[+ New Content]*

### :mail: Send Email
Broadcast to users

[Compose]*

### :download: Export Data
Download reports

[Export]*

##

---

## Performance Metrics

::: card

### Server Performance (Last Hour)

**CPU Usage**
[#########_________] 45%

**Memory Usage**
[##############____] 67%

**Disk I/O**
[######____________] 32%

**Network Bandwidth**
[###########_______] 58%

---

### API Requests

**Total Requests:** 1,234,567 (last 24h)
**Average Response Time:** 145ms
**Error Rate:** 0.02%

![API Chart](https://via.placeholder.com/600x200)

[View API Dashboard →]

:::

---

::: footer
**System Version:** 2.5.0 • **Uptime:** 45 days • **Last Deploy:** 3 days ago • [Documentation] • [Support] • [Changelog]
:::

---

**Style Variations:**
- `sketch` - Quick admin panel wireframe
- `clean` - Professional admin interface
- `wireframe` - Focus on data structure
- `tailwind` - Modern dashboard aesthetic
- `material` - Google Admin style
- `brutal` - Bold, high-contrast UI
- `none` - Semantic markup for frameworks

**Generate this example:**
```bash
wiremd admin-panel.md --style sketch
wiremd admin-panel.md --style clean -o admin-clean.html
wiremd admin-panel.md --style material -o admin-material.html
```
