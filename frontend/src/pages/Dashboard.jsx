import { useEffect, useState } from 'react';
import {
  Sparkles,
  Wand2,
  ArrowRight,
  FileText,
  CheckCircle2,
  Layers,
  Share2,
  ShieldAlert,
  MonitorPlay,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, fmt, LABEL } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([api.get('/dashboard/stats'), api.get('/transformations')])
      .then(([statsData, transformations]) => {
        setStats(statsData);
        setRecent(transformations.slice(0, 5));
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="card" style={{ borderColor: 'var(--danger)', background: 'var(--danger-bg)' }}>
        <h3 style={{ color: 'var(--danger)' }}>Could not load dashboard data</h3>
        <p style={{ color: 'var(--danger)', fontSize: 13, margin: '4px 0 0' }}>
          {error}. Please check if the backend service is running.
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* HERO SECTION */}
      <section className="landing-hero">
        <div className="hero-content">
          <div className="hero-pill">
            <Sparkles size={14} />
            <span>SIH26154 • Intelligent Multi-Deliverable Transformation</span>
          </div>

          <h1 className="hero-title">
            One Source. Multiple Targeted Deliverables.
          </h1>

          <p className="hero-subtitle">
            Ingest articles, incident reports, or advisories and transform them into
            tailored executive summaries, LinkedIn posts, slide decks, and briefings —
            with deterministic quality validation.
          </p>

          <div className="hero-cta-group">
            <Link to="/new" className="primary-hero-button">
              <Wand2 size={17} />
              <span>Create New Transformation</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* METRICS STATS GRID */}
      <div className="stats-grid">
        {!stats ? (
          <>
            <div className="skel" />
            <div className="skel" />
            <div className="skel" />
            <div className="skel" />
          </>
        ) : (
          [
            ['Total Transformations', stats.total ?? 0, FileText],
            ['Completed Deliverables', stats.completed ?? 0, CheckCircle2],
            ['Outputs Generated', stats.outputs ?? 0, Sparkles],
            ['Configured Templates', stats.templates ?? 0, Layers],
          ].map(([label, val, Icon]) => (
            <div className="stat-card" key={label}>
              <div className="stat-icon">
                <Icon size={22} strokeWidth={1.9} />
              </div>
              <div className="stat-content">
                <strong>{val}</strong>
                <span>{label}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PIPELINE ARCHITECTURE (HOW IT WORKS) */}
      <div className="section-intro">
        <span className="section-eyebrow">PIPELINE ARCHITECTURE</span>
        <h2>How TransformAI Processes Content</h2>
        <p>
          An explainable, multi-stage pipeline that extracts structured semantics and synthesizes tailored communication deliverables.
        </p>
      </div>

      <div className="steps-grid">
        <div className="step-card">
          <div className="step-number">01</div>
          <div className="step-icon-wrapper">
            <FileText size={22} />
          </div>
          <h3>Source Ingestion & Extraction</h3>
          <p>
            Upload documents (PDF, DOCX, TXT) or raw text. Cleans whitespace, detects structure, and parses raw semantics.
          </p>
        </div>

        <div className="step-card">
          <div className="step-number">02</div>
          <div className="step-icon-wrapper">
            <Sparkles size={22} />
          </div>
          <h3>Context & Intent Analysis</h3>
          <p>
            Classifies intent, determines severity level, extracts domain keywords, and identifies key entities for target audiences.
          </p>
        </div>

        <div className="step-card">
          <div className="step-number">03</div>
          <div className="step-icon-wrapper">
            <CheckCircle2 size={22} />
          </div>
          <h3>Multi-Format Generation & Validation</h3>
          <p>
            Generates audience-tailored deliverables validated against quality thresholds, length constraints, and required fields.
          </p>
        </div>
      </div>

      {/* CAPABILITIES SECTION */}
      <div className="section-intro">
        <span className="section-eyebrow">CAPABILITIES</span>
        <h2>Supported Deliverable Formats</h2>
        <p>
          Produce high-quality communication artifacts configured for diverse stakeholder groups.
        </p>
      </div>

      <div className="capabilities-grid">
        <div className="capability-card">
          <div className="capability-icon-wrapper">
            <FileText size={20} />
          </div>
          <div className="capability-content">
            <h4>Executive Summaries & Briefings</h4>
            <p>
              High-level overviews with key takeaways, background, impact assessments, and decisions needed.
            </p>
          </div>
        </div>

        <div className="capability-card">
          <div className="capability-icon-wrapper">
            <Share2 size={20} />
          </div>
          <div className="capability-content">
            <h4>LinkedIn & Social Threads</h4>
            <p>
              Engaging, professional social posts with hooks, key points, call-to-actions, and relevant hashtags.
            </p>
          </div>
        </div>

        <div className="capability-card">
          <div className="capability-icon-wrapper">
            <ShieldAlert size={20} />
          </div>
          <div className="capability-content">
            <h4>Security & Incident Advisories</h4>
            <p>
              Formal alerts with severity scoring, vulnerability/threat details, and prioritized mitigation checklists.
            </p>
          </div>
        </div>

        <div className="capability-card">
          <div className="capability-icon-wrapper">
            <MonitorPlay size={20} />
          </div>
          <div className="capability-content">
            <h4>Slide Presentations</h4>
            <p>
              Structured decks with titles, bullet points, and speaker talking notes ready for slide software.
            </p>
          </div>
        </div>
      </div>

      {/* PRIVACY ASSURANCE BANNER */}
      <div className="privacy-banner-card">
        <div className="privacy-banner-icon">
          <Lock size={20} />
        </div>
        <div className="privacy-banner-text">
          <h3>Privacy-Conscious Architecture</h3>
          <p>
            <strong>Zero External Cloud Leakage in Demo Mode:</strong> Content is analyzed
            using a deterministic, local transformation engine. No sensitive source data is
            transmitted to unvetted third parties or external APIs without explicit configuration.
          </p>
        </div>
      </div>

      {/* RECENT TRANSFORMATIONS TABLE */}
      <div className="card">
        <div className="card-title">
          <span>Recent Transformations</span>
          <Link to="/history" style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>
            View All History →
          </Link>
        </div>

        {!recent ? (
          <div className="skel" />
        ) : !recent.length ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
            <FileText size={36} strokeWidth={1.5} style={{ margin: '0 auto 10px', opacity: 0.6 }} />
            <p style={{ margin: 0, fontSize: 14 }}>No transformations generated yet.</p>
            <Link to="/new" className="btn primary sm" style={{ marginTop: 12 }}>
              Start your first transformation
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Source Title</th>
                  <th>Source Type</th>
                  <th>Deliverables</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{item.sourceTitle}</strong>
                    </td>
                    <td>
                      <span className="output-tag" style={{ textTransform: 'capitalize' }}>
                        {item.sourceType}
                      </span>
                    </td>
                    <td>
                      {item.selectedOutputs.map((outKey) => (
                        <span key={outKey} className="output-tag">
                          {LABEL[outKey] || outKey}
                        </span>
                      ))}
                    </td>
                    <td>
                      <span className={`badge badge-${item.status}`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                      {fmt(item.createdAt)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to={`/history/${item._id}`} className="btn sm">
                        <span>Open</span>
                        <ExternalLink size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
