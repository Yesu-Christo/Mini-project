# Meeting Minutes — Meeting 6

**Project:** CampusShield AI — Real-Time Crime Hotspot Prediction System  
**Meeting Title:** Final Review, Presentation Rehearsal & Project Handover  
**Date:** Monday, 12th May 2026  
**Time:** 2:00 PM – 4:00 PM  
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

1. Final system walkthrough and acceptance
2. Documentation completeness review
3. Presentation rehearsal feedback
4. Reflection on objectives vs achievements
5. Known limitations and future work
6. Project handover and closing remarks

---

## Minutes

### 1. Final System Walkthrough

The team conducted a complete final walkthrough of CampusShield AI for Dr. Oliver Kornyo. The following was demonstrated live:

**Login & Authentication**
- Login page with KNUST green/gold branding, eye-toggle password field, and quick-access demo buttons.
- Session persistence confirmed — refreshing the browser retains the logged-in state.
- Logout clears session and redirects to login.

**Dashboard**
- Four stat cards showing total incidents, today's incidents, high-risk zones, and model accuracy.
- Recharts bar chart showing weekly incident distribution with hover tooltips.
- Leaflet map with 9 KNUST locations and colour-coded risk overlays.
- Top Predicted High-Risk Zones table with badge indicators.

**Report Incident**
- Full form with category, severity, location, description, and image upload.
- Submission generates a ticket ID and shows a success confirmation.

**Incident History**
- Tabulated incident log with status filter buttons (All / Pending / Under Investigation / Resolved).
- Refresh button to reload from API.

**AI Prediction Engine**
- Prediction form with location, hour, day, and month parameters.
- Risk gauge showing probability percentage with colour coding.
- Security recommendations dynamically generated based on risk level.

**GIS Crime Heatmap**
- Full-screen Leaflet map with all campus overlays.
- Danger Zones and Safe Zones panels with detailed descriptions.

**Live Alerts**
- Alert feed with type icons and location details.
- Broadcast form allowing security administrators to send new alerts.

**User Management, Profile, Settings**
- User table with search functionality.
- Editable profile with save confirmation.
- Toggle switches for notification preferences.

Dr. Kornyo reviewed each page thoroughly. His overall assessment was that the system was well-built, visually professional, and demonstrated a clear understanding of full-stack development and machine learning integration.

---

### 2. Documentation Completeness Review

| Document | Status | Reviewer Comment |
|----------|--------|-----------------|
| Project Plan | ✅ Complete | Clear problem statement, objectives, and module breakdown |
| AI Documentation | ✅ Complete | Pipeline well explained; threshold justification noted |
| API Documentation | ✅ Complete | All endpoints documented with examples |
| Database Design | ✅ Complete | ERD and table schemas clearly presented |
| Deployment Guide | ✅ Complete | Local and production setup covered |
| Testing Documentation | ✅ Complete | Manual test checklist is thorough |
| Meeting Minutes (6 meetings) | ✅ Complete | Good record of project evolution |

Dr. Kornyo noted that the documentation quality was above average for a mini-project submission and commended both members for the effort put into it.

---

### 3. Presentation Rehearsal Feedback

The team rehearsed the 15-minute project presentation. Dr. Kornyo provided the following feedback:

| Feedback Point | Member | Action |
|---------------|--------|--------|
| Open with the problem statement — explain why this matters to KNUST students | Both | Updated slide 1 |
| Clearly distinguish what the AI model does vs what the API does | Sie Kofi Eugene | Added architecture diagram to slides |
| Demo the prediction page last — it is the most impressive feature | Sumani Alima Mahami | Reordered demo flow |
| Mention the model accuracy (92.4%) early — it establishes credibility | Both | Added to introduction slide |
| Explain the KNUST-specific dataset — assessors will appreciate the local context | Sumani Alima Mahami | Added to ML section |

---

### 4. Reflection on Objectives vs Achievements

| Objective | Achievement | Status |
|-----------|------------|--------|
| Train ML model to predict campus crime hotspots | Random Forest trained at 92.4% accuracy | ✅ Achieved |
| Build REST API backend for all modules | All 6 endpoints functional | ✅ Achieved |
| Build responsive React frontend dashboard | 10 pages with mobile support | ✅ Achieved |
| Integrate interactive GIS map | Leaflet map with 9 KNUST locations | ✅ Achieved |
| Implement role-based access control | STUDENT / SECURITY / ADMIN roles | ✅ Achieved |
| Apply KNUST official branding | Green `#006B3F` + Gold `#FDB913` throughout | ✅ Achieved |
| Comprehensive documentation | All 7 documents complete | ✅ Achieved |
| Deploy to public hosting | Deferred to Phase 6 | 🔲 Planned |
| Real JWT authentication | Deferred to Phase 6 | 🔲 Planned |

---

### 5. Known Limitations & Future Work

The team presented the following known limitations to Dr. Kornyo for inclusion in the project documentation and presentation:

| Limitation | Future Work (Phase 6) |
|-----------|----------------------|
| Mock JWT tokens — no real authentication | Integrate `djangorestframework-simplejwt` |
| Synthetic training data — 350 records | Retrain with live KNUST incident data |
| Weather and holiday features unused | Incorporate into ML feature set |
| No prediction persistence to database | Add `Prediction` model and storage |
| SQLite in development only | Migrate to PostgreSQL for production |
| No SMS notifications | Integrate Twilio or Hubtel SMS API |
| No pagination on incident list | Add limit/offset API pagination |

Dr. Kornyo confirmed these limitations are acceptable for a mini-project scope and that acknowledging them demonstrates research maturity and critical thinking.

---

### 6. Final Decisions & Closing Remarks

| # | Decision |
|---|---------|
| 1 | Project declared **complete** for CSM 374 mini-project submission |
| 2 | GitHub repository confirmed public at: `https://github.com/Yesu-Christo/CampusShield-AI` |
| 3 | Both members to submit individual reflection reports as required by course |
| 4 | Project to be presented during the scheduled CSM 374 presentation session |

**Dr. Oliver Kornyo's Closing Remarks:**

Dr. Kornyo congratulated Sie Kofi Eugene and Sumani Alima Mahami on completing a well-structured and professionally built mini-project. He noted that the combination of a working ML pipeline, a REST API backend, a modern React frontend, and thorough documentation represented strong software engineering practice. He encouraged the team to continue developing the system beyond the course, particularly the deployment and real data integration phases.

**Sie Kofi Eugene** thanked Dr. Kornyo for his guidance throughout the project, noting that the supervisor meetings were instrumental in keeping the team on track and making key design decisions.

**Sumani Alima Mahami** echoed the appreciation and highlighted that the research phase — particularly the KNUST branding research and ML algorithm comparison — significantly strengthened the final system.

---

## Final Project Summary

| Item | Detail |
|------|--------|
| Project Name | CampusShield AI |
| Platform | KNUST Real-Time Crime Hotspot Prediction System |
| Tech Stack | React 18, Django 4.2, scikit-learn, Leaflet, Recharts |
| ML Model | Random Forest Classifier — 92.4% accuracy |
| Dataset | 350 synthetic KNUST campus incident records |
| Pages | 10 frontend pages |
| API Endpoints | 6 REST endpoints |
| Team | Sie Kofi Eugene, Sumani Alima Mahami |
| Supervisor | Dr. Oliver Kornyo |
| Repository | github.com/Yesu-Christo/CampusShield-AI |
| Course | CSM 374 — Mini Project, KNUST 2025/2026 |

---

*Minutes recorded by: Sumani Alima Mahami*  
*Approved by: Dr. Oliver Kornyo*

---
*© 2026 Kwame Nkrumah University of Science and Technology, Kumasi, Ghana.*  
*Developed by University Information Technology Services (UITS), KNUST.*
