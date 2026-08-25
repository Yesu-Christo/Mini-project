# CampusShield AI
## Real-Time Crime Hotspot Prediction System for KNUST

### Mini Project Report

**Course:** CSM 374 - Mini Project  
**Department:** Department of Computer Science  
**Institution:** Kwame Nkrumah University of Science and Technology (KNUST), Kumasi, Ghana  
**Academic Year:** 2025/2026  
**Date:** [Insert submission date]

### Project Team

| Name | Student ID | Contribution |
|---|---|---|
| [Team Member 1] | [Student ID] | Project lead / full-stack development |
| [Team Member 2] | [Student ID] | Frontend development |
| [Team Member 3] | [Student ID] | Backend development |
| [Team Member 4] | [Student ID] | AI and machine learning |
| [Team Member 5] | [Student ID] | Documentation and testing |

**Supervisor:** [Supervisor name and title]

---

## Abstract

CampusShield AI is a web-based campus security platform designed to support proactive incident management at Kwame Nkrumah University of Science and Technology. The system allows students and security personnel to report incidents, while administrators and security staff can review incident records, monitor alerts, and inspect risk information on an interactive campus map. A Random Forest classifier is trained on 350 synthetic spatial-temporal KNUST incident records to estimate whether a location and time period presents a high crime risk. The system combines a React frontend, Django API backend, SQLite database, Leaflet map visualisation, and a Python machine-learning pipeline. The implemented prototype demonstrates authentication, role-based access, incident reporting, AI prediction, dashboard summaries, alerts, and risk-zone visualisation. Its results are suitable for demonstrating the concept; real deployment would require validated historical data, stronger authentication, and a shared production database.

---

## Table of Contents

1. [Chapter One - Introduction](#chapter-one---introduction)  
2. [Chapter Two - Literature Review](#chapter-two---literature-review)  
3. [Chapter Three - Design and Methodology](#chapter-three---design-and-methodology)  
4. [Chapter Four - Implementation and Results](#chapter-four---implementation-and-results)  
5. [Chapter Five - Conclusion](#chapter-five---conclusion)  
6. [References](#references)  
7. [Appendices](#appendices)

---

# Chapter One - Introduction

## 1.1 Background

Campus security teams need timely information about where incidents occur and when risk may increase. Traditional security response is often reactive: an incident is reported, personnel respond, and the event is recorded after the fact. This approach can make it difficult to identify recurring patterns around hostels, gates, pathways, and other campus locations.

CampusShield AI applies data collection, machine learning, and map-based visualisation to support a more informed response. The platform records incident reports, analyses spatial and temporal features, and presents risk information to authorised users through a web dashboard.

## 1.2 Problem Statement

KNUST is a large campus with many students, staff, buildings, hostels, pathways, and access points. Incidents such as theft, phone snatching, vandalism, and assault may be concentrated at particular locations or times, especially at night. Without a central reporting and analysis platform, security personnel may have limited visibility into incident patterns and may need to rely on manual records and reactive decision-making.

The problem addressed by this project is the lack of an accessible prototype that combines incident reporting, historical incident records, risk prediction, map visualisation, and security alerts in one system.

## 1.3 Objectives

The objectives of the project are to:

1. Build a web platform for reporting and managing campus security incidents.
2. Develop a machine-learning model for estimating high-risk incident conditions.
3. Visualise campus risk zones using an interactive GIS map.
4. Provide dashboards and alerts for security monitoring.
5. Apply role-based access for students, university staff, security personnel, administrators, and IT support.
6. Demonstrate the complete frontend, backend, database, and AI workflow in a working prototype.

## 1.4 Scope

The project covers user authentication, role-based access, incident creation and history, incident status updates, dashboard statistics, alerts, AI risk prediction, and a Leaflet-based campus map. The model uses a synthetic dataset of 350 incident records and 15 KNUST landmark locations.

The prototype does not provide a production emergency dispatch service, guaranteed real-time sensor feeds, SMS integration, or a validated crime model trained on official police records. The current development database is SQLite and is intended for demonstration rather than multi-user production deployment.

## 1.5 Significance

The project demonstrates how a university security operation could combine reports and historical patterns to improve situational awareness. Students receive a structured channel for reporting incidents, while security staff can review reports and inspect risk information in one interface. The project also provides a foundation for later integration with validated datasets, PostgreSQL, mobile clients, and operational notification services.

---

# Chapter Two - Literature Review

## 2.1 Related Concepts

### Crime hotspot analysis
Hotspot analysis identifies locations where incidents occur more frequently than in surrounding areas. In this project, location names, coordinates, baseline risk, time of day, day of week, and incident severity are used to represent spatial-temporal patterns.

### Machine learning classification
Classification assigns an input to a category. CampusShield AI uses a Random Forest classifier to estimate whether an input condition is high risk. Random Forest is an ensemble method that combines the outputs of multiple decision trees.

### Geographic information systems
A GIS presents data according to geographic location. The project uses Leaflet to display KNUST locations and colour-coded risk zones on an interactive map.

### Role-based access control
Role-based access control gives users permissions according to their roles. CampusShield AI supports students, university staff, security personnel, administrators, and IT support. Students register with a program of study, while staff accounts capture a title, occupation, department, staff ID, and professional identity details. Security personnel and administrators can review incidents and alerts; students and university staff are the main reporting and information users.

## 2.2 Related Works and Systems

Existing security reporting and emergency-management systems commonly provide one or more of the following capabilities: incident submission, location capture, case tracking, map display, notification, or analytics. Research on hotspot analysis also shows the value of combining location and time when examining incident patterns.

CampusShield AI combines these ideas in a smaller campus-focused prototype. It is designed for academic demonstration and is not presented as a replacement for official security services.

### Comparison of capabilities

| Capability | Manual records | Basic reporting app | CampusShield AI |
|---|---:|---:|---:|
| Structured incident reporting | Limited | Yes | Yes |
| Role-based access | Rare | Sometimes | Yes |
| Incident status tracking | Manual | Yes | Yes |
| Interactive location map | No | Sometimes | Yes |
| Machine-learning risk estimate | No | No | Yes |
| Security alerts | Manual | Sometimes | Yes |
| Dashboard summaries | Limited | Limited | Yes |

The comparison is conceptual and should be replaced with specific named systems and properly formatted citations if the department requires a formal literature review.

---

# Chapter Three - Design and Methodology

## 3.1 Methodology Used

An iterative Agile-inspired development method was used. The work was divided into small modules and tested as features were added:

1. Define the campus security problem and project scope.
2. Design the user interface, data model, and system diagrams.
3. Implement authentication and role-based access.
4. Implement incident reporting and incident history.
5. Build and evaluate the machine-learning pipeline.
6. Integrate prediction, maps, dashboards, and alerts.
7. Test the complete prototype and document the results.

## 3.2 System Requirements

### Functional requirements

- Users shall log in and register accounts.
- Students shall submit incident reports with category, description, severity, location, and coordinates.
- Authenticated users shall view incident history according to their access level.
- Administrators and security personnel shall update incident statuses.
- Users shall view dashboard statistics and risk zones.
- Authorised users shall create and view security alerts.
- Users shall submit prediction parameters and receive a risk estimate.
- The system shall display campus locations on an interactive map.

### Non-functional requirements

- The interface should be responsive on desktop and mobile screens.
- The API should return structured JSON responses.
- Access to protected features should require authentication.
- The system should provide useful fallback behaviour when the backend is unavailable during demonstration.
- The model and application should be maintainable through separate frontend, backend, and AI modules.

## 3.3 Design Diagrams

The following project diagrams are available in the `design/` directory and should be inserted into the final report or presentation:

- Use case diagram: `design/UseCase/`
- System architecture: `design/Architecture/`
- Entity relationship diagram: `design/ERD/`
- Sequence diagrams: `design/Sequence/`
- Activity diagrams: `design/Activity/`
- User interface designs: `design/UI/`

### High-level architecture

```text
React + Vite frontend
        |
        | Axios HTTP requests
        v
Django backend API
        |
        +-- SQLite database: users, incidents, alerts
        |
        +-- Python/scikit-learn prediction service
```

## 3.4 Data and Model Methodology

The AI pipeline loads the crime and location CSV files, merges records by location, parses timestamps, and derives features. The principal features are hour, day of week, month, night-time indicator, weekend indicator, latitude, longitude, baseline risk, and severity-related values.

The target identifies a high-risk event when the severity is high or critical, or when a high-baseline-risk location is observed at night. The Random Forest model uses an 80/20 train-test split and a fixed random state for repeatable demonstration results. The reported accuracy is approximately 92.4% on the synthetic held-out test split. This value should not be interpreted as validated real-world crime-prediction accuracy.

---

# Chapter Four - Implementation and Results

## 4.1 Tools Used

| Area | Tool or technology |
|---|---|
| Frontend | React 18, Vite, React Router, Axios |
| Backend | Django 4.2, Django CORS Headers |
| Database | SQLite 3 |
| Machine learning | Python, pandas, NumPy, scikit-learn |
| Maps | Leaflet |
| Charts and icons | Recharts, Lucide React |
| Development | Visual Studio Code, Git, GitHub |

## 4.2 How the System Works

1. A user opens the React application and signs in.
2. The frontend sends authenticated requests to the Django API.
3. A student or authorised staff member submits an incident report.
4. Django validates the request and stores the incident in the database.
5. The system makes the incident available in the incident history and may create an alert.
6. A user enters time and location parameters on the prediction page.
7. The prediction service derives the required features and returns a risk probability and risk level.
8. Dashboard and map views present summaries and named risk zones.

### Screenshots to insert

- Login page: [design/UI/login-page.png](../design/UI/login-page.png)
- Registration page: [design/UI/register-page.png](../design/UI/register-page.png)
- Student dashboard: `[Insert screenshot]`
- Incident reporting form: `[Insert screenshot]`
- Incident history: `[Insert screenshot]`
- AI prediction page: `[Insert screenshot]`
- GIS heatmap: `[Insert screenshot]`
- Alerts page: `[Insert screenshot]`

The architecture, ERD, use-case, activity, sequence, and brand visuals are available in the corresponding folders under `design/`.

## 4.3 Testing

Testing was performed at a basic feature level using manual checks and API-oriented checks. Replace the actual-result placeholders with results from the final demonstration run.

| Test case | Input or action | Expected result | Actual result |
|---|---|---|---|
| Login | Valid username and password | User enters the dashboard | [Pass/Fail - fill in] |
| Invalid login | Incorrect password | Error message is displayed | [Pass/Fail - fill in] |
| Register user | Valid registration details | Account is created | [Pass/Fail - fill in] |
| Report incident | Complete incident form | Incident receives an INC#### ID | [Pass/Fail - fill in] |
| View history | Open Incident History | Stored incidents are listed | [Pass/Fail - fill in] |
| Update status | Admin/security changes status | New status is saved | [Pass/Fail - fill in] |
| Prediction | Submit time and location | Risk level and probability are returned | [Pass/Fail - fill in] |
| View map | Open Heatmap | Campus zones and markers appear | [Pass/Fail - fill in] |
| Create alert | Submit alert form | Alert is stored and displayed | [Pass/Fail - fill in] |
| Protected route | Open page without login | User is redirected or denied | [Pass/Fail - fill in] |

## 4.4 Results

The completed prototype provides an integrated workflow from authentication and incident submission to storage, review, risk estimation, and visualisation. The AI pipeline trains successfully on the supplied synthetic data, and the application exposes the prediction function through the Django API. The dashboard, alerts, and map modules provide a single interface for demonstrating campus security monitoring.

The results are proof-of-concept results. The dataset is synthetic and limited, so further data collection and validation are required before the model can support real operational decisions.

---

# Chapter Five - Conclusion

## 5.1 Summary

This project developed CampusShield AI, a campus security prototype that combines incident reporting, machine-learning risk estimation, GIS visualisation, alerts, and role-based access. The system was implemented using React, Django, SQLite, Leaflet, and a Python Random Forest pipeline.

## 5.2 Limitations

- The training data contains 350 synthetic records rather than verified historical security records.
- SQLite is not suitable as the long-term shared database for a production deployment.
- The current prototype does not provide guaranteed real-time sensor or emergency-dispatch integration.
- Model accuracy may change significantly when tested on real and more diverse data.
- The demonstration authentication and deployment configuration require hardening before production use.

## 5.3 Recommendations

- Collect and anonymise validated incident data in partnership with campus security.
- Migrate the production database to PostgreSQL.
- Use secure token authentication, HTTPS, secret management, and audit logging.
- Add SMS or push notifications for approved emergency workflows.
- Evaluate precision, recall, F1 score, confusion matrix, and calibration in addition to accuracy.
- Add model monitoring and periodic retraining as new verified data becomes available.
- Conduct usability and acceptance testing with students and security staff.

---

# References

1. Breiman, L. (2001). Random forests. *Machine Learning, 45*, 5-32.
2. Django Software Foundation. (2024). *Django documentation*. https://docs.djangoproject.com/
3. Meta Open Source. (2024). *React documentation*. https://react.dev/
4. scikit-learn developers. (2024). *RandomForestClassifier documentation*. https://scikit-learn.org/
5. Leaflet contributors. (2024). *Leaflet documentation*. https://leafletjs.com/

---

# Appendices

## Appendix A - Source Code

The complete source code is maintained in the project repository:

- Frontend: `frontend/`
- Backend: `backend/`
- AI model: `ai-model/`
- Dataset: `dataset/`

## Appendix B - Screenshots and User Interface

Insert final screenshots of the login, dashboard, incident report, incident history, prediction, map, and alerts pages here.

## Appendix C - User Manual

The user manual is available in `documentation/User Manual/`. Include the final setup and demonstration steps used during the presentation.

## Appendix D - Project Diagrams

Include the final use case, architecture, ERD, sequence, activity, and interface diagrams from the `design/` directory.
