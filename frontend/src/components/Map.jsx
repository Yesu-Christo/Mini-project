import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons broken by webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const KNUST_LOCATIONS = [
  { name: 'Unity Hall (Conti)',         lat: 6.6738,  lng: -1.5684, risk: 'High' },
  { name: 'University Hall (Katanga)',  lat: 6.6765,  lng: -1.5695, risk: 'High' },
  { name: 'Brunei Hostels Pathway',     lat: 6.6810,  lng: -1.5620, risk: 'High' },
  { name: 'Ayeduase Gate Exit',         lat: 6.6685,  lng: -1.5610, risk: 'High' },
  { name: 'Africa Hall Block B',        lat: 6.6715,  lng: -1.5650, risk: 'Medium' },
  { name: 'Commercial Area Parking',    lat: 6.6700,  lng: -1.5665, risk: 'Medium' },
  { name: 'Main Library',               lat: 6.6720,  lng: -1.5670, risk: 'Low' },
  { name: 'College of Science',         lat: 6.6745,  lng: -1.5640, risk: 'Low' },
  { name: 'Faculty of Law Quadrangle',  lat: 6.6730,  lng: -1.5700, risk: 'Low' },
];

const RISK_CONFIG = {
  High:   { color: '#ef4444', radius: 200, fill: 0.35 },
  Medium: { color: '#f59e0b', radius: 140, fill: 0.25 },
  Low:    { color: '#10b981', radius:  90, fill: 0.2  },
};

export default function Map({ locations = KNUST_LOCATIONS, center = [6.6738, -1.5684], zoom = 14, height = '420px' }) {
  const mapRef    = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    locations.forEach((loc) => {
      const cfg = RISK_CONFIG[loc.risk] || RISK_CONFIG.Low;

      const circle = L.circle([loc.lat, loc.lng], {
        color:        cfg.color,
        fillColor:    cfg.color,
        fillOpacity:  cfg.fill,
        weight:       1.5,
        radius:       cfg.radius,
      }).addTo(map);

      circle.bindPopup(`
        <div style="font-family:Inter,sans-serif;padding:4px 2px">
          <strong style="font-size:13px">${loc.name}</strong><br/>
          <span style="color:${cfg.color};font-weight:700;font-size:12px">${loc.risk} Risk</span>
        </div>
      `);
    });

    instanceRef.current = map;

    return () => {
      map.remove();
      instanceRef.current = null;
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height,
        borderRadius: 'var(--r-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border)',
      }}
    />
  );
}
