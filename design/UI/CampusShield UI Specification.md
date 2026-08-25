# CampusShield AI UI Specification

**Product:** CampusShield AI  
**Purpose:** Visual handoff for the KNUST campus security prototype

## 1. Visual Direction

The interface should feel operational, trustworthy, and alert without becoming visually alarming. Use a deep charcoal shell, clean white content surfaces, KNUST-inspired gold accents, and restrained risk colours for information that needs attention.

## 2. Design Tokens

### Colour

| Token | Value | Use |
|---|---|---|
| `--navy` | `#102A43` | Brand headings and primary navigation |
| `--blue` | `#1976D2` | Primary actions and links |
| `--gold` | `#FDB913` | CampusShield accent and active emphasis |
| `--ink` | `#17202A` | Primary text |
| `--muted` | `#667085` | Secondary text and metadata |
| `--surface` | `#FFFFFF` | Cards, tables, and forms |
| `--canvas` | `#F4F6F8` | Page background |
| `--border` | `#E1E6EB` | Dividers and input borders |
| `--red` | `#C62828` | High risk, destructive, emergency |
| `--amber` | `#C88719` | Medium risk and warnings |
| `--green` | `#2E7D5B` | Low risk and success |

Risk colours must always be paired with text such as Low, Medium, High, or Critical; colour alone is not sufficient.

### Typography

- Page title: 20px, weight 700.
- Section heading: 16px, weight 700.
- Body text: 14px, weight 400.
- Metadata and helper text: 12px, weight 500.
- Table text: 13px for dense scanning.
- Use a readable sans-serif family already approved by the project stylesheet; keep line height around 1.45.

### Shape and spacing

- Base spacing unit: 4px.
- Common page padding: 24px desktop, 16px mobile.
- Card radius: 8px maximum.
- Input and button height: 40px minimum.
- Icon buttons: 36px square with an accessible label or tooltip.
- Use one clear primary action per surface.

## 3. Component Rules

### Buttons

- Primary: blue fill with white label and a relevant Lucide icon where available.
- Secondary: white or transparent surface with border.
- Destructive: red only for irreversible actions.
- Loading buttons preserve their width and show a spinner without changing layout.

### Forms

Every input has a visible label, consistent height, focus ring, error text, and required indicator when applicable. Do not rely on placeholder text as the label. Long descriptions use a textarea with a stable minimum height.

### Tables

Use a compact header, right-aligned numeric values, left-aligned descriptions, and row hover feedback. On mobile, allow horizontal scrolling rather than compressing incident IDs or status labels until they become unreadable.

### Badges

Use short text badges for statuses and risk levels:

| Meaning | Suggested style |
|---|---|
| Reported | blue outline |
| Under Review | amber fill or outline |
| Verified | blue or green outline |
| Resolved | green fill or outline |
| Dismissed | neutral gray |
| High/Critical | red fill with white text |

### Empty, loading, and error states

- Loading: show a local spinner or skeleton in the content region.
- Empty: explain what is missing and provide one relevant action.
- Error: state whether retrying may help and keep the last stable layout visible.
- Backend unavailable: clearly label fallback/demo data so it is not mistaken for live records.

## 4. Screen Specifications

### Authentication

Use a focused centered form with the CampusShield shield mark, short security-oriented supporting text, and a clear route between login, registration, and password recovery. Registration supports Student, University Staff, Security, Admin, and IT account types. Collect first name, last name, optional other name, ID, university email, and password; show Program of Study for students and Title, Occupation, and Department for staff roles as applicable. Demo access buttons should be visually secondary to normal sign-in.

### Dashboard

Prioritise four metric cards, then the weekly incident chart and recent incidents. Keep the top risk-zone table below the chart. The dashboard should answer three questions quickly: how many incidents exist, what is happening now, and where risk is concentrated.

### Incident Reporting

Use a two-column form on desktop: report details on the left and location/evidence on the right. Stack fields on mobile. Keep the submit action visible after the description and evidence controls. On success, display the generated incident ID prominently and link to its detail page.

### Incident History and Detail

Use filter tabs for status and a compact table for scanning. The detail page should use a clear status header, a metadata grid, a description area, and an authorised review panel. Students should not see staff-only status controls.

### AI Prediction

Make the input form and result equally visible. The result panel must show risk level, probability, key contributing conditions, and a security recommendation. Use a visual gauge only when the numeric probability is also shown.

### GIS Heatmap

Give the map the largest visual area. Keep the legend persistent, use readable marker popups, and place danger/safe zone summaries beside or below the map. Avoid overlays that hide map controls on mobile.

### Alerts and Notifications

Alerts need strong hierarchy: type, title, location, message, and time. Use red only for genuinely high-severity content. Notifications should make unread items visually distinct while remaining readable for colour-blind users.

### Admin and Account

User Management is an admin-only data table with search and role visibility. Profile and Settings should use simple labelled sections, not dense dashboard cards. Keep account actions separated from preference controls.

## 5. Accessibility Checklist

- All icon-only buttons have `aria-label` and a tooltip/title where useful.
- Keyboard focus is visible on links, buttons, inputs, tabs, and map controls.
- Text and controls meet readable contrast requirements.
- Status is communicated through text, not colour alone.
- Forms expose errors next to the relevant field and do not erase valid input.
- Responsive layouts avoid horizontal page overflow.
- Tables and charts have a text alternative or summary.
- Mobile navigation can be opened and closed without trapping the user.

## 6. Implementation Mapping

| UI area | Implemented location |
|---|---|
| Application shell | `frontend/src/layouts/AppLayout.jsx` |
| Sidebar navigation | `frontend/src/components/Sidebar.jsx` |
| Top navigation | `frontend/src/components/Navbar.jsx` |
| Dashboard | `frontend/src/pages/Dashboard.jsx` |
| Incident reporting | `frontend/src/pages/ReportIncident.jsx` |
| Incident history | `frontend/src/pages/IncidentHistory.jsx` |
| Prediction | `frontend/src/pages/Prediction.jsx` |
| Heatmap | `frontend/src/pages/HeatMap.jsx` |
| Alerts | `frontend/src/pages/Alerts.jsx` |
| Account pages | `frontend/src/pages/Profile.jsx`, `Settings.jsx` |

## 7. Presentation Asset Checklist

Capture final screenshots at desktop and mobile widths for:

- Login
- Dashboard
- Report Incident
- Incident History
- AI Prediction result
- GIS Heatmap
- Live Alerts
- User Management

Place approved screenshots beside this specification or link them from the report appendix.

## 8. Current Visual Assets

The following images were captured from the running frontend and can be inserted directly into the report:

- [Login page](login-page.png)
- [Registration page](register-page.png)
- [Forgot password page](forgot-password-page.png)

The reusable brand mark is available at [campusshield-shield.svg](../Logo/campusshield-shield.svg).
