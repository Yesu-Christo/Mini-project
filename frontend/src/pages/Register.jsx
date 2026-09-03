import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, GraduationCap, ShieldCheck, Building, User, Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { register } from '../services/api';

export default function Register() {
  const [role, setRole] = useState('STUDENT');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    other_name: '',
    title: '',
    school_id: '',
    email: '',
    department: '',
    program: '',
    occupation: '',
    password: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const idLabel = role === 'STUDENT' ? 'Student ID' : 'Staff ID';

    if (!formData.school_id.trim()) {
      setError(`Please enter your ${idLabel}.`);
      return;
    }

    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setError('Please enter your first name and last name.');
      return;
    }

    if (role === 'STUDENT' && !formData.program.trim()) {
      setError('Please enter your program of study.');
      return;
    }

    if (isStaffRole && !formData.occupation.trim()) {
      setError('Please enter your occupation at the university.');
      return;
    }

    if (isStaffRole && !formData.title) {
      setError('Please select your professional title.');
      return;
    }

    if ((role === 'STAFF' || role === 'ADMIN') && !formData.department.trim()) {
      setError('Please enter your department.');
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!formData.password) {
      setError('Please enter a password.');
      return;
    }

    setLoading(true);

    // Render free tier cold starts can take 50+ seconds. Retry up to 3 times
    // with a 5-second gap when we get a network error (connection refused).
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 5000;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await register({
          role,
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          other_name: formData.other_name.trim(),
          title: formData.title,
          school_id: formData.school_id.trim().toUpperCase(),
          email: formData.email.trim(),
          department: formData.department.trim(),
          program: role === 'STUDENT' ? formData.program.trim() : undefined,
          occupation: isStaffRole ? formData.occupation.trim() : undefined,
          password: formData.password,
        });

        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
        return; // success — exit the loop
      } catch (err) {
        const serverMsg = err?.response?.data?.error;
        const status = err?.response?.status;
        const isNetworkError = !err?.response;

        // If the server returned an actual response, don't retry — it's a real error
        if (!isNetworkError) {
          if (serverMsg) {
            setError(serverMsg);
          } else if (status === 403) {
            setError('That School ID or email is already registered.');
          } else {
            setError(`Registration failed (${status}). Please try again.`);
          }
          setLoading(false);
          return;
        }

        // Network error (cold start) — retry if attempts remain
        if (attempt < MAX_RETRIES) {
          setError(`Server is waking up… retrying (${attempt}/${MAX_RETRIES - 1})`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        } else {
          setError('Server is still starting up. Please wait 30 seconds and try again.');
        }
      }
    }

    setLoading(false);
  };

  const rolesConfig = [
    {
      key: 'STUDENT',
      title: 'Student',
      desc: 'KNUST Student',
      icon: GraduationCap,
      idLabel: 'Student No. / Ref No.',
      idPlaceholder: 'e.g. 20732517 or 21022179',
      emailLabel: 'KNUST Student Mail',
      emailPlaceholder: 'e.g. 20732517@st.knust.edu.gh',
    },
    {
      key: 'STAFF',
      title: 'University Staff',
      desc: 'Faculty and Staff',
      icon: User,
      idLabel: 'Staff ID',
      idPlaceholder: 'e.g. STF1234 or EMP5678',
      emailLabel: 'University Email',
      emailPlaceholder: 'e.g. name@knust.edu.gh',
    },
    {
      key: 'SECURITY',
      title: 'Security',
      desc: 'Security Personnel',
      icon: ShieldCheck,
      idLabel: 'Staff ID',
      idPlaceholder: 'e.g. SEC1234 or STF5678',
      emailLabel: 'Email Address',
      emailPlaceholder: 'e.g. security@knust.edu.gh',
    },
    {
      key: 'IT',
      title: 'IT Support',
      desc: 'Technology Services',
      icon: Shield,
      idLabel: 'Staff ID',
      idPlaceholder: 'e.g. IT1234 or STF5678',
      emailLabel: 'University Email',
      emailPlaceholder: 'e.g. support@knust.edu.gh',
    },
    {
      key: 'ADMIN',
      title: 'Admin',
      desc: 'Administrator',
      icon: Building,
      idLabel: 'Staff ID',
      idPlaceholder: 'e.g. ADM1234 or STF8901',
      emailLabel: 'Email Address',
      emailPlaceholder: 'e.g. admin@knust.edu.gh',
    },
  ];

  const currentRoleConfig = rolesConfig.find(r => r.key === role);
  const isStaffRole = ['STAFF', 'SECURITY', 'ADMIN', 'IT'].includes(role);

  return (
    <div className="login-page">
      <div className="login-bg-glow" />
      <div className="login-bg-glow-2" />

      <div className="login-card" style={{ maxWidth: '460px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div className="login-logo-wrap">
            <Shield size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            CampusShield <span style={{ color: '#FDB913' }}>AI</span>
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Account Registration
          </p>
        </div>

        {/* Step 1: Role Picker Header */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.5rem' }}>
            1. Select Your Account Type
          </label>
          <div className="role-selection-grid">
            {rolesConfig.map(item => {
              const IconComp = item.icon;
              const isActive = role === item.key;
              return (
                <div
                  key={item.key}
                  className={`role-card ${isActive ? 'active' : ''}`}
                  onClick={() => handleRoleChange(item.key)}
                >
                  <div className="role-card-icon">
                    <IconComp size={20} />
                  </div>
                  <div className="role-card-title">{item.title}</div>
                  <div className="role-card-desc">{item.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="alert alert-success" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} color="#10b981" />
            <span>{success}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
            <Lock size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '-0.25rem' }}>
            2. Enter Details for {currentRoleConfig.title}
          </label>

          {/* Student ID / Staff ID */}
          <div className="grid-2" style={{ gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="first_name">First Name</label>
              <input id="first_name" name="first_name" type="text" className="form-control"
                placeholder="e.g. Ama" value={formData.first_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="last_name">Last Name</label>
              <input id="last_name" name="last_name" type="text" className="form-control"
                placeholder="e.g. Mensah" value={formData.last_name} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid-2" style={{ gap: '0.75rem' }}>
            {isStaffRole && (
              <div className="form-group">
                <label className="form-label" htmlFor="title">Title</label>
                <select id="title" name="title" className="form-control" value={formData.title} onChange={handleChange}>
                  <option value="">Select title</option>
                  {['Dr.', 'Prof.', 'Mr.', 'Mrs.', 'Miss', 'Rev.', 'Eng.'].map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            )}
            <div className="form-group">
              <label className="form-label" htmlFor="other_name">Other Name <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
              <input id="other_name" name="other_name" type="text" className="form-control"
                placeholder="Middle name" value={formData.other_name} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="school_id">{currentRoleConfig.idLabel}</label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="school_id"
                name="school_id"
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.25rem' }}
                placeholder={currentRoleConfig.idPlaceholder}
                value={formData.school_id}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {role === 'STUDENT' && (
            <>
              <div className="grid-2" style={{ gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="department">College</label>
                  <select id="department" name="department" className="form-control" value={formData.department} onChange={handleChange} required>
                    <option value="">Select College</option>
                    <option value="COS">COS — College of Science</option>
                    <option value="CoE">CoE — College of Engineering</option>
                    <option value="CoHS">CoHS — College of Health Sciences</option>
                    <option value="CANR">CANR — College of Agriculture & Natural Resources</option>
                    <option value="CABE">CABE — College of Art & Built Environment</option>
                    <option value="CoHSS">CoHSS — College of Humanities & Social Sciences</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="program">Program of Study</label>
                  <input id="program" name="program" type="text" className="form-control"
                    placeholder="e.g. BSC. COMPUTER SCIENCE" value={formData.program} onChange={handleChange} required />
                </div>
              </div>
            </>
          )}

          {isStaffRole && (
            <div className="form-group">
              <label className="form-label" htmlFor="occupation">Occupation</label>
              <input id="occupation" name="occupation" type="text" className="form-control"
                placeholder="e.g. Lecturer, Research Assistant, Security Officer" value={formData.occupation} onChange={handleChange} required />
            </div>
          )}

          {['STAFF', 'ADMIN'].includes(role) && (
            <div className="form-group">
              <label className="form-label" htmlFor="department">Department</label>
              <div style={{ position: 'relative' }}>
                <Building size={15} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="department"
                  name="department"
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="e.g. Computer Science, Security Services"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {/* Email / KNUST Mail */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">{currentRoleConfig.emailLabel}</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                style={{ paddingLeft: '2.25rem' }}
                placeholder={currentRoleConfig.emailPlaceholder}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="password"
                name="password"
                type={showPw ? 'text' : 'password'}
                className="form-control"
                style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem' }}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
                aria-label="Toggle password visibility"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            style={{ marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? (
              <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Registering…</>
            ) : (
              `Register as ${currentRoleConfig.title}`
            )}
          </button>

          {/* Login Redirection */}
          <button
            type="button"
            className="btn btn-ghost btn-full"
            style={{ marginTop: '0.25rem', color: 'var(--text-primary)', background: 'transparent', borderColor: 'transparent', fontWeight: 600 }}
            onClick={() => navigate('/login')}
          >
            Already have an account? <span style={{ textDecoration: 'underline' }}>Sign In</span>
          </button>
        </form>
      </div>
    </div>
  );
}
