import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FileText,
  Copy,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  LayoutDashboard,
  Share2,
  ShieldAlert,
  MonitorPlay,
  Layout,
  Video,
  ExternalLink,
} from 'lucide-react';
import { api, toast, download, LABEL } from '../api';
import OutputView, { toText } from '../components/OutputView';

const XIcon = ({ size = 15, color = 'currentColor', ...props }) => (
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

export default function Detail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);
  const [regenerating, setRegenerating] = useState(false);

  const loadTransformation = () => {
    api
      .get('/transformations/' + id)
      .then(setData)
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    loadTransformation();
  }, [id]);

  if (error) {
    return (
      <div className="card" style={{ borderColor: 'var(--danger)', background: 'var(--danger-bg)' }}>
        <h3 style={{ color: 'var(--danger)' }}>Could not load transformation</h3>
        <p style={{ color: 'var(--danger)', fontSize: 13, margin: '4px 0 12px' }}>{error}</p>
        <Link to="/history" className="btn sm">
          <ArrowLeft size={13} />
          <span>Return to History</span>
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ maxWidth: 1000 }}>
        <div className="skel" />
        <div className="skel" style={{ height: 200 }} />
      </div>
    );
  }

  const currentOutput = data.generatedOutputs.find((x) => x.type === activeTab);

  const handleCopy = async () => {
    if (!currentOutput) return;
    try {
      const fullText = `${currentOutput.title}\n\n${toText(currentOutput.content)}`;
      await navigator.clipboard.writeText(fullText);
      toast('Copied deliverable to clipboard');
    } catch {
      toast('Unable to copy to clipboard');
    }
  };

  const handleRegenerate = async () => {
    if (!currentOutput || regenerating) return;
    try {
      setRegenerating(true);
      await api.post(`/transformations/${id}/regenerate`, { type: activeTab });
      toast(`Regenerated ${LABEL[activeTab] || activeTab}`);
      loadTransformation();
    } catch (err) {
      toast(err.message);
    } finally {
      setRegenerating(false);
    }
  };

  const handleExport = async (format) => {
    if (!currentOutput) return;
    try {
      const blob = await api.exportOut(id, activeTab, format);
      download(blob, `${data.sourceTitle || 'transformation'}-${activeTab}.${format === 'json' ? 'json' : 'txt'}`);
      toast(`Exported .${format}`);
    } catch (err) {
      toast(err.message);
    }
  };

  return (
    <div className="detail-page">
      <div style={{ marginBottom: 12 }}>
        <Link
          to="/history"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 12.5,
            color: 'var(--primary)',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={14} />
          <span>Back to History</span>
        </Link>
      </div>

      <div className="section-header-row">
        <div>
          <span className="section-eyebrow">TRANSFORMATION RUN</span>
          <h1 className="page-title">{data.sourceTitle}</h1>
          <p className="page-subtitle">
            {data.generatedOutputs.length} deliverables generated • Source: {data.sourceType || 'Text'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className={`badge badge-${data.status}`}>
            {data.status.toUpperCase()}
          </span>
          <span className="output-tag" style={{ margin: 0 }}>
            {data.settings?.engine || 'Local Engine'}
          </span>
        </div>
      </div>

      {/* DELIVERABLE TABS BAR */}
      <div className="deliverable-tabs">
        <button
          type="button"
          className={`deliverable-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <LayoutDashboard size={15} />
          <span>Overview</span>
        </button>

        {data.generatedOutputs.map((out) => {
          const Icon = OUT_ICONS[out.type] || FileText;
          return (
            <button
              key={out.type}
              type="button"
              className={`deliverable-tab-btn ${activeTab === out.type ? 'active' : ''}`}
              onClick={() => setActiveTab(out.type)}
            >
              <Icon size={15} />
              <span>{LABEL[out.type] || out.type}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' || !currentOutput ? (
        <div>
          {/* APPLIED PARAMETERS */}
          <div className="card">
            <h3 className="card-title">Applied Parameters</h3>
            <div className="form-grid">
              {Object.entries(data.settings || {}).map(([key, val]) => (
                <div
                  key={key}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border)',
                    borderRadius: 7,
                    padding: '10px 14px',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: 2,
                    }}
                  >
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>
                    {String(val)}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          {/* CONTEXT ANALYSIS */}
          {data.analysis && (
            <div className="card">
              <h3 className="card-title">Context & Semantic Analysis</h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 7, border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>Detected Intent</span>
                  <strong style={{ fontSize: 14 }}>{data.analysis.intent}</strong>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 7, border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>Severity / Risk</span>
                  <span
                    className={`badge badge-${
                      data.analysis.severity === 'high'
                        ? 'failed'
                        : data.analysis.severity === 'medium'
                        ? 'queued'
                        : 'completed'
                    }`}
                    style={{ marginTop: 2 }}
                  >
                    {(data.analysis.severity || 'low').toUpperCase()}
                  </span>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 7, border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>Word Count</span>
                  <strong style={{ fontSize: 14 }}>{data.analysis.wordCount} words</strong>
                </div>
              </div>

              {data.analysis.keywords?.length > 0 && (
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                    Identified Keywords:
                  </span>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {data.analysis.keywords.map((kw) => (
                      <span key={kw} className="output-tag" style={{ margin: 0 }}>
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* QUALITY VALIDATION */}
          <div className="card">
            <h3 className="card-title">Quality Validation Breakdown</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 12.5, margin: '0 0 14px' }}>
              Each output format is verified against length, required fields, and structural rules.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.generatedOutputs.map((out) => {
                const passed = out.metadata?.validation?.passed;
                const issues = out.metadata?.validation?.issues || [];
                return (
                  <div
                    key={out.type}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: passed ? '#fbfdfb' : '#fff9f9',
                      border: `1px solid ${passed ? '#dbeee0' : '#fed7d7'}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {passed ? (
                        <CheckCircle2 size={18} color="var(--success)" />
                      ) : (
                        <AlertTriangle size={18} color="var(--danger)" />
                      )}
                      <div>
                        <strong style={{ fontSize: 13 }}>{out.title}</strong>
                        <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                          v{out.version} • {LABEL[out.type] || out.type}
                        </span>
                      </div>
                    </div>

                    <div>
                      {passed ? (
                        <span className="badge badge-completed">VALIDATED</span>
                      ) : (
                        <span className="badge badge-failed">{issues.join(', ')}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: SPECIFIC DELIVERABLE VIEW */
        <div className="card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingBottom: 14,
              borderBottom: '1px solid var(--border)',
              marginBottom: 16,
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <h2 style={{ fontSize: 18, marginBottom: 4 }}>{currentOutput.title}</h2>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Version {currentOutput.version} • Engine: {currentOutput.metadata?.engine || 'Local Transformation Engine'}
                {currentOutput.metadata?.note ? ` • ${currentOutput.metadata.note}` : ''}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" className="btn sm" onClick={handleCopy} title="Copy text content">
                <Copy size={13} />
                <span>Copy</span>
              </button>

              <button
                type="button"
                className="btn sm"
                disabled={regenerating}
                onClick={handleRegenerate}
                title="Regenerate this deliverable"
              >
                <RefreshCw size={13} className={regenerating ? 'spin-icon' : ''} />
                <span>Regenerate</span>
              </button>

              <button type="button" className="btn sm" onClick={() => handleExport('txt')}>
                <Download size={13} />
                <span>Export .txt</span>
              </button>

              <button type="button" className="btn sm" onClick={() => handleExport('json')}>
                <Download size={13} />
                <span>Export .json</span>
              </button>
            </div>
          </div>

          <div className="content-display-box">
            <OutputView v={currentOutput.content} />
          </div>
        </div>
      )}
    </div>
  );
}
