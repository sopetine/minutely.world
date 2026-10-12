# Product Marketing Strategy Sync

## Metadata

| Field | Value |
| :--- | :--- |
| **Type** | `Mixed` |
| **Facilitator** | **@Brian** |
| **Attendees** | - **@Cindy** <br> - **@Samia** <br> - **@Cormac** <br> - **@Alita** <br> - **@William** <br> - **@Harsh** <br> - **@Parker** |
| **Context** | Weekly product marketing sync covering event support, product announcement planning, competitive analysis, and messaging framework alignment. |

---

# ❶ Corporate Event Support Coordination

## ⦿ Key Points
1. Corporate event support process has been restructured; the GTM team now sponsors events and PMMs handle campaign execution.
2. Current status shows three events aligned: `reInvent` (Platform), `Google Next` (CI/CD), and `KubeCon` (GitOps).
3. Slack outreach to GTM teams yielded limited real-time responses—one person has responded so far.
4. GTM syncs have moved to a two-week cadence after the GitOps enablement session was canceled.
5. Corporate Events team needs commitments from campaign managers to track and fulfill event support requirements.

## ☑ Actions
1. 🟠 **@GTM Teams** — Comment on the relevant issue confirming commitment to support assigned event (reInvent, Google Next, or KubeCon).

---

# ❷ Product Announcements for Commit

## ⦿ Key Points
1. The goal is to identify announcements for the product keynote at Commit, where press attention is expected due to the event.
2. GitLab's transparent roadmap makes traditional product announcements challenging; the strategy is to highlight features that have matured over the past year (e.g., exiting beta, reaching full capability).
3. **@Cindy** suggested grouping related MVCs into coherent narratives (e.g., vulnerability management improvements bundled together rather than highlighting individual features).
4. Reusing and extending content from the 14.0 launch is encouraged.
5. A proposed framework uses three items per stage, organized into buckets with descriptive names (e.g., `UX improvements`, `GitOps capabilities`).
6. Excitement levels (1–3) should function as a stack rank rather than a raw metric; each stage should have one `1`, `2`, and `3`.
7. MAU data and customer demand (upvotes, feature requests) can supplement judgment when assigning excitement levels.
8. **Top five overall candidates** discussed include:
   - **Vulnerability Management** (proprietary scanning maturity)
   - **Browserker** (proprietary DAST scanner for single-page applications)
   - **Kubernetes Agent + Terraform integrations** (GitOps bucket)
   - **UX improvements** (cross-stage bucket)
   - **Plan stage** features (e.g., Epic boards, milestone burnup charts)
9. VS Code integrations and Terraform modules were noted as community-contribution success stories worth highlighting.
10. The fuzzing acquisition was considered already covered by prior press; vulnerability management is preferred over repeating that narrative.
11. An Assembly-style retrospective was referenced as a positive model for celebrating company wins.

## ☑ Actions
1. 🔴 **@Cormac** · `Tuesday` — Add top five Plan stage features to the announcement list.
1. 🔴 **@All** · `Tuesday` — Complete the top five overall stack rank across all stages.
1. 🟠 **@Samia** — Add VS Code integration details (community contributions) to the announcement list.

---

# ❸ Competitive Analysis Spreadsheet

## ⦿ Key Points
1. The competitive sheet tabs for Configure and Monitor need stage-specific competitor analysis rather than identical competitor lists.
2. Focus is strictly on **tier one competitors** for now: `ADO`, `Atlassian`, `GitHub`, `Jenkins`, `JFrog`, `CloudBees`.
3. If a tier one competitor does not apply to a particular stage, that row should be skipped for that tab.
4. A **GitLab row** must be added to the spreadsheet to provide honest market context—without it, the comparison appears biased.
5. For platform vendors that bill themselves as comprehensive platforms (`GitHub`, `Azure DevOps`, `JFrog`), if they have zero capabilities in a stage, this should be explicitly called out (e.g., monitoring = 0).
6. Descriptions should use **value-based language** rather than raw feature names to communicate meaning to non-technical audiences.
7. The underlying data model separates presentation from data, allowing stage names to be updated without restructuring the content in future iterations.
8. A design team infographic was shared as a reference for color scheme: the decision was to use **green scale only** (no red) to frame the comparison as "less good" rather than "terrible," supporting a cooperative competitive positioning.

## ☑ Actions
1. 🔴 **@Samia** · `End of day` — Add GitLab line item to the competitive analysis spreadsheet.
1. 🟠 **@Samia** — Apply tier one competitor filtering per stage tab (skip rows where competitor is not applicable).
1. 🟠 **@Team** — Add value-based stage descriptions for Verify, Manage, and other non-obvious stage names.
1. 🟠 **@Alita** — Share the design team infographic link in the shared notes.

---

# ❹ Messaging Framework

## ⦿ Key Points
1. The assignment was to write pithy, punchy statements for three platform-level value propositions.
2. **@Brian** proposed the following initial options:
   - *"Single source of truth, countless possibilities"*
   - *"End-to-end control over your software factory"*
   - *"Move fast with confidence"*
3. Parity in tone is important: all three statements should follow the same grammatical structure (e.g., all noun phrases or all action-oriented).
4. **@Cindy**'s previous phrasing "secure the software factory and its deliverables" was well-received and could be incorporated.
5. Discussion concluded that **"More speed, less risk"** is the strongest option, combining urgency with safety.
6. "No trade-offs" was considered but flagged as overpromising—engineers prefer "less risk" over "no risk" and "mitigate" over absolute guarantees.
7. Combining confidence into the statement (e.g., "more speed, less risk, high confidence") was discussed but noted that "confidence" is overused by competitors.
8. The "More speed, less risk" formulation provides the desired parity and simplicity.

## ☑ Actions
1. 🟠 **@Brian** — Finalize messaging with "More speed, less risk" as the preferred tagline.

---

# Outcomes Summary

| Topic | Outcome | Status |
| :--- | :--- | :--- |
| ❶ Corporate Event Support | Confirmed event assignments (reInvent/Platform, Google Next/CI/CD, KubeCon/GitOps); GTM team commitments needed via issue comments | `Open` |
| ❷ Product Announcements | Top five picks identified (VM, Browserker, K8s Agent, UX, Plan); aggregation and stack ranking to be completed by Tuesday | `In Progress` |
| ❸ Competitive Analysis | GitLab row to be added; tier one filtering per stage; green-only color scheme approved | `In Progress` |
| ❹ Messaging Framework | "More speed, less risk" selected as the primary tagline with parity alignment across all three statements | `Resolved` |

---

# Cross-Topic Analysis

## Decisions Made
1. Event assignments are reInvent (Platform), Google Next (CI/CD), KubeCon (GitOps).
2. Product announcements will bundle related MVCs into meaningful buckets rather than listing individual features.
3. Excitement levels function as a stack rank (one 1, 2, and 3 per stage).
4. Competitive analysis uses only tier one competitors per stage.
5. Green-only color scheme for comparison visuals to avoid negative framing.
6. **"More speed, less risk"** is the approved platform tagline.

## Blockers & Dependencies
1. GTM campaign manager commitments are pending—blocking event support fulfillment.
2. Top five overall announcement selections require additional aggregation work.

## Open Questions
1. Should "Epic boards" and milestone burnup charts be grouped under a Plan stage bucket?
2. How to handle Atlassian's positioning as both competitor and partner?
3. Will tier two and tier three competitor analysis be required in a later iteration?

## Next Steps
1. GTM teams to confirm event commitments via issue comments.
2. Complete top five announcement picks across all stages by Tuesday.
3. Add GitLab row and apply tier one filtering to the competitive spreadsheet.
4. Share design infographic via Slack or notes.
5. Finalize messaging tagline with "More speed, less risk."

---