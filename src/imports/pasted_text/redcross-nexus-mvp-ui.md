RedCross Nexus — MVP UI
Overall structure
┌──────────────────────────────────────────────┐
│  REDCROSS NEXUS                              │
│                                              │
│  Situation     Fusion Queue     Clusters     │
│                                              │
└──────────────────────────────────────────────┘
Only 3 main pages:
Situation Overview
Fusion Queue
Need Cluster / Evidence Detail

And then a small Upload/Import modal, rather than making data collection its own page.

1. Situation Overview
Purpose

This is not another IFRC GO dashboard.

It should answer only:

"What has Nexus discovered by combining the incoming information?"

That's the distinction.

Layout
┌────────────────────────────────────────────────────┐
│ REDCROSS NEXUS                       Flood Response │
├────────────────────────────────────────────────────┤
│                                                    │
│  15 OBSERVATIONS       4 CLUSTERS       2 REVIEW   │
│                                                    │
├────────────────────────────────────────────────────┤
│                                                    │
│  NEED CLUSTERS                                     │
│                                                    │
│  🔴 Drinking Water                                │
│     5 observations · 40–45 families               │
│     ⚠ Conflicting update                          │
│                                                    │
│  🟠 Shelter Damage                                │
│     4 observations · 12 families                  │
│                                                    │
│  🔴 Medical Assistance                            │
│     3 observations · 8 people                     │
│                                                    │
│  🟡 Road Access                                   │
│     3 observations                                │
│                                                    │
└────────────────────────────────────────────────────┘
What appears here

Top metrics:

Observations received
Need clusters created
Clusters needing verification
Conflicts detected

Then the cluster cards.

Each card shows:

Need type
affected population
number of supporting observations
verification status
conflict indicator
last update
What does NOT appear here

❌ Detailed map
❌ Form submission interface
❌ Volunteer management
❌ Disaster statistics
❌ General charts
❌ Resource allocation

Because those aren't your differentiator.

2. Fusion Queue ⭐

This is actually the heart of the application.

Think of it as:

"Show me what Nexus thinks should be connected, merged, separated, or investigated."

Instead of showing all incoming reports like Kobo's data table, this page shows AI-generated relationships between reports.

Example
FUSION QUEUE

─────────────────────────────────────────────

🔗 POSSIBLE SAME SITUATION

Report #021
"No water near the school"

        +

Report #034
"40 families waiting for water
at the relief centre"

AI assessment:
Likely same need

Similarity       91%
Location overlap 87%
Time proximity   94%

[ VIEW EVIDENCE ] [ MERGE ]

─────────────────────────────────────────────

⚠ CONFLICT DETECTED

Report #041
"Tanker hasn't arrived"

        VS

Report #045
"Tanker arrived at 11:14"

AI assessment:
Conflicting situation update

[ INVESTIGATE ]

─────────────────────────────────────────────

🔗 POSSIBLE DUPLICATE

Report #018
"12 houses damaged"

        +

Report #019
"12 homes damaged"

[ MERGE ] [ KEEP SEPARATE ]

This page doesn't exist just to show reports.

It shows relationships between reports.

That's the distinction you want judges to understand.

3. Need Cluster / Evidence Detail ⭐⭐⭐

This should be your most visually impressive page.

When the responder clicks:

🔴 Drinking Water Shortage

they enter the cluster.

Header
DRINKING WATER SHORTAGE

📍 Government UP School

40–45 families potentially affected

HIGH PRIORITY

⚠ NEEDS VERIFICATION

Then:

A. Evidence summary
5 observations
3 independent sources
1 photograph
1 conflicting update
B. Evidence relationship graph

This would be really nice visually.

                 ┌──────────────┐
                 │ Report #021  │
                 │ No water     │
                 └──────┬───────┘
                        │
                        │ supports
                        ↓
              ┌───────────────────┐
              │ WATER SHORTAGE     │
              │   NEED CLUSTER     │
              └───────────────────┘
                  ↑            ↑
                  │            │
              supports      evidence
                  │            │
        ┌─────────┘        ┌───┴────┐
        │                  │ Photo  │
   Report #034             │ #008   │
   40 families             └────────┘

                  ⚠ conflicts

              Report #045
              "Tanker arrived"

This is very different from a normal dashboard.

4. Evidence Timeline

Below the relationship graph:

SITUATION TIMELINE

10:32
🔴 Report #021
"No drinking water available"

10:41
🔴 Report #034
"40 families affected"

10:58
🟠 Report #038
"Tanker delayed"

11:14
⚠ Report #045
"Tanker arrived"

11:16
📷 Photo #008
"Tanker visible at centre"

This lets the responder understand:

How did our understanding of this situation change over time?

That's a genuinely useful information-fusion feature.

5. Human Verification Panel

At the bottom:

NEXUS ASSESSMENT

The following reports appear to describe
the same drinking-water shortage.

Confidence: 91%

Reasons:
✓ Same location
✓ Same need type
✓ Similar affected population
✓ Reports within 44 minutes

Conflict:
⚠ Latest report indicates tanker arrival

────────────────────────────────

[ ✓ CONFIRM CLUSTER ]

[ ✏ EDIT ]

[ SPLIT ]

[ REJECT ]

This is where the human responder makes the final call.

6. Import Data — NOT a full page

This is important.

You don't need a "Submit Report" page.

Because Kobo already collects text, images, audio, video and GPS data, including offline collection.

Instead, have a simple button:

+ Import Observations

Click → modal:

IMPORT OBSERVATIONS

[ Upload CSV / JSON ]

or

[ Paste field report ]

or

[ Add sample demo data ]

──────────────────

15 observations ready

[ RUN NEXUS FUSION ]

For the hackathon, "Add sample demo data" is actually very useful.

You can instantly load your flood scenario.

So the complete navigation is
                  REDCROSS NEXUS
                         │
       ┌─────────────────┼──────────────────┐
       ↓                 ↓                  ↓
  SITUATION          FUSION QUEUE       CLUSTERS
       │                 │                  │
       │                 │                  ↓
       │                 │            CLUSTER DETAIL
       │                 │                  │
       │                 │                  ├─ Evidence
       │                 │                  ├─ Timeline
       │                 │                  ├─ Relationships
       │                 │                  └─ Verification
       │                 │
       └─────────────────┴────────────────────
                    IMPORT
                     MODAL
What we deliberately remove

This is where your thinking is exactly right.

Existing capability	Nexus UI
Field data collection	❌ Don't build
Offline forms	❌
GPS collection	❌
Basic submission table	❌
Basic map	❌
Generic reports/charts	❌
Audio transcription	❌
Basic AI summarization	❌
Project/form management	❌
General emergency map	❌
Cross-report fusion	✅
Duplicate detection	✅
Conflict detection	✅
Need clustering	✅
Evidence relationships	✅
Situation timeline	✅
Human verification of fusion	✅

Kobo already has a data table, reports, gallery and map within its DATA area, and AI-generated analysis can already be reviewed and marked verified. So reproducing those screens would actually make your project less distinctive.

The UI style I'd recommend

Based on the kind of clean UI you were showing me earlier, I would not make this look like a typical "AI dashboard" with:

❌ glassmorphism
❌ glowing gradients
❌ giant colorful cards
❌ excessive charts
❌ 20 sidebar items

Instead:

Clean humanitarian operations interface
WHITE / OFF-WHITE BACKGROUND

Dark text
Thin borders
Small status colors
Compact cards
Clear typography
Lots of whitespace
Very little decoration

Something closer to:

Linear × Notion × emergency operations software

rather than:

"AI startup landing page."

And I would make ONE screen the hero

If you're presenting this to judges, don't spend your visual effort equally across all pages.

Make Cluster Detail spectacular.

The story should visually be:

                 5 REPORTS
                     ↓
             NEXUS FUSION ENGINE
                     ↓
          ┌─────────────────────┐
          │ ONE NEED CLUSTER    │
          │                     │
          │ Drinking Water      │
          │ 40–45 families      │
          └─────────────────────┘
              ↓           ↓
          SUPPORTING    CONFLICT
           EVIDENCE      ⚠️
              ↓           ↓
             └─────┬─────┘
                   ↓
             HUMAN REVIEW
                   ↓
             VERIFIED

That is what the judges should remember.

And it keeps the MVP beautifully narrow: Nexus doesn't collect humanitarian data. It doesn't replace IFRC GO. It doesn't replace Kobo. It takes the information coming from systems like those and answers the difficult question: “Which pieces of information are actually about the same situation, what agrees, what conflicts, and what evidence supports our understanding?” 🧩

For the Nexus UI

Define the cluster card
Map the responder workflow
So can you explain, like each page? What are the information required on each page kind of thing? Like a complete thing about that website?

Yes — and I think we should define it much more systematically now, because you're essentially asking for the complete information architecture + UI specification for Nexus.

I checked the current capabilities again. Kobo already covers collection, multimedia, GPS, maps, reports, exports, and AI-assisted qualitative analysis with human verification. IFRC GO already builds a collective crisis picture from field, partner, and reference information and presents it through reports, maps, graphs, and dashboards.

So the Nexus website should be small and specialized.

RedCross Nexus — Complete MVP Website Structure
The entire website

I would make it 4 screens/pages, with one optional modal:

                    REDCROSS NEXUS
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ↓                  ↓                  ↓
   01 OVERVIEW       02 FUSION QUEUE    03 CLUSTERS
                                              │
                                              ↓
                                      04 CLUSTER DETAIL

                  + IMPORT MODAL

Actually, Cluster Detail can be treated as a drill-down rather than a separate navigation item, so visually the navbar only needs:

Overview | Fusion Queue | Clusters

That's cleaner.

0. GLOBAL UI — present on every page

Before discussing pages, let's define the common shell.

Top navigation
┌──────────────────────────────────────────────────────────────┐
│ 🔴 REDCROSS NEXUS                                            │
│                                                              │
│ Overview    Fusion Queue    Clusters             Import Data │
└──────────────────────────────────────────────────────────────┘
Left side

I actually wouldn't use a large sidebar.

There aren't enough pages to justify one.

Use a simple top navigation.

Top-right
● Flood Response Demo
    Last updated 11:18

And perhaps:

Responder ▾

No complicated user-management system for the MVP.

1. OVERVIEW PAGE
Purpose

The Overview answers:

"What is Nexus currently seeing after fusing the incoming information?"

Not:

"What is happening in the entire disaster?"

That second question is already closer to IFRC GO.

Page structure
A. Header
Situation Overview

Flood Response — Kerala
Nexus operational picture

Last processed: 11:18 AM
B. Four small metrics
┌──────────────┐ ┌──────────────┐
│ 15           │ │ 4            │
│ Observations │ │ Need Clusters│
└──────────────┘ └──────────────┘

┌──────────────┐ ┌──────────────┐
│ 2            │ │ 3            │
│ Need Review  │ │ Conflicts    │
└──────────────┘ └──────────────┘
What each means

Observations

Raw pieces of information received.

Need Clusters

Groups Nexus believes describe the same underlying situation.

Need Review

Clusters where human verification is required.

Conflicts

Cases where evidence disagrees.

C. "What Nexus Found"

This is the main section.

WHAT NEXUS FOUND

┌───────────────────────────────────────────────────┐
│ 🔴 DRINKING WATER SHORTAGE                       │
│                                                   │
│ Government UP School                              │
│ 40–45 families potentially affected              │
│                                                   │
│ 5 observations    3 sources    ⚠ 1 conflict      │
│                                                   │
│ Needs verification                         →     │
└───────────────────────────────────────────────────┘

Then:

┌───────────────────────────────────────────────────┐
│ 🟠 SHELTER DAMAGE                                │
│                                                   │
│ Ward 4                                            │
│ 12 families                                      │
│                                                   │
│ 4 observations    2 sources    ✓ consistent     │
└───────────────────────────────────────────────────┘
D. "Needs attention"

At the bottom/right:

NEEDS ATTENTION

⚠ 2 possible duplicate groups
⚠ 3 conflicting observations
⚠ 2 clusters awaiting verification

Clicking any one takes you to Fusion Queue.

What should NOT be on Overview

❌ giant disaster map
❌ rainfall chart
❌ population charts
❌ resource inventory
❌ volunteer statistics
❌ general emergency statistics
❌ elaborate analytics

Those make it look like you're rebuilding IFRC GO.

2. FUSION QUEUE ⭐

This is the core Nexus page.

Its purpose:

Show the relationships Nexus has discovered between individual observations.

Think of this as an AI review inbox.

Page header
Fusion Queue

Review relationships detected between observations.

12 items
   All   Possible Matches   Duplicates   Conflicts
A. Possible Match

Example:

┌───────────────────────────────────────────────────────────┐
│ 🔗 POSSIBLE SAME SITUATION                    91% MATCH   │
│                                                           │
│ Report #021                    Report #034                │
│                                                           │
│ "No water near the             "40 families waiting      │
│ school."                       for water near the        │
│                                relief centre."            │
│                                                           │
│ 📍 Same area                   📍 Same area                │
│ 🕐 10:32                       🕐 10:41                    │
│                                                           │
│ Semantic match       92%                                  │
│ Location match      87%                                  │
│ Time proximity      94%                                  │
│                                                           │
│              [View] [Merge into Cluster]                  │
└───────────────────────────────────────────────────────────┘

This is where you expose why the AI thinks two observations are related.

That's crucial.

B. Possible duplicate
┌───────────────────────────────────────────────────────────┐
│ 🔁 POSSIBLE DUPLICATE                                     │
│                                                           │
│ Report #018                                               │
│ "12 houses damaged."                                      │
│                                                           │
│ Report #019                                               │
│ "12 homes damaged in Ward 4."                             │
│                                                           │
│ Similarity: 96%                                           │
│                                                           │
│ [Merge]                         [Keep Separate]            │
└───────────────────────────────────────────────────────────┘
C. Conflict

This should look visually different.

┌───────────────────────────────────────────────────────────┐
│ ⚠ CONFLICT DETECTED                                      │
│                                                           │
│ Report #041                                               │
│ "Tanker has not arrived."                                 │
│                                                           │
│                       VS                                  │
│                                                           │
│ Report #045                                               │
│ "Tanker arrived at 11:14."                                │
│                                                           │
│ Same location · Same need · Conflicting status            │
│                                                           │
│ [Investigate]                                             │
└───────────────────────────────────────────────────────────┘
D. Filters

At the top:

All
Possible Match
Possible Duplicate
Conflict
Uncertain

And:

Need type ▾
Location ▾
Time ▾
Confidence ▾

That's enough.

3. CLUSTERS PAGE

The Fusion Queue is about relationships.

Clusters is about the resulting consolidated situations.

Header
Need Clusters

Consolidated situations created from multiple observations.

4 clusters
Cluster table/list

I'd use a list rather than a giant dashboard.

┌──────────────────────────────────────────────────────────────┐
│ STATUS       NEED             LOCATION        EVIDENCE       │
├──────────────────────────────────────────────────────────────┤
│ 🔴 REVIEW    Water            School          5 reports      │
│ 🟠 VERIFIED  Shelter          Ward 4          4 reports      │
│ 🔴 REVIEW    Medical          Relief Centre   3 reports      │
│ 🟡 MONITOR   Road access      Ward 2          3 reports      │
└──────────────────────────────────────────────────────────────┘

Clicking a cluster opens Cluster Detail.

Information shown for each cluster

Every cluster needs:

Identity
Cluster ID
Need type
Location
Situation
Description
affected population estimate
severity
current status
Evidence
number of observations
number of independent sources
photos/media count
AI assessment
confidence
reasons for grouping
Verification
AI-generated
awaiting review
verified
rejected
Conflict
no conflict
conflict detected
unresolved
4. CLUSTER DETAIL ⭐⭐⭐

This is the hero page of Nexus.

This is where your whole idea becomes visible.

A. Header
← Back to Clusters

DRINKING WATER SHORTAGE

Government UP School
Cluster #NEX-007

🔴 HIGH
⚠ NEEDS VERIFICATION
B. Situation summary
SITUATION

Multiple field observations indicate a drinking-water
shortage around Government UP School.

Estimated affected:
40–45 families

First reported:
10:32 AM

Latest update:
11:16 AM

Important: because this is an AI-derived estimate, explicitly label it as such.

For example:

Estimated affected population: 40–45
Based on 3 reports; awaiting verification.

C. Fusion explanation

This is VERY important.

WHY NEXUS GROUPED THESE REPORTS

✓ Same need type
✓ Same geographic area
✓ Reports within 44 minutes
✓ Similar affected population
✓ 3 independent observations

Then:

Fusion confidence

██████████████████░░ 91%

I would actually avoid making confidence look like absolute truth. Label it:

Model confidence: 91%

D. Evidence section
EVIDENCE

5 observations
3 independent sources
1 photograph

Then individual evidence cards:

┌────────────────────────────────────────────┐
│ REPORT #021                                │
│ Field volunteer                            │
│ 10:32 AM                                   │
│                                            │
│ "No drinking water available near school." │
│                                            │
│ ✓ Supports cluster                         │
│ [View original]                            │
└────────────────────────────────────────────┘

Next:

┌────────────────────────────────────────────┐
│ PHOTO #008                                 │
│ 11:16 AM                                   │
│                                            │
│ [ PHOTO ]                                   │
│                                            │
│ AI observation: Empty water containers     │
│                                            │
│ ✓ Supporting evidence                      │
└────────────────────────────────────────────┘
E. Evidence relationship view

This is the coolest visual component.

                 REPORT #021
                     │
                  SUPPORTS
                     ↓
              ┌──────────────┐
              │ WATER         │
              │ SHORTAGE      │
              │ CLUSTER       │
              └──────────────┘
                ↑      ↑     ↑
             SUPPORT  SUPPORT CONFLICT
                │      │       │
             REPORT   PHOTO   REPORT
              #034     #008    #045

You don't need a complex graph library for the first version.

Even a clean horizontal relationship diagram is enough.

F. Timeline
SITUATION TIMELINE

10:32  🔴 Water unavailable
       Report #021

10:41  🔴 40 families affected
       Report #034

10:58  🟠 Tanker delayed
       Report #038

11:14  ⚠ Tanker reportedly arrived
       Report #045

11:16  📷 Supporting photograph
       Photo #008

This is one of your genuinely distinct UI elements.

You're not just storing reports.

You're showing how the evidence changes the understanding of the situation.

G. Conflict panel

If there is a contradiction:

⚠ CONFLICTING INFORMATION

Previous observations:
"No drinking water available."

Latest observation:
"Tanker arrived at 11:14."

Nexus cannot determine whether
the need is resolved.

Status:
UNRESOLVED

[Review Evidence]

Don't let the AI automatically decide the final truth.

H. Human verification

At the bottom:

RESPONDER REVIEW

Nexus assessment:
These observations likely represent
the same underlying water shortage.

[ ✓ CONFIRM CLUSTER ]

[ ✏ EDIT DETAILS ]

[ SPLIT CLUSTER ]

[ ✕ REJECT ]

After clicking Confirm:

✓ VERIFIED BY RESPONDER

Verified by: Responder
Time: 11:23 AM

Cluster is now part of the
verified operational picture.
5. IMPORT DATA — Modal, not page

Because Kobo already handles data collection, we shouldn't build another form system. Kobo supports browser and Android data collection, including offline collection, and supports text, images, audio, video and GPS.

So Nexus simply needs:

+ Import observations

Click:

┌─────────────────────────────────────┐
│ IMPORT OBSERVATIONS                  │
│                                     │
│ Upload existing data                │
│                                     │
│ [ CSV ] [ JSON ]                    │
│                                     │
│ ───────── OR ─────────              │
│                                     │
│ Paste observation                   │
│ [____________________________]      │
│                                     │
│ ───────── OR ─────────              │
│                                     │
│ Load Demo Dataset                   │
│                                     │
│              [Process with Nexus]   │
└─────────────────────────────────────┘

For the hackathon, Load Demo Dataset is extremely useful.

6. What happens after "Process with Nexus"

This should have a visible processing state.

PROCESSING OBSERVATIONS

✓ Extracting needs
✓ Normalizing locations
✓ Finding related observations
✓ Detecting possible duplicates
✓ Checking conflicting evidence
● Building need clusters
○ Preparing review queue

Then:

15 observations → 4 need clusters → 3 items requiring review

That transition is part of your demo.

7. What the complete user journey looks like

This is probably the most important thing to understand before designing.

                    START
                      │
                      ↓
             IMPORT OBSERVATIONS
                      │
                      ↓
               NEXUS PROCESSES
                      │
                      ↓
              SITUATION OVERVIEW
                      │
          ┌───────────┴───────────┐
          ↓                       ↓
     FUSION QUEUE             CLUSTERS
          │                       │
          ↓                       ↓
   Review relationships      View situations
          │                       │
          └───────────┬───────────┘
                      ↓
               CLUSTER DETAIL
                      │
       ┌──────────────┼──────────────┐
       ↓              ↓              ↓
    Evidence       Timeline       Conflicts
       │              │              │
       └──────────────┼──────────────┘
                      ↓
                HUMAN REVIEW
                      │
             ┌────────┴────────┐
             ↓                 ↓
          Verified         Needs more review
8. The information architecture in one table
Screen	Main question	Information shown	Why it exists
Overview	What has Nexus found?	Cluster summary, counts, review/conflict status	Quick operational orientation
Fusion Queue	What relationships need attention?	Possible matches, duplicates, conflicts, confidence	Core AI-fusion workflow
Clusters	What consolidated situations exist?	Need, location, affected population, evidence, status	Browse resulting situations
Cluster Detail	Why do we believe this situation exists?	Evidence, relationships, timeline, conflicts, AI reasoning, verification	Core evidence-fusion experience
Import Modal	How does information enter Nexus?	CSV/JSON/paste/demo data	Connect existing systems without rebuilding collection
9. The navbar should therefore be tiny

I would literally make it:

🔴 REDCROSS
   NEXUS

Overview     Fusion Queue (3)     Clusters (4)          + Import

That's it.

No:

Dashboard
Reports
Maps
Analytics
Forms
Volunteers
Resources
Settings
AI Assistant
etc.

Because every one of those starts pushing you toward rebuilding Kobo/IFRC GO.

10. One important change I'd make to our earlier concept

I would actually remove the standalone map from the MVP.

That may sound strange for a disaster-management application, but I think it's the correct product decision.

Kobo already has GPS maps and IFRC GO already provides maps and dashboards.

Instead, show location as part of evidence fusion:

📍 Government UP School
Same area: 3 reports
Approx. radius: 350 m

Later, if you integrate with IFRC GO/Kobo APIs, you could add a map as a contextual view, but it shouldn't be your MVP's selling point.

11. What the homepage should communicate visually

When a judge opens Nexus, they should understand it in 5 seconds:

          REDCROSS NEXUS

   FROM FRAGMENTED OBSERVATIONS
              ↓
       TO VERIFIED NEEDS

     15 observations
              ↓
        AI FUSION
              ↓
       4 NEED CLUSTERS
              ↓
      HUMAN VERIFICATION

Then immediately below:

┌──────────────────────────────────────────────┐
│ 🔴 DRINKING WATER SHORTAGE                   │
│                                              │
│ 5 observations → 1 consolidated situation   │
│ 40–45 families · 1 conflict detected        │
│                                              │
│ [Review cluster →]                           │
└──────────────────────────────────────────────┘

That is the entire story of the product in one screen.