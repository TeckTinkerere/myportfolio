# Résumé audit and redesign — October 2026

Scope: `/resume` on mohdaslam.dev. Evidence reviewed: the résumé page and its content, all project entries, `/about`, the event and recognition data, public GitHub repositories (ROUTR, Nudgio, DoorSense and the rest of the repo list), and, as a private evidence layer only, the internship task log. Nothing from the task log is quoted or reproduced. Internship statements are abstracted to the engineering level (see **Confidentiality review**).

---

## 0. Internal audit (before editing)

**Strongest signals (existing, but buried or missing from the page)**
- **ROUTR** (public, MIT): 28 skills, a validator in CI, an eval set of 153 prompts, published routing-accuracy method. This is the clearest "can build and measure developer tooling" evidence, and it wasn't on the résumé at all.
- **Nudgio** (public): React Native + Kotlin native core, 21 ADRs, a 23-document spec with requirements traceability. This is unusual engineering discipline for a student, and it was also absent.
- **OCBC internship**: Playwright migration, a shared logging module, an automation-health dashboard, scheduling fault diagnosis, moving code into source control. It wasn't on the résumé either; the only enterprise entry was a *pending* placeholder case study.
- **StartupLink / LocalLoco** case studies already carried good engineering reasoning (rules-based authorisation, PostGIS), but the résumé showed them only as image tiles with one-liners.
- **DoorLens** (Nebula X 2026): frozen, hashed models and an honest limitations document. This is a research-flavoured signal.

**Weakest signals on the old page**
- Descriptor "Technology Builder & Community Operator" and the opener "I take unclear problems…" read as generalist/community, not engineer.
- Hero stats: "13 Events worked", "Competition placings", "Published projects: 17". These are counts, not evidence; "Events worked" pulls toward the emcee identity.
- A career-track visual with event diamonds ("filled ones I hosted"). This is decoration, and it advertises hosting.
- Experience listed Adecco election work and freelance video editing as peers of engineering roles, and it had no bullets at all.
- "Capabilities" was a flat keyword list mixing tech with "Event facilitation" and "Volunteer coordination".
- Large portrait plus an "Open to projects" badge (ambiguous: freelance or employment?).

**Missing information** — see section 10.

**Credibility issues**
- "Building since 2024" stat is derived; harmless but meaningless.
- "17 published projects" includes coursework and archived HTML/CSS sites. Equal weight dilutes the strong ones.
- Nothing was inflated, but nothing was quantified either.

**Duplicated**: The about page and the résumé shared the same capability and committee blocks and told the same story twice.

**Distracting**: The career track, events count, the large photo, and the video editing and election roles.

**Skills deserving more prominence**: Python, Playwright, structured logging/observability, Kotlin/React Native, FastAPI, PostGIS, CI (GitHub Actions), pytest/Jest, agent/eval design.

**Projects deserving less prominence**: KreatorsNest, Cydists, Devmegle/DevOmegle, Future-tainment, Recenter, LivNow, EventureSG, TrustLens, and coursework (mini library, online shopping, secure-coding analysis).

**Belongs on emcee.mohdaslam.dev**: Every host/emcee event, the "Hosted" counts, and stage/audience material.

**Should be quantified**: Internship (number of automations migrated, scripts on the shared logger, run-time or failure-rate change, rows), StartupLink/LocalLoco (users, listings, redemptions), ROUTR (installs, stars), Nudgio (test count).

---

## 1. Recruiter assessment (old page)

| Dimension | Score | Why |
|---|---|---|
| Technical credibility | 4/10 | Real projects existed, but the page showed tiles, not engineering. |
| Software engineering signal | 3/10 | No bullets, no internship, no repos. |
| Project depth | 4/10 | Depth lived on case-study pages one click away; the page showed one-liners. |
| Impact | 2/10 | No metrics, no outcomes on the page. |
| Communication | 5/10 | Plenty of facilitation, but framed as events, not engineering communication. |
| Scanability | 6/10 | Clean layout, but the wrong things were scannable (event counts). |
| Visual professionalism | 7/10 | Restrained, consistent design system. |
| Big-tech readiness | 3/10 | A recruiter would read "community operator" and move on. |

## 2. Positioning

- **Primary identity**: Software engineering student who builds automation, developer tooling and full-stack products, with an enterprise automation internship.
- **Secondary strengths**: Reliability and observability thinking; written engineering discipline (ADRs, specs, limitations docs); teaching and facilitating technical work.
- **Best-fit roles now**: Software engineering intern, automation/tooling intern, internal-tools or platform intern, full-stack intern at startups, GovTech/bank technology internships.
- **Reachable with more evidence**: AI engineering (needs a shipped LLM feature with evals in production), infrastructure/SRE (needs Linux, cloud, containers in a deployed system), research engineering (needs a data/ML project with a reproducible evaluation beyond a hackathon).

## 3. Content architecture (implemented)

1. Hero: name, one-line technical identity, two-sentence summary, location and email, CTAs (View projects, View experience, GitHub, PDF).
2. Experience: the internship first with six impact bullets; founder roles; non-engineering work collapsed to one line each.
3. Selected engineering projects: five structured entries (Role, Problem, Built, Key decision, Outcome, Stack, links).
4. Technical skills: a table by area × depth (strong / used in projects / exposure).
5. Education beside competition placings.
6. Teaching, documentation and facilitation beside committees, plus a one-line emcee link.
7. Contact.

The career track, hero stats, portrait and image-tile project cards were removed from `/resume`. The career track still exists on `/about`.

## 4–5. Rewritten copy and experience bullets

All copy is in `apps/site/content/data/profile.json` (editable in Keystatic → Profile & résumé). The internship bullets as published:

1. Migrated legacy coordinate- and image-based UI automations to Playwright browser automation, and standardised the Playwright setup across the team's automation machines, removing a recurring source of breakage whenever an interface changed.
2. Designed and built a shared Python logging module (consistent format, levels and per-job log files) and am rolling it out across the team's automation scripts in place of ad-hoc console output.
3. Designed and built an automation-health dashboard that discovers job logs, classifies each run as succeeded, failed or stalled from its most recent output, and summarises failures, so problems surface without anyone reading raw logs.
4. Maintain Python/pandas automations over large Excel datasets (100K+ rows), adding input validation so malformed or incomplete inputs fail loudly instead of producing wrong reports.
5. Diagnosed scheduling faults in production automations (unintended repeat runs, jobs that silently stopped running) and restored reliable scheduled execution.
6. Moved the team's automation code into source control, inventoried and risk-classified existing scripts to prioritise hardening work, and ran a knowledge-sharing session on the new workflow.

## 6. Project prioritisation

- **Tier 1 (featured on /resume)**: ROUTR (open source, CI, measured), Nudgio (native + RN, ADRs, reliability constraints), StartupLink (auth and authorisation design), LocalLoco (service split, PostGIS, moderation pipeline), DoorLens (data/ML, honest evaluation).
- **Tier 2 (on /work, not the résumé)**: ConnectSphere, LocalLoco Business, LivNow, Recenter, Future-tainment, EcoRamadan.
- **Tier 3 (archive only)**: KreatorsNest, Cydists, Devmegle/DevOmegle, EventureSG, TrustLens, and coursework (mini library, online shopping, secure-coding analysis). These are early or course work; they lower the average.
- **Action**: ROUTR, Nudgio and DoorLens are not yet entries on `/work`. Add them so the résumé links to case studies, not only GitHub.

## 7. Skills audit

- **Added (evidenced)**: Playwright, structured logging, Windows Task Scheduler, Kotlin, React Native, Room, pytest, GitHub Actions, Docker, eval design.
- **Held back for confidentiality**: Power BI, Power Automate, Copilot Studio, Dataverse and Ollama are evidenced only by internship work. Listing them would hint at internal tooling, so add them back only after the confidentiality review.
- **Removed from the résumé skills list**: "Event facilitation", "Volunteer coordination", "Product scoping", "Written and spoken communication" (shown through evidence instead), "OWASP Top 10" (coursework only; claim it again once a project shows it), Netlify (archived site only).
- **Demonstrate through projects rather than list**: security rules/authorisation (StartupLink), geospatial queries (LocalLoco), observability (internship), CI validation (ROUTR).
- **Gaps**: Linux, a cloud provider beyond Vercel/Firebase (AWS/GCP/Azure), containers in a deployed service, automated test coverage numbers, data structures and algorithms practice (for big-tech interviews; not shown on a résumé, but expected).

## 8. Communication signal

This is shown as engineering evidence, not adjectives: a knowledge-sharing session and README documentation (internship); workshop facilitation and TA work debugging participants' builds; teaching a workshop; ADRs and specs; the AI for Good placing. The only hosting reference is one line linking to emcee.mohdaslam.dev.

## 9. Remove / relocate

- **Deleted from /resume**: hero stats, career track, portrait, "Open to projects" badge, image tiles, the "Proof, not adjectives" heading, and the old capabilities list.
- **Shortened**: Adecco and freelance video work collapsed to one line each under "Other work".
- **Moved**: Course certificates stay on /about. Competition placings became compact text.
- **Transfer to the emcee site**: all host/emcee events and hosting counts. `/events` on the main site still shows them; consider keeping only facilitation and workshop events there.
- **Recommended, not done (it affects every page)**: change `siteConfig.descriptor` from "Technology Builder & Community Operator" to something like "Software & Automation Engineering · Singapore". It appears in the header, footer and metadata site-wide.

## 10. Missing evidence checklist (please supply; nothing was invented)

- Internship: your exact job title; start month and expected end; the number of automations migrated to Playwright (the log suggests several; confirm a safe number like "5+"); the number of scripts on the shared logger; any before/after failure or manual-effort figure; confirmation that "100K+ rows" is safe to publish; and whether "via e2 Power" is the right way to describe the arrangement.
- StartupLink / LocalLoco: users, listings, founders verified, redemptions, uptime; team size for LocalLoco.
- ROUTR: GitHub stars, `npx skills add` install count if visible, number of external contributors.
- Nudgio: test count and coverage; what has been build-verified on a device.
- DoorLens: team size and your share; result or placement, if any.
- GitHub: pin ROUTR, Nudgio, DoorSense and one web project; add READMEs to repos with empty descriptions.
- A PDF résumé in `public/resume/`, then set it in Keystatic so "Download PDF" appears.

## 11. Implementation summary

- `app/resume/page.tsx` was rewritten: semantic sections with anchors, a description list per project, a real `<table>` for skills (collapses to stacked rows on mobile), external links marked for screen readers, print styles kept, and page-specific title, description and Open Graph metadata.
- `content/profile.ts` and `keystatic.config.ts` gained `headline`, `summary`, `experience[].highlights`, `experienceNote`, `otherExperience`, `featuredProjects`, `technicalSkills` and `communication`, so you can edit all of it without code.
- Verified: typecheck, lint and 70 tests; rendered at 375 px, 800 px and 1280 px with no horizontal overflow and no console errors.

## 12. Simulated reviews

**Google SWE recruiter** — shortlist probability ~25–35% for a SWE internship (polytechnic students compete against university applicants; strong projects help).
- Strongest signal: an enterprise internship plus an open-source tool with CI and an eval set.
- Biggest concern: no numbers anywhere in the internship; there's no way to size impact.
- Highest-value improvement: two or three confirmed safe metrics in the internship bullets.

**Microsoft engineering hiring manager** — ~40–50% for a phone screen.
- Strongest signal: improving existing systems (Playwright migration, shared logging, health dashboard, source control). That's what new hires actually do.
- Biggest concern: little evidence of code review or working in a shared codebase with other engineers; most projects are solo.
- Highest-value improvement: show a collaborative contribution, such as a PR to someone else's open-source project or LocalLoco team size and review practice.

**NASA/JPL technical reviewer** — ~15–20% for a research or engineering intern track.
- Strongest signal: DoorLens's frozen, hashed models and written limitations; Nudgio's ADRs and requirements traceability.
- Biggest concern: no physics, embedded or scientific computing work; the data/ML evidence is one hackathon.
- Highest-value improvement: one reproducible data or analysis project with a written method, dataset provenance and error analysis.

**Final pass applied**: Added a one-line "evidence strip" under the hero summary (internship, open source, live products, all linked or verifiable) so the 30-second scan lands on proof before reading bullets. The metric gaps above remain open; they need your numbers.

---

## Confidentiality review

Each internship statement was written from the abstraction "internal fact → engineering problem → approach → public statement". None names an internal system, path, team, person, schedule or business process. These items still need **your manual review before you rely on them publicly**:

1. **"100K+ rows"** [REQUIRES CONFIDENTIALITY REVIEW]. This comes from your brief, not the task log. Confirm it's an acceptable generic figure; otherwise change the bullet to "large Excel datasets".
2. **Automation-health dashboard bullet** [REQUIRES CONFIDENTIALITY REVIEW]. It describes the *class* of design (log discovery, succeeded/failed/stalled classification). It omits where logs live, how hosts are networked, and any alerting. Confirm your manager is comfortable with an internal monitoring tool being described at all.
3. **Scheduling-fault bullet** [REQUIRES CONFIDENTIALITY REVIEW]. This is a production incident described generically. Some organisations treat any incident reference as sensitive; remove it if unsure.
4. **"Risk-classified existing scripts"** [REQUIRES CONFIDENTIALITY REVIEW]. This implies an internal risk assessment exists. It's low risk as worded, but confirm.
5. **Employer naming "OCBC (via e2 Power)" and the title "Automation & Tooling Intern"** [REQUIRES CONFIDENTIALITY REVIEW]. Confirm the exact title and that naming both organisations is permitted.
6. **"Restricted corporate environment"** in the role summary. It is generic, but it hints at network controls. Delete it if preferred.

Deliberately **not** published: names of internal tools and automations, the dashboard/reporting platforms used internally, the local-LLM and AI-assistant experiments (they could imply data-handling or DLP controls), the Copilot/Power Platform work, alert and ticketing specifics, and all dates finer than month.
