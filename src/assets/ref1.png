🧭 Nexus — Recommended Page Structure
Main navigation
                    NEXUS
                      │
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
    Dashboard      Live Map       Reports
        │                            │
        ↓                            ↓
      Needs                    Report Details
        │
        ↓
   Verification
        │
        ↓
    AI Copilot

So I recommend:

6 primary pages + 1 detail page
#	Page	Main purpose
01	🏠 Dashboard	Overall situation at a glance
02	🗺️ Live Map	See needs geographically
03	📋 Reports	Browse incoming field reports
04	🚨 Needs & Priorities	Consolidate and prioritize humanitarian needs
05	✅ Verification Centre	Human verification of AI findings
06	🤖 AI Copilot	Ask questions about the operational data
+	📄 Report Details	Deep dive into an individual report

That's enough for a strong hackathon prototype.

01 — 🏠 DASHBOARD

This is the home page after login.

Purpose

Answer the responder's question:

"What is happening right now?"

Contents
┌─────────────────────────────────────────────────────┐
│ NEXUS                              🔔  User          │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Dashboard│  FLOOD RESPONSE — PALAKKAD             │
│          │  Updated 2 minutes ago                  │
│ Live Map │                                          │
│          │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│ Reports  │  │ 184  │ │ 72   │ │ 31   │ │ 8    │ │
│          │  │Reports│ │Verified│ │High │ │Critical│
│ Needs    │  └──────┘ └──────┘ └──────┘ └──────┘ │
│          │                                          │
│ Verify   │  ┌───────────────────┐ ┌─────────────┐ │
│          │  │                   │ │  CRITICAL   │ │
│ Copilot  │  │       MAP         │ │  NEEDS      │ │
│          │  │                   │ │             │ │
│          │  │    🔴   🟠        │ │ 🔴 Water   │ │
│          │  │        🔴         │ │ 🔴 Medical │ │
│          │  │                   │ │ 🟠 Shelter │ │
│          │  └───────────────────┘ └─────────────┘ │
│          │                                          │
│          │  RECENT REPORTS                         │
│          │  🔴 Water shortage       2 min ago      │
│          │  🟠 Shelter damage       8 min ago      │
└──────────┴──────────────────────────────────────────┘
Components

Top statistics

Total reports
Verified reports
High-priority needs
Critical needs

Situation map

Major need locations
Severity markers

Priority needs

Critical
High
Medium

Recent reports

Latest incoming information
This page should NOT contain

❌ Huge charts
❌ 20 different statistics
❌ Complicated analytics

The dashboard is for situational awareness, not deep analysis.

02 — 🗺️ LIVE MAP

This is one of your most important pages.

Purpose

Answer:

"Where are the needs?"

6
Main content

The map should occupy roughly 70–80% of the screen.

┌─────────────────────────────────────────────────────┐
│ LIVE MAP                         🔍 Search          │
├─────────────────────────────────────────────────────┤
│ FILTERS │                                         │
│         │                                         │
│ Need    │                                         │
│ ☑ Water │              🗺️ MAP                    │
│ ☑ Medical│                                       │
│ ☑ Shelter│          🔴                           │
│         │                 🟠                      │
│ Severity│                     🔴                  │
│ ☑ Critical│                                      │
│ ☑ High  │                                         │
│         │                                         │
│ Date    │                                         │
│ Last 24h│                                         │
└─────────────────────────────────────────────────────┘
Filters
Need type
Severity
Verification status
Date/time
Location
Map markers

🔴 Critical
🟠 High
🟡 Medium
🟢 Verified/resolved

Clicking a marker

Show a small side panel:

Ward 4

🚰 Drinking water
146 people affected

3 related reports

View Details →

03 — 📋 REPORTS

This is your raw information repository.

Purpose

Answer:

"What have field teams reported?"

Page contents
Header

Field Reports

🔍 Search

Filter

+ Add Report

Filters
Date
Location
Source
Need type
Severity
Verification status
Report cards/list
🔴 DRINKING WATER SHORTAGE

12 families near the community school
have no access to drinking water.

📍 Ward 4
👤 Field Volunteer
🕐 12:42 PM

AI detected:
WATER · HIGH PRIORITY

Status: 🟡 Pending Verification

Another:

🟠 SHELTER DAMAGE

Two houses completely damaged.

📍 Ward 2
👤 Field Team
🕐 12:35 PM

Status: 🟢 Verified
04 — 📄 REPORT DETAILS

This is not necessarily a sidebar page.

It's the detail view when someone clicks a report.

Purpose

Answer:

"What exactly does this report tell us, and why did the AI interpret it this way?"

This page is extremely important for demonstrating your AI.

Section 1 — Original report
FIELD REPORT

"12 families near the community school
have no access to drinking water..."
Section 2 — Location

📍 Ward 4
Community School

Section 3 — AI extraction
Detected Need       Drinking Water
Affected Population 12 families
Location            Ward 4
Urgency             High
Confidence          91%
Section 4 — Evidence

📷 Photo 1
📷 Photo 2

Section 5 — Related reports
3 similar reports found

Report #184
Report #193
Report #201
Section 6 — Possible duplicate

⚠️ Similar report detected.

Compare Reports

Section 7 — Human action
[ ✓ VERIFY ]

[ ✏ EDIT ]

[ ✕ REJECT ]

[ 🔗 MERGE ]

This page basically demonstrates your AI + evidence + human-in-the-loop architecture.

05 — 🚨 NEEDS & PRIORITIES

This page is different from Reports.

Reports are:

What people reported.

Needs are:

What the system understands from all those reports.

This distinction is VERY important.

Example

You could have:

7 separate reports

↓

AI detects they all refer to:

🚰 Drinking Water Shortage

146 people affected

3 locations

7 supporting reports

Priority: CRITICAL

Page layout
┌──────────────────────────────────────────────────┐
│ NEEDS & PRIORITIES                               │
│                                                  │
│ [Critical] [High] [Medium] [All]                │
│                                                  │
│ 🔴 DRINKING WATER                               │
│    146 people · 7 reports · 3 locations         │
│    CRITICAL                                     │
│    [View Evidence]                              │
│                                                  │
│ 🔴 MEDICAL ASSISTANCE                            │
│    8 people · 3 reports · 2 locations           │
│    CRITICAL                                     │
│                                                  │
│ 🟠 EMERGENCY SHELTER                             │
│    37 families · 5 reports                     │
│    HIGH                                         │
└──────────────────────────────────────────────────┘

This page shows the information fusion part of your project.

06 — ✅ VERIFICATION CENTRE

This is where humans check AI output.

Purpose

"What does the AI need me to verify?"

This should be a task-oriented page.

At the top:

12 Items Awaiting Verification

Then:

┌────────────────────────────────────────────┐
│ AI DETECTED: DRINKING WATER SHORTAGE       │
│                                            │
│ Confidence: 91%                            │
│                                            │
│ Evidence:                                  │
│ Report #184                                │
│ Report #193                                │
│ Photo #72                                  │
│                                            │
│ Affected: 146 people                       │
│ Location: Ward 4                           │
│                                            │
│ [ ✓ CONFIRM ] [ ✏ EDIT ] [ ✕ REJECT ]     │
└────────────────────────────────────────────┘
Important UX idea

Make verification fast.

The responder shouldn't have to navigate through five pages to confirm something.

07 — 🤖 AI COPILOT

This is your natural-language interface.

Purpose

Answer:

"Let me ask the system about the situation."

Example questions:

What are the critical needs in Ward 4?

Which needs have multiple corroborating reports?

Show me unverified medical reports from the last 6 hours.

Summarize the current shelter situation.

UI
┌────────────────────────────────────────────────┐
│ HUMANITARIAN COPILOT                          │
│ Evidence-backed operational assistant         │
├────────────────────────────────────────────────┤
│                                                │
│ Suggested questions                           │
│                                                │
│ [What are today's critical needs?]             │
│ [Show unverified reports]                     │
│ [Summarize Ward 4]                            │
│                                                │
│ ┌────────────────────────────────────────────┐ │
│ │ Ask about the current situation...       │ │
│ └────────────────────────────────────────────┘ │
│                         [Ask]                  │
│                                                │
│ ───────────────────────────────────────────── │
│                                                │
│ RESPONSE                                      │
│                                                │
│ 3 critical needs have been identified...      │
│                                                │
│ Sources: #184 · #193 · #201                   │
└────────────────────────────────────────────────┘
So your complete structure is:
                    NEXUS
                      │
       ┌──────────────┼──────────────┐
       │              │              │
       ▼              ▼              ▼
   DASHBOARD       LIVE MAP       REPORTS
       │                             │
       │                             ▼
       │                       REPORT DETAILS
       │
       ▼
  NEEDS & PRIORITIES
       │
       ▼
  VERIFICATION
       │
       ▼
  AI COPILOT