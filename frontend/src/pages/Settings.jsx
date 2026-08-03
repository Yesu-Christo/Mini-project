import React, { useState } from 'react';
import { Bell, Monitor, Save, CheckCircle } from 'lucide-react';

const initialSettings = {
  emailAlerts:     true,
  smsAlerts:       false,
  inAppNotifs:     true,
  highRiskOnly:    false,
  darkMode:        true,
  autoRefresh:     true,
  refreshInterval: 30,
};

function Toggle({ label, desc, value, onChange }) {
  return (
    <div className="toggle-row">
      <div className="toggle-label-block">
        <strong>{label}</strong>
        {desc && <small>{desc}</small>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={onChange}
        className={`toggle-switch ${value ? 'on' : 'off'}`}
        aria-label={label}
      />
    </div>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState(initialSettings);
  const [saved,    setSaved]    = useState(false);

  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">System Settings</h2>
          <p className="page-subtitle">Configure CampusShield AI notification and display preferences.</p>
        </div>
      </div>

      {saved && (
        <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
          <CheckCircle size={14} style={{ flexShrink: 0 }} /> Preferences saved successfully.
        </div>
      )}

      {/* Notifications */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Bell size={15} color="var(--blue)" />
          <p className="card-title" style={{ marginBottom: 0 }}>Notification Settings</p>
        </div>
        <Toggle label="Email Alerts"           desc="Receive incident alerts via KNUST email"                settingKey="emailAlerts"  value={settings.emailAlerts}  onChange={() => toggle('emailAlerts')} />
        <Toggle label="SMS Alerts (Phase 6)"   desc="SMS notifications planned for Phase 6 rollout"          settingKey="smsAlerts"    value={settings.smsAlerts}    onChange={() => toggle('smsAlerts')} />
        <Toggle label="In-App Notifications"   desc="Show live alert banners inside the dashboard"           settingKey="inAppNotifs"  value={settings.inAppNotifs}  onChange={() => toggle('inAppNotifs')} />
        <Toggle label="High Risk Incidents Only" desc="Only notify on High or Critical severity incidents"   settingKey="highRiskOnly" value={settings.highRiskOnly} onChange={() => toggle('highRiskOnly')} />
      </div>

      {/* Dashboard */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Monitor size={15} color="var(--blue)" />
          <p className="card-title" style={{ marginBottom: 0 }}>Dashboard Settings</p>
        </div>
        <Toggle label="Dark Mode"             desc="Use the dark interface theme (recommended)"              value={settings.darkMode}     onChange={() => toggle('darkMode')} />
        <Toggle label="Auto-Refresh Dashboard" desc="Automatically reload incident and alert data"           value={settings.autoRefresh}  onChange={() => toggle('autoRefresh')} />

        <div className="form-group" style={{ paddingTop: '1rem' }}>
          <label className="form-label">Auto-Refresh Interval (seconds)</label>
          <input
            type="number" min={10} max={300}
            className="form-control"
            style={{ maxWidth: 200 }}
            value={settings.refreshInterval}
            disabled={!settings.autoRefresh}
            onChange={e => setSettings(s => ({ ...s, refreshInterval: parseInt(e.target.value) || 30 }))}
          />
        </div>

        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border)', marginTop: '1rem' }}>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={14} /> Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
