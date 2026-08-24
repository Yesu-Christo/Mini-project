# CampusShield AI Wireframes

**Project:** Real-Time Crime Hotspot Prediction System for KNUST  
**Source of truth:** `frontend/src/App.jsx`, `frontend/src/components/`, and `frontend/src/pages/`

This document describes the low-fidelity structure of the implemented screens. It is intended for presentation, design review, and future UI changes.

## Visual Wireframes

The rendered page captures are collected in the [Visual Wireframe Gallery](Visual%20Wireframe%20Gallery.md). It includes desktop and mobile screenshots for every authenticated route, authentication screens, and key interaction states.

The connected storyboard is available here: [CampusShield screen-flow wireframe](campusshield-screen-flow-wireframe.svg).

## 1. Navigation Shell

```text
+----------------------+-----------------------------------------------+
| CampusShield AI      | Page title                         User Bell  |
| KNUST Security       | KNUST subtitle                    status      |
|----------------------|-----------------------------------------------|
| MAIN                 |                                               |
|  Dashboard           |                                               |
|  Report Incident     |             PAGE CONTENT                       |
|  Incident History    |                                               |
|  AI Predictions      |                                               |
|  Crime Heatmap       |                                               |
|  Live Alerts*        |                                               |
|----------------------|                                               |
| ADMIN                |                                               |
|  User Management*    |                                               |
|----------------------|                                               |
| ACCOUNT              |                                               |
|  My Profile          |                                               |
|  Settings            |                                               |
|----------------------|-----------------------------------------------|
| user / role / logout | Footer                                        |
+----------------------+-----------------------------------------------+
* Visible according to the user's role.
```

## 2. Authentication Flow

### Login - `/login`

```text
+--------------------------------------------------+
| CampusShield AI logo                             |
| Secure your campus. Report. Predict. Respond.    |
|                                                  |
| Username [_______________________________]       |
| Password [_______________________________]       |
|                                                  |
| [ Sign In ]                                      |
|                                                  |
| Forgot password?       Create account            |
| Demo access: Admin | Security | Student          |
+--------------------------------------------------+
```

States: initial, submitting, invalid credentials, successful login, and backend unavailable.

### Register - `/register`

```text
+--------------------------------------------------+
| Create your account                              |
| Full name [_______________________________]      |
| Username  [_______________________________]      |
| Email     [_______________________________]      |
| Password  [_______________________________]      |
| Role      [ Student v ]                           |
|                                                  |
| [ Create account ]   Already have an account?    |
+--------------------------------------------------+
```

### Password recovery - `/forgot-password` and `/reset-password`

Show a single focused form, clear validation feedback, and a route back to login.

## 3. Dashboard - `/`

```text
+--------------------------------------------------+
| Real-Time Security Dashboard                     |
| [Total incidents] [Today's incidents] [Risk]     |
| [Model accuracy]                                 |
|                                                  |
| Weekly incident trend      Recent incidents     |
| +-----------------------+   +---------------+   |
| |       bar chart       |   | incident rows |   |
| +-----------------------+   +---------------+   |
|                                                  |
| Top predicted risk zones                         |
| +----------------------------------------------+ |
| | Location | Risk level | Incidents | Peak    | |
| +----------------------------------------------+ |
+--------------------------------------------------+
```

Primary actions: open recent incident, open incident history, inspect heatmap, and review status when authorised.

## 4. Report Incident - `/report`

```text
+--------------------------------------------------+
| Report Security Incident                         |
| Category [________________] Severity [Medium v]  |
| Location [________________]                      |
| Latitude [______________] Longitude [_________]  |
| Description                                      |
| [______________________________________________] |
| [______________________________________________] |
| Evidence image [ Choose file ]                   |
|                                                  |
| [ Submit incident ]                              |
+--------------------------------------------------+
```

States: empty, field validation, submitting, success with generated INC#### ID, and failed submission.

## 5. Incident History - `/incidents`

```text
+--------------------------------------------------+
| Incident History & Logs          [Refresh]       |
| [All] [Reported] [Under Review] [Verified] ...   |
|                                                  |
| ID     Category  Location  Severity Status Date  |
| INC... Theft     Gate      High     Reported ... |
| INC... Vandalism Library   Medium   Resolved ... |
|                                                  |
| [Select a row for details]                       |
+--------------------------------------------------+
```

Students see their own reports first. Admin and security users can review and update statuses from the detail view.

## 6. Incident Detail - `/incidents/:incidentId`

Show a back link, incident ID, status badge, category, severity, location, coordinates, description, reporter, timestamp, evidence, and an authorised status update control.

## 7. AI Prediction - `/prediction`

```text
+--------------------------------------------------+
| AI Crime Risk Prediction                         |
| Hour [22] Day [Saturday] Month [August]          |
| Latitude [____________] Longitude [____________] |
| Baseline risk [High v]                           |
|                                                  |
| [ Run prediction ]                               |
|                                                  |
|              +------------------+                |
|              | HIGH RISK  78%   |                |
|              | recommendation    |                |
|              +------------------+                |
+--------------------------------------------------+
```

States: ready, calculating, low/medium/high result, validation error, and service error.

## 8. Crime Heatmap - `/heatmap`

```text
+--------------------------------------------------+
| GIS Campus Crime Heatmap                         |
| +--------------------------------------+         |
| |                                      |         |
| |             Leaflet map              |  Zone   |
| |       markers / risk circles         |  list    |
| |                                      |         |
| +--------------------------------------+         |
| Legend: Low | Medium | High                     |
+--------------------------------------------------+
```

Map interactions: zoom, pan, marker popup, and selection of a named danger or safe zone.

## 9. Alerts and Notifications

### Live Alerts - `/alerts`

A feed of active alerts with alert type, title, message, location, time, and severity. Admin and security users get a broadcast form.

### Notifications - `/notifications`

A chronological list of user notifications with unread/read states, timestamps, and incident links.

## 10. Administration and Account

### User Management - `/users`

Admin-only table with username, email, role, account status, search, and user count.

### My Profile - `/profile`

User identity, role, contact information, and profile update area.

### Settings - `/settings`

Notification preferences, high-risk-only toggle, and account/system preference controls.

## 11. Responsive Behaviour

- Desktop: persistent sidebar with content area.
- Tablet: compact sidebar and two-column dashboard where space allows.
- Mobile: menu button opens an overlay sidebar; tables become scrollable or stacked.
- Maps and charts keep stable heights so controls do not shift the page.
- Every form exposes validation and submission feedback near the relevant control.
