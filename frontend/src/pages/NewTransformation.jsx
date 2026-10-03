import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FileText,
  Upload,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  FileCheck,
  FileCode,
  Share2,
  ShieldAlert,
  MonitorPlay,
  Layout,
  Video,
  X,
} from 'lucide-react';
import { api, toast, OUTS, OPT, STAGES } from '../api';

const XIcon = ({ size = 16, color = 'currentColor', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const OUT_ICONS = {
  linkedin: Share2,
  twitter: XIcon,
  advisory: ShieldAlert,
  summary: FileText,
  infographic: Layout,
  presentation: MonitorPlay,
  video: Video,
};

export default function NewTransformation() {
  const navigate = useNavigate();
  const template = useLocation().state?.template;
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [tab, setTab] = useState('Text');
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [fileStatus, setFileStatus] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [selectedOutputs, setSelectedOutputs] = useState(
    template?.selectedOutputs || ['linkedin', 'summary', 'presentation']
  );
  const [settings, setSettings] = useState(template?.settings || {});
  const [stage, setStage] = useState(-1);

  useEffect(() => {
    if (!template) {
      api.get('/settings').then(setSettings).catch(() => {});
    }
  }, [template]);

  const handleFileUpload = async (f) => {
    if (!f) return;
    setFile(f);
    setUploading(true);
    setFileStatus('Extracting content...');
    try {
      const res = await api.upload(f);
      setText(res.text || '');
      setTitle(res.title || f.name.replace(/\.[^/.]+$/, ''));
      setFileStatus(`Extracted ${res.metadata?.characters || res.text.length} characters`);
      toast('Document parsed successfully');
    } catch (err) {
      setFileStatus('Extraction failed');
      toast(err.message);
    } finally {
      setUploading(false);
    }
  };

  const loadSample = async () => {
    try {
      const sample = await api.get('/sample');
      setText(sample.content);
      setTitle(sample.title);
      setTab('Text');
      toast('Loaded sample advisory report');
    } catch (err) {
      toast(err.message);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setFileStatus('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleOutput = (key) => {
    setSelectedOutputs((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleTransform = async () => {
    try {
      const { transformationId: id } = await api.post('/transform', {
        sourceContent: text,
        sourceTitle: title || undefined,
        sourceType: file ? 'document' : 'text',
        selectedOutputs,
        settings,
      });

      setStage(0);
      const pollTimer = setInterval(async () => {
        try {
          const res = await api.get('/transformations/' + id);
          setStage(res.stage);
          if (res.status === 'completed') {
            clearInterval(pollTimer);
            navigate('/history/' + id);
          }
          if (res.status === 'failed') {
            clearInterval(pollTimer);
            setStage(-1);
            toast(res.error || 'Transformation failed');
          }
        } catch (err) {
          clearInterval(pollTimer);
          setStage(-1);
          toast(err.message);
        }
      }, 600);
    } catch (err) {
      toast(err.message);
    }
  };

  // PROCESSING STAGE VIEW
  if (stage >= 0) {
    return (
      <div className="processing-card">
        <div className="processing-header">
          <div>
            <h2 style={{ fontSize: 18, marginBottom: 4 }}>Transformation in Progress</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 13 }}>
              Synthesizing content into {selectedOutputs.length} tailored deliverables.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)' }}>
            <Loader2 size={20} className="spin-icon" />
            <span style={{ fontSize: 12, fontWeight: 600 }}>Engine Active</span>
          </div>
        </div>

        <div className="stages-list">
          {STAGES.map((sName, idx) => {
            const isDone = idx < stage;
            const isCurrent = idx === stage;
            return (
              <div
                key={sName}
                className={`stage-item ${isDone ? 'completed' : isCurrent ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20 }}>
                  {isDone ? (
                    <CheckCircle2 size={18} color="var(--success)" />
                  ) : isCurrent ? (
                    <Loader2 size={18} className="spin-icon" color="var(--primary)" />
                  ) : (
                    <Clock size={16} color="var(--text-muted)" />
                  )}
                </div>
                <span>{sName}</span>
                {isCurrent && (
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--primary)', fontWeight: 600 }}>
                    In progress...
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="new-transformation-page">
      <div className="section-header-row">
        <div>
          <span className="section-eyebrow">TRANSFORMATION PIPELINE</span>
          <h1 className="page-title">Create Multi-Deliverable Transformation</h1>
          <p className="page-subtitle">
            Provide source content, select target deliverables, and tune communication parameters.
          </p>
        </div>
      </div>

      {/* STEP INDICATOR BAR */}
      <div className="steps-bar">
        {[
          { num: 1, label: 'Source Ingestion' },
          { num: 2, label: 'Select Deliverables' },
          { num: 3, label: 'Parameters & Tuning' },
        ].map((s) => (
          <div
            key={s.num}
            className={`step-bar-item ${step === s.num ? 'active' : ''}`}
            onClick={() => s.num < step && setStep(s.num)}
            style={{ cursor: s.num < step ? 'pointer' : 'default' }}
          >
            <div className="step-bar-number">{s.num}</div>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: SOURCE INGESTION */}
      {step === 1 && (
        <div className="card">
          <div className="source-type-selector">
            {['Text', 'Document', 'Image', 'Video'].map((tName) => (
              <button
                key={tName}
                type="button"
                className={`source-pill-btn ${tab === tName ? 'active' : ''}`}
                onClick={() => setTab(tName)}
              >
                {tName === 'Text' && <FileCode size={15} />}
                {tName === 'Document' && <Upload size={15} />}
                {tName === 'Image' && <Layout size={15} />}
                {tName === 'Video' && <Video size={15} />}
                <span>{tName}</span>
              </button>
            ))}

            <button
              type="button"
              className="btn sm"
              style={{ marginLeft: 'auto' }}
              onClick={loadSample}
            >
              <FileCheck size={14} />
              <span>Use Sample Report</span>
            </button>
          </div>

          {tab === 'Text' && (
            <div>
              <div style={{ marginBottom: 14 }}>
                <label>Document Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Critical Infrastructure Cybersecurity Advisory"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: 8 }}>
                <label>Source Content (Article, Advisory, Incident Report, Policy)</label>
                <textarea
                  placeholder="Paste source text here (minimum 50 characters)..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
                <span>Minimum 50 characters required</span>
                <span style={{ fontWeight: 600, color: text.length >= 50 ? 'var(--success)' : 'var(--text-muted)' }}>
                  {text.length} characters
                </span>
              </div>
            </div>
          )}

          {tab === 'Document' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
              />

              <div
                className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  handleFileUpload(e.dataTransfer.files?.[0]);
                }}
              >
                <div className="upload-icon-box">
                  <Upload size={24} />
                </div>
                <strong>Click to browse or drag and drop document</strong>
                <span>Supports PDF, DOCX, or plain text (.txt) • Maximum 10 MB</span>
              </div>

              {file && (
                <div className="upload-status-bar">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FileText size={18} color="var(--primary)" />
                    <div>
                      <strong>{file.name}</strong>
                      <span style={{ marginLeft: 8, color: 'var(--text-secondary)', fontSize: 11 }}>
                        {(file.size / 1024).toFixed(1)} KB • {fileStatus}
                      </span>
                    </div>
                  </div>
                  <button type="button" className="btn sm danger" onClick={removeFile}>
                    <X size={12} />
                    <span>Remove</span>
                  </button>
                </div>
              )}

              {text && (
                <div style={{ marginTop: 14 }}>
                  <label>Extracted Text Preview ({text.length} characters)</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ minHeight: 140 }}
                  />
                </div>
              )}
            </div>
          )}

          {(tab === 'Image' || tab === 'Video') && (
            <div
              style={{
                background: 'var(--primary-light)',
                border: '1px solid #d0e4f5',
                borderRadius: 8,
                padding: '20px',
                textAlign: 'center',
                color: 'var(--primary-dark)',
              }}
            >
              <AlertCircle size={28} style={{ margin: '0 auto 8px', opacity: 0.8 }} />
              <h4 style={{ margin: '0 0 4px' }}>{tab} Ingestion Coming Soon</h4>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-secondary)' }}>
                OCR optical character recognition and audio/video transcription pipeline integration is scheduled for the next release. Please use Text or Document upload.
              </p>
            </div>
          )}

          <div style={{ marginTop: 22, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn primary"
              disabled={text.trim().length < 50 || uploading}
              onClick={() => setStep(2)}
            >
              <span>Continue to Deliverables</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT DELIVERABLES */}
      {step === 2 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
              {selectedOutputs.length} of {OUTS.length} deliverables selected
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn sm"
                onClick={() => setSelectedOutputs(OUTS.map((o) => o[0]))}
              >
                Select All
              </button>
              <button
                type="button"
                className="btn sm"
                onClick={() => setSelectedOutputs([])}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="deliverables-grid">
            {OUTS.map(([key, name, desc]) => {
              const Icon = OUT_ICONS[key] || FileText;
              const isSelected = selectedOutputs.includes(key);

              return (
                <div
                  key={key}
                  className={`deliverable-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleOutput(key)}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === ' ' && toggleOutput(key)}
                >
                  <div className="deliverable-card-header">
                    <h3>
                      <Icon size={16} color={isSelected ? 'var(--primary)' : 'var(--text-muted)'} />
                      <span>{name}</span>
                    </h3>
                    <div className="deliverable-checkbox">
                      {isSelected && <CheckCircle2 size={14} />}
                    </div>
                  </div>
                  <p>{desc}</p>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <button type="button" className="btn secondary" onClick={() => setStep(1)}>
              <ArrowLeft size={15} />
              <span>Back</span>
            </button>
            <button
              type="button"
              className="btn primary"
              disabled={!selectedOutputs.length}
              onClick={() => setStep(3)}
            >
              <span>Continue to Parameters</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PARAMETERS & SETTINGS */}
      {step === 3 && (
        <div>
          <div className="card">
            <h3 className="card-title">Communication Parameters</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 }}>
              Fine-tune the tone, target audience, and detail level across all generated deliverables.
            </p>

            <div className="form-grid">
              {Object.entries(OPT).map(([paramKey, options]) => (
                <div key={paramKey}>
                  <label>{paramKey.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())}</label>
                  <select
                    value={settings[paramKey] || options[0]}
                    onChange={(e) =>
                      setSettings({ ...settings, [paramKey]: e.target.value })
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
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <button type="button" className="btn secondary" onClick={() => setStep(2)}>
              <ArrowLeft size={15} />
              <span>Back</span>
            </button>
            <button type="button" className="btn primary" onClick={handleTransform}>
              <Sparkles size={16} />
              <span>Generate Deliverables</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
