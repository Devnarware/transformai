import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Plus,
  Trash2,
  ArrowRight,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { api, toast, OUTS } from '../api';

export default function Templates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [selectedOutputs, setSelectedOutputs] = useState(['summary', 'linkedin']);
  const [creating, setCreating] = useState(false);

  const loadTemplates = () => {
    api
      .get('/templates')
      .then(setTemplates)
      .catch((err) => toast(err.message));
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleCreate = async () => {
    if (!templateName.trim() || !selectedOutputs.length) return;
    try {
      setCreating(true);
      const currentSettings = await api.get('/settings');
      await api.post('/templates', {
        name: templateName.trim(),
        selectedOutputs,
        settings: currentSettings,
      });
      setTemplateName('');
      toast('Template preset created successfully');
      loadTemplates();
    } catch (err) {
      toast(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (tpl) => {
    if (!window.confirm(`Delete template preset "${tpl.name}"?`)) return;
    try {
      await api.del('/templates/' + tpl._id);
      toast('Template deleted');
      loadTemplates();
    } catch (err) {
      toast(err.message);
    }
  };

  const toggleOutput = (key) => {
    setSelectedOutputs((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  return (
    <div className="templates-page">
      <div className="section-header-row">
        <div>
          <span className="section-eyebrow">PRESETS & AUTOMATION</span>
          <h1 className="page-title">Deliverable Templates</h1>
          <p className="page-subtitle">
            Configure reusable deliverable bundles and parameter presets for rapid transformation workflows.
          </p>
        </div>
      </div>

      {/* CREATE TEMPLATE CARD */}
      <div className="card">
        <h3 className="card-title">Create Template Preset</h3>

        <div style={{ marginBottom: 14 }}>
          <label>Template Name</label>
          <input
            type="text"
            placeholder="e.g. Executive & Social Briefing Pack"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label>Select Target Deliverables</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
            {OUTS.map(([key, name]) => {
              const isChecked = selectedOutputs.includes(key);
              return (
                <button
                  type="button"
                  key={key}
                  className={`source-pill-btn ${isChecked ? 'active' : ''}`}
                  onClick={() => toggleOutput(key)}
                  style={{ padding: '6px 12px', fontSize: 12 }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                    style={{ margin: 0, width: 'auto' }}
                  />
                  <span>{name}</span>
                </button>
              );
            })}
          </div>
          <span style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'block', marginTop: 6 }}>
            Presets automatically inherit your current default settings (audience, tone, language).
          </span>
        </div>

        <button
          type="button"
          className="btn primary"
          disabled={!templateName.trim() || !selectedOutputs.length || creating}
          onClick={handleCreate}
        >
          <Plus size={15} strokeWidth={2.2} />
          <span>Save Template Preset</span>
        </button>
      </div>

      {/* EXISTING TEMPLATES GRID */}
      <div>
        <h3 style={{ fontSize: 16, marginBottom: 14 }}>Saved Presets</h3>

        {!templates ? (
          <div className="form-grid">
            <div className="skel" />
            <div className="skel" />
          </div>
        ) : !templates.length ? (
          <div className="card" style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-muted)' }}>
            <Layers size={36} strokeWidth={1.5} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: 13.5 }}>No templates configured yet. Create one above to get started.</p>
          </div>
        ) : (
          <div className="form-grid">
            {templates.map((tpl) => (
              <div key={tpl._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <h4 style={{ fontSize: 15, margin: 0 }}>{tpl.name}</h4>
                  <button
                    type="button"
                    className="btn sm danger"
                    onClick={() => handleDelete(tpl)}
                    title="Delete template"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <div style={{ marginBottom: 12, flex: 1 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                    Outputs ({tpl.selectedOutputs.length}):
                  </span>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {tpl.selectedOutputs.map((outKey) => (
                      <span key={outKey} className="output-tag">
                        {outKey}
                      </span>
                    ))}
                  </div>

                  {tpl.settings && (
                    <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--text-secondary)' }}>
                      Audience: <strong>{tpl.settings.audience || 'General'}</strong> • Tone: <strong>{tpl.settings.tone || 'Standard'}</strong>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="btn primary sm"
                  style={{ width: '100%', marginTop: 'auto' }}
                  onClick={() => navigate('/new', { state: { template: tpl } })}
                >
                  <span>Use This Template</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
