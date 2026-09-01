# 📸 CampusShield-AI Visual Tour

## Page 1: Real-Time Security Dashboard
**URL**: http://localhost:5173/

```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  🛡️ CampusShield AI              🟢 System Active    [👤 admin] ║
║  KNUST Security Platform                                      ║
║                                                                ║
║  ═══════════════════════════════════════════════════════════  ║
║  Real-Time Security Dashboard                                 ║
║  KNUST Campus Overview & Predictive Intelligence              ║
║                                                                ║
║  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────┐
║  │ Total        │  │ Today's      │  │ High Risk    │  │Mod │
║  │ Incidents    │  │ Incidents    │  │ Zones        │  │Acc │
║  │      0       │  │      0       │  │      0       │  │70% │
║  │ Hist & cur   │  │ Last 24 hrs  │  │ Active zones │  │RF  │
║  └──────────────┘  └──────────────┘  └──────────────┘  └────┘
║
║  ┌────────────────────────────────────────────────────────────┐
║  │ 🛡️ Active Alerts                           LIVE: 0         │
║  └────────────────────────────────────────────────────────────┘
║
║  ┌──────────────────────┐        ┌──────────────────────────┐
║  │ Campus GIS Hotspot   │        │ Weekly Incident Trends   │
║  │ Map                  │        │ KNUST campus             │
║  │                      │        │                          │
║  │  [Interactive Map]   │        │   [Chart: 0-4 scale]    │
║  │                      │        │                          │
║  └──────────────────────┘        └──────────────────────────┘
║
╚════════════════════════════════════════════════════════════════╝
```

**What You See**: Clean dashboard with 0 metrics, ready for data

---

## Page 2: Report Security Incident
**URL**: http://localhost:5173/report

```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  🛡️ CampusShield AI                                    [👤 admin]
║  KNUST Security Platform                                      ║
║                                                                ║
║  Report Security Incident                                     ║
║  Submit real-time crime reports to alert campus security      ║
║                                                                ║
║  ┌─────────────────────────────────────────────────────────┐  
║  │ Incident Category          │ Severity Level              │  
║  │ ┌─────────────────────────┐ ┌───────────────────────────┐│  
║  │ │ Phone Snatching    ▼   │ │ Medium              ▼     ││  
║  │ │ • Theft/Larceny        │ │ • Low                     ││  
║  │ │ • Physical Assault      │ │ • Medium                  ││  
║  │ │ • Hostel Burglary       │ │ • High                    ││  
║  │ │ • Vandalism             │ │ • Critical                ││  
║  │ └─────────────────────────┘ └───────────────────────────┘│  
║  │                                                           │  
║  │ Campus Location                                          │  
║  │ ┌──────────────────────────────────────────────────────┐│  
║  │ │ Unity Hall (Conti)                       ▼          ││  
║  │ │ • University Hall (Katanga)                         ││  
║  │ │ • Brunei Hostels                                    ││  
║  │ │ • Africa Hall Block B                               ││  
║  │ │ • Ayeduase Gate Exit                                ││  
║  │ │ • Commercial Area Parking                           ││  
║  │ │ • KNUST Main Library                                ││  
║  │ │ • College of Science Complex                        ││  
║  │ │ • Faculty of Law Quadrangle                         ││  
║  │ │ • SRC Secretariat / Great Hall / Other             ││  
║  │ └──────────────────────────────────────────────────────┘│  
║  │                                                           │  
║  │ Incident Description                                     │  
║  │ ┌──────────────────────────────────────────────────────┐│  
║  │ │ Describe what happened in detail...                 ││  
║  │ │                                                      ││  
║  │ └──────────────────────────────────────────────────────┘│  
║  │                                                           │  
║  │ Latitude (optional): 6.6738   Longitude: -1.5684         │  
║  │                                                           │  
║  │ Upload Evidence / Images: [Choose File]                  │  
║  │                                                           │  
║  │                    [📤 Submit Report]                    │  
║  └─────────────────────────────────────────────────────────┘  
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**What You Do**: Fill out form → Click Submit → Incident stored

---

## Page 3: AI Crime Risk Prediction
**URL**: http://localhost:5173/prediction

```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  AI Crime Risk Prediction                                     ║
║  Evaluate hotspot probability using Random Forest             ║
║                                                                ║
║  ┌──────────────────────────────┐  ┌──────────────────────────┐
║  │ Prediction Parameters        │  │ Model Prediction Output  │
║  ├──────────────────────────────┤  ├──────────────────────────┤
║  │                              │  │                          │
║  │ Target Location              │  │      🤖 AI MODEL         │
║  │ [Ayeduase Gate Exit]  ▼      │  │                          │
║  │                              │  │ Run the model to see     │
║  │ Hour of Day (0-23): [22]     │  │ results                  │
║  │ Day of Week: [Saturday] ▼    │  │                          │
║  │ Month: [Aug] ▼               │  │                          │
║  │                              │  │                          │
║  │ [⚡ Run AI Inference]        │  │                          │
║  └──────────────────────────────┘  └──────────────────────────┘
║
║  ═══════════════════════════════════════════════════════════════
║  How Predictions Work
║  ─────────────────────
║  • Risk Score: Each zone sums severity weights
║  • Rising Activity: Compare recent vs. prior 30 days
║  • Weekly Trends: Group reports by day submitted
║
╚════════════════════════════════════════════════════════════════╝
```

**What You Do**: Select parameters → Click "Run AI Inference" → See risk score

---

## Page 4: GIS Campus Crime Heatmap
**URL**: http://localhost:5173/heatmap

```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  GIS Campus Crime Heatmap                                      ║
║  Spatial mapping of high-density crime zones                  ║
║                                                                ║
║  [All Zones] [Danger Zones] [Safe Zones]                      ║
║                                                                ║
║  🔴 High Risk  🟠 Medium Risk  🟢 Low/Safe                    ║
║                                                                ║
║  ┌──────────────────────────────────────────────────────────┐
║  │                                                          │
║  │          [Interactive Leaflet Map]                      │
║  │                                                          │
║  │         🔴 Crime hotspots shown                         │
║  │         🔴 with red circles                             │
║  │                                                          │
║  │    🟢 Safe zones in green                               │
║  │    🟠 Medium risk in orange                             │
║  │                                                          │
║  │     Zoom: [+] [-]                                       │
║  │     © Leaflet | © OpenStreetMap                         │
║  │                                                          │
║  └──────────────────────────────────────────────────────────┘
║
║  ┌──────────────────┐  ┌──────────────────────────────┐
║  │ Danger Zones     │  │ Safe Zones                   │
║  ├──────────────────┤  ├──────────────────────────────┤
║  │ 1. Ayeduase Gate │  │ 1. Main Library              │
║  │    Phone snatch  │  │    24/7 CCTV coverage        │
║  │    after 20:00   │  │                              │
║  │                  │  │ 2. College of Science        │
║  │ 2. Brunei Path   │  │    Well-lit walkways         │
║  │    Poor lighting │  │                              │
║  │    Theft reports │  │ 3. Faculty of Law            │
║  │                  │  │    Low risk always           │
║  │ 3. Unity Hall    │  │                              │
║  │    Midnight      │  │ 4. Great Hall                │
║  │    Trespassing   │  │    Security patrols          │
║  └──────────────────┘  └──────────────────────────────┘
║
╚════════════════════════════════════════════════════════════════╝
```

**What You See**: Interactive map showing crime locations and risk levels

---

## Page 5: Incident History & Logs
**URL**: http://localhost:5173/incidents

```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  Incident History & Logs                                       ║
║  Complete audit trail of campus incident reports               ║
║                                                                ║
║  [All] [Reported] [Under Review] [Verified] [Resolved]        ║
║                                                                ║
║  ┌─────────────────────────────────────────────────────────┐
║  │ ID      │ Category          │ Location        │ Severity│
║  │─────────────────────────────────────────────────────────│
║  │ INC0001 │ Phone Snatching   │ Brunei Hostels │ 🔴 HIGH│
║  │ INC0002 │ Theft             │ Main Library    │ 🟠 MED │
║  │ INC0003 │ Vandalism         │ Unity Hall      │ 🟢 LOW │
║  │ INC0004 │ Assault           │ Ayeduase Exit   │ 🔴🔴CRI│
║  │ INC0005 │ Burglary          │ Africa Hall     │ 🔴 HIGH│
║  │─────────────────────────────────────────────────────────│
║  │ Status      │ Reported                                   │
║  │─────────────────────────────────────────────────────────│
║  │ UNDER INV   │ 2026-07-29 08:30                         │
║  │ PENDING     │ 2026-07-28 19:45                         │
║  │ RESOLVED    │ 2026-07-27 22:15                         │
║  │ UNDER INV   │ 2026-07-26 01:10                         │
║  │ RESOLVED    │ 2026-07-25 14:00                         │
║  └─────────────────────────────────────────────────────────┘
║
║  Each row is clickable for full incident details
║
╚════════════════════════════════════════════════════════════════╝
```

**What You See**: Searchable table of all reported incidents with status

---

## Page 6: User Management (Admin Only)
**URL**: http://localhost:5173/users

```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  User Management                                               ║
║                                                                ║
║  [+ Create New User] [Search] [Filter by Role]                ║
║                                                                ║
║  ┌──────────────────────────────────────────────────────────┐
║  │ Name             │ Role              │ School ID  │ Stat │
║  │──────────────────────────────────────────────────────────│
║  │ Kiro IT Support  │ IT Support        │ IT001      │ ✅   │
║  │ John Doe         │ Security          │ SEC001     │ ✅   │
║  │ Jane Smith       │ Student           │ STU001     │ ✅   │
║  │ Prof. Brown      │ University Staff  │ STF001     │ ✅   │
║  │ Alice Johnson    │ Administrator     │ ADM001     │ ✅   │
║  └──────────────────────────────────────────────────────────┘
║
║  Click row to edit user details
║
╚════════════════════════════════════════════════════════════════╝
```

**What You Do**: Create users, assign roles, manage permissions

---

## Navigation Sidebar

```
┌──────────────────────┐
│ 🛡️ CampusShield      │
│ AI                   │
│ KNUST Security       │
├──────────────────────┤
│                      │
│ MAIN                 │
│ 📊 Dashboard         │
│ ⚠️  Report Incident  │
│ 📋 Incident History  │
│ 🤖 AI Predictions    │
│ 🗺️  Crime Heatmap    │
│ 🚨 Live Alerts       │
│                      │
│ ADMIN                │
│ 👥 User Management   │
│                      │
│ ACCOUNT              │
│ 👤 My Profile        │
│ ⚙️  Settings         │
│                      │
├──────────────────────┤
│ [A] admin            │
│     ADMIN            │
│ [🚪 Logout]          │
└──────────────────────┘
```

**Access**: Click any menu item to navigate

---

## Key Features Summary

| Feature | Status | Quick Demo |
|---------|--------|-----------|
| 🔐 Authentication | ✅ | Login with ADM001/admin123 |
| 📊 Dashboard | ✅ | Shows 0 metrics (clean) |
| 📝 Report Form | ✅ | Full form with validation |
| 🗺️ GIS Map | ✅ | Interactive Leaflet map |
| 🤖 AI Model | ✅ | Random Forest ready |
| 📈 Charts | ✅ | Weekly trends display |
| 🚨 Alerts | ✅ | Alert system ready |
| 👥 User Mgmt | ✅ | Create/edit users |
| 📱 Responsive | ✅ | Works on mobile |
| 🎨 Dark Theme | ✅ | Green accent UI |

---

## What Happens Next

```
USER JOURNEY:

1. User Logs In
   ↓
2. User Goes to "Report Incident"
   ↓
3. User Fills Form & Clicks Submit
   ↓
4. Incident Stored in Database
   ↓
5. Dashboard Metrics Update Automatically
   ↓
6. Incident Appears on Heatmap
   ↓
7. Alert Sent if High Severity
   ↓
8. AI Model Retrained Weekly
   ↓
9. Predictions Improve Over Time
   ↓
10. KNUST Campus Becomes Safer! 🎉
```

---

**Status**: ✅ All Pages Working | ✅ Ready for Real Data | ✅ Launch Approved
