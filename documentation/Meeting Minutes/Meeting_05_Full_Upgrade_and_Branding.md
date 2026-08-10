# Meeting Minutes — Meeting 5

**Project:** CampusShield AI — Real-Time Crime Hotspot Prediction System  
**Meeting Title:** Phase 5 Review — Full Modern Stack Upgrade & KNUST Branding  
**Date:** Monday, 14th April 2026  
**Time:** 2:00 PM – 4:30 PM  
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

1. Full system demo — upgraded stack
2. KNUST branding review
3. API integration review
4. Responsive design review
5. Documentation progress
6. Phase 6 planning and final preparation

---

## Minutes

### 1. Full System Demo

Sie Kofi Eugene and Sumani Alima Mahami jointly demonstrated the fully upgraded CampusShield AI system running at `http://localhost:5173`.

**Technologies successfully upgraded:**

| Component | Before | After |
|-----------|--------|-------|
| Routing | `useState` page switch | React Router DOM v6 — URL-addressable pages |
| Auth | Local state in App.jsx | `AuthContext` with `localStorage` persistence |
| HTTP requests | None (all hardcoded) | Axios with graceful fallback to demo data |
| Icons | Emoji characters | Lucide React SVG icons |
| Charts | Hand-rolled div bars | Recharts BarChart with tooltips and grid |
| Map | CDN `window.L` hack | npm Leaflet with ESM import and cleanup |
| CSS | Inline `style={{}}` on every element | CSS design system with custom properties |
| Responsive | No media queries | Full mobile breakpoints, collapsible sidebar |
| Loading states | None | Spinner components on all data-fetching pages |
| Error handling | None | try/catch on all API calls with user feedback |

Dr. Kornyo navigated through all pages and noted significant improvement in visual quality, consistency, and professionalism over the previous version. He specifically praised:
- The login page layout with the KNUST green/gold gradient icon
- The stat card design on the dashboard
- The risk gauge on the Prediction page
- The alert feed layout

---

### 2. KNUST Branding Review

Sumani Alima Mahami walked through the applied KNUST brand identity:

- Background palette uses **deep KNUST green tones** (`#060f0a` → `#152a1d`) as the dark theme base, replacing the previous blue/navy theme.
- Primary buttons, active nav items, and interactive elements use **KNUST Forest Green** `#006B3F`.
- The "AI" wordmark in the logo and sidebar uses **KNUST Gold** `#FDB913`.
- Logo icon uses a green-to-gold diagonal gradient matching the coat of arms colour flow.
- Footer text updated to official KNUST copyright: *"© 2026 Kwame Nkrumah University of Science and Technology, Kumasi, Ghana. Developed by University Information Technology Services (UITS), KNUST."*
- Every navbar page title includes the subtitle: *"Kwame Nkrumah University of Science & Technology"*

Dr. Kornyo confirmed the branding was accurate and consistent with official KNUST digital platforms. He noted this level of attention to institutional identity would be positively received during the final presentation.

---

### 3. API Integration Review

Sie Kofi Eugene demonstrated that all pages now make real API calls:

| Page | API Call | Fallback |
|------|----------|---------|
| Dashboard | `GET /api/dashboard/stats/` | Hardcoded default stats |
| Incident History | `GET /api/incidents/` | 5 mock incidents |
| Report Incident | `POST /api/incidents/` | Demo ticket ID generation |
| AI Prediction | `POST /api/prediction/` | Frontend heuristic result |
| Live Alerts | `GET /api/alerts/`, `POST /api/alerts/` | 3 mock alerts |

All API calls wrapped in `try/catch` — the system remains fully functional for demonstration even when the Django backend is offline.

---

### 4. Responsive Design Review

The team demonstrated the application on a simulated 768px mobile screen:

- Sidebar collapses off-screen on mobile widths.
- Hamburger menu button appears in the navbar, toggling the sidebar with an overlay.
- Stat cards stack from 4-column to 2-column at 1100px, and to 1-column at 480px.
- Form grids collapse from 2-column to 1-column on mobile.
- Tables scroll horizontally on small screens.

Dr. Kornyo tested on his mobile phone and confirmed the layout was usable, which he said was a notable improvement over most student mini-project submissions.

---

### 5. Documentation Progress

Sumani Alima Mahami reported on documentation completion:

| Document | Status |
|----------|--------|
| Project Plan | ✅ Complete |
| AI Documentation | ✅ Complete |
| API Documentation | ✅ Complete |
| Database Design | ✅ Complete |
| Deployment Guide | ✅ Complete |
| Testing Documentation | ✅ Complete |
| Meeting Minutes | 🔄 In Progress (this meeting) |
| User Manual | 🔲 To be completed |

---

### 6. Problems Discussed

| Problem | Discussion | Resolution |
|---------|-----------|-----------|
| Bundle size warning during build | Recharts + Leaflet combined produce a 814KB JS bundle, triggering a Vite warning | Acceptable for a mini-project; code splitting can be added in Phase 6 using dynamic imports |
| Authentication still uses mock tokens | No real JWT — any request can access any endpoint without a valid token | Noted as a known limitation; `djangorestframework-simplejwt` planned for Phase 6 |
| `crime_prediction.pkl` in `.gitignore` | Group members pulling from GitHub cannot run predictions without first training locally | Added note to README: run `python train.py` after cloning |
| User Manual folder is empty | No user guide written yet | Agreed to write a concise User Manual before final submission |

---

### 7. Decisions Made

| # | Decision |
|---|---------|
| 1 | Phase 5 upgrade approved as complete — system ready for final presentation |
| 2 | User Manual to be written before final submission |
| 3 | GitHub repository to be made public and shared with group: `github.com/Yesu-Christo/CampusShield-AI` |
| 4 | Final meeting to cover project review, presentation rehearsal, and last fixes |
| 5 | Bundle size warning accepted — no code splitting required for mini-project scope |

---

## Action Items

| Task | Assigned To | Deadline |
|------|------------|---------|
| Write User Manual | Sumani Alima Mahami | 28th April 2026 |
| Push final code to GitHub public repository | Sie Kofi Eugene | 21st April 2026 |
| Complete all Meeting Minutes documents | Sumani Alima Mahami | 28th April 2026 |
| Prepare presentation slides for final demo | Both members | 5th May 2026 |
| Final system test — run full test checklist | Both members | 5th May 2026 |

---

## Next Meeting

**Scheduled Date:** Monday, 12th May 2026  
**Topic:** Final review, presentation rehearsal, and project handover

---

*Minutes recorded by: Sie Kofi Eugene*  
*Approved by: Dr. Oliver Kornyo*

---
*© 2026 Kwame Nkrumah University of Science and Technology, Kumasi, Ghana.*
