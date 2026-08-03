# CampusShield-AI Project Plan

## Module 2: Incident Reporting

| Feature               | Description                                      |
|-----------------------|--------------------------------------------------|
| Student submits report| Students can file incident reports               |
| Security submits report| Security personnel can file incident reports    |
| Upload images         | Attach images/evidence to a report               |
| GPS location          | Auto-capture or pin GPS coordinates              |
| Category              | Classify incident type (theft, assault, etc.)    |
| Description           | Free-text description of the incident            |
| Date                  | Date and time of the incident                    |
| Status                | Track report status (pending, resolved, etc.)    |

---

## Module 3: AI (Prediction Engine)

| Feature          | Description                                         |
|------------------|-----------------------------------------------------|
| Load Model       | Load the trained crime prediction ML model          |
| Receive Incident | Accept incident data as input                       |
| Predict Risk     | Run inference to predict risk level/hotspot         |
| Save Prediction  | Persist prediction results to the database          |
| Return Result    | Send prediction result back to the backend/frontend |

---

## Module 4: Dashboard

| Feature             | Description                                      |
|---------------------|--------------------------------------------------|
| Total Incidents     | Display total number of reported incidents       |
| Today's Incidents   | Show incidents reported today                    |
| High Risk Areas     | Highlight campus areas with high risk levels     |
| Prediction Accuracy | Show AI model prediction accuracy metrics        |
| Recent Alerts       | Display the latest alerts on the dashboard       |

---

## Module 5: GIS (Mapping)

| Feature      | Description                                         |
|--------------|-----------------------------------------------------|
| Campus Map   | Interactive map of the KNUST campus                 |
| Markers      | Pin incident locations on the map                   |
| Heatmap      | Visual heatmap of crime density across campus       |
| Danger Zones | Highlight zones identified as high-danger areas     |
| Safe Zones   | Highlight zones identified as safe areas            |

---

## Module 6: Notifications

| Feature              | Description                                      |
|----------------------|--------------------------------------------------|
| Email                | Send alert/notification emails to users          |
| SMS (future)         | SMS notifications (planned for future release)   |
| In-App Notification  | Real-time in-app notifications for users         |
