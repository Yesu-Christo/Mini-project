import React, { useState } from 'react';
import { MapPin, Siren } from 'lucide-react';
import { activateEmergency } from '../services/api';
import { useAppData } from '../context/AppDataContext';

export default function EmergencyButton() {
  const { addIncident } = useAppData();
  const [state, setState] = useState('ready');
  const [message, setMessage] = useState('');

  const sendEmergency = () => {
    if (state !== 'ready') return;
    setState('sending');
    setMessage('Locating you and notifying patrol...');

    const submit = (position) => {
      const latitude = position?.coords?.latitude;
      const longitude = position?.coords?.longitude;
      activateEmergency({ latitude, longitude })
        .then(({ data }) => {
          addIncident(data.incident);
          setState('sent');
          setMessage('Emergency sent. Patrol has been notified of your location.');
        })
        .catch((error) => {
          setState('ready');
          setMessage(error?.response?.data?.error || 'Unable to send emergency alert. Try again.');
        });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(submit, () => submit(), { enableHighAccuracy: true, timeout: 8000 });
    } else {
      submit();
    }
  };

  return (
    <div className="emergency-control">
      <button
        className={`emergency-button${state === 'sent' ? ' sent' : ''}`}
        onClick={sendEmergency}
        disabled={state !== 'ready'}
        aria-label="Send emergency alert"
      >
        <Siren size={20} />
        <span>{state === 'sending' ? 'Sending...' : state === 'sent' ? 'Patrol notified' : 'Emergency'}</span>
      </button>
      {message && <div className={`emergency-status ${state === 'ready' ? 'error' : ''}`} role="status"><MapPin size={13} />{message}</div>}
    </div>
  );
}