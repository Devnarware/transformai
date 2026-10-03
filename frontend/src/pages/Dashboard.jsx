import { useState } from 'react';
import {
  Sparkles,
  Wand2,
  ArrowRight,
  UploadCloud,
  Layers,
  Share2,
  ShieldAlert,
  MonitorPlay,
  FileText,
  Copy,
  Check,
  CheckCircle2,
  Sliders,
  FolderLock,
  ArrowUpRight,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SAMPLE_TEXTS = {
  phishing: {
    title: 'Critical Phishing & Credential Harvester Campaign',
    category: 'Cybersecurity Threat',
    text: `Security operations have observed a sharp 42% escalation in advanced spear-phishing campaigns targeting enterprise authentication portals. Attackers deploy lookalike domains hosting reverse-proxy frameworks capable of intercepting session tokens and bypassing legacy MFA implementations.

Analysis indicates credential harvesting kits leverage urgency-themed subject lines imitating urgent payroll verification and IT compliance deadlines. Over 18 compromised enterprise accounts were weaponized within four hours to attempt lateral spear-phishing across supply-chain vendors.

Organizations must enforce FIDO2 WebAuthn-based phishing-resistant hardware keys, inspect external SPF/DKIM/DMARC telemetry, and restrict single-factor emergency access routes immediately.`,
  },
  ai_platform: {
    title: 'Decentralized Deterministic AI Transformation Release',
    category: 'Product Launch',
    text: `TransformAI today released its v1.0 deterministic multi-deliverable synthesis architecture, enabling security analysts and editorial teams to convert long-form intelligence into structured communication artifacts without cloud retention.

The engine leverages in-memory multi-stage semantic extraction to analyze intent, severity vectors, and entity relationships. From a single input document, it instantaneously compiles executive briefings, stakeholder slide structures, social threads, and operational mitigation checklists with audited provenance.

All computation executes locally with zero telemetry leakage, guaranteeing enterprise compliance across strict privacy regulations.`,
  },
  policy_memo: {
    title: 'Remote Workforce Compliance & Access Guidelines',
    category: 'Executive Policy',
    text: `To protect organizational infrastructure against credential leakage and unmanaged device risk, executive leadership has updated standard operating procedures for distributed staff effective immediately.

All personnel must access internal microservices through zero-trust network access (ZTNA) gateways with device posture verification. Personal devices may no longer store sensitive customer telemetry or cryptographic credentials in local storage.

Non-compliant endpoints will be restricted from internal code repositories and collaborative workspace databases until identity and security compliance verification is complete.`,
  },
};

export default function Dashboard() {
  const [selectedSample, setSelectedSample] = useState('phishing');
  const [inputText, setInputText] = useState(SAMPLE_TEXTS.phishing.text);
  const [activeTab, setActiveTab] = useState('summary');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Instant local synthesis logic for the playground
  const generatePreview = () => {
    const isSecurity = inputText.toLowerCase().includes('phishing') || inputText.toLowerCase().includes('security');
    const isProduct = inputText.toLowerCase().includes('transformai') || inputText.toLowerCase().includes('release');

    return {
      summary: {
        title: 'Executive Briefing',
        badge: 'High Impact',
        content: `• Executive Context: Analysis of ingested intelligence reveals significant operational urgency requiring leadership attention.
• Core Finding: ${inputText.slice(0, 160)}...
• Risk Assessment: Medium to High exposure if mitigation procedures are not executed within standard operational windows.
• Recommended Directive: Mandate immediate audit of impacted assets, enforce strict access protocols, and notify responsible stakeholders.`,
      },
      linkedin: {
        title: 'LinkedIn Stakeholder Post',
        badge: 'Engaging',
        content: `🚨 Key Intelligence Update: Protecting operations against emerging vector shifts.

Here are the 3 critical takeaways from the latest operational analysis:

1️⃣ Attack vectors continue evolving: Urgency and impersonation remain primary attack vectors.
2️⃣ Session integrity is critical: Traditional controls must be reinforced with modern zero-trust safeguards.
3️⃣ Proactive posture matters: Continuous audits and structured stakeholder communication prevent lateral spread.

How is your team responding to these vector changes?

#CyberSecurity #EnterpriseRisk #InformationSecurity #Leadership #BestPractices`,
      },
      advisory: {
        title: 'Incident & Threat Advisory',
        badge: isSecurity ? 'Severity: Critical' : 'Severity: Medium',
        content: `ADVISORY ID: ADV-${new Date().getFullYear()}-094
STATUS: ACTIVE MITIGATION
SEVERITY: ${isSecurity ? 'HIGH (CVSS 8.2)' : 'MEDIUM (CVSS 5.4)'}

THREAT DESCRIPTION:
Targeted activity targeting authentication endpoints and identity providers. Attackers exploit operational urgency to bypass standard verification channels.

IMMEDIATE MITIGATION ACTIONS:
[1] Revoke unverified active session tokens and enforce re-authentication.
[2] Restrict external administrative access points behind zero-trust proxies.
[3] Review telemetry logs for anomalous credential reuse patterns.`,
      },
      presentation: {
        title: 'Slide Presentation Outline',
        badge: '3 Slides',
        content: `SLIDE 1: Situation Assessment & Context
• Overview of recent incident telemetry and operational findings.
• Observed impact across core business workflows and identity services.
Speaker Notes: Emphasize the rapid 42% escalation and importance of immediate awareness.

SLIDE 2: Core Vulnerabilities & Exposure Vectors
• Analysis of entry points and credential bypass mechanisms.
• Vendor supply chain exposure and lateral risk propagation.
Speaker Notes: Walk through the timeline from initial access to lateral movement.

SLIDE 3: Action Plan & Remediation Roadmap
• Immediate 24-hour containment directives.
• Long-term architectural safeguards and posture hardening.
Speaker Notes: Secure leadership approval for FIDO2 rollouts and policy updates.`,
      },
    };
  };

  const deliverables = generatePreview();

  const handleSelectSample = (key) => {
    setSelectedSample(key);
    setInputText(SAMPLE_TEXTS[key].text);
  };

  const handleSynthesize = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
    }, 350);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="landing-container">
      {/* FLOATING TOP PILL NAV (MiniFolio Style) */}
      <nav className="floating-pill-nav" aria-label="Main Navigation">
        <div className="nav-pill-brand">
          <div className="nav-brand-icon">
            <Sparkles size={16} />
          </div>
          <span className="nav-brand-title">TransformAI</span>
        </div>

        <div className="nav-pill-center">
          <a href="#playground" className="nav-pill-link">Playground</a>
          <a href="#how-it-works" className="nav-pill-link">Process</a>
          <a href="#capabilities" className="nav-pill-link">Deliverables</a>
          <Link to="/templates" className="nav-pill-link">Templates</Link>
          <Link to="/history" className="nav-pill-link">History</Link>
        </div>

        <div className="nav-pill-actions">
          <Link to="/new" className="nav-pill-button">
            <span>Start Transforming</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="minifolio-hero">
        <div className="hero-eyebrow-pill">
          <Sparkles size={13} />
          <span>Local-first • Deterministic Multi-Deliverable Transformation</span>
        </div>

        <h1 className="hero-headline">
          <span className="headline-dark">Transform content.</span>
          <span className="headline-orange">Store nothing.</span>
        </h1>

        <p className="hero-description">
          An editorial, browser-first multi-deliverable transformation engine.
          Convert security advisories, articles, and incident reports into tailored
          executive summaries, briefings, social threads, and presentations with zero cloud data retention.
        </p>

        <div className="hero-actions-row">
          <Link to="/new" className="pill-btn pill-btn-primary">
            <Wand2 size={16} />
            <span>Start Transforming</span>
            <ArrowRight size={15} />
          </Link>
          <a href="#playground" className="pill-btn pill-btn-secondary">
            <span>Open Playground</span>
          </a>
        </div>
      </section>

      {/* PLAYGROUND SECTION (Try TransformAI Live) */}
      <section id="playground" className="minifolio-section alt-surface">
        <div className="section-header-center">
          <span className="section-badge">PLAYGROUND</span>
          <h2 className="section-title">Try TransformAI Live</h2>
          <p className="section-subtitle">
            Select a sample scenario or type your own source content to experience instant multi-deliverable synthesis.
          </p>
        </div>

        <div className="playground-wrapper">
          {/* Preset Selector Chips */}
          <div className="playground-presets-bar">
            <span className="playground-presets-label">Preset Scenarios:</span>
            {Object.entries(SAMPLE_TEXTS).map(([key, item]) => (
              <button
                key={key}
                type="button"
                className={`playground-chip ${selectedSample === key ? 'active' : ''}`}
                onClick={() => handleSelectSample(key)}
              >
                <span>{item.title}</span>
              </button>
            ))}
          </div>

          <div className="playground-grid">
            {/* Input Column */}
            <div className="playground-input-pane">
              <div className="pane-header">
                <div className="pane-header-title">
                  <Terminal size={14} />
                  <span>Source Text</span>
                </div>
                <span className="pane-char-count">{inputText.length} characters</span>
              </div>
              <textarea
                className="playground-textarea"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste or write your source text here..."
                rows={11}
              />
              <div className="pane-footer">
                <span className="pane-engine-note">Runs locally in-memory • Zero server retention</span>
                <button
                  type="button"
                  className="playground-action-btn"
                  onClick={handleSynthesize}
                  disabled={isSynthesizing || !inputText.trim()}
                >
                  <RefreshCw size={13} className={isSynthesizing ? 'spin-icon' : ''} />
                  <span>{isSynthesizing ? 'Synthesizing...' : 'Re-Synthesize'}</span>
                </button>
              </div>
            </div>

            {/* Output Column */}
            <div className="playground-output-pane">
              <div className="pane-header output-tabs-header">
                <div className="output-tabs-group">
                  <button
                    type="button"
                    className={`output-tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
                    onClick={() => setActiveTab('summary')}
                  >
                    <FileText size={13} />
                    <span>Summary</span>
                  </button>
                  <button
                    type="button"
                    className={`output-tab-btn ${activeTab === 'linkedin' ? 'active' : ''}`}
                    onClick={() => setActiveTab('linkedin')}
                  >
                    <Share2 size={13} />
                    <span>LinkedIn</span>
                  </button>
                  <button
                    type="button"
                    className={`output-tab-btn ${activeTab === 'advisory' ? 'active' : ''}`}
                    onClick={() => setActiveTab('advisory')}
                  >
                    <ShieldAlert size={13} />
                    <span>Advisory</span>
                  </button>
                  <button
                    type="button"
                    className={`output-tab-btn ${activeTab === 'presentation' ? 'active' : ''}`}
                    onClick={() => setActiveTab('presentation')}
                  >
                    <MonitorPlay size={13} />
                    <span>Slides</span>
                  </button>
                </div>

                <button
                  type="button"
                  className="copy-tab-button"
                  onClick={() => handleCopy(deliverables[activeTab].content)}
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="pane-result-card">
                <div className="result-card-top">
                  <strong>{deliverables[activeTab].title}</strong>
                  <span className="result-pill-badge">{deliverables[activeTab].badge}</span>
                </div>
                <div className="result-card-body">
                  <pre className="result-formatted-text">{deliverables[activeTab].content}</pre>
                </div>
              </div>

              <div className="playground-footer-action">
                <Link to="/new" className="launch-full-pipeline-link">
                  <span>Open Full Multi-Stage Pipeline Wizard</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TRANSFORMAI WORKS (MiniFolio 3-Card Process) */}
      <section id="how-it-works" className="minifolio-section">
        <div className="section-header-center">
          <span className="section-badge">PROCESS</span>
          <h2 className="section-title">How TransformAI Works</h2>
          <p className="section-subtitle">
            From ingestion to tailored deliverables, everything executes ephemerally in a few simple steps.
          </p>
        </div>

        <div className="process-cards-grid">
          {/* Card 1: Ingestion */}
          <div className="process-card">
            <div className="card-mockup-area upload-mockup">
              <div className="dashed-drop-box">
                <div className="drop-icon-circle">
                  <UploadCloud size={20} />
                </div>
                <strong className="drop-title">Choose file or paste text</strong>
                <span className="drop-hint">Article, Advisory, Incident Report</span>
              </div>
              <div className="mockup-file-tags">
                <span className="file-chip active">TEXT</span>
                <span className="file-chip">DOCX</span>
                <span className="file-chip">PDF</span>
                <span className="file-limit">Zero Leakage</span>
              </div>
            </div>
            <div className="process-card-content">
              <h3>Ingest source content</h3>
              <p>
                Submit any raw text, policy report, or technical bulletin. The engine normalizes
                whitespace and parses structural semantics ephemerally.
              </p>
            </div>
          </div>

          {/* Card 2: Semantic Engine (MiniFolio Signature Orange Card) */}
          <div className="process-card">
            <div className="card-mockup-area orange-folder-mockup">
              <div className="folder-inner-content">
                <div className="folder-top-row">
                  <div className="folder-label-group">
                    <Sliders size={18} />
                    <strong>Transformation Engine</strong>
                  </div>
                  <span className="folder-pill-tag">3 Stages</span>
                </div>
                <div className="folder-checks-list">
                  <div className="folder-check-item">
                    <span className="check-bullet">✓</span>
                    <span>Semantic Intent & Entity Extraction</span>
                  </div>
                  <div className="folder-check-item">
                    <span className="check-bullet">✓</span>
                    <span>Tone & Audience Adaptation</span>
                  </div>
                  <div className="folder-check-item">
                    <span className="check-bullet">✓</span>
                    <span>Deterministic Format Constraints</span>
                  </div>
                </div>
                <div className="folder-bottom-tag">
                  <span>IN-MEMORY SECURE PIPELINE</span>
                </div>
              </div>
            </div>
            <div className="process-card-content">
              <h3>Run multi-stage synthesis</h3>
              <p>
                Our engine classifies severity, extracts domain keywords, and identifies key entities
                for distinct audience tiers simultaneously.
              </p>
            </div>
          </div>

          {/* Card 3: Explainable Verdict */}
          <div className="process-card">
            <div className="card-mockup-area summary-mockup">
              <div className="summary-header-row">
                <span className="summary-title">Audit Overview</span>
                <span className="summary-score">READY (100%)</span>
              </div>
              <div className="summary-progress-bars">
                <div className="summary-bar-group">
                  <div className="bar-labels">
                    <span>Format Compliance</span>
                    <strong className="text-success">Validated</strong>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill fill-green" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div className="summary-bar-group">
                  <div className="bar-labels">
                    <span>Quality Scoring</span>
                    <strong className="text-success">94% Pass</strong>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill fill-orange" style={{ width: '94%' }}></div>
                  </div>
                </div>
                <div className="summary-bar-group">
                  <div className="bar-labels">
                    <span>Server Retention</span>
                    <strong className="text-neutral">0 KB Saved</strong>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill fill-dark" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="process-card-content">
              <h3>Receive explainable deliverables</h3>
              <p>
                Inspect structured executive summaries, social posts, and presentation decks
                ready to publish or export with full auditability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES */}
      <section id="capabilities" className="minifolio-section alt-surface">
        <div className="section-header-center">
          <span className="section-badge">CAPABILITIES</span>
          <h2 className="section-title">Supported Deliverable Formats</h2>
          <p className="section-subtitle">
            Synthesize high-fidelity communication artifacts configured for diverse stakeholder groups.
          </p>
        </div>

        <div className="capabilities-grid">
          <div className="capability-card">
            <div className="capability-icon">
              <FileText size={20} />
            </div>
            <h4>Executive Summaries & Briefings</h4>
            <p>
              High-level overviews with key takeaways, background context, impact assessments, and decisions needed.
            </p>
          </div>

          <div className="capability-card">
            <div className="capability-icon">
              <Share2 size={20} />
            </div>
            <h4>LinkedIn & Social Threads</h4>
            <p>
              Engaging, professional social posts with hooks, key points, call-to-actions, and relevant industry hashtags.
            </p>
          </div>

          <div className="capability-card">
            <div className="capability-icon">
              <ShieldAlert size={20} />
            </div>
            <h4>Security & Incident Advisories</h4>
            <p>
              Formal alerts with severity scoring, vulnerability vectors, and prioritized mitigation action checklists.
            </p>
          </div>

          <div className="capability-card">
            <div className="capability-icon">
              <MonitorPlay size={20} />
            </div>
            <h4>Slide Presentations & Talking Notes</h4>
            <p>
              Structured slide outlines with titles, clear bullet points, and speaker talking notes ready for keynote presentations.
            </p>
          </div>
        </div>
      </section>

      {/* PRIVACY & ZERO RETENTION BANNER */}
      <section className="minifolio-section">
        <div className="privacy-highlight-card">
          <div className="privacy-highlight-icon">
            <FolderLock size={28} />
          </div>
          <div className="privacy-highlight-text">
            <h3>Zero Document Retention Guaranteed</h3>
            <p>
              Source documents are processed ephemerally in volatile memory and immediately purged upon request completion.
              TransformAI maintains no tracking database, retains no document copies, and executes zero external cloud calls in local mode.
            </p>
          </div>
        </div>
      </section>

      {/* EDITORIAL FOOTER */}
      <footer className="minifolio-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Sparkles size={16} />
            <span>TransformAI Multi-Deliverable Engine</span>
          </div>
          <p className="footer-copyright">
            Privacy-first multi-format content synthesis. Zero source documents stored.
          </p>
          <div className="footer-links">
            <Link to="/new" className="footer-link">
              Start Transforming
            </Link>
            <Link to="/templates" className="footer-link">
              Templates
            </Link>
            <Link to="/history" className="footer-link">
              History
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
