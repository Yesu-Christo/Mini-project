# Meeting Minutes — Meeting 4

**Project:** CampusShield AI — Real-Time Crime Hotspot Prediction System  
**Meeting Title:** Phase 3 & 4 Review — Prediction Engine, GIS Heatmap & All Pages Complete  
**Date:** Monday, 17th March 2026  
**Time:** 2:00 PM – 4:15 PM  
**Venue:** Department of Computer Science, KNUST — Study Room B  
**Course:** CSM 374 — Mini Project  

---

## Attendees

| Name | Role | Present |
|------|------|---------|
| Sie Kofi Eugene | Team Member / Project Lead | ✅ Yes |
| Sumani Alima Mahami | Team Member | ✅ Yes |
| Dr. Oliver Kornyo | Project Supervisor | ✅ Yes |

---

## Agenda

1. Demo of AI Prediction page
2. Demo of GIS Campus Crime Heatmap
3. Review of all completed frontend pages
4. Backend API completeness review
5. Problems and blockers
6. Phase 5 planning — full upgrade and KNUST branding

---

## Minutes

### 1. AI Prediction Page Demo

Sumani Alima Mahami demonstrated the Prediction page:

- Form allows user to select a KNUST campus location, hour of day, day of week, and month.
- On submission, the form sends a POST request to `/api/prediction/` with the input parameters.
- The response is displayed as a circular risk gauge showing the probability percentage, risk level (High / Medium / Low), and a list of security recommendations tailored to the risk level.
- Night-time hours (19:00–05:00) consistently return High risk for the known danger zones, matching expected model behaviour.

Dr. Kornyo tested the prediction with Ayeduase Gate at 22:00 on a Saturday and received a **High Risk (88%)** result. He was satisfied with the output and suggested the recommendations be specific enough to guide real security action — e.g. "Deploy 2 patrol units" rather than generic advice. The team noted this was already implemented.

---

### 2. GIS Campus Crime Heatmap Demo

Sumani Alima Mahami demonstrated the HeatMap page:

- Interactive Leaflet map centred on KNUST campus (6.6738, -1.5684).
- Nine campus locations plotted with colour-coded circle overlays:
  - **Red (High Risk):** Unity Hall, University Hall (Katanga), Brunei Hostels, Ayeduase Gate
  - **Amber (Medium Risk):** Africa Hall, Commercial Area Parking
  - **Green (Low Risk):** Main Library, College of Science, Faculty of Law
- Clicking any circle opens a popup with location name and risk level.
- Below the map: Danger Zones panel (red border) and Safe Zones panel (green border) with descriptions.

Dr. Kornyo noted that the map looked professional and asked whether the circle sizes could reflect incident density. The team confirmed that High Risk zones already use a larger radius (200m) vs Medium (140m) and Low (90m).

**Issue raised:** Dr. Kornyo observed that the map should be loaded using the npm Leaflet package rather than a CDN script tag, for reliability and maintainability. The team agreed to address this in the Phase 5 upgrade.

---

### 3. All Frontend Pages Review

Sumani Alima Mahami demonstrated all 9 completed frontend pages:

| Page | Status | Notes |
|------|--------|-------|
| Login | ✅ Complete | Local auth, demo credentials shown |
| Dashboard | ✅ Complete | Stats cards, bar chart, map, risk table |
| Report Incident | ✅ Complete | Form with category, severity, location, description |
| Incident History | ✅ Complete | Table with status filter tabs |
| AI Predictions | ✅ Complete | Parameter form + risk gauge + recommendations |
| Crime Heatmap | ✅ Complete | Full-screen map + zone panels |
| Live Alerts | ✅ Complete | Alert feed + broadcast form |
| User Management | ✅ Complete | Table with hardcoded users |
| Profile | ✅ Complete | Edit mode for profile fields |
| Settings | ✅ Complete | Toggle switches for notifications |

---

### 4. Backend API Completeness Review

Sie Kofi Eugene confirmed all 5 API modules were functional:

| Endpoint | Method | Status |
|----------|--------|--------|
| `/api/accounts/login/` | POST | ✅ Working |
| `/api/accounts/register/` | POST | ✅ Working |
| `/api/incidents/` | GET, POST | ✅ Working |
| `/api/prediction/` | POST | ✅ Working |
| `/api/alerts/` | GET, POST | ✅ Working |
| `/api/dashboard/stats/` | GET | ✅ Working |

---

### 5. Problems Discussed

| Problem | Discussion | Resolution |
|---------|-----------|-----------|
| Frontend pages not connected to real API | All data still hardcoded | To be addressed in Phase 5 full upgrade |
| No React Router — page navigation breaks browser history | Team demonstrated the issue: clicking back button didn't return to previous page | React Router DOM to be added in Phase 5 |
| No authentication context — user data only available in App.jsx | Child pages like Profile could not access logged-in user data | React Context API (AuthContext) to be added in Phase 5 |
| Emoji icons throughout UI look unprofessional | Supervisor noted emojis are not appropriate for an institutional security platform | Replace with Lucide React SVG icon library in Phase 5 |
| Bar chart built from div heights — not a real chart library | Inconsistent rendering across screen sizes | Replace with Recharts in Phase 5 |
| Inline styles on every JSX element — hard to maintain | Any design change requires editing 100+ style props | Migrate to CSS design system with custom properties in Phase 5 |

---

### 6. Research — KNUST Branding

Sumani Alima Mahami presented research on KNUST's official visual identity:

- Scanned live KNUST portals: `studentportal.knust.edu.gh`, `apps.knust.edu.gh`, `pay.knust.edu.gh`, `admissions.knust.edu.gh`
- **Primary brand colour identified:** Forest Green `#006B3F` — used consistently across all official KNUST platforms for headers, buttons, and navigation.
- **Gold accent colour identified:** KNUST Gold `#FDB913` — derived from the KNUST coat of arms, used for highlights and branding accents.
- **Official copyright text:** *"© 2026 Kwame Nkrumah University of Science and Technology, Kumasi, Ghana. Developed by University Information Technology Services (UITS), KNUST."*

The team agreed to apply the full KNUST brand palette in the Phase 5 upgrade, replacing the current blue/navy theme.

---

### 7. Decisions Made

| # | Decision |
|---|---------|
| 1 | All frontend pages approved as functionally complete for Phase 3 & 4 |
| 2 | Phase 5 will be a comprehensive upgrade: React Router, AuthContext, Axios API wiring, KNUST branding, Recharts, npm Leaflet, Lucide icons, responsive CSS |
| 3 | KNUST brand colours confirmed: Primary Green `#006B3F`, Gold `#FDB913` |
| 4 | Emoji icons to be replaced with Lucide React icons throughout the system |
| 5 | All pages must make real API calls with fallback to demo data when backend is offline |

---

## Action Items

| Task | Assigned To | Deadline |
|------|------------|---------|
| Install React Router DOM, Axios, Lucide React, Recharts, Leaflet (npm) | Sie Kofi Eugene | 31st March 2026 |
| Rebuild CSS design system with KNUST brand colours and responsive layout | Sumani Alima Mahami | 31st March 2026 |
| Add AuthContext for persistent login state across all pages | Sie Kofi Eugene | 31st March 2026 |
| Wire all pages to real API with Axios + graceful fallback | Both members | 7th April 2026 |
| Replace emoji icons with Lucide React throughout | Sumani Alima Mahami | 31st March 2026 |
| Migrate Leaflet from CDN to npm import | Sie Kofi Eugene | 31st March 2026 |

---

## Next Meeting

**Scheduled Date:** Monday, 14th April 2026  
**Topic:** Phase 5 upgrade review — full modern stack demo with KNUST branding

---

*Minutes recorded by: Sumani Alima Mahami*  
*Approved by: Dr. Oliver Kornyo*

---
*© 2026 Kwame Nkrumah University of Science and Technology, Kumasi, Ghana.*
