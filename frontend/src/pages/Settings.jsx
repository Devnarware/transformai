import { useEffect, useState } from 'react';
import {
  Save,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Database,
  ShieldCheck,
} from 'lucide-react';
import { api, toast, OPT } from '../api';

export default function Settings({ health }) {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/settings')
      .then(setSettings)
      .catch((err) => toast(err.message));
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await api.put('/settings', settings);
      setSettings(updated);
      toast('Default settings saved successfully');
    } catch (err) {
      toast(err.message);
    } finally {
      setSaving(false);
    }
  };

  const isOnline = health?.status === 'ok';

  return (
    <div className="settings-page">
      <div className="section-header-row">
        <div>
          <span className="section-eyebrow">CONFIGURATION</span>
          <h1 className="page-title">Transformation Settings</h1>
          <p className="page-subtitle">
            Configure default parameters for new transformations and inspect system engine health.
          </p>
        </div>
      </div>

      {/* PARAMETERS CONFIGURATION */}
      <div className="card">
        <h3 className="card-title">Default Generation Parameters</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 }}>
          These defaults are applied automatically whenever you create a new transformation.
        </p>

        {!settings ? (
          <div className="skel" />
        ) : (
          <div className="form-grid" style={{ marginBottom: 20 }}>
            {Object.entries(OPT).map(([key, options]) => (
              <div key={key}>
                <label>Default {key.replace(/([A-Z])/g, ' $1')}</label>
                <select
                  value={settings[key] || options[0]}
                  onChange={(e) =>
                    setSettings({ ...settings, [key]: e.target.value })
                  }
                >
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          className="btn primary"
          disabled={!settings || saving}
          onClick={handleSave}
        >
          <Save size={15} />
          <span>{saving ? 'Saving...' : 'Save Default Settings'}</span>
        </button>
      </div>

      {/* SYSTEM DIAGNOSTICS & ENGINE STATUS */}
      <div className="card">
        <h3 className="card-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Cpu size={18} color="var(--primary)" />
            <span>Engine & System Status</span>
          </span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              Backend Health
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`} />
              <strong style={{ fontSize: 14 }}>
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </strong>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              Database Datastore
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Database size={15} color="var(--primary)" />
              <strong style={{ fontSize: 14, textTransform: 'capitalize' }}>
                {health?.database || 'Local Store (dev)'}
              </strong>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              AI Transformation Engine
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={15} color="var(--primary)" />
              <strong style={{ fontSize: 14 }}>
                {health?.demoMode
                  ? 'Local Transformation Engine (Demo Mode)'
                  : health?.aiProvider || 'Configured AI Provider'}
              </strong>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 16,
            padding: '12px 14px',
            background: 'var(--primary-light)',
            borderRadius: 7,
            border: '1px solid #d0e4f5',
            fontSize: 12,
            color: 'var(--primary-dark)',
          }}
        >
          <strong>Security Note:</strong> The active AI inference model is governed by <code>AI_PROVIDER</code> on the server environment. API keys and credentials are never sent to or stored within the client frontend.
        </div>
      </div>
    </div>
  );
}
