import React, { useState } from 'react';
import { MapPin, Siren } from 'lucide-react';
import { activateEmergency } from '../services/api';
import { useAppData } from '../context/AppDataContext';

const playEmergencyTone = () => {
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return;

  try {
    const audioContext = new AudioCtor();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(880, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.6);

    setTimeout(() => audioContext.close(), 700);
  } catch {
    // ignore browser audio failures silently
  }
};

export default function EmergencyButton() {
  const { addIncident } = useAppData();
  const [state, setState] = useState('ready');
  const [message, setMessage] = useState('');

  const sendEmergency = () => {
    if (state !== 'ready') return;
    playEmergencyTone();
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
          const errMsg = error?.response?.data?.error;
          if (error?.response?.status === 401 || errMsg?.includes('Authentication')) {
            setMessage('Please sign in as a Student or Staff member to activate Emergency SOS.');
          } else {
            setMessage(errMsg || 'Unable to send emergency alert. Try again.');
          }
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