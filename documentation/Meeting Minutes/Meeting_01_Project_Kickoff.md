# Meeting Minutes — Meeting 1

**Project:** CampusShield AI — Real-Time Crime Hotspot Prediction System  
**Meeting Title:** Project Kickoff & Topic Selection  
**Date:** Monday, 3rd February 2026  
**Time:** 2:00 PM – 3:30 PM  
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

1. Introduction and team formation
2. Topic proposal and discussion
3. Review of project requirements and scope
4. Initial research discussion
5. Task assignment and next steps

---

## Minutes

### 1. Introduction and Team Formation

The meeting was opened by Dr. Oliver Kornyo who welcomed the team and outlined the expectations for the CSM 374 mini project. Sie Kofi Eugene and Sumani Alima Mahami confirmed their pairing as a two-person group. Dr. Kornyo noted that while the group is small, the scope of the project should reflect a full system with frontend, backend, and an AI/ML component.

---

### 2. Topic Proposal and Discussion

Sie Kofi Eugene proposed building a **campus security and crime hotspot prediction system** specifically for KNUST. The rationale presented was:

- Security incidents (phone snatching, theft, assault) are a known and recurring problem on the KNUST campus, particularly at night near hostels and peripheral gates.
- No existing data-driven tool exists to help security personnel anticipate where incidents are likely to occur.
- The project presents a natural opportunity to apply machine learning (predictive modelling) alongside a web platform and GIS mapping.

Sumani Alima Mahami supported the topic and suggested naming the system **CampusShield AI** to reflect both the security and AI aspects.

Dr. Kornyo approved the topic and highlighted that the project must include:
- A functional machine learning prediction model
- A REST API backend
- A user-facing frontend interface
- Proper documentation

---

### 3. Research Discussion

The team discussed the research background required before development begins:

- **Crime prediction systems:** Both members agreed to independently research existing campus security systems and crime hotspot prediction models used in other universities.
- **Machine learning for crime prediction:** Sie Kofi Eugene was tasked with researching suitable ML algorithms — Random Forest, Decision Trees, and Gradient Boosting were noted as candidates.
- **KNUST campus geography:** Sumani Alima Mahami agreed to compile a list of key campus locations (hostels, gates, lecture areas) with approximate GPS coordinates as the basis for the spatial dataset.
- **GIS mapping tools:** The team researched Leaflet.js and Google Maps API as options for campus mapping. Leaflet was preferred due to being open-source and free.

---

### 4. Technology Stack Discussion

After brief research discussion, the following technology preferences were noted (subject to change after further research):

| Layer | Proposed Technology |
|-------|-------------------|
| Frontend | React.js |
| Backend | Django (Python) |
| Database | SQLite (development) |
| ML | scikit-learn (Python) |
| Map | Leaflet.js |

---

### 5. Decisions Made

| # | Decision |
|---|---------|
| 1 | Topic approved: CampusShield AI — Real-Time Crime Hotspot Prediction System |
| 2 | System name confirmed as **CampusShield AI** |
| 3 | Technology stack provisionally agreed upon (React, Django, scikit-learn, Leaflet) |
| 4 | Both members to conduct independent research before next meeting |
| 5 | Sumani Alima Mahami to compile initial list of 15 KNUST campus locations with GPS coordinates |
| 6 | Sie Kofi Eugene to research ML algorithms suitable for crime prediction on tabular spatial-temporal data |

---

## Action Items

| Task | Assigned To | Deadline |
|------|------------|---------|
| Research existing campus crime prediction systems | Both members | 10th February 2026 |
| Research ML algorithms (Random Forest, Decision Tree, XGBoost) | Sie Kofi Eugene | 10th February 2026 |
| Compile 15 KNUST landmark locations with GPS coordinates and risk baseline | Sumani Alima Mahami | 10th February 2026 |
| Set up GitHub repository for collaboration | Sie Kofi Eugene | 10th February 2026 |
| Draft initial system requirements document | Both members | 10th February 2026 |

---

## Next Meeting

**Scheduled Date:** Monday, 10th February 2026  
**Topic:** Research findings review, system design and architecture planning

---

*Minutes recorded by: Sie Kofi Eugene*  
*Approved by: Dr. Oliver Kornyo*

---
*© 2026 Kwame Nkrumah University of Science and Technology, Kumasi, Ghana.*
